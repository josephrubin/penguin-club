import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Penguin extends THREE.Group {
    constructor() {
        // Call parent Group() constructor
        super();

        // Physics.
        this.netForce = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.mass = 100;

        const penguinGeometry = new THREE.BoxGeometry(1, 1, 1);
        const penguinMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
        });
        this.penguin = new THREE.Mesh(penguinGeometry, penguinMaterial);
        this.position.set(0, 0, 0);
        this.add(this.penguin);
    }

    update(timeStamp, state) {
        // Handle key inputs.
        if (state.keys["ArrowLeft"]) {
            this.netForce.add(new THREE.Vector3(-1, 0, 0));
        }
        if (state.keys["ArrowRight"]) {
            this.netForce.add(new THREE.Vector3(1, 0, 0));
        }

        // Friction - opposes movement.
        this.velocity.multiplyScalar(0.97);

        // Semi-Implicit Euler integration.
        // ref: https://gafferongames.com/post/integration_basics/
        const acceleration = new THREE.Vector3()
            .copy(this.netForce).multiplyScalar(1 / this.mass);
        this.velocity.add(acceleration);
        this.penguin.position.add(this.velocity);
        this.netForce.set(0, 0, 0);

        // Collisions.
        const leftBoundary = -9.5;
        const rightBoundary = 9.5;
        if (this.penguin.position.x < leftBoundary) {
            this.penguin.position.x = leftBoundary;
            this.velocity.x = 0;
        }
        if (this.penguin.position.x > rightBoundary) {
            this.penguin.position.x = rightBoundary;
            this.velocity.x = 0;
        }
    }
}

export default Penguin;
