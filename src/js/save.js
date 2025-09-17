export let game = {
    level: 1,
    roundCoins: 0,
    pointyCoins: 0,
    flatCoins: 0,
    clickStats:{
        totalClicks: 0,
        roundCoinsPerClick: 1,
        pointyCoinsPerClick: 1,
        flatCoinsPerClick: 1,
    },
    blobs:{
        basicBlob:{
            name: "Basic Blob",
            cost: 30,
            costType: "roundCoins",
            owned:1,
            level: 1,
            generateMaterial: "roundCoins",
            generateAmount: 1,
            generateInterval: 1000,
            maxStorage: 10,
            curStorage: 0,
        }
    },
    buyableBlobs: ['blobs.basicBlob'],
    capacity: 3,
    curCapacity: 0,
    shopRefreshTimer: 5000, //ms
    artifacts:{
    }
}

export let shopItems = {
 "1":{
    'capacity': {name: '+1',cost: 30, costType: 'game.roundCoins', }
 }
}

export let dictionary = {
    "roundCoins": "Round Coins",
    "pointyCoins": "Pointy Coins",
    "flatCoins": "Flat Coins",
}

export function saveGame(){
    localStorage.setItem("gameData", JSON.stringify(game))
}

export function loadGame(){
const savedData = localStorage.getItem("gameData")
if(savedData){
    game = JSON.parse(savedData)
}
}

loadGame()