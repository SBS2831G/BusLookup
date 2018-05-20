let controller, rearEDS, frontEDS;

window.addEventListener('load', () => {
    controller = document.getElementById('controller');
    rearEDS = document.getElementById('rear');
    frontEDS = document.getElementById('front')
});

window.addEventListener('message', event => {
    let eventData = JSON.parse(event.data);

    if (event.origin == location.origin) {
        switch (eventData.type) {
            case 'svc-update':
                onSvcUpdated(eventData);
                break;
            default:
                propagateEvent(eventData);
                break;
        }
    }
});

function propagateEvent(eventData) {
    rearEDS.contentWindow.postMessage(JSON.stringify(eventData), location.toString());
    frontEDS.contentWindow.postMessage(JSON.stringify(eventData), location.toString());
}

function onSvcUpdated(eventData) {
    console.log('load svc ', eventData.svc);
    rearEDS.contentWindow.postMessage(JSON.stringify({
        type: 'svc-update',
        svc: eventData.svc
    }), location.toString());

    frontEDS.contentWindow.postMessage(JSON.stringify({
        type: 'svc-update',
        svc: eventData.svc,
        dest: eventData.dest,
        loopPoint: eventData.loopPoint,
        routeType: eventData.routeType,
        direction: eventData.direction
    }), location.toString());
}
