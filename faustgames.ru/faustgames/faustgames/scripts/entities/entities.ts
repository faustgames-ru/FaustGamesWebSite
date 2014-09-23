/// <reference path="../framework/core.ts"/>
/// <reference path="../framework/math.ts"/>
/// <reference path="../framework/rendering.ts"/>
/// <reference path="../rendering/effects.ts"/>

module entities {
    export class ColorTheme {
        static _default: ColorTheme;

        static getDefault(): ColorTheme {
            if (!ColorTheme._default)
                ColorTheme._default = new ColorTheme();
            return ColorTheme._default;
        }

        constructor() {
            this.SkyBoxColor = mathematics.Color.fromRGBA(1.0, 1.0, 1.0, 1);
            this.AdditiveParticles = mathematics.Color.fromRGBA(1, 0.75, 0.5, 1);
            this.Particles = mathematics.Color.fromRGBA(0.25, 0.2, 0.15, 1);
            this.Clouds = mathematics.Color.fromRGBA(1.0, 1.0, 1.0, 1.0);
            this.NebulaBack = mathematics.Color.fromRGBA(1.0, 1.0, 1.0, 1);
            this.NebulaFront = mathematics.Color.fromRGBA(1, 0.75, 0.5, 1);
        }

        Clouds: mathematics.Color;
        Particles: mathematics.Color;
        AdditiveParticles: mathematics.Color;
        SkyBoxColor: mathematics.Color;
        NebulaFront: mathematics.Color;
        NebulaBack: mathematics.Color;
    }

    export class Textures {
        static Nebula1: rendering.Texture;
        static Nebula2: rendering.Texture;
        static Cloud: rendering.Texture;
        static Particle: rendering.Texture;
        static SkyboxXP: rendering.Texture;
        static SkyboxXM: rendering.Texture;
        static SkyboxYP: rendering.Texture;
        static SkyboxYM: rendering.Texture;
        static SkyboxZP: rendering.Texture;
        static SkyboxZM: rendering.Texture;
        static SkyboxCubemap: rendering.TextureCubemap;
        static AsteroidsSpecular: rendering.Texture;
        static AsteroidsDiffuse: rendering.Texture;
        static AsteroidsNormal: rendering.Texture;
        static AsteroidsGlow: rendering.Texture;

        static AsteroidsSpecular1: rendering.Texture;
        static AsteroidsDiffuse1: rendering.Texture;
        static AsteroidsNormal1: rendering.Texture;
        static AsteroidsGlow1: rendering.Texture;

    }

    export class Effects {
        static Skybox: rendering.EffectSkybox;
        static PatriclesEmitter: rendering.EffectParticlesEmitter;
        static Clouds: rendering.EffectClouds;
        static Nebula: rendering.EffectNebula;
        static DepthMap: rendering.EffectDepthMap;
        static VolumeFog: rendering.EffectVolumeFog;
        static PlanarFog: rendering.EffectPlanarFog;
        static DepthMapPostProcess: rendering.EffectDepthMapPostProcess;
        static VolumeFogPostProcess: rendering.EffectVolumeFogPostProcess;
        static VolumeFogDepthMap: rendering.EffectVolumeFogDepthMap;
        static Solid: rendering.EffectSolid;
        static Diffuse: rendering.EffectDiffuse;
        static SpecularBump: rendering.EffectSpecularBump;
    }

    export class Camera implements core.IUpdate {
        _projection: mathematics.Matrix;
        _lensProjection: mathematics.Matrix;
        _skyBoxTransform: mathematics.Matrix;
        _viewTransform: mathematics.Matrix;
        _fullTransform: mathematics.Matrix;
        _normal: mathematics.Matrix3;

        _fov: number;
        _height: number;
        _distance: number;
        _aspect: number;
        _resistanceK: number;
        _near: number;
        _far: number;
        _position: mathematics.Vector = new mathematics.Vector();

        RotationVelocity: mathematics.AngularValue;
        ExtraRotationVelocity: mathematics.AngularValue;

        Rotation: mathematics.Rotation;
        ExtraRotation: mathematics.Rotation;
        Translation: mathematics.Translation;

        getFov(): number {
            return this._fov;
        }

        getHeight(): number {
            return this._height;
        }

        constructor() {
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
        
        setViewport(fov: number, width: number, height: number): void {
            this._fov = fov;
            this._height = height;
            var aspect = width / height;
            this._aspect = aspect;
            if (width > height) {
                this._projection = mathematics.Matrix.createProjectionH(fov, 1.0 / aspect, this._near, this._far);
                this._lensProjection = mathematics.Matrix.createProjectionH(fov, 1.0 / aspect, this._near, this._far);
            }
            else {
                this._projection = mathematics.Matrix.createProjection(fov, aspect, this._near, this._far);
                this._lensProjection = mathematics.Matrix.createProjection(fov, aspect, this._near, this._far);
            }
        }

        apply(): void  {
            this._skyBoxTransform = mathematics.Matrix.Multiply(mathematics.Matrix.Multiply(this.Rotation.getMatrix(), this.ExtraRotation.getMatrix()), this._projection);
            this._viewTransform = mathematics.Matrix.Multiply(mathematics.Matrix.Multiply(this.Rotation.getMatrix(), this.ExtraRotation.getMatrix()), mathematics.Matrix.createTranslate(0, 0, this._distance));
            this._fullTransform = mathematics.Matrix.Multiply(this._viewTransform, this._projection);
            this._position = this._viewTransform.inverse().transform(mathematics.Vector.create(0, 0, 0));
            this._normal = mathematics.Matrix3.create([
                this._fullTransform.getV(0, 0), this._fullTransform.getV(0, 1), this._fullTransform.getV(0, 2),
                this._fullTransform.getV(1, 0), this._fullTransform.getV(1, 1), this._fullTransform.getV(1, 2),
                this._fullTransform.getV(2, 0), this._fullTransform.getV(2, 1), this._fullTransform.getV(2, 2)]);
        }
              
        update(args: core.UpdateArgs): void {
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
            }
            else {
                v += resistanceA * timeDelta;
                if (v > 0)
                    v = 0;
            }

            var resistanceA = this._resistanceK * this.ExtraRotationVelocity.getValue();// * RotationVelocity.getValue();
            if (ev > 0) {
                ev -= resistanceA * timeDelta;
                if (ev < 0)
                    ev = 0;
            }
            else {
                ev += resistanceA * timeDelta;
                if (ev > 0)
                    ev = 0;
            }

            this.RotationVelocity.setValue(v);
            this.ExtraRotationVelocity.setValue(ev);
        }

        getPosition(): mathematics.Vector {
            return this._position;
        }


        getZNear(): number {
            return this._near;
        }

        getZFar(): number {
            return this._far;
        }

        getNormal(): mathematics.Matrix3  {
            return this._normal;
        }
                  
        getViewTransform(): mathematics.Matrix {
            return this._viewTransform;
        }
        getProjectionTransform(): mathematics.Matrix {
            return this._projection;
        }
        getLensProjectionTransform(): mathematics.Matrix {
            return this._lensProjection;
        }
        getTransform(): mathematics.Matrix {
            return this._fullTransform;
        }
        getSkyBoxTransform(): mathematics.Matrix {
            return this._skyBoxTransform;
        }
    }
    
    export class Skybox implements core.IDisposable {
        _vertexBuffer: rendering.VertexBuffer;
        _indices: rendering.IndexBuffer;
        _signature: rendering.VertexSignatures;
        _renderJoint: rendering.RenderJoint;

        _zPTransform: mathematics.Matrix;
        _zMTransform: mathematics.Matrix;
        _xPTransform: mathematics.Matrix;
        _xMTransform: mathematics.Matrix;
        _yPTransform: mathematics.Matrix;
        _yMTransform: mathematics.Matrix;

        constructor() {
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

        dispose() {
            if (this._vertexBuffer) {
                this._vertexBuffer.dispose();
            }
            if (this._indices) {
                this._indices.dispose();
            }
            this._vertexBuffer = null;
            this._indices = null;
        }

        renderPlane(camera: Camera, texture: rendering.Texture, model: mathematics.Matrix): void {
            Effects.Skybox.Texture.setValue(texture);
            Effects.Skybox.ProjectionMatrix.setValue(camera.getProjectionTransform());
            Effects.Skybox.ViewMatrix.setValue(camera.getViewTransform());
            Effects.Skybox.ModelMatrix.setValue(model);
            Effects.Skybox.Color.setValue(ColorTheme.getDefault().SkyBoxColor);
            Effects.Skybox.Eye.setValue(camera.getPosition());
            Effects.Skybox.Light.setValue(mathematics.Vector.create(-200, 0, 0));
            this._renderJoint.render(this._indices);
        }

        render(camera: Camera): void {
            this.renderPlane(camera, Textures.SkyboxYM, this._zPTransform);
            this.renderPlane(camera, Textures.SkyboxYP, this._zMTransform);
            this.renderPlane(camera, Textures.SkyboxXM, this._xPTransform);
            this.renderPlane(camera, Textures.SkyboxXP, this._xMTransform);
            this.renderPlane(camera, Textures.SkyboxZP, this._yPTransform);
            this.renderPlane(camera, Textures.SkyboxZM, this._yMTransform);
        }
    }

    export class ParticlesEmitterVertex {
        MidPoint: mathematics.Vector;
        Position: mathematics.Vector;
        TexturePosition: mathematics.Vector;
        StartVelocity: mathematics.Vector;
        Acceleration: mathematics.Vector;
        Color: mathematics.Color;
        Scale: number;
        LifeTime: number;
        RebornTime: number;
        InitPhase: number;

        static createSignatures(): rendering.VertexSignatures {
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
            ])
        }

        saveToBuffer(i: number, buffer: Float32Array): void {
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
        }
    }

    export class Particle {
        Position: mathematics.Vector;
        StartVelocity: mathematics.Vector;
        Acceleration: mathematics.Vector;
        Color: mathematics.Color;
        Scale: number;
        LifeTime: number;
        RebornTime: number;
        InitPhase: number;

        constructor() {
            this.Position = new mathematics.Vector();
            this.StartVelocity = new mathematics.Vector();
            this.Acceleration = new mathematics.Vector();
            this.Color = new mathematics.Color();
            this.Scale = 0.0;
            this.LifeTime = 0.0;
            this.RebornTime = 0.0;
            this.InitPhase = 0.0;
        }

        static getGlobalPeriod(): number {
            return 64;
        }

        makePeriodic() {
            var period = this.LifeTime + this.RebornTime;
            var periodDivision = Math.floor(Particle.getGlobalPeriod() / period);
            var newPeriod = Particle.getGlobalPeriod() / periodDivision;
            var scale = newPeriod / period;
            this.LifeTime = this.LifeTime * scale;
            this.RebornTime = this.RebornTime * scale;
        }

        CreateVertex(offset: mathematics.Vector, tOffset: mathematics.Vector): ParticlesEmitterVertex {
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
        }

        CreateVertices(source: collections.LinkedList<ParticlesEmitterVertex>) {
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
        }
    }
    
    export class Emitter {
        Position: mathematics.VectorValueRange;
        Velocity: mathematics.VectorValueRange;
        Acceleration: mathematics.VectorValueRange;
        Color: mathematics.VectorValueRange;
        Count: number;
        Scale: mathematics.FloatValueRange;
        LifeTime: mathematics.FloatValueRange;
        RebornTime: mathematics.FloatValueRange;
        InitPhase: mathematics.FloatValueRange;

        constructor() {
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

        InitFires(): void {
            this.Position = mathematics.VectorValueRange.createVector(mathematics.Vector.create(-25, -20, -20), mathematics.Vector.create(15, 20, 20));
            this.Velocity = mathematics.VectorValueRange.createVector(mathematics.Vector.create(5, -5, -5), mathematics.Vector.create(5, 5, 5));
            this.Acceleration = mathematics.VectorValueRange.createVector(mathematics.Vector.create(1.0, 0.0, 0.0), mathematics.Vector.create(1.0, 0.0, 0.0));
            this.Color = mathematics.VectorValueRange.createNumber(0.65, 1.0);
            this.Count = 200;
            this.Scale = new mathematics.FloatValueRange(0.05, 0.15);
            this.LifeTime = new mathematics.FloatValueRange(0.5, 1.5);
            this.RebornTime = new mathematics.FloatValueRange(0.0, 0.1);
            this.InitPhase = new mathematics.FloatValueRange(0.0, this.LifeTime.Max - this.LifeTime.Min);
        }

        InitClouds(): void {
            //this.Position = mathematics.VectorValueRange.createVector(mathematics.Vector.create(0.0, 0, 0), mathematics.Vector.create(0, 0, 0));
            this.Position = mathematics.VectorValueRange.createVector(mathematics.Vector.create(-20.0, -20, -20), mathematics.Vector.create(20, 20, 20));
            this.Velocity = mathematics.VectorValueRange.createVector(mathematics.Vector.create(2, -2, -2), mathematics.Vector.create(2, 2,2));
            this.Acceleration = mathematics.VectorValueRange.createVector(mathematics.Vector.create(-0.1, 0.0, 0.0), mathematics.Vector.create(0.1, 0.0, 0.0));
            this.Color = mathematics.VectorValueRange.createNumber(0.65, 1.0);
            this.Count =10;
            this.Scale = new mathematics.FloatValueRange(10.0, 30.0);
            this.LifeTime = new mathematics.FloatValueRange(8.0, 20.0);
            this.RebornTime = new mathematics.FloatValueRange(0.0, 0.0);
            this.InitPhase = new mathematics.FloatValueRange(0.0, this.LifeTime.Max - this.LifeTime.Min);
        }

        InitSteam(): void {
            this.Position = mathematics.VectorValueRange.createVector(mathematics.Vector.create(0.1, 0.4, 1.24), mathematics.Vector.create(-0.9, 0.8, 1.26));
            this.Velocity = mathematics.VectorValueRange.createVector(mathematics.Vector.create(0.0, 0.07, 0.0), mathematics.Vector.create(0.0, 0.14, 0.0));
            this.Acceleration = mathematics.VectorValueRange.createVector(mathematics.Vector.create(0.0, 0.0, 0.0), mathematics.Vector.create(0.0, 0.0, 0.0));
            this.Color = mathematics.VectorValueRange.createNumber(0.15, 0.35);
            this.Count = 20;
            this.Scale = new mathematics.FloatValueRange(0.3, 0.4);
            this.LifeTime = new mathematics.FloatValueRange(4.0, 7.0);
            this.RebornTime = new mathematics.FloatValueRange(0.0, 0.0);
            this.InitPhase = new mathematics.FloatValueRange(0.0, this.LifeTime.Max - this.LifeTime.Min);
        }

        CreateVertices(source: collections.LinkedList<ParticlesEmitterVertex>) {
            for (var i = 0; i < this.Count; i++) {
                var particle = this.Gen();
                particle.CreateVertices(source);
            }
        }

        Gen(): Particle {
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
        }
    }

    export class EmitterBatch implements core.IDisposable {
        _emitters: Emitter[];
        _colorMap: rendering.Texture;
        _vertexBuffer: rendering.VertexBuffer;
        _indexBuffer: rendering.IndexBuffer;

        getFadingAlphaPercent(): number {
            return 0.25;
        }
        getFadingScalePercent(): number {
            return 0.25;
        }

        _color: mathematics.Color;
        _timeStep: number;
        _time: number;
        _renderJoint: rendering.RenderJoint;
        _cloudsRenderJoint: rendering.RenderJoint;

        constructor(texture: rendering.Texture, emitters: Emitter[], color: mathematics.Color, timeStep: number) {
            this._colorMap = texture;
            this._emitters = emitters;
            this._color = color;
            this._timeStep = timeStep;
            this._time = 0;
            this.create();
        }

        dispose() {
            if (this._vertexBuffer) {
                this._vertexBuffer.dispose();
            }
            if (this._indexBuffer) {
                this._indexBuffer.dispose();
            }
            this._indexBuffer = null;
            this._vertexBuffer = null;
        }

        render(camera: Camera): void {
            Effects.PatriclesEmitter.Time.setValue(this._time);
            Effects.PatriclesEmitter.AlphaFading.setValue(this.getFadingAlphaPercent());
            Effects.PatriclesEmitter.ScaleFading.setValue(this.getFadingScalePercent());
            Effects.PatriclesEmitter.ProjectionMatrix.setValue(camera.getProjectionTransform());
            Effects.PatriclesEmitter.ViewMatrix.setValue(camera.getViewTransform());
            Effects.PatriclesEmitter.ColorMap.setValue(this._colorMap);
            Effects.PatriclesEmitter.Color.setValue(this._color);
            Effects.PatriclesEmitter.TimeStep.setValue(this._timeStep);
            this._renderJoint.render(this._indexBuffer);
        }

        renderClouds(camera: Camera, depthMap: rendering.Texture): void {
            Effects.Clouds.ProjectionMatrix.setValue(camera.getProjectionTransform());
            Effects.Clouds.ViewMatrix.setValue(camera.getViewTransform());
            Effects.Clouds.ColorMap.setValue(this._colorMap);
            Effects.Clouds.Color.setValue(this._color);
            Effects.Clouds.DepthMap.setValue(depthMap);
            this._cloudsRenderJoint.render(this._indexBuffer);
        }

        update(timeDelta: number): void {
            this._time += timeDelta;
            this._time %= Particle.getGlobalPeriod();
        }
        
        create(): void  {
            var signatires = ParticlesEmitterVertex.createSignatures();
            var verticesList = new collections.LinkedList<ParticlesEmitterVertex>();
            for (var i = 0; i < this._emitters.length; i++)
                this._emitters[i].CreateVertices(verticesList);

            var buffer = new Float32Array(verticesList.size() * signatires.getSize());

            var i = 0;
            for (var node = verticesList.firstNode; node != null; node = node.next) {
                node.element.saveToBuffer(i, buffer);
                i += signatires.getSize();
            }

            this._vertexBuffer = new rendering.VertexBuffer(signatires,  buffer);
            var pc = verticesList.size() / 4;
            var indices = [];
            indices.length = pc;
            for (var i = 0; i < pc; i++)
            {
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
        }
    }

    export class Nebula {
        Position: mathematics.Vector;
        Size: number;
        Inverse: boolean;

        constructor(position: mathematics.Vector, size: number, inverse: boolean) {
            this.Position = position;
            this.Size = size;
            this.Inverse = inverse;
        }
    }


    export class NebulaBatch implements core.IDisposable {
        _nebula: Nebula[];
        _texture1: rendering.Texture;
        _texture2: rendering.Texture;
        _indexBuffer: rendering.IndexBuffer;
        _vertexBuffer: rendering.VertexBuffer;
        Angle1: number;
        Angle2: number;
        Scale1: number;
        Scale2: number;
        _renderJoint: rendering.RenderJoint;

        constructor(nebula: Nebula[], texture1: rendering.Texture, texture2: rendering.Texture) {
            this._nebula = nebula;
            this._texture1 = texture1;
            this._texture2 = texture2;
            this.Angle1 = 0;
            this.Angle2 = 0;
            this.Scale1 = 0;
            this.Scale2 = 0;
            this.create();
        }


        dispose() {
            if (this._vertexBuffer) {
                this._vertexBuffer.dispose();
            }
            if (this._indexBuffer) {
                this._indexBuffer.dispose();
            }
            this._indexBuffer = null;
            this._vertexBuffer = null;
        }

        create(): void {
            var signatures = new rendering.VertexSignatures([
                rendering.Declarations.Position,
                rendering.Declarations.TexturePosition
            ])

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
            indices.length = this._nebula.length * 6
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
                }
                else {
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
        }

        render(camera: Camera): void {
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
        }

        update(timeDelta: number): void {
            this.Angle1 -= 0.2 * timeDelta;
            this.Angle2 -= 0.05 * timeDelta;
        }
    }

    export class AsteroidsBatch {
        _vertexBuffer: rendering.VertexBuffer;
        _indices: rendering.IndexBuffer;
        _renderSolidJoint: rendering.RenderJoint;
        _renderDiffuseJoint: rendering.RenderJoint;
        _renderSpecularBumpJoint: rendering.RenderJoint;
        _renderDepthMapJoint: rendering.RenderJoint;
        _matrices: mathematics.Matrix[];
        _normalMatrices: mathematics.Matrix3[];
        _transform: MeshTransform[];
        _specularMap: rendering.Texture;
        _diffuseMap: rendering.Texture;
        _normalMap: rendering.Texture;
        _glowMap: rendering.Texture;
        _cubeMap: rendering.TextureCubemap;
        _glowLevel: number = 0.0; 
        constructor(vertexBuffer: rendering.VertexBuffer, indexBuffer: rendering.IndexBuffer, transforms: mathematics.Matrix[],
            specularMap: rendering.Texture,
            diffuseMap: rendering.Texture,
            normalMap: rendering.Texture,
            glowMap: rendering.Texture,
            cubeMap: rendering.TextureCubemap) {
            this._vertexBuffer = vertexBuffer;
            this._indices = indexBuffer;
            this._matrices = transforms;
            this._transform = new Array<MeshTransform>(transforms.length);
            this._normalMatrices = new Array<mathematics.Matrix3>(transforms.length);
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

        update(timeDelta: number): void {
            for (var j = 0; j < this._transform.length; j++) {
                //this._transform[j].update(0.0);
                this._transform[j].update(timeDelta);
                this._matrices[j] = this._transform[j].getMatrix();
                this._normalMatrices[j] = this._matrices[j].toMatrix3();
            }
            this._glowLevel += timeDelta;
            while (this._glowLevel > 1.0)
                this._glowLevel -= 2.0;
        }
        renderSolid(camera: Camera): void {
            Effects.Solid.ProjectionMatrix.setValue(camera.getTransform());
            Effects.Solid.ModelMatrices.setValue(this._matrices);
            this._renderSolidJoint.render(this._indices);
        }
        renderDiffuse(camera: Camera): void {
            Effects.Diffuse.ProjectionMatrix.setValue(camera.getTransform());
            Effects.Diffuse.ModelMatrices.setValue(this._matrices);
            Effects.Diffuse.NormalMatrices.setValue(this._normalMatrices);
            Effects.Diffuse.Light.setValue(mathematics.Vector.create(-200, 0, 0));
            Effects.Diffuse.DiffuseMap.setValue(this._diffuseMap);
            this._renderDiffuseJoint.render(this._indices);
        }
        renderSpecularBump(camera: Camera): void {
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
        }
        renderDepthMap(camera: Camera): void {
            Effects.DepthMap.ProjectionMatrix.setValue(camera.getProjectionTransform());
            Effects.DepthMap.ViewMatrix.setValue(camera.getViewTransform());
            Effects.DepthMap.ZNear.setValue(camera.getZNear());
            Effects.DepthMap.ZFar.setValue(camera.getZFar());
            Effects.DepthMap.ModelMatrices.setValue(this._matrices);

            this._renderDepthMapJoint.render(this._indices);
        }
    }

    export class MeshTransform
    {
        _rotationVelocity: number = 0.2;
        _rotation: number = 0.0;
        _sine: number;
        _cosine: number;
        Origin: mathematics.Matrix = new mathematics.Matrix();
        update(delta: number): void {
            this._rotation += delta * this._rotationVelocity;
            this._sine = Math.sin(this._rotation);
            this._cosine = Math.cos(this._rotation);
        }
        getMatrix(): mathematics.Matrix {
            return mathematics.Matrix.Multiply(mathematics.Matrix.createRotationZ(this._sine, this._cosine), this.Origin);
        }
    }

    export class MeshTransformX extends MeshTransform
    {
        getMatrix(): mathematics.Matrix {
            return mathematics.Matrix.Multiply(this.Origin, mathematics.Matrix.createRotationX(this._sine, this._cosine));
        }
    }

    class MeshTransformY extends MeshTransform
    {
        getMatrix(): mathematics.Matrix {
            return mathematics.Matrix.Multiply(mathematics.Matrix.createRotationY(this._sine, this._cosine), this.Origin);
        }
    }

    export class VolumeFogBatch {
        _vertexBuffer: rendering.VertexBuffer;
        _indices: rendering.IndexBuffer;
        _signature: rendering.VertexSignatures;
        _renderJoint: rendering.RenderJoint;
        _renderDepthMapJoint: rendering.RenderJoint;
        constructor(vertexBuffer: rendering.VertexBuffer, indexBuffer: rendering.IndexBuffer) {
            this._signature = new rendering.VertexSignatures([rendering.Declarations.Position, rendering.Declarations.Color]);
            this._vertexBuffer = vertexBuffer;
            this._indices = indexBuffer;
            this._renderJoint = new rendering.RenderJoint(Effects.VolumeFog, this._vertexBuffer);
            this._renderDepthMapJoint = new rendering.RenderJoint(Effects.VolumeFogDepthMap, this._vertexBuffer);

        }

        render(camera: Camera, depthMap: rendering.Texture): void {
            Effects.VolumeFog.ProjectionMatrix.setValue(camera.getTransform());
            Effects.VolumeFog.DepthMap.setValue(depthMap);
            this._renderJoint.render(this._indices);
        }
        renderToDepthMap(camera: Camera, depthMap: rendering.Texture): void {
            Effects.VolumeFogDepthMap.ProjectionMatrix.setValue(camera.getProjectionTransform());
            Effects.VolumeFogDepthMap.ViewMatrix.setValue(camera.getViewTransform())
            Effects.VolumeFogDepthMap.ModelMatrix.setValue(mathematics.Matrix.createTranslate(0.0, 0.0, 0.0))
            Effects.VolumeFogDepthMap.ZNear.setValue(camera.getZNear())
            Effects.VolumeFogDepthMap.ZFar.setValue(camera.getZFar())
            Effects.VolumeFogDepthMap.DepthMap.setValue(depthMap);
            this._renderDepthMapJoint.render(this._indices);
        }
    }

    export class DepthMapPostProcessBatch {
        _vertexBuffer: rendering.VertexBuffer;
        _indices: rendering.IndexBuffer;
        _signature: rendering.VertexSignatures;
        _renderJoint: rendering.RenderJoint;
        _effect: rendering.EffectDepthMapPostProcess;
        constructor(effect: rendering.EffectDepthMapPostProcess) {
            this._signature = new rendering.VertexSignatures([rendering.Declarations.Position, rendering.Declarations.TexturePosition]);
            this._vertexBuffer = new rendering.VertexBuffer(this._signature, new Float32Array([
                -1.0, -1.0, 0, 0, 0,
                +1.0, -1.0, 0, 1, 0,
                +1.0, +1.0, 0, 1, 1,
                -1.0, +1.0, 0, 0, 1
            ]));

            this._indices = new rendering.IndexBuffer(new Uint16Array([
                0, 1, 2,
                2, 3, 0,
            ]));
            this._effect = effect;
            this._renderJoint = new rendering.RenderJoint(effect, this._vertexBuffer);

        }
        render(texture: rendering.Texture): void {
            this._effect.Texture.setValue(texture);
            this._renderJoint.render(this._indices);
        }
    }

    export class VolumeFogPostProcessBatch {
        _vertexBuffer: rendering.VertexBuffer;
        _indices: rendering.IndexBuffer;
        _signature: rendering.VertexSignatures;
        _renderJoint: rendering.RenderJoint;
        _effect: rendering.EffectVolumeFogPostProcess;
        constructor(effect: rendering.EffectVolumeFogPostProcess) {
            this._signature = new rendering.VertexSignatures([rendering.Declarations.Position, rendering.Declarations.TexturePosition]);
            this._vertexBuffer = new rendering.VertexBuffer(this._signature, new Float32Array([
                -1.0, -1.0, 0, 0, 0,
                +1.0, -1.0, 0, 1, 0,
                +1.0, +1.0, 0, 1, 1,
                -1.0, +1.0, 0, 0, 1
            ]));

            this._indices = new rendering.IndexBuffer(new Uint16Array([
                0, 1, 2,
                2, 3, 0,
            ]));
            this._effect = effect;
            this._renderJoint = new rendering.RenderJoint(effect, this._vertexBuffer);

        }

        render(texture: rendering.Texture, texture1: rendering.Texture): void {
            this._effect.Texture.setValue(texture);
            this._effect.Texture1.setValue(texture1);
            this._renderJoint.render(this._indices);
        }
    }

    export class PlanarFogBatch {
        _vertexBuffer: rendering.VertexBuffer;
        _indices: rendering.IndexBuffer;
        _signature: rendering.VertexSignatures;
        _renderJoint: rendering.RenderJoint;
        constructor() {
            this._signature = new rendering.VertexSignatures([rendering.Declarations.Position, rendering.Declarations.TexturePosition]);
            this._vertexBuffer = new rendering.VertexBuffer(this._signature, new Float32Array([
                -1.0, -1.0, 0, 0, 0,
                +1.0, -1.0, 0, 1, 0,
                +1.0, +1.0, 0, 1, 1,
                -1.0, +1.0, 0, 0, 1
            ]));

            this._indices = new rendering.IndexBuffer(new Uint16Array([
                0, 1, 2,
                2, 3, 0,
            ]));
            this._renderJoint = new rendering.RenderJoint(Effects.PlanarFog, this._vertexBuffer);

        }

        render(texture: rendering.Texture, depthMap: rendering.Texture): void {
            Effects.PlanarFog.Texture.setValue(texture);
            Effects.PlanarFog.DepthMap.setValue(depthMap);
            this._renderJoint.render(this._indices);
        }
    }


    export class TouchController {
        _camera: Camera;
        _rotationVelocityK: number;
        _maxCount: number;
        _maxTime: number;

        _moveHistory: collections.LinkedList<PointerData>;
        _moveHistoryCount: number;
        _prevPosition: mathematics.Vector;
        _prevSlowPosition: mathematics.Vector;

        constructor(camera: Camera) {
            this._camera = camera;
            this._rotationVelocityK = 0.75;
            this._maxCount = 500;
            this._maxTime = 100;
            this._moveHistory = new collections.LinkedList<PointerData>();
            this._moveHistoryCount = 0;
            this._prevPosition = new mathematics.Vector();
        }

    
        updateQueue(pointerPosition: mathematics.Vector): void  {
            var currentTime = system.environment.getTickCount();
            this._moveHistory.add(new PointerData(pointerPosition, currentTime));
            this._moveHistoryCount++;

            while ((currentTime - this._moveHistory.first().Time) > this._maxTime) {
                this._moveHistory.removeElementAtIndex(0);
                this._moveHistoryCount--;
                if (this._moveHistory.first() == null) break;
            }

            while (this._moveHistoryCount > this._maxCount) {
                this._moveHistory.removeElementAtIndex(0);
                this._moveHistoryCount--;
            }
        }

        endMove(pointerPosition: mathematics.Vector): void {
            this.updateQueue(pointerPosition);


            var prevPointerData: PointerData = null;
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
            }
            else {
                this._camera.RotationVelocity
                    .setAxis(this._camera.ExtraRotation.getMatrix().transform(mathematics.Vector.create(-velocity.getY(), -velocity.getX(), 0.0)))
                    .setValue(this.pixelsToAngle(velocity.getLength()) * this._rotationVelocityK);
            }

            this._moveHistory.clear();
            this._moveHistoryCount = 0;
            this._prevPosition = null;
        }

        pixelsToAngle(pixels: number): number{
            return pixels * 0.05 * this._camera.getFov() / this._camera.getHeight();
        }

        moveSlow(pointerPosition: mathematics.Vector): void {
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
        }

        move(pointerPosition: mathematics.Vector): void  {
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
        }

        down(pointerPosition: mathematics.Vector): void {
            this._camera.RotationVelocity.setValue(0);
            this._prevPosition = pointerPosition;
            this._moveHistory.clear();
            this._moveHistoryCount = 0;
        }

        up(pointerPosition: mathematics.Vector): void {
            this.endMove(pointerPosition);
            this._prevSlowPosition = null;
        }

        cancel(pointerPosition: mathematics.Vector): void {
            this._moveHistory.clear();
            this._moveHistoryCount = 0;
            this._camera.RotationVelocity.setValue(0);
            this._prevPosition = null
            this._prevSlowPosition = null;
        }

        leave(pointerPosition: mathematics.Vector): void {
            this.endMove(pointerPosition);
            this.leaveSlow(pointerPosition)
        }
        leaveSlow(pointerPosition: mathematics.Vector): void {
            this._prevSlowPosition = null;
        }
    }

    export class Scene implements core.IUpdate, rendering.IRender, core.IMotionAll {
        _isLoaded: boolean = false;
        _disposeObjects: collections.LinkedList<core.IDisposable> = new collections.LinkedList < core.IDisposable >();
        constructor() {
        }

        load(args: core.LoadArgs): core.AsyncAwaiter {
            this._isLoaded = false;
            var result = new core.AsyncAwaiter();
            args.Loader.Callback = () => {
                this._isLoaded = true;
                result.compleate();
            }
            this.onLoad(args);
            return result;
        }

        addDisposeObject(disposeObject: any): any {
            this._disposeObjects.add(disposeObject);
            return disposeObject;
        }

        unLoad() {
            for (var node = this._disposeObjects.firstNode; node != null; node = node.next) {
                node.element.dispose();
            }
            this._disposeObjects.clear();
        }

        update(args: core.UpdateArgs): void {
            if (!this._isLoaded) return;
            this.onUpdate(args)
        }
        render(args: rendering.RenderArgs): void {
            if (!this._isLoaded) return;
            this.onRender(args)
        }

        onLoad(args: core.LoadArgs) {
        }

        onUpdate(args: core.UpdateArgs): void {
            if (!this._isLoaded) return;
        }

        onRender(args: rendering.RenderArgs): void {
        }

        _touch: TouchController

        createTouchController(): TouchController {
            return null;
        }

        getSceneTouchController(): TouchController {
            if (this._touch == null)
                this._touch = this.createTouchController();
            return this._touch;
        }

        motionHover(args: core.MouseMoveArgs): void {
            var touch = this.getSceneTouchController();
            if (touch == null) return;
            touch.moveSlow(mathematics.Vector.create(args.X, args.Y, 0.0));
        }

        motionMove(args: core.MouseMoveArgs): void {
            var touch = this.getSceneTouchController();
            if (touch == null) return;
            touch.move(mathematics.Vector.create(args.X, args.Y, 0.0));
        }

        motionDown(args: core.MouseMoveArgs): void {
            var touch = this.getSceneTouchController();
            if (touch == null) return;
            touch.down(mathematics.Vector.create(args.X, args.Y, 0.0));
        }

        motionUp(args: core.MouseMoveArgs): void {
            var touch = this.getSceneTouchController();
            if (touch == null) return;
            touch.up(mathematics.Vector.create(args.X, args.Y, 0.0));
        }

        motionLeave(args: core.MouseMoveArgs): void {
            var touch = this.getSceneTouchController();
            if (touch == null) return;
            touch.leaveSlow(mathematics.Vector.create(args.X, args.Y, 0.0));
        }
    }

    export class PointerData {
        Position: mathematics.Vector;
        Time: number;
        constructor(position: mathematics.Vector, time: number) {
            this.Position = position;
            this.Time = time;
        }
    }

    export class SingleSprite {
        _vertexBuffer: rendering.VertexBuffer;
        _indices: rendering.IndexBuffer;
        _signature: rendering.VertexSignatures;
        _renderJoint: rendering.RenderJoint;
        _camera: entities.Camera;
        _texture: rendering.Texture;
        _effect: rendering.EffectSingleSprite;
        _rotationVelocity: number;
        _rotation: number = 0.0;
        _translate: mathematics.Vector;
        _scale: mathematics.Vector;
        _color: mathematics.Color;
        _animatedAlpha: animation.TimeLineAnimatedValue;

        constructor(camera: entities.Camera, texture: rendering.Texture, effect: rendering.EffectSingleSprite) {
            this._camera = camera;
            this._texture = texture;
            this._effect = effect;
            this._signature = new rendering.VertexSignatures([rendering.Declarations.Position, rendering.Declarations.TexturePosition]);
            this._vertexBuffer = new rendering.VertexBuffer(this._signature, new Float32Array([
                -1.0, -1.0, 0.0, 0.0, 1.0,
                1.0, -1.0, 0.0, 1.0, 1.0,
                1.0, 1.0, 0.0, 1.0, 0.0,
                -1.0, 1.0, 0.0, 0.0, 0.0,
            ]));
            this._indices = new rendering.IndexBuffer(new Uint16Array([
                0, 1, 2, 0, 2, 3,
            ]));
            this._renderJoint = new rendering.RenderJoint(this._effect, this._vertexBuffer);
            this._color = mathematics.Color.fromRGBA(1.0, 1.0, 1.0, 1.0);
            this._animatedAlpha = new animation.TimeLineAnimatedValue();
            this._rotation = 0.0;
            this._rotationVelocity = 0.0;
        }

        update(time: number): void {
            this._rotation += time * this._rotationVelocity;
            while (this._rotation > 2.0 * Math.PI) this._rotation -= 2.0 * Math.PI;
            while (this._rotation < 2.0 * Math.PI) this._rotation += 2.0 * Math.PI;
            this._animatedAlpha.update(time);
        }

        render(): void {
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
        }

        AnimatedAlpha(): animation.TimeLineAnimatedValue {
            return this._animatedAlpha;
        }

        setCamera(camera: entities.Camera) { this._camera = camera; }
        setTexture(texture: rendering.Texture) { this._texture = texture; }

        setRotation(rotation: number) { this._rotation = rotation; }
        setRotationVelocity(rotationVelocity: number) { this._rotationVelocity = rotationVelocity; }
        setTranslate(translate: mathematics.Vector) { this._translate = translate; }
        setScale(scale: mathematics.Vector) { this._scale = scale; }
        setColor(color: mathematics.Color) { this._color = color; }
        setColorRGBA(r: number, g: number, b: number, a: number) { this._color = mathematics.Color.fromRGBA(r, g, b, a); }
    }
}