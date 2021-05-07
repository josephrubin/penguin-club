import * as Dat from 'dat.gui';
import { Scene, Color, PlaneGeometry, MeshStandardMaterial, Mesh, Vector2, Vector3, Texture, TextureLoader, RepeatWrapping } from 'three';
import { BasicLights } from 'lights';
import { Penguin, Log, Rock, Ice} from '../objects';
import { Terrain } from '../objects/Terrain';

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
        //const planeMaterial = new MeshBasicMaterial({color: 0xffffff});

        this.planeTexture = new TextureLoader().load(
            'textures/snow/Snow_001_COLOR.jpg'
        );
        this.planeTexture.repeat.set(6, 60)
        this.planeTexture.wrapS = RepeatWrapping;
        this.planeTexture.wrapT = RepeatWrapping;

        this.planeNormal = new TextureLoader().load(
            'textures/snow/Snow_001_NORM.jpg'
        )
        this.planeNormal.repeat.set(6, 60)
        this.planeNormal.wrapS = RepeatWrapping;
        this.planeNormal.wrapT = RepeatWrapping;

        const planeMaterial = new MeshStandardMaterial({
            map: this.planeTexture,
            normalMap: this.planeNormal       
        });
        const plane = new Mesh(geo, planeMaterial);
        plane.position.set(0, -0.5, 0);
        plane.lookAt(new Vector3(0, 1, 0));

        // Add meshes to scene
        const lights = new BasicLights();
        this.state.penguin = new Penguin();
        this.add(lights, this.state.penguin, plane);

        // Add the terrain.
        this.terrainOne = new Terrain();
        // Another terrain is always in front, and we keep generating more as the terrain
        // move off screen behind us.
        this.terrainTwo = new Terrain();
        this.terrainTwo.position.z -= this.terrainOne.width;
        
        this.add(this.terrainOne, this.terrainTwo);

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
        if (!this.state.gameOver && Math.round(Math.random() * 10000) % 150 === 0) {
            // x is a random position (left to right) on the ramp
            const x = (Math.random() * 19) - 9.5;
            const select = Math.round(Math.random() * 2);

            // Add a log
            if (select === 0) {
                const log = new Log(this);
                log.position.x = x;
                this.add(log);
                this.addToUpdateList(log);
            }

            // Add a rock
            else if (select === 1) {
                const rock = new Rock(this);
                rock.position.x = x;
                this.add(rock);
                this.addToUpdateList(rock);
            }

            // Add ice
            // else {
            //     const ice = new Ice(this);
            //     // ice.position.x = x;
            //     this.add(ice);
            //     this.addToUpdateList(ice);
            // }

        }

        // Move the snow texture.
        this.planeTexture.offset.add(new Vector2(0, 0.1));
        this.planeNormal.offset.add(new Vector2(0, 0.1));

        // Move the terrain.
        this.terrainOne.position.z += 1;
        this.terrainTwo.position.z += 1;
        if (this.terrainOne.position.z >= this.terrainOne.width) {
            console.log('new trr')
            this.terrainOne = this.terrainTwo;
            this.terrainTwo = new Terrain();
            this.terrainTwo.position.z -= this.terrainOne.width;
        }

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp, this.state);
        }
    }
}

export default GameScene;
