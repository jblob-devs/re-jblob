import $ from 'jquery'
import Swal from 'sweetalert2'
import { makeDraggable } from '../draggable.js'
import { game, saveGame } from '../save.js'

const fishTraitsList = ['slippery', 'shiny', 'glowing', 'spiky', 'fuzzy']

const fishDictionary = {
    miniFish: { name: 'Mini Fish', sizeRange: [1, 3] },
    longishFish: { name: 'Longish Fish', sizeRange: [2, 5] },
    bluewideFish: { name: 'Blue Wide Fish', sizeRange: [2, 5] },
}

const fishingState = {
    isFishing: false,
    isWaiting: false,
    biteTimeout: null,
    escapeTimeout: null,
    indicatorInterval: null,
    indicatorPosition: 0,
    indicatorDirection: 1,
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function setStatus(text, colorClass = '') {
    $('#fish-status').text(text).removeClass('text-green-400 text-red-400').addClass(colorClass)
}

function resetFishing() {
    fishingState.isFishing = false
    fishingState.isWaiting = false
    clearTimeout(fishingState.biteTimeout)
    clearTimeout(fishingState.escapeTimeout)
    clearInterval(fishingState.indicatorInterval)
    fishingState.biteTimeout = null
    fishingState.escapeTimeout = null
    fishingState.indicatorInterval = null
    fishingState.indicatorPosition = 0
    fishingState.indicatorDirection = 1
    $('#bobber').addClass('hidden').removeClass('animate-bob')
    $('#skill-check').addClass('hidden')
}

function chooseFish() {
    const fishKeys = Object.keys(fishDictionary)
    const choice = fishKeys[getRandomInt(0, fishKeys.length - 1)]
    const fishInfo = fishDictionary[choice]
    const size = (Math.random() * (fishInfo.sizeRange[1] - fishInfo.sizeRange[0]) + fishInfo.sizeRange[0]).toFixed(1)
    const traitCount = Math.random() > 0.7 ? 1 : 0
    const traits = traitCount === 0 ? [] : [fishTraitsList[getRandomInt(0, fishTraitsList.length - 1)]]
    return { type: choice, size, traits }
}

function addFishToBox(caughtFish) {
    if (!game.fishBox[caughtFish.type]) {
        game.fishBox[caughtFish.type] = []
    }
    game.fishBox[caughtFish.type].push({ size: parseFloat(caughtFish.size), traits: caughtFish.traits })
    saveGame()
}

function renderFishBox() {
    const box = game.fishBox || {}
    if (Object.keys(box).length === 0) {
        return '<p class="text-amber-700 italic text-center py-8">Your fish box is empty. Go catch some fish!</p>'
    }

    return Object.entries(box)
        .map(([type, fishes]) => {
            const fishInfo = fishDictionary[type]
            return `
                <div class="border border-amber-200 rounded-2xl p-4 mb-4 bg-white/80">
                    <h3 class="font-bold text-lg text-amber-900">${fishInfo.name}</h3>
                    <div class="space-y-2 mt-3">
                        ${fishes
                            .map((fish, index) => {
                                const traitsText = fish.traits.length ? fish.traits.join(', ') : 'normal'
                                return `
                                    <div class="flex items-center justify-between p-3 bg-amber-100/60 rounded-xl">
                                        <div>
                                            <p class="font-semibold">${fish.size}"
                                                <span class="text-xs text-amber-700">${traitsText}</span>
                                            </p>
                                        </div>
                                        <button data-fish-type="${type}" data-fish-index="${index}" class="sell-fish-btn base-button text-xs">Sell</button>
                                    </div>`
                            })
                            .join('')}
                    </div>
                </div>`
        })
        .join('')
}

function getSellValue(fish) {
    return Math.max(5, Math.round((fish.size || 1) * 5 + fish.traits.length * 5))
}

function sellFish(type, index) {
    const fish = game.fishBox[type]?.[index]
    if (!fish) return
    const sellValue = getSellValue(fish)
    game.currencyItems.roundCoins += sellValue
    let seaScalesGet = false;
    if(getRandomInt(1, 3) === 1){
        game.currencyItems.seaScales += fish.traits.length
        seaScalesGet = true;
    }
    game.fishBox[type].splice(index, 1)
    if (game.fishBox[type].length === 0) {
        delete game.fishBox[type]
    }
    saveGame()
    $('#fishBoxContents').html(renderFishBox())
    const traitsText = fish.traits.length ? ` (${fish.traits.join(', ')})` : ''
    Swal.fire({
        toast: true,
        position: 'top-start',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,
        icon: 'success',
        title: `Sold ${fish.size}\" ${fishDictionary[type].name}${traitsText}`,
        text: `+${sellValue} Round Coins ${seaScalesGet ? `+${fish.traits.length} Sea Scales` : ''}`
    })
}

function ensureFishBoxModal() {
    if (document.getElementById('fishBoxModal')) {
        return
    }

    const modal = document.createElement('div')
    modal.id = 'fishBoxModal'
    modal.className = 'hidden fixed inset-0 bg-black/30 pointer-events-none'
    modal.style.zIndex = '12000'
    modal.style.pointerEvents = 'auto'

    const windowDiv = document.createElement('div')
    windowDiv.id = 'fishBoxWindow'
    windowDiv.className = 'absolute bg-white shadow-lg rounded-2xl p-6 w-[min(90vw,56rem)] max-h-[70vh] overflow-y-auto pointer-events-auto'
    windowDiv.style.left = '50%'
    windowDiv.style.top = '50%'
    windowDiv.style.transform = 'translate(-50%, -50%)'
    windowDiv.style.zIndex = '12001'

    const header = document.createElement('div')
    header.className = 'flex justify-between items-center mb-4'
    header.innerHTML = `
        <h2 class="text-3xl font-bold text-amber-900">Fish Box</h2>
        <button id="close-fish-box-btn" class="text-amber-600 hover:text-amber-900 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full">✕</button>
    `

    const contents = document.createElement('div')
    contents.id = 'fishBoxContents'

    windowDiv.appendChild(header)
    windowDiv.appendChild(contents)
    modal.appendChild(windowDiv)
    document.body.appendChild(modal)

    makeDraggable(windowDiv, {
        containment: 'window',
        zIndex: 12001,
        cancel: 'button, a, input, textarea, select, label'
    })
}

function showFishBox() {
    ensureFishBoxModal()
    $('#fishBoxContents').html(renderFishBox())
    $('#fishBoxModal').removeClass('hidden')
}

function startIndicatorMovement() {
    const indicator = document.getElementById('indicator')
    const skillCheck = document.getElementById('skill-check')
    if (!indicator || !skillCheck) return

    const maxLeft = skillCheck.offsetWidth - indicator.offsetWidth
    fishingState.indicatorPosition = 0
    fishingState.indicatorDirection = 1

    fishingState.indicatorInterval = setInterval(() => {
        if (!fishingState.isWaiting) {
            clearInterval(fishingState.indicatorInterval)
            return
        }

        fishingState.indicatorPosition += fishingState.indicatorDirection * 3
        if (fishingState.indicatorPosition <= 0) {
            fishingState.indicatorDirection = 1
            fishingState.indicatorPosition = 0
        } else if (fishingState.indicatorPosition >= maxLeft) {
            fishingState.indicatorDirection = -1
            fishingState.indicatorPosition = maxLeft
        }
        indicator.style.left = `${fishingState.indicatorPosition}px`
    }, 16)
}

function resetTargetZone() {
    $('#target-zone').css({ width: '0%', left: '0%' })
}

function startBite() {
    if (!fishingState.isFishing) return
    fishingState.isWaiting = true
    setStatus('Click when the target is aligned!', 'text-green-400')

    const zoneWidth = getRandomInt(20, 40)
    const zoneLeft = getRandomInt(0, 100 - zoneWidth)
    $('#target-zone').css({ width: `${zoneWidth}%`, left: `${zoneLeft}%` })
    $('#skill-check').removeClass('hidden')

    startIndicatorMovement()

    clearTimeout(fishingState.escapeTimeout)
    fishingState.escapeTimeout = setTimeout(() => {
        if (fishingState.isWaiting) {
            fishingState.isWaiting = false
            setStatus('It got away...', 'text-red-400')
            resetFishing()
        }
    }, 3500)
}

function catchFish() {
    if (!fishingState.isWaiting) return
    fishingState.isWaiting = false
    clearTimeout(fishingState.escapeTimeout)
    clearInterval(fishingState.indicatorInterval)
    const indicatorRect = document.getElementById('indicator').getBoundingClientRect()
    const targetRect = document.getElementById('target-zone').getBoundingClientRect()
    const indicatorCenter = indicatorRect.left + indicatorRect.width / 2

    const success = indicatorCenter >= targetRect.left && indicatorCenter <= targetRect.right
    if (success) {
        const caught = chooseFish()
        addFishToBox(caught)
        const traitLabel = caught.traits.length ? caught.traits.join(', ') : 'normal'
        setStatus(`Caught a ${caught.size}\" ${traitLabel} ${fishDictionary[caught.type].name}!`, 'text-green-400')
    } else {
        setStatus('It got away...', 'text-red-400')
    }

    setTimeout(resetFishing, 1200)
}

function castLine(event) {
    if (fishingState.isFishing) return
    fishingState.isFishing = true
    setStatus('Waiting for a bite...', '')
    $('#bobber').removeClass('hidden')
    const waterArea = document.getElementById('water-area')
    if (!waterArea) return

    const x = Math.random() * (waterArea.offsetWidth - 24)
    const y = Math.random() * (waterArea.offsetHeight - 24)
    $('#bobber').css({ left: `${x}px`, top: `${y}px` })
    resetTargetZone()

    clearTimeout(fishingState.biteTimeout)
    fishingState.biteTimeout = setTimeout(startBite, getRandomInt(1800, 3200))
}

export function initFishingLocation() {
    $('#warpContainer').on('click', function (e) {
        if (fishingState.isWaiting) {
            e.stopImmediatePropagation()
            catchFish()
        }
    })
    $('#warpContainer').on('click', '#water-area', castLine)
    $('#warpContainer').on('click', '#skill-check', function (e) {
        e.stopPropagation()
        catchFish()
    })
    $('#warpContainer').on('click', '#fish-box-btn', function (e) {
        e.stopPropagation()
        showFishBox()
    })
    $(document).on('click', '#close-fish-box-btn', function (e) {
        e.stopPropagation()
        $('#fishBoxModal').addClass('hidden')
    })
    $(document).on('click', '#fishBoxModal', function (e) {
        if (e.target.id === 'fishBoxModal') {
            $(this).addClass('hidden')
        }
    })
    $(document).on('click', '.sell-fish-btn', function (e) {
        e.stopPropagation()
        sellFish($(this).data('fish-type'), $(this).data('fish-index'))
    })
}

export function renderFishingLocation() {
    return `
        <div class="SlimedLakeLocation relative flex flex-col items-center justify-center p-10 overflow-visible" id="slime-lake">
            <div id="water-area" class="relative w-80 h-80 group cursor-pointer rounded-3xl overflow-hidden bg-blue-800 shadow-inner border border-blue-300">
                <div class="absolute inset-0 bg-gradient-to-b from-blue-600 via-blue-700 to-blue-900"></div>
                <div id="bobber" class="hidden absolute w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-lg z-20"></div>
                <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10">
                    <span id="fish-status" class="text-white font-bold text-sm drop-shadow-md px-4">Click water to cast.</span>
                    <div id="skill-check" class="hidden relative w-56 h-4 bg-black/40 rounded-full border border-white/30 mt-4 overflow-hidden pointer-events-auto">
                        <div id="target-zone" class="absolute h-full bg-green-400/80"></div>
                        <div id="indicator" class="absolute h-full w-2 bg-white shadow-lg"></div>
                    </div>
                </div>
            </div>
            <div class="flex flex-row gap-4 justify-center m-5">
                <button id="fish-box-btn" class="base-button">Fish Box</button>
            </div>
            <p id="seaScalesCounter" class="text-sm text-white"></p>

        </div>
    `
}

initFishingLocation()
