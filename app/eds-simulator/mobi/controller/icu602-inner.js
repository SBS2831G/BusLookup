let choiceScreenScrolls = {
    dest: 0,
    extra: 0
}

let currentScreen = '';
let currentFilter = '';

let currentDest = 0;
let currentExtra = 0;


let previewCanvas;

function setPreview(data) {
    let nodes = document.getElementById('output-info').children;
    let linePrefixes = ['Line : ', 'Dest : ', 'Extr : '];

    if (data.length !== 3) return;
    data.forEach((e, i) => {
        nodes[i].textContent = linePrefixes[i] + e;
    });
}

function homeScreenInit() {
    document.getElementById('function-label-row').innerHTML = '<div><span>Dest</span></div><div><span>Extra</span></div>';
}

function destScreenInit() {
    document.getElementById('function-label-row').innerHTML = '<div><span>Sort</span></div>';

    let allCodes = Object.keys(EDSData).sort((a, b) => a - b);

    choiceScreenScrolls.dest = Math.max(allCodes.indexOf(currentDest), 0);

    paintDestScreen();
}

function extraScreenInit() {
    document.getElementById('function-label-row').innerHTML = '<div><span>Sort</span></div>';

    let allCodes = Object.keys(EDSExtraMessage).sort((a, b) => a - b);

    choiceScreenScrolls.extra = Math.max(allCodes.indexOf(currentExtra), 0);

    paintExtraScreen();
}

function paintChoiceScreen(screenName, dataSource, previewFunction, filter) {
    filter = filter || null;
    if (!dataSource) {
        document.getElementById('table-'+ screenName).innerHTML = '';
        return;
    }

    let allCodes = Object.keys(dataSource).sort((a, b) => a - b).filter(code => !dataSource[code].hidden);

    if (!!filter) {
        allCodes = allCodes.filter(code => code.toString().startsWith(filter));
    }

    let startCode = Math.max(0, choiceScreenScrolls[screenName] - choiceScreenScrolls[screenName] % 3);

    function createDestRow(code, dest, selected) {
        return `<div class='${screenName}-table-item'><span>${code}</span><span></span><span>${dest}</span></div>`;
    }

    let html = '';
    for (let i = startCode; i < startCode + 3; i++) {
        let destData = dataSource[allCodes[i]];
        if (!destData) continue;

        html += createDestRow(allCodes[i], previewFunction(destData));
    }

    document.getElementById('table-'+ screenName).innerHTML = html;

    if (allCodes.length > 0)
        document.getElementsByClassName(screenName + '-table-item')[choiceScreenScrolls[screenName] % 3].className = screenName + '-table-item selected-row';
}

function paintDestScreen() {
    paintChoiceScreen('dest', EDSData, function createPreview(data) {
        if (!!data.text) return data.text.toString().slice(0, 32);
        else if (!!data.destination.text) return (data.destination.text + ' ' + data.serviceNumber).slice(0, 32);
    }, currentFilter);
}


function paintExtraScreen() {
    paintChoiceScreen('extra', EDSExtraMessage, function createPreview(data) {
        return data.text.toString().slice(0, 32);
    }, currentFilter);
}

function setScreen(screen) {
    let allStates = ['home', 'dest', 'extra'];
    function hideScreens() {
        allStates.forEach(e => document.getElementById('screen-' + e).style = 'display: none');
    }

    currentScreen = screen;

    hideScreens();

    document.getElementById('screen-' + screen).style.display = '';

    window[screen + 'ScreenInit']();
}

function updateOperator(operator) {
    EDSTemplates = EDSTemplateSet[operator];
    EDSData = EDSDataSet[operator];
    EDSExtraMessage = EDSExtraMessageSet[operator];
    EDSImages = EDSImageSet[operator];

    choiceScreenScrolls.dest = choiceScreenScrolls.extra = 0;
    setScreen('home');
}

function showScreen(matrix) {
    let scaleFactor = 4;
    let ctx = previewCanvas.getContext('2d');
    ctx.clearRect(0, 0, 144 * scaleFactor, 16 * scaleFactor);
    ctx.beginPath();
    matrix.forEach((column, x) => {
        column.forEach((pixel, y) => {
            if (pixel) {
                ctx.fillRect(x * scaleFactor, y * scaleFactor, scaleFactor, scaleFactor);
            }
        });
    });

    ctx.stroke();
}

window.addEventListener('message', (event) => {
    let eventData = JSON.parse(event.data);

    if (eventData.type === 'controller-preview-update') {
        renderEDS(eventData.code, eventData.scroll, eventData.extra);

        showScreen(edsToMatrix());
        return;
    }

    if (eventData.mode === 'setOperator') {
        updateOperator(eventData.operator);
        return;
    }

    if (eventData.mode === 'updateCode') {
        handleCodeUpdate(eventData.code, eventData.data);
        return;
    }

    if (eventData.mode === 'selectService') {
        setScreen('dest');
        return;
    }

    if (eventData.mode === 'selectExtra') {
        setScreen('extra');
        return;
    }

    if (eventData.mode === 'homePage') {
        setScreen('home');

        currentFilter = '';
        return;
    }

    if (eventData.mode === 'pressUp') {
        choiceScreenScrolls[currentScreen]--;

        if (choiceScreenScrolls[currentScreen] < 0) choiceScreenScrolls[currentScreen] = 0;

        if (currentScreen === 'dest')
            paintDestScreen();
        else if (currentScreen === 'extra')
            paintExtraScreen();
        return;
    } else if (eventData.mode === 'pressDown') {
        let dataSource = {
            dest: EDSData,
            extra: EDSExtraMessage
        }

        let allCodes = Object.keys(dataSource[currentScreen]).filter(code => !dataSource[currentScreen][code].hidden);

        if (!!currentFilter) {
            allCodes = allCodes.filter(code => code.toString().startsWith(currentFilter));
        }

        choiceScreenScrolls[currentScreen]++;

        if (choiceScreenScrolls[currentScreen] >= allCodes.length)
            choiceScreenScrolls[currentScreen] = allCodes.length - 1;

        if (currentScreen === 'dest')
            paintDestScreen();
        else if (currentScreen === 'extra')
            paintExtraScreen();
        return;
    }

    if (eventData.mode === 'keyPressed') {

        Object.keys(choiceScreenScrolls).forEach(key => choiceScreenScrolls[key] = 0);

        currentFilter += eventData.key;

        if (currentScreen === 'dest')
            paintDestScreen();
        else if (currentScreen === 'extra')
            paintExtraScreen();
        return;
    }

    if (eventData.mode === 'enterPressed') {
        let dataSource = {
            dest: EDSData,
            extra: EDSExtraMessage
        }
        let allCodes = Object.keys(dataSource[currentScreen]).sort((a, b) => a - b);

        if (!!currentFilter) {
            allCodes = allCodes.filter(code => code.toString().startsWith(currentFilter));
        }

        let currentCode = allCodes[choiceScreenScrolls[currentScreen]];

        if (currentScreen === 'extra' && currentFilter * 1 === 0) {
            handleExtraUpdate(0);
            currentExtra = 0;
        }

        if (currentCode) {
            if (currentScreen === 'dest') {
                handleCodeUpdate(currentCode);
                currentDest = currentCode;
            } else if (currentScreen === 'extra') {
                handleExtraUpdate(currentCode);
                currentExtra = currentCode;
            }
        }

        setScreen('home');
        setPreview([0, currentDest, currentExtra]);

        currentFilter = '';
        return;
    }
});

function handleExtraUpdate(code) {
    parent.postMessage(JSON.stringify({
        mode: 'extraUpdated',
        code: code
    }), parent.location.toString());
}

function handleCodeUpdate(code) {
    parent.postMessage(JSON.stringify({
        mode: 'codeUpdated',
        code: code
    }), parent.location.toString());
}

window.addEventListener('load', () => {
    setScreen('home');
    updateOperator('SMRT');
    setPreview([0, 0, 0]);
    previewCanvas = document.getElementById('preview-canvas');

    let ctx = previewCanvas.getContext('2d');
    ctx.fillStyle = 'black';
});
