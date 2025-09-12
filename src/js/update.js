import $ from 'jquery'
import { game } from './save.js'
const displayGameTick = function(){
    $("#roundCoinsDisplay").html("Round Coins: " + game.roundCoins)
    
}

function renderBuyableBlobs(){
const content = game.buyableBlobs.map((blob)=>{
    return `
    <div class="">
        <p>${blob.name}
    `
})

}
setInterval(function(){
    displayGameTick()
},100)