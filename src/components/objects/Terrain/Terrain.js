import { BackSide, DoubleSide, FaceColors, FrontSide, Group, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshNormalMaterial, MeshPhongMaterial, PlaneGeometry, Vector2, VertexColors } from 'three';

class Terrain extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        // Seed the perlin noise.
        this.seed = Math.random();

        // The land is a Plane Geometry.
        const widthSegments = 70;
        const heightSegments = 70;
        this.width = 350;
        this.length = 350;
        this.geometry = new PlaneGeometry(this.width, this.length, widthSegments, heightSegments);
        this.material = new MeshPhongMaterial({
            side: BackSide,
            vertexColors: FaceColors
        });
        this.mesh = new Mesh(this.geometry, this.material);

        // Position the vertices.
        // Make the entire plane flat along the X-Z plane.
        this.geometry.rotateX(Math.PI / 2)
        for (let x = 0; x < widthSegments + 1; x++) {
            for (let y = 0; y < heightSegments + 1; y++) {
                const index = x + y * (widthSegments + 1);
                const vertex = this.geometry.vertices[index];

                const perlinX = x / 5;
                const perlinY = y / 5;
 
                vertex.y = -5.8 + 5 * this.perlin(perlinX, perlinY);
            }
        }
        for (let i = 0; i < this.geometry.vertices.length; i++) {
            //this.geometry.vertices[i].y = -4 + Math.random() * 2;
        }
        console.log(this.geometry.vertices.length)
        this.geometry.verticesNeedUpdate = true;
        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();
        this.geometry.colorsNeedUpdate = true;

        // Color the faces.
        this.geometry.faces.forEach(face => {
            const vertexA = this.geometry.vertices[face.a];
            const vertexB = this.geometry.vertices[face.b];
            const vertexC = this.geometry.vertices[face.c];

            // Simple flat shading for now, we can make more creative later.
            const averageY = (vertexA.y + vertexB.y + vertexC.y) / 3;
            const factor = (averageY + 5.8) / 5;
            face.color.setRGB(factor, factor, factor);
        });
        this.geometry.colorsNeedUpdate = true;

        //this.geometry.position.y = 0;

        //console.log(this.perlin(40.11764705882353, 30.019607843137255))

        this.add(this.mesh);
    }

    update() {
        //this.geometry.
    }

    perlin(x, y) {
        const point = new Vector2(x, y);

        // We define an imaginary unit grid and find the closest four points on it.
        const minX = Math.floor(x);
        const minY = Math.floor(y);
        const maxX = minX + 1;
        const maxY = minY + 1;

        const a = new Vector2(minX, minY);
        const b = new Vector2(minX, maxY);
        const c = new Vector2(maxX, minY);
        const d = new Vector2(maxX, maxY);

        // Find the random gradients at those points.
        const gradA = this.gradientAt(a);
        const gradB = this.gradientAt(b);
        const gradC = this.gradientAt(c);
        const gradD = this.gradientAt(d);

        const pa = new Vector2().subVectors(a, point);
        const pb = new Vector2().subVectors(b, point);
        const pc = new Vector2().subVectors(c, point);
        const pd = new Vector2().subVectors(d, point);

        // Dot products between offsets and gradients.
        const da = gradA.dot(pa);
        const db = gradB.dot(pb);
        const dc = gradC.dot(pc);
        const dd = gradD.dot(pd);

        // Repeated aplication of 1D interpolate to yeild a smooth 2D interpolation.
        const verticalInterpolateOne = this.smoothInterp(da, db, x - minX);
        const verticalInterpolateTwo = this.smoothInterp(dc, dd, x - minX);
        const horizontalInterpolate = this.smoothInterp(verticalInterpolateOne, verticalInterpolateTwo, y - minY);

        return horizontalInterpolate;
    }

    smoothInterp(a, b, factor) {
        function smootherstep(x) {
            // Use smootherstep (https://en.wikipedia.org/wiki/Smoothstep).
            return x * x * x * (x * (x * 6 - 15) + 10);
        }

        return (b - a) * smootherstep(factor) + a;
    }
    
    // Returns the gradient at a given point in the unit grid.
    gradientAt(point) {
        const x = point.x;
        const y = point.y;

        // Use the seed, x and y to return a predictable value.
        // Many good seeded PRNGs exist online, but we'll create our own out of interest.
        const a = Math.cos(Math.PI * this.seed + x * 7853 + y * 7883);
        const b = (a + 1) / 2;
        const c = (Math.cos(b * Math.PI) + 1) / 2;
        const d = Math.sin(b * Math.PI);

        return new Vector2(c, d).normalize();
    }
}

export default Terrain;
