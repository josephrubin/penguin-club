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
//----
    let gameScene;
    let startScene;
    let endScene;
    console.log("here");
    let clicked = true;
    // camera.position.set(0, 5, 11);
    // camera.lookAt(new Vector3(0, 0, 0));
    // console.log("start scene called");
    const scene = new GameScene();
    const camera = new PerspectiveCamera();
    const renderer = new WebGLRenderer({ antialias: true });
    // Set up camera
    camera.position.set(6, 3, -10);
    camera.lookAt(new Vector3(0, 0, 0));
    camera.position.set(0, 10, 25);
    camera.lookAt(new Vector3(0, 0, 0));

// // Set up renderer, canvas, and minor CSS adjustments
//     renderer.setPixelRatio(window.devicePixelRatio);
//     const canvas = renderer.domElement;
//     // canavs.style.innerHeight = 100;
//     canvas.style.display = 'block'; // Removes padding below canvas
//     document.body.style.margin = 0; // Removes margin around page
//     document.body.style.overflow = 'hidden'; // Fix scrolling
//     document.body.appendChild(canvas);

//     // Set up controls
//     const controls = new OrbitControls(camera, canvas);
//     controls.enableDamping = true;
//     controls.enablePan = false;
//     controls.minDistance = 4;
//     controls.maxDistance = 16;
//     controls.update();

    //-----html
      //TODO: Add styles to header

    //source: https://github.com/dreamworld-426/dreamworld/blob/master/src/app.js
    let headID = document.getElementsByTagName('head')[0];
    let link = document.createElement("link");
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = "https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap";
    headID.appendChild(link);

    let box = document.createElement("DIV");
    box.id = 'LoadingPage';
    box.height = '100%';
    box.weigth = '100%';
     // adapted from bootstrap docs
    let html = '<style type="text/css">' +
    'body, p, h1, h2, h3, h4, h5, a' +
    '{ font-family:  Arial, Helvetica, sans-serif; }' +
    '.jumbotron { background: none; }' +
    '.keys { display: inline:block; font-size: 20px;}' +
    'input { max-height: 20px;}' +
    'hr { color: white;}' +
    '.box {z-index: 10; position:absolute; top:0; width: 100%}' +
    '@media only screen and (max-width: 767px) { .p-large { font-size: 1.0rem; } .display-4,.display-5 { font-size: 1.5rem; }}' +
    '@media only screen and (min-width: 768px) { .p-large, { font-size: 1.4rem; } .display-4,.display-5 { font-size: 1.7rem; }}' +
    '@media only screen and (min-width: 992px) { .p-large { font-size: 1.8rem; } .display-4,.display-5 { font-size: 2.6rem; } } }' +
    '</style>' +
    '<div class="container-fluid box text-center" style="background: linear-gradient(90deg, rgba(16,105,164,1) 0%, rgba(255,255,255,1) 100%);">' +
    '<div class="text container p-5" style="color: white;">' +
    '<div class="jumbotron">' +
    // '<h1 class="display-4">Penguin Club</h1>' +
    // '<hr class="my-4">' +
    // '<p class="p-large">Navigate your penguin down the slope</p>' +
    // '<a class="btn btn-light btn-lg" href="#keys" role="button">Get Started</a>' +
    // '<br>' +
    // '<hr class="my-4">' +
    // '<br>' +

    // '<a name ="keys"></a>' +
    '<h1 class="display-5 pt-2" style="text-shadow: 2px 2px 4px black;" >Penguin Club</h1>' +
    '<p class="lead" style="text-shadow: 3px 3px 6px black;">Use your keyboard arrows to move your penguin in a way that avoids the abstacles given. You can avoid obstacles by moving right, left, or jumping over it. If the penguin slides over the ice patches its speed increases.</p>' +
    '<hr class="my-4">' +
    '<div class="row"><div class="col"><span class="keys">^</span><p class="py-3">jump up</p></div></div>' +
    '<div class="row " style="padding-left:30%; padding-right:30%"><div class="col"><span><div class="float-sm-left"><span class="keys"><</span><p class="py-3">move left</p></div><div class="float-sm-right"><span class="keys">></span><p class="py-3">move right</p></div></span></div></div>' +
    '<div class="row"><div class="col">'+
    '<br>' +
    '<button class="btn btn-light btn-lg begin-btn" href="#" role="button" id="begin-btn">Begin</a>' +
    '</div>' +
    '</div>' +
    '</div>';

    box.innerHTML = html;
    document.body.appendChild(box);

    let bootstrap = '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">';
    document.head.innerHTML += bootstrap;

    let guifix = '<style type="text/css">' +
    'input { max-height: 20px; margin:1px!important; padding:1px!important;}' +
    '.dg .cr.number input[type=text], .dg .c input[type=text] { max-height: 20px; margin:1px; padding-bottom:2px;}' +
    '.box {z-index: 10; position:absolute; top:0;}' +
    '</style>';
    document.head.innerHTML += guifix;

    let allKeys = document.getElementsByClassName("keys");
    for (let i = 0; i < allKeys.length; i++){
    allKeys[i].style.display = 'inline-block';
    allKeys[i].style.width = '35px';
    allKeys[i].style.height = '35px';
    allKeys[i].style.border = '1px solid white';
    allKeys[i].style.borderRadius = '2px 2px 2px 2px';
    allKeys[i].style.moxBorderRadius = '2px 2px 2px 2px';
    allKeys[i].style.moxBoxSizing = 'border-box !important';
    allKeys[i].style.webkitBoxSizing = 'border-box !important';
    allKeys[i].style.boxSizing = 'border-box !important';
    allKeys[i].style.webkitBoxShadow = '0px 3px 0px -2px rgba(255,255,255,1), 0px 2px 0px 0px white';
    allKeys[i].style.moxBoxShadow = '0px 3px 0px -2px rgba(255,255,255,1), 0px 2px 0px 0px white';
    allKeys[i].style.boxShadow = '0px 3px 0px -2px rgba(255,255,255,1), 0px 2px 0px 0px white';
    allKeys[i].style.cursor = 'pointer';
    allKeys[i].style.marginLeft = '15px';
    allKeys[i].style.marginRight = '15px';
    }

// Referenced the following:
window.onload=function(){
    document.querySelectorAll(".begin-btn").forEach(function(btn){
    btn.addEventListener("click", function(){
        let loadingPage = document.getElementById('LoadingPage');
        document.body.removeChild(loadingPage);
        document.body.appendChild( VRButton.createButton( renderer ) );
        document.body.style.overflow = 'hidden'; // Fix scrolling
        tour.start();
      })
      })
    }

// Set up renderer, canvas, and minor CSS adjustments
    renderer.setPixelRatio(window.devicePixelRatio);
    const canvas = renderer.domElement;
    // canavs.style.innerHeight = 100;
    canvas.style.display = 'block'; // Removes padding below canvas
    document.body.style.margin = 0; // Removes margin around page
    document.body.style.overflow = 'hidden'; // Fix scrolling
    document.body.appendChild(canvas);

    // Set up controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 4;
    controls.maxDistance = 16;
    controls.update();
// window.onload=function(){
//     var btn = document.getElementById('begin-btn'); 
//     btn.onclick =  function() {
//         clicked = true,
//         document.body.appendChild(canvas)
//     };
//     // debugger;
// }
    // initGameScene();

// function initStartScene() {
//     const scene = new StartingScene();
//     const camera = new PerspectiveCamera();
//     const renderer = new WebGLRenderer({ antialias: true });

//     camera.position.set(0, 5, 11);
//     camera.lookAt(new Vector3(0, 0, 0));
//     console.log("start scene called");

// // Set up renderer, canvas, and minor CSS adjustments
//     renderer.setPixelRatio(window.devicePixelRatio);
//     const canvas = renderer.domElement;
//     canvas.style.display = 'block'; // Removes padding below canvas
//     document.body.style.margin = 0; // Removes margin around page
//     document.body.style.overflow = 'hidden'; // Fix scrolling
//     document.body.appendChild(canvas);

//     // Set up controls
//     const controls = new OrbitControls(camera, canvas);
//     controls.enableDamping = true;
//     controls.enablePan = false;
//     controls.minDistance = 4;
//     controls.maxDistance = 16;
//     controls.update();

//     // startedGame = false;
// }

// function initGameScene() {
//     const scene = new GameScene();
//     const camera = new PerspectiveCamera();
//     const renderer = new WebGLRenderer({ antialias: true });

//     camera.position.set(0, 5, 11);
//     camera.lookAt(new Vector3(0, 0, 0));
//     console.log("start scene called");

// // Set up renderer, canvas, and minor CSS adjustments
//     renderer.setPixelRatio(window.devicePixelRatio);
//     const canvas = renderer.domElement;
//     canvas.style.display = 'block'; // Removes padding below canvas
//     document.body.style.margin = 0; // Removes margin around page
//     document.body.style.overflow = 'hidden'; // Fix scrolling
//     document.body.appendChild(canvas);

//     // Set up controls
//     const controls = new OrbitControls(camera, canvas);
//     controls.enableDamping = true;
//     controls.enablePan = false;
//     controls.minDistance = 4;
//     controls.maxDistance = 16;
//     controls.update();

// }


//     //-----

//     // Set up camera
//     camera.position.set(0, 5, 11);
//     camera.lookAt(new Vector3(0, 0, 0));
//     console.log("set scene called");

// // Set up renderer, canvas, and minor CSS adjustments
//     renderer.setPixelRatio(window.devicePixelRatio);
//     const canvas = renderer.domElement;
//     canvas.style.display = 'block'; // Removes padding below canvas
//     document.body.style.margin = 0; // Removes margin around page
//     document.body.style.overflow = 'hidden'; // Fix scrolling
//     document.body.appendChild(canvas);

//     // Set up controls
//     const controls = new OrbitControls(camera, canvas);
//     controls.enableDamping = true;
//     controls.enablePan = false;
//     controls.minDistance = 4;
//     controls.maxDistance = 16;
//     controls.update();

// function setScene(){
// }
// let clicked = true;

// window.onload=function(){
//     var btn = document.getElementById('begin-btn'); 
//     btn.onclick =  function() {
//         clicked = true,
//         document.body.appendChild(canvas)
//     };
//     // debugger;
// }
//----

// Render loop
// const onAnimationFrameHandler = (timeStamp) => {
//     if (clicked == true){
//         controls.update();
//         renderer.render(scene, camera);
//         scene.update && scene.update(timeStamp);
//         window.requestAnimationFrame(onAnimationFrameHandler);
//     }
// =======
// Set up camera
// camera.position.set(6, 3, -10);
// camera.lookAt(new Vector3(0, 0, 0));
// camera.position.set(0, 10, 25);
// camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
// renderer.setPixelRatio(window.devicePixelRatio);
// const canvas = renderer.domElement;
// canvas.style.display = 'block'; // Removes padding below canvas
// document.body.style.margin = 0; // Removes margin around page
// document.body.style.overflow = 'hidden'; // Fix scrolling
// document.body.appendChild(canvas);

// Set up score
let score = 0;
let scoreDiv = document.createElement('div');
scoreDiv.id = 'score';
scoreDiv.innerHTML = 'Score: ' + score;
document.body.appendChild(scoreDiv);

// Set up controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.minDistance = 4;
// controls.maxDistance = 16;
// controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    document.getElementById('score').innerHTML = 'Score: ' + score;
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

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

// const slip = new AudioObject('src/components/sounds/slip.mp3', 0, 1, false);
// scene.add(slip);

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'src/components/sounds/sled_racing.m4a', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();
});