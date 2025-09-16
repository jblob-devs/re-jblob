export let artifactDictionary = {
    'roundStone': {
        name: 'Round Stone',
        description: 'a very round stone.',
        level: 1,
        chance: 0.1 * (this.level * 0.05),
        descriptionEffect: ` ${chance.toFixed(0)}% chance to generate additional round coins when collecting blob production.`,
        effect:{
            type:'on_click',
            execute: (artifact_data) =>{
              
                const triggerchance = this.chance
            }
        }
    }
}