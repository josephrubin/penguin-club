import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AudioObject } from 'three';

class Fish extends THREE.Group {


    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            move: true,
            colors: []
        };

        this.colors = [0xfa13202, 0xfa9302, 0xfaef02, 0x2afa02, 0x0242fa, 0xab02fa, 0xfa02ec]
        const sphere_geometry = new THREE.SphereGeometry( 0.25, 10, 10);
        const sphere_material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        const sphere = new THREE.Mesh( sphere_geometry, sphere_material );
        sphere.position.set(0, 0, -5);
        this.add(sphere);

        // const eye_geometry = new THREE.SphereGeometry( 0.04, 10, 10);
        // const eye_material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
        // const eye = new THREE.Mesh( eye_geometry, eye_material );
        // eye.position.set(-0.3, 0.07, -4.8);
        // this.add(eye);

        // const eye_geometry2 = new THREE.SphereGeometry( 0.04, 10, 10);
        // const eye_material2 = new THREE.MeshBasicMaterial( {color: 0xff0000} );
        // const eye2 = new THREE.Mesh( eye_geometry2, eye_material2 );
        // eye2.position.set(-0.3, 0.07, -5.2);
        // this.add(eye2);

        const cone_geometry = new THREE.ConeGeometry( 0.2, 0.3 );
        const cone_material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        const cone = new THREE.Mesh( cone_geometry, cone_material );
        cone.rotateZ(1.5);
        cone.position.set(0.3, 0, -5);
        // this.add( cone );
        
        var singleGeometry = new THREE.Geometry();

        cone.updateMatrix(); // as needed
        singleGeometry.merge(cone.geometry, cone.matrix);

        sphere.updateMatrix(); // as needed
        singleGeometry.merge(sphere.geometry, sphere.matrix);
        // this.add(sphere);

        const select = Math.trunc(Math.random() * 7);
        var material = new THREE.MeshPhongMaterial({color: this.colors[select], shininess: 50, specular: this.colors[select]});
        var mesh = new THREE.Mesh(singleGeometry, material);
        this.add(mesh); 
        
        const x = (Math.random() * 19) - 9.5;
        this.position.set(x, 0, -125);
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
            scene.state.score += 1;
            const x = (Math.random() * 19) - 9.5;
            this.position.set(x, this.position.y, -125);
        }

        if (this.state.move && !scene.state.gameOver) {
            this.translateZ(scene.state.speed);
            if (this.position.z > scene.state.cameraPosition.z) {
                // x is a random position (left to right) on the ramp
                // const select = Math.round(Math.random() * 7);
                // var material = new THREE.MeshPhongMaterial({color: this.colors[select], shininess: 50, specular: this.colors[select]});
                const x = (Math.random() * 19) - 9.5;
                // this.material = material;
                this.position.set(x, this.position.y, -125);
            }
        }
    }
}

export default Fish;