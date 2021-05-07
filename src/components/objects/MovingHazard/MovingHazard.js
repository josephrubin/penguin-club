import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class MovingHazard extends THREE.Group {
    constructor(parent, direction) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            move: true,
            direction: direction
        };
        // Load object
        const loader = new GLTFLoader();

        this.name = 'seal';
        loader.load('model/seal/Mesh_Seal.gltf', (gltf) => {
            gltf.scene.scale.set(0.03,0.03,0.03)
            this.add(gltf.scene);
        });

        this.position.set(0, 0, -125);

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    // Code copied from flower -- adjust so that box translates in the
    // positive z direction
    update(timeStamp, scene) {
        // Stack overflow for collision detection:
        // https://stackoverflow.com/questions/28453895/how-to-detect-collision-between-two-objects-in-javascript-with-three-js
        const hazardBox = new THREE.Box3().setFromObject(this);
        const penguinBox = new THREE.Box3().setFromObject(scene.state.penguin);
        const collision = hazardBox.intersectsBox(penguinBox);
        if (collision) {
            this.state.move = false;
            scene.state.gameOver = true;
        }

        if (this.state.move && !scene.state.gameOver) {
            this.translateZ(0.11);

            if (this.state.direction == 0) {
                this.translateX(0.01);
            }
            else {
                this.translateX(-0.01);
            }
        }

    }
}

export default MovingHazard;
