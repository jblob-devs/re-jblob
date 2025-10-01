import $ from 'jquery'
import { game } from './save.js'
import { dictionary } from './save.js'
import { saveGame } from './save.js'
import { shouldSave } from './save.js'
import Swal from 'sweetalert2'
$("#buyBlobsContainer").html(renderBuyableBlobs())
$("#blobListContainer").html(renderBlobList())
 $("#blobListHeader").html(renderBlobListHeader())

const displayGameTick = function(){
    if(shouldSave){
    saveGame()
    }
    $("#roundCoinsDisplay").html("Round Coins: " + game.currencyItems.roundCoins)
    const newBuyBlobContent = renderBuyableBlobs()
    const curBuyBlobContent = $("#buyBlobsContainer").html()
    if (curBuyBlobContent && newBuyBlobContent.trim() !== curBuyBlobContent.trim()) {
        $("#buyBlobsContainer").html(newBuyBlobContent);
    }
    
    $("#blobListHeader").html(renderBlobListHeader())
    $('#itemsContainer').html(renderInventoryItems())
    renderIdleBlobProgressUI()
    renderBlobList()
    renderLevelbar()
    checkLevel()
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

    const keys = realBlob.costType.split('.')
    let finalKey = keys[keys.length - 1]
    return `
        <div>
        <p>${realBlob.name}</p>
        <p>Cost: ${realBlob.cost} ${dictionary[finalKey].name}</p>
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
    let curCapacityUpdate = 0;
    for(let element in game.blobs){
        curCapacityUpdate += game.blobs[element].owned

    }
    game.curCapacity = curCapacityUpdate;
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
            progressText.text(`collect ${realBlob.curStorage} / ${realBlob.maxStorage * realBlob.owned}`)
        }
    })
}

function renderLevelbar(){
    const percentage = (game.exp / game.expNeededToLevel) * 100
    const $progressBar = $(`#levelDivInside`)
    const progressText = $(`#levelDivSpan`)
    $progressBar.css("width", percentage + "%");
    progressText.text(`Lv: ${game.level} (${game.exp} / ${game.expNeededToLevel})`)
}

function checkLevel(){
    if(game.exp >= game.expNeededToLevel){
        game.level ++
        game.exp = game.exp - game.expNeededToLevel
        game.expNeededToLevel = Math.round(game.expNeededToLevel * 1.25)
        Swal.fire({
            title: `Level up!`,
            text: `Leveled up to Lv. ${game.level}`,
            focusConfirm: false,
            allowEnterKey: false,
        })
    }
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
    const fullPath = blob.generateMaterial
    const keys = fullPath.split('.')
    let curPath = game
    for(let i = 0; i < keys.length - 1; i++){
        const key = keys[i]
        curPath = curPath[key]
    }
    let materialKey = keys[keys.length - 1]
    curPath[materialKey] += Number(blob.curStorage)
    blob.curStorage = 0

    checkArtifacts('on_blobCollect')
}

$("#blobListContainer").on("click", ".collect-bar", function(){
    const blobKey = $(this).data("blob-key");
    collectIdleRewards(blobKey);
    renderIdleBlobProgressUI();
});


function renderInventoryItems(){
    let insertHTML = ``;
    for(let itemKey in game.currencyItems){
        if(!(itemKey in dictionary)){
            console.warn(`Item key ${itemKey} not found in dictionary.`)
            continue
        }
        if(game.currencyItems[itemKey] > 0){
        insertHTML += `<div class="flex m-2 flex-col"><div class="flex flex-row"> <p class="mr-2">${dictionary[itemKey].name}: </p> <p>${game.currencyItems[itemKey]}</p></div><p class="order-2">${dictionary[itemKey].description}</p></div>`
        }
    }

    
return insertHTML
}


setInterval(function(){
    displayGameTick()
},100)