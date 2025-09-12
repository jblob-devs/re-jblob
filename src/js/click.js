import $ from 'jquery'
import { game } from './save.js'
import shopContent from '../html/shop.html?raw'
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