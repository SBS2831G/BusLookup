let width = 40, height = 20;

let ledCache = [];

let ledsInverted = false;

function generateLEDCssCode() {
    let pixelSize = Math.ceil(window.innerWidth * 0.013);

    let cssData =
`
    .led {
        width: ${pixelSize}px;
        height: ${pixelSize}px;
    }

    #led-container {
        width: ${40 * Math.ceil(window.innerWidth * 0.018)}px;
        grid-template-columns: repeat(40, ${Math.ceil(window.innerWidth * 0.018)}px);
        grid-row-gap: ${Math.ceil(window.innerWidth * 0.002)}px;
        grid-auto-rows: ${Math.ceil(window.innerWidth * 0.018)}px;
    }
`;

    document.getElementById('led-style').textContent = cssData;
}

window.addEventListener('resize', () => {
    generateLEDCssCode();
});

window.addEventListener('load', () => {
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

    setTimeout(showBootupText, 1500);
});

function showBootupText() {
    showChar(0, 'tiny', 1, 13);
    showChar(1, 'tiny', 9, 13);
    showChar(0, 'tiny', 15, 13);
    showChar(1, 'tiny', 23, 13);
    showChar(0, 'tiny', 29, 13);

    showChar(5, 'tiny', 1, 5);
    showChar('.', 'tiny', 9, 5);
    showChar(0, 'tiny', 15, 5);
    showChar(0, 'tiny', 22, 5);
    showChar('R', 'tiny', 29, 5);

    setTimeout(() => {
        clearLEDs();
    }, 1250);
}

function setLEDState(x, y, state) {
    if (!ledCache[x]) return;
    let led = ledCache[x][y];

    if (!led) return;

    state = state ^ ledsInverted;

    var state = 'led-' + (state ? 'on' : 'off');
    led.className = 'led ' + state;
}


function getTextWidth(chars, font, spaceWidth) {
    return chars.map(char => charSet[font][char][0].length + spaceWidth).reduce((a, b) => a + b, 0) - spaceWidth;
}

function writeText(text, font, spaceWidth, xPos, yPos) {
    let chars = [...text];

    font = font || 'fat';
    spaceWidth = spaceWidth || 3;
    xPos = xPos || 0;
    yPos = yPos || 0;

    chars.forEach(char => {
        xPos += showChar(char, font, xPos, yPos) + spaceWidth;
    });
}


function showSmallText(line, yPos) {
    let chars = [...line];

    let totalWidth = getTextWidth(chars, 'frontSmall', 1);

    let xPos = Math.floor(40 / 2 - totalWidth / 2);

    writeText(line, 'frontSmall', 1, xPos, yPos);

}

function showChar(char, type, dx, dy) {
    if (!(type in charSet)) return;
    if (!(char in charSet[type])) return;

    let charData = charSet[type][char];

    let charWidth = charData[0].length;
    let charHeight = charData.length;

    for (let y = 0; y < charHeight; y++) {
        for (let x = 0; x < charWidth; x++) {
            setLEDState(x + dx, y - (dy || 0) + (height - charHeight), charData[y][x]);
        }
    }
    return charWidth;
}

function clearLEDs() {
    clearRect(0, 0, width, height);
}

function clearRect(sx, sy, ex, ey) {
    for (let y = sy; y < ey; y++) {
        for (let x = sx; x < ex; x++) {
            setLEDState(x, y, false);
        }
    }
}

let lastState = '', lastEvent = {};

window.addEventListener('message', event => {
    let eventData = JSON.parse(event.data);
    if (event.origin === location.origin) {
        switch (eventData.type) {
            case 'special-code':
                lastState = 'handleSpecialCode';
                lastEvent = eventData;
                handleSpecialCode(eventData);
                break;
            case 'svc-update':
                lastState = 'handleSvcUpdate';
                lastEvent = eventData;
                handleSvcUpdate(eventData);
                break;
            case 'set-swt':
                lastState = 'setSWT';
                lastEvent = eventData;
                setSWT(eventData);
                break;
            case '106-easter':
                lastState = 'run106Easter';
                lastEvent = eventData;
                run106Easter();
                break;

            case 'led-invert':
                ledsInverted = eventData.state;

                window[lastState](lastEvent);
                break;
        }
    }
});

function run106Easter() {
    clearLEDs();
    var numbers = [...'106'];

    var curX = 3;

    numbers.forEach(number => {
        curX += showChar(number, 'fat', curX) + 1;
    });
}

function setSWT(event) {
    clearLEDs();

    let svc = event.svc;
    let font = '';

    if (svc.length === 2) { // 9A
        font = 'fat';
    }
    if (svc.length === 3) { // 21A
        font = 'medium';
    }
    if (svc.length === 4) { // 241A
        font = 'thin';
    }

    var numbers = [...svc.toString()];

    var curX = 3;

    numbers.forEach(number => {
        curX += showChar(number, font, curX) + 1;
    });
}

function handleSpecialCode(event) {
    let code = event.code;
    switch (code) {
        case '1':
            for (let x = 0; x < width; x++)
                for (let y = 0; y < height; y++)
                    setLEDState(x, y, true);
            break;
        case '1111':
            clearLEDs();
            showSmallText('OFF', 11);
            showSmallText('SERVICE', 2);
            break;
        case '2222':
            clearLEDs();
            showSmallText('SBS', 11);
            showSmallText('TRANSIT', 2);
            break;
        case '4444':
            clearLEDs();
            showSmallText('ON', 11);
            showSmallText('TEST', 2);
            break;
        case '5555':
            clearLEDs();
            showSmallText('TRAINING', 11);
            showSmallText('BUS', 2);
            break;
        case '3333':
            clearLEDs();
            showSmallText('FREE', 11);
            showSmallText('SHUTTLE', 2);
            break;
        case '9999':
            clearLEDs();
            break;
    }
}

function handleSvcUpdate(event) {
    let svc = event.svc;

    if (svc === '609') svc = 'DTL';

    console.log('rear: change to ' + svc)

    clearLEDs();

    var numbers = [...svc.toString()];

    var curX = 3;

    let font = '';

    let length = numbers.length;
    if (length < 3) font = 'fat';
    else if (length === 3) font = 'medium';
    else font = 'thin';

    numbers.forEach(number => {
        curX += showChar(number, font, curX) + 1;
    });
}
