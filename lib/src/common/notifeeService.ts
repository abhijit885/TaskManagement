import notifee from '@notifee/react-native';

export const onDisplayLocalNotification = async(title:string, body: string) => {
  await notifee.requestPermission()

  const channelId = await notifee.createChannel({
    id: 'default_channel',
    name: 'Default Channel',
  });

  await notifee.displayNotification({
    title: title,
    body: body,
    android: {
      channelId
    },
  });
}