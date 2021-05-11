import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AudioObject, Vector3 } from 'three';

class Hazard extends THREE.Group {
    generateRock(loader) {
        this.name = 'rock';
        loader.load('model/rock2/rock_02.gltf', (gltf) => {
            gltf.scene.scale.set(0.01,0.01,0.01)
            this.add(gltf.scene);
        });
        const x = (Math.random() * 19) - 9.5;
        this.position.set(x, -1, -125);
    }

    generateLog(loader) {
        this.name = 'log';
        loader.load('model/log2/PUSHILIN_log.gltf', (gltf) => {
            this.add(gltf.scene);
        });
        const x = (Math.random() * 19) - 9.5;
        this.position.set(x, 0, -125);
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
        };
        // Load object
        const loader = new GLTFLoader();

        // Randomly select one of three hazards, each with
        // 1/3 chance of being generated
        const random = Math.random();
        if (random <= 0.33) this.generateRock(loader);
        else if (random <= 0.67) this.generateLog(loader);
        else this.generateTree(loader);

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    update(timeStamp, scene) {
        // Stack overflow for collision detection:
        // https://stackoverflow.com/questions/28453895/how-to-detect-collision-between-two-objects-in-javascript-with-three-js
        const hazardBox = new THREE.Box3().setFromObject(this);
        const penguinBox = new THREE.Box3().setFromObject(scene.state.penguin);
        const collision = hazardBox.intersectsBox(penguinBox);

        // Handle collisions
        if (collision && !scene.state.gameOver) {
            scene.state.lives--;
            // Reset the position of the hazard
            // x is a random position (left to right) on the ramp
            if (this.name === 'tree') {
                const x = -(Math.random() * 19);
                this.position.set(x, this.position.y, -125);
            }
            else {
                const x = (Math.random() * 19) - 9.5;
                this.position.set(x, this.position.y, -125);
            }
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
                // Reset the position of the hazard
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
