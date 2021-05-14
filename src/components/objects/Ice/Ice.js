import * as THREE from 'three';


// Jarvis March Convex Hull Algorithm
// https://www.youtube.com/watch?v=B2AJoQSZf4M
// https://www.geeksforgeeks.org/convex-hull-set-1-jarviss-algorithm-or-wrapping/

class Ice extends THREE.Group {
    // Generate a random point. 
    generateRandomPoint() {
        const width = 2;
        const depth = 5;
        const x = Math.abs(Math.random() * width);
        const y = -0.5;
        const z = Math.abs(Math.random() * depth);
        const point = new THREE.Vector3(x, y, z);
        return point;
    }

    // Find and return index of leftmost vertex within vertices.
    find_leftmost(vertices) {
        let min = 0
        for (let i = 0; i < vertices.length; i++) {
            if (vertices[i].x < vertices[min].x) {
                min = i;
            }
            else if (vertices[i].x == vertices[min].x) {
                if (vertices[i].z < vertices[min].z) {
                    min = i;
                }
            }
        }
        return min;
    }

    // Return 0 if p, q, and r are colinear, 1 if they are clockwise and 2 if they are counterclockwise.
    orientation(p, q, r) {
        const val = ((q.z - p.z) * (r.x - q.x)) - ((q.x - p.x) * (r.z - q.z));
        if (val == 0) return 0;
        else if (val > 0) return 1;
        else return 2;
    }

    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            move: true,
        };
        
        // Create a random polygon
        let points = [];
        const n = 20;
        for (let i = 0; i < n; i++) {
            const point = this.generateRandomPoint();
            points.push(point);
        }

        const minPoint = this.find_leftmost(points);

        let hull = []
        let p = minPoint;
        let q = 0;

        while (true) {
            hull.push(points[p]);

            q = (p+1) % n;

            for (let i = 0; i < n; i++) {
                if (this.orientation(points[p], points[i], points[q]) == 2) {
                    q = i;
                }
            }

            p = q;

            if (p == minPoint) break;
        
        }
        // console.log(hull);
    
        // normals 
        var normal = new THREE.Vector3(0, 1, 0); // I already know the normal of xz-plane ;)
        // this.add(new THREE.ArrowHelper(normal, new THREE.Vector3(10, 0, 10), 5, 0xffff00)); //yellow
        
        var normalZ = new THREE.Vector3(0, 0, 1); // base normal of xy-plane
        // this.add(new THREE.ArrowHelper(normalZ, this.position, 5, 0x00ffff)); // aqua
        
        // 1 quaternions
        var quaternion = new THREE.Quaternion().setFromUnitVectors(normal, normalZ);
        var quaternionBack = new THREE.Quaternion().setFromUnitVectors(normalZ, normal);
        
        // 2 make it parallel to xy-plane
        hull.forEach(p => {
          p.applyQuaternion(quaternion)
        });
        
        // 3 create shape and shapeGeometry
        var shape = new THREE.Shape(hull);
        var shapeGeom = new THREE.ShapeGeometry(shape);
        
        // 4 put our points back to their origins
        hull.forEach(p => {
          p.applyQuaternion(quaternionBack)
        });
        
        // 5 assign points to .vertices
        shapeGeom.vertices = hull;

        var shapeMesh = new THREE.Mesh(shapeGeom, new THREE.MeshBasicMaterial({
        //   color: 0xa3eaf9
            color: 0xaef1ff, 
            // specular: 0.5
        }));

        this.add(shapeMesh);
        const x = (Math.random() * 19) - 9.5;
        this.position.set(x, 0.2, -125);

        // Add self to parent's update list
        parent.addToUpdateList(this); 
    }

    // Code copied from flower -- adjust so that box translates in the
    // positive z direction
    update(timeStamp, scene) {
        // Stack overflow for collision detection:
        // https://stackoverflow.com/questions/28453895/how-to-detect-collision-between-two-objects-in-javascript-with-three-js
        let hazardBox = new THREE.Box3().setFromObject(this);
        hazardBox.min.y = -1;
        hazardBox.max.y = 1;
        const penguinBox = new THREE.Box3().setFromObject(scene.state.penguin);
        const collision = hazardBox.intersectsBox(penguinBox);
        if (collision && scene.state.speed < scene.state.maxSpeed) {
            scene.state.speed += 0.05;
            scene.state.penguin.seenIce = true;
        }

        if (this.state.move && !scene.state.gameOver) {
            this.translateZ(scene.state.speed);
            if (this.position.z > scene.state.cameraPosition.z) {
                // x is a random position (left to right) on the ramp
                const x = (Math.random() * 19) - 9.5;
                this.position.set(x, this.position.y, -125);
            }
        }
    } 
}

export default Ice;