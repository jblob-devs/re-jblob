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
window.handleLakeRipple = (event) => {
    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ripple = document.createElement('div');
    const size = 40;

    ripple.className = 'absolute border border-blue-200/60 rounded-full animate-ripple pointer-events-none z-50';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;

    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;

    container.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
};

export const warpLocationDictionary = {
    'SlimedLake': {
        name: 'Slimed Lake',
        description: 'A pleasant lake full of life. It can get a bit slimy when it rains.',
        render: () => `
       <div class="SlimedLakeLocation relative flex items-center justify-center p-10 overflow-visible" 
             id="slime-lake" 
             onclick="handleLakeRipple(event)">
            
            <div class="relative w-80 h-80 group cursor-pointer">
                <div class="absolute inset-0 bg-blue-900/40 blur-xl animate-wobble-slow"></div>

                <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 shadow-2xl animate-wobble overflow-hidden"
                     style="box-shadow: inset 10px -20px 40px rgba(0,0,0,0.3);">
                    
                    <div class="absolute inset-2 bg-white/10 animate-wobble-slow" 
                         style="border-radius: inherit;"></div>

                    <div class="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-t-2 border-blue-300/20 rounded-full animate-pulse"></div>
                    
                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span class="text-blue-100 font-bold tracking-widest uppercase text-xs drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            Slimed Lake
                        </span>
                    </div>
                </div>
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