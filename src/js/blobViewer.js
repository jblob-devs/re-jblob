import {game} from "./save.js"
import $ from 'jquery'

const container = $("#blobViewerContainer")
let screenBlobs = []
let time  = 0;
const WOBBLE_FACTOR = 0.05;
const BLOBBY_SCALE_AMPLITUDE = 0.05;
const BLOBBY_ROTATION_AMPLITUDE = 1.5;
const blobIMG = (id) =>
    `
<img src="src/assets/images/blobs/${id}.png" draggable="false" id="blob-${id}" class="transform scale-50"/>
            
`

function createNewBlobView(id){
    const containerW = container.width()
    const containterH = container.height()
    console.log(`${containerW} x ${containterH}`)
    return{
        id: id,
        x: Math.random() * (containerW) ,
        y: Math.random() * (containterH),
        vx: (Math.random() - 0.5) * 1,
        vyOffset: Math.random() * 1000,
        element:null,
    }
}

function updateBlobViewer(){
    const curCount = screenBlobs.length
    let blobCount = 0;
    for(let i in game.blobs){
        blobCount += game.blobs[i].owned
    }
    console.log(blobCount)
    const newCount = blobCount;
    if(newCount > curCount){

        for(const blob of Object.keys(game.blobs)){
            if(game.blobs[blob].owned > 0){
            const newBlob = createNewBlobView(blob)
            screenBlobs.push(newBlob)

            const blobViewerDiv = document.createElement("div")
            blobViewerDiv.className = 'blobView'
            blobViewerDiv.innerHTML = blobIMG(game.blobs[blob].image)
            newBlob.element = blobViewerDiv
            container.append(blobViewerDiv)
            }
        }
    }else if(newCount < curCount){
        const removedBlobs = screenBlobs.splice(newCount, curCount - newCount)
        removedBlobs.forEach((blob)=>{
            blob.element.remove()
        })
    }

}

//have to mess with the animate function
function animateBlobs(){
    time+=0.1
    const containerWidth = container.width();
    const containerHeight = container.height();
        screenBlobs.forEach(blob => {
                if (!blob.element) return;
        blob.x += blob.vx;
        if (blob.x < 0 || blob.x > containerWidth - 40) {
            blob.vx *= -1
            blob.x = Math.max(0, Math.min(blob.x, containerWidth - 40)); 
        }
        const wobbleY = Math.sin(time + blob.vyOffset) * WOBBLE_FACTOR * 50; 
        const pulse = Math.sin(time * 0.5 + blob.vyOffset / 100) * BLOBBY_SCALE_AMPLITUDE; 
        const scaleX = 1 + pulse;
        const scaleY = 1 - (pulse * 0.8);
        const flipDirection = blob.vx >= 0 ? 1 : -1;
        const rotationZ = Math.cos(time * 0.8 + blob.vyOffset / 200) * BLOBBY_ROTATION_AMPLITUDE; 
        const finalX = blob.x;
        const finalY = blob.y + wobbleY; 
        blob.element.style.transform = 
            `translate(${finalX}px, ${finalY}px) 
             scaleX(${scaleX * flipDirection}) 
             scaleY(${scaleY}) 
             rotate(${rotationZ}deg)`;
            });

            requestAnimationFrame(animateBlobs);
}

updateBlobViewer();
setInterval(() =>{
    updateBlobViewer()
},1000)
requestAnimationFrame(animateBlobs);