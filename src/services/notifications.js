import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotifications = async () => {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Push notification permission not granted');
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('news', {
      name: 'News Updates',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#910e31',
      sound: 'default',
    });
  }

  try {
    const deviceToken = await Notifications.getDevicePushTokenAsync();
    console.log('FCM token:', deviceToken.data);

    // Subscribe to 'news' topic for auto notifications
    try {
      await fetch(
        `https://iid.googleapis.com/iid/v1/${deviceToken.data}/rel/topics/news`,
        {
          method: 'POST',
          headers: {
            Authorization: 'key=AIzaSyBrv3w-VKumihC2UFo08kglKpl4pvwdXzA',
          },
        }
      );
      console.log('Subscribed to news topic');
    } catch (subErr) {
      console.log('Topic subscription error:', subErr);
    }

    return deviceToken.data;
  } catch (error) {
    console.log('Error getting push token:', error);
    return null;
  }
};

export const scheduleLocalNotification = async (title, body, data = {}) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: 'default',
    },
    trigger: null, // immediate
  });
};
