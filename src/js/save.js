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
            owned:1,
            level: 1,
        }
    },
    buyableBlobs: ['blobs.basicBlob'],
}