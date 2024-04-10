chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'setReminder') {
    const reminder = request.reminder;
    const datetime = new Date(request.datetime).getTime();
    const repeat = request.repeat;
    const now = Date.now();

    if (datetime > now) {
      const delayInMinutes = (datetime - now) / (1000 * 60);
      let periodInMinutes;

      if (repeat === 'daily') {
        periodInMinutes = 24 * 60; 
      } else if (repeat === 'weekly') {
        periodInMinutes = 7 * 24 * 60; 
      } else if (repeat === 'monthly') {
        periodInMinutes = 30 * 24 * 60; 
      } else {
        periodInMinutes = null; 
      }

      chrome.alarms.create(reminder, { delayInMinutes: delayInMinutes, periodInMinutes: periodInMinutes });
      chrome.notifications.create('', {
        type: 'basic',
        iconUrl: 'alert.png',
        title: 'Reminder',
        message: 'Your reminder has been set.',
        requireInteraction: true
      });
    } else {
      console.error("Please select a future time for the reminder.");
    }
  }
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  chrome.notifications.create('', {
    type: 'basic',
    iconUrl: 'alert.png',
    title: 'Reminder',
    message: alarm.name,
    requireInteraction: true
  });

  chrome.tts.speak(alarm.name);
});
