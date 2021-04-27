import * as Dat from 'dat.gui';
import { Scene, Color, PlaneGeometry, MeshBasicMaterial, Mesh, Vector3 } from 'three';
import { Flower, Land } from 'objects';
import { BasicLights } from 'lights';
import { Penguin, RedHazard, BlueHazard } from '../objects';

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
            },
            gameOver: false,
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Create the ramp plane
        const geo = new PlaneGeometry(20, 250);
        const planeMaterial = new MeshBasicMaterial({color: 0xffffff});
        const plane = new Mesh(geo, planeMaterial);
        plane.position.set(0, -0.5, 0);
        plane.lookAt(new Vector3(0, 1, 0));

        // Add meshes to scene
        const lights = new BasicLights();
        this.state.penguin = new Penguin();
        this.add(lights, this.state.penguin, plane);

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

        // Randomly add hazards to the scene
        if (!this.state.gameOver && Math.round(Math.random() * 10000) % 100 === 0) {
            // x is a random position (left to right) on the ramp
            const x = (Math.random() * 19) - 9.5;

            // Add a red hazard
            if (Math.round(Math.random()) === 0) {
                const redHazard = new RedHazard(this);
                redHazard.position.x = x;
                this.add(redHazard);
                this.addToUpdateList(redHazard);
            }

            // Add a blue hazard
            else {
                const blueHazard = new BlueHazard(this);
                blueHazard.position.x = x;
                this.add(blueHazard);
                this.addToUpdateList(blueHazard);
            }
        }

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp, this.state);
        }
    }
}

export default GameScene;
