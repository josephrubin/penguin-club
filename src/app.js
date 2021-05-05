/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GameScene } from 'scenes';
// import treeBackground;
//https://threejs.org/docs/#manual/en/introduction/How-to-create-VR-content
// import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

// var ColorTween = require('color-tween');

// Initialize core ThreeJS components
function setScene(){
    const scene = new GameScene();
    const camera = new PerspectiveCamera();
    const renderer = new WebGLRenderer({ antialias: true });
    // renderer.xr.enabled = true;

    // Set up camera
    camera.position.set(0, 1, 10);
    camera.lookAt(new Vector3(0, 3, 0));
    console.log("set scene called");
}

// // Set up renderer, canvas, and minor CSS adjustments
// renderer.setPixelRatio(window.devicePixelRatio);
// const canvas = renderer.domElement;
// canvas.style.display = 'block'; // Removes padding below canvas
// document.body.style.margin = 0; // Removes margin around page
// document.body.style.overflow = 'hidden'; // Fix scrolling
// document.body.appendChild(canvas);

// // Set up controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.minDistance = 4;
// controls.maxDistance = 16;
// controls.update();



// Referenced the following:
// window.onload=function(){
//     document.querySelectorAll(".begin-btn").forEach(function(btn){
//     btn.addEventListener("click", function(){
//         let loadingPage = document.getElementById('LoadingPage');
//         document.body.removeChild(loadingPage);
//         document.body.style.overflow = 'hidden'; // Fix scrolling
//         // tour.start();
//       })
//       })
//     }

window.onload=function(){
    var btn = document.getElementById('begin-btn'); 
    btn.onclick =  function() { setScene() };
    // debugger;
}
// var btn = document.getElementById('begin-btn'); 
// btn.onClick = setScene();

//---------
// // Set up renderer, canvas, and minor CSS adjustments
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.shadowMap.enabled;
// renderer.shadowMap.type = PCFShadowMap;
// const canvas = renderer.domElement;

// document.body.insertAdjacentHTML('beforeend', '<div id="info" style="color:white; position: absolute;top: 15px; width: 100%; text-align: center; display:block;">Bird Controls: W - A - S - D Keys | Camera Controls: Arrow Keys | Music Play/Pause: P key</div>');


// canvas.style.display = 'block'; // Removes padding below canvas
// document.body.style.margin = 0; // Removes margin around page
// document.body.style.overflowY = 'scroll'; // Fix scrolling
// document.body.style.overflowX = 'hidden'; // Fix scrolling

// document.body.appendChild(canvas);

// //------------------------

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);
// renderer.setAnimationLoop( function () {

//     // renderer.render( scene, camera );

// } );

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

window.addEventListener("keydown", function(e) {
    scene.handleKeyDown(e)
}, false);

window.addEventListener("keyup", function(e) {
    scene.handleKeyUp(e)
}, false);