
export const warpLocationDictionary = {
    'SlimedLake': {
        name: 'Slimed Lake',
        description: 'A pleasant lake full of life. It can get a bit slimy when it rains.',
        render: () => `
       <div class="SlimedLakeLocation relative flex flex-col items-center justify-center p-10 overflow-visible" id="slime-lake">
    
    <div id="water-area" class="relative w-80 h-80 group cursor-pointer">
        <div class="absolute inset-0 bg-blue-900/40 blur-xl animate-wobble-slow"></div>
        <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 shadow-2xl animate-wobble overflow-hidden" style="box-shadow: inset 10px -20px 40px rgba(0,0,0,0.3);">
            <div class="absolute inset-2 bg-white/10 animate-wobble-slow"></div>
            
            <div id="bobber" class="hidden absolute w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-lg z-20 pointer-events-none"></div>

            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30">
                <span id="fish-status" class="text-white font-bold text-sm drop-shadow-md text-center px-4"></span>
                
                <div id="skill-check" class="hidden relative w-16 h-2 bg-black/50 rounded-full border border-white/30 mt-2 overflow-hidden pointer-events-auto">
                    <div id="target-zone" class="absolute h-full bg-green-400/80"></div>
                    <div id="indicator" class="absolute h-full w-1 bg-white shadow-[0_0_5px_white] animate-[move_1.5s_linear_infinite_alternate]"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="items-center grid gap-4 justify-center m-5">
        <button id="cast-btn" class="base-button">Cast Rod</button>
        <button class="base-button">Swim</button>
    </div>
</div>
        `
    }
}


let isFishing = false;

 $('#warpContainer').on("click", "#slime-lake", function(e){
    if (isFishing) return;
    isFishing = true;
    e.stopPropagation();
    const offset = $(this).offset();
    const x = e.pageX - offset.left;
    const y = e.pageY - offset.top;
    $('#bobber').css({ left: x, top: y }).removeClass('hidden bite-animate');
    $('#skill-check').addClass('hidden');
    $('#fish-status').text("Fishing...");

    setTimeout(startBite, Math.random() * 2000 + 2000);
});

function startBite() {
    $('#fish-status').text("!!!");
    $('#bobber').addClass('animate-bob');
    
    const zoneWidth = 35; // %
    const zonePos = Math.random() * (100 - zoneWidth);
    
    $('#target-zone').css({ width: zoneWidth + '%', left: zonePos + '%' });
    $('#skill-check').removeClass('hidden');

    // Slight delay (200ms) so the "casting click" doesn't count as a "catch click"
    setTimeout(() => {
        $(window).on('click.fishing', function(e) {
            e.preventDefault();
            $(window).off('.fishing');
            checkCatch();
        });
    }, 200);
}

function checkCatch() {
    const $ind = document.getElementById('indicator').getBoundingClientRect();
    const $target = document.getElementById('target-zone').getBoundingClientRect();

    $('#skill-check').addClass('hidden');
    $('#bobber').removeClass('animate-bob');

    const isSuccess = ($ind.left >= $target.left && $ind.right <= $target.right);

    if (isSuccess) {
        const data = rollFishLootTable();
        $('#fish-status').text(`you caught a ${data.size} inch ${data.trait || "normal"} ${data.type}`).addClass('text-green-400');
    } else {
        $('#fish-status').text("it got away...").addClass('text-red-400');
    }

    setTimeout(() => {
        $('#bobber').addClass('hidden');
        $('#fish-status').text("").removeClass('text-green-400 text-red-400');
        isFishing = false;
    }, 1500);
}

export const fishTraitsList = ['slippery', 'slimy','smelly','shiny','scaly','glowing','spiky','fuzzy']

export const fishDictionary = {
    'miniFish': {
        name: 'mini fish',
        description: 'a tiny fish. if it grows up, it can achieve great things',
        sizeRange: [1,3],
        rarity: 'common',
    },
    'longishFish': {
        name: 'longish fish',
        description: 'fish that is sorta long',
        sizeRange: [2,5],
        rarity: 'common'
    },
    'bluewideFish': {
        name: 'blue wide fish',
        description: "somehow they're all wide AND blue. How is that possible?",
        sizeRange: [2,5],
        rarity: 'rare'
    }
}

function rollFishLootTable(){
    const rarity = {'common': 80, 'rare': 20,}
    const fishKeys = Object.keys(fishDictionary)
    let pool=[]
    fishKeys.forEach(key=>{
        const fish = fishDictionary[key]
        for(let i=0; i<rarity[fish.rarity]; i++){
            pool.push(key)
        }
    })
    const roll = Math.floor(Math.random()*pool.length)
    const caughtFish = pool[roll]
    const fishData = fishDictionary[caughtFish]
    const [min, max] = fishData.sizeRange
    const size = (Math.random()*(max-min)+min).toFixed(1)

  const traitRoll = Math.random();
    let count = 0;
    if (traitRoll > 0.65) count = 2;    
    else if (traitRoll > 0.30) count = 1;
    const trait = count === 0 
        ? null 
        : [...fishTraitsList].sort(() => Math.random() - 0.5).slice(0, count);

    console.log(`you caught a ${size} inch ${trait} ${caughtFish}`)
    return {type: caughtFish, size, trait}
}