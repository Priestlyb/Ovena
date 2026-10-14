// // hooks/useNetworkStatus.ts
// import { useState, useEffect, useRef } from "react";
// import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

// export interface NetworkStatus {
//   isConnected: boolean;
//   // true only on the first moment we get a definitive answer — avoids
//   // flashing the "connected" banner on a cold app launch
//   isKnown: boolean;
// }

// export function useNetworkStatus(): NetworkStatus {
//   const [status, setStatus] = useState<NetworkStatus>({ isConnected: true, isKnown: false });

//   useEffect(() => {
//     const unsub = NetInfo.addEventListener((state: NetInfoState) => {
//       setStatus({
//         isConnected: state.isConnected ?? false,
//         isKnown:     true,
//       });
//     });

//     // Eagerly fetch so we don't wait for the first passive event
//     NetInfo.fetch().then((state) => {
//       setStatus({ isConnected: state.isConnected ?? false, isKnown: true });
//     });

//     return () => unsub();
//   }, []);

//   return status;
// }