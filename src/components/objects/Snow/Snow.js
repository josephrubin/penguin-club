import * as THREE from 'three';

class Snow extends THREE.Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            move: true,
        };
        // Create sphere
        for (let i = 0; i < 5; i++) {
            this.netForce = new THREE.Vector3(0, 0, 0);
            this.velocity = new THREE.Vector3(0, 0, 0);
            this.mass = 10000;
            
            const geometry = new THREE.SphereBufferGeometry( 0.02, 10, 10 );
            const material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
            const sphere = new THREE.Mesh( geometry, material );
            this.add(sphere);

            const x = (Math.random() * 19) - 9.5;
            const z = ((Math.random() * -135) + 10);

            this.position.set(x, 7, z);

            // Add self to parent's update list
            parent.addToUpdateList(this);
        }
    }

    // Code copied from flower -- adjust so that box translates in the
    // positive z direction
    update(timeStamp, state) {
        // Gravity - the all natural force that brings us together.
        this.netForce.add(new THREE.Vector3(0, -0.00001, 0));

        // Semi-Implicit Euler integration.
        // ref: https://gafferongames.com/post/integration_basics/
        const acceleration = new THREE.Vector3()
             .copy(this.netForce).multiplyScalar(1 / this.mass);
        this.velocity.add(acceleration);
        this.position.add(this.velocity);

        if (this.position.y < -0.5) {
            // x is a random position (left to right) on the ramp
            const x = (Math.random() * 19) - 9.5;
            const z = ((Math.random() * -135) + 10);
            this.position.set(x, 7, z);
        }
        // this.netForce.set(0, 0, 0);
    }
}

export default Snow;
