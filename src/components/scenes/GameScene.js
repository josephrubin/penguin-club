import * as Dat from 'dat.gui';
import { Scene, Color, PlaneGeometry, MeshStandardMaterial, Mesh, Vector2, Vector3, Texture, TextureLoader, RepeatWrapping, AudioObject, TextGeometry } from 'three';
import { BasicLights } from 'lights';
import { Terrain } from '../objects/Terrain';
import MovingHazard from '../objects/MovingHazard/MovingHazard';
import { Penguin, Ice, Snow, Hazard, Fish } from '../objects';
import * as THREE from 'three';
import puffleLink from './puffle.png';

// import { WebGLRenderer, PerspectiveCamera } from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { WebGLRenderer, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class GameScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();
    
        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 0,
            updateList: [],
            tiles: [],

            penguin: null,
            keys: {
                ArrowLeft: false,
                ArrowRight: false
            },
            gameOver: false,
            cameraPosition: new THREE.Vector3(0, 1, 10),
            defaultSpeed: 0.3,
            speed: 0.3,
            maxSpeed: 0.5,
            score: 0, 
            lives: 3
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);
        
        // Create the ramp plane
        const geo = new PlaneGeometry(20, 550);
        //const planeMaterial = new MeshBasicMaterial({color: 0xffffff});

        this.planeTexture = new TextureLoader().load(
            'textures/snow/Snow_001_COLOR.jpg'
        );
        this.planeTexture.repeat.set(6, 60)
        this.planeTexture.wrapS = RepeatWrapping;
        this.planeTexture.wrapT = RepeatWrapping;

        this.planeNormal = new TextureLoader().load(
            'textures/snow/Snow_001_NORM.jpg'
        )
        this.planeNormal.repeat.set(6, 60)
        this.planeNormal.wrapS = RepeatWrapping;
        this.planeNormal.wrapT = RepeatWrapping;

        const planeMaterial = new MeshStandardMaterial({
            map: this.planeTexture,
            normalMap: this.planeNormal       
        });
        const plane = new Mesh(geo, planeMaterial);
        plane.position.set(0, -0.5, 0);
        plane.lookAt(new Vector3(0, 1, 0));

        // Add meshes to scene
        const lights = new BasicLights();
        this.state.penguin = new Penguin();
        this.add(lights, plane, this.state.penguin);

        // Add the terrain.
        this.terrainOne = new Terrain();
        // Another terrain is always in front, and we keep generating more as the terrain
        // move off screen behind us.
        this.terrainTwo = new Terrain();
        this.terrainTwo.position.z -= this.terrainOne.width;
        
        this.add(this.terrainOne, this.terrainTwo);

        // Add objects to update list.
        this.addToUpdateList(this.state.penguin);

        // Tube
        const geometry = new THREE.TorusGeometry( 0.8, 0.3, 16, 100 );
        const material = new THREE.MeshPhongMaterial( { color: 0xf92002 } );
        const torus = new THREE.Mesh( geometry, material );
        torus.rotation.x = 1.5;
        torus.position.set(0, 0, 0);
        this.add( torus );

        // Populate GUI
        // this.state.gui.add(this.state.penguin, 'rotationSpeed', -5, 5);
    }

    /** Pass along key events to all objects in this scene. */
    handleKeyDown(event) {
        if (event.code in this.state.keys) {
            this.state.keys[event.code] = true;
        }

        // Notify objects about key down.
        this.state.penguin.handleKeyDown(event);
    }
    handleKeyUp(event) {
        if (event.code in this.state.keys) {
            this.state.keys[event.code] = false;
        }
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    removeFromUpdateList() {
        this.state.updateList.splice(1, 1);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;
        const random = Math.round(Math.random() * 1000) % 150;

        this.state.score++;
        document.getElementById('score').innerHTML = 'Score: ' + String(this.state.score);
        document.getElementById('lives').innerHTML = 'Lives: ';
        for (let i = 0; i < this.state.lives; i++) {
            let puffleImg = document.createElement('img');
            puffleImg.src = puffleLink;
            puffleImg.style.height = '30px';
            puffleImg.style.width = '30px';
            document.getElementById('lives').appendChild(puffleImg);
         }

        if (timeStamp < 100000) {
            // const snow = new Snow(this);
            // this.add(snow);
            // this.addToUpdateList(snow);
            if (this.state.penguin.seenIce) {
                this.state.speed -= 0.002;
                if (this.state.speed <= this.state.defaultSpeed) {
                    this.state.penguin.seenIce = false;
                    this.state.speed = this.state.defaultSpeed;
                }
            }
            if (!this.state.gameOver) {
                // Randomly add hazards to the scene
                if (random === 0) {
                    const fish = new Fish(this);
                    this.addToUpdateList(fish);
                    this.add(fish);
                    const select = Math.random();
                    if (select <= 0.2) {
                        const ice = new Ice(this);
                        this.addToUpdateList(ice);
                        this.add(ice);
                    }

                    else if (select <= 0.8) {
                        const hazard = new Hazard(this);
                        this.addToUpdateList(hazard);
                        this.add(hazard);
                    }

                    // Add a moving hazard
                    else {
                        const direction = Math.floor(Math.random() * 2);
                        const LEFT = 0;

                        const movingHazard = new MovingHazard(this, direction);

                        // Always start the moving hazards on the left or right.
                        if (direction == LEFT) {
                            movingHazard.position.x = -9.5;
                        } else {
                            movingHazard.position.x = 9.5;
                        }
                        this.add(movingHazard);
                        this.addToUpdateList(movingHazard);
                    }
                }
            }

        }

        // Move the snow texture.
        if (!this.state.gameOver) {
            this.planeTexture.offset.add(new Vector2(0, this.state.speed/5));
            this.planeNormal.offset.add(new Vector2(0, this.state.speed/5));
            // Increase the speed as time passes
            if (Math.round(timeStamp) % 20 === 0 && this.state.speed <= this.state.maxSpeed) {
                this.state.defaultSpeed += 0.001;
                this.state.speed = this.state.defaultSpeed;
            }
        }

        // Move the terrain.
        // this.terrainOne.position.z += 1;
        // this.terrainTwo.position.z += 1;
        // if (this.terrainOne.position.z >= this.terrainOne.width) {
        //     console.log('new trr')
        //     this.terrainOne = this.terrainTwo;
        //     this.terrainTwo = new Terrain();
        //     this.terrainTwo.position.z -= this.terrainOne.width;
        // }
        if (this.state.gameOver) {
            window.gameShouldRun = false;
            console.log(this.state.speed);
            console.log("gameOver");
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
            '<div class="container-fluid box text-center" style="background: linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,255,255,1) 100%);">' +
            '<div class="text container p-5" style="color: white;">' +
            '<div class="jumbotron">' +
            '<h1 class="display-5 pt-2" style="text-shadow: 2px 2px 4px black;" >GAME OVER</h1>' +
            '<p class="lead" style="text-shadow: 3px 3px 6px black;">Press the button bellow to play again!</p>' +
            '<hr class="my-4">' +
            '<p class="lead" style="text-shadow: 3px 3px 6px black;"></p>' +
            '<hr class="my-4">' +
            '<div class="row"><div class="col"><span class="keys">^</span><p class="py-3">jump up</p></div></div>' +
            '<div class="row " style="padding-left:30%; padding-right:30%"><div class="col"><span><div class="float-sm-left"><span class="keys"><</span><p class="py-3">move left</p></div><div class="float-sm-right"><span class="keys">></span><p class="py-3">move right</p></div></span></div></div>' +
            '<div class="row"><div class="col">'+
            '<br>' +
            '<button class="btn btn-light btn-lg begin-btn" href="#" role="button" id="begin-btn">Play Again</a>' +
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

            let btn = document.getElementById('begin-btn');
            btn.addEventListener("click", function(){
                console.log("button hit");
                let loadingPage = document.getElementById('LoadingPage');
                document.body.removeChild(loadingPage);
                window.location.reload();
            })
        }

            
        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp, this);
        }
    }
}

export default GameScene;
