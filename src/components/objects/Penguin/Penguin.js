import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Penguin extends THREE.Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const penguinGeometry = new THREE.BoxGeometry(1, 1, 1);
        const penguinMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const penguin = new THREE.Mesh(penguinGeometry, penguinMaterial);
        this.add(penguin);
    }
}

export default Penguin;
