chrome.alarms.onAlarm.addListener(function(alarm) {
    console.log(alarm);
    if (alarm.name === 'onCallAlarm') {
        var hour = new Date(alarm.scheduledTime).getHours();

        if (hour !== 0) {
            console.log('Dont send notification');
        } else {
            chrome.tabs.query({ active: true }).then(tab => {
                chrome.scripting
                  .executeScript({
                    target: { tabId: tab[0].id },
                    files: ['./injection/script.js'],
                  })
                  .then(() => {
                    console.log('finished');
                  });
              });
              
            chrome.notifications.create({
                title: 'Hora do On Call!',
                message: 'Hora de colocar On Call! Você tem algum caso daqui 5 minutos? Se sim, lembre-se da marcação do On Call no caso, o time de QA está de olho hein!',
                type: 'basic',
                iconUrl: './icon.png',
                priority: 2
            });
        }
    }
});