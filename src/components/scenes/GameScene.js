import * as Dat from 'dat.gui';
import { Scene, Color, PlaneGeometry, MeshBasicMaterial, Mesh, Vector3 } from 'three';
import { Flower, Land } from 'objects';
import { BasicLights } from 'lights';
import { Penguin, Hazard } from '../objects';

class GameScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 0,
            updateList: [],
            penguin: null,
            keys: {
                ArrowLeft: false,
                ArrowRight: false
            }
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Create the ramp plane
        const geo = new PlaneGeometry(20, 100);
        const planeMaterial = new MeshBasicMaterial({color: 0xffffff});
        const plane = new Mesh(geo, planeMaterial);
        plane.position.set(0, -0.5, 0);
        plane.lookAt(new Vector3(0, 1, 0));

        // Add meshes to scene
        const lights = new BasicLights();
        this.state.penguin = new Penguin();
        this.add(lights, this.state.penguin, plane);
        const hazard = new Hazard(this);
        this.add(hazard);

        // Add objects to update list.
        this.addToUpdateList(this.state.penguin);

        // Populate GUI
        //this.state.gui.add(this.state.penguin, 'rotationSpeed', -5, 5);
    }

    /** Pass along key events to all objects in this scene. */
    handleKeyDown(event) {
        if (event.code in this.state.keys) {
            this.state.keys[event.code] = true;
        }

        // Notify objects about key down.
        this.state.penguin.handleKeyDown(event);
    }
    handleKeyUp(event) {
        if (event.code in this.state.keys) {
            this.state.keys[event.code] = false;
        }
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp, this.state);
        }
    }
}

export default GameScene;
