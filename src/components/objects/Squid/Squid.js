import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AudioObject, Vector3 } from 'three';

class Squid extends THREE.Group {
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
        this.name = 'log';
        var model;
        loader.load('model/squid/model.gltf', (gltf) => {
            model = gltf.scene;
            const sel = Math.trunc(Math.random() * 5);
            model.rotation.y = sel;
            this.add(gltf.scene);
        });
        const x = (Math.random() * 19) - 9.5;
        this.position.set(x, 0, -150);
        parent.addToUpdateList(this);
    }

    update(timeStamp, scene) {
        // Stack overflow for collision detection:
        // https://stackoverflow.com/questions/28453895/how-to-detect-collision-between-two-objects-in-javascript-with-three-js
        const hazardBox = new THREE.Box3().setFromObject(this);
        const penguinBox = new THREE.Box3().setFromObject(scene.state.penguin);
        const collision = hazardBox.intersectsBox(penguinBox);
        if (collision && !scene.state.gameOver) {  
            scene.state.powers += 1;   
            const listener = new THREE.AudioListener();
            // camera.add( listener );
            const sound = new THREE.Audio( listener );
            const audioLoader = new THREE.AudioLoader();
            audioLoader.load( 'src/components/sounds/munch.m4a', function( buffer ) {
                sound.setBuffer( buffer );
                sound.setLoop( false );
                sound.setVolume( 0.5 );
                sound.play();
            }); 
            const x = (Math.random() * 19) - 9.5;
            this.position.set(x, this.position.y, -125);  
        }

        // During gameplay, continuously move hazards forward
        if (this.state.move && !scene.state.gameOver) {
            this.translateZ(scene.state.speed);

            // When the objects are no longer visible
            if (this.position.z > scene.state.cameraPosition.z) {
                const x = (Math.random() * 19) - 9.5;
                // this.material = material;
                this.position.set(x, this.position.y, -125);
            }
        }
    }
}

export default Squid;
