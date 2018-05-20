let width = 160, height = 20;

let currentSvc = '', currentDirection = 1, currentDest = '', currentLoopPoint = '', currentRouteType, isUsingSmallFont;

let terminalRoad = '', terminalBusStop = '';
let currentScrollPos = 0;
let ledCache = [];

let ledsInverted = false;

function generateLEDCssCode() {
    let pixelSize = Math.ceil(window.innerWidth * 0.005);

    let cssData =
`
    .led {
        width: ${pixelSize}px;
        height: ${pixelSize}px;
    }

    #led-container {
        width: ${160 * Math.ceil(window.innerWidth * 0.0055)}px;
        grid-template-columns: repeat(160, ${Math.ceil(window.innerWidth * 0.0055)}px);
        grid-row-gap: ${Math.ceil(window.innerWidth * 0.0004)}px;
        grid-auto-rows: ${Math.ceil(window.innerWidth * 0.0055)}px;
    }
`;

    document.getElementById('led-style').textContent = cssData;
}

window.addEventListener('resize', () => {
    generateLEDCssCode();
})

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

    setTimeout(bootupSequence, 1500);
});

function bootupSequence() {
    for (let x = 0; x < width; x++) {
        setTimeout(() => {
            setColumn(x, true);
        }, x * 5);
    }
    setTimeout(() => {
        for (let x = 0; x < width; x++) {
            setTimeout(() => {
                setColumn(x, false);
            }, x * 5);
        }
    }, 1000);
}

function getTextWidth(chars, font, spaceWidth) {
    return chars.map(char => !!charSet[font][char] ? charSet[font][char][0].length + spaceWidth : spaceWidth + 4).reduce((a, b) => a + b, 0) - spaceWidth;
}

function writeSmallText(text, yPos, svcWidth) {
    font = 'rearText';

    spaceWidth = 1;

    let chars = [...text];
    let totalWidth = getTextWidth(chars, font, spaceWidth);
    let totalHeight = charSet[font][chars[0]].length;

    let xPos = Math.floor((width - svcWidth) / 2 - totalWidth / 2);

    writeText(text, font, spaceWidth, xPos, yPos, false);
}

function writeTextCentered(text, font, spaceWidth, baseY, rightWidth) {
    font = font || 'fat';
    spaceWidth = spaceWidth || 3;

    let chars = [...text];
    let totalWidth = getTextWidth(chars, font, spaceWidth);
    let totalHeight = charSet[font][chars[0]].length;

    let xPos = Math.floor((width - (rightWidth || 0)) / 2 - totalWidth / 2);
    let yPos = baseY !== undefined ? baseY : Math.floor(height / 2 - totalHeight / 2);

    writeText(text, font, spaceWidth, xPos, yPos);
}

function writeText(text, font, spaceWidth, xPos, yPos, shoudClearLEDs) {
    if (shoudClearLEDs)
        clearLEDs();
    let chars = [...text];

    font = font || 'fat';
    spaceWidth = spaceWidth || 3;
    xPos = xPos || 0;
    yPos = yPos || 0;

    chars.forEach(char => {
        xPos += showChar(char, font, xPos, yPos) + spaceWidth;
    });
}


function showSvc(svcNumber) {
    if (svcNumber.endsWith('e')) svcNumber = '  ' + svcNumber;

    let chars = [...svcNumber.toString()];

    let totalWidth = getTextWidth(chars, 'fat', 2);

    let xPos = width - totalWidth - 1;

    clearRect(xPos, 0, width, height);

    chars.forEach(char => {
        xPos += showChar(char, 'fat', xPos) + 2;
    });
}

function determineFont(dest, svc, routeType) {
    if (routeType === 'TOWNLINK') {
        return 'frontSmall';
        // if (svc.startsWith('8') && svc.length === 3) { // Yishun svc
        //     return 'frontSmall';
        // } else return 'frontSmall';
    }
    if (routeType === 'FEEDER') {
        if (svc.startsWith('8') && svc.length === 3) { // Yishun svc
            return 'frontSmallDest';
        } else {
            if (dest.length > 16) {
                return 'frontSmall'
            }
            return 'frontFat';
        }
    }
    if (routeType === 'INDUSTRIAL') {
        if (!dest.startsWith('>')) {
            if (dest.length > 23)
                return 'frontSmallDest';
            return 'frontSmall';
        } else return 'frontFat';
    }
    if (dest.includes('-')) {
        if (dest.length > 16 || (svc.startsWith('8') && svc.length === 3)) {
            return 'frontSmallDest';
        }

        return 'frontSmall';
    }
    if (dest.length > 16)
        return 'frontSmall';
    return 'frontFat';
}

function showDest(dest) {
    let chars = [...dest.toString()];

    let yOff = 0;

    let font = determineFont(dest, currentSvc, currentRouteType);

    isUsingSmallFont = false;

    if (font === 'frontSmall') yOff = 1;
    else if (font === 'frontSmallDest') yOff = 3, isUsingSmallFont = true;

    // if (dest.length > 15) {
    //     font = 'frontSmall'
    //     yOff = 1;
    // }
    //
    // if (dest.length > 22 && dest.includes('-')) {
    //     isUsingSmallFont = true;
    //     font = 'frontSmallDest';
    //     yOff = 3;
    // } else {
    //     isUsingSmallFont = false;
    // }


    let totalWidth = getTextWidth(chars, font, 1);

    let xPos = 1;

    clearRect(0, 0, totalWidth, 10 + yOff);

    chars.forEach((char, i) => {
        let spacing = 1;

        if (char === '-' || chars[i + 1] === '-') spacing = 0;

        xPos += showChar(char, font, xPos, yOff) + 1;
    });
}

function showSvcInfo(line) {
    let chars = [...line.toString()];

    let font = isUsingSmallFont ? 'frontSmallDest' : 'frontSmall';

    let totalWidth = getTextWidth(chars, font, 1);

    let xPos = 1;

    clearRect(0, 12, totalWidth - 1, height);

    chars.forEach(char => {
        xPos += showChar(char, font, xPos, 12) + 1;
    });
}

function setColumn(x, state) {
    for (let y = 0; y < height; y++) {
        setLEDState(x, y, state);
    }
}

function setLEDState(x, y, state) {
    if (!ledCache[x]) return;
    let led = ledCache[x][y];

    if (!led) return;

    state = state ^ ledsInverted;

    var state = 'led-' + (state ? 'on' : 'off');
    led.className = 'led ' + state;
}

function showChar(char, type, dx, dy) {
    if (!(type in charSet)) return;

    let charData = charSet[type][char];
    if (!charData) {
        charData = charSet['unknown-char'];
    }

    let charWidth = charData[0].length;
    let charHeight = charData.length;

    for (let y = 0; y < charHeight; y++) {
        for (let x = 0; x < charWidth; x++) {
            setLEDState(x + dx, y - (dy || 0) + (height - charHeight), charData[y][x]);
        }
    }
    return charWidth;
}

function showImage(name) {
    let imageData = charSet.images[name];

    if (!imageData) return;

    for (let x = 0; x < imageData.length; x++) {
        for (let y = 0; y < imageData[0].length; y++) {
            setLEDState(x, y, imageData[x][y]);
        }
    }

}

function clearLEDs() {
    clearRect(0, 0, width, height);
}

function clearRect(sx, sy, ex, ey) {
    for (let y = sy; y < ey; y++) {
        for (let x = sx; x < ex; x++) {
            setLEDState(x, height - y - 1, false);
        }
    }
}

let lastState = '', lastEvent = {};

window.addEventListener('message', event => {
    let eventData = JSON.parse(event.data);
    if (event.origin === location.origin) {
        switch (eventData.type) {
            case 'svc-update':
                lastState = 'handleSvcUpdate';
                lastEvent = eventData;
                handleSvcUpdate(eventData);
                break;
            case 'special-code':
                lastState = 'handleSpecialCode';
                lastEvent = eventData;
                handleSpecialCode(eventData);
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

            case 'mrt-shuttle':
                lastState = 'mrtShuttle';
                lastEvent = eventData;
                handleMRTShuttle(eventData);
                break;

            case 'char-test':
                lastState = 'charTest';
                lastEvent = eventData;
                runCharTest(eventData);
                break;

            case 'led-invert':
                ledsInverted = eventData.state;

                window[lastState](lastEvent, 1);
                break;
        }
    }
});
//function writeText(text, font, spaceWidth, xPos, yPos, shoudClearLEDs)
//function getTextWidth(chars, font, spaceWidth)

function runCharTest() {
    clearLEDs();
    clearInterval(edsScrollInterval);

    let hidden = ['106Easter', 'images', 'unknown-char'];

    let currentX = width + 10;
    let fontsets = Object.keys(charSet).filter(e => !hidden.includes(e)).sort();
    let currentFontset = fontsets.shift();

    let allChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let textWidth = getTextWidth([...allChars], currentFontset, 1);

    edsScrollInterval = setInterval(() => {
        writeText(allChars, currentFontset, 1, --currentX, 0, true);

        if (currentX < -textWidth) {
            currentFontset = fontsets.shift();

            if (currentFontset === undefined) {
                clearInterval(edsScrollInterval);
                return;
            }
            textWidth = getTextWidth([...allChars], currentFontset, 1);
            currentX = width + 10;
        }
    }, 1000 / 120);
}

function doEDSScroll() {
    clearLEDs();

    if (currentSvc.endsWith('e')) {
        showImage('fastForward');
        showSvc(currentSvc);
    } else if (currentRouteType === 'EXPRESS') {
        showImage('express');
        showSvc(currentSvc);
    } else if (currentDest === 'CITY DIRECT') {
        writeText(currentDest, 'fat', 1);
        showSvc(currentSvc);
    } else if (currentDest === 'PREMIUM' || currentDest === 'NITE OWL') {
        writeText(currentDest, 'fat', 2);
        showSvc(currentSvc);
    } else if (currentRouteType === 'SWT') {
        clearLEDs();
        let lowerLine = terminalRoad.toUpperCase() + ' (' + terminalBusStop.toUpperCase() + ')';

        let svcWidth = getTextWidth([...currentSvc], 'fat', 2);
        if (lowerLine.length > 32) {
            writeSmallText('TERMINATE AT ' + terminalRoad.toUpperCase(), 11, svcWidth);
            writeSmallText('(' + terminalBusStop.toUpperCase() + ')', 3, svcWidth);
        } else {
            writeSmallText('TERMINATE AT', 11, svcWidth);
            writeSmallText(lowerLine, 3, svcWidth);
        }

        showSvc(currentSvc);
    } else {
        try {
            if (currentSvc === '609')
                showSvc('DTL');
            else
                showSvc(currentSvc);
        } catch (e) {}

        try {
            showDest(currentDest);
        } catch (e) {}

        var data = EDSData[currentSvc];
        if (!data) return;
        if (!data[currentDirection]) return;

        if ((currentScrollPos + 1) > data[currentDirection].length) {
            currentScrollPos = 0;
        }

        showSvcInfo(data[currentDirection][currentScrollPos++].toUpperCase());
    }
}

function run106Easter() {
    clearInterval(edsScrollInterval);

    console.log('front: 106 wong tai sin')
    clearLEDs();

    writeTextCentered('WDS', '106Easter', 1, 7, 15);
    writeTextCentered('wong tai sin', '106Easter', 1, 0, 15);
    showSvc('106');
}

function shortenRoadName(roadName) {
    return roadName.replace('Jurong', 'Jur').replace('West ', 'W.').replace('East ', 'E.');
}

let edsScrollInterval = 0;

function setSWT(event) {
    let svc = event.svc,
    roadName = event.roadName,
    busStopName = event.busStopName;

    currentRouteType = 'SWT';

    currentSvc = svc;
    terminalRoad = roadName;
    terminalBusStop = busStopName;

    clearInterval(edsScrollInterval);

    doEDSScroll();
}

function handleMRTShuttle(event) {
    let shuttleID = parseInt(event.code).toString();
    let direction = Number(event.direction);
    clearInterval(edsScrollInterval);

    let routeType = 'SHUTTLE';
    if (!MRTShuttles[shuttleID] && !!MRTShuttles[shuttleID + 'E']) shuttleID = shuttleID + 'E', routeType = 'EXPRESS';

    let routeDetails = MRTShuttles[shuttleID].map(e => e.toUpperCase());

    console.log(routeType, routeDetails);

    clearLEDs();
    writeTextCentered(routeType + ' ' + parseInt(shuttleID), 'frontSmall', 1, 11);
    writeTextCentered(routeDetails[0 ^ direction] + ' - ' + routeDetails[1 ^ direction], 'frontSmall', 1, 3);

}

function handleSpecialCode(event) {
    let code = event.code;
    clearInterval(edsScrollInterval);

    switch (code) {
        case '1':
            for (let x = 0; x < width; x++)
                for (let y = 0; y < height; y++)
                    setLEDState(x, y, true);
            break;
        case '1111':
            clearLEDs();
            writeTextCentered('OFF SERVICE');
            break;
        case '2222':
            showImage('sbst-front');
            break;
        case '4444':
            clearLEDs();
            writeTextCentered('ON TEST');
            break;
        case '5555':
            clearLEDs();
            writeTextCentered('TRAINING BUS');
            break;
        case '3333':
            clearLEDs();
            writeTextCentered('FREE SHUTTLE', 'fat', 2);
            break;
        case '7777':
            clearLEDs();
            writeTextCentered('FREE BRIDGING BUS', 'medium', 2);
            break;
        case '9999':
            clearLEDs();
            writeTextCentered('VER. 14SEP14-DD', 'frontVersion', 1);
            break;
    }
}

function determineDest(dest, svc, routeType, loopPoint) {
    if (routeType === 'TRUNK' && loopPoint) {
        if (dest === '> LOR 1 GEYLANG TER')
            dest = '> GEYLANG'
        if (dest.includes('TAMPINES')) {
            dest = '> TAMP INT';
            loopPoint = loopPoint.replace('Tampines', 'Tamp');
        }
        if (dest.includes('KAMPONG BAHRU')) {
            dest = '> KG BAHRU TER';
        }

        return dest.slice(2) + '-' + loopPoint;
    }
    if (routeType === 'FEEDER' || routeType === 'TRUNK') {
        if (svc.startsWith('8') && svc.length === 3 && loopPoint) { // Yishun svc
            return dest.slice(2) + '-' + loopPoint;
        }
        return dest;
    }
    if (routeType === 'INDUSTRIAL') {
        if (svc !== '252' && svc.startsWith('25') || svc.startsWith('18') && svc.length === 3) {
            return dest.slice(2) + '-' + loopPoint;
        } else if (svc.startsWith('24') && svc.length === 3) {
            return dest;
        }
        return dest;
    }
    if (routeType === 'TOWNLINK') {
        if (svc.startsWith('8') && svc.length === 3) { // Yishun svc
            return '> ' + loopPoint;
        } else {
            return dest.slice(2) + '-' + loopPoint;
        }
    }
    if (routeType === 'EXPRESS') {
        return 'EXPRESS';
    }
    if (routeType === 'NIGHT SERVICE') {
        return 'NITE OWL';
    }
    if (routeType === 'CITY_LINK') {
        return 'CITY DIRECT';
    }
    if (routeType.includes('FLAT FARE')) {
        return 'PREMIUM';
    }
}

function handleSvcUpdate(event, preventReset) {
    let svc = event.svc,
        dest = event.dest,
        direction = event.direction,
        loopPoint = shortenRoadName(event.loopPoint),
        routeType = event.routeType;

    console.log('front: change to', svc, dest);
    clearLEDs();

    currentSvc = svc;
    currentDirection = 1 + direction;
    currentLoopPoint = loopPoint;
    currentRouteType = routeType;

    currentDest = determineDest(dest, svc, routeType, loopPoint).toUpperCase();


    if (!preventReset)
        currentScrollPos = 0;
    else
        currentScrollPos--;

    if (!preventReset) {
        clearInterval(edsScrollInterval);
        edsScrollInterval = setInterval(doEDSScroll, 5000);
    }

    doEDSScroll();
}
