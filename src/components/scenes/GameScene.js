import * as Dat from 'dat.gui';
import { Scene, Color, PlaneGeometry, MeshBasicMaterial, Mesh } from 'three';
import { Flower, Land } from 'objects';
import { BasicLights } from 'lights';
import { Penguin } from '../objects';

class GameScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
            penguin: null,
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Trying things out.
        //const geo = new PlaneGeometry(100, 100);
        //const planeMaterial = new MeshBasicMaterial({color: 0xff00f0});
        //const plane = new Mesh(geo, planeMaterial);

        // Add meshes to scene
        const lights = new BasicLights();
        this.state.penguin = new Penguin();
        this.add(lights, this.state.penguin);

        // Populate GUI
        //this.state.gui.add(this.state.penguin, 'rotationSpeed', -5, 5);
    }

    /** Pass along key events to all objects in this scene. */
    handleKeyEvents(event) {
        this.state.penguin.handleKeyEvents(event);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default GameScene;
