/**
 * DriverMapView.tsx
 *
 * A full-featured map component for the Ovena driver app.
 *
 * ─── REQUIRED APIs & WHERE TO GET THEM ──────────────────────────────────────
 *
 * 1. Google Maps Platform (Primary)
 *    → console.cloud.google.com → "APIs & Services" → Enable:
 *      • Maps SDK for Android / Maps SDK for iOS
 *      • Directions API         (polyline routing)
 *      • Routes API             (real-time traffic-aware routing)
 *      • Distance Matrix API    (ETA + distance)
 *    → Create an API key and restrict it to your bundle ID / package name.
 *    → Store key in .env: EXPO_PUBLIC_GOOGLE_MAPS_KEY=...
 *
 * 2. react-native-maps  (Map rendering)
 *    → npm install react-native-maps
 *    → Follow setup at: https://github.com/react-native-maps/react-native-maps
 *    → Android: add google_maps_api_key to android/local.properties
 *    → iOS:     add GMSServices.provideAPIKey() to AppDelegate.m
 *
 * 3. expo-location  (Real GPS)
 *    → npx expo install expo-location
 *    → Add permissions to app.json (see bottom of this file)
 *
 * 4. @googlemaps/polyline-codec  (decode encoded polylines from Directions API)
 *    → npm install @googlemaps/polyline-codec
 *
 * 5. Your backend WebSocket
 *    → Provides customer/destination coordinates and order updates
 *    → Same ws://localhost:8000/ws/driver/orders/ used in driver_dashboard.html
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import MapView, {
  Marker,
  Polyline,
  Circle,
  PROVIDER_GOOGLE,
  MapStyleElement,
  Region,
} from "react-native-maps";
import * as Location from "expo-location";
import { decode } from "@googlemaps/polyline-codec";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface TrafficSegment {
  coordinates: Coordinate[];
  /** "low" | "medium" | "high" | "very_high" */
  congestion: string;
}

interface RouteOption {
  id: string;
  label: string;         // e.g. "Fastest", "Avoid Toll"
  polyline: Coordinate[];
  durationMinutes: number;
  distanceKm: number;
  trafficSegments: TrafficSegment[];
  isBest: boolean;
}

interface DriverMapViewProps {
  /** JWT for backend WebSocket auth */
  authToken: string;
  /** WebSocket base, e.g. "ws://your-server.com" */
  wsBase?: string;
  /** REST API base, e.g. "https://your-server.com" */
  apiBase?: string;
  /** Called when an order is accepted / rejected from the map */
  onOrderAction?: (orderId: string, action: "accept" | "reject") => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const GOOGLE_MAPS_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY ?? "";
const DIRECTIONS_URL = "https://maps.googleapis.com/maps/api/directions/json";
const LOCATION_UPDATE_INTERVAL_MS = 8_000; // send GPS every 8 s

const CONGESTION_COLOR: Record<string, string> = {
  low: "#4CAF50",
  medium: "#FFC107",
  high: "#FF5722",
  very_high: "#B71C1C",
};

// ─── Dark/driver-themed map style ────────────────────────────────────────────

const MAP_STYLE: MapStyleElement[] = [
  { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2b2d42" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3a3f5c" }],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [{ color: "#cac9c9" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0d1b2a" }],
  },
  {
    featureType: "poi",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Decode a Google encoded polyline string → Coordinate[] */
function decodePolyline(encoded: string): Coordinate[] {
  return decode(encoded, 5).map(([lat, lng]) => ({
    latitude: lat,
    longitude: lng,
  }));
}

/** Fetch all route options (up to 3 alternatives) from Directions API */
async function fetchRoutes(
  origin: Coordinate,
  destination: Coordinate
): Promise<RouteOption[]> {
  const url =
    `${DIRECTIONS_URL}` +
    `?origin=${origin.latitude},${origin.longitude}` +
    `&destination=${destination.latitude},${destination.longitude}` +
    `&alternatives=true` +
    `&departure_time=now` +          // enables traffic-aware durations
    `&traffic_model=best_guess` +
    `&key=${GOOGLE_MAPS_KEY}`;

  const res = await fetch(url);
  const json = await res.json();

  if (json.status !== "OK" || !json.routes?.length) {
    throw new Error(`Directions API: ${json.status}`);
  }

  // Sort by traffic-aware duration ascending so index 0 is always fastest
  const sorted = [...json.routes].sort(
    (a, b) =>
      (a.legs[0].duration_in_traffic?.value ?? a.legs[0].duration.value) -
      (b.legs[0].duration_in_traffic?.value ?? b.legs[0].duration.value)
  );

  return sorted.map((route, i) => {
    const leg = route.legs[0];
    const polyline = decodePolyline(route.overview_polyline.points);

    // Build approximate traffic segments from each step's congestion
    const trafficSegments: TrafficSegment[] = route.legs[0].steps.map(
      (step: any) => ({
        coordinates: decodePolyline(step.polyline.points),
        // The Directions API doesn't expose per-step congestion directly;
        // we approximate by comparing step duration vs duration_in_traffic.
        congestion: approximateCongestion(
          step.duration.value,
          step.duration_in_traffic?.value ?? step.duration.value
        ),
      })
    );

    const durationSec =
      leg.duration_in_traffic?.value ?? leg.duration.value;

    return {
      id: `route_${i}`,
      label: i === 0 ? "Fastest" : i === 1 ? "Alternate" : "Avoid Toll",
      polyline,
      durationMinutes: Math.round(durationSec / 60),
      distanceKm: parseFloat((leg.distance.value / 1000).toFixed(1)),
      trafficSegments,
      isBest: i === 0,
    };
  });
}

function approximateCongestion(freeSec: number, trafficSec: number): string {
  const ratio = trafficSec / freeSec;
  if (ratio < 1.2) return "low";
  if (ratio < 1.5) return "medium";
  if (ratio < 2.0) return "high";
  return "very_high";
}

// ─── Component ───────────────────────────────────────────────────────────────

const DriverMapView: React.FC<DriverMapViewProps> = ({
  authToken,
  wsBase = "ws://localhost:8000",
  apiBase = "http://localhost:8000",
  onOrderAction,
}) => {
  const mapRef = useRef<MapView>(null);

  // State
  const [driverLocation, setDriverLocation] = useState<Coordinate | null>(null);
  const [destination, setDestination] = useState<Coordinate | null>(null);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [eta, setEta] = useState<string | null>(null);

  // Refs for intervals / WebSocket
  const locationWsRef = useRef<WebSocket | null>(null);
  const ordersWsRef = useRef<WebSocket | null>(null);
  const locationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── GPS Permission & Tracking ──────────────────────────────────────────
  const startTracking = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("Location permission denied");
      return;
    }

    // Immediately get first fix
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const coords: Coordinate = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };
    setDriverLocation(coords);
    sendLocationToServer(coords, pos.coords.heading ?? 0, pos.coords.speed ?? 0);

    // Then poll every LOCATION_UPDATE_INTERVAL_MS
    locationIntervalRef.current = setInterval(async () => {
      try {
        const p = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const c: Coordinate = {
          latitude: p.coords.latitude,
          longitude: p.coords.longitude,
        };
        setDriverLocation(c);
        sendLocationToServer(c, p.coords.heading ?? 0, p.coords.speed ?? 0);
      } catch (e) {
        console.error("GPS error:", e);
      }
    }, LOCATION_UPDATE_INTERVAL_MS);
  }, []);

  const stopTracking = useCallback(() => {
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
  }, []);

  // ── Send driver GPS → backend via WebSocket ────────────────────────────
  const sendLocationToServer = (
    coords: Coordinate,
    heading: number,
    speed: number
  ) => {
    const ws = locationWsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(
      JSON.stringify({
        type: "location_update",
        lat: coords.latitude,
        lng: coords.longitude,
        heading,
        speed,
        accuracy: 10,
      })
    );
  };

  // ── WebSocket connections ──────────────────────────────────────────────
  useEffect(() => {
    // Location WS
    const locWs = new WebSocket(
      `${wsBase}/ws/driver/location/?token=${authToken}`
    );
    locationWsRef.current = locWs;

    locWs.onopen = () => console.log("[WS] Location connected");
    locWs.onclose = () => console.log("[WS] Location disconnected");
    locWs.onerror = (e) => console.error("[WS] Location error:", e);
    locWs.onmessage = (e) => {
      const data = JSON.parse(e.data);
      // Backend can push destination updates here
      if (data.type === "destination_update") {
        const dest: Coordinate = {
          latitude: data.lat,
          longitude: data.lng,
        };
        setDestination(dest);
        setActiveOrderId(data.order_id ?? null);
      }
    };

    // Orders WS
    const ordWs = new WebSocket(
      `${wsBase}/ws/driver/orders/?token=${authToken}`
    );
    ordersWsRef.current = ordWs;

    ordWs.onopen = () => {
      console.log("[WS] Orders connected");
      ordWs.send(JSON.stringify({ type: "request_orders" }));
    };
    ordWs.onmessage = (e) => {
      const data = JSON.parse(e.data);
      // When a new order is assigned, extract destination coordinates
      if (data.type === "my_orders" && data.data?.length) {
        const assignedOrder = data.data.find(
          (o: any) => o.status === "driver_assigned"
        );
        if (assignedOrder?.delivery_location) {
          setDestination({
            latitude: assignedOrder.delivery_location.lat,
            longitude: assignedOrder.delivery_location.lng,
          });
          setActiveOrderId(assignedOrder.id);
        }
      }
      // Real-time order update → re-fetch
      if (data.type === "order.update" || data.type === "notification") {
        ordWs.send(JSON.stringify({ type: "request_orders" }));
      }
    };

    // Start GPS
    startTracking();

    return () => {
      stopTracking();
      locWs.close();
      ordWs.close();
    };
  }, [authToken, wsBase]);

  // ── Fetch routes whenever driver location or destination changes ────────
  useEffect(() => {
    if (!driverLocation || !destination) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      setRouteError(null);
      try {
        const r = await fetchRoutes(driverLocation, destination);
        if (!cancelled) {
          setRoutes(r);
          // Auto-select fastest
          const best = r.find((ro) => ro.isBest) ?? r[0];
          setSelectedRouteId(best.id);
          setEta(`${best.durationMinutes} min · ${best.distanceKm} km`);

          // Pan camera to fit both endpoints
          mapRef.current?.fitToCoordinates(
            [driverLocation, destination],
            {
              edgePadding: { top: 80, right: 40, bottom: 200, left: 40 },
              animated: true,
            }
          );
        }
      } catch (err: any) {
        if (!cancelled) setRouteError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [driverLocation, destination]);

  // ── Center on driver ───────────────────────────────────────────────────
  const centerOnDriver = () => {
    if (!driverLocation) return;
    mapRef.current?.animateToRegion(
      {
        ...driverLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      400
    );
  };

  // ── Selected route ─────────────────────────────────────────────────────
  const selectedRoute = routes.find((r) => r.id === selectedRouteId);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* ── MAP ── */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={MAP_STYLE}
        showsTraffic={true}          // Native Google traffic layer
        showsUserLocation={false}    // We draw our own driver marker
        showsMyLocationButton={false}
        initialRegion={
          driverLocation
            ? {
                ...driverLocation,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            : {
                // Default: Lagos, Nigeria
                latitude: 6.5244,
                longitude: 3.3792,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }
        }
      >
        {/* ── Traffic polylines (per-step color) ── */}
        {selectedRoute?.trafficSegments.map((seg, i) => (
          <Polyline
            key={`traffic_${i}`}
            coordinates={seg.coordinates}
            strokeColor={CONGESTION_COLOR[seg.congestion] ?? "#999"}
            strokeWidth={5}
          />
        ))}

        {/* ── Non-selected routes (dimmed) ── */}
        {routes
          .filter((r) => r.id !== selectedRouteId)
          .map((r) => (
            <Polyline
              key={r.id}
              coordinates={r.polyline}
              strokeColor="rgba(255,255,255,0.25)"
              strokeWidth={3}
              lineDashPattern={[6, 4]}
              tappable
              onPress={() => {
                setSelectedRouteId(r.id);
                setEta(`${r.durationMinutes} min · ${r.distanceKm} km`);
              }}
            />
          ))}

        {/* ── Driver marker ── */}
        {driverLocation && (
          <Marker coordinate={driverLocation} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.driverDot}>
              <View style={styles.driverDotInner} />
            </View>
          </Marker>
        )}

        {/* ── Destination marker ── */}
        {destination && (
          <>
            <Marker coordinate={destination}>
              <View style={styles.destMarker}>
                <Text style={styles.destMarkerText}>📦</Text>
              </View>
            </Marker>
            {/* Accuracy ring around destination */}
            <Circle
              center={destination}
              radius={80}
              fillColor="rgba(24,197,93,0.12)"
              strokeColor="rgba(24,197,93,0.6)"
              strokeWidth={1}
            />
          </>
        )}
      </MapView>

      {/* ── LOADING ── */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#18C55D" />
          <Text style={styles.loadingText}>Finding best route…</Text>
        </View>
      )}

      {/* ── ERROR ── */}
      {routeError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠ {routeError}</Text>
        </View>
      )}

      {/* ── ETA PILL (top) ── */}
      {eta && !loading && (
        <View style={styles.etaPill}>
          <Text style={styles.etaText}>🕐 {eta}</Text>
        </View>
      )}

      {/* ── ROUTE SELECTOR (bottom, only when multiple routes) ── */}
      {routes.length > 1 && !loading && (
        <View style={styles.routeSelector}>
          {routes.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={[
                styles.routeOption,
                r.id === selectedRouteId && styles.routeOptionSelected,
              ]}
              onPress={() => {
                setSelectedRouteId(r.id);
                setEta(`${r.durationMinutes} min · ${r.distanceKm} km`);
              }}
            >
              {r.isBest && (
                <Text style={styles.routeBestBadge}>BEST</Text>
              )}
              <Text
                style={[
                  styles.routeLabel,
                  r.id === selectedRouteId && styles.routeLabelSelected,
                ]}
              >
                {r.label}
              </Text>
              <Text style={styles.routeMeta}>
                {r.durationMinutes} min · {r.distanceKm} km
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── TRAFFIC LEGEND ── */}
      {selectedRoute && (
        <View style={styles.trafficLegend}>
          {Object.entries(CONGESTION_COLOR).map(([key, color]) => (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={styles.legendText}>{key.replace("_", " ")}</Text>
            </View>
          ))}
        </View>
      )}

      {/* ── CENTER BUTTON ── */}
      <TouchableOpacity style={styles.centerBtn} onPress={centerOnDriver}>
        <Text style={styles.centerBtnText}>◎</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DriverMapView;

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },

  // Loading
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: { color: "#fff", fontSize: 14, fontWeight: "600" },

  // Error
  errorBanner: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: "#B71C1C",
    padding: 12,
    borderRadius: 10,
  },
  errorText: { color: "#fff", fontSize: 13, textAlign: "center" },

  // ETA
  etaPill: {
    position: "absolute",
    top: 16,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#18C55D",
  },
  etaText: { color: "#18C55D", fontWeight: "700", fontSize: 14 },

  // Driver dot
  driverDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(24,197,93,0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#18C55D",
  },
  driverDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#18C55D",
  },

  // Destination marker
  destMarker: {
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 6,
    borderWidth: 2,
    borderColor: "#18C55D",
  },
  destMarkerText: { fontSize: 20 },

  // Route selector
  routeSelector: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: "row",
    gap: 8,
  },
  routeOption: {
    flex: 1,
    backgroundColor: "rgba(20,20,30,0.85)",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
  },
  routeOptionSelected: {
    borderColor: "#18C55D",
    backgroundColor: "rgba(24,197,93,0.15)",
  },
  routeBestBadge: {
    fontSize: 9,
    color: "#18C55D",
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 2,
  },
  routeLabel: { color: "#aaa", fontWeight: "600", fontSize: 13 },
  routeLabelSelected: { color: "#fff" },
  routeMeta: { color: "#888", fontSize: 11, marginTop: 2 },

  // Traffic legend
  trafficLegend: {
    position: "absolute",
    top: 60,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 10,
    padding: 8,
    gap: 5,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: "#ddd", fontSize: 10 },

  // Center button
  centerBtn: {
    position: "absolute",
    bottom: 130,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.75)",
    borderWidth: 1,
    borderColor: "#18C55D",
    alignItems: "center",
    justifyContent: "center",
  },
  centerBtnText: { color: "#18C55D", fontSize: 22 },
});

/**
 * ─── HOW TO USE IN HomeScreen.tsx ──────────────────────────────────────────
 *
 * Replace the <Image> background + <View> overlay block with:
 *
 *   import DriverMapView from "../components/DriverMapView";
 *
 *   // Inside the <View style={styles.container}> return:
 *   <DriverMapView
 *     authToken={YOUR_JWT_TOKEN}
 *     wsBase="ws://your-server.com"
 *     apiBase="https://your-server.com"
 *     onOrderAction={(orderId, action) => {
 *       console.log(`Order ${orderId} → ${action}`);
 *     }}
 *   />
 *
 *   // Then layer your topBar, bottomPanel, modals etc. on top as-is.
 *   // The map fills the full screen behind everything.
 *
 * ─── app.json permissions block ────────────────────────────────────────────
 *
 * "expo": {
 *   "plugins": [
 *     ["expo-location", {
 *       "locationAlwaysAndWhenInUsePermission": "Allow Ovena to track your location while delivering."
 *     }]
 *   ],
 *   "android": {
 *     "config": {
 *       "googleMaps": { "apiKey": "YOUR_GOOGLE_MAPS_KEY" }
 *     }
 *   },
 *   "ios": {
 *     "config": {
 *       "googleMapsApiKey": "YOUR_GOOGLE_MAPS_KEY"
 *     }
 *   }
 * }
 *
 * ─── Backend contract (what your WebSocket must send) ──────────────────────
 *
 * When a new order is assigned, push this on /ws/driver/orders/:
 *   {
 *     "type": "my_orders",
 *     "data": [{
 *       "id": "order_123",
 *       "status": "driver_assigned",
 *       "delivery_location": { "lat": 6.6018, "lng": 3.3515 },
 *       ...
 *     }]
 *   }
 *
 * Alternatively on /ws/driver/location/ push:
 *   { "type": "destination_update", "lat": 6.6018, "lng": 3.3515, "order_id": "order_123" }
 */