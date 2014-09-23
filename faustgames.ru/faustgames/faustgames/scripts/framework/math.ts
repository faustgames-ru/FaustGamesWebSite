module mathematics {
    export class Number {
        static equal(a: number, b: number): boolean {
            return Math.abs(a - b) < 0.0001;
        }

        static isEmpty(a: number): boolean {
            return Number.equal(a, 0.0);
        }
    }

    export class Vector {
        _v: Float32Array;

        static _axisZ: Vector
        static getAxisZ(): Vector {
            if (!Vector._axisZ)
                Vector._axisZ = Vector.create(0.0, 0.0, 1.0);
            return Vector._axisZ;
        }

        static _axisY: Vector
        static getAxisY(): Vector {
            if (!Vector._axisY)
                Vector._axisY = Vector.create(0.0, 1.0, 0.0);
            return Vector._axisY;
        }

        static _axisX: Vector
        static getAxisX(): Vector {
            if (!Vector._axisX)
                Vector._axisX = Vector.create(1.0, 0.0, 0.0);
            return Vector._axisX;
        }

        static add(v1: Vector, v2: Vector): Vector {
            return Vector.create(v1.getX() + v2.getX(), v1.getY() + v2.getY(), v1.getZ() + v2.getZ());
        }

        static sub(v1: Vector, v2: Vector): Vector {
            return Vector.create(v1.getX() - v2.getX(), v1.getY() - v2.getY(), v1.getZ() - v2.getZ());
        }

        static div(v1: Vector, v: number): Vector {
            return Vector.create(v1.getX() / v, v1.getY() / v, v1.getZ() / v);
        }

        static create(x: number, y: number, z: number): Vector {
            var r = new Vector();
            r.setX(x);
            r.setY(y);
            r.setZ(z);
            return r;
        }

        constructor() {
            this._v = new Float32Array([0.0, 0.0, 0.0]);
        }

        isEmpty(): boolean {
            return Number.isEmpty(this.getX()) && Number.isEmpty(this.getY()) && Number.isEmpty(this.getZ());
        }

        normalize() {
            var l = this.getLength();
            return Vector.create(this.getX() / l, this.getY() / l, this.getZ() / l)
        }

        getLength(): number {
            return Math.sqrt(this.getX() * this.getX() + this.getY() * this.getY() + this.getZ() * this.getZ());
        }

        getV(i: number): number {
            return this._v[i];
        }

        getX(): number {
            return this._v[0];
        }
        setX(value: number) {
            this._v[0] = value;
        }
        getY(): number {
            return this._v[1];
        }
        setY(value: number) {
            this._v[1] = value;
        }
        getZ(): number {
            return this._v[2];
        }
        setZ(value: number) {
            this._v[2] = value;
        }
        toArray(): Float32Array {
            return this._v;
        }
    }

    export class Color {
        _v: Float32Array;
        constructor() {
            this._v = new Float32Array([0.0, 0.0, 0.0, 0.0]);
        }
        static fromRGBA(r: number, g: number, b: number, a: number): Color {
            var result = new Color();
            result.setR(r);
            result.setG(g);
            result.setB(b);
            result.setA(a);
            return result;
        }

        getR(): number {
            return this._v[0];
        }
        setR(value: number) {
            this._v[0] = value;
        }
        getG(): number {
            return this._v[1];
        }
        setG(value: number) {
            this._v[1] = value;
        }
        getB(): number {
            return this._v[2];
        }
        setB(value: number) {
            this._v[2] = value;
        }
        getA(): number {
            return this._v[3];
        }
        setA(value: number) {
            this._v[3] = value;
        }
        toArray(): Float32Array {
            return this._v;
        }
    }

    export class Matrix {
        _v: Float32Array;
        constructor() {
            this._v = new Float32Array([
                1.0, 0.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0]);
        }
        getV(x: number, y: number): number {
            return this._v[x * 4 + y];
        }
        setV(x: number, y: number, value: number): void {
            this._v[x * 4 + y] = value;
        }
        toArray(): Float32Array {
            return this._v;
        }

        toMatrix3(): Matrix3 {
            return Matrix3.create([
                this._v[0], this._v[1], this._v[2],
                this._v[4], this._v[5], this._v[6],
                this._v[8], this._v[9], this._v[10]]);
        }

        private setValues(v: number[]): void {
            this._v = new Float32Array(v);
        }

        private static createEmpty(): Matrix {
            var result = new Matrix();
            result.setValues([
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]);
            return result;
        }

        public static createArray(buffer: Float32Array): Matrix[] {
            var count = buffer.length / 16;
            var result = new Array<Matrix>(count);
            var k = 0;
            for (var i = 0; i < count; i++) {
                result[i] = new Matrix();
                for (var j = 0; j < 16; j++, k++) {
                    result[i]._v[j] = buffer[k];
                }
            }
            return result;
        }

        public static create(v: number[]): Matrix {
            var result = new Matrix();
            result.setValues(v);
            return result;
        }

        static createTranslateVector(v: Vector): Matrix {
            return Matrix.createTranslate(v.getX(), v.getY(), v.getZ());
        }

        static createTranslate(x: number, y: number, z: number): Matrix {
            return Matrix.create([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                x, y, z, 1]);
        }

        static createScale(x: number, y: number, z: number): Matrix {
            return Matrix.create([
                x, 0, 0, 0,
                0, y, 0, 0,
                0, 0, z, 0,
                0, 0, 0, 1]);
        }

        static createProjection(fov: number, aspect: number, nearDist: number, farDist: number): Matrix {
            var frustumDepth = farDist - nearDist;
            var oneOverDepth = 1 / frustumDepth;

            var result = new Matrix();
            result.setV(1, 1, 1 / Math.tan(0.5 * fov));
            result.setV(0, 0, result.getV(1, 1) / aspect);
            result.setV(2, 2, farDist * oneOverDepth);
            result.setV(3, 2, (-farDist * nearDist) * oneOverDepth);
            result.setV(2, 3, 1);
            result.setV(3, 3, 0);

            return result;
        }


        static createProjectionH(fov: number, aspect: number, nearDist: number, farDist: number): Matrix {
            var frustumDepth = farDist - nearDist;
            var oneOverDepth = 1 / frustumDepth;

            var result = new Matrix();
            result.setV(0, 0, 1 / Math.tan(0.5 * fov));
            result.setV(1, 1, result.getV(0, 0) / aspect);
            result.setV(2, 2, farDist * oneOverDepth);
            result.setV(3, 2, (-farDist * nearDist) * oneOverDepth);
            result.setV(2, 3, 1);
            result.setV(3, 3, 0);

            return result;
        }

        static createRotation(axis: Vector, sine: number, cosine: number): Matrix {
            var normal = axis.normalize();
            var a = normal.getX();
            var b = normal.getY();
            var c = normal.getZ();
            var d = Math.sqrt(b * b + c * c);

            var rxI = new Matrix();
            var rx = new Matrix();
            if (d != 0.0) {
                rxI = Matrix.createRotationX(b / d, c / d);
                rx = Matrix.createRotationX(-b / d, c / d);
            }
            var ryI = Matrix.createRotationY(-a, d);
            var ry = Matrix.createRotationY(a, d);
            var rz = Matrix.createRotationZ(sine, cosine);
            return Matrix.Multiply(Matrix.Multiply(Matrix.Multiply(rxI, ryI), Matrix.Multiply(rz, ry)), rx);
        }

        static createRotationZ(sine: number, cosine: number): Matrix {
            return Matrix.create([
                cosine, sine, 0, 0,
                -sine, cosine, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1]);
        }

        static createRotationX(sine: number, cosine: number): Matrix {
            return Matrix.create([
                1, 0, 0, 0,
                0, cosine, sine, 0,
                0, -sine, cosine, 0,
                0, 0, 0, 1]);
        }

        static Multiply(m1: Matrix, m2: Matrix): Matrix {
            var r = Matrix.createEmpty();
            var i: number, j: number, k: number;

            for (i = 0; i < 4; ++i)
                for (j = 0; j < 4; ++j) {
                    for (k = 0; k < 4; ++k)
                        r.setV(i, j, r.getV(i, j) + m1.getV(i, k) * m2.getV(k, j));
                }
            return r;
        }

        static createRotationY(sine: number, cosine: number): Matrix {
            return Matrix.create([
                cosine, 0, -sine, 0,
                0, 1, 0, 0,
                sine, 0, cosine, 0,
                0, 0, 0, 1]);
        }


        inverse(): Matrix {
            var xx = +Matrix.determinant3X3(this.getYY(), this.getYZ(), this.getYW(), this.getZY(), this.getZZ(), this.getZW(), this.getWY(), this.getWZ(), this.getWW());
            var xy = -Matrix.determinant3X3(this.getYX(), this.getYZ(), this.getYW(), this.getZX(), this.getZZ(), this.getZW(), this.getWX(), this.getWZ(), this.getWW());
            var xz = +Matrix.determinant3X3(this.getYX(), this.getYY(), this.getYW(), this.getZX(), this.getZY(), this.getZW(), this.getWX(), this.getWY(), this.getWW());
            var xw = -Matrix.determinant3X3(this.getYX(), this.getYY(), this.getYZ(), this.getZX(), this.getZY(), this.getZZ(), this.getWX(), this.getWY(), this.getWZ());

            var yx = -Matrix.determinant3X3(this.getXY(), this.getXZ(), this.getXW(), this.getZY(), this.getZZ(), this.getZW(), this.getWY(), this.getWZ(), this.getWW());
            var yy = +Matrix.determinant3X3(this.getXX(), this.getXZ(), this.getXW(), this.getZX(), this.getZZ(), this.getZW(), this.getWX(), this.getWZ(), this.getWW());
            var yz = -Matrix.determinant3X3(this.getXX(), this.getXY(), this.getXW(), this.getZX(), this.getZY(), this.getZW(), this.getWX(), this.getWY(), this.getWW());
            var yw = +Matrix.determinant3X3(this.getXX(), this.getXY(), this.getXZ(), this.getZX(), this.getZY(), this.getZZ(), this.getWX(), this.getWY(), this.getWZ());

            var zx = +Matrix.determinant3X3(this.getXY(), this.getXZ(), this.getXW(), this.getYY(), this.getYZ(), this.getYW(), this.getWY(), this.getWZ(), this.getWW());
            var zy = -Matrix.determinant3X3(this.getXX(), this.getXZ(), this.getXW(), this.getYX(), this.getYZ(), this.getYW(), this.getWX(), this.getWZ(), this.getWW());
            var zz = +Matrix.determinant3X3(this.getXX(), this.getXY(), this.getXW(), this.getYX(), this.getYY(), this.getYW(), this.getWX(), this.getWY(), this.getWW());
            var zw = -Matrix.determinant3X3(this.getXX(), this.getXY(), this.getXZ(), this.getYX(), this.getYY(), this.getYZ(), this.getWX(), this.getWY(), this.getWZ());

            var wx = -Matrix.determinant3X3(this.getXY(), this.getXZ(), this.getXW(), this.getYY(), this.getYZ(), this.getYW(), this.getZY(), this.getZZ(), this.getZW());
            var wy = +Matrix.determinant3X3(this.getXX(), this.getXZ(), this.getXW(), this.getYX(), this.getYZ(), this.getYW(), this.getZX(), this.getZZ(), this.getZW());
            var wz = -Matrix.determinant3X3(this.getXX(), this.getXY(), this.getXW(), this.getYX(), this.getYY(), this.getYW(), this.getZX(), this.getZY(), this.getZW());
            var ww = +Matrix.determinant3X3(this.getXX(), this.getXY(), this.getXZ(), this.getYX(), this.getYY(), this.getYZ(), this.getZX(), this.getZY(), this.getZZ());

            var l = this.getXX() * xx + this.getXY() * xy + this.getXZ() * xz + this.getXW() * xw;
            if (Math.abs(l) < 0.0001) {
                return new Matrix();
            }

            var d = 1.0 / l;
            return Matrix.create([
                xx * d, yx * d, zx * d, wx * d,
                xy * d, yy * d, zy * d, wy * d,
                xz * d, yz * d, zz * d, wz * d,
                xw * d, yw * d, zw * d, ww * d]);
        }

        getXX(): number {
            return this._v[0];
        }
        getXY(): number {
            return this._v[1];
        }
        getXZ(): number {
            return this._v[2];
        }
        getXW(): number {
            return this._v[3];
        }

        getYX(): number {
            return this._v[4];
        }
        getYY(): number {
            return this._v[5];
        }
        getYZ(): number {
            return this._v[6];
        }
        getYW(): number {
            return this._v[7];
        }

        getZX(): number {
            return this._v[8];
        }
        getZY(): number {
            return this._v[9];
        }
        getZZ(): number {
            return this._v[10];
        }
        getZW(): number {
            return this._v[11];
        }

        getWX(): number {
            return this._v[12];
        }
        getWY(): number {
            return this._v[13];
        }
        getWZ(): number {
            return this._v[14];
        }
        getWW(): number {
            return this._v[15];
        }

        static determinant3X3(
            xx: number, xy: number, xz: number,
            yx: number, yy: number, yz: number,
            zx: number, zy: number, zz: number): number {
            return xx * yy * zz + xy * yz * zx + yx * zy * xz - zx * yy * xz - xy * yx * zz - zy * yz * xx;
        }


        transform(v: Vector): Vector {
            return Vector.create(
                this._v[0] * v.getV(0) + this._v[4] * v.getV(1) + this._v[8] * v.getV(2) + this._v[12],
                this._v[2] * v.getV(0) + this._v[5] * v.getV(1) + this._v[9] * v.getV(2) + this._v[13],
                this._v[3] * v.getV(0) + this._v[6] * v.getV(1) + this._v[10] * v.getV(2) + this._v[14]);
        }

        transformProjection(v: Vector): Vector {
            var w = 1.0 / (this._v[12] * v.getV(0) + this._v[13] * v.getV(1) + this._v[14] * v.getV(2) + this._v[15]);
            return Vector.create(
                (this._v[0] * v.getV(0) + this._v[1] * v.getV(1) + this._v[2] * v.getV(2) + this._v[3]) * w,
                (this._v[4] * v.getV(0) + this._v[5] * v.getV(1) + this._v[6] * v.getV(2) + this._v[7]) * w,
                (this._v[8] * v.getV(0) + this._v[9] * v.getV(1) + this._v[10] * v.getV(2) + this._v[11]) * w);
        }
    }

    export class Matrix3 {
        _v: Float32Array;
        constructor() {
            this._v = new Float32Array([
                1.0, 0.0, 0.0, 
                0.0, 1.0, 0.0, 
                0.0, 0.0, 1.0]);
        }
        getV(x: number, y: number): number {
            return this._v[y * 3 + x];
        }
        setV(x: number, y: number, value: number): void {
            this._v[y * 3 + x] = value;
        }
        toArray(): Float32Array {
            return this._v;
        }
        
        private setValues(v: number[]): void {
            this._v = new Float32Array(v);
        }

        public static create(v: number[]): Matrix3 {
            var result = new Matrix3();
            result.setValues(v);
            return result;
        }
    }

    export class AngularValue {
        _axis: Vector;
        _value: number;
        
        constructor() {
            this._axis = Vector.getAxisZ();
            this._value = 0.0;
        }

        getAxis(): Vector {
            return this._axis;
        }
        setAxis(axis: Vector): AngularValue {
            this._axis = axis;
            return this;
        }
        getValue(): number {
            return this._value;
        }
        setValue(value: number): AngularValue {
            this._value = value;
            return this;
        }
    }

    export class Transform {
        _transformMatrix: Matrix;
        constructor() {
            this._transformMatrix = new Matrix();
        }
        getMatrix(): Matrix {
            return this._transformMatrix;
        }
    }

    export class Translation extends Transform {
        _position: Vector;
        constructor() {
            super();
            this._position = new Vector();
        }
        apply() {
            this._transformMatrix = Matrix.createTranslateVector(this._position);
        }
        setPosition(v: Vector): void {
            this._position = v;
            this.apply();
        }
        getPosition(): Vector {
            return this._position;
        }
    }


    export class Rotation extends Transform {
        rotate(axis: Vector, angle: number): void {
            this._transformMatrix = Matrix.Multiply(this._transformMatrix, Matrix.createRotation(axis, Math.sin(angle), Math.cos(angle)));
        }
        rotateX(angle: number): void {
            this._transformMatrix = Matrix.Multiply(this._transformMatrix, Matrix.createRotationX(Math.sin(angle), Math.cos(angle)));
        }
        rotateY(angle: number): void {
            this._transformMatrix = Matrix.Multiply(this._transformMatrix, Matrix.createRotationY(Math.sin(angle), Math.cos(angle)));
        }
        rotateZ(angle: number): void {
            this._transformMatrix = Matrix.Multiply(this._transformMatrix, Matrix.createRotationZ(Math.sin(angle), Math.cos(angle)));
        }
    }

    export class FloatValueRange {
        Min: number;
        Max: number;

        constructor(min: number, max: number) {
            this.Min = min;
            this.Max = max;
        }

        Gen(): number {
            return this.Min + Math.random() * (this.Max - this.Min);
        }
    }

    
    export class VectorValueRange {
        Min: Vector;
        Max: Vector;

        static createColor(min: Color, max: Color) {
            var r = new VectorValueRange();
            r.Min = Vector.create(min.getR(), min.getG(), min.getB());
            r.Max = Vector.create(max.getR(), max.getG(), max.getB());
            return r;
        }

        static createNumber(min: number, max: number) {
            var r = new VectorValueRange();
            r.Min = Vector.create(min, min, min);
            r.Max = Vector.create(max, max, max);
            return r;
        }

        static createVector(min: Vector, max: Vector) {
            var r = new VectorValueRange();
            r.Min = min;
            r.Max = max;
            return r;
        }

        Gen(): Vector {
            return Vector.create(
                this.Min.getX() + Math.random() * (this.Max.getX() - this.Min.getX()),
                this.Min.getY() + Math.random() * (this.Max.getY() - this.Min.getY()),
                this.Min.getZ() + Math.random() * (this.Max.getZ() - this.Min.getZ()));
        }
    }
}