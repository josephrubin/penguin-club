import * as THREE from 'three';

class Hazard extends THREE.Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            move: false,
        };
        const hazardGeometry = new THREE.BoxGeometry(1, 1, 1);
        const hazardMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0000,
        });
        this.hazard = new THREE.Mesh(hazardGeometry, hazardMaterial);
        this.hazard.position.set(0, 0, -6);
        this.add(this.hazard);

        // Add self to parent's update list
        parent.addToUpdateList(this);

        // Populate GUI
        this.state.gui.add(this.state, 'move');
    }

    // Code copied from flower -- adjust so that box translates in the
    // positive z direction
    update(timeStamp, state) {
        // Stack overflow for collision detection:
        // https://stackoverflow.com/questions/28453895/how-to-detect-collision-between-two-objects-in-javascript-with-three-js
        const hazardBox = new THREE.Box3().setFromObject(this.hazard);
        const penguinBox = new THREE.Box3().setFromObject(state.penguin);
        const collision = hazardBox.intersectsBox(penguinBox);
        if (collision) {
            this.state.move = false;
        }

        if (this.state.move) {
            this.hazard.translateZ(0.05);
        }

    }
}

export default Hazard;
