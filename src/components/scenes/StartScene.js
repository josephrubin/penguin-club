// import * as Dat from 'dat.gui';
// import { Scene, Color, PlaneGeometry, MeshStandardMaterial, Mesh, Vector2, Vector3, Texture, TextureLoader, RepeatWrapping } from 'three';
// import { BasicLights } from 'lights';
// import { Penguin, Log, Rock } from '../objects';
// //-----
// import { BoxGeometry, Euler} from 'three';
// // import { Splatter } from 'objects';
// import CONSTS from '../../constants';
// import '../../style.css';
// import _ from 'lodash';
// import 'bootstrap';

// class StartScene extends Scene {
//     constructor(startGameCallback, tutorialCallback) {
//         // Call parent Scene() constructor
//         super();

//         // this.state = {
//         //     splatters: [],
//         // };

//         // // Splatters
//         // this.splatter = new Splatter();
//         // this.stepCount = 0;
//         // this.splatterCount = 0;

//         // canvas: {
//         //     size: 100,
//         //     thickness: 1,
//         //     color: 'black',
//         //     position: new Vector3(0, 0, 10),
//         // },
//         // texts: {
//         //     title: {
//         //         name: 'Chromatic Arrow',
//         //         offset: '30%',
//         //     },
//         //     tutorial: {
//         //         name: 'Tutorial',
//         //         offset: '42%',
//         //     },
//         //     begin: {
//         //         name: 'Begin',
//         //         offset: '54%',
//         //     },
//         //     style: {
//         //         position: 'absolute',
//         //         fontFamily: 'Verdana',
//         //         fontSize: '55px',
//         //         color: 'black',
//         //     }

//         // Add lights
//         this.add(new BasicLights());

//         // Canvas
//         const { canvas, texts } = CONSTS.start;
//         const { size, thickness, color, position } = canvas;
//         const geometry = new BoxGeometry(size, size, thickness);
//         const material = new MeshBasicMaterial({ color });
//         const mesh = new Mesh(geometry, material);
//         mesh.position.copy(position);
//         mesh.updateMatrix();
//         this.screen = mesh;
//         this.add(mesh);
//         this.mesh = mesh;

//         // Text and buttons
//         const { title, tutorial, begin } = texts;
//         this.divElements = [];
//         this.divElements.push(this.createText(title.name, title.offset));
//         this.divElements.push(this.createButton(tutorial.name, tutorial.offset, tutorialCallback));
//         this.divElements.push(this.createButton(begin.name, begin.offset, startGameCallback));
//     }

//     // createSplatter() {
//     //     const { fixed, xMin, xMax, yMin, yMax, minSize, maxSize } = CONSTS.start.splatter;
//     //     const [rx, ry, size] = this.splatterCount < fixed.xs.length
//     //     ? [ fixed.xs[this.splatterCount],
//     //         fixed.ys[this.splatterCount],
//     //         maxSize]
//     //     : [ _.random(xMin, xMax, true),
//     //         _.random(yMin, yMax, true),
//     //         _.random(minSize, maxSize, true)];
//     //     const offset = new Vector3(rx, ry, 0);
//     //     const pos = this.screen.position.clone().add(offset);
//     //     const rot = new Euler();
//     //     const mesh = this.splatter.getMesh(this.screen, pos, rot, size);
//     //     this.add(mesh);
//     //     this.state.splatters.push(mesh);
//     //     this.splatterCount++;
//     // }

//     createText(str, top) {
//         const { style } = CONSTS.start.texts;
//         const text = document.createElement('div');
//         document.body.appendChild(text);
//         // Set content and style
//         text.innerHTML = str;
//         _.extend(text.style, style);
//         text.style.left = (window.innerWidth - text.clientWidth) / 2 + 'px';
//         text.style.top = top;
//         return text;
//     }

//     createButton(str, top, callback) {
//         const button = document.createElement('button');
//         document.body.appendChild(button);
//         // Set content and style
//         button.innerHTML = str;
//         button.style.left = (window.innerWidth - button.clientWidth) / 2 + 'px';
//         button.style.top = top;
//         button.onclick = callback;
//         return button;
//     }

//     // /* Event handlers */
//     // resizeHandler() {
//     //     // realign divElements
//     //     this.divElements.forEach((divElement) => {
//     //         divElement.style.left = (window.innerWidth - divElement.clientWidth)/2 + 'px';
//     //     });
//     // }

//     /* Update */
//     // update() {
//     //     // Splatter
//     //     const { maxSplatters, stepsPerSplatter } = CONSTS.start.splatter;
//     //     if (this.splatterCount < maxSplatters && this.stepCount % stepsPerSplatter === 0) {
//     //         this.createSplatter();
//     //     }
//     //     this.stepCount++;
//     // }

//     /* Clean up */
//     // destruct() {
//     //     // Destruct splatters
//     //     // this.state.splatters.forEach((splatter) => {
//     //     //     // I think these are just references to geo and mat of this.splatter?
//     //     //     splatter.material.dispose();
//     //     //     splatter.geometry.dispose();
//     //     // });
//     //     // this.state.splatters = null;
//     //     // this.splatter.destruct();
//     //     // this.splatter = null;
//     //     this.mesh.geometry = null;
//     //     this.mesh.material = null;
//     //     this.mesh = null;

//     //     // Remove textboxes and buttons
//     //     this.divElements.forEach((divElement) => divElement.remove());
//     //     this.divElements = null;

//     //     // Dispose the scene
//     //     this.dispose();
//     // }
// }

// export default StartScene;
