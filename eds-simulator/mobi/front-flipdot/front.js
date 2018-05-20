let ledCache = [];

let currentEDSCode = 5, currentEDSScroll = 0, edsHeartbeatInterval = 0;
let currentExtraMessage = 0;

function generateLEDCssCode() {
    let pixelSize = Math.ceil(window.innerWidth * 0.005);

    let cssData =
`
    .led {
        width: ${pixelSize}px;
        height: ${pixelSize}px;
    }

    #led-container {
        width: ${width * Math.ceil(window.innerWidth * 0.0055)}px;
        grid-template-columns: repeat(${width}, ${Math.ceil(window.innerWidth * 0.0055)}px);
        grid-row-gap: ${Math.ceil(window.innerWidth * 0.001)}px;
        grid-auto-rows: ${Math.ceil(window.innerWidth * 0.0055)}px;
    }
`;

    document.getElementById('led-style').textContent = cssData;
}

window.addEventListener('resize', () => {
    generateLEDCssCode();
})

window.addEventListener('load', () => {
    updateOperator('SMRT');
    generateLEDCssCode();
    for (let x = 0; x < width; x++) {
        ledCache.push([]);
        for (let y = 0; y < height; y++) {
            ledCache[x].push([]);
        }
    }

    let ledContainer = document.getElementById('led-container');
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let ledSegment = document.createElement('div');
            ledSegment.id = 'led-' + x + '-' + y;
            ledSegment.className = 'led-segment';

            let led = document.createElement('div');
            led.className = 'led led-off';

            ledSegment.appendChild(led);

            ledCache[x][y] = led;

            ledContainer.appendChild(ledSegment);
        }
    }

    edsHeartbeatInterval = setInterval(edsHeartbeat, 3000);
    edsHeartbeat();
});

function setRLED(x, y, state) {
    if (!ledCache[x]) return;
    let led = ledCache[x][y];

    if (!led) return;

    var state = 'led-' + (state ? 'on' : 'off');
    led.className = 'led ' + state;
}

function edsHeartbeat() {
    let edsData = EDSData[currentEDSCode];
    if (!edsData) return;
    let scrollLength = edsData.scrolls ? edsData.scrolls.length : 1;

    if (++currentEDSScroll > scrollLength - 1) {
        if (currentExtraMessage !== 0)
            currentEDSScroll = -1;
        else
            currentEDSScroll = 0;
    };

    renderEDS(currentEDSCode, currentEDSScroll, currentExtraMessage);

    let matrix = edsToMatrix();

    for (let x = 0; x < width; x++) {
        setTimeout(() => {
            for (let y = 0; y < height; y++) {
                setRLED(x, y, matrix[x][y]);
            }
        }, 5 * x);
    }

    parent.postMessage(JSON.stringify({
        type: 'controller-preview-update',
        code: currentEDSCode,
        extra: currentExtraMessage,
        scroll: currentEDSScroll
    }), parent.location.toString());
}

function updateOperator(operator) {
    EDSTemplates = EDSTemplateSet[operator];
    EDSData = EDSDataSet[operator];
    EDSImages = EDSImageSet[operator] || {};
    EDSExtraMessage = EDSExtraMessageSet[operator];

    currentEDSCode = currentEDSScroll = currentExtraMessage = 0;
}

window.addEventListener('message', event => {
    let eventData = JSON.parse(event.data);

    if (event.origin == location.origin) {
        switch (eventData.mode) {
            case 'codeUpdated':
                currentEDSCode = eventData.code;
                currentEDSScroll = -1;

                clearInterval(edsHeartbeatInterval);
                edsHeartbeatInterval = setInterval(edsHeartbeat, 3500);
                edsHeartbeat();
                break;
            case 'extraUpdated':
                currentExtraMessage = eventData.code;
                currentEDSScroll = -1;

                clearInterval(edsHeartbeatInterval);
                edsHeartbeatInterval = setInterval(edsHeartbeat, 3500);
                edsHeartbeat();

                break;
            case 'setOperator':
                updateOperator(eventData.operator);
                break;
        }
    }
});
