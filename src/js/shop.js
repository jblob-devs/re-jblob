import $ from 'jquery'
import { game } from './save'


const shopKeeperDialogue = setInterval(function(){
let randDialogue;
let dialogues = [
    "have i seen you before? i can't remember...",
    "take a look around. i know there's something you'll like",
    'not sure where these are from, but i like them',
    "strange items, stranger feelings about them",
    "they'll serve you better than they served me"
]
randDialogue = dialogues[Math.floor(Math.random()*dialogues.length)]
$("#shopkeeperTalkingDialogue").html('<i>' + randDialogue + '</i>')

},10000)


export function renderShopInventoryItem(){
    $("#buyInventoryContainer").empty()
    console.log(game.shopSlots)
    let listOfItems = Object.keys(shopItemDictionary)
    for( let i = 0; i < (game.shopSlots); i++){
        console.log('r')
        let randItem = listOfItems[Math.floor(Math.random()*listOfItems.length)]
        let item = shopItemDictionary[randItem]
        let itemHtml = 
        `<div class="m-2 p-2 rounded border border-black">
        <h3 class="text-xl font-bold">${item.name}</h3>
        <p>${item.description}</p>
        <p>Cost: ${item.costNumber} ${item.costType}</p>
        <button class="buyShopItemButton bg-green-500 p-2 rounded text-white" data="${randItem}">Buy</button>
        </div>`
        $("#buyInventoryContainer").append(itemHtml)
    }
}

class shopItem{
    constructor(name, description, costObject, buyFunction){
        this.name = name;
        this.description = description;
        this.costNumber = costObject.costNumber;
        this.costType = costObject.costType;
        this.buyFunction = buyFunction;
    }

    buy(){
         if(this.costNumber >= game[this.costType]){
        game[this.costType] -= this.costNumber
        Swal.fire({text:`bought ${this.name} + !`, footer: `${this.description}`})
        this.buyFunction()
    }else{
        Swal.fire({text:`cannot afford!`})
    }
    }
}

export let shopItemDictionary = {
    'minorCapacityOrb': new shopItem('Minor Capacity Orb', 'Increases your blob capacity by 1. Costs 100 Round Coins', {costNumber: 100, costType: 'roundCoins'}, function(){game.capacity++} ),
}

/*
$('#buyInventoryContainer').html(

)
*/


const shopRefresh = setInterval(function(){
renderShopInventoryItem()
},game.shopRefreshTimer)

