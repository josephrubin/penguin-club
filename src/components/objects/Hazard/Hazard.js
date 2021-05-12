import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AudioObject, Vector3 } from 'three';

class Hazard extends THREE.Group {
    generateRock(loader) {
        this.name = 'rock';
        var model;
        loader.load('model/rock2/rock_02.gltf', (gltf) => {
            model = gltf.scene;
            model.scale.set(0.01,0.01,0.01)
            const sel = Math.trunc(Math.random() * 5);
            model.rotation.y = sel;
            this.add(gltf.scene);
        });
        const x = (Math.random() * 19) - 9.5;
        this.position.set(x, -1, -125);
    }

    generateLog(loader) {
        this.name = 'log';
        var model;
        loader.load('model/log2/PUSHILIN_log.gltf', (gltf) => {
            model = gltf.scene;
            const sel = Math.trunc(Math.random() * 5);
            model.rotation.y = sel;
            this.add(gltf.scene);
        });
        const x = (Math.random() * 19) - 9.5;
        this.position.set(x, 0, -150);
    }

    generateTree(loader) {
        this.name = 'tree';
        loader.load('model/tree/model.gltf', (gltf) => {
            gltf.scene.scale.set(10, 10, 10);
            this.add(gltf.scene);
        });
        let x = -(Math.random() * 19);
        this.position.set(x, -8, -125);
    }

    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            move: true,
            hit: false
        };
        // Load object
        const loader = new GLTFLoader();

        // Randomly select one of three hazards, each with
        // 1/3 chance of being generated
        const random = Math.random();
        if (random <= 0.33) this.generateLog(loader);
        else if (random <= 0.67) this.generateTree(loader);
        else this.generateRock(loader);
        parent.addToUpdateList(this);
    }

    update(timeStamp, scene) {
        // Stack overflow for collision detection:
        // https://stackoverflow.com/questions/28453895/how-to-detect-collision-between-two-objects-in-javascript-with-three-js
        const hazardBox = new THREE.Box3().setFromObject(this);
        const penguinBox = new THREE.Box3().setFromObject(scene.state.penguin);
        const collision = hazardBox.intersectsBox(penguinBox);
        if (this.state.hit) {
            if (this.position.x < scene.state.penguin.position.x) this.translateX(1);
            else this.translateX(-1);
        }
        if (collision && !scene.state.gameOver) {     
            if (!this.state.hit) {
                this.rotateY(Math.PI);
                const listener = new THREE.AudioListener();
                // camera.add( listener );
                const sound = new THREE.Audio( listener );
                const audioLoader = new THREE.AudioLoader();
                audioLoader.load( 'src/components/sounds/crash.m4a', function( buffer ) {
                    sound.setBuffer( buffer );
                    sound.setLoop( false );
                    sound.setVolume( 0.5 );
                    sound.play();
                });
                if (scene.state.boostTime === 0) scene.state.lives--;
                this.state.hit = true;
            }
            // x is a random position (left to right) on the ramp
            if (scene.state.lives === 0) {
                this.state.move = false;
                scene.state.gameOver = true;
            }
        }

        // During gameplay, continuously move hazards forward
        if (this.state.move && !scene.state.gameOver) {
            this.translateZ(scene.state.speed);

            // When the objects are no longer visible
            if (this.position.z > scene.state.cameraPosition.z) {
                this.state.hit = false;
                // x is a random position (left to right) on the ramp
                if (this.name === 'tree') {
                    const x = -(Math.random() * 19);
                    this.position.set(x, this.position.y, -125);
                }
                else {
                    const x = (Math.random() * 19) - 9.5;
                    this.position.set(x, this.position.y, -125);
                }
                
            }
        }
    }
}

export default Hazard;
