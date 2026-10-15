import "expo-router/entry";

import {
  getMessaging,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";

const messagingInstance = getMessaging();

setBackgroundMessageHandler(messagingInstance, async (remoteMessage) => {
  console.log(
    "[Notifications] Background notification received:",
    remoteMessage,
  );
});
