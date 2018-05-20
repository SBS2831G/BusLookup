let width = 144, height = 16;

let renderLedCache = [];

let EDSTemplateSet = {};
let EDSDataSet = {};
let EDSImageSet = {};
let EDSTemplates = {};
let EDSData = {};
let EDSImages = {};
let EDSExtraMessageSet = {};
let EDSExtraMessage = {};

for (let x = 0; x < width; x++) {
    renderLedCache.push([]);
    for (let y = 0; y < height; y++) {
        renderLedCache[x].push([]);
    }
}

function getTextWidth(chars, font, spaceWidth) {
    return chars.map(char => {
        if (!fonts[font]) return 0;

        let charData = fonts[font][char];
        if (!charData) return spaceWidth + 4;

        if (Object.prototype.toString.call(charData) !== '[object Array]') {
            return fonts[font][char].data[0].length + spaceWidth;
        }

        return fonts[font][char][0].length + spaceWidth;
    }).reduce((a, b) => a + b, 0) - spaceWidth;
}

function drawTextWithAlignment(segments, spaceWidth, align, lineNumber) {
    let offset = align.offset,
    textWidth = align.totalLineWidths[lineNumber],
    alignment = align.align;

    let startX = 0;

    switch (alignment) {
        case 'centre':
            startX = Math.round((width + offset) / 2 - textWidth / 2);
            break;
        case 'right':
            startX = width + offset - textWidth;
            break;
        default:
            startX = offset;
            break;
    }

    segments.forEach(segment => {
        let text = segment.text,
            font = segment.font,
            yPos = segment.yPos;

        startX += drawText(text, font, spaceWidth, startX, yPos);
    });
}

function drawText(text, font, spaceWidth, xPos, yPos) {
    let chars = [...text];

    let startX = xPos * 1;

    font = font || 'thick';
    spaceWidth = spaceWidth || 1;
    xPos = xPos || 0;
    yPos = yPos || 0;

    chars.forEach(char => {
        xPos += showChar(char, font, xPos, yPos) + spaceWidth;
    });

    return xPos - startX;
}

function showChar(char, type, dx, dy) {
    if (!(type in fonts)) return;

    let charData = fonts[type][char];
    if (!charData) {
        charData = fonts['unknown-char'];
    }

    if (Object.prototype.toString.call(charData) !== '[object Array]') {
        dy += charData.offset;
        charData = charData.data;
    }

    let charWidth = charData[0].length;
    let charHeight = charData.length;

    for (let y = 0; y < charHeight; y++) {
        for (let x = 0; x < charWidth; x++) {
            setLED(x + dx, y - (dy || 0) + (height - charHeight), charData[y][x]);
        }
    }
    return charWidth;
}

function drawImage(imageName, xPos) {
    let imageData = EDSImages[imageName];
    let imageWidth = imageData[0].length;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < imageWidth; x++) {
            setLED(xPos + x, y, imageData[y][x]);
        }
    }
}

function setLED(x, y, state) {
    if (!renderLedCache[x]) return;
    let led = renderLedCache[x][y];

    if (led === undefined) return;

    renderLedCache[x][y] = typeof state === 'boolean' ? state : (state === 0 ? false : true);
}

function clearLEDs() {
    clearRect(0, 0, width, height);
}

function clearRect(sx, sy, ex, ey) {
    for (let y = sy; y < ey; y++) {
        for (let x = sx; x < ex; x++) {
            setLED(x, height - y - 1, false);
        }
    }
}

function edsToMatrix() {
    return renderLedCache;
}

function parseRule(rule) {
    let specialChars = ['[', ']', '.', '!', '{', '}', '(', ')'];
    let opening = ['[', '(', '{'];
    let closing = [']', ')', '}'];
    let tokens = [];
    let currentToken = '';
    let parseDepth = 0;

    [...rule].forEach(char => {
        if (!specialChars.includes(char)) currentToken += char;
        else {
            if (opening.includes(char)) {
                parseDepth++;

                if (currentToken !== '')
                    tokens.push(currentToken);
                if (parseDepth == 1) currentToken = '';
                currentToken += char;
            } else if (closing.includes(char)) {
                parseDepth--;
                if (parseDepth == 0) {
                    currentToken += char;
                    tokens.push(currentToken);
                    currentToken = '';
                }
            } else {
                if (currentToken !== '')
                    tokens.push(currentToken);
                tokens.push(char);
                currentToken = '';
            }
        }
    });

    if (currentToken !== '') tokens.push(currentToken);

    return tokens.filter(Boolean);
}

function simpleParse(text) {
    let parserFunctions = [Number, (text) => text === 'true'];

    return parserFunctions.map(func => func(text)).filter(result => Boolean(result) || !isNaN(result))[0];
}

function parseVariables(variableRules, edsData, arrayPos) {
    let variablePool = {},
        variableNames = Object.keys(variableRules);

    variableNames.forEach(variableName => {
        let arrayPos_ = arrayPos.slice(0);
        let variableRule = variableRules[variableName];
        if (variableRule.startsWith('$')) { // grab data from eds data
            variableRule = parseRule(variableRule.slice(1));

            let specialChars = ['[', ']', '.', '!', '{', '}', '(', ')'];
            let currentState = 'assignment';
            let currentVariable = null;
            let skipNext = false;
            let negate = false;

            variableRule.forEach((token, i) => {
                if (skipNext) {
                    skipNext = false;
                    return;
                }

                if (!specialChars.includes(token.slice(0, 1))) { //variable name
                    let prevVariableName = variableRule[i - 1];

                    if (prevVariableName === '[]') {
                        currentVariable = currentVariable[token];
                    } else
                        currentVariable = edsData[token];
                } else {
                    if (token === '!') {
                        negate = !negate;
                    } else if (token === '[]') {
                        let prevVariableName = variableRule[i - 1];
                        currentVariable = edsData[prevVariableName][arrayPos_.shift()];
                    } else if (token === '.') {
                        let nextVariableName = variableRule[i + 1];
                        currentVariable = currentVariable[nextVariableName];
                        skipNext = true;
                    } else if (token.startsWith('{') && token.endsWith('}')) {
                        if (currentVariable === undefined) {
                            currentVariable = simpleParse(token.slice(1, -1));
                        }
                    } else if (token.startsWith('(') && token.endsWith(')')) {
                        let comparisonType = token.slice(1, -2);

                        let objectClass = Object.prototype.toString.call(currentVariable).slice(8, -1).toLowerCase();
                        currentVariable = (objectClass === comparisonType);
                    }
                }
            });

            if (currentState === 'assignment') {
                if (negate)
                    variablePool[variableName] = !currentVariable;
                else
                    variablePool[variableName] = currentVariable;
            }
        } else { // literal
            variablePool[variableName] = variableRule;
        }
    });

    return variablePool;
}

function parseFormat(format, variablePool, defaultFont) {
    let lines = format;
    if (Object.prototype.toString.call(format).slice(8, -1) !== 'Array') {
        lines = [format];
    }
    let lineTokens = lines.map(e => e.split(/(<[^>]\w+,\w+,\d+>)/).filter(Boolean));

    return lineTokens.map(lines => {
        return lines.map(token => {
            if (token.startsWith('<')) {
                let tokenData = token.slice(1, -1).split(',');

                if (tokenData[0].includes('[') && tokenData[0].endsWith(']')) {
                    let variableName = tokenData[0].slice(0, tokenData.indexOf('[') - 2);
                    let arrayIndex = tokenData[0].slice(tokenData.indexOf('[') - 1  , -1);

                    return {
                        text: variablePool[variableName][arrayIndex],
                        font: variablePool[tokenData[1]] || defaultFont,
                        yPos: (variablePool[tokenData[2]] === undefined ? tokenData[2] : variablePool[tokenData[2]]) || 0
                    }
                }

                return {
                    text: variablePool[tokenData[0]],
                    font: variablePool[tokenData[1]] || defaultFont,
                    yPos: (variablePool[tokenData[2]] === undefined ? tokenData[2] : variablePool[tokenData[2]]) || 0
                }
            } else {
                return {
                    text: token,
                    font: defaultFont,
                    yPos: 0
                }
            }
        });
    });
}

function calculateRenderWidth(guideline) {
    let widths = [];

    guideline.format.forEach(lineFormat => {
        let lineWidth = 0;

        lineFormat.forEach(formatSection => {
            lineWidth += getTextWidth([...formatSection.text], formatSection.font, guideline.spaceWidth);
        })
        widths.push(lineWidth);
    });

    return widths;
}

function parseAlignment(alignment, index, allGuidelines) {
    let parts = alignment.split(/(\w+)([+-].+)?/).filter(Boolean);

    let totalLineWidths = calculateRenderWidth(allGuidelines[index]);

    if (parts.length === 1) return {align: parts[0], offset: 0, totalLineWidths};
    let mainAlignment = parts[0];
    parts = parts[1].split(/([+-])?(\w+)([\[(]\d+[\])])/).filter(Boolean);
    let offset = 0;

    for (let i = 0; i < parts.length; i += 3) {
        let sign = parseInt(parts[i] + '1'), type = parts[i + 1], arg = parts[i + 2];
        if (type === 'width') {
            let argContent = arg.slice(1, -1);
            if (arg.startsWith('[')) {
                offset += sign * calculateRenderWidth(allGuidelines[argContent]).sort((a, b) => a-b)[0];
            } else if (arg.startsWith('(')) {
                offset += sign * argContent
            }
        } else if (type === 'image') {
            let argContent = arg.slice(1, -1);
            let currentImage = EDSImages[allGuidelines[index].images[argContent].name];

            offset += sign * currentImage[0].length;
        }
    }

    return {align: mainAlignment, offset, totalLineWidths};
}

function renderEDS(currentEDSCode, currentEDSScroll, currentExtraMessage) {
    if (currentEDSScroll === -1 && currentExtraMessage !== 0) {
        let extraMessageFormat = EDSExtraMessage[currentExtraMessage];

        clearLEDs();

        let text = extraMessageFormat.text;
        if (Object.prototype.toString.call(text) === '[object String]') {
            let font = extraMessageFormat.font, align = extraMessageFormat.align;
            let textWidth = getTextWidth([...text], font, 1);

            let startX = 0;

            switch (align) {
                case 'centre':
                    startX = Math.floor(width / 2 - textWidth / 2);
                    break;
                case 'right':
                    startX = width - textWidth;
                    break;
                default:
                    startX = 0;
                    break;
            }

            drawText(text, font, 1, startX, extraMessageFormat.yPos);
        } else {
            let font = extraMessageFormat.font, align = extraMessageFormat.align;

            text.forEach((line, i) => {
                let textWidth = getTextWidth([...line], font, 1);
                let startX = 0;

                switch (align) {
                    case 'centre':
                        startX = Math.floor(width / 2 - textWidth / 2);
                        break;
                    case 'right':
                        startX = width - textWidth;
                        break;
                    default:
                        startX = 0;
                        break;
                }

                drawText(line, font, 1, startX, extraMessageFormat.yPos[i]);
            });
        }

        let matrixData = edsToMatrix();

        parent.postMessage(JSON.stringify({
            type: 'controller-preview',
            matrix: matrixData
        }), parent.location.toString());

        return;
    }

    let edsData = EDSData[currentEDSCode];
    let edsFormat = EDSTemplates[edsData.renderType];
    let renderGuidelinesWithoutAlignment = [];

    edsFormat.forEach(renderGuideline => {
        let guidelineActive = parseVariables({_: renderGuideline.active || 'true'}, edsData, [currentEDSScroll])._;
        if (!guidelineActive) return;

        let variablePool = parseVariables(renderGuideline.variables, edsData, [currentEDSScroll]);

        let mainFont = parseVariables({_: renderGuideline.font}, edsData, [currentEDSScroll])._;

        let format;

        if (Object.prototype.toString.call(renderGuideline.format).slice(8, -1) === 'Array') { // Multiline format
            format = parseFormat(renderGuideline.format, variablePool, mainFont);
        } else if (Object.prototype.toString.call(renderGuideline.format).slice(8, -1) === 'Object') { // Choose format from condition
            let formatSelectionRules = Object.keys(renderGuideline.format).map(rule => {
                return parseVariables({_: rule}, edsData, [currentEDSScroll])._;
            });

            let firstTrue = formatSelectionRules.indexOf(true);
            if (firstTrue === -1) return; // Couldn't get format so inactivate render guideline

            format = parseFormat(renderGuideline.format[Object.keys(renderGuideline.format)[firstTrue]], variablePool, mainFont);
        } else { // Singleline format
            format = parseFormat(renderGuideline.format, variablePool, mainFont);
        }

        renderGuidelinesWithoutAlignment.push({
            format, spaceWidth: renderGuideline.spaceWidth, align: renderGuideline.align,
            images: (renderGuideline.images || []).map(image => {
                let xPos;
                if (typeof image.x === 'number')
                    xPos = image.x;
                else {
                    xPos = parseVariables({_: image.x}, edsData, [currentEDSScroll])._;
                }
                return {
                    name: parseVariables({_: image.name}, edsData, [currentEDSScroll])._,
                    x: xPos
                }
            })
        });
    });

    let renderGuidelines = renderGuidelinesWithoutAlignment.map((guideline, i) => {
        guideline.align = parseAlignment(guideline.align, i, renderGuidelinesWithoutAlignment);
        return guideline;
    });

    // console.log(JSON.stringify(renderGuidelines, null, 2))

    clearLEDs();

    function simpleAlign(type, imageLength) {
        switch(type) {
            case 'left':
                return 0;
            case 'centre':
                return Math.round(144 / 2 - imageLength / 2);
            case 'right':
                return 144 - imageLength;

            default:
                return 0;
        }
    }

console.log(renderGuidelines)

    renderGuidelines.forEach(guideline => {
        let align = guideline.align;
        let spaceWidth = guideline.spaceWidth;
        let textLines = guideline.format;

        let lineCount = textLines.length;

        textLines.forEach((line, i) => {
            drawTextWithAlignment(line, spaceWidth, align, i);
        });

        if (guideline.images)
            guideline.images.forEach(image => {
                if (typeof image.x === 'string') {
                    image.x = simpleAlign(image.x, EDSImages[image.name][0].length);
                }
                drawImage(image.name, image.x);
            });
    });

    let matrixData = edsToMatrix();
}
