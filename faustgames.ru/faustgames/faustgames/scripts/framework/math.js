var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var mathematics;
(function (mathematics) {
    var Number = (function () {
        function Number() {
        }
        Number.equal = function (a, b) {
            return Math.abs(a - b) < 0.0001;
        };

        Number.isEmpty = function (a) {
            return Number.equal(a, 0.0);
        };
        return Number;
    })();
    mathematics.Number = Number;

    var Vector = (function () {
        function Vector() {
            this._v = new Float32Array([0.0, 0.0, 0.0]);
        }
        Vector.getAxisZ = function () {
            if (!Vector._axisZ)
                Vector._axisZ = Vector.create(0.0, 0.0, 1.0);
            return Vector._axisZ;
        };

        Vector.getAxisY = function () {
            if (!Vector._axisY)
                Vector._axisY = Vector.create(0.0, 1.0, 0.0);
            return Vector._axisY;
        };

        Vector.getAxisX = function () {
            if (!Vector._axisX)
                Vector._axisX = Vector.create(1.0, 0.0, 0.0);
            return Vector._axisX;
        };

        Vector.add = function (v1, v2) {
            return Vector.create(v1.getX() + v2.getX(), v1.getY() + v2.getY(), v1.getZ() + v2.getZ());
        };

        Vector.sub = function (v1, v2) {
            return Vector.create(v1.getX() - v2.getX(), v1.getY() - v2.getY(), v1.getZ() - v2.getZ());
        };

        Vector.div = function (v1, v) {
            return Vector.create(v1.getX() / v, v1.getY() / v, v1.getZ() / v);
        };

        Vector.create = function (x, y, z) {
            var r = new Vector();
            r.setX(x);
            r.setY(y);
            r.setZ(z);
            return r;
        };

        Vector.prototype.isEmpty = function () {
            return Number.isEmpty(this.getX()) && Number.isEmpty(this.getY()) && Number.isEmpty(this.getZ());
        };

        Vector.prototype.normalize = function () {
            var l = this.getLength();
            return Vector.create(this.getX() / l, this.getY() / l, this.getZ() / l);
        };

        Vector.prototype.getLength = function () {
            return Math.sqrt(this.getX() * this.getX() + this.getY() * this.getY() + this.getZ() * this.getZ());
        };

        Vector.prototype.getV = function (i) {
            return this._v[i];
        };

        Vector.prototype.getX = function () {
            return this._v[0];
        };
        Vector.prototype.setX = function (value) {
            this._v[0] = value;
        };
        Vector.prototype.getY = function () {
            return this._v[1];
        };
        Vector.prototype.setY = function (value) {
            this._v[1] = value;
        };
        Vector.prototype.getZ = function () {
            return this._v[2];
        };
        Vector.prototype.setZ = function (value) {
            this._v[2] = value;
        };
        Vector.prototype.toArray = function () {
            return this._v;
        };
        return Vector;
    })();
    mathematics.Vector = Vector;

    var Color = (function () {
        function Color() {
            this._v = new Float32Array([0.0, 0.0, 0.0, 0.0]);
        }
        Color.fromRGBA = function (r, g, b, a) {
            var result = new Color();
            result.setR(r);
            result.setG(g);
            result.setB(b);
            result.setA(a);
            return result;
        };

        Color.prototype.getR = function () {
            return this._v[0];
        };
        Color.prototype.setR = function (value) {
            this._v[0] = value;
        };
        Color.prototype.getG = function () {
            return this._v[1];
        };
        Color.prototype.setG = function (value) {
            this._v[1] = value;
        };
        Color.prototype.getB = function () {
            return this._v[2];
        };
        Color.prototype.setB = function (value) {
            this._v[2] = value;
        };
        Color.prototype.getA = function () {
            return this._v[3];
        };
        Color.prototype.setA = function (value) {
            this._v[3] = value;
        };
        Color.prototype.toArray = function () {
            return this._v;
        };
        return Color;
    })();
    mathematics.Color = Color;

    var Matrix = (function () {
        function Matrix() {
            this._v = new Float32Array([
                1.0, 0.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0]);
        }
        Matrix.prototype.getV = function (x, y) {
            return this._v[x * 4 + y];
        };
        Matrix.prototype.setV = function (x, y, value) {
            this._v[x * 4 + y] = value;
        };
        Matrix.prototype.toArray = function () {
            return this._v;
        };

        Matrix.prototype.toMatrix3 = function () {
            return Matrix3.create([
                this._v[0], this._v[1], this._v[2],
                this._v[4], this._v[5], this._v[6],
                this._v[8], this._v[9], this._v[10]]);
        };

        Matrix.prototype.setValues = function (v) {
            this._v = new Float32Array(v);
        };

        Matrix.createEmpty = function () {
            var result = new Matrix();
            result.setValues([
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0]);
            return result;
        };

        Matrix.createArray = function (buffer) {
            var count = buffer.length / 16;
            var result = new Array(count);
            var k = 0;
            for (var i = 0; i < count; i++) {
                result[i] = new Matrix();
                for (var j = 0; j < 16; j++, k++) {
                    result[i]._v[j] = buffer[k];
                }
            }
            return result;
        };

        Matrix.create = function (v) {
            var result = new Matrix();
            result.setValues(v);
            return result;
        };

        Matrix.createTranslateVector = function (v) {
            return Matrix.createTranslate(v.getX(), v.getY(), v.getZ());
        };

        Matrix.createTranslate = function (x, y, z) {
            return Matrix.create([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                x, y, z, 1]);
        };

        Matrix.createScale = function (x, y, z) {
            return Matrix.create([
                x, 0, 0, 0,
                0, y, 0, 0,
                0, 0, z, 0,
                0, 0, 0, 1]);
        };

        Matrix.createProjection = function (fov, aspect, nearDist, farDist) {
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
        };

        Matrix.createProjectionH = function (fov, aspect, nearDist, farDist) {
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
        };

        Matrix.createRotation = function (axis, sine, cosine) {
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
        };

        Matrix.createRotationZ = function (sine, cosine) {
            return Matrix.create([
                cosine, sine, 0, 0,
                -sine, cosine, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1]);
        };

        Matrix.createRotationX = function (sine, cosine) {
            return Matrix.create([
                1, 0, 0, 0,
                0, cosine, sine, 0,
                0, -sine, cosine, 0,
                0, 0, 0, 1]);
        };

        Matrix.Multiply = function (m1, m2) {
            var r = Matrix.createEmpty();
            var i, j, k;

            for (i = 0; i < 4; ++i)
                for (j = 0; j < 4; ++j) {
                    for (k = 0; k < 4; ++k)
                        r.setV(i, j, r.getV(i, j) + m1.getV(i, k) * m2.getV(k, j));
                }
            return r;
        };

        Matrix.createRotationY = function (sine, cosine) {
            return Matrix.create([
                cosine, 0, -sine, 0,
                0, 1, 0, 0,
                sine, 0, cosine, 0,
                0, 0, 0, 1]);
        };

        Matrix.prototype.inverse = function () {
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
        };

        Matrix.prototype.getXX = function () {
            return this._v[0];
        };
        Matrix.prototype.getXY = function () {
            return this._v[1];
        };
        Matrix.prototype.getXZ = function () {
            return this._v[2];
        };
        Matrix.prototype.getXW = function () {
            return this._v[3];
        };

        Matrix.prototype.getYX = function () {
            return this._v[4];
        };
        Matrix.prototype.getYY = function () {
            return this._v[5];
        };
        Matrix.prototype.getYZ = function () {
            return this._v[6];
        };
        Matrix.prototype.getYW = function () {
            return this._v[7];
        };

        Matrix.prototype.getZX = function () {
            return this._v[8];
        };
        Matrix.prototype.getZY = function () {
            return this._v[9];
        };
        Matrix.prototype.getZZ = function () {
            return this._v[10];
        };
        Matrix.prototype.getZW = function () {
            return this._v[11];
        };

        Matrix.prototype.getWX = function () {
            return this._v[12];
        };
        Matrix.prototype.getWY = function () {
            return this._v[13];
        };
        Matrix.prototype.getWZ = function () {
            return this._v[14];
        };
        Matrix.prototype.getWW = function () {
            return this._v[15];
        };

        Matrix.determinant3X3 = function (xx, xy, xz, yx, yy, yz, zx, zy, zz) {
            return xx * yy * zz + xy * yz * zx + yx * zy * xz - zx * yy * xz - xy * yx * zz - zy * yz * xx;
        };

        Matrix.prototype.transform = function (v) {
            return Vector.create(this._v[0] * v.getV(0) + this._v[4] * v.getV(1) + this._v[8] * v.getV(2) + this._v[12], this._v[2] * v.getV(0) + this._v[5] * v.getV(1) + this._v[9] * v.getV(2) + this._v[13], this._v[3] * v.getV(0) + this._v[6] * v.getV(1) + this._v[10] * v.getV(2) + this._v[14]);
        };

        Matrix.prototype.transformProjection = function (v) {
            var w = 1.0 / (this._v[12] * v.getV(0) + this._v[13] * v.getV(1) + this._v[14] * v.getV(2) + this._v[15]);
            return Vector.create((this._v[0] * v.getV(0) + this._v[1] * v.getV(1) + this._v[2] * v.getV(2) + this._v[3]) * w, (this._v[4] * v.getV(0) + this._v[5] * v.getV(1) + this._v[6] * v.getV(2) + this._v[7]) * w, (this._v[8] * v.getV(0) + this._v[9] * v.getV(1) + this._v[10] * v.getV(2) + this._v[11]) * w);
        };
        return Matrix;
    })();
    mathematics.Matrix = Matrix;

    var Matrix3 = (function () {
        function Matrix3() {
            this._v = new Float32Array([
                1.0, 0.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 0.0, 1.0]);
        }
        Matrix3.prototype.getV = function (x, y) {
            return this._v[y * 3 + x];
        };
        Matrix3.prototype.setV = function (x, y, value) {
            this._v[y * 3 + x] = value;
        };
        Matrix3.prototype.toArray = function () {
            return this._v;
        };

        Matrix3.prototype.setValues = function (v) {
            this._v = new Float32Array(v);
        };

        Matrix3.create = function (v) {
            var result = new Matrix3();
            result.setValues(v);
            return result;
        };
        return Matrix3;
    })();
    mathematics.Matrix3 = Matrix3;

    var AngularValue = (function () {
        function AngularValue() {
            this._axis = Vector.getAxisZ();
            this._value = 0.0;
        }
        AngularValue.prototype.getAxis = function () {
            return this._axis;
        };
        AngularValue.prototype.setAxis = function (axis) {
            this._axis = axis;
            return this;
        };
        AngularValue.prototype.getValue = function () {
            return this._value;
        };
        AngularValue.prototype.setValue = function (value) {
            this._value = value;
            return this;
        };
        return AngularValue;
    })();
    mathematics.AngularValue = AngularValue;

    var Transform = (function () {
        function Transform() {
            this._transformMatrix = new Matrix();
        }
        Transform.prototype.getMatrix = function () {
            return this._transformMatrix;
        };
        return Transform;
    })();
    mathematics.Transform = Transform;

    var Translation = (function (_super) {
        __extends(Translation, _super);
        function Translation() {
            _super.call(this);
            this._position = new Vector();
        }
        Translation.prototype.apply = function () {
            this._transformMatrix = Matrix.createTranslateVector(this._position);
        };
        Translation.prototype.setPosition = function (v) {
            this._position = v;
            this.apply();
        };
        Translation.prototype.getPosition = function () {
            return this._position;
        };
        return Translation;
    })(Transform);
    mathematics.Translation = Translation;

    var Rotation = (function (_super) {
        __extends(Rotation, _super);
        function Rotation() {
            _super.apply(this, arguments);
        }
        Rotation.prototype.rotate = function (axis, angle) {
            this._transformMatrix = Matrix.Multiply(this._transformMatrix, Matrix.createRotation(axis, Math.sin(angle), Math.cos(angle)));
        };
        Rotation.prototype.rotateX = function (angle) {
            this._transformMatrix = Matrix.Multiply(this._transformMatrix, Matrix.createRotationX(Math.sin(angle), Math.cos(angle)));
        };
        Rotation.prototype.rotateY = function (angle) {
            this._transformMatrix = Matrix.Multiply(this._transformMatrix, Matrix.createRotationY(Math.sin(angle), Math.cos(angle)));
        };
        Rotation.prototype.rotateZ = function (angle) {
            this._transformMatrix = Matrix.Multiply(this._transformMatrix, Matrix.createRotationZ(Math.sin(angle), Math.cos(angle)));
        };
        return Rotation;
    })(Transform);
    mathematics.Rotation = Rotation;

    var FloatValueRange = (function () {
        function FloatValueRange(min, max) {
            this.Min = min;
            this.Max = max;
        }
        FloatValueRange.prototype.Gen = function () {
            return this.Min + Math.random() * (this.Max - this.Min);
        };
        return FloatValueRange;
    })();
    mathematics.FloatValueRange = FloatValueRange;

    var VectorValueRange = (function () {
        function VectorValueRange() {
        }
        VectorValueRange.createColor = function (min, max) {
            var r = new VectorValueRange();
            r.Min = Vector.create(min.getR(), min.getG(), min.getB());
            r.Max = Vector.create(max.getR(), max.getG(), max.getB());
            return r;
        };

        VectorValueRange.createNumber = function (min, max) {
            var r = new VectorValueRange();
            r.Min = Vector.create(min, min, min);
            r.Max = Vector.create(max, max, max);
            return r;
        };

        VectorValueRange.createVector = function (min, max) {
            var r = new VectorValueRange();
            r.Min = min;
            r.Max = max;
            return r;
        };

        VectorValueRange.prototype.Gen = function () {
            return Vector.create(this.Min.getX() + Math.random() * (this.Max.getX() - this.Min.getX()), this.Min.getY() + Math.random() * (this.Max.getY() - this.Min.getY()), this.Min.getZ() + Math.random() * (this.Max.getZ() - this.Min.getZ()));
        };
        return VectorValueRange;
    })();
    mathematics.VectorValueRange = VectorValueRange;
})(mathematics || (mathematics = {}));
//# sourceMappingURL=math.js.map
