import $ from 'jquery'
import { game } from './save.js'
import shopContent from '../html/shop.html?raw'
import inventoryContent from '../html/inventory.html?raw'
import blobViewerContent from '../html/blobViewer.html?raw'
import Swal from 'sweetalert2'
import { dictionary } from './save.js'
import {checkArtifacts} from './item.js'
import { renderShopInventoryItem } from './shop.js'

$("#blobViewingContainer").html(blobViewerContent)

$("#circleClickButton").on("click", function(){
    game.currencyItems.roundCoins += game.clickStats.roundCoinsPerClick
    game.totalClicks++
    game.exp++
    checkArtifacts('on_click')
})

$("#blobDivTitle").on("click", function(){
$("#blobContainer").slideToggle("fast")
})


$("#shopButton").on("click", function(){
$("#shopContainer").html(shopContent)
renderShopInventoryItem()
$("#shopContainer").slideToggle("fast")
})


$("#inventoryButton").on("click", function(){
$("#inventoryContainer").html(inventoryContent)
//renderInventoryItems()
$("#inventoryContainer").slideToggle("fast", "linear")
})



$('#gameBody').on("click", ".closeModalButton", function(){
    const closeModal = $(this).attr("data")
    $(`#${closeModal}`).slideToggle("fast")
})
//listens for future buy blob buttons to be created and attachs it
$('#gameBody').on("click", ".buyBlobButton", function(){
    console.log('buying blob')
    const blobPath = $(this).attr("data")
    let realBlob = game
    let attributes = blobPath.split('.')

   
    attributes.forEach(part => {
        realBlob = realBlob[part]
    })
    let costCurrencyName = realBlob.costType
    const keys = costCurrencyName.split('.')
    let finalKey = keys[keys.length - 1]
    let curPath = game
    console.log(keys)
    for(let i = 0; i< keys.length - 1; i++){
        const key = keys[i]
        curPath = curPath[key]
    }
    console.log(curPath)
    if(curPath[finalKey] >= realBlob.cost){
        if(game.curCapacity+1 > game.capacity){
            Swal.fire({
                icon: 'error',
                text:'Not enough capacity!',
                footer: 'increase your capacity to hold more blobs!'
                
            })
        }else{
        curPath[finalKey] -= realBlob.cost
        realBlob.owned++
        Swal.fire({
            text:'succesfully bought ' + realBlob.name + "!",
        })
        }
        
    }else{
        Swal.fire({
            icon: 'error',
            text:'Not enough ' + dictionary[finalKey].name + "!",
        })
    }
})


export function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getFinalKey(fullPath){
    const keys = fullPath.split('.')
    return keys[keys.length - 1]
}