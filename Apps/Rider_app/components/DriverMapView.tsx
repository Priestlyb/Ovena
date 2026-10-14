// components/DriverMapView.tsx
//
// ⚠️  Requires a custom dev client — will NOT work in Expo Go.
//   npx eas build --profile development --platform android
//   npx expo start --dev-client
//
// ── Camera trigger summary ──────────────────────────────────────────────────
//  northTrigger        — compass button: reset to north (bearing 0), no recenter
//  recenterTrigger     — location button: fly to driver, face north, flat pitch
//  pickupTrigger       — pick-up accepted: fitBounds driver ↔ restaurant
//  navigationModeTrigger — start delivery: tilt + rotate to match route bearing,
//                          zoom 17.5 on driver, then free control
//
//  All other times the camera is fully free — GPS updates NEVER move it.
// ───────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View, StyleSheet, Text,
  Alert, ActivityIndicator, Platform, Linking,
  TouchableOpacity,
} from "react-native";
import Mapbox, {
  MapView,
  Camera,
  UserLocation,
  ShapeSource,
  LineLayer,
  MarkerView,
} from "@rnmapbox/maps";
import type MapboxGL from "@rnmapbox/maps";
import * as Location from "expo-location";
import { useTheme } from "../context/ThemeContext";
import { IconSymbol } from "./ui/icon-symbol";

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoib3ZlbmFkZWxpdmVyeSIsImEiOiJjbW55Y2JsMGgwMGUxMnFxeTF2MXJvaHcyIn0.pFDsi3o2UryZ_nK10MEMow";

Mapbox.setAccessToken(MAPBOX_TOKEN);

const MAP_STYLE_LIGHT = "mapbox://styles/mapbox/streets-v12";
const MAP_STYLE_DARK  = "mapbox://styles/mapbox/dark-v11";

// Default zoom levels
const ZOOM_DEFAULT     = 14;   // idle / after recenter
const ZOOM_NAV         = 17.5; // navigation mode — 70 % more zoomed-in than 14

export interface Coordinate {
  latitude:  number;
  longitude: number;
}

interface DriverMapViewProps {
  destination?:              Coordinate | null;
  destinationLabel?:         string;
  onLocationUpdate?:         (coord: Coordinate) => void;
  /** Called whenever a new route is computed — gives parent the live ETA + distance */
  onRouteSummary?:           (summary: RouteSummary | null) => void;

  /** Compass button: reset map to face north, do NOT recenter on driver */
  northTrigger?:             number;
  /** Location button: fly to driver position, face north, flat pitch */
  recenterTrigger?:          number;
  /** Pick-up accepted: fitBounds to show driver ↔ restaurant */
  pickupTrigger?:            number;
  /**
   * Start delivery: tilt map, rotate to match first leg of route bearing,
   * zoom 17.5 on driver position, then free control.
   */
  navigationModeTrigger?:    number;
}

export interface RouteSummary {
  distance: string;
  duration: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function lineGeoJSON(coords: [number, number][]): GeoJSON.Feature<GeoJSON.LineString> {
  return { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: coords } };
}
function fmtDist(m: number) { return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`; }
function fmtTime(s: number) {
  const mins = Math.round(s / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60), r = mins % 60;
  return r > 0 ? `${h}h ${r}m` : `${h}h`;
}

/**
 * Returns the bearing in degrees (0 = north, clockwise) between two
 * [lng, lat] GeoJSON points. Used to orient the map to match the first
 * leg of the route when navigation mode activates.
 */
function bearingBetween(from: [number, number], to: [number, number]): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;

  const lat1 = toRad(from[1]);
  const lat2 = toRad(to[1]);
  const dLng = toRad(to[0] - from[0]);

  const x = Math.sin(dLng) * Math.cos(lat2);
  const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  return (toDeg(Math.atan2(x, y)) + 360) % 360;
}

// ── Component ────────────────────────────────────────────────────────────────

const DriverMapView: React.FC<DriverMapViewProps> = ({
  destination,
  destinationLabel = "Destination",
  onLocationUpdate,
  onRouteSummary,
  northTrigger          = 0,
  recenterTrigger       = 0,
  pickupTrigger         = 0,
  navigationModeTrigger = 0,
}) => {
  const { colors, isDark } = useTheme();
  const cameraRef = useRef<Camera>(null);
  const mapRef    = useRef<MapView>(null);

  const driverCoordRef = useRef<Coordinate | null>(null);
  const [driverCoord,   setDriverCoord]   = useState<Coordinate | null>(null);
  const [routeGeoJSON,  setRouteGeoJSON]  = useState<GeoJSON.Feature<GeoJSON.LineString> | null>(null);
  const [routeSummary,  setRouteSummary]  = useState<RouteSummary | null>(null);
  const [fetchingRoute, setFetchingRoute] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const hasDoneInitialFly = useRef(false);
  const lastDestRef       = useRef<Coordinate | null>(null);
  const routePointsRef    = useRef<[number, number][] | null>(null); // full polyline [lng,lat][]

  // ← ADD THIS BLOCK
  const cameraStateRef = useRef<{
    center: [number, number] | null;
    zoom: number;
    bearing: number;
    pitch: number;
  }>({ center: null, zoom: ZOOM_DEFAULT, bearing: 0, pitch: 0 });

  const handleCameraChanged = useCallback((state: any) => {
    const props = state?.properties;
    if (!props) return;
    if (props.center) cameraStateRef.current.center = props.center;
    if (typeof props.zoom === "number")    cameraStateRef.current.zoom    = props.zoom;
    if (typeof props.bearing === "number") cameraStateRef.current.bearing = props.bearing;
    if (typeof props.pitch === "number")   cameraStateRef.current.pitch   = props.pitch;
  }, []);
  // ← END ADD

  // Frozen initial coordinate — set once when the first GPS fix arrives.
  // Passed to <Camera> as a STATIC prop so it never changes after mount.
  // This is critical: if we passed driverCoord (state) to centerCoordinate,
  // every GPS update would re-render <Camera> with a new prop value and
  // Mapbox would animate back to the driver position automatically.
  const [initialCoord, setInitialCoord] = useState<[number, number] | null>(null);

  // ── Permission + initial fix ────────────────────────────────────────────
  useEffect(() => {
    let alive = true;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") { setLocationError("Location permission is required."); return; }

      const first = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      if (!alive) return;

      const coord: Coordinate = { latitude: first.coords.latitude, longitude: first.coords.longitude };
      driverCoordRef.current = coord;
      setDriverCoord(coord);
      onLocationUpdate?.(coord);

      if (!hasDoneInitialFly.current) {
        hasDoneInitialFly.current = true;
        // Freeze the initial coordinate as a static prop for <Camera>.
        // We never update this again — all subsequent camera movement is
        // done imperatively via cameraRef.current.setCamera().
        cameraStateRef.current.center = [coord.longitude, coord.latitude];
        setInitialCoord([coord.longitude, coord.latitude]);
      }
    })();
    return () => { alive = false; };
  }, []);

  // ── Fetch route when destination changes ────────────────────────────────
  useEffect(() => {
    if (!destination) {
      setRouteGeoJSON(null);
      setRouteSummary(null);
      onRouteSummary?.(null);
      lastDestRef.current = null;
      routePointsRef.current = null;
      return;
    }
    const changed =
      lastDestRef.current?.latitude  !== destination.latitude ||
      lastDestRef.current?.longitude !== destination.longitude;
    if (!changed) return;
    lastDestRef.current = destination;
    const origin = driverCoordRef.current;
    if (origin) fetchRoute(origin, destination);
  }, [destination?.latitude, destination?.longitude]);

  const fetchRoute = useCallback(async (origin: Coordinate, dest: Coordinate) => {
    setFetchingRoute(true);
    try {
      const coords = `${origin.longitude},${origin.latitude};${dest.longitude},${dest.latitude}`;
      const url =
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${coords}` +
        `?geometries=geojson&overview=full&steps=false&access_token=${MAPBOX_TOKEN}`;

      const res  = await fetch(url);
      const json = await res.json();
      if (!json.routes?.length) { console.warn("Directions:", json.message); return; }

      const lnglat: [number, number][] = json.routes[0].geometry.coordinates;
      routePointsRef.current = lnglat;
      setRouteGeoJSON(lineGeoJSON(lnglat));
      const summary: RouteSummary = {
        distance: fmtDist(json.routes[0].distance),
        duration: fmtTime(json.routes[0].duration),
      };
      setRouteSummary(summary);
      onRouteSummary?.(summary);
    } catch (err) {
      console.warn("fetchRoute:", err);
    } finally {
      setFetchingRoute(false);
    }
  }, []);

  // ── NORTH TRIGGER — reset bearing to 0, keep current map position ──────────
  // We query the map's current center and zoom first so the camera call is
  // complete. Passing only bearing/pitch with no center is unreliable in
  // @rnmapbox/maps and can be silently dropped.
  // ── NORTH TRIGGER — reset bearing to 0 only. Keeps position, zoom, and
  // pitch untouched (compass button rotates north, nothing else). ─────────
  useEffect(() => {
    if (northTrigger <= 0) return;
    const { center, pitch } = cameraStateRef.current;

    cameraRef.current?.setCamera({
      centerCoordinate:  center ?? initialCoord ?? undefined,
      
      pitch,
      animationDuration:  500,
      animationMode:      "easeTo",
    });
  }, [northTrigger]);
  
  // ── RECENTER TRIGGER — fly to driver position only. Bearing/pitch stay
  // exactly as the user last set them. ─────────────────────────────────────
  useEffect(() => {
    if (recenterTrigger <= 0) return;
    const c = driverCoordRef.current;
    if (!c) return;
    const { bearing, pitch } = cameraStateRef.current;

    cameraRef.current?.setCamera({
      centerCoordinate:  [c.longitude, c.latitude],
      zoomLevel:          ZOOM_DEFAULT,
      bearing,
      pitch,
      animationDuration:  700,
      animationMode:      "flyTo",
    });
  }, [recenterTrigger]);

  // ── PICKUP TRIGGER — fitBounds to show driver ↔ restaurant ──────────────
  useEffect(() => {
    if (pickupTrigger <= 0) return;

    const points = routePointsRef.current;
    if (points?.length) {
      // Route already fetched — fit to show it
      const lngs = points.map((p) => p[0]);
      const lats = points.map((p) => p[1]);
      cameraRef.current?.setCamera({
        bounds: {
          ne: [Math.max(...lngs), Math.max(...lats)],
          sw: [Math.min(...lngs), Math.min(...lats)],
          paddingTop:    100,
          paddingRight:   40,
          paddingBottom: 260,
          paddingLeft:    40,
        },
        bearing:           0,
        pitch:             0,
        animationDuration: 900,
        animationMode:     "flyTo",
      });
    } else {
      // Route not yet ready — zoom out to see driver + destination roughly
      const driver = driverCoordRef.current;
      if (driver && destination) {
        cameraRef.current?.setCamera({
          bounds: {
            ne: [Math.max(driver.longitude, destination.longitude) + 0.005, Math.max(driver.latitude, destination.latitude) + 0.005],
            sw: [Math.min(driver.longitude, destination.longitude) - 0.005, Math.min(driver.latitude, destination.latitude) - 0.005],
            paddingTop:    100,
            paddingRight:   40,
            paddingBottom: 260,
            paddingLeft:    40,
          },
          bearing:           0,
          pitch:             0,
          animationDuration: 900,
          animationMode:     "flyTo",
        });
      }
    }
  }, [pickupTrigger]);

  // ── NAVIGATION MODE TRIGGER — tilt, rotate to route bearing, zoom in ────
  // Fires when the driver presses "Start delivery".
  // 1. Calculate bearing from driver position toward first route segment
  // 2. Tilt the map to 45° so road ahead fills the top of the screen
  // 3. Rotate so the direction of travel faces up
  // 4. Zoom to ZOOM_NAV (17.5) centred on driver
  // After animation completes, the map is free to pan/rotate again.
  useEffect(() => {
    if (navigationModeTrigger <= 0) return;

    const driver = driverCoordRef.current;
    if (!driver) return;

    const points = routePointsRef.current;
    let bearing = 0;

    if (points && points.length >= 2) {
      // Use the first ~5 points to get a stable initial heading
      // (the very first segment can be tiny / noise)
      const lookAhead = Math.min(5, points.length - 1);
      bearing = bearingBetween(points[0], points[lookAhead]);
    }

    cameraRef.current?.setCamera({
      centerCoordinate:  [driver.longitude, driver.latitude],
      zoomLevel:          ZOOM_NAV,
      bearing,            // road ahead faces top of screen
      pitch:              45,  // tilted perspective — road stretches into horizon
      animationDuration:  1200,
      animationMode:      "flyTo",
    });
  }, [navigationModeTrigger]);

  // ── Waze deep-link ───────────────────────────────────────────────────────
  const handleOpenWaze = async () => {
    if (!destination) return;
    const wazeUrl = `https://waze.com/ul?ll=${destination.latitude},${destination.longitude}&navigate=yes`;
    const canOpen = await Linking.canOpenURL(wazeUrl);
    if (canOpen) { Linking.openURL(wazeUrl); return; }
    const fallback = Platform.OS === "ios"
      ? `maps://?daddr=${destination.latitude},${destination.longitude}&dirflg=d`
      : `google.navigation:q=${destination.latitude},${destination.longitude}`;
    Alert.alert("Waze Not Installed", "Open with your default maps app instead?", [
      { text: "Cancel", style: "cancel" },
      { text: "Open Maps", onPress: () => Linking.openURL(fallback) },
    ]);
  };

  // ── Error / loading states ───────────────────────────────────────────────
  if (locationError) {
    return (
      <View style={[styles.stateBox, { backgroundColor: colors.background }]}>
        <IconSymbol name="LocationArrowIcon" size={36} color={colors.textMuted} />
        <Text style={[styles.stateTitle, { color: colors.textPrimary }]}>Location unavailable</Text>
        <Text style={[styles.stateBody,  { color: colors.textSecondary }]}>{locationError}</Text>
      </View>
    );
  }
  if (!initialCoord) {
    return (
      <View style={[styles.stateBox, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accentOrange} />
        <Text style={[styles.stateBody, { color: colors.textSecondary, marginTop: 12 }]}>
          Finding your location…
        </Text>
      </View>
    );
  }

  // ── Map render ───────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <MapView
        ref={mapRef}
        onCameraChanged={handleCameraChanged}   // ← ADD THIS LINE
        style={StyleSheet.absoluteFill}
        styleURL={isDark ? MAP_STYLE_DARK : MAP_STYLE_LIGHT}
        minZoomLevel={8}
        maxZoomLevel={19}
        logoEnabled={false}
        attributionEnabled={false}
        compassEnabled={false}
        scaleBarEnabled={false}
      >
        {/*
          Camera — FULLY IMPERATIVE after mount.
          centerCoordinate uses the frozen initialCoord (set once, never updated).
          If we passed driverCoord here it would change on every GPS tick and
          Mapbox would animate back to the driver automatically.
          All camera movement after mount uses cameraRef.current.setCamera().
        */}
        <Camera
          ref={cameraRef}
          zoomLevel={ZOOM_DEFAULT}
          centerCoordinate={initialCoord}
          bearing={0}
          pitch={0}
          animationMode="none"
          animationDuration={0}
        />

        {/*
          UserLocation — sole real-time GPS source.
          onUpdate: updates ref + state for marker rendering only.
          NEVER calls setCamera — driver can pan freely.
        */}
        <UserLocation
          visible
          animated
          androidRenderMode="normal"
          onUpdate={(loc) => {
            const c: Coordinate = {
              latitude:  loc.coords.latitude,
              longitude: loc.coords.longitude,
            };
            driverCoordRef.current = c;
            setDriverCoord(c);
            onLocationUpdate?.(c);
          }}
        />

        {/* Branded driver dot — only rendered once we have a real position */}
        {driverCoord && (
          <MarkerView
            coordinate={[driverCoord.longitude, driverCoord.latitude]}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={[styles.driverPulse, { borderColor: colors.accentOrange }]}>
              <View style={[styles.driverDot, { backgroundColor: colors.accentOrange }]} />
            </View>
          </MarkerView>
        )}

        {/* Route polyline */}
        {routeGeoJSON && (
          <ShapeSource id="routeSource" shape={routeGeoJSON}>
            <LineLayer
              id="routeCasing"
              style={{ lineColor: isDark ? "#1C1C1E" : "#ffffff", lineWidth: 9, lineCap: "round", lineJoin: "round" }}
            />
            <LineLayer
              id="routeLine"
              aboveLayerID="routeCasing"
              style={{ lineColor: colors.accentOrange, lineWidth: 5, lineCap: "round", lineJoin: "round" }}
            />
          </ShapeSource>
        )}

        {/* Destination pin */}
        {destination && (
          <MarkerView coordinate={[destination.longitude, destination.latitude]} anchor={{ x: 0.5, y: 1 }}>
            <View style={styles.pin}>
              <View style={[styles.pinHead, { backgroundColor: colors.accentOrange }]}>
                <IconSymbol name="LocationArrowIcon" size={14} color="#fff" />
              </View>
              <View style={[styles.pinTail, { borderTopColor: colors.accentOrange }]} />
            </View>
          </MarkerView>
        )}
      </MapView>

      {/* Route info banner */}
      {routeSummary && destination && (
        <View style={[styles.banner, { backgroundColor: colors.card }]}>
          <View style={styles.bannerRow}>
            <View style={styles.bannerStat}>
              <Text style={[styles.bannerValue, { color: colors.textPrimary }]}>{routeSummary.duration}</Text>
              <Text style={[styles.bannerLabel, { color: colors.textMuted }]}>with traffic</Text>
            </View>
            <View style={[styles.bannerDivider, { backgroundColor: colors.separatorColor }]} />
            <View style={styles.bannerStat}>
              <Text style={[styles.bannerValue, { color: colors.textPrimary }]}>{routeSummary.distance}</Text>
              <Text style={[styles.bannerLabel, { color: colors.textMuted }]}>distance</Text>
            </View>
            {fetchingRoute && <ActivityIndicator size="small" color={colors.accentOrange} style={{ marginLeft: 12 }} />}
          </View>
          <TouchableOpacity style={styles.wazeBtn} onPress={handleOpenWaze} activeOpacity={0.85}>
            <Text style={styles.wazeBtnText}>🚗  Navigate with Waze</Text>
          </TouchableOpacity>
        </View>
      )}

      {fetchingRoute && !routeSummary && (
        <View style={[styles.fetchBadge, { backgroundColor: colors.card }]}>
          <ActivityIndicator size="small" color={colors.accentOrange} />
          <Text style={[styles.fetchText, { color: colors.textSecondary }]}>Finding best route…</Text>
        </View>
      )}
    </View>
  );
};

export default DriverMapView;

const styles = StyleSheet.create({
  root:       { ...StyleSheet.absoluteFillObject },
  stateBox:   { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", gap: 10, padding: 32 },
  stateTitle: { fontSize: 18, fontWeight: "700", textAlign: "center" },
  stateBody:  { fontSize: 14, textAlign: "center", lineHeight: 22, marginTop: 4 },

  driverPulse: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 3, backgroundColor: "rgba(255,255,255,0.65)",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.25, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 6,
  },
  driverDot: { width: 14, height: 14, borderRadius: 7 },

  pin:     { alignItems: "center" },
  pinHead: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.3, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 6 },
  pinTail: { width: 0, height: 0, borderLeftWidth: 7, borderRightWidth: 7, borderTopWidth: 12, borderLeftColor: "transparent", borderRightColor: "transparent", marginTop: -1 },

  banner: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingHorizontal: 20, paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 8 : 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 16, gap: 14,
  },
  bannerRow:     { flexDirection: "row", alignItems: "center" },
  bannerStat:    { flex: 1, alignItems: "center", gap: 2 },
  bannerValue:   { fontSize: 18, fontWeight: "700" },
  bannerLabel:   { fontSize: 12 },
  bannerDivider: { width: 1, height: 36, marginHorizontal: 12 },
  wazeBtn:       { backgroundColor: "#05C8F7", borderRadius: 50, paddingVertical: 14, alignItems: "center" },
  wazeBtnText:   { color: "#000", fontWeight: "700", fontSize: 16 },

  fetchBadge: {
    position: "absolute", top: 60, alignSelf: "center",
    flexDirection: "row", alignItems: "center", gap: 8,
    borderRadius: 50, paddingVertical: 8, paddingHorizontal: 16,
    shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 6,
  },
  fetchText: { fontSize: 13, fontWeight: "500" },
});