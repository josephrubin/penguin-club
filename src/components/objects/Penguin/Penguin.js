import { Scene } from 'three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Penguin extends THREE.Group {
    constructor(penguinColor, tubeColor) {
        // Call parent Group() constructor
        super();

        // Physics.
        this.netForce = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.mass = 100;
        this.rotForce = 0;
        this.rotVelocity = 0;

        this.seenIce = false;
        this.originalRotation = this.rotation;

        const penguinGeometry = new THREE.BoxGeometry(1, 1, 1);
        const penguinMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
        });
        this.penguin = new THREE.Mesh(penguinGeometry, penguinMaterial);


        // Load object
        const loader = new GLTFLoader();

        // Load selected penguin from drop down menu
        // Default penguin is the black penguin
        this.name = 'penguin';
        // this.path = 'model/penguins/black_penguin/model.gltf';

        if (penguinColor === 'Blue') {
            this.path = 'model/penguins/blue_penguin/bluefixd.gltf';
        }
        else if (penguinColor === 'Green') {
            this.path = 'model/penguins/green_penguin/greenfixd.gltf';
        }
        else if (penguinColor === 'Pink') {
            this.path = 'model/penguins/pink_penguin/penguin pink.gltf';
        }
        else {
            this.path = 'model/penguins/black_penguin/model.gltf';
        }
        loader.load(this.path, (gltf) => {
            // Turn the model away from the camera.
            gltf.scene.rotateY(Math.PI);
            // Blue penguin:
            gltf.scene.scale.set(0.2, 0.2, 0.2);
            this.add(gltf.scene);
        });

        var penguinTube = new THREE.Geometry();
        this.penguin.updateMatrix();
        penguinTube.merge(this.geometry, this.matrix);

        // Tube
        var color;
        if (tubeColor === 'Red') color = 0xf92002;
        else if (tubeColor === 'Blue') color = 0x022ff9
        else if (tubeColor === 'Green') color = 0x2cda02
        else color = 0x000000;

        const tubeGeometry = new THREE.TorusGeometry( 0.8, 0.3, 16, 100 );
        const tubeMaterial = new THREE.MeshPhongMaterial( 
            { color: color, 
              specular: color, 
              shininess: 80} );
        const tube = new THREE.Mesh( tubeGeometry, tubeMaterial );
        tube.rotation.x = 1.6;
        tube.position.set(0, 0.2, 0);

        tube.updateMatrix();
        penguinTube.merge(tube.geometry, tube.matrix);
        var mesh = new THREE.Mesh(penguinTube, tubeMaterial);
        this.add(mesh);

        this.position.set(0, 0, 0);
        this.onFloor = true;
    }

    handleKeyDown(event) {
        if (event.code === "Space" && this.onFloor) {
            this.netForce.add(new THREE.Vector3(0, 80, 0));
        }
    }

    update(timeStamp, scene) {
        let movingLaterally = false;
        let prevRot = this.rotation.z;

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
            this.rotForce += 0.7;
            movingLaterally = true;
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
            this.rotForce -= 0.7;
            movingLaterally = true;
        }
        //this.rotation.set(this.originalRotation.x, this.originalRotation.y, this.originalRotation.z);
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

        this.rotVelocity += this.rotForce / this.mass;
        this.rotation.z += this.rotVelocity;
        this.rotForce = 0;

        // Limit rotation.
        if (this.rotation.z > 0.3) {
            this.rotation.z = 0.3;
            this.rotVelocity = 0;
        }
        if (this.rotation.z < -0.3) {
            this.rotation.z = -0.3;
            this.rotVelocity = 0;
        }
        // Rotate back to neutral;
        if (!movingLaterally) {
            this.rotForce += -this.rotation.z;
            // Remove rotation oscillations.
            if (this.rotation.z * prevRot < 0) {
                this.rotForce = 0;
                this.rotVelocity = 0;
                this.rotation.z = 0;
            }
        }

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
