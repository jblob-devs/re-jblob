import {game} from './save'
import {getRandomInt} from './click.js'

function giveItem(item){
    let exist = false;
    for(let i =0; i < game.artifacts.length; i++){
        if(game.artifacts[i].id === item.id){
            game.artifacts[i].owned += 1
            exist = true;
            break;
        }
    }
     if(!exist){
        game.artifacts.push(item)
    }

}

export let artifactDictionary = {
    'roundStone': {
        name: 'Round Stone',
        description: 'a very round stone.',
        chance: (artifact_data)=>{
        return 0.1 + (artifact_data.level * 0.05)
        },
        descriptionEffect: (artifact_data)=>{
            const calcChance=  artifactDictionary.roundStone.chance(artifact_data)
        return ` ${(calcChance * 100).toFixed(0)}% chance to generate additional round coins when collecting blob production.`
        },
        effect:{
            type:'on_click',
            execute: (artifact_data) =>{
                const triggerchance =  artifactDictionary.roundStone.chance(artifact_data) * 100
                console.log(triggerchance)
                if(Math.floor(Math.random()*100) < triggerchance ){
                    game.currencyItems.roundCoins += artifact_data.level * 3
                    console.log('round stone triggered')
                }
            }
        },
        give: (startlevel)=>{
            giveItem({id: 'roundStone', level: startlevel, owned: 1})
        }
    },
    'plantableSeedling': {
        name: 'Plantable Seedling',
        description: 'A seed that just desperate to be planted. Will you plant it?.',
        chance: (artifact_data)=>{
        return 0.05
        },
        descriptionEffect: (artifact_data)=>{
            const calcChance=  artifactDictionary.plantableSeedling.chance(artifact_data)
            if(artifact_data.grown){
                return `It seems to have grown...give it a nudge to see what it's turned into.`
            }else{
            return ` ${(calcChance * 100).toFixed(0)}% chance to grow on clicking the tap button. Check back in to see if it's grown.`
            }
        },
        effect:{
            type:'on_click',
            execute: (artifact_data) =>{
                const triggerchance =  artifactDictionary.plantableSeedling.chance(artifact_data) * 100
                if(Math.floor(Math.random()*100) < triggerchance ){
                    artifact_data.grown = true;
                }
            }
        },
        give: (startlevel)=>{
            giveItem( {id: 'plantableSeedling', level: startlevel, grown: false, owned: 1})
        }
    }, 'DamagedAnvil': {
        name: 'damaged anvil',
        description: 'blobs can use it to make metal, sometimes, when it works',
        chance: (artifact_data)=>{
        return 0.1 + (artifact_data.level * 0.1)
        },
        descriptionEffect: (artifact_data)=>{
            const calcChance=  artifactDictionary.roundStone.chance(artifact_data)
        return ` ${(calcChance * 100).toFixed(0)}% chance to generate gear bits on collecting blob production`
        },
        effect:{
            type:'on_blobCollect',
            execute: (artifact_data) =>{
                const triggerchance =  artifactDictionary.roundStone.chance(artifact_data) * 100
                console.log(triggerchance)
                if(Math.floor(Math.random()*100) < triggerchance ){
                    game.currencyItems.gearBits += artifact_data.level * getRandomInt(1,3)
                    console.log('anvil trigger')
                }
            }
        },
        give: (startlevel)=>{
            giveItem({id: 'damagedAnvil', level: startlevel, owned: 1})
        }
    }, 'threePetaledFlower': {
        name: 'Three Petaled Flower',
        description: 'it only has 3 petals, maybe someone picked them?',
        chance: (artifact_data)=>{
        return 1
        },
        descriptionEffect: (artifact_data)=>{
            const calcChance=  artifactDictionary.roundStone.chance(artifact_data)
        return `Generates ${artifact_data.level * 10} rounded up of round coins, pointy coins and flat coins generated per tap when blobs generate.`
        },
        effect:{
            type:'on_blobCollect',
            execute: (artifact_data) =>{
                game.currencyItems.roundCoins += Math.ceil(game.clickStats.roundCoinsPerClick * ((artifact_data.level + 10)/10))
                game.currencyItems.pointyCoins +=Math.ceil(game.clickStats.pointyCoinsPerClick * ((artifact_data.level + 10)/10))
                game.currencyItems.flatCoins +=Math.ceil(game.clickStats.flatCoinsPerClick* ((artifact_data.level + 10)/10))
                console.log('three petaled flower')
            }
        },
        give: (startlevel)=>{
            giveItem({id: 'threePetaledFlower', level: startlevel, owned: 1})
        }
    },
}


export function checkArtifacts(type) {
    if (!Array.isArray(game.artifacts)) {
        return;
    }

    for (const playerArtifactData of game.artifacts) {
        const artifactKey = playerArtifactData.id || playerArtifactData.key;

        if (artifactKey) {
            const artifactTemplate = artifactDictionary[artifactKey];
            
            if (artifactTemplate && artifactTemplate.effect && artifactTemplate.effect.type === type) {
                artifactTemplate.effect.execute(playerArtifactData);
            }
        }
    }
}