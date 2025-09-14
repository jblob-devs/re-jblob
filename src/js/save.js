export let game = {
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
}

export let dictionary = {
    "roundCoins": "Round Coins",
    "pointyCoins": "Pointy Coins",
    "flatCoins": "Flat Coins",
}