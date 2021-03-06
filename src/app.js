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
 import puffleLink from './components/scenes/puffle.png';
 import rainbowPuffleLink from './components/scenes/rainbow_puffle.png';
 import * as THREE from 'three';

    let gameScene;
    let startScene;
    let endScene;
    let clicked = true;
    const scene = new GameScene();
    const camera = new PerspectiveCamera();
    const renderer = new WebGLRenderer({ antialias: true });
    // Set up camera
    camera.position.set(0, 10, 25);
    camera.lookAt(new Vector3(0, 0, 0));

    //source: https://github.com/dreamworld-426/dreamworld/blob/master/src/app.js
    let headID = document.getElementsByTagName('head')[0];
    let link = document.createElement("link");
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = "https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap";
    headID.appendChild(link);

    let box = document.createElement("DIV");
    box.id = 'LoadingPage';
    box.style.height = '100vh';
    box.weight = '100%';
    // adapted from bootstrap docs
    //starting page html
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
    '<div class="container-fluid box text-center" style="height: 100vh; background: linear-gradient(90deg, rgba(16,105,164,1) 0%, rgba(255,255,255,1) 100%);">' +
    '<div class="text container p-5" style="color: white;">' +
    '<div class="jumbotron">' +

    '<h1 class="display-5 pt-2" style="text-shadow: 2px 2px 4px black;" >Penguin Club</h1>' +
    '<p class="lead" style="text-shadow: 2px 2px 4px black;">Use your keyboard arrows to move your penguin to avoid obstacles. You can avoid obstacles by moving right, left, or jumping over it. Ice patches increase your speed. You have 3 lives. If you collide with rocks, logs, and trees, you lose a life. If you collide with seals, you die. To increase your score, eat fish. If you eat a squid, you gain a boost, which allows you to collide with rocks, logs, and trees without losing any lives, but seals will still kill you.</p>' +
    // '<p class="lead" style="text-shadow: 3px 3px 6px black;">Hazards and Rewards: If you slide over an ice patch, your speed will temporarily increase. If you hit a rock, log, or tree, you lose one of your three lives. If you hit a predatory seal, the game ends. Eating fish will increase your score. Eating a squid will give you a boost. If you use a boost, your tube will become rainbow colored and it will start to snow. If you hit a rock, tree, or log during boost mode, you do not lose a life. To use a boost, press the button on the top right. </p>' +
    // '<p class="lead" style="text-shadow: 3px 3px 6px black;">GUI: You can customize your penguin by changing the color of the penguin or the tube, flipping the penguin, or spinning the penguin by pressing the buttons on the top right.</p>' +
    '<hr class="my-4">' +
    '<div class="row"><div class="col"><span class="keys long">SPACE</span><p class="py-3">jump up</p></div></div>' +
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
    if (i == 0) {
        allKeys[i].style.width = '200px';
    }
    else {
        allKeys[i].style.width = '35px';
    }
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

window.gameShouldRun = false;

// Referenced the following:
window.onload=function(){
    document.querySelectorAll(".begin-btn").forEach(function(btn){
    btn.addEventListener("click", function(){
    // Add music
    const listener = new THREE.AudioListener();
    const sound = new THREE.Audio( listener );
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'src/components/sounds/sled_racing.m4a', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.setVolume( 0.5 );
        sound.play();
    });        
        window.gameShouldRun = true;
        let loadingPage = document.getElementById('LoadingPage');
        document.body.removeChild(loadingPage);
        document.body.appendChild( VRButton.createButton( renderer ) );
        document.body.style.overflow = 'hidden'; // Fix scrolling
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
// controls.enabled = false;
controls.update();

// Set up score
let score = 0;
let scoreDiv = document.createElement('div');
scoreDiv.id = 'score';
scoreDiv.innerHTML = 'Score: ' + score;
scoreDiv.style.position = 'absolute';
scoreDiv.style.left = '28px'
scoreDiv.style.top = '0px'
scoreDiv.style.zIndex = '1000';
scoreDiv.style.color = 'blue';
scoreDiv.style.fontSize = '2em';
document.body.appendChild(scoreDiv);

// Set up lives
let lives = 3;
let livesDiv = document.createElement('div');
livesDiv.id = 'lives';
livesDiv.innerHTML = 'Lives:';
for (let i = 0; i < lives; i++) {
let puffleImg = document.createElement('img');
puffleImg.src = puffleLink;
puffleImg.style.height = '30px';
puffleImg.style.width = '30px';
livesDiv.appendChild(puffleImg);
}

livesDiv.style.position = 'absolute';
livesDiv.style.left = '28px';
livesDiv.style.top = '30px';
livesDiv.style.zIndex = '1000';
livesDiv.style.color = 'blue';
livesDiv.style.fontSize = '2em';
document.body.appendChild(livesDiv);

// Set up invincibilities
let powerDiv = document.createElement('div');
powerDiv.id = 'power';
powerDiv.innerHTML = 'Boosts:';
powerDiv.style.position = 'absolute';
powerDiv.style.left = '28px';
powerDiv.style.top = '60px';
powerDiv.style.zIndex = '1000';
powerDiv.style.color = 'blue';
powerDiv.style.fontSize = '2em';
document.body.appendChild(powerDiv);

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    renderer.render(scene, camera);
    if (window.gameShouldRun) {
        scene.update && scene.update(timeStamp);
    }
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

