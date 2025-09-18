import {game} from './save'

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
                if(Math.floor(Math.random()*100) < triggerchance ){
                    game.roundCoins += artifact_data.level * 3
                    console.log('round stone triggered')
                }
            }
        },
        give: (startlevel)=>{
            game.artifacts.push[roundStone = {id: 'roundStone', level: startlevel}]
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
            game.artifacts.push[plantableSeedling = {id: 'plantableSeedling',level: startlevel, grown: false}]
        }
    },
}


export function checkArtifacts(type){
for (const key in game.artifacts){
    if(Object.prototype.hasOwnProperty.call(game.artifacts, key)){
        const playerArtifactData = game.artifacts[key]
        const artifactTemplate = artifactDictionary[key]
        if (artifactTemplate && artifactTemplate.effect && artifactTemplate.effect.type === type) {
                artifactTemplate.effect.execute(playerArtifactData);
        }
    }
}
}