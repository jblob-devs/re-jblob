import $, { event } from 'jquery'
import { game } from './save'
import { dictionary } from './save';
import Swal from 'sweetalert2'
import { artifactDictionary } from './item';

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
    let listOfItems = Object.keys(ItemDictionary)
    for( let i = 0; i < (game.shopSlots); i++){
        let randItem = listOfItems[Math.floor(Math.random()*listOfItems.length)]
        let item = ItemDictionary[randItem]
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

export function renderOpenableShopItem(){
$("#openOpenablesContainer").empty()
$("#openOpenablesContainer").html(
    `
    <div>
    <p>Bronze chest</p>
    <p>A very typical chest, containing items fit for 3rd place</p>
    <p>Cost: 1 bronze key</p>
    <button data-chest-type='bronze' data-currency-type="currencyItems.bronzeKeys" data-currency-needed="1" class="openOpenableButton">Open</button>
    
    <p>Blood Chest</p>
    <p>'Donde esta mi amigo?' - jorge. A sacrifice is needed.</p>
    <p>Cost: 1 basic blob</p>
    <button data-chest-type='bronze' data-currency-type="blobs.basicBlob.owned" data-currency-needed="1" class="openOpenableButton">Open</button>
    </div>
    `
)
}


$('#gameBody').off("click", ".buyShopItemButton").on("click", ".buyShopItemButton", function(){
    let itemName = $(this).data("item")
    let item = ItemDictionary[itemName]
    item.buy()
})

$('#gameBody').off("click", ".openOpenableButton").on("click", ".openOpenableButton", function(){
    let chestType = $(this).data('chest-type')
    let currencyType = $(this).data('currency-type')
    let currencyAmount = $(this).data('currency-needed')
    const fullPath = currencyType
    const keys = fullPath.split('.')
    let curPath = game
    for(let i = 0; i < keys.length - 1; i++){
        const key = keys[i]
        curPath = curPath[key]
    }

    let materialKey = keys[keys.length - 1]
    if(curPath[materialKey] >= currencyAmount){
        curPath[materialKey] -= Number(currencyAmount)
        rollChestLoot(chestType)
    }else{
        Swal.fire({
            text: `You don't have the materials to open this chest `
        })
    }
    
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
        console.log('buying ')
        let costPath = (game.currencyItems[this.costType])
        console.log(costPath)
    if(costPath){
            if(costPath >= this.costNumber ){
            game.currencyItems[this.costType] -= this.costNumber
            Swal.fire({text:`bought ${this.name}!`, footer: `${this.description}`})
            this.buyFunction()
        } else{console.log('cantafford')
        Swal.fire({text:`cannot afford!`})
        }
    }else{
       console.log('internal error, costType not defined')
    }
    }
}

export let ItemDictionary = {
    'minorCapacityOrb': new shopItem('Minor Capacity Orb', 'Increases your blob capacity by 1.', {costNumber: 100, costType: 'roundCoins'}, function(){game.capacity++} ),
    'bronzeKey': new shopItem('Bronze Key', `${dictionary['bronzeKeys'].description}. probably opens a corresponding chest.`, {costNumber: 300, costType: 'roundCoins'}, function(){game.currencyItems.bronzeKeys++} ),
    'Round Stone': new shopItem('Round Stone [Artifact]', `${artifactDictionary.roundStone.descriptionEffect({id:'roundStone' ,level: 1, owned: 1})}`, {costNumber: 1000 , costType: 'roundCoins'}, function(){artifactDictionary.roundStone.give(1)})
}

/*
$('#buyInventoryContainer').html(

)
*/

renderOpenableShopItem()
const shopRefresh = setInterval(function(){
renderShopInventoryItem()
renderOpenableShopItem()
},game.shopRefreshTimer)

