const mockNotifee = {
  requestPermission: jest.fn(() => Promise.resolve(true)),
  getNotificationSettings: jest.fn(() => Promise.resolve({ authorizationStatus: 1 })),
  displayNotification: jest.fn(() => Promise.resolve()),
  cancelNotification: jest.fn(() => Promise.resolve()),
  cancelAllNotifications: jest.fn(() => Promise.resolve()),
  getTriggerNotifications: jest.fn(() => Promise.resolve([])),
  createTriggerNotification: jest.fn(() => Promise.resolve()),
  deleteTriggerNotification: jest.fn(() => Promise.resolve()),
  onForegroundEvent: jest.fn(() => jest.fn()),
  createChannel: jest.fn(() => Promise.resolve({ id: 'default_channel', name: 'Default Channel' })),
};

const EventType = {
  DELIVERED: 'delivered',
  PRESS: 'press',
  DISMISSED: 'dismissed',
};

module.exports = mockNotifee;
module.exports.EventType = EventType;
module.exports.default = mockNotifee;
