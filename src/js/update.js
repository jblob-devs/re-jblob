import $ from 'jquery'
import { game } from './save.js'
const displayGameTick = function(){
    $("#roundCoinsDisplay").html("Round Coins: " + game.roundCoins)
    
}

setInterval(function(){
    displayGameTick()
},100)