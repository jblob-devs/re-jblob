import $ from 'jquery'
import { game } from './save.js'
import shopContent from '../html/shop.html?raw'
import Swal from 'sweetalert2'
import { dictionary } from './save.js'
$("#circleClickButton").on("click", function(){
    game.roundCoins += game.clickStats.roundCoinsPerClick
    game.totalClicks++
})

$("#blobDivTitle").on("click", function(){
$("#blobContainer").slideToggle("slow")
})

$("#shopButton").on("click", function(){
$("#shopContainer").html(shopContent)
$("#shopContainer").slideToggle("slow")
})


//listens for future buy blob buttons to be created and attachs it
$(document).on("click", ".buyBlobButton", function(){
    const blobPath = $(this).attr("data")
    let realBlob = game
    let attributes = blobPath.split('.')
    attributes.forEach(part => {
        realBlob = realBlob[part]
    })
    let costCurrencyName = realBlob.costType
    let costCurrency = game[costCurrencyName]
    if(costCurrency >= realBlob.cost){
        if(game.curCapacity+1 > game.capacity){
            Swal.fire({
                icon: 'error',
                text:'Not enough capacity!',
                footer: 'increase your capacity to hold more blobs!'
                
            })
        }else{
        game[costCurrencyName] -= realBlob.cost
        realBlob.owned++
        Swal.fire({
            text:'succesfully bought ' + realBlob.name + "!",
        })
        }
        
    }else{
        Swal.fire({
            icon: 'error',
            text:'Not enough ' + dictionary[costCurrencyName] + "!",
        })
    }
})