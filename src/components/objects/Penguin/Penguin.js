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

        this.seenIce = false;

        const penguinGeometry = new THREE.BoxGeometry(1, 1, 1);
        const penguinMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
        });
        this.penguin = new THREE.Mesh(penguinGeometry, penguinMaterial);

        // Load object
        const loader = new GLTFLoader();

        this.name = 'penguin';
        loader.load('model/blue_penguin/bluefixd.gltf', (gltf) => {
            // Turn the model away from the camera.
            gltf.scene.rotateY(Math.PI)
            // Blue penguin:
            gltf.scene.scale.set(0.2, 0.2, 0.2);
            this.add(gltf.scene);
        });

        this.position.set(0, 0, 0);

        this.onFloor = true;
    }

    handleKeyDown(event) {
        if (event.code === "Space" && this.onFloor) {
            this.netForce.add(new THREE.Vector3(0, 80, 0));
        }
    }

    update(timeStamp, scene) {
        // Handle key inputs.
        if (scene.state.keys["ArrowLeft"]) {
            // Add sledding sound effect
            const listener = new THREE.AudioListener();
            // camera.add( listener );
            const sound = new THREE.Audio( listener );
            const audioLoader = new THREE.AudioLoader();
            audioLoader.load( 'src/components/sounds/sliding.m4a', function( buffer ) {
                sound.setBuffer( buffer );
                sound.setLoop( false );
                sound.setVolume( 0.1 );
                sound.play();
            });  
            this.netForce.add(new THREE.Vector3(-1, 0, 0));
        }
        if (scene.state.keys["ArrowRight"]) {
            // Add sledding sound effect
            const listener = new THREE.AudioListener();
            // camera.add( listener );
            const sound = new THREE.Audio( listener );
            const audioLoader = new THREE.AudioLoader();
            audioLoader.load( 'src/components/sounds/sliding.m4a', function( buffer ) {
                sound.setBuffer( buffer );
                sound.setLoop( false );
                sound.setVolume( 0.1 );
                sound.play();
            });  
            this.netForce.add(new THREE.Vector3(1, 0, 0));
        }

        // Friction - opposes movement.
        this.velocity.multiplyScalar(0.97);

        // Gravity - the all natural force that brings us together.
        this.netForce.add(new THREE.Vector3(0, -4, 0));

        // Semi-Implicit Euler integration.
        // ref: https://gafferongames.com/post/integration_basics/
        const acceleration = new THREE.Vector3()
            .copy(this.netForce).multiplyScalar(1 / this.mass);
        this.velocity.add(acceleration);
        this.position.add(this.velocity);
        this.netForce.set(0, 0, 0);

        // Collisions.
        const leftBoundary = -9.5;
        const rightBoundary = 9.5;
        const bottomBoundary = -0.34;
        // Left wall.
        if (this.position.x < leftBoundary) {
            this.position.x = leftBoundary;
            this.velocity.x = 0;
        }
        // Right wall.
        if (this.position.x > rightBoundary) {
            this.position.x = rightBoundary;
            this.velocity.x = 0;
        }
        // Floor.
        this.onFloor = false;
        if (this.position.y <= bottomBoundary) {
            this.position.y = bottomBoundary;
            this.velocity.y = 0;
            this.onFloor = true;
        }

    }
}

export default Penguin;
