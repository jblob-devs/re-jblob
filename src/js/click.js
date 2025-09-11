import $ from 'jquery'
import { game } from './save.js'
$("#circleClickButton").on("click", function(){
    game.roundCoins += game.clickStats.roundCoinsPerClick
    game.totalClicks++
})

$("#blobDivTitle").on("click", function(){
$("#blobContainer").slideToggle("slow")
})