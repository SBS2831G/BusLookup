EDSTemplateSet['SMRT'] = {
    standardService: [
        { // Render svc
            variables: {
                serviceNumber: '$serviceNumber'
            },
            font: '$serviceFont',
            format: '<serviceNumber,,0>',
            spaceWidth: 2,
            align: 'right-width(1)'
        },
        { // Render DEST via ROAD [SVC]
            variables: {
                currentRoad: '$scrolls[]text',
                currentRoadFont: '$scrolls[]font',
                destination: '$destination.text',
                destinationFont: '$destination.font',
                via: ' via'
            },
            font: '$scrolls[]font',
            active: '$scrolls[]showDest{true}',
            format: ['<destination,destinationFont,9><via,destinationFont,9>', '<currentRoad,currentRoadFont,0>'],
            yPositions: [9, 0],
            spaceWidth: 1,
            align: 'centre-width[0]'
        },
        { // Render DEST [SVC]
            variables: {
                fullDestination: '$scrolls[]text'
            },
            font: '$scrolls[]font',
            active: '$!scrolls[]showDest{true}',
            format: {
                '$scrolls[]text(array?)': ['<fullDestination[0],,9>', '<fullDestination[1],,0>'], // Render multiline dest
                '$!scrolls[]text(array?)': ['<fullDestination,,1>'] // Render singleline dest
            },
            spaceWidth: 1,
            align: 'centre-width[0]'
        }
    ],
    '190-variant': [
        { // Render svc
            variables: {
                serviceNumber: '$serviceNumber'
            },
            font: '$serviceFont',
            format: '<serviceNumber,,0>',
            spaceWidth: 3,
            align: 'right'
        },
        { // Render DEST via ROAD [SVC]
            variables: {
                currentRoad: '$scrolls[]text',
                currentRoadFont: '$scrolls[]font',
                destination: '$destination.text',
                destinationFont: '$destination.font',
            },
            font: '$scrolls[]font',
            active: '$scrolls[]showDest{true}',
            format: ['<destination,destinationFont,9>', '<currentRoad,currentRoadFont,0>'],
            yPositions: [9, 0],
            spaceWidth: 1,
            align: 'centre-width[0]'
        },
        { // Render DEST [SVC]
            variables: {
                fullDestination: '$scrolls[]text'
            },
            font: '$scrolls[]font',
            active: '$!scrolls[]showDest{true}',
            format: {
                '$scrolls[]text(array?)': ['<fullDestination[0],,9>', '<fullDestination[1],,0>'], // Render multiline dest
                '$!scrolls[]text(array?)': ['<fullDestination,,1>'] // Render singleline dest
            },
            spaceWidth: 1,
            align: 'centre-width[0]'
        }
    ],
    full: [
        {
            variables: {
                text: '$text'
            },
            font: 'full',
            format: '<text,,0>',
            spaceWidth: 1,
            align: 'centre'
        }
    ],
    big: [
        {
            variables: {
                text: '$text'
            },
            font: 'big',
            format: '<text,,1>',
            spaceWidth: 1,
            align: 'centre'
        }
    ],
    efat: [
        {
            variables: {
                text: '$text'
            },
            font: 'efat',
            format: '<text,,1>',
            spaceWidth: 1,
            align: 'centre'
        }
    ],
    image: [
        {
            variables: {
                text: ''
            },
            font: 'thick',
            format: '<text,,>',
            spaceWidth: 0,
            align: 'centre',
            images: [
                {
                    name: '$image',
                    x: '$x'
                }
            ]
        }
    ]
}

EDSDataSet['SMRT'] = {
    1: {
        renderType: 'full',
        text: 'CHARTERED'
    },
    2: {
        renderType: 'big',
        text: 'ANG MO KIO DEPOT'
    },
    3: {
        renderType: 'big',
        text: 'KRANJI DEPOT'
    },
    4: {
        renderType: 'big',
        text: 'SMRT BUSES'
    },
    5: {
        renderType: 'big',
        text: 'OFF SERVICE'
    },
    6: {
        renderType: 'big',
        text: 'WOODLANDS DEPOT'
    },
    7: {
        renderType: 'big',
        text: 'OFF SERVICE'
    },
    8: {
        renderType: 'big',
        text: 'OFF SERVICE'
    },
    9: {
        renderType: 'full',
        text: 'ON DRIVING TEST'
    },
    10: {
        renderType: 'full',
        text: 'FERRY SERVICE'
    },
    11: {
        renderType: 'full',
        text: 'MRT SHUTTLE'
    },
    13: {
        renderType: 'full',
        text: 'TRAINING BUS'
    },
    14: {
        renderType: 'big',
        text: 'MoBi 190418'
    },
    16: {
        renderType: 'full',
        text: 'PULAU TEKONG'
    },
    18: {
        renderType: 'full',
        text: 'LRT SHUTTLE A'
    },
    19: {
        renderType: 'full',
        text: 'LRT SHUTTLE B'
    },
    66: {
        renderType: 'big',
        text: 'BULIM DEPOT'
    },
    113: {
        renderType: 'big',
        text: 'AIRSHOW SHUTTLE'
    },
    117: {
        renderType: 'image',
        text: 'SMRT',
        image: 'logo',
        x: 'centre'
    },
    118: {
        renderType: 'big',
        text: 'SMRT FLY OUR FLAG'
    },
    119: {
        renderType: 'efat',
        text: 'SMRT'
    },
    155: {
        renderType: 'big',
        text: 'FREE SHUTTLE BUS'
    },
    422: {
        renderType: 'standardService',
        serviceNumber: '187',
        serviceFont: 'full',
        destination: {
            text: 'BOON LAY',
            font: 'thick'
        },
        scrolls: [
            {
                text: ['BOON LAY', 'INT / MRT'],
                font: 'thick',
                showDest: false
            },
            {
                text: 'WOODLANDS AVE 3',
                font: 'thin'
            },
            {
                text: 'BUKIT PANJANG RD',
                font: 'thin'
            },
            {
                text: 'BUKIT BATOK WEST',
                font: 'thin'
            },
            {
                text: 'BT BATOK CTR, MRT',
                font: 'thin'
            },
            {
                text: 'JURONG EAST',
                font: 'thick'
            },
            {
                text: 'BOON LAY WAY',
                font: 'thick'
            }
        ]
    },
    423: {
        renderType: 'standardService',
        serviceNumber: '187',
        serviceFont: 'full',
        destination: {
            text: 'WOODLANDS INT',
            font: 'thin'
        },
        scrolls: [
            {
                text: ['WOODLANDS', 'INT / MRT'],
                font: 'thick',
                showDest: false
            },
            {
                text: 'BOON LAY WAY',
                font: 'thick'
            },
            {
                text: 'JURONG EAST',
                font: 'thick'
            },
            {
                text: 'BT BATOK CTR, MRT',
                font: 'thin'
            },
            {
                text: 'BUKIT BATOK WEST',
                font: 'thick'
            },
            {
                text: 'BUKIT PANJANG RD',
                font: 'thin'
            },
            {
                text: 'WOODLANDS AVE 3',
                font: 'thin'
            }
        ]
    },
    469: {
        renderType: 'standardService',
        serviceNumber: '172',
        serviceFont: 'full',
        destination: {
            text: 'BOON LAY',
            font: 'thin'
        },
        scrolls: [
            {
                text: ['BOON LAY', 'INT / MRT'],
                font: 'thick',
                showDest: false
            },
            {
                text: 'CHOA CHU KANG DRIVE',
                font: 'thin'
            },
            {
                text: 'CHOA CHU KANG AVE 1, 3',
                font: 'thin'
            },
            {
                text: 'CHOA CHU KANG RD',
                font: 'thin'
            },
            {
                text: 'BRICKLAND ROAD',
                font: 'thin'
            },
            {
                text: 'JALAN BEHAR',
                font: 'thin'
            }
        ]
    },
    470: {
        renderType: 'standardService',
        serviceNumber: '172',
        serviceFont: 'full',
        destination: {
            text: 'CHOA CHU KANG',
            font: 'thin'
        },
        scrolls: [
            {
                text: ['CHOA CHU KANG', 'INT / MRT / LRT'],
                font: 'thick',
                showDest: false
            },
            {
                text: 'JLN BOON LAY',
                font: 'thin'
            },
            {
                text: 'JALAN BEHAR',
                font: 'thin'
            },
            {
                text: 'CHOA CHU KANG RD',
                font: 'thin'
            },
            {
                text: 'BRICKLAND RD',
                font: 'thin'
            },
            {
                text: 'CHOA CHU KANG AVE 1, 3',
                font: 'thin'
            }
        ]
    },
    475: {
        renderType: 'standardService',
        serviceNumber: '188',
        serviceFont: 'full',
        destination: {
            text: 'HARBOURFRONT',
            font: 'thin'
        },
        scrolls: [
            {
                text: 'HARBOURFRONT',
                font: 'big',
                showDest: false
            },
            {
                text: 'CHOA CHU KANG WAY',
                font: 'thin'
            },
            {
                text: 'B. B WEST AVE 4, 2',
                font: 'thin'
            },
            {
                text: 'TOH GUAN ROAD',
                font: 'thin'
            },
            {
                text: 'BOON LAY WAY',
                font: 'thin'
            },
            {
                text: 'AYE, CLEMENTI RD',
                font: 'thin'
            } //Missing data oh noeses!!
        ]
    },
    497: {
        renderType: 'standardService',
        serviceNumber: '61',
        serviceFont: 'full',
        destination: {
            text: 'BUKIT BATOK',
            font: 'thin'
        },
        scrolls: [
            {
                text: ['BUKIT BATOK', 'INT / MRT'],
                font: 'thick',
                showDest: false
            },
            {
                text: 'UBI AVE 2',
                font: 'thin'
            },
            {
                text: 'MACPHERSON RD',
                font: 'thin'
            },
            {
                text: 'KALLANG BAHRU',
                font: 'thin'
            },
            {
                text: 'NORTH BRIDGE RD',
                font: 'thin'
            },
            {
                text: 'SOUTH BRIDGE RD',
                font: 'thin'
            },
            {
                text: 'TELOK BLANGAH RD',
                font: 'thin'
            },
            {
                text: 'HOLLAND RD',
                font: 'thin'
            },
            {
                text: 'CLEMENTI RD',
                font: 'thin'
            }

        ]
    },
    512: {
        renderType: 'standardService',
        serviceNumber: '970',
        serviceFont: 'full',
        destination: {
            text: 'SHENTON WAY',
            font: 'thin'
        },
        scrolls: [
            {
                text: ['SHENTON', 'WAY'],
                font: 'thick',
                showDest: false
            },
            {
                text: 'HILLVIEW RD, AVE',
                font: 'thin'
            },
            {
                text: 'JLN JURONG KECHIL',
                font: 'thin'
            },
            {
                text: 'DUNEARN RD',
                font: 'thin'
            },
            {
                text: 'SIXTH AVE',
                font: 'thin'
            },
            {
                text: 'COMMONWEALTH AVE',
                font: 'thin'
            },
            {
                text: 'KIM SENG ROAD',
                font: 'thin'
            },
            {
                text: 'EU TONG SEN ST',
                font: 'thin'
            }
        ]
    },
    528: {
        renderType: 'standardService',
        serviceNumber: '985',
        serviceFont: 'full',
        destination: {
            text: 'CHOA CHU KANG',
            font: 'thin'
        },
        scrolls: [
            {
                text: ['CHOA CHU KANG', 'INT / MRT / LRT'],
                font: 'thick',
                showDest: false
            },
            {
                text: 'SERANGOON RD',
                font: 'thin'
            },
            {
                text: 'JLN TOA PAYOH',
                font: 'thin'
            },
            {
                text: 'B.B EAST AVE 2, 4',
                font: 'thin'
            },
            {
                text: 'B.B WEST AVE 7',
                font: 'thin'
            },
            {
                text: 'TECK WHYE AVE',
                font: 'thin'
            }
        ]
    },
    529: {
        renderType: 'standardService',
        serviceNumber: '985',
        serviceFont: 'full',
        destination: {
            text: 'GEYLANG LOR 1',
            font: 'thin'
        },
        scrolls: [
            {
                text: ['GEYLANG LOR 1/', 'KALLANG MRT'],
                font: 'thick',
                showDest: false
            }
        ]
    },
    611: {
        renderType: 'standardService',
        serviceNumber: '176',
        serviceFont: 'full',
        destination: {
            text: 'BUKIT PANJANG',
            font: 'thin'
        },
        scrolls: [
            {
                text: 'BUKIT PANJANG',
                font: 'big',
                showDest: false
            },
            {
                text: 'TELOK BLANGAH RD',
                font: 'thin'
            },
            {
                text: 'JURONG TOWN HALL',
                font: 'thin'
            },
            {
                text: 'BT BATOK CTR/ MRT',
                font: 'thin'
            },
            {
                text: 'HILLVIEW AVENUE',
                font: 'thick'
            },
            {
                text: 'UPP BUKIT TIMAH RD',
                font: 'thin'
            }
        ]
    },
    614: {
        renderType: 'standardService',
        serviceNumber: '184',
        serviceFont: 'full',
        destination: {
            text: 'BUKIT PANJANG',
            font: 'thin'
        },
        scrolls: [
            {
                text: 'BUKIT PANJANG',
                font: 'big',
                showDest: false
            },
            {
                text: 'CLEMENTI RD',
                font: 'thick'
            },
            {
                text: 'UPP BUKIT TIMAH RD',
                font: 'thin'
            },
            {
                text: 'CASHEW RD',
                font: 'thick'
            },
            {
                text: 'BUKIT PANJANG RD',
                font: 'thin'
            }
        ]
    },
    619: {
        renderType: 'standardService',
        serviceNumber: '970',
        serviceFont: 'full',
        destination: {
            text: 'BUKIT PANJANG',
            font: 'thin'
        },
        scrolls: [
            {
                text: ['BUKIT', 'PANJANG'],
                font: 'thick',
                showDest: false
            },
            {
                text: 'NEW BRIDGE RD',
                font: 'thin'
            },
            {
                text: 'ZION RD',
                font: 'thin'
            }
        ]
    },
    1901: {
        renderType: '190-variant',
        serviceNumber: '190',
        serviceFont: 'full',
        destination: {
            text: 'KAMPONG BAHRU TER via',
            font: 'tall'
        },
        scrolls: [
            {
                text: ['KAMPONG BAHRU', 'TERMINAL'],
                font: 'thick',
                showDest: false
            },
            {
                text: 'BT PANJANG RD',
                font: 'thin'
            },
            {
                text: 'STEVENS RD',
                font: 'thin'
            },
            {
                text: 'ORCHARD RD',
                font: 'thin'
            },
            {
                text: 'HILL STREET',
                font: 'thin'
            },
            {
                text: 'CHINATOWN',
                font: 'thin'
            }
        ]
    },
    1902: {
        renderType: '190-variant',
        serviceNumber: '190',
        serviceFont: 'full',
        destination: {
            text: 'CHOA CHU KANG via',
            font: 'thin'
        },
        scrolls: [
            {
                text: ['CHOA CHU KANG', 'INT / MRT / LRT'],
                font: 'thick',
                showDest: false
            },
            {
                text: 'HILL STREET',
                font: 'thin'
            },
            {
                text: 'SOMERSET ROAD',
                font: 'thin'
            },
            {
                text: 'SCOTTS ROAD',
                font: 'thin'
            },
            {
                text: 'STEVENS ROAD',
                font: 'thin'
            },
            {
                text: 'BUKIT PANJANG RD',
                font: 'thin'
            }
        ]
    }
}

EDSExtraMessageSet['SMRT'] = {
    1: {
        text: ['MERRY CHRISTMAS', 'HAPPY NEW YEAR'],
        font: 'thick',
        align: 'centre',
        yPos: [9, 0]
    },
    2: {
        text: 'GONG XI FA CAI',
        font: 'full',
        align: 'centre',
        yPos: 0
    },
    3: {
        text: 'SELAMAT HARI RAYA',
        font: 'big',
        align: 'centre',
        yPos: 1
    },
    4: {
        text: ['HAPPY', 'DEEPAVALI'],
        font: 'thick',
        align: 'centre',
        yPos: [9, 0]
    },
    5: {
        text: ['EZ READER OUT OF ORDER', 'PLEASE PAY CASH'],
        font: 'thin',
        align: 'centre',
        yPos: [9, 0]
    },
    6: {
        text: 'LAST BUS',
        font: 'full',
        align: 'centre',
        yPos: 0
    }
}

EDSImageSet['SMRT'] = {
    logo: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
}
