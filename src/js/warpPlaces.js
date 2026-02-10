
import { game, saveGame } from './save.js'

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

    <div class="flex flex-row gap-4 justify-center m-5">
        <button id="fish-box-btn" class="base-button">Fish Box</button>
        <button id="rod-shop-btn" class="base-button">Rod Shop</button>
    </div>

    <div id="fishBoxModal" class="hidden fixed inset-0 bg-black/20 z-50 pointer-events-none">
        <div id="fishBoxWindow" class="absolute bg-amber-50 shadow-lg rounded-2xl p-6 max-w-4xl max-h-screen overflow-y-auto cursor-move pointer-events-auto" style="left: 50%; top: 50%; transform: translate(-50%, -50%);">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-3xl font-bold text-amber-900">Fish Box</h2>
                <button id="close-fish-box-btn" class="text-amber-600 hover:text-amber-900 text-2xl font-bold w-8 h-8 flex items-center justify-center hover:bg-amber-200 rounded-full transition-all">✕</button>
            </div>
            <div id="fishBoxContents" class="mb-4"></div>
        </div>
    </div>

    <div id="rodShopModal" class="hidden fixed inset-0 bg-black/20 z-50 pointer-events-none">
        <div id="rodShopWindow" class="absolute bg-amber-50 shadow-lg rounded-2xl p-6 max-w-4xl max-h-screen overflow-y-auto cursor-move pointer-events-auto" style="left: 50%; top: 50%; transform: translate(-50%, -50%);">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-3xl font-bold text-amber-900">⛏️ Rod Shop</h2>
                <button id="close-rod-shop-btn" class="text-amber-600 hover:text-amber-900 text-2xl font-bold w-8 h-8 flex items-center justify-center hover:bg-amber-200 rounded-full transition-all">✕</button>
            </div>
            <div id="rodShopContents" class="mb-4"></div>
        </div>
    </div>
</div>
        `
    }
}


let isFishing = false;
let isWaitingForBite = false;
let biteTimeout = null;
let catchTimeout = null;

$('#warpContainer').on("click", "#water-area", function(e) {
    if (isFishing) return;
    isFishing = true;
    e.stopPropagation();
    
    // Cast animation
    const waterArea = document.getElementById('water-area');
    const x = Math.random() * (waterArea.offsetWidth - 40);
    const y = Math.random() * (waterArea.offsetHeight - 40);
    
    $('#bobber').css({ left: x, top: y }).removeClass('hidden');
    $('#skill-check').addClass('hidden');
    $('#fish-status').text("Waiting for a bite...");
    isWaitingForBite = false;
    
    // Clear any existing timeouts
    if (biteTimeout) clearTimeout(biteTimeout);
    if (catchTimeout) clearTimeout(catchTimeout);
    
    // Fish will bite after 2-4 seconds
    const biteDelay = Math.random() * 2000 + 2000;
    biteTimeout = setTimeout(() => {
        startBite();
    }, biteDelay);
});

function startBite() {
    if (!isFishing) return; // Safety check
    
    isWaitingForBite = true;
    $('#fish-status').text("!!!");
    $('#bobber').addClass('animate-bob');
    
    const zoneWidth = 30; // %
    const zonePos = Math.random() * (100 - zoneWidth);
    
    $('#target-zone').css({ width: zoneWidth + '%', left: zonePos + '%' });
    $('#skill-check').removeClass('hidden');

    // Player has 3 seconds to click, or fish escapes
    if (catchTimeout) clearTimeout(catchTimeout);
    catchTimeout = setTimeout(() => {
        if (isWaitingForBite) {
            isWaitingForBite = false;
            escapeFish();
        }
    }, 3000);
    
    // Listen for click only once
    $(document).one('click.fishing', function(e) {
        if (isWaitingForBite && isFishing) {
            checkCatch();
        }
    });
}

function checkCatch() {
    if (!isWaitingForBite) return; // Safety check
    
    isWaitingForBite = false;
    if (catchTimeout) clearTimeout(catchTimeout);
    $(document).off('click.fishing');
    
    const $ind = document.getElementById('indicator').getBoundingClientRect();
    const $target = document.getElementById('target-zone').getBoundingClientRect();

    $('#skill-check').addClass('hidden');
    $('#bobber').removeClass('animate-bob');

    const isSuccess = ($ind.left >= $target.left && $ind.right <= $target.right);

    if (isSuccess) {
        const data = rollFishLootTable();
        
        // Store fish in game.fishBox
        if (!game.fishBox[data.type]) {
            game.fishBox[data.type] = [];
        }
        game.fishBox[data.type].push({
            size: parseFloat(data.size),
            traits: data.trait
        });
        saveGame();
        
        $('#fish-status').text(`you caught a ${data.size}" ${data.trait || "normal"} ${fishDictionary[data.type].name}`).addClass('text-green-400');
    } else {
        escapeFish();
    }

    setTimeout(() => {
        $('#bobber').addClass('hidden');
        $('#fish-status').text("").removeClass('text-green-400 text-red-400');
        isFishing = false;
    }, 1500);
}

function escapeFish() {
    $('#fish-status').text("it got away...").addClass('text-red-400');
    if (catchTimeout) clearTimeout(catchTimeout);
}

export const fishTraitsList = ['slippery', 'slimy','smelly','shiny','scaly','glowing','spiky','fuzzy']

export const fishDictionary = {
    'miniFish': {
        name: 'mini fish',
        description: 'a tiny fish. if it grows up, it can achieve great things',
        sizeRange: [1,3],
        rarity: 'common',
        availableRods: ['basicRod', 'reinforcedRod', 'shinyRod']
    },
    'longishFish': {
        name: 'longish fish',
        description: 'fish that is sorta long',
        sizeRange: [2,5],
        rarity: 'common',
        availableRods: ['basicRod', 'reinforcedRod', 'shinyRod', 'eliteRod']
    },
    'bluewideFish': {
        name: 'blue wide fish',
        description: "somehow they're all wide AND blue. How is that possible?",
        sizeRange: [2,5],
        rarity: 'rare',
        availableRods: ['shinyRod', 'eliteRod']
    }
}

export const fishingRodDictionary = {
    'basicRod': {
        name: 'Basic Rod',
        description: 'A simple fishing rod. Catches common fish.',
        cost: 50,
        costType: 'currencyItems.roundCoins',
        rarityBoost: 0,
        traitChanceBoost: 0,
        sizeBoost: 0,
        icon: '🎣'
    },
    'reinforcedRod': {
        name: 'Reinforced Rod',
        description: 'A stronger rod. Better at catching larger fish.',
        cost: 150,
        costType: 'currencyItems.roundCoins',
        rarityBoost: 0,
        traitChanceBoost: 0,
        sizeBoost: 0.2,
        icon: '🔨'
    },
    'shinyRod': {
        name: 'Shiny Rod',
        description: 'A beautiful rod with special properties. Attracts rare fish and traits.',
        cost: 300,
        costType: 'currencyItems.roundCoins',
        rarityBoost: 15,
        traitChanceBoost: 0.15,
        sizeBoost: 0,
        icon: '✨'
    },
    'eliteRod': {
        name: 'Elite Rod',
        description: 'The finest fishing rod. Catches the rarest fish with enhanced traits.',
        cost: 500,
        costType: 'currencyItems.roundCoins',
        rarityBoost: 25,
        traitChanceBoost: 0.25,
        sizeBoost: 0.15,
        icon: '⭐'
    }
}

function rollFishLootTable(){
    // Get equipped rod and its bonuses
    const equippedRodId = game.equipment?.equippedRod || 'basicRod';
    const rodData = fishingRodDictionary[equippedRodId] || fishingRodDictionary['basicRod'];
    
    // Build pool based on equipped rod
    const rarity = {common: 80, rare: 20};
    let pool = [];
    
    Object.keys(fishDictionary).forEach(fishKey => {
        const fish = fishDictionary[fishKey];
        // Check if this fish is available with current rod
        if (!fish.availableRods.includes(equippedRodId)) {
            return; // Skip this fish
        }
        
        let fishRarity = rarity[fish.rarity];
        // Apply rarity boost from rod
        if (fish.rarity === 'rare' && rodData.rarityBoost > 0) {
            fishRarity += rodData.rarityBoost;
        }
        
        for (let i = 0; i < fishRarity; i++) {
            pool.push(fishKey);
        }
    });
    
    // If pool is empty (no fish available with this rod), use basic rod's pool
    if (pool.length === 0) {
        const basicRod = fishingRodDictionary['basicRod'];
        Object.keys(fishDictionary).forEach(fishKey => {
            const fish = fishDictionary[fishKey];
            if (fish.availableRods.includes('basicRod')) {
                for (let i = 0; i < rarity[fish.rarity]; i++) {
                    pool.push(fishKey);
                }
            }
        });
    }
    
    const roll = Math.floor(Math.random() * pool.length);
    const caughtFish = pool[roll];
    const fishData = fishDictionary[caughtFish];
    const [min, max] = fishData.sizeRange;
    
    // Apply size boost from rod
    const sizeBoostMultiplier = 1 + rodData.sizeBoost;
    const minBoost = min * sizeBoostMultiplier;
    const maxBoost = max * sizeBoostMultiplier;
    const size = (Math.random() * (maxBoost - minBoost) + minBoost).toFixed(1);

    // Apply trait chance boost from rod
    const traitRoll = Math.random() - rodData.traitChanceBoost;
    let count = 0;
    if (traitRoll > 0.65) count = 2;    
    else if (traitRoll > 0.30) count = 1;
    const trait = count === 0 
        ? null 
        : [...fishTraitsList].sort(() => Math.random() - 0.5).slice(0, count);

    return {type: caughtFish, size, trait};
}

function renderFishBox() {
    let html = '';
    const fishBoxData = game.fishBox;
    
    if (Object.keys(fishBoxData).length === 0) {
        return '<p class="text-amber-700 italic text-center py-8">Your fish box is empty. Go catch some fish!</p>';
    }
    
    for (const fishType in fishBoxData) {
        const fishTemplate = fishDictionary[fishType];
        const caughtFishes = fishBoxData[fishType];
        
        html += `
            <div class="border-2 border-amber-200 rounded-2xl p-4 mb-4 bg-white/60 hover:bg-white/80 transition-all">
                <h3 class="font-bold text-lg text-amber-900">${fishTemplate.name}</h3>
                <p class="text-xs text-amber-700 mb-3">${fishTemplate.description}</p>
                <div class="space-y-2">
        `;
        
        caughtFishes.forEach((fish, index) => {
            const traitsText = fish.traits && fish.traits.length > 0 
                ? fish.traits.join(', ') 
                : 'normal';
            const sellValue = calculateFishSellValue(fishType, fish);
            html += `
                    <div class="flex items-center justify-between p-3 bg-amber-100/50 rounded-xl border border-amber-200">
                        <div class="flex-1">
                            <p class="text-sm font-semibold text-amber-900"><span class="font-bold text-amber-600">#${index + 1}</span> ${fish.size}"</p>
                            <p class="text-xs text-amber-700">${traitsText}</p>
                        </div>
                        <div class="flex items-center gap-2 ml-3">
                            <span class="text-sm font-bold text-amber-600">${sellValue}</span>
                            <span class="text-xs text-amber-600">💰</span>
                            <button data-fish-type="${fishType}" data-fish-index="${index}" class="sell-fish-btn px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-900 font-semibold rounded-lg text-xs transition-all border border-amber-300 hover:border-amber-500">Sell</button>
                        </div>
                    </div>
            `;
        });
        
        html += `
                </div>
                <p class="text-xs text-amber-600 mt-3 ml-1">Total: ${caughtFishes.length}</p>
            </div>
        `;
    }
    
    return html;
}

function calculateFishSellValue(fishType, fish) {
    const fishTemplate = fishDictionary[fishType];
    
    // Base value depends on rarity
    let baseValue = fishTemplate.rarity === 'rare' ? 50 : 25;
    
    // Size multiplier (0.5 to 2x)
    const [min, max] = fishTemplate.sizeRange;
    const avgSize = (min + max) / 2;
    const sizeMultiplier = (fish.size / avgSize) * 0.75 + 0.5;
    
    // Trait multiplier
    let traitMultiplier = 1;
    if (fish.traits && fish.traits.length > 0) {
        traitMultiplier = 1 + (fish.traits.length * 0.3); // Each trait adds 30%
    }
    
    const total = Math.round(baseValue * sizeMultiplier * traitMultiplier);
    return total;
}

function sellFish(fishType, fishIndex) {
    const fish = game.fishBox[fishType][fishIndex];
    const sellValue = calculateFishSellValue(fishType, fish);
    
    // Add coins to inventory
    game.currencyItems.roundCoins += sellValue;
    
    // Remove fish from box
    game.fishBox[fishType].splice(fishIndex, 1);
    
    // Remove the fish type entry if empty
    if (game.fishBox[fishType].length === 0) {
        delete game.fishBox[fishType];
    }
    
    // Save and refresh UI
    saveGame();
    $('#fishBoxContents').html(renderFishBox());
}

function renderRodShop() {
    let html = '';
    
    Object.keys(fishingRodDictionary).forEach(rodKey => {
        const rod = fishingRodDictionary[rodKey];
        const isOwned = game.ownedRods[rodKey] ? true : false;
        const isEquipped = game.equipment.equippedRod === rodKey;
        
        let buttonHtml = '';
        if (isOwned) {
            buttonHtml = `<button data-rod-key="${rodKey}" class="equip-rod-btn px-4 py-2 ${isEquipped ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-amber-400 hover:bg-amber-500 text-amber-900'} font-semibold rounded-lg text-sm transition-all border border-amber-300">
                ${isEquipped ? '✓ Equipped' : 'Equip'}
            </button>`;
        } else {
            buttonHtml = `<button data-rod-key="${rodKey}" class="buy-rod-btn px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg text-sm transition-all border border-blue-600">
                Buy ${rod.cost}
            </button>`;
        }
        
        html += `
            <div class="border-2 border-amber-200 rounded-2xl p-4 mb-4 bg-white/60 hover:bg-white/80 transition-all">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h3 class="font-bold text-lg text-amber-900">${rod.icon} ${rod.name}</h3>
                        <p class="text-xs text-amber-700 mb-3">${rod.description}</p>
                        <div class="text-xs text-amber-600 space-y-1">
                            ${rod.rarityBoost > 0 ? `<p>🎯 Rare Fish Chance: +${rod.rarityBoost}%</p>` : ''}
                            ${rod.traitChanceBoost > 0 ? `<p>✨ Trait Chance: +${Math.round(rod.traitChanceBoost * 100)}%</p>` : ''}
                            ${rod.sizeBoost > 0 ? `<p>📏 Size Bonus: +${Math.round(rod.sizeBoost * 100)}%</p>` : ''}
                        </div>
                    </div>
                    <div class="ml-4">
                        ${buttonHtml}
                    </div>
                </div>
            </div>
        `;
    });
    
    return html;
}

function buyRod(rodKey) {
    const rod = fishingRodDictionary[rodKey];
    
    // Check if player has enough currency
    const keys = rod.costType.split('.');
    let curPath = game;
    for (let i = 0; i < keys.length - 1; i++) {
        curPath = curPath[keys[i]];
    }
    let currencyKey = keys[keys.length - 1];
    
    if (curPath[currencyKey] < rod.cost) {
        alert('Not enough currency to buy this rod!');
        return;
    }
    
    // Deduct currency
    curPath[currencyKey] -= rod.cost;
    
    // Add rod to inventory
    game.ownedRods[rodKey] = 1;
    
    // Equip the new rod
    game.equipment.equippedRod = rodKey;
    
    saveGame();
    $('#rodShopContents').html(renderRodShop());
}

function equipRod(rodKey) {
    if (game.ownedRods[rodKey]) {
        game.equipment.equippedRod = rodKey;
        saveGame();
        $('#rodShopContents').html(renderRodShop());
    }
}

// Event listeners for Fish Box
let isDraggingFishBox = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

$('#warpContainer').on('mousedown', '#fishBoxWindow', function(e) {
    // Only drag from the header area
    if (e.target.closest('#close-fish-box-btn') || e.target.id === 'fishBoxContents') {
        return;
    }
    
    isDraggingFishBox = true;
    const windowElement = document.getElementById('fishBoxWindow');
    const rect = windowElement.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
});

$(document).on('mousemove', function(e) {
    if (!isDraggingFishBox) return;
    
    const windowElement = document.getElementById('fishBoxWindow');
    const newX = e.clientX - dragOffsetX;
    const newY = e.clientY - dragOffsetY;
    
    windowElement.style.left = newX + 'px';
    windowElement.style.top = newY + 'px';
    windowElement.style.transform = 'none';
});

$(document).on('mouseup', function() {
    isDraggingFishBox = false;
});

$('#warpContainer').on('click', '#fish-box-btn', function(e) {
    e.stopPropagation();
    $('#fishBoxContents').html(renderFishBox());
    $('#fishBoxModal').removeClass('hidden');
});

$('#warpContainer').on('click', '#close-fish-box-btn', function(e) {
    e.stopPropagation();
    $('#fishBoxModal').addClass('hidden');
});

// Close modal when clicking outside of it
$('#warpContainer').on('click', '#fishBoxModal', function(e) {
    if (e.target.id === 'fishBoxModal') {
        $(this).addClass('hidden');
    }
});

// Sell fish button handler
$('#warpContainer').on('click', '.sell-fish-btn', function(e) {
    e.stopPropagation();
    const fishType = $(this).data('fish-type');
    const fishIndex = $(this).data('fish-index');
    sellFish(fishType, fishIndex);
});

// Rod shop event listeners
let isDraggingRodShop = false;
let rodShopDragOffsetX = 0;
let rodShopDragOffsetY = 0;

$('#warpContainer').on('mousedown', '#rodShopWindow', function(e) {
    if (e.target.closest('#close-rod-shop-btn') || e.target.id === 'rodShopContents') {
        return;
    }
    
    isDraggingRodShop = true;
    const windowElement = document.getElementById('rodShopWindow');
    const rect = windowElement.getBoundingClientRect();
    rodShopDragOffsetX = e.clientX - rect.left;
    rodShopDragOffsetY = e.clientY - rect.top;
});

$(document).on('mousemove', function(e) {
    if (!isDraggingRodShop) return;
    
    const windowElement = document.getElementById('rodShopWindow');
    const newX = e.clientX - rodShopDragOffsetX;
    const newY = e.clientY - rodShopDragOffsetY;
    
    windowElement.style.left = newX + 'px';
    windowElement.style.top = newY + 'px';
    windowElement.style.transform = 'none';
});

$(document).on('mouseup', function() {
    isDraggingRodShop = false;
});

$('#warpContainer').on('click', '#rod-shop-btn', function(e) {
    e.stopPropagation();
    $('#rodShopContents').html(renderRodShop());
    $('#rodShopModal').removeClass('hidden');
});

$('#warpContainer').on('click', '#close-rod-shop-btn', function(e) {
    e.stopPropagation();
    $('#rodShopModal').addClass('hidden');
});

$('#warpContainer').on('click', '#rodShopModal', function(e) {
    if (e.target.id === 'rodShopModal') {
        $(this).addClass('hidden');
    }
});

$('#warpContainer').on('click', '.buy-rod-btn', function(e) {
    e.stopPropagation();
    const rodKey = $(this).data('rod-key');
    buyRod(rodKey);
});

$('#warpContainer').on('click', '.equip-rod-btn', function(e) {
    e.stopPropagation();
    const rodKey = $(this).data('rod-key');
    equipRod(rodKey);
});