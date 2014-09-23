/// <reference path="../framework/core.ts"/>
/// <reference path="../framework/rendering.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var rendering;
(function (rendering) {
    var UniformsParticles = (function () {
        function UniformsParticles() {
        }
        UniformsParticles.AlphaFading = "u_AlphaFading";
        UniformsParticles.ScaleFading = "u_ScaleFading";
        UniformsParticles.TimeStep = "u_TimeStep";
        return UniformsParticles;
    })();

    var UniformsParticlesFactory = (function () {
        function UniformsParticlesFactory() {
        }
        UniformsParticlesFactory.AlphaFading = function () {
            return new rendering.EffectParameterFloat(UniformsParticles.AlphaFading);
        };
        UniformsParticlesFactory.ScaleFading = function () {
            return new rendering.EffectParameterFloat(UniformsParticles.ScaleFading);
        };
        UniformsParticlesFactory.TimeStep = function () {
            return new rendering.EffectParameterFloat(UniformsParticles.TimeStep);
        };
        return UniformsParticlesFactory;
    })();
    rendering.UniformsParticlesFactory = UniformsParticlesFactory;

    var UniformsNebula = (function () {
        function UniformsNebula() {
        }
        UniformsNebula.Cos1 = "u_Cos1";
        UniformsNebula.Cos2 = "u_Cos2";
        UniformsNebula.Sin1 = "u_Sin1";
        UniformsNebula.Sin2 = "u_Sin2";
        return UniformsNebula;
    })();

    var UniformsNebulaFactory = (function () {
        function UniformsNebulaFactory() {
        }
        UniformsNebulaFactory.Cos1 = function () {
            return new rendering.EffectParameterFloat(UniformsNebula.Cos1);
        };
        UniformsNebulaFactory.Cos2 = function () {
            return new rendering.EffectParameterFloat(UniformsNebula.Cos2);
        };
        UniformsNebulaFactory.Sin1 = function () {
            return new rendering.EffectParameterFloat(UniformsNebula.Sin1);
        };
        UniformsNebulaFactory.Sin2 = function () {
            return new rendering.EffectParameterFloat(UniformsNebula.Sin2);
        };
        return UniformsNebulaFactory;
    })();
    rendering.UniformsNebulaFactory = UniformsNebulaFactory;

    var DeclarationsParticles = (function () {
        function DeclarationsParticles() {
        }
        DeclarationsParticles.MidPoint = new rendering.DeclarationVertex("a_MidPoint");
        DeclarationsParticles.StartVelocity = new rendering.DeclarationVertex("a_StartVelocity");
        DeclarationsParticles.Acceleration = new rendering.DeclarationVertex("a_Acceleration");
        DeclarationsParticles.Scale = new rendering.DeclarationFloat("a_Scale");
        DeclarationsParticles.LifeTime = new rendering.DeclarationFloat("a_LifeTime");
        DeclarationsParticles.RebornTime = new rendering.DeclarationFloat("a_RebornTime");
        DeclarationsParticles.InitPhase = new rendering.DeclarationFloat("a_InitPhase");
        return DeclarationsParticles;
    })();
    rendering.DeclarationsParticles = DeclarationsParticles;

    var EffectBasicDepthMap = (function (_super) {
        __extends(EffectBasicDepthMap, _super);
        function EffectBasicDepthMap(depthMapPS, depthMapVS) {
            this.ProjectionMatrix = rendering.UniformsFactory.ProjectionMatrix();
            this.ViewMatrix = rendering.UniformsFactory.ViewMatrix();
            this.Position = new rendering.Attribute(rendering.Declarations.Position);
            _super.call(this, depthMapPS, depthMapVS, [this.ProjectionMatrix, this.ViewMatrix], [this.Position]);
        }
        return EffectBasicDepthMap;
    })(rendering.Effect);
    rendering.EffectBasicDepthMap = EffectBasicDepthMap;

    var EffectVolumeFogDepthMap = (function (_super) {
        __extends(EffectVolumeFogDepthMap, _super);
        function EffectVolumeFogDepthMap() {
            this.ProjectionMatrix = rendering.UniformsFactory.ProjectionMatrix();
            this.ViewMatrix = rendering.UniformsFactory.ViewMatrix();
            this.ModelMatrix = rendering.UniformsFactory.ModelMatrix();
            this.DepthMap = rendering.UniformsFactory.Texture();
            this.ZNear = rendering.UniformsFactory.ZNear();
            this.ZFar = rendering.UniformsFactory.ZFar();
            this.Position = new rendering.Attribute(rendering.Declarations.Position);
            _super.call(this, EffectVolumeFogDepthMap.VolumeFogDepthMapPS, EffectVolumeFogDepthMap.VolumeFogDepthMapVS, [this.ProjectionMatrix, this.ViewMatrix, this.ModelMatrix, this.ZNear, this.ZFar, this.DepthMap], [this.Position]);
        }
        return EffectVolumeFogDepthMap;
    })(rendering.Effect);
    rendering.EffectVolumeFogDepthMap = EffectVolumeFogDepthMap;

    var EffectDepthMap = (function (_super) {
        __extends(EffectDepthMap, _super);
        function EffectDepthMap() {
            this.ProjectionMatrix = rendering.UniformsFactory.ProjectionMatrix();
            this.ViewMatrix = rendering.UniformsFactory.ViewMatrix();
            this.ModelMatrices = rendering.UniformsFactory.ModelMatrices();
            this.ZNear = rendering.UniformsFactory.ZNear();
            this.ZFar = rendering.UniformsFactory.ZFar();
            this.Position = new rendering.Attribute(rendering.Declarations.Position);
            this.TransformIndex = new rendering.Attribute(rendering.Declarations.TransformIndex);

            _super.call(this, EffectDepthMap.DepthMapPS, EffectDepthMap.DepthMapVS, [this.ProjectionMatrix, this.ViewMatrix, this.ModelMatrices, this.ZNear, this.ZFar], [this.Position, this.TransformIndex]);
        }
        return EffectDepthMap;
    })(rendering.Effect);
    rendering.EffectDepthMap = EffectDepthMap;

    var EffectDepthMapPostProcess = (function (_super) {
        __extends(EffectDepthMapPostProcess, _super);
        function EffectDepthMapPostProcess() {
            this.Texture = rendering.UniformsFactory.Texture();
            this.Position = new rendering.Attribute(rendering.Declarations.Position);
            this.TexturePosition = new rendering.Attribute(rendering.Declarations.TexturePosition);

            _super.call(this, EffectDepthMapPostProcess.EffectPostProcessPS, EffectDepthMapPostProcess.EffectPostProcessVS, [this.Texture], [this.Position, this.TexturePosition]);
        }
        return EffectDepthMapPostProcess;
    })(rendering.Effect);
    rendering.EffectDepthMapPostProcess = EffectDepthMapPostProcess;

    var EffectVolumeFogPostProcess = (function (_super) {
        __extends(EffectVolumeFogPostProcess, _super);
        function EffectVolumeFogPostProcess() {
            this.Texture = rendering.UniformsFactory.Texture();
            this.Texture1 = rendering.UniformsFactory.Texture1();
            this.Position = new rendering.Attribute(rendering.Declarations.Position);
            this.TexturePosition = new rendering.Attribute(rendering.Declarations.TexturePosition);

            _super.call(this, EffectVolumeFogPostProcess.EffectPostProcessPS, EffectVolumeFogPostProcess.EffectPostProcessVS, [this.Texture, this.Texture1], [this.Position, this.TexturePosition]);
        }
        return EffectVolumeFogPostProcess;
    })(rendering.Effect);
    rendering.EffectVolumeFogPostProcess = EffectVolumeFogPostProcess;

    var EffectPlanarFog = (function (_super) {
        __extends(EffectPlanarFog, _super);
        function EffectPlanarFog() {
            this.Texture = rendering.UniformsFactory.Texture();
            this.DepthMap = rendering.UniformsFactory.DepthMap();
            this.Position = new rendering.Attribute(rendering.Declarations.Position);
            this.TexturePosition = new rendering.Attribute(rendering.Declarations.TexturePosition);

            _super.call(this, EffectPlanarFog.PlanarFogPS, EffectPlanarFog.PlanarFogVS, [this.Texture, this.DepthMap], [this.Position, this.TexturePosition]);
        }
        return EffectPlanarFog;
    })(rendering.Effect);
    rendering.EffectPlanarFog = EffectPlanarFog;

    var EffectVolumeFog = (function (_super) {
        __extends(EffectVolumeFog, _super);
        function EffectVolumeFog() {
            this.ProjectionMatrix = rendering.UniformsFactory.ProjectionMatrix();
            this.DepthMap = rendering.UniformsFactory.Texture();
            this.Position = new rendering.Attribute(rendering.Declarations.Position);
            this.Color = new rendering.Attribute(rendering.Declarations.Color);

            _super.call(this, EffectVolumeFog.EffectVolumeFogPS, EffectVolumeFog.EffectVolumeFogVS, [this.ProjectionMatrix, this.DepthMap], [this.Position, this.Color]);
        }
        return EffectVolumeFog;
    })(rendering.Effect);
    rendering.EffectVolumeFog = EffectVolumeFog;

    var EffectSkybox = (function (_super) {
        __extends(EffectSkybox, _super);
        function EffectSkybox() {
            this.ProjectionMatrix = rendering.UniformsFactory.ProjectionMatrix();
            this.ViewMatrix = rendering.UniformsFactory.ViewMatrix();
            this.ModelMatrix = rendering.UniformsFactory.ModelMatrix();
            this.Texture = rendering.UniformsFactory.Texture();
            this.Color = rendering.UniformsFactory.Color();
            this.Eye = rendering.UniformsFactory.Eye();
            this.Light = rendering.UniformsFactory.Light();

            this.Position = new rendering.Attribute(rendering.Declarations.Position);
            this.TexturePosition = new rendering.Attribute(rendering.Declarations.TexturePosition);

            _super.call(this, EffectSkybox.SkyboxPS, EffectSkybox.SkyboxVS, [this.ProjectionMatrix, this.ViewMatrix, this.ModelMatrix, this.Texture, this.Color, this.Eye, this.Light], [this.Position, this.TexturePosition]);
        }
        return EffectSkybox;
    })(rendering.Effect);
    rendering.EffectSkybox = EffectSkybox;

    var EffectSolid = (function (_super) {
        __extends(EffectSolid, _super);
        function EffectSolid() {
            this.ProjectionMatrix = rendering.UniformsFactory.ProjectionMatrix();
            this.ModelMatrices = rendering.UniformsFactory.ModelMatrices();
            this.Position = new rendering.Attribute(rendering.Declarations.Position);
            this.TransformIndex = new rendering.Attribute(rendering.Declarations.TransformIndex);

            _super.call(this, EffectSolid.SolidPS, EffectSolid.SolidVS, [this.ProjectionMatrix, this.ModelMatrices], [this.Position, this.TransformIndex]);
        }
        return EffectSolid;
    })(rendering.Effect);
    rendering.EffectSolid = EffectSolid;

    var EffectDiffuse = (function (_super) {
        __extends(EffectDiffuse, _super);
        function EffectDiffuse() {
            this.ProjectionMatrix = rendering.UniformsFactory.ProjectionMatrix();
            this.ModelMatrices = rendering.UniformsFactory.ModelMatrices();
            this.NormalMatrices = rendering.UniformsFactory.NormalMatrices();
            this.DiffuseMap = rendering.UniformsFactory.DiffuseMap();
            this.Light = rendering.UniformsFactory.Light();
            this.Position = new rendering.Attribute(rendering.Declarations.Position);
            this.TesturePosition = new rendering.Attribute(rendering.Declarations.TexturePosition);
            this.Normal = new rendering.Attribute(rendering.Declarations.Normal);
            this.TransformIndex = new rendering.Attribute(rendering.Declarations.TransformIndex);

            _super.call(this, EffectDiffuse.DiffusePS, EffectDiffuse.DiffuseVS, [this.ProjectionMatrix, this.ModelMatrices, this.NormalMatrices, this.Light, this.DiffuseMap], [this.Position, this.TesturePosition, this.Normal, this.TransformIndex]);
        }
        return EffectDiffuse;
    })(rendering.Effect);
    rendering.EffectDiffuse = EffectDiffuse;

    var EffectSpecularBump = (function (_super) {
        __extends(EffectSpecularBump, _super);
        function EffectSpecularBump() {
            this.ProjectionMatrix = rendering.UniformsFactory.ProjectionMatrix();
            this.ViewMatrix = rendering.UniformsFactory.ViewMatrix();
            this.NormalMatrix = rendering.UniformsFactory.NormalMatrix();
            this.ModelMatrices = rendering.UniformsFactory.ModelMatrices();
            this.NormalMatrices = rendering.UniformsFactory.NormalMatrices();
            this.SpecularMap = rendering.UniformsFactory.DiffuseMap();
            this.DiffuseMap = rendering.UniformsFactory.DiffuseMap();
            this.NormalMap = rendering.UniformsFactory.NormalMap();
            this.GlowMap = rendering.UniformsFactory.GlowMap();
            this.GlowLevel = rendering.UniformsFactory.GlowLevel();
            this.SpecularLight = rendering.UniformsFactory.SpecularLight();
            this.DiffuseLight = rendering.UniformsFactory.DiffuseLight();
            this.AmbientLight = rendering.UniformsFactory.AmbientLight();
            this.GlowColor = rendering.UniformsFactory.GlowColor();
            this.Light = rendering.UniformsFactory.Light();
            this.Eye = rendering.UniformsFactory.Eye();

            this.Position = new rendering.Attribute(rendering.Declarations.Position);
            this.TexturePosition = new rendering.Attribute(rendering.Declarations.TexturePosition);
            this.Normal = new rendering.Attribute(rendering.Declarations.Normal);
            this.TransformIndex = new rendering.Attribute(rendering.Declarations.TransformIndex);
            this.Tangent = new rendering.Attribute(rendering.Declarations.Tangent);
            this.BiTangent = new rendering.Attribute(rendering.Declarations.BiTangent);

            _super.call(this, EffectSpecularBump.SpecularBumpPS, EffectSpecularBump.SpecularBumpVS, [
                this.ProjectionMatrix,
                this.ViewMatrix,
                this.NormalMatrix,
                this.ModelMatrices,
                this.NormalMatrices,
                this.SpecularMap,
                this.DiffuseMap,
                this.NormalMap,
                this.GlowMap,
                this.GlowLevel,
                this.SpecularLight,
                this.DiffuseLight,
                this.AmbientLight,
                this.GlowColor,
                this.Light,
                this.Eye
            ], [
                this.Position,
                this.TexturePosition,
                this.Normal,
                this.TransformIndex,
                this.Tangent,
                this.BiTangent
            ]);
        }
        return EffectSpecularBump;
    })(rendering.Effect);
    rendering.EffectSpecularBump = EffectSpecularBump;

    var EffectParticlesEmitter = (function (_super) {
        __extends(EffectParticlesEmitter, _super);
        function EffectParticlesEmitter() {
            this.Time = rendering.UniformsFactory.Time();
            this.AlphaFading = UniformsParticlesFactory.AlphaFading();
            this.ScaleFading = UniformsParticlesFactory.ScaleFading();
            this.ProjectionMatrix = rendering.UniformsFactory.ProjectionMatrix();
            this.ViewMatrix = rendering.UniformsFactory.ViewMatrix();
            this.Color = rendering.UniformsFactory.Color();
            this.TimeStep = UniformsParticlesFactory.TimeStep();
            this.ColorMap = rendering.UniformsFactory.Texture();

            this.MidPoint = new rendering.Attribute(DeclarationsParticles.MidPoint);
            this.Position = new rendering.Attribute(rendering.Declarations.Position);
            this.TexturePosition = new rendering.Attribute(rendering.Declarations.TexturePosition);
            this.StartVelocity = new rendering.Attribute(DeclarationsParticles.StartVelocity);
            this.Acceleration = new rendering.Attribute(DeclarationsParticles.Acceleration);
            this.ColorAttribute = new rendering.Attribute(rendering.Declarations.Color);
            this.Scale = new rendering.Attribute(DeclarationsParticles.Scale);
            this.LifeTime = new rendering.Attribute(DeclarationsParticles.LifeTime);
            this.RebornTime = new rendering.Attribute(DeclarationsParticles.RebornTime);
            this.InitPhase = new rendering.Attribute(DeclarationsParticles.InitPhase);

            _super.call(this, EffectParticlesEmitter.ParticlesEmitterPS, EffectParticlesEmitter.ParticlesEmitterVS, [this.Time, this.AlphaFading, this.ScaleFading, this.ProjectionMatrix, this.ViewMatrix, this.Color, this.TimeStep, this.ColorMap], [this.MidPoint, this.Position, this.TexturePosition, this.StartVelocity, this.Acceleration, this.ColorAttribute, this.Scale, this.LifeTime, this.RebornTime, this.InitPhase]);
        }
        return EffectParticlesEmitter;
    })(rendering.Effect);
    rendering.EffectParticlesEmitter = EffectParticlesEmitter;

    var EffectClouds = (function (_super) {
        __extends(EffectClouds, _super);
        function EffectClouds() {
            this.ProjectionMatrix = rendering.UniformsFactory.ProjectionMatrix();
            this.ViewMatrix = rendering.UniformsFactory.ViewMatrix();
            this.Color = rendering.UniformsFactory.Color();
            this.ColorMap = rendering.UniformsFactory.Texture();
            this.DepthMap = rendering.UniformsFactory.DepthMap();

            this.MidPoint = new rendering.Attribute(DeclarationsParticles.MidPoint);
            this.Position = new rendering.Attribute(rendering.Declarations.Position);
            this.TexturePosition = new rendering.Attribute(rendering.Declarations.TexturePosition);
            this.ColorAttribute = new rendering.Attribute(rendering.Declarations.Color);
            this.Scale = new rendering.Attribute(DeclarationsParticles.Scale);

            _super.call(this, EffectClouds.EffectCloudsPS, EffectClouds.EffectCloudsVS, [this.ProjectionMatrix, this.ViewMatrix, this.Color, this.ColorMap, this.DepthMap], [this.MidPoint, this.Position, this.TexturePosition, this.ColorAttribute, this.Scale]);
        }
        return EffectClouds;
    })(rendering.Effect);
    rendering.EffectClouds = EffectClouds;
    var EffectNebula = (function (_super) {
        __extends(EffectNebula, _super);
        function EffectNebula() {
            this.ViewMatrix = rendering.UniformsFactory.ViewMatrix();
            this.ProjectionMatrix = rendering.UniformsFactory.ProjectionMatrix();
            this.Cos1 = UniformsNebulaFactory.Cos1();
            this.Cos2 = UniformsNebulaFactory.Cos2();
            this.Sin1 = UniformsNebulaFactory.Sin1();
            this.Sin2 = UniformsNebulaFactory.Sin2();
            this.ColorMap1 = rendering.UniformsFactory.Texture();
            this.ColorMap2 = rendering.UniformsFactory.Texture1();
            this.Color1 = rendering.UniformsFactory.Color();
            this.Color2 = rendering.UniformsFactory.Color1();
            this.Position = new rendering.Attribute(rendering.Declarations.Position);
            this.TexturePosition = new rendering.Attribute(rendering.Declarations.TexturePosition);

            _super.call(this, EffectNebula.NebulaPS, EffectNebula.NebulaVS, [this.ViewMatrix, this.ProjectionMatrix, this.Cos1, this.Cos2, this.Sin1, this.Sin2, this.ColorMap1, this.ColorMap2, this.Color1, this.Color2], [this.Position, this.TexturePosition]);
        }
        return EffectNebula;
    })(rendering.Effect);
    rendering.EffectNebula = EffectNebula;

    var EffectSingleSprite = (function (_super) {
        __extends(EffectSingleSprite, _super);
        function EffectSingleSprite() {
            this.ProjectionMatrix = rendering.UniformsFactory.ProjectionMatrix();
            this.ModelMatrix = rendering.UniformsFactory.ModelMatrix();
            this.Texture = rendering.UniformsFactory.Texture();
            this.Color = rendering.UniformsFactory.Color();
            this.Position = new rendering.Attribute(rendering.Declarations.Position);
            this.TexturePosition = new rendering.Attribute(rendering.Declarations.TexturePosition);

            _super.call(this, EffectSingleSprite.PS, EffectSingleSprite.VS, [this.ProjectionMatrix, this.ModelMatrix, this.Texture, this.Color], [this.Position, this.TexturePosition]);
        }
        return EffectSingleSprite;
    })(rendering.Effect);
    rendering.EffectSingleSprite = EffectSingleSprite;
})(rendering || (rendering = {}));
//# sourceMappingURL=effects.js.map
