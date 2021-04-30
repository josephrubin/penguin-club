import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Rock extends THREE.Group {
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

        this.name = 'rock';
        loader.load('model/rock2/rock_02.gltf', (gltf) => {
            gltf.scene.scale.set(0.01,0.01,0.01)
            this.add(gltf.scene);
        });

        this.position.set(0, -1, -125);

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    // Code copied from flower -- adjust so that box translates in the
    // positive z direction
    update(timeStamp, state) {
        // Stack overflow for collision detection:
        // https://stackoverflow.com/questions/28453895/how-to-detect-collision-between-two-objects-in-javascript-with-three-js
        const hazardBox = new THREE.Box3().setFromObject(this);
        const penguinBox = new THREE.Box3().setFromObject(state.penguin);
        const collision = hazardBox.intersectsBox(penguinBox);
        if (collision) {
            this.state.move = false;
            state.gameOver = true;
        }

        if (this.state.move && !state.gameOver) {
            this.translateZ(0.11);
        }

    }
}

export default Rock;
