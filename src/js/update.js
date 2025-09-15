import $ from 'jquery'
import { game } from './save.js'
import { dictionary } from './save.js'

$("#buyBlobsContainer").html(renderBuyableBlobs())
$("#blobListContainer").html(renderBlobList())

const displayGameTick = function(){
    $("#roundCoinsDisplay").html("Round Coins: " + game.roundCoins)
    const newBuyBlobContent = renderBuyableBlobs()
    const curBuyBlobContent = $("#buyBlobsContainer").html()
    if (curBuyBlobContent && newBuyBlobContent.trim() !== curBuyBlobContent.trim()) {
        $("#buyBlobsContainer").html(newBuyBlobContent);
    }
    

    let checkcapacity = 0
    Object.keys(game.blobs).map((blobKey)=>{
        let realBlob = game.blobs[blobKey]
        checkcapacity += realBlob.owned
    })

    if(checkcapacity != game.curCapacity){
        game.curCapacity = checkcapacity
        $("#blobListHeader").html(renderBlobListHeader())
    }

    renderIdleBlobProgressUI()
}

const idleRewards = setInterval(function(){
Object.keys(game.blobs).map((blobKey)=>{
        generateIdleRewards(blobKey)
    })

},1000)


function renderBuyableBlobs(){
const content = game.buyableBlobs.map((blob)=>{
    let realBlob = game
    let attributes = blob.split('.')
    attributes.forEach(part => {
        realBlob = realBlob[part]
    })
    
    return `
        <div>
        <p>${realBlob.name}</p>
        <p>Cost: ${realBlob.cost} ${dictionary[realBlob.costType]}</p>
        <button data="${blob}" class="buyBlobButton base-button">Buy</button>
        </div>
        `;  
}).join('')
return content
}


function renderBlobList(){
    const content = Object.keys(game.blobs).map((blobKey)=>{
        let realBlob = game.blobs[blobKey]
        if(realBlob.owned >= 1){

            return `
            <div id="blob-${blobKey}" class="border border-gray-300 rounded-lg p-4 mb-4">


            <p class="font-semibold text-lg">${realBlob.name}</p>
            <p>( ${realBlob.owned} )</p>


            <div data-blob-key="${blobKey}" class="collect-bar w-full relative rounded-full border-1 h-6 hover:h-6.5 transition-all duration-300 justify-self-center m-3 border-green-600">
                <div id="progress-bar-${blobKey}" class=" bg-green-500 h-full rounded-full transition-all duration-500 absolute inset-0 z-0" style="width: 0%"></div>
                <span id="progress-text-${blobKey}" class="absolute inset-0 z-10 text-black flex items-center justify-center h-full pointer-events-none"></span>
                </div>   
             
             
            </div>
            `
        }
    }).join('')
    return content
}

function renderBlobListHeader(){
    return `
    <div>
    Blob Capacity: ${game.curCapacity} /  ${game.capacity}
    </div>
    `
}

function renderIdleBlobProgressUI(){
Object.keys(game.blobs).forEach((blobKey)=>{
        const realBlob = game.blobs[blobKey]
        if(realBlob.owned >= 1){
            const totalMax = realBlob.maxStorage * realBlob.owned
            const percentage = (realBlob.curStorage / totalMax) * 100
            const $progressBar = $(`#progress-bar-${blobKey}`)
            const progressText = $(`#progress-text-${blobKey}`)
            $progressBar.css("width", percentage + "%");
            console.log(realBlob.curStorage)
            progressText.text(`collect ${realBlob.curStorage * realBlob.owned} / ${realBlob.maxStorage * realBlob.owned}`)
        }
    })
}


function generateIdleRewards(blobKey){
const blob = game.blobs[blobKey]

if(blob.owned <= 0) return;

const totalMax = blob.maxStorage * blob.owned
if(blob.curStorage >= totalMax) return;

blob.curStorage += blob.generateAmount
if(blob.curStorage > totalMax) blob.curStorage = totalMax;
}

function collectIdleRewards(blobKey){
    const blob = game.blobs[blobKey]
    game[blob.generateMaterial] += blob.curStorage
    blob.curStorage = 0
}

$("#blobListContainer").on("click", ".collect-bar", function(){
    const blobKey = $(this).data("blob-key");
    collectIdleRewards(blobKey);
    renderIdleBlobProgressUI();
});


setInterval(function(){
    displayGameTick()
},100)