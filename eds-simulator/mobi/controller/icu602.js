let inner = null;
let state = 'home';

let currentOperator;

let announcementQueue = [];
let announcementPlaying = false;

let announcementRanges = {
    SMRT: {
        min: 1,
        max: 7
    },
    TTSG: {
        min: 0,
        max: 9
    }
}

function playAnnouncement(announcementID, playComplete) {
    let announcementURL = '../resources/audio/' + currentOperator + '/' + announcementID + '.mp3';

    let audio = new Audio(announcementURL);
    audio.addEventListener('ended', playComplete);
    audio.play();
}

function startPlayingAnnouncements() {
    let nextAnnouncement = announcementQueue.shift();
    if (!nextAnnouncement) return;

    announcementPlaying = true;

    playAnnouncement(nextAnnouncement, () => {
        if (announcementQueue.length !== 0)
            setTimeout(() => {
                startPlayingAnnouncements();
            }, 500);
        else
            announcementPlaying = false;
    });
}

window.addEventListener('load', () => {
    currentOperator = 'SMRT';

    inner = document.getElementById('controller-iframe').contentWindow;
    document.getElementById('button-f1').addEventListener('click', onF1Pressed);
    document.getElementById('button-f2').addEventListener('click', onF2Pressed);
    document.getElementById('button-no').addEventListener('click', onCrossPressed);
    document.getElementById('button-yes').addEventListener('click', onYesPressed);
    document.getElementById('button-up').addEventListener('click', onUpPressed);
    document.getElementById('button-down').addEventListener('click', onDownPressed);
    document.getElementById('operator-selector').addEventListener('change', onOperatorChanged);
    document.getElementById('eds-selector').addEventListener('change', onEDSTypeChanged);

    for (let button = 0; button < 10; button++) {
        let buttonDiv = document.getElementById('button-' + button);

        buttonDiv.addEventListener('click', () => {
            if (state === 'home') {
                let {min, max} = announcementRanges[currentOperator];

                if (button < min || button > max) return;
                announcementQueue.push(button);
                if (!announcementPlaying) {
                    startPlayingAnnouncements();
                }
            } else if (state.startsWith('select')) {
                inner.postMessage(JSON.stringify({
                    mode: 'keyPressed',
                    key: button
                }), inner.location.toString());
            }
        });
    }

    inner.postMessage(JSON.stringify({
        mode: 'home'
    }), location.toString());
});

function onF1Pressed() {
    if (state === 'home') {
        state = 'selectService';
        inner.postMessage(JSON.stringify({
            mode: 'selectService'
        }), inner.location.toString());
    }
}

function onF2Pressed() {
    if (state === 'home') {
        state = 'selectExtra';
        inner.postMessage(JSON.stringify({
            mode: 'selectExtra'
        }), inner.location.toString());
    }
}

function onCrossPressed() {
    state = 'home';
    inner.postMessage(JSON.stringify({
        mode: 'homePage'
    }), inner.location.toString());
}

function onYesPressed() {
    if (state !== 'home') {
        state = 'home';

        inner.postMessage(JSON.stringify({
            mode: 'enterPressed'
        }), inner.location.toString());
    }
}

function onUpPressed() {
    if (state !== 'home') {
        inner.postMessage(JSON.stringify({
            mode: 'pressUp'
        }), inner.location.toString());
    }
}

function onDownPressed() {
    if (state !== 'home') {
        inner.postMessage(JSON.stringify({
            mode: 'pressDown'
        }), inner.location.toString());
    }
}

function onOperatorChanged(e) {
    currentOperator = document.querySelectorAll('#operator-selector > option')
    [document.getElementById('operator-selector').selectedIndex].textContent;
    inner.postMessage(JSON.stringify({
        mode: 'setOperator',
        operator: currentOperator
    }), inner.location.toString());

    parent.postMessage(JSON.stringify({
        mode: 'setOperator',
        operator: currentOperator
    }), parent.location.toString());

    state = 'home';
}

function onEDSTypeChanged(e) {
    let currentEDSType = document.querySelectorAll('#eds-selector > option')
    [document.getElementById('eds-selector').selectedIndex].textContent;

    parent.postMessage(JSON.stringify({
        type: 'edsTypeChanged',
        edsType: currentEDSType,
        operator: currentOperator
    }), parent.location.toString());
}

window.addEventListener('message', event => {
    let eventData = JSON.parse(event.data);

    if (event.origin == location.origin) {
        if (eventData.type === 'controller-preview-update') {
            inner.postMessage(event.data, location.toString());
            return;
        }
        parent.postMessage(event.data, parent.location.toString());
    }
});
