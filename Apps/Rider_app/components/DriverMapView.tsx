// components/DriverMapView.tsx
//
// ── SETUP SUMMARY ─────────────────────────────────────────────────────────────
//
// 1. Install:
//      npm install @rnmapbox/maps
//      npx expo install expo-location expo-dev-client
//
// 2. The Mapbox token is already in constants/keys.ts and app.json.
//
// 3. Build a dev client (required — Mapbox won't work in Expo Go):
//      npx expo run:android   OR   npx expo run:ios
//
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  useEffect, useRef, useState, useCallback,
} from "react";
import {
  View, StyleSheet, TouchableOpacity, Text,
  Alert, ActivityIndicator, Platform, Linking,
} from "react-native";
import Mapbox, {
  MapView,
  Camera,
  UserLocation,
  ShapeSource,
  LineLayer,
  MarkerView,
} from "@rnmapbox/maps";
import * as Location from "expo-location";
import { useTheme } from "../context/ThemeContext";
import { IconSymbol } from "./ui/icon-symbol";
import { RNMAPBOX_MAPS_DOWNLOAD_TOKEN } from "../constants/keys";

// Initialise SDK once at module level
Mapbox.setAccessToken(RNMAPBOX_MAPS_DOWNLOAD_TOKEN);

// ── Map style URLs ────────────────────────────────────────────────────────────
// navigation-day/night already bake in the traffic layer — no extra API call.
const MAP_STYLE_LIGHT = "mapbox://styles/mapbox/navigation-day-v1";
const MAP_STYLE_DARK  = "mapbox://styles/mapbox/navigation-night-v1";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Coordinate {
  latitude:  number;
  longitude: number;
}

interface DriverMapViewProps {
  /** Destination coordinate from useCustomerLocation() or the active order.
   *  Pass null/undefined when the driver has no active delivery. */
  destination?:      Coordinate | null;
  destinationLabel?: string;
  onLocationUpdate?: (coord: Coordinate) => void;
}

interface RouteSummary {
  distance: string;
  duration: string;
}

// ── GeoJSON helpers ───────────────────────────────────────────────────────────

function lineGeoJSON(
  coords: [number, number][]
): GeoJSON.Feature<GeoJSON.LineString> {
  return {
    type:     "Feature",
    properties: {},
    geometry: { type: "LineString", coordinates: coords },
  };
}

// ── Formatters ────────────────────────────────────────────────────────────────

function fmtDist(m: number): string {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

function fmtTime(s: number): string {
  const mins = Math.round(s / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60), rem = mins % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DriverMapView: React.FC<DriverMapViewProps> = ({
  destination,
  destinationLabel = "Destination",
  onLocationUpdate,
}) => {
  const { colors, isDark } = useTheme();

  const cameraRef   = useRef<Camera>(null);
  const locationSub = useRef<Location.LocationSubscription | null>(null);

  const [driverCoord,   setDriverCoord]   = useState<Coordinate | null>(null);
  const [routeGeoJSON,  setRouteGeoJSON]  = useState<GeoJSON.Feature<GeoJSON.LineString> | null>(null);
  const [routeSummary,  setRouteSummary]  = useState<RouteSummary | null>(null);
  const [fetchingRoute, setFetchingRoute] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // ── Request permission + track driver location ────────────────────────────

  useEffect(() => {
    let alive = true;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Location permission is required to show your position on the map.");
        return;
      }

      const first = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      if (!alive) return;

      const coord: Coordinate = {
        latitude:  first.coords.latitude,
        longitude: first.coords.longitude,
      };
      setDriverCoord(coord);
      onLocationUpdate?.(coord);

      cameraRef.current?.flyTo([coord.longitude, coord.latitude], 800);

      locationSub.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10, timeInterval: 5000 },
        (loc) => {
          if (!alive) return;
          const c: Coordinate = {
            latitude:  loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          setDriverCoord(c);
          onLocationUpdate?.(c);
        }
      );
    })();

    return () => {
      alive = false;
      locationSub.current?.remove();
    };
  }, []);

  // ── Fetch Mapbox route whenever origin or destination changes ─────────────

  useEffect(() => {
    if (!driverCoord || !destination) {
      setRouteGeoJSON(null);
      setRouteSummary(null);
      return;
    }
    fetchRoute(driverCoord, destination);
  }, [
    driverCoord?.latitude,
    driverCoord?.longitude,
    destination?.latitude,
    destination?.longitude,
  ]);

  const fetchRoute = useCallback(async (origin: Coordinate, dest: Coordinate) => {
    setFetchingRoute(true);
    try {
      // driving-traffic profile → live traffic built in
      // Docs: https://docs.mapbox.com/api/navigation/directions/
      const coords = `${origin.longitude},${origin.latitude};${dest.longitude},${dest.latitude}`;
      const url =
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${coords}` +
        `?geometries=geojson&overview=full&steps=false` +
        `&access_token=${RNMAPBOX_MAPS_DOWNLOAD_TOKEN}`;

      const res  = await fetch(url);
      const json = await res.json();

      if (!json.routes?.length) {
        console.warn("Directions API:", json.message);
        return;
      }

      const route = json.routes[0];
      const lnglat: [number, number][] = route.geometry.coordinates;

      setRouteGeoJSON(lineGeoJSON(lnglat));
      setRouteSummary({
        distance: fmtDist(route.distance),
        duration: fmtTime(route.duration),
      });

      // Fit camera to full route
      const lngs = lnglat.map((c) => c[0]);
      const lats = lnglat.map((c) => c[1]);
      cameraRef.current?.fitBounds(
        [Math.max(...lngs), Math.max(...lats)],  // NE
        [Math.min(...lngs), Math.min(...lats)],  // SW
        [80, 40, 240, 40],
        800
      );
    } catch (err) {
      console.warn("fetchRoute error:", err);
    } finally {
      setFetchingRoute(false);
    }
  }, []);

  // ── Re-centre on driver ───────────────────────────────────────────────────

  const handleRecenter = () => {
    if (!driverCoord) return;
    cameraRef.current?.flyTo([driverCoord.longitude, driverCoord.latitude], 600);
    cameraRef.current?.zoomTo(15, 600);
  };

  // ── Open in Waze ──────────────────────────────────────────────────────────

  const handleOpenWaze = async () => {
    if (!destination) return;
    const wazeUrl = `https://waze.com/ul?ll=${destination.latitude},${destination.longitude}&navigate=yes`;
    const canOpen = await Linking.canOpenURL(wazeUrl);
    if (canOpen) {
      Linking.openURL(wazeUrl);
    } else {
      const fallback = Platform.OS === "ios"
        ? `maps://?daddr=${destination.latitude},${destination.longitude}&dirflg=d`
        : `google.navigation:q=${destination.latitude},${destination.longitude}`;
      Alert.alert(
        "Waze Not Installed",
        "Open with your default maps app instead?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Maps", onPress: () => Linking.openURL(fallback) },
        ]
      );
    }
  };

  // ── Loading / error states ────────────────────────────────────────────────

  if (locationError) {
    return (
      <View style={[styles.stateBox, { backgroundColor: colors.background }]}>
        <IconSymbol name="LocationArrowIcon" size={36} color={colors.textMuted} />
        <Text style={[styles.stateText, { color: colors.textSecondary }]}>
          {locationError}
        </Text>
      </View>
    );
  }

  if (!driverCoord) {
    return (
      <View style={[styles.stateBox, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accentOrange} />
        <Text style={[styles.stateText, { color: colors.textSecondary }]}>
          Finding your location…
        </Text>
      </View>
    );
  }

  // ── Map ───────────────────────────────────────────────────────────────────

  return (
    <View style={styles.root}>
      <MapView
        style={StyleSheet.absoluteFill}
        styleURL={isDark ? MAP_STYLE_DARK : MAP_STYLE_LIGHT}
        logoEnabled={false}
        attributionEnabled={false}
        compassEnabled={false}
        scaleBarEnabled={false}
      >
        {/* Camera */}
        <Camera
          ref={cameraRef}
          zoomLevel={15}
          centerCoordinate={[driverCoord.longitude, driverCoord.latitude]}
          animationMode="flyTo"
          animationDuration={800}
        />

        {/* Driver location — UserLocation handles the GPS updates internally.
            androidRenderMode="normal" is the non-deprecated prop this version exposes.
            We also render our own branded dot via MarkerView so it looks the same
            on both platforms regardless of the native puck style. */}
        <UserLocation
          visible={false}        // hide the default native puck — we draw our own
          animated
          androidRenderMode="normal"
          onUpdate={(loc) => {
            // UserLocation fires onUpdate too — we use our own watchPositionAsync
            // above so we just ignore this, but keeping the handler prevents a
            // React warning on some versions.
          }}
        />

        {/* Custom driver dot — rendered at the live driverCoord position */}
        <MarkerView
          coordinate={[driverCoord.longitude, driverCoord.latitude]}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          {/* Outer pulse ring */}
          <View style={[styles.driverPulse, { borderColor: colors.accentOrange }]}>
            {/* Inner solid dot */}
            <View style={[styles.driverDot, { backgroundColor: colors.accentOrange }]} />
          </View>
        </MarkerView>

        {/* Route polyline */}
        {routeGeoJSON && (
          <ShapeSource id="routeSource" shape={routeGeoJSON}>
            {/* White casing for contrast on any map style */}
            <LineLayer
              id="routeCasing"
              style={{
                lineColor:  isDark ? "#1C1C1E" : "#ffffff",
                lineWidth:  9,
                lineCap:    "round",
                lineJoin:   "round",
              }}
            />
            {/* Coloured route line on top */}
            <LineLayer
              id="routeLine"
              aboveLayerID="routeCasing"
              style={{
                lineColor:  colors.accentOrange,
                lineWidth:  5,
                lineCap:    "round",
                lineJoin:   "round",
              }}
            />
          </ShapeSource>
        )}

        {/* Destination pin */}
        {destination && (
          <MarkerView
            coordinate={[destination.longitude, destination.latitude]}
            anchor={{ x: 0.5, y: 1 }}
          >
            <View style={styles.pin}>
              <View style={[styles.pinHead, { backgroundColor: colors.accentOrange }]}>
                <IconSymbol name="LocationArrowIcon" size={14} color="#fff" />
              </View>
              <View style={[styles.pinTail, { borderTopColor: colors.accentOrange }]} />
            </View>
          </MarkerView>
        )}
      </MapView>

      {/* Route banner */}
      {routeSummary && destination && (
        <View style={[styles.banner, { backgroundColor: colors.card }]}>
          <View style={styles.bannerRow}>
            <View style={styles.bannerStat}>
              <Text style={[styles.bannerValue, { color: colors.textPrimary }]}>
                {routeSummary.duration}
              </Text>
              <Text style={[styles.bannerLabel, { color: colors.textMuted }]}>
                with traffic
              </Text>
            </View>
            <View style={[styles.bannerDivider, { backgroundColor: colors.separatorColor }]} />
            <View style={styles.bannerStat}>
              <Text style={[styles.bannerValue, { color: colors.textPrimary }]}>
                {routeSummary.distance}
              </Text>
              <Text style={[styles.bannerLabel, { color: colors.textMuted }]}>distance</Text>
            </View>
            {fetchingRoute && (
              <ActivityIndicator
                size="small"
                color={colors.accentOrange}
                style={{ marginLeft: 12 }}
              />
            )}
          </View>

          <TouchableOpacity
            style={styles.wazeBtn}
            onPress={handleOpenWaze}
            activeOpacity={0.85}
          >
            <Text style={styles.wazeBtnText}>🚗  Navigate with Waze</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Re-centre button */}
      <TouchableOpacity
        style={[styles.recenter, { backgroundColor: colors.card }]}
        onPress={handleRecenter}
        activeOpacity={0.8}
      >
        <IconSymbol name="LocationArrowIcon" size={20} color={colors.accentOrange} />
      </TouchableOpacity>

      {/* Fetching badge */}
      {fetchingRoute && !routeSummary && (
        <View style={[styles.fetchBadge, { backgroundColor: colors.card }]}>
          <ActivityIndicator size="small" color={colors.accentOrange} />
          <Text style={[styles.fetchText, { color: colors.textSecondary }]}>
            Finding best route…
          </Text>
        </View>
      )}
    </View>
  );
};

export default DriverMapView;

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:      { ...StyleSheet.absoluteFillObject },
  stateBox:  {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center", justifyContent: "center",
    gap: 12, padding: 32,
  },
  stateText: { fontSize: 15, textAlign: "center", lineHeight: 22, marginTop: 8 },

  // Custom driver location dot
  driverPulse: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 3, backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
    elevation: 6,
  },
  driverDot: {
    width: 14, height: 14, borderRadius: 7,
  },

  // Destination pin
  pin:     { alignItems: "center" },
  pinHead: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 6,
  },
  pinTail: {
    width: 0, height: 0,
    borderLeftWidth: 7, borderRightWidth: 7, borderTopWidth: 12,
    borderLeftColor: "transparent", borderRightColor: "transparent",
    marginTop: -1,
  },

  // Route banner
  banner: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingHorizontal: 20, paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 8 : 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12, shadowRadius: 12, elevation: 16, gap: 14,
  },
  bannerRow:     { flexDirection: "row", alignItems: "center" },
  bannerStat:    { flex: 1, alignItems: "center", gap: 2 },
  bannerValue:   { fontSize: 18, fontWeight: "700" },
  bannerLabel:   { fontSize: 12 },
  bannerDivider: { width: 1, height: 36, marginHorizontal: 12 },

  // Waze button (brand colour #05C8F7)
  wazeBtn:    { backgroundColor: "#05C8F7", borderRadius: 50, paddingVertical: 14, alignItems: "center" },
  wazeBtnText:{ color: "#000", fontWeight: "700", fontSize: 16 },

  // Re-centre
  recenter: {
    position: "absolute", bottom: 200, right: 16,
    width: 46, height: 46, borderRadius: 23,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 8,
  },

  // Fetch badge
  fetchBadge: {
    position: "absolute", top: 60, alignSelf: "center",
    flexDirection: "row", alignItems: "center", gap: 8,
    borderRadius: 50, paddingVertical: 8, paddingHorizontal: 16,
    shadowColor: "#000", shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 6,
  },
  fetchText: { fontSize: 13, fontWeight: "500" },
});