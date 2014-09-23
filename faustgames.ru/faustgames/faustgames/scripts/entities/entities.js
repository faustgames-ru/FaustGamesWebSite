/// <reference path="../framework/core.ts"/>
/// <reference path="../framework/math.ts"/>
/// <reference path="../framework/rendering.ts"/>
/// <reference path="../rendering/effects.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var entities;
(function (entities) {
    var ColorTheme = (function () {
        function ColorTheme() {
            this.SkyBoxColor = mathematics.Color.fromRGBA(1.0, 1.0, 1.0, 1);
            this.AdditiveParticles = mathematics.Color.fromRGBA(1, 0.75, 0.5, 1);
            this.Particles = mathematics.Color.fromRGBA(0.25, 0.2, 0.15, 1);
            this.Clouds = mathematics.Color.fromRGBA(1.0, 1.0, 1.0, 1.0);
            this.NebulaBack = mathematics.Color.fromRGBA(1.0, 1.0, 1.0, 1);
            this.NebulaFront = mathematics.Color.fromRGBA(1, 0.75, 0.5, 1);
        }
        ColorTheme.getDefault = function () {
            if (!ColorTheme._default)
                ColorTheme._default = new ColorTheme();
            return ColorTheme._default;
        };
        return ColorTheme;
    })();
    entities.ColorTheme = ColorTheme;

    var Textures = (function () {
        function Textures() {
        }
        return Textures;
    })();
    entities.Textures = Textures;

    var Effects = (function () {
        function Effects() {
        }
        return Effects;
    })();
    entities.Effects = Effects;

    var Camera = (function () {
        function Camera() {
            this._position = new mathematics.Vector();
            this._projection = new mathematics.Matrix();
            this._lensProjection = new mathematics.Matrix();
            this._skyBoxTransform = new mathematics.Matrix();
            this._viewTransform = new mathematics.Matrix();
            this._fullTransform = new mathematics.Matrix();
            this._normal = new mathematics.Matrix3();
            this._fov = Math.PI / 1.5;
            this._height = 100;
            this._distance = 32.0;
            this._aspect = 1.0;
            this._resistanceK = 0.5;
            this._near = 1.0;
            this._far = 1500.0;

            this.RotationVelocity = new mathematics.AngularValue();
            this.ExtraRotationVelocity = new mathematics.AngularValue();

            this.Rotation = new mathematics.Rotation();
            this.Rotation.rotateY(Math.PI);
            this.ExtraRotation = new mathematics.Rotation();
            this.Translation = new mathematics.Translation();
        }
        Camera.prototype.getFov = function () {
            return this._fov;
        };

        Camera.prototype.getHeight = function () {
            return this._height;
        };

        Camera.prototype.setViewport = function (fov, width, height) {
            this._fov = fov;
            this._height = height;
            var aspect = width / height;
            this._aspect = aspect;
            if (width > height) {
                this._projection = mathematics.Matrix.createProjectionH(fov, 1.0 / aspect, this._near, this._far);
                this._lensProjection = mathematics.Matrix.createProjectionH(fov, 1.0 / aspect, this._near, this._far);
            } else {
                this._projection = mathematics.Matrix.createProjection(fov, aspect, this._near, this._far);
                this._lensProjection = mathematics.Matrix.createProjection(fov, aspect, this._near, this._far);
            }
        };

        Camera.prototype.apply = function () {
            this._skyBoxTransform = mathematics.Matrix.Multiply(mathematics.Matrix.Multiply(this.Rotation.getMatrix(), this.ExtraRotation.getMatrix()), this._projection);
            this._viewTransform = mathematics.Matrix.Multiply(mathematics.Matrix.Multiply(this.Rotation.getMatrix(), this.ExtraRotation.getMatrix()), mathematics.Matrix.createTranslate(0, 0, this._distance));
            this._fullTransform = mathematics.Matrix.Multiply(this._viewTransform, this._projection);
            this._position = this._viewTransform.inverse().transform(mathematics.Vector.create(0, 0, 0));
            this._normal = mathematics.Matrix3.create([
                this._fullTransform.getV(0, 0), this._fullTransform.getV(0, 1), this._fullTransform.getV(0, 2),
                this._fullTransform.getV(1, 0), this._fullTransform.getV(1, 1), this._fullTransform.getV(1, 2),
                this._fullTransform.getV(2, 0), this._fullTransform.getV(2, 1), this._fullTransform.getV(2, 2)]);
        };

        Camera.prototype.update = function (args) {
            var timeDelta = args.Delta;
            var v = this.RotationVelocity.getValue();
            var ev = this.ExtraRotationVelocity.getValue();
            this.Rotation.rotate(this.RotationVelocity.getAxis(), v * timeDelta);
            this.ExtraRotation.rotate(this.ExtraRotationVelocity.getAxis(), ev * timeDelta);

            var resistanceA = this._resistanceK * this.RotationVelocity.getValue();
            if (v > 0) {
                v -= resistanceA * timeDelta;
                if (v < 0)
                    v = 0;
            } else {
                v += resistanceA * timeDelta;
                if (v > 0)
                    v = 0;
            }

            var resistanceA = this._resistanceK * this.ExtraRotationVelocity.getValue();
            if (ev > 0) {
                ev -= resistanceA * timeDelta;
                if (ev < 0)
                    ev = 0;
            } else {
                ev += resistanceA * timeDelta;
                if (ev > 0)
                    ev = 0;
            }

            this.RotationVelocity.setValue(v);
            this.ExtraRotationVelocity.setValue(ev);
        };

        Camera.prototype.getPosition = function () {
            return this._position;
        };

        Camera.prototype.getZNear = function () {
            return this._near;
        };

        Camera.prototype.getZFar = function () {
            return this._far;
        };

        Camera.prototype.getNormal = function () {
            return this._normal;
        };

        Camera.prototype.getViewTransform = function () {
            return this._viewTransform;
        };
        Camera.prototype.getProjectionTransform = function () {
            return this._projection;
        };
        Camera.prototype.getLensProjectionTransform = function () {
            return this._lensProjection;
        };
        Camera.prototype.getTransform = function () {
            return this._fullTransform;
        };
        Camera.prototype.getSkyBoxTransform = function () {
            return this._skyBoxTransform;
        };
        return Camera;
    })();
    entities.Camera = Camera;

    var Skybox = (function () {
        function Skybox() {
            this._signature = new rendering.VertexSignatures([rendering.Declarations.Position, rendering.Declarations.TexturePosition]);
            this._vertexBuffer = new rendering.VertexBuffer(this._signature, new Float32Array([
                -1.0000, -1.0000, 0.0000, 0.0000, 1.0000,
                -1.0820, -0.8115, 0.0820, 0.0000, 0.9097,
                -1.1547, -0.5774, 0.1547, 0.0000, 0.7952,
                -1.2060, -0.3015, 0.2060, 0.0000, 0.6560,
                -1.2247, 0.0000, 0.2247, 0.0000, 0.5000,
                -1.2060, 0.3015, 0.2060, 0.0000, 0.3440,
                -1.1547, 0.5774, 0.1547, 0.0000, 0.2048,
                -1.0820, 0.8115, 0.0820, 0.0000, 0.0903,
                -1.0000, 1.0000, 0.0000, 0.0000, 0.0000,
                -0.8115, -1.0820, 0.0820, 0.0903, 1.0000,
                -0.8911, -0.8911, 0.1882, 0.0903, 0.9097,
                -0.9649, -0.6433, 0.2865, 0.0903, 0.7952,
                -1.0190, -0.3397, 0.3587, 0.0903, 0.6560,
                -1.0392, 0.0000, 0.3856, 0.0903, 0.5000,
                -1.0190, 0.3397, 0.3587, 0.0903, 0.3440,
                -0.9649, 0.6433, 0.2865, 0.0903, 0.2048,
                -0.8911, 0.8911, 0.1882, 0.0903, 0.0903,
                -0.8115, 1.0820, 0.0820, 0.0903, 0.0000,
                -0.5774, -1.1547, 0.1547, 0.2048, 1.0000,
                -0.6433, -0.9649, 0.2865, 0.2048, 0.9097,
                -0.7071, -0.7071, 0.4142, 0.2048, 0.7952,
                -0.7559, -0.3780, 0.5119, 0.2048, 0.6560,
                -0.7746, 0.0000, 0.5492, 0.2048, 0.5000,
                -0.7559, 0.3780, 0.5119, 0.2048, 0.3440,
                -0.7071, 0.7071, 0.4142, 0.2048, 0.2048,
                -0.6433, 0.9649, 0.2865, 0.2048, 0.0903,
                -0.5774, 1.1547, 0.1547, 0.2048, 0.0000,
                -0.3015, -1.2060, 0.2060, 0.3440, 1.0000,
                -0.3397, -1.0190, 0.3587, 0.3440, 0.9097,
                -0.3780, -0.7559, 0.5119, 0.3440, 0.7952,
                -0.4082, -0.4082, 0.6330, 0.3440, 0.6560,
                -0.4201, 0.0000, 0.6803, 0.3440, 0.5000,
                -0.4082, 0.4082, 0.6330, 0.3440, 0.3440,
                -0.3780, 0.7559, 0.5119, 0.3440, 0.2048,
                -0.3397, 1.0190, 0.3587, 0.3440, 0.0903,
                -0.3015, 1.2060, 0.2060, 0.3440, 0.0000,
                0.0000, -1.2247, 0.2247, 0.5000, 1.0000,
                0.0000, -1.0392, 0.3856, 0.5000, 0.9097,
                0.0000, -0.7746, 0.5492, 0.5000, 0.7952,
                0.0000, -0.4201, 0.6803, 0.5000, 0.6560,
                0.0000, 0.0000, 0.7321, 0.5000, 0.5000,
                0.0000, 0.4201, 0.6803, 0.5000, 0.3440,
                0.0000, 0.7746, 0.5492, 0.5000, 0.2048,
                0.0000, 1.0392, 0.3856, 0.5000, 0.0903,
                0.0000, 1.2247, 0.2247, 0.5000, 0.0000,
                0.3015, -1.2060, 0.2060, 0.6560, 1.0000,
                0.3397, -1.0190, 0.3587, 0.6560, 0.9097,
                0.3780, -0.7559, 0.5119, 0.6560, 0.7952,
                0.4082, -0.4082, 0.6330, 0.6560, 0.6560,
                0.4201, 0.0000, 0.6803, 0.6560, 0.5000,
                0.4082, 0.4082, 0.6330, 0.6560, 0.3440,
                0.3780, 0.7559, 0.5119, 0.6560, 0.2048,
                0.3397, 1.0190, 0.3587, 0.6560, 0.0903,
                0.3015, 1.2060, 0.2060, 0.6560, 0.0000,
                0.5774, -1.1547, 0.1547, 0.7952, 1.0000,
                0.6433, -0.9649, 0.2865, 0.7952, 0.9097,
                0.7071, -0.7071, 0.4142, 0.7952, 0.7952,
                0.7559, -0.3780, 0.5119, 0.7952, 0.6560,
                0.7746, 0.0000, 0.5492, 0.7952, 0.5000,
                0.7559, 0.3780, 0.5119, 0.7952, 0.3440,
                0.7071, 0.7071, 0.4142, 0.7952, 0.2048,
                0.6433, 0.9649, 0.2865, 0.7952, 0.0903,
                0.5774, 1.1547, 0.1547, 0.7952, 0.0000,
                0.8115, -1.0820, 0.0820, 0.9097, 1.0000,
                0.8911, -0.8911, 0.1882, 0.9097, 0.9097,
                0.9649, -0.6433, 0.2865, 0.9097, 0.7952,
                1.0190, -0.3397, 0.3587, 0.9097, 0.6560,
                1.0392, 0.0000, 0.3856, 0.9097, 0.5000,
                1.0190, 0.3397, 0.3587, 0.9097, 0.3440,
                0.9649, 0.6433, 0.2865, 0.9097, 0.2048,
                0.8911, 0.8911, 0.1882, 0.9097, 0.0903,
                0.8115, 1.0820, 0.0820, 0.9097, 0.0000,
                1.0000, -1.0000, 0.0000, 1.0000, 1.0000,
                1.0820, -0.8115, 0.0820, 1.0000, 0.9097,
                1.1547, -0.5774, 0.1547, 1.0000, 0.7952,
                1.2060, -0.3015, 0.2060, 1.0000, 0.6560,
                1.2247, 0.0000, 0.2247, 1.0000, 0.5000,
                1.2060, 0.3015, 0.2060, 1.0000, 0.3440,
                1.1547, 0.5774, 0.1547, 1.0000, 0.2048,
                1.0820, 0.8115, 0.0820, 1.0000, 0.0903,
                1.0000, 1.0000, 0.0000, 1.0000, 0.0000
            ]));
            this._indices = new rendering.IndexBuffer(new Uint16Array([
                0, 1, 10, 0, 10, 9,
                1, 2, 11, 1, 11, 10,
                2, 3, 12, 2, 12, 11,
                3, 4, 13, 3, 13, 12,
                4, 5, 14, 4, 14, 13,
                5, 6, 15, 5, 15, 14,
                6, 7, 16, 6, 16, 15,
                7, 8, 17, 7, 17, 16,
                9, 10, 19, 9, 19, 18,
                10, 11, 20, 10, 20, 19,
                11, 12, 21, 11, 21, 20,
                12, 13, 22, 12, 22, 21,
                13, 14, 23, 13, 23, 22,
                14, 15, 24, 14, 24, 23,
                15, 16, 25, 15, 25, 24,
                16, 17, 26, 16, 26, 25,
                18, 19, 28, 18, 28, 27,
                19, 20, 29, 19, 29, 28,
                20, 21, 30, 20, 30, 29,
                21, 22, 31, 21, 31, 30,
                22, 23, 32, 22, 32, 31,
                23, 24, 33, 23, 33, 32,
                24, 25, 34, 24, 34, 33,
                25, 26, 35, 25, 35, 34,
                27, 28, 37, 27, 37, 36,
                28, 29, 38, 28, 38, 37,
                29, 30, 39, 29, 39, 38,
                30, 31, 40, 30, 40, 39,
                31, 32, 41, 31, 41, 40,
                32, 33, 42, 32, 42, 41,
                33, 34, 43, 33, 43, 42,
                34, 35, 44, 34, 44, 43,
                36, 37, 46, 36, 46, 45,
                37, 38, 47, 37, 47, 46,
                38, 39, 48, 38, 48, 47,
                39, 40, 49, 39, 49, 48,
                40, 41, 50, 40, 50, 49,
                41, 42, 51, 41, 51, 50,
                42, 43, 52, 42, 52, 51,
                43, 44, 53, 43, 53, 52,
                45, 46, 55, 45, 55, 54,
                46, 47, 56, 46, 56, 55,
                47, 48, 57, 47, 57, 56,
                48, 49, 58, 48, 58, 57,
                49, 50, 59, 49, 59, 58,
                50, 51, 60, 50, 60, 59,
                51, 52, 61, 51, 61, 60,
                52, 53, 62, 52, 62, 61,
                54, 55, 64, 54, 64, 63,
                55, 56, 65, 55, 65, 64,
                56, 57, 66, 56, 66, 65,
                57, 58, 67, 57, 67, 66,
                58, 59, 68, 58, 68, 67,
                59, 60, 69, 59, 69, 68,
                60, 61, 70, 60, 70, 69,
                61, 62, 71, 61, 71, 70,
                63, 64, 73, 63, 73, 72,
                64, 65, 74, 64, 74, 73,
                65, 66, 75, 65, 75, 74,
                66, 67, 76, 66, 76, 75,
                67, 68, 77, 67, 77, 76,
                68, 69, 78, 68, 78, 77,
                69, 70, 79, 69, 79, 78,
                70, 71, 80, 70, 80, 79
            ]));
            var scale = 500;
            this._renderJoint = new rendering.RenderJoint(Effects.Skybox, this._vertexBuffer);
            this._zPTransform = mathematics.Matrix.Multiply(mathematics.Matrix.createTranslate(0, 0, 1), mathematics.Matrix.createScale(scale, scale, scale));
            this._zMTransform = mathematics.Matrix.Multiply(this._zPTransform, mathematics.Matrix.createRotationY(0, -1));
            this._xPTransform = mathematics.Matrix.Multiply(this._zPTransform, mathematics.Matrix.createRotationY(1, 0));
            this._xMTransform = mathematics.Matrix.Multiply(this._zPTransform, mathematics.Matrix.createRotationY(-1, 0));
            this._yPTransform = mathematics.Matrix.Multiply(this._zPTransform, mathematics.Matrix.createRotationX(-1, 0));
            this._yMTransform = mathematics.Matrix.Multiply(this._zPTransform, mathematics.Matrix.createRotationX(1, 0));
        }
        Skybox.prototype.dispose = function () {
            if (this._vertexBuffer) {
                this._vertexBuffer.dispose();
            }
            if (this._indices) {
                this._indices.dispose();
            }
            this._vertexBuffer = null;
            this._indices = null;
        };

        Skybox.prototype.renderPlane = function (camera, texture, model) {
            Effects.Skybox.Texture.setValue(texture);
            Effects.Skybox.ProjectionMatrix.setValue(camera.getProjectionTransform());
            Effects.Skybox.ViewMatrix.setValue(camera.getViewTransform());
            Effects.Skybox.ModelMatrix.setValue(model);
            Effects.Skybox.Color.setValue(ColorTheme.getDefault().SkyBoxColor);
            Effects.Skybox.Eye.setValue(camera.getPosition());
            Effects.Skybox.Light.setValue(mathematics.Vector.create(-200, 0, 0));
            this._renderJoint.render(this._indices);
        };

        Skybox.prototype.render = function (camera) {
            this.renderPlane(camera, Textures.SkyboxYM, this._zPTransform);
            this.renderPlane(camera, Textures.SkyboxYP, this._zMTransform);
            this.renderPlane(camera, Textures.SkyboxXM, this._xPTransform);
            this.renderPlane(camera, Textures.SkyboxXP, this._xMTransform);
            this.renderPlane(camera, Textures.SkyboxZP, this._yPTransform);
            this.renderPlane(camera, Textures.SkyboxZM, this._yMTransform);
        };
        return Skybox;
    })();
    entities.Skybox = Skybox;

    var ParticlesEmitterVertex = (function () {
        function ParticlesEmitterVertex() {
        }
        ParticlesEmitterVertex.createSignatures = function () {
            return new rendering.VertexSignatures([
                rendering.DeclarationsParticles.MidPoint,
                rendering.Declarations.Position,
                rendering.Declarations.TexturePosition,
                rendering.DeclarationsParticles.StartVelocity,
                rendering.DeclarationsParticles.Acceleration,
                rendering.Declarations.Color,
                rendering.DeclarationsParticles.Scale,
                rendering.DeclarationsParticles.LifeTime,
                rendering.DeclarationsParticles.RebornTime,
                rendering.DeclarationsParticles.InitPhase
            ]);
        };

        ParticlesEmitterVertex.prototype.saveToBuffer = function (i, buffer) {
            buffer[i + 0] = this.MidPoint.getX();
            buffer[i + 1] = this.MidPoint.getY();
            buffer[i + 2] = this.MidPoint.getZ();
            buffer[i + 3] = this.Position.getX();
            buffer[i + 4] = this.Position.getY();
            buffer[i + 5] = this.Position.getZ();
            buffer[i + 6] = this.TexturePosition.getX();
            buffer[i + 7] = this.TexturePosition.getY();
            buffer[i + 8] = this.StartVelocity.getX();
            buffer[i + 9] = this.StartVelocity.getY();
            buffer[i + 10] = this.StartVelocity.getZ();
            buffer[i + 11] = this.Acceleration.getX();
            buffer[i + 12] = this.Acceleration.getY();
            buffer[i + 13] = this.Acceleration.getZ();
            buffer[i + 14] = this.Color.getR();
            buffer[i + 15] = this.Color.getG();
            buffer[i + 16] = this.Color.getB();
            buffer[i + 17] = this.Color.getA();
            buffer[i + 18] = this.Scale;
            buffer[i + 19] = this.LifeTime;
            buffer[i + 20] = this.RebornTime;
            buffer[i + 21] = this.InitPhase;
        };
        return ParticlesEmitterVertex;
    })();
    entities.ParticlesEmitterVertex = ParticlesEmitterVertex;

    var Particle = (function () {
        function Particle() {
            this.Position = new mathematics.Vector();
            this.StartVelocity = new mathematics.Vector();
            this.Acceleration = new mathematics.Vector();
            this.Color = new mathematics.Color();
            this.Scale = 0.0;
            this.LifeTime = 0.0;
            this.RebornTime = 0.0;
            this.InitPhase = 0.0;
        }
        Particle.getGlobalPeriod = function () {
            return 64;
        };

        Particle.prototype.makePeriodic = function () {
            var period = this.LifeTime + this.RebornTime;
            var periodDivision = Math.floor(Particle.getGlobalPeriod() / period);
            var newPeriod = Particle.getGlobalPeriod() / periodDivision;
            var scale = newPeriod / period;
            this.LifeTime = this.LifeTime * scale;
            this.RebornTime = this.RebornTime * scale;
        };

        Particle.prototype.CreateVertex = function (offset, tOffset) {
            var v = new ParticlesEmitterVertex();
            v.MidPoint = this.Position;
            v.Position = offset;
            v.TexturePosition = tOffset;
            v.StartVelocity = this.StartVelocity;
            v.Acceleration = this.Acceleration;
            v.Color = this.Color;
            v.Scale = this.Scale;
            v.LifeTime = this.LifeTime;
            v.RebornTime = this.RebornTime;
            v.InitPhase = this.InitPhase;
            return v;
        };

        Particle.prototype.CreateVertices = function (source) {
            var lt = mathematics.Vector.create(-1, 1, 0);
            var lb = mathematics.Vector.create(-1, -1, 0);
            var rt = mathematics.Vector.create(1, 1, 0);
            var rb = mathematics.Vector.create(1, -1, 0);
            var tlt = mathematics.Vector.create(0, 1, 0);
            var tlb = mathematics.Vector.create(0, 0, 0);
            var trt = mathematics.Vector.create(1, 1, 0);
            var trb = mathematics.Vector.create(1, 0, 0);
            source.add(this.CreateVertex(lt, tlt));
            source.add(this.CreateVertex(rt, trt));
            source.add(this.CreateVertex(rb, trb));
            source.add(this.CreateVertex(lb, tlb));
        };
        return Particle;
    })();
    entities.Particle = Particle;

    var Emitter = (function () {
        function Emitter() {
            this.Position = mathematics.VectorValueRange.createVector(mathematics.Vector.create(-25, -20, -20), mathematics.Vector.create(15, 20, 20));
            this.Velocity = mathematics.VectorValueRange.createVector(mathematics.Vector.create(2, -2, -2), mathematics.Vector.create(2, 2, 2));
            this.Acceleration = mathematics.VectorValueRange.createVector(mathematics.Vector.create(0.0, 0.0, 0.0), mathematics.Vector.create(0.0, 0.0, 0.0));
            this.Color = mathematics.VectorValueRange.createNumber(0.65, 1.0);
            this.Count = 200;
            this.Scale = new mathematics.FloatValueRange(0.05, 0.15);
            this.LifeTime = new mathematics.FloatValueRange(0.5, 1.5);
            this.RebornTime = new mathematics.FloatValueRange(0.0, 0.1);
            this.InitPhase = new mathematics.FloatValueRange(0.0, this.LifeTime.Max - this.LifeTime.Min);
        }
        Emitter.prototype.InitFires = function () {
            this.Position = mathematics.VectorValueRange.createVector(mathematics.Vector.create(-25, -20, -20), mathematics.Vector.create(15, 20, 20));
            this.Velocity = mathematics.VectorValueRange.createVector(mathematics.Vector.create(5, -5, -5), mathematics.Vector.create(5, 5, 5));
            this.Acceleration = mathematics.VectorValueRange.createVector(mathematics.Vector.create(1.0, 0.0, 0.0), mathematics.Vector.create(1.0, 0.0, 0.0));
            this.Color = mathematics.VectorValueRange.createNumber(0.65, 1.0);
            this.Count = 200;
            this.Scale = new mathematics.FloatValueRange(0.05, 0.15);
            this.LifeTime = new mathematics.FloatValueRange(0.5, 1.5);
            this.RebornTime = new mathematics.FloatValueRange(0.0, 0.1);
            this.InitPhase = new mathematics.FloatValueRange(0.0, this.LifeTime.Max - this.LifeTime.Min);
        };

        Emitter.prototype.InitClouds = function () {
            //this.Position = mathematics.VectorValueRange.createVector(mathematics.Vector.create(0.0, 0, 0), mathematics.Vector.create(0, 0, 0));
            this.Position = mathematics.VectorValueRange.createVector(mathematics.Vector.create(-20.0, -20, -20), mathematics.Vector.create(20, 20, 20));
            this.Velocity = mathematics.VectorValueRange.createVector(mathematics.Vector.create(2, -2, -2), mathematics.Vector.create(2, 2, 2));
            this.Acceleration = mathematics.VectorValueRange.createVector(mathematics.Vector.create(-0.1, 0.0, 0.0), mathematics.Vector.create(0.1, 0.0, 0.0));
            this.Color = mathematics.VectorValueRange.createNumber(0.65, 1.0);
            this.Count = 10;
            this.Scale = new mathematics.FloatValueRange(10.0, 30.0);
            this.LifeTime = new mathematics.FloatValueRange(8.0, 20.0);
            this.RebornTime = new mathematics.FloatValueRange(0.0, 0.0);
            this.InitPhase = new mathematics.FloatValueRange(0.0, this.LifeTime.Max - this.LifeTime.Min);
        };

        Emitter.prototype.InitSteam = function () {
            this.Position = mathematics.VectorValueRange.createVector(mathematics.Vector.create(0.1, 0.4, 1.24), mathematics.Vector.create(-0.9, 0.8, 1.26));
            this.Velocity = mathematics.VectorValueRange.createVector(mathematics.Vector.create(0.0, 0.07, 0.0), mathematics.Vector.create(0.0, 0.14, 0.0));
            this.Acceleration = mathematics.VectorValueRange.createVector(mathematics.Vector.create(0.0, 0.0, 0.0), mathematics.Vector.create(0.0, 0.0, 0.0));
            this.Color = mathematics.VectorValueRange.createNumber(0.15, 0.35);
            this.Count = 20;
            this.Scale = new mathematics.FloatValueRange(0.3, 0.4);
            this.LifeTime = new mathematics.FloatValueRange(4.0, 7.0);
            this.RebornTime = new mathematics.FloatValueRange(0.0, 0.0);
            this.InitPhase = new mathematics.FloatValueRange(0.0, this.LifeTime.Max - this.LifeTime.Min);
        };

        Emitter.prototype.CreateVertices = function (source) {
            for (var i = 0; i < this.Count; i++) {
                var particle = this.Gen();
                particle.CreateVertices(source);
            }
        };

        Emitter.prototype.Gen = function () {
            var particle = new Particle();
            particle.Position = this.Position.Gen();
            particle.StartVelocity = this.Velocity.Gen();
            particle.Acceleration = this.Acceleration.Gen();
            var color = this.Color.Gen();
            particle.Color = mathematics.Color.fromRGBA(color.getX(), color.getY(), color.getZ(), 1.0);
            particle.Scale = this.Scale.Gen();
            particle.LifeTime = this.LifeTime.Gen();
            particle.RebornTime = this.RebornTime.Gen();
            particle.InitPhase = this.InitPhase.Gen();
            particle.makePeriodic();
            return particle;
        };
        return Emitter;
    })();
    entities.Emitter = Emitter;

    var EmitterBatch = (function () {
        function EmitterBatch(texture, emitters, color, timeStep) {
            this._colorMap = texture;
            this._emitters = emitters;
            this._color = color;
            this._timeStep = timeStep;
            this._time = 0;
            this.create();
        }
        EmitterBatch.prototype.getFadingAlphaPercent = function () {
            return 0.25;
        };
        EmitterBatch.prototype.getFadingScalePercent = function () {
            return 0.25;
        };

        EmitterBatch.prototype.dispose = function () {
            if (this._vertexBuffer) {
                this._vertexBuffer.dispose();
            }
            if (this._indexBuffer) {
                this._indexBuffer.dispose();
            }
            this._indexBuffer = null;
            this._vertexBuffer = null;
        };

        EmitterBatch.prototype.render = function (camera) {
            Effects.PatriclesEmitter.Time.setValue(this._time);
            Effects.PatriclesEmitter.AlphaFading.setValue(this.getFadingAlphaPercent());
            Effects.PatriclesEmitter.ScaleFading.setValue(this.getFadingScalePercent());
            Effects.PatriclesEmitter.ProjectionMatrix.setValue(camera.getProjectionTransform());
            Effects.PatriclesEmitter.ViewMatrix.setValue(camera.getViewTransform());
            Effects.PatriclesEmitter.ColorMap.setValue(this._colorMap);
            Effects.PatriclesEmitter.Color.setValue(this._color);
            Effects.PatriclesEmitter.TimeStep.setValue(this._timeStep);
            this._renderJoint.render(this._indexBuffer);
        };

        EmitterBatch.prototype.renderClouds = function (camera, depthMap) {
            Effects.Clouds.ProjectionMatrix.setValue(camera.getProjectionTransform());
            Effects.Clouds.ViewMatrix.setValue(camera.getViewTransform());
            Effects.Clouds.ColorMap.setValue(this._colorMap);
            Effects.Clouds.Color.setValue(this._color);
            Effects.Clouds.DepthMap.setValue(depthMap);
            this._cloudsRenderJoint.render(this._indexBuffer);
        };

        EmitterBatch.prototype.update = function (timeDelta) {
            this._time += timeDelta;
            this._time %= Particle.getGlobalPeriod();
        };

        EmitterBatch.prototype.create = function () {
            var signatires = ParticlesEmitterVertex.createSignatures();
            var verticesList = new collections.LinkedList();
            for (var i = 0; i < this._emitters.length; i++)
                this._emitters[i].CreateVertices(verticesList);

            var buffer = new Float32Array(verticesList.size() * signatires.getSize());

            var i = 0;
            for (var node = verticesList.firstNode; node != null; node = node.next) {
                node.element.saveToBuffer(i, buffer);
                i += signatires.getSize();
            }

            this._vertexBuffer = new rendering.VertexBuffer(signatires, buffer);
            var pc = verticesList.size() / 4;
            var indices = [];
            indices.length = pc;
            for (var i = 0; i < pc; i++) {
                indices[i * 6 + 0] = i * 4 + 0;
                indices[i * 6 + 1] = i * 4 + 1;
                indices[i * 6 + 2] = i * 4 + 2;
                indices[i * 6 + 3] = i * 4 + 0;
                indices[i * 6 + 4] = i * 4 + 2;
                indices[i * 6 + 5] = i * 4 + 3;
            }
            this._indexBuffer = new rendering.IndexBuffer(new Uint16Array(indices));
            this._renderJoint = new rendering.RenderJoint(Effects.PatriclesEmitter, this._vertexBuffer);
            this._cloudsRenderJoint = new rendering.RenderJoint(Effects.Clouds, this._vertexBuffer);
        };
        return EmitterBatch;
    })();
    entities.EmitterBatch = EmitterBatch;

    var Nebula = (function () {
        function Nebula(position, size, inverse) {
            this.Position = position;
            this.Size = size;
            this.Inverse = inverse;
        }
        return Nebula;
    })();
    entities.Nebula = Nebula;

    var NebulaBatch = (function () {
        function NebulaBatch(nebula, texture1, texture2) {
            this._nebula = nebula;
            this._texture1 = texture1;
            this._texture2 = texture2;
            this.Angle1 = 0;
            this.Angle2 = 0;
            this.Scale1 = 0;
            this.Scale2 = 0;
            this.create();
        }
        NebulaBatch.prototype.dispose = function () {
            if (this._vertexBuffer) {
                this._vertexBuffer.dispose();
            }
            if (this._indexBuffer) {
                this._indexBuffer.dispose();
            }
            this._indexBuffer = null;
            this._vertexBuffer = null;
        };

        NebulaBatch.prototype.create = function () {
            var signatures = new rendering.VertexSignatures([
                rendering.Declarations.Position,
                rendering.Declarations.TexturePosition
            ]);

            var size = this._nebula.length * 5 * 4;
            var vertices = [];
            vertices.length = size;
            for (var j = 0; j < this._nebula.length; j++) {
                var o = j * 4;

                vertices[(o + 0) * 5 + 0] = this._nebula[j].Position.getX();
                vertices[(o + 0) * 5 + 1] = this._nebula[j].Position.getY() - this._nebula[j].Size;
                vertices[(o + 0) * 5 + 2] = this._nebula[j].Position.getZ() - this._nebula[j].Size;
                vertices[(o + 0) * 5 + 3] = 0;
                vertices[(o + 0) * 5 + 4] = 0;

                vertices[(o + 1) * 5 + 0] = this._nebula[j].Position.getX();
                vertices[(o + 1) * 5 + 1] = this._nebula[j].Position.getY() - this._nebula[j].Size;
                vertices[(o + 1) * 5 + 2] = this._nebula[j].Position.getZ() + this._nebula[j].Size;
                vertices[(o + 1) * 5 + 3] = 0;
                vertices[(o + 1) * 5 + 4] = 1;

                vertices[(o + 2) * 5 + 0] = this._nebula[j].Position.getX();
                vertices[(o + 2) * 5 + 1] = this._nebula[j].Position.getY() + this._nebula[j].Size;
                vertices[(o + 2) * 5 + 2] = this._nebula[j].Position.getZ() + this._nebula[j].Size;
                vertices[(o + 2) * 5 + 3] = 1;
                vertices[(o + 2) * 5 + 4] = 1;

                vertices[(o + 3) * 5 + 0] = this._nebula[j].Position.getX();
                vertices[(o + 3) * 5 + 1] = this._nebula[j].Position.getY() + this._nebula[j].Size;
                vertices[(o + 3) * 5 + 2] = this._nebula[j].Position.getZ() - this._nebula[j].Size;
                vertices[(o + 3) * 5 + 3] = 1;
                vertices[(o + 3) * 5 + 4] = 0;
            }

            this._vertexBuffer = new rendering.VertexBuffer(signatures, new Float32Array(vertices));
            var indices = [];
            indices.length = this._nebula.length * 6;
            for (var j = 0; j < this._nebula.length; j++) {
                var o = j * 6;
                var k = j * 4;
                if (!this._nebula[j].Inverse) {
                    indices[o + 0] = k + 0;
                    indices[o + 1] = k + 1;
                    indices[o + 2] = k + 2;
                    indices[o + 3] = k + 0;
                    indices[o + 4] = k + 2;
                    indices[o + 5] = k + 3;
                } else {
                    indices[o + 0] = k + 0;
                    indices[o + 1] = k + 2;
                    indices[o + 2] = k + 1;
                    indices[o + 3] = k + 0;
                    indices[o + 4] = k + 3;
                    indices[o + 5] = k + 2;
                }
            }

            this._indexBuffer = new rendering.IndexBuffer(new Uint16Array(indices));
            this._renderJoint = new rendering.RenderJoint(Effects.Nebula, this._vertexBuffer);
        };

        NebulaBatch.prototype.render = function (camera) {
            Effects.Nebula.ViewMatrix.setValue(camera.getViewTransform());
            Effects.Nebula.ProjectionMatrix.setValue(camera.getProjectionTransform());
            Effects.Nebula.ColorMap1.setValue(this._texture1);
            Effects.Nebula.ColorMap2.setValue(this._texture2);
            Effects.Nebula.Color1.setValue(ColorTheme.getDefault().NebulaBack);
            Effects.Nebula.Color2.setValue(ColorTheme.getDefault().NebulaFront);
            Effects.Nebula.Cos1.setValue(Math.cos(this.Angle1));
            Effects.Nebula.Cos2.setValue(Math.cos(this.Angle2));
            Effects.Nebula.Sin1.setValue(Math.sin(this.Angle1));
            Effects.Nebula.Sin2.setValue(Math.sin(this.Angle2));
            this._renderJoint.render(this._indexBuffer);
        };

        NebulaBatch.prototype.update = function (timeDelta) {
            this.Angle1 -= 0.2 * timeDelta;
            this.Angle2 -= 0.05 * timeDelta;
        };
        return NebulaBatch;
    })();
    entities.NebulaBatch = NebulaBatch;

    var AsteroidsBatch = (function () {
        function AsteroidsBatch(vertexBuffer, indexBuffer, transforms, specularMap, diffuseMap, normalMap, glowMap, cubeMap) {
            this._glowLevel = 0.0;
            this._vertexBuffer = vertexBuffer;
            this._indices = indexBuffer;
            this._matrices = transforms;
            this._transform = new Array(transforms.length);
            this._normalMatrices = new Array(transforms.length);
            this._specularMap = specularMap;
            this._diffuseMap = diffuseMap;
            this._normalMap = normalMap;
            this._glowMap = glowMap;
            this._cubeMap = cubeMap;
            for (var j = 0; j < this._transform.length; j++) {
                var r = Math.random() * 2;
                if (r == 0)
                    this._transform[j] = new MeshTransform();
                else if (r == 1)
                    this._transform[j] = new MeshTransformX();
                else
                    this._transform[j] = new MeshTransformY();

                this._normalMatrices[j] = transforms[j].toMatrix3();
                this._transform[j].Origin = transforms[j];
                this._transform[j]._rotationVelocity = Math.random() - 0.5;
            }

            this._renderSolidJoint = new rendering.RenderJoint(Effects.Solid, this._vertexBuffer);
            this._renderDiffuseJoint = new rendering.RenderJoint(Effects.Diffuse, this._vertexBuffer);
            this._renderSpecularBumpJoint = new rendering.RenderJoint(Effects.SpecularBump, this._vertexBuffer);
            this._renderDepthMapJoint = new rendering.RenderJoint(Effects.DepthMap, this._vertexBuffer);
        }
        AsteroidsBatch.prototype.update = function (timeDelta) {
            for (var j = 0; j < this._transform.length; j++) {
                //this._transform[j].update(0.0);
                this._transform[j].update(timeDelta);
                this._matrices[j] = this._transform[j].getMatrix();
                this._normalMatrices[j] = this._matrices[j].toMatrix3();
            }
            this._glowLevel += timeDelta;
            while (this._glowLevel > 1.0)
                this._glowLevel -= 2.0;
        };
        AsteroidsBatch.prototype.renderSolid = function (camera) {
            Effects.Solid.ProjectionMatrix.setValue(camera.getTransform());
            Effects.Solid.ModelMatrices.setValue(this._matrices);
            this._renderSolidJoint.render(this._indices);
        };
        AsteroidsBatch.prototype.renderDiffuse = function (camera) {
            Effects.Diffuse.ProjectionMatrix.setValue(camera.getTransform());
            Effects.Diffuse.ModelMatrices.setValue(this._matrices);
            Effects.Diffuse.NormalMatrices.setValue(this._normalMatrices);
            Effects.Diffuse.Light.setValue(mathematics.Vector.create(-200, 0, 0));
            Effects.Diffuse.DiffuseMap.setValue(this._diffuseMap);
            this._renderDiffuseJoint.render(this._indices);
        };
        AsteroidsBatch.prototype.renderSpecularBump = function (camera) {
            Effects.SpecularBump.ProjectionMatrix.setValue(camera.getProjectionTransform());
            Effects.SpecularBump.ViewMatrix.setValue(camera.getViewTransform());
            Effects.SpecularBump.NormalMatrix.setValue(camera.getNormal());
            Effects.SpecularBump.ModelMatrices.setValue(this._matrices);
            Effects.SpecularBump.NormalMatrices.setValue(this._normalMatrices);
            Effects.SpecularBump.Light.setValue(mathematics.Vector.create(-200, 0, 0));
            Effects.SpecularBump.Eye.setValue(camera.getPosition());

            //Effects.SpecularBump.EyePosition.setValue(mathematics.Vector.create(0, 0, 0));
            Effects.SpecularBump.SpecularMap.setValue(this._specularMap);
            Effects.SpecularBump.DiffuseMap.setValue(this._diffuseMap);
            Effects.SpecularBump.NormalMap.setValue(this._normalMap);
            Effects.SpecularBump.GlowMap.setValue(this._glowMap);

            //Effects.SpecularBump.EnvironmentCubeMap.setValue(this._cubeMap);
            Effects.SpecularBump.GlowLevel.setValue(0.5 + Math.abs(this._glowLevel) * 3.5);
            Effects.SpecularBump.SpecularLight.setValue(mathematics.Color.fromRGBA(1.0, 1.0, 1.0, 1));
            Effects.SpecularBump.DiffuseLight.setValue(mathematics.Color.fromRGBA(1, 1, 1, 1));
            Effects.SpecularBump.AmbientLight.setValue(mathematics.Color.fromRGBA(0.0, 0.0, 0.0, 1));
            Effects.SpecularBump.GlowColor.setValue(mathematics.Color.fromRGBA(1, 0.5, 0.25, 1));

            this._renderSpecularBumpJoint.render(this._indices);
        };
        AsteroidsBatch.prototype.renderDepthMap = function (camera) {
            Effects.DepthMap.ProjectionMatrix.setValue(camera.getProjectionTransform());
            Effects.DepthMap.ViewMatrix.setValue(camera.getViewTransform());
            Effects.DepthMap.ZNear.setValue(camera.getZNear());
            Effects.DepthMap.ZFar.setValue(camera.getZFar());
            Effects.DepthMap.ModelMatrices.setValue(this._matrices);

            this._renderDepthMapJoint.render(this._indices);
        };
        return AsteroidsBatch;
    })();
    entities.AsteroidsBatch = AsteroidsBatch;

    var MeshTransform = (function () {
        function MeshTransform() {
            this._rotationVelocity = 0.2;
            this._rotation = 0.0;
            this.Origin = new mathematics.Matrix();
        }
        MeshTransform.prototype.update = function (delta) {
            this._rotation += delta * this._rotationVelocity;
            this._sine = Math.sin(this._rotation);
            this._cosine = Math.cos(this._rotation);
        };
        MeshTransform.prototype.getMatrix = function () {
            return mathematics.Matrix.Multiply(mathematics.Matrix.createRotationZ(this._sine, this._cosine), this.Origin);
        };
        return MeshTransform;
    })();
    entities.MeshTransform = MeshTransform;

    var MeshTransformX = (function (_super) {
        __extends(MeshTransformX, _super);
        function MeshTransformX() {
            _super.apply(this, arguments);
        }
        MeshTransformX.prototype.getMatrix = function () {
            return mathematics.Matrix.Multiply(this.Origin, mathematics.Matrix.createRotationX(this._sine, this._cosine));
        };
        return MeshTransformX;
    })(MeshTransform);
    entities.MeshTransformX = MeshTransformX;

    var MeshTransformY = (function (_super) {
        __extends(MeshTransformY, _super);
        function MeshTransformY() {
            _super.apply(this, arguments);
        }
        MeshTransformY.prototype.getMatrix = function () {
            return mathematics.Matrix.Multiply(mathematics.Matrix.createRotationY(this._sine, this._cosine), this.Origin);
        };
        return MeshTransformY;
    })(MeshTransform);

    var VolumeFogBatch = (function () {
        function VolumeFogBatch(vertexBuffer, indexBuffer) {
            this._signature = new rendering.VertexSignatures([rendering.Declarations.Position, rendering.Declarations.Color]);
            this._vertexBuffer = vertexBuffer;
            this._indices = indexBuffer;
            this._renderJoint = new rendering.RenderJoint(Effects.VolumeFog, this._vertexBuffer);
            this._renderDepthMapJoint = new rendering.RenderJoint(Effects.VolumeFogDepthMap, this._vertexBuffer);
        }
        VolumeFogBatch.prototype.render = function (camera, depthMap) {
            Effects.VolumeFog.ProjectionMatrix.setValue(camera.getTransform());
            Effects.VolumeFog.DepthMap.setValue(depthMap);
            this._renderJoint.render(this._indices);
        };
        VolumeFogBatch.prototype.renderToDepthMap = function (camera, depthMap) {
            Effects.VolumeFogDepthMap.ProjectionMatrix.setValue(camera.getProjectionTransform());
            Effects.VolumeFogDepthMap.ViewMatrix.setValue(camera.getViewTransform());
            Effects.VolumeFogDepthMap.ModelMatrix.setValue(mathematics.Matrix.createTranslate(0.0, 0.0, 0.0));
            Effects.VolumeFogDepthMap.ZNear.setValue(camera.getZNear());
            Effects.VolumeFogDepthMap.ZFar.setValue(camera.getZFar());
            Effects.VolumeFogDepthMap.DepthMap.setValue(depthMap);
            this._renderDepthMapJoint.render(this._indices);
        };
        return VolumeFogBatch;
    })();
    entities.VolumeFogBatch = VolumeFogBatch;

    var DepthMapPostProcessBatch = (function () {
        function DepthMapPostProcessBatch(effect) {
            this._signature = new rendering.VertexSignatures([rendering.Declarations.Position, rendering.Declarations.TexturePosition]);
            this._vertexBuffer = new rendering.VertexBuffer(this._signature, new Float32Array([
                -1.0, -1.0, 0, 0, 0,
                +1.0, -1.0, 0, 1, 0,
                +1.0, +1.0, 0, 1, 1,
                -1.0, +1.0, 0, 0, 1
            ]));

            this._indices = new rendering.IndexBuffer(new Uint16Array([
                0, 1, 2,
                2, 3, 0
            ]));
            this._effect = effect;
            this._renderJoint = new rendering.RenderJoint(effect, this._vertexBuffer);
        }
        DepthMapPostProcessBatch.prototype.render = function (texture) {
            this._effect.Texture.setValue(texture);
            this._renderJoint.render(this._indices);
        };
        return DepthMapPostProcessBatch;
    })();
    entities.DepthMapPostProcessBatch = DepthMapPostProcessBatch;

    var VolumeFogPostProcessBatch = (function () {
        function VolumeFogPostProcessBatch(effect) {
            this._signature = new rendering.VertexSignatures([rendering.Declarations.Position, rendering.Declarations.TexturePosition]);
            this._vertexBuffer = new rendering.VertexBuffer(this._signature, new Float32Array([
                -1.0, -1.0, 0, 0, 0,
                +1.0, -1.0, 0, 1, 0,
                +1.0, +1.0, 0, 1, 1,
                -1.0, +1.0, 0, 0, 1
            ]));

            this._indices = new rendering.IndexBuffer(new Uint16Array([
                0, 1, 2,
                2, 3, 0
            ]));
            this._effect = effect;
            this._renderJoint = new rendering.RenderJoint(effect, this._vertexBuffer);
        }
        VolumeFogPostProcessBatch.prototype.render = function (texture, texture1) {
            this._effect.Texture.setValue(texture);
            this._effect.Texture1.setValue(texture1);
            this._renderJoint.render(this._indices);
        };
        return VolumeFogPostProcessBatch;
    })();
    entities.VolumeFogPostProcessBatch = VolumeFogPostProcessBatch;

    var PlanarFogBatch = (function () {
        function PlanarFogBatch() {
            this._signature = new rendering.VertexSignatures([rendering.Declarations.Position, rendering.Declarations.TexturePosition]);
            this._vertexBuffer = new rendering.VertexBuffer(this._signature, new Float32Array([
                -1.0, -1.0, 0, 0, 0,
                +1.0, -1.0, 0, 1, 0,
                +1.0, +1.0, 0, 1, 1,
                -1.0, +1.0, 0, 0, 1
            ]));

            this._indices = new rendering.IndexBuffer(new Uint16Array([
                0, 1, 2,
                2, 3, 0
            ]));
            this._renderJoint = new rendering.RenderJoint(Effects.PlanarFog, this._vertexBuffer);
        }
        PlanarFogBatch.prototype.render = function (texture, depthMap) {
            Effects.PlanarFog.Texture.setValue(texture);
            Effects.PlanarFog.DepthMap.setValue(depthMap);
            this._renderJoint.render(this._indices);
        };
        return PlanarFogBatch;
    })();
    entities.PlanarFogBatch = PlanarFogBatch;

    var TouchController = (function () {
        function TouchController(camera) {
            this._camera = camera;
            this._rotationVelocityK = 0.75;
            this._maxCount = 500;
            this._maxTime = 100;
            this._moveHistory = new collections.LinkedList();
            this._moveHistoryCount = 0;
            this._prevPosition = new mathematics.Vector();
        }
        TouchController.prototype.updateQueue = function (pointerPosition) {
            var currentTime = system.environment.getTickCount();
            this._moveHistory.add(new PointerData(pointerPosition, currentTime));
            this._moveHistoryCount++;

            while ((currentTime - this._moveHistory.first().Time) > this._maxTime) {
                this._moveHistory.removeElementAtIndex(0);
                this._moveHistoryCount--;
                if (this._moveHistory.first() == null)
                    break;
            }

            while (this._moveHistoryCount > this._maxCount) {
                this._moveHistory.removeElementAtIndex(0);
                this._moveHistoryCount--;
            }
        };

        TouchController.prototype.endMove = function (pointerPosition) {
            this.updateQueue(pointerPosition);

            var prevPointerData = null;
            var velocity = new mathematics.Vector();
            var minTime = this._moveHistory.first().Time;
            var maxTime = this._moveHistory.first().Time;
            for (var node = this._moveHistory.firstNode; node != null; node = node.next) {
                var pointerData = node.element;
                if (prevPointerData != null) {
                    velocity = mathematics.Vector.add(velocity, mathematics.Vector.sub(pointerData.Position, prevPointerData.Position));
                }

                if (minTime > pointerData.Time)
                    minTime = pointerData.Time;
                if (maxTime < pointerData.Time)
                    maxTime = pointerData.Time;
                prevPointerData = pointerData;
            }

            if (maxTime > 0) {
                var timeDelta = (maxTime - minTime) / 1000.0;
                if (!mathematics.Number.isEmpty(timeDelta))
                    velocity = mathematics.Vector.div(velocity, timeDelta);
            }

            if (velocity.isEmpty()) {
                this._camera.RotationVelocity.setValue(0);
            } else {
                this._camera.RotationVelocity.setAxis(this._camera.ExtraRotation.getMatrix().transform(mathematics.Vector.create(-velocity.getY(), -velocity.getX(), 0.0))).setValue(this.pixelsToAngle(velocity.getLength()) * this._rotationVelocityK);
            }

            this._moveHistory.clear();
            this._moveHistoryCount = 0;
            this._prevPosition = null;
        };

        TouchController.prototype.pixelsToAngle = function (pixels) {
            return pixels * 0.05 * this._camera.getFov() / this._camera.getHeight();
        };

        TouchController.prototype.moveSlow = function (pointerPosition) {
            if (!mathematics.Number.isEmpty(this._camera.RotationVelocity.getValue())) {
                this._prevSlowPosition = null;
                return;
            }
            if (this._prevSlowPosition != null) {
                var axis = mathematics.Vector.sub(pointerPosition, this._prevSlowPosition);
                var l = axis.getLength();
                if (!mathematics.Number.isEmpty(l)) {
                    var a = this.pixelsToAngle(l) * 0.5;
                    this._camera.ExtraRotation.rotate(this._camera.ExtraRotation.getMatrix().transform(mathematics.Vector.create(-axis.getY(), -axis.getX(), 0.0)), a);
                }
            }
            this._prevSlowPosition = pointerPosition;
        };

        TouchController.prototype.move = function (pointerPosition) {
            this.updateQueue(pointerPosition);
            if (this._prevPosition != null) {
                var axis = mathematics.Vector.sub(pointerPosition, this._prevPosition);
                var l = axis.getLength();
                if (!mathematics.Number.isEmpty(l)) {
                    this._camera.RotationVelocity.setValue(0);
                    var a = this.pixelsToAngle(l) * 10.0;
                    this._camera.Rotation.rotate(this._camera.ExtraRotation.getMatrix().transform(mathematics.Vector.create(-axis.getY(), -axis.getX(), 0.0)), a);
                }
            }
            this._prevPosition = pointerPosition;
        };

        TouchController.prototype.down = function (pointerPosition) {
            this._camera.RotationVelocity.setValue(0);
            this._prevPosition = pointerPosition;
            this._moveHistory.clear();
            this._moveHistoryCount = 0;
        };

        TouchController.prototype.up = function (pointerPosition) {
            this.endMove(pointerPosition);
            this._prevSlowPosition = null;
        };

        TouchController.prototype.cancel = function (pointerPosition) {
            this._moveHistory.clear();
            this._moveHistoryCount = 0;
            this._camera.RotationVelocity.setValue(0);
            this._prevPosition = null;
            this._prevSlowPosition = null;
        };

        TouchController.prototype.leave = function (pointerPosition) {
            this.endMove(pointerPosition);
            this.leaveSlow(pointerPosition);
        };
        TouchController.prototype.leaveSlow = function (pointerPosition) {
            this._prevSlowPosition = null;
        };
        return TouchController;
    })();
    entities.TouchController = TouchController;

    var Scene = (function () {
        function Scene() {
            this._isLoaded = false;
            this._disposeObjects = new collections.LinkedList();
        }
        Scene.prototype.load = function (args) {
            var _this = this;
            this._isLoaded = false;
            var result = new core.AsyncAwaiter();
            args.Loader.Callback = function () {
                _this._isLoaded = true;
                result.compleate();
            };
            this.onLoad(args);
            return result;
        };

        Scene.prototype.addDisposeObject = function (disposeObject) {
            this._disposeObjects.add(disposeObject);
            return disposeObject;
        };

        Scene.prototype.unLoad = function () {
            for (var node = this._disposeObjects.firstNode; node != null; node = node.next) {
                node.element.dispose();
            }
            this._disposeObjects.clear();
        };

        Scene.prototype.update = function (args) {
            if (!this._isLoaded)
                return;
            this.onUpdate(args);
        };
        Scene.prototype.render = function (args) {
            if (!this._isLoaded)
                return;
            this.onRender(args);
        };

        Scene.prototype.onLoad = function (args) {
        };

        Scene.prototype.onUpdate = function (args) {
            if (!this._isLoaded)
                return;
        };

        Scene.prototype.onRender = function (args) {
        };

        Scene.prototype.createTouchController = function () {
            return null;
        };

        Scene.prototype.getSceneTouchController = function () {
            if (this._touch == null)
                this._touch = this.createTouchController();
            return this._touch;
        };

        Scene.prototype.motionHover = function (args) {
            var touch = this.getSceneTouchController();
            if (touch == null)
                return;
            touch.moveSlow(mathematics.Vector.create(args.X, args.Y, 0.0));
        };

        Scene.prototype.motionMove = function (args) {
            var touch = this.getSceneTouchController();
            if (touch == null)
                return;
            touch.move(mathematics.Vector.create(args.X, args.Y, 0.0));
        };

        Scene.prototype.motionDown = function (args) {
            var touch = this.getSceneTouchController();
            if (touch == null)
                return;
            touch.down(mathematics.Vector.create(args.X, args.Y, 0.0));
        };

        Scene.prototype.motionUp = function (args) {
            var touch = this.getSceneTouchController();
            if (touch == null)
                return;
            touch.up(mathematics.Vector.create(args.X, args.Y, 0.0));
        };

        Scene.prototype.motionLeave = function (args) {
            var touch = this.getSceneTouchController();
            if (touch == null)
                return;
            touch.leaveSlow(mathematics.Vector.create(args.X, args.Y, 0.0));
        };
        return Scene;
    })();
    entities.Scene = Scene;

    var PointerData = (function () {
        function PointerData(position, time) {
            this.Position = position;
            this.Time = time;
        }
        return PointerData;
    })();
    entities.PointerData = PointerData;

    var SingleSprite = (function () {
        function SingleSprite(camera, texture, effect) {
            this._rotation = 0.0;
            this._camera = camera;
            this._texture = texture;
            this._effect = effect;
            this._signature = new rendering.VertexSignatures([rendering.Declarations.Position, rendering.Declarations.TexturePosition]);
            this._vertexBuffer = new rendering.VertexBuffer(this._signature, new Float32Array([
                -1.0, -1.0, 0.0, 0.0, 1.0,
                1.0, -1.0, 0.0, 1.0, 1.0,
                1.0, 1.0, 0.0, 1.0, 0.0,
                -1.0, 1.0, 0.0, 0.0, 0.0
            ]));
            this._indices = new rendering.IndexBuffer(new Uint16Array([
                0, 1, 2, 0, 2, 3
            ]));
            this._renderJoint = new rendering.RenderJoint(this._effect, this._vertexBuffer);
            this._color = mathematics.Color.fromRGBA(1.0, 1.0, 1.0, 1.0);
            this._animatedAlpha = new animation.TimeLineAnimatedValue();
            this._rotation = 0.0;
            this._rotationVelocity = 0.0;
        }
        SingleSprite.prototype.update = function (time) {
            this._rotation += time * this._rotationVelocity;
            while (this._rotation > 2.0 * Math.PI)
                this._rotation -= 2.0 * Math.PI;
            while (this._rotation < 2.0 * Math.PI)
                this._rotation += 2.0 * Math.PI;
            this._animatedAlpha.update(time);
        };

        SingleSprite.prototype.render = function () {
            var matRot = mathematics.Matrix.createRotationZ(Math.sin(this._rotation), Math.cos(this._rotation));
            var matTrn = mathematics.Matrix.createTranslate(this._translate.getX(), this._translate.getY(), this._translate.getZ());
            var mat = mathematics.Matrix.Multiply(matRot, matTrn);
            var matScl = mathematics.Matrix.createScale(this._scale.getX(), this._scale.getY(), this._scale.getZ());
            mat = mathematics.Matrix.Multiply(matScl, mat);

            this._effect.Texture.setValue(this._texture);
            this._effect.ProjectionMatrix.setValue(this._camera.getProjectionTransform());
            this._effect.ModelMatrix.setValue(mat);
            if (this._animatedAlpha.isEnable())
                this._color.setA(this._animatedAlpha.Value);
            this._effect.Color.setValue(this._color);
            this._renderJoint.render(this._indices);
        };

        SingleSprite.prototype.AnimatedAlpha = function () {
            return this._animatedAlpha;
        };

        SingleSprite.prototype.setCamera = function (camera) {
            this._camera = camera;
        };
        SingleSprite.prototype.setTexture = function (texture) {
            this._texture = texture;
        };

        SingleSprite.prototype.setRotation = function (rotation) {
            this._rotation = rotation;
        };
        SingleSprite.prototype.setRotationVelocity = function (rotationVelocity) {
            this._rotationVelocity = rotationVelocity;
        };
        SingleSprite.prototype.setTranslate = function (translate) {
            this._translate = translate;
        };
        SingleSprite.prototype.setScale = function (scale) {
            this._scale = scale;
        };
        SingleSprite.prototype.setColor = function (color) {
            this._color = color;
        };
        SingleSprite.prototype.setColorRGBA = function (r, g, b, a) {
            this._color = mathematics.Color.fromRGBA(r, g, b, a);
        };
        return SingleSprite;
    })();
    entities.SingleSprite = SingleSprite;
})(entities || (entities = {}));
//# sourceMappingURL=entities.js.map
