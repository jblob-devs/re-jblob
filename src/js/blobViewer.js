import {game} from "./save.js"
import $ from 'jquery'

const container = $("#blobViewerContainer")
let screenBlobs = []
let time  = 0;
const WOBBLE_FACTOR = 0.1;
const BLOBBY_SCALE_AMPLITUDE = 0.05;
const BLOBBY_ROTATION_AMPLITUDE = 1.5;
const blobIMG = (id) =>
    `
<img src="src/assets/images/blobs/${id}.png" id="blob-${id}" class=""/>
            
`

function createNewBlobView(id){
    const containerW = container.width()
    const containterH = container.height()
    
    return{
        id: id,
        x: Math.random() * (containerW - 40),
        y: Math.random() * (containterH - 40),
        vx: (Math.random() - 0.5) * 2,
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
        for(let i = curCount; i < newCount; i++){
            const newBlob = createNewBlobView(i)
            screenBlobs.push(newBlob)

            const blobViewerDiv = document.createElement("div")
            blobViewerDiv.className = 'blobView'
            console.log(Object.keys(game.blobs) + ` ${i}`)
            blobViewerDiv.innerHTML = blobIMG(game.blobs[Object.keys(game.blobs)[i]].image)
            newBlob.element = blobViewerDiv
            container.append(blobViewerDiv)
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
        // 3. Squash and Stretch (Breathing Effect)
        // Use a slow sine wave based on time for an asynchronous pulse
        const pulse = Math.sin(time * 0.5 + blob.vyOffset / 100) * BLOBBY_SCALE_AMPLITUDE; 
        
        const scaleX = 1 + pulse;
        const scaleY = 1 - (pulse * 0.8); // Squish height slightly less than width stretch
        
        // 4. Directional Flip (Facing the direction of travel)
        // If vx is positive, face right (1). If negative, face left (-1).
        const flipDirection = blob.vx >= 0 ? 1 : -1;
        
        // 5. Subtle Rotation (Organic Tilt)
        // Introduce a very small, slow tilt to simulate organic imbalance
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