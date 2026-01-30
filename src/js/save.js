import $ from 'jquery'
import { defaultsDeep } from 'lodash';
export let shouldSave = true;
export let game = {
    level: 1,
    exp:0,
    expNeededToLevel: 100,
    clickStats:{
        totalClicks: 0,
        roundCoinsPerClick: 1,
        pointyCoinsPerClick: 1,
        flatCoinsPerClick: 1,
    },
    blobs:{
        basicBlob:{
            name: "Basic Blob",
            image: 'basicBlob',
            cost: 30,
            costType: "currencyItems.roundCoins",
            owned:1,
            level: 1,
            generateMaterial: "currencyItems.roundCoins",
            generateAmount: 1,
            generateInterval: 1000,
            maxStorage: 10,
            curStorage: 0,
        }
    },
    buyableBlobs: ['blobs.basicBlob'],
    capacity: 3,
    curCapacity: 1,
    shopRefreshTimer: 5000, //ms
    shopSlots: 3,
    currencyItems:{
        roundCoins: 0,
        pointyCoins: 0,
        flatCoins: 0,
        bronzeKeys: 0,
        artifactShards: 0,
        bloblets: 0,
        bloodStones: 0,
        gearBits: 0,
    },
    artifacts:[
    ],
    unlockedAltars:[

    ],
    unlockedWarpLocations:[

    ]
}

let emptyGameFile = JSON.parse(JSON.stringify(game))


export let dictionary = {
    "roundCoins": {name: "Round Coins", description: 'smooth and round coins'},
    "pointyCoins":{name: "Pointy Coins", description: 'three pointed coins'},
    "flatCoins": {name: "Flat Coins",description:'boxy coins with dull edges'},
    'bronzeKeys': {name: "Bronze Keys", description:'a faded key made of bronze'},
    'artifactShards': {name: "Artifact Shards", description:'broken pieces of mysterious artifacts. perhaps they can be reforged?'},
    'bloblets': {name: "Bloblets", description:'a strange unnerving light emanates from these'},
    'bloodStones': {name: "Blood Stones", description:"it's blood. maybe"},
    'gearBits': {name: "Gear Bits", description:'morphing pieces of an unknown metaloid'} 
}

export const warpLocationDictionary = {
    'SlimedLake': {
        name: 'Slimed Lake',
        description: 'A pleasant lake full of life. It can get a bit slimy when it rains.',
        render: () => `
       <div class="SlimedLakeLocation relative w-full h-96 overflow-hidden bg-blue-900 rounded-xl cursor-pointer" id="slime-lake">
            <div class="slime-bg"></div>
            <div class="blob blob-1"></div>
            <div class="blob blob-2"></div>
    
        <div class="relative z-10 p-6 text-green-100 pointer-events-none">
        <h1 class="text-3xl font-bold italic tracking-wider">Slimed Lake</h1>
        <p class="mt-2 opacity-80" id="slime-status">The surface is thick and bubbling...</p>
        </div>
        </div>
        `
    }
}

export function saveGame(){
    localStorage.setItem("gameData", JSON.stringify(game))
}

export function saveLoadedGame(data){
    localStorage.setItem("gameData", JSON.stringify(data))
}

export function loadGame(){
const savedData = localStorage.getItem("gameData")
if(savedData){
    const parsedData = JSON.parse(savedData)
    const mergedData = defaultsDeep({}, parsedData, emptyGameFile)
    game = mergedData
    saveGame()
}
}

$(`#clearSave`).on("click", function(){
    if(confirm('are you SURE you want to delete your save')){

    shouldSave = false
    localStorage.removeItem('gameData')
    //only clears the values below for now
    //have to fix at later date possibly by copying the blank save file first
    saveLoadedGame(emptyGameFile)
    game = emptyGameFile
    //loadGame()
    shouldSave = true;
    }else{
        alert('save NOT deleted')
    }
})



loadGame()