import * as THREE from 'three';

// Jarvis March Convex Hull Algorithm
// https://www.youtube.com/watch?v=B2AJoQSZf4M

const xmin = -10;
const xmax = 10;
const total_width = xmax - xmin;
const y = -0.5;

// If point p2 is counterclockwise with respect to the line formed by p0 and p1,
// then return the angle between the two lines (p0 to p1 and p1 to p2). Otherwise
// return -1.
function counterclockwiseAngle(p0, p1, p2) {
    const a = p1.clone().sub(p0);
    const b = p2.clone().sub(p1);
    // console.log("a");
    // console.log(a);
    // console.log("b");
    // console.log(b);
    const direction = a.x * b.z - a.z * b.x;
    // console.log("direction");
    // console.log(direction);
    if (direction >= 0) {
        // console.log("HERE");
        const length_a = Math.sqrt((a.x * a.x) + (a.y * a.y) + (a.z * a.z));
        const length_b = Math.sqrt((b.x * b.x) + (b.y * b.y) + (b.z * b.z));
        const theta = Math.acos(a.dot(b) / (length_a * length_b));
        return theta;
    }
    return -1;
}

// Generate a set of n pseudorandom 3D points, where x is a random value between
// 0 and width (4), y is -0.5, and z is a random value between 0 and depth (20).
function generateRandomPoint() {
    const width = 1;
    const depth = 1;
    const x = Math.abs(Math.random() * width);
    const y = -0.5;
    const z = Math.abs(Math.random() * depth);
    const point = new THREE.Vector3(x, y, z);
    return point;
}

// Generate an array of vertices of a convex polygon using the Jarvis March algorithm.
function generateRandomPolygon() {
    // Generate a random center position for the polygon
    // let center = new THREE.Vector3(0, y, 250);
    // center.x = Math.random() * total_width - xmax;

    // n is the number of random points to generate
    let points = [];
    const n = 10;
    for (let i = 0; i < n; i++) {
        const point = generateRandomPoint();
        points.push(point);
    }
    // console.log(points);

    // Use the Jarvis March Algorithm to find the vertices
    // of the convex polygon
    // Step 1: Find the point with the minimum z value
    let min = Number.MAX_VALUE;
    let argmin = -1;
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        if (point.z < min) {
            min = point.z;
            argmin = i;
        }
    }
    const min_point = points[argmin].clone();

    // Step 2: For each found vertex, iterate through all of the potential vertices
    // in points to find the next point. Stop when the next point is the same as the
    // original point, meaning that all of the vertices of the convex polygon have 
    // been found.
    let vertices = [];
    vertices.push(min_point);
    let p0 = new THREE.Vector3(min_point.x - 1, y, min_point.z);
    let p1 = min_point.clone();
    while (true) {
        // Find point with smallest counterclockwise angle in reference to
        // the previous point
        let min_angle = Number.MAX_VALUE;
        argmin = -1;
        // console.log(points)
        for (let i = 0; i < points.length; i++) {
            const p2 = points[i].clone();
            const angle = counterclockwiseAngle(p0.clone(), p1.clone(), p2.clone());
            // console.log("angle");
            // console.log(angle);
            if (angle > 0 && angle < min_angle) {
                min_angle = angle;
                argmin = i;
            }
            p0 = p1.clone();
            p1 = p2.clone();
        }
        console.log("argmin:");
        console.log(argmin);

        // Break when polygon is complete 
        if (points[argmin].equals(min_point)) {
            break;
        }

        // Otherwise add the point to the vertices array
        vertices.push(points[argmin]);
    }
    return vertices;
}

class Ice extends THREE.Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            move: true,
        };
        
        // Create a random polygon
        const vertices = generateRandomPolygon();
        // console.log(vertices);

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    // Code copied from flower -- adjust so that box translates in the
    // positive z direction
    update(timeStamp, state) {
        // Stack overflow for collision detection:
        // https://stackoverflow.com/questions/28453895/how-to-detect-collision-between-two-objects-in-javascript-with-three-js
        const hazardBox = new THREE.Box3().setFromObject(this);
        const penguinBox = new THREE.Box3().setFromObject(state.penguin);
        const collision = hazardBox.intersectsBox(penguinBox);
        if (collision) {
            this.state.move = false;
            state.gameOver = true;
        }

        if (this.state.move && !state.gameOver) {
            this.translateZ(0.11);
        }
    }
}

export default Ice;