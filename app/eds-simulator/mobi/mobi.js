let cacheName = 'mobitec-eds';

let controller;

window.addEventListener('load', () => {
    controller = document.getElementById('controller');
});

window.addEventListener('message', event => {
    let eventData = JSON.parse(event.data);

    if (event.origin == location.origin) {
        if (eventData.type === 'controller-preview-update') {
            controller.contentWindow.postMessage(event.data, location.toString());
            return;
        }

        if (eventData.type === 'edsTypeChanged') {
            let types = {
                MobiDOT: '-flipdot',
                MobiLED: ''
            }

            let currentType = types[eventData.edsType];
            document.getElementById('front').src = './front' + currentType + '/index.html';
            document.getElementById('front').addEventListener('load', () => {
                propagateEvent({
                    mode: 'setOperator',
                    operator: eventData.operator
                });
            });
        }
        propagateEvent(eventData);
    }
});

function propagateEvent(eventData) {
    document.getElementById('front').contentWindow.postMessage(JSON.stringify(eventData), location.toString());
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/eds-simulator/mobi/serviceworker.js', {
        scope: '/eds-simulator/mobi/'
    });
}
