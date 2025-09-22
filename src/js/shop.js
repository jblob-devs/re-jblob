import $ from 'jquery'
import { game } from './save'
import { dictionary } from './save';
import Swal from 'sweetalert2'

const shopKeeperDialogue = setInterval(function(){
let randDialogue;
let dialogues = [
    "have i seen you before? i can't remember...",
    "take a look around. i know there's something you'll like",
    'not sure where these are from, but i like them',
    "strange items, stranger feelings about them",
    "they'll serve you better than they served me",
    "i don't eat carrots. i had a friend who was a carrot",
    "treasures from afar? not for me",
    "i don't see the appeal. to each their own i guess"
]
randDialogue = dialogues[Math.floor(Math.random()*dialogues.length)]
$("#shopkeeperTalkingDialogue").html('<i>' + randDialogue + '</i>')

},10000)


export function renderShopInventoryItem(){
    $("#buyInventoryContainer").empty()
    let listOfItems = Object.keys(shopItemDictionary)
    for( let i = 0; i < (game.shopSlots); i++){
        let randItem = listOfItems[Math.floor(Math.random()*listOfItems.length)]
        let item = shopItemDictionary[randItem]
        let itemHtml = 
        `<div class="m-1 p-2 rounded shadow-md">
        <h3 class="p-2 text-xl font-bold">${item.name}</h3>
        <p>${item.description}</p>
        <p>Cost: ${item.costNumber} ${dictionary[item.costType].name}</p>
        <button class="buyShopItemButton base-button bg-green-200 p-2 rounded text-black" data-item="${randItem}">Buy</button>
        </div>`
        $("#buyInventoryContainer").append(itemHtml)
    }
}


$(document).off().on("click", ".buyShopItemButton", function(){
    let itemName = $(this).data("item")
    let item = shopItemDictionary[itemName]
    item.buy()
})
class shopItem{
    constructor(name, description, costObject, buyFunction){
        this.name = name;
        this.description = description;
        this.costNumber = costObject.costNumber;
        this.costType = costObject.costType;
        this.buyFunction = buyFunction;
    }

    buy(){
        let costPath = (game.currencyItems[this.costType])
        if(costPath){
            if(costPath >= this.costNumber ){
            game.currencyItems[this.costType] -= this.costNumber
            Swal.fire({text:`bought ${this.name}!`, footer: `${this.description}`})
            this.buyFunction()
        }
    }else{
        Swal.fire({text:`cannot afford!`})
    }
    }
}

export let shopItemDictionary = {
    'minorCapacityOrb': new shopItem('Minor Capacity Orb', 'Increases your blob capacity by 1.', {costNumber: 100, costType: 'roundCoins'}, function(){game.capacity++} ),
    'bronzeKey': new shopItem('Bronze Key', `${dictionary['bronzeKeys'].description}. probably opens a corresponding chest.`, {costNumber: 300, costType: 'roundCoins'}, function(){game.currencyItems.bronzeKeys++} ),
}

/*
$('#buyInventoryContainer').html(

)
*/


const shopRefresh = setInterval(function(){
renderShopInventoryItem()
},game.shopRefreshTimer)

