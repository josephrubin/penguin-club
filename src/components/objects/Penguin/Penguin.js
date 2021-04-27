import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Penguin extends THREE.Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const penguinGeometry = new THREE.BoxGeometry(1, 1, 1);
        const penguinMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
        });
        this.penguin = new THREE.Mesh(penguinGeometry, penguinMaterial);
        this.position.set(0, 0, 0);
        this.add(this.penguin);
    }

    handleKeyEvents(event) {
        //if (event.target.tagName === "INPUT") { return; }

        // The vectors to which each key code in this handler maps. (Change these if you like)
        const keyMap = {
            ArrowUp: new THREE.Vector3(0,  1,  0),
            ArrowLeft: new THREE.Vector3(-1,  0,  0),
            ArrowRight: new THREE.Vector3(1,  0,  0),
        };
        
        if (event.key === 'ArrowLeft') {
            this.position.add(keyMap.ArrowLeft);
        }
        else if (event.key === 'ArrowRight') {
            this.position.add(keyMap.ArrowRight);
        }
        else if (event.key === ' ') {
            this.position.add(keyMap.ArrowUp);
        }
    }
}

export default Penguin;
