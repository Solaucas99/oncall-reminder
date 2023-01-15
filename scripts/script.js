    const activeBtn = document.querySelector('input[type="checkbox"]');
    const firstActiveReminder = window.localStorage.getItem('isReminderActive');

    function getCorrectTime() {
        const minutesToAlert = 55;
        const minutesNow = new Date(Date.now()).getMinutes();
        const minutesRemaining = minutesToAlert - minutesNow;

        if (minutesRemaining > 0) {
            const filterMinutesRemaining = minutesRemaining * 60000;

            return filterMinutesRemaining + Date.now();
        } else {
            const filterMinutesRemaining = (minutesRemaining + 60) * 60000;

            return filterMinutesRemaining + Date.now();
        }
    }

    function changeStatus(activeReminder) {
        if (!activeReminder || activeReminder === 'false') {
            const spanWarner = document.querySelector('span.descriptionSpan');
            spanWarner.innerText = 'Inactive';
            spanWarner.style.color = 'red';
            activeBtn.checked = false;
        } else {
            const spanWarner = document.querySelector('span.descriptionSpan');
            spanWarner.innerText = 'Active';
            spanWarner.style.color = 'green';
            activeBtn.checked = true;
        }
    }

    changeStatus(firstActiveReminder);

    window.addEventListener("storage", function () {
        const activeReminder = window.localStorage.getItem('isReminderActive');

        changeStatus(activeReminder);
    }, false);

    activeBtn.addEventListener('change', function() {
        const activeReminder = window.localStorage.getItem('isReminderActive');

        if (!activeReminder || activeReminder === 'false') {
            localStorage.setItem('isReminderActive', 'true');
            window.dispatchEvent( new Event('storage') )

            chrome.alarms.create('onCallAlarm', {
                when: getCorrectTime(),
                periodInMinutes: 2,
            });

            chrome.notifications.create({
                title: 'On Call Reminder Ativado!',
                message: 'Iremos te avisar a partir de agora quando faltar 5min para a próxima hora, sem exceção!',
                type: 'basic',
                iconUrl: './icon.png'
            });

            const audio = new Audio('../assets/notificationActive.wav');
            audio.play();
        } else {
            localStorage.setItem('isReminderActive', 'false');
            window.dispatchEvent( new Event('storage') )

            chrome.alarms.clearAll();

            chrome.notifications.create({
                title: 'On Call Reminder Desativado!',
                message: 'Você desativou os avisos de "On Call". Não iremos mais incomodar, porém, tome cuidado! Todo caso deverá ser colocado em on call no tempo certo! (5min antes das calls!)',
                type: 'basic',
                iconUrl: './icon.png'
            });

            const audio = new Audio('../assets/notificationInactive.wav');
            audio.play();
        }
    });