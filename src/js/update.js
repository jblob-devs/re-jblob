import $ from 'jquery'
import { game } from './save.js'


$("#buyBlobsContainer").html(renderBuyableBlobs())

const displayGameTick = function(){
    $("#roundCoinsDisplay").html("Round Coins: " + game.roundCoins)

    const newBlobContent = renderBuyableBlobs()
    let curBlobContent = $("#buyBlobsContainer").html()
    if (newBlobContent.trim() !== curBlobContent.trim()) {
        $("#buyBlobsContainer").html(newBlobContent);
    }
}
function renderBuyableBlobs(){
const content = game.buyableBlobs.map((blob)=>{
    let realBlob = game
    let attributes = blob.split('.')
    attributes.forEach(part => {
        realBlob = realBlob[part]
    })
    
    return `
        <div class="">
        <p>${realBlob.name}</p>
        <p>Cost: ${realBlob.cost}</p>
        <button class="base-button">Buy</button>
        </div>
        `;  
}).join('')
return content
}

setInterval(function(){
    displayGameTick()
},100)