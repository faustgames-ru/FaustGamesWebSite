/// <reference path="../framework/core.ts"/>
/// <reference path="../framework/rendering.ts"/>

module rendering {

    class UniformsParticles {
        static AlphaFading: string = "u_AlphaFading";
        static ScaleFading: string = "u_ScaleFading";
        static TimeStep: string = "u_TimeStep";
    }

    export class UniformsParticlesFactory {
        static AlphaFading(): EffectParameterFloat {
            return new EffectParameterFloat(UniformsParticles.AlphaFading);
        }
        static ScaleFading(): EffectParameterFloat {
            return new EffectParameterFloat(UniformsParticles.ScaleFading);
        }
        static TimeStep(): EffectParameterFloat {
            return new EffectParameterFloat(UniformsParticles.TimeStep);
        }       
    }

    class UniformsNebula {
        static Cos1: string = "u_Cos1";
        static Cos2: string = "u_Cos2";
        static Sin1: string = "u_Sin1";
        static Sin2: string = "u_Sin2";
    }

    export class UniformsNebulaFactory {
        static Cos1(): EffectParameterFloat {
            return new EffectParameterFloat(UniformsNebula.Cos1);
        }
        static Cos2(): EffectParameterFloat {
            return new EffectParameterFloat(UniformsNebula.Cos2);
        }
        static Sin1(): EffectParameterFloat {
            return new EffectParameterFloat(UniformsNebula.Sin1);
        }
        static Sin2(): EffectParameterFloat {
            return new EffectParameterFloat(UniformsNebula.Sin2);
        }
    }

    export class DeclarationsParticles {
        static MidPoint: DeclarationVertex = new DeclarationVertex("a_MidPoint");
        static StartVelocity: DeclarationVertex = new DeclarationVertex("a_StartVelocity");
        static Acceleration: DeclarationVertex = new DeclarationVertex("a_Acceleration");
        static Scale: DeclarationFloat = new DeclarationFloat("a_Scale");
        static LifeTime: DeclarationFloat = new DeclarationFloat("a_LifeTime");
        static RebornTime: DeclarationFloat = new DeclarationFloat("a_RebornTime");
        static InitPhase: DeclarationFloat = new DeclarationFloat("a_InitPhase");
    }

    export class EffectBasicDepthMap extends Effect {
        ProjectionMatrix: EffectParameterMatrix;
        ViewMatrix: EffectParameterMatrix;
        Position: Attribute;
        constructor(depthMapPS: string, depthMapVS: string) {
            this.ProjectionMatrix = UniformsFactory.ProjectionMatrix();
            this.ViewMatrix = UniformsFactory.ViewMatrix();
            this.Position = new Attribute(Declarations.Position);
            super(
                depthMapPS,
                depthMapVS,
                [this.ProjectionMatrix, this.ViewMatrix],
                [this.Position]);
        }
    }

    export class EffectVolumeFogDepthMap extends Effect {
        static VolumeFogDepthMapPS: string;
        static VolumeFogDepthMapVS: string;
        ProjectionMatrix: EffectParameterMatrix;
        ViewMatrix: EffectParameterMatrix;
        ModelMatrix: EffectParameterMatrix;
        DepthMap: EffectParameterTexture;
        ZNear: EffectParameterFloat;
        ZFar: EffectParameterFloat;
        Position: Attribute;
        constructor() {
            this.ProjectionMatrix = UniformsFactory.ProjectionMatrix();
            this.ViewMatrix = UniformsFactory.ViewMatrix();
            this.ModelMatrix = UniformsFactory.ModelMatrix();
            this.DepthMap = UniformsFactory.Texture();
            this.ZNear = UniformsFactory.ZNear();
            this.ZFar = UniformsFactory.ZFar();
            this.Position = new Attribute(Declarations.Position);
            super(
                EffectVolumeFogDepthMap.VolumeFogDepthMapPS,
                EffectVolumeFogDepthMap.VolumeFogDepthMapVS,
                [this.ProjectionMatrix, this.ViewMatrix, this.ModelMatrix, this.ZNear, this.ZFar, this.DepthMap],
                [this.Position]);
        }
    }

    export class EffectDepthMap extends Effect {
        static DepthMapPS: string;
        static DepthMapVS: string;
        ProjectionMatrix: EffectParameterMatrix;
        ViewMatrix: EffectParameterMatrix;
        ModelMatrices: EffectParameterMatrixArray;
        ZNear: EffectParameterFloat;
        ZFar: EffectParameterFloat;
        Position: Attribute;
        TransformIndex: Attribute;
        constructor() {
            this.ProjectionMatrix = UniformsFactory.ProjectionMatrix();
            this.ViewMatrix = UniformsFactory.ViewMatrix();
            this.ModelMatrices = UniformsFactory.ModelMatrices();
            this.ZNear = UniformsFactory.ZNear();
            this.ZFar = UniformsFactory.ZFar();
            this.Position = new Attribute(Declarations.Position);
            this.TransformIndex = new Attribute(Declarations.TransformIndex);

            super(
                EffectDepthMap.DepthMapPS,
                EffectDepthMap.DepthMapVS,
                [this.ProjectionMatrix, this.ViewMatrix, this.ModelMatrices, this.ZNear, this.ZFar],
                [this.Position, this.TransformIndex]);
        }
    }

    export class EffectDepthMapPostProcess extends Effect {
        static EffectPostProcessPS: string;
        static EffectPostProcessVS: string;
        Texture: EffectParameterTexture;
        Position: Attribute;
        TexturePosition: Attribute;
        constructor() {
            this.Texture = UniformsFactory.Texture();
            this.Position = new Attribute(Declarations.Position);
            this.TexturePosition = new Attribute(Declarations.TexturePosition);

            super(
                EffectDepthMapPostProcess.EffectPostProcessPS,
                EffectDepthMapPostProcess.EffectPostProcessVS,
                [this.Texture],
                [this.Position, this.TexturePosition]);
        }
    }

    export class EffectVolumeFogPostProcess extends Effect {
        static EffectPostProcessPS: string;
        static EffectPostProcessVS: string;
        Texture: EffectParameterTexture;
        Texture1: EffectParameterTexture;
        Position: Attribute;
        TexturePosition: Attribute;
        constructor() {
            this.Texture = UniformsFactory.Texture();
            this.Texture1 = UniformsFactory.Texture1();
            this.Position = new Attribute(Declarations.Position);
            this.TexturePosition = new Attribute(Declarations.TexturePosition);

            super(
                EffectVolumeFogPostProcess.EffectPostProcessPS,
                EffectVolumeFogPostProcess.EffectPostProcessVS,
                [this.Texture, this.Texture1],
                [this.Position, this.TexturePosition]);
        }
    }

    export class EffectPlanarFog extends Effect {
        static PlanarFogPS: string;
        static PlanarFogVS: string;
        Texture: EffectParameterTexture;
        DepthMap: EffectParameterTexture;
        Position: Attribute;
        TexturePosition: Attribute;
        constructor() {
            this.Texture = UniformsFactory.Texture();
            this.DepthMap = UniformsFactory.DepthMap();
            this.Position = new Attribute(Declarations.Position);
            this.TexturePosition = new Attribute(Declarations.TexturePosition);

            super(
                EffectPlanarFog.PlanarFogPS,
                EffectPlanarFog.PlanarFogVS,
                [this.Texture, this.DepthMap],
                [this.Position, this.TexturePosition]);
        }
    }

    export class EffectVolumeFog extends Effect {
        static EffectVolumeFogPS: string;
        static EffectVolumeFogVS: string;
        ProjectionMatrix: EffectParameterMatrix;
        DepthMap: EffectParameterTexture;
        Position: Attribute;
        Color: Attribute;
        constructor() {
            this.ProjectionMatrix = UniformsFactory.ProjectionMatrix();
            this.DepthMap = UniformsFactory.Texture();
            this.Position = new Attribute(Declarations.Position);
            this.Color = new Attribute(Declarations.Color);

            super(
                EffectVolumeFog.EffectVolumeFogPS,
                EffectVolumeFog.EffectVolumeFogVS,
                [this.ProjectionMatrix, this.DepthMap],
                [this.Position, this.Color]);
        }
    }

    export class EffectSkybox extends Effect {
        static SkyboxPS: string;
        static SkyboxVS: string;
        ProjectionMatrix: EffectParameterMatrix;
        ViewMatrix: EffectParameterMatrix;
        ModelMatrix: EffectParameterMatrix;
        Texture: EffectParameterTexture;
        Color: EffectParameterColor;
        Eye: EffectParameterVector;
        Light: EffectParameterVector;

        Position : Attribute;
        TexturePosition: Attribute;

        constructor() {
            this.ProjectionMatrix = UniformsFactory.ProjectionMatrix();
            this.ViewMatrix = UniformsFactory.ViewMatrix();
            this.ModelMatrix = UniformsFactory.ModelMatrix();
            this.Texture = UniformsFactory.Texture();
            this.Color = UniformsFactory.Color();
            this.Eye = UniformsFactory.Eye();
            this.Light = UniformsFactory.Light();

            this.Position = new Attribute(Declarations.Position);
            this.TexturePosition = new Attribute(Declarations.TexturePosition);

            super(
                EffectSkybox.SkyboxPS,
                EffectSkybox.SkyboxVS,
                [this.ProjectionMatrix, this.ViewMatrix, this.ModelMatrix, this.Texture, this.Color, this.Eye, this.Light],
                [this.Position, this.TexturePosition]);
        }
    }

    export class EffectSolid extends Effect {
        static SolidPS: string;
        static SolidVS: string;
        ProjectionMatrix: EffectParameterMatrix;
        ModelMatrices: EffectParameterMatrixArray;
        Position: Attribute;
        TransformIndex: Attribute;

        constructor() {
            this.ProjectionMatrix = UniformsFactory.ProjectionMatrix();
            this.ModelMatrices = UniformsFactory.ModelMatrices();
            this.Position = new Attribute(Declarations.Position);
            this.TransformIndex = new Attribute(Declarations.TransformIndex);

            super(
                EffectSolid.SolidPS,
                EffectSolid.SolidVS,
                [this.ProjectionMatrix, this.ModelMatrices],
                [this.Position, this.TransformIndex]);
        }
    }

    export class EffectDiffuse extends Effect {
        static DiffusePS: string;
        static DiffuseVS: string;
        ProjectionMatrix: EffectParameterMatrix;
        ModelMatrices: EffectParameterMatrixArray;
        NormalMatrices: EffectParameterMatrix3Array;
        DiffuseMap: EffectParameterTexture;
        Light: EffectParameterVector;
        Position: Attribute;
        Normal: Attribute;
        TesturePosition: Attribute;
        TransformIndex: Attribute;

        constructor() {
            this.ProjectionMatrix = UniformsFactory.ProjectionMatrix();
            this.ModelMatrices = UniformsFactory.ModelMatrices();
            this.NormalMatrices = UniformsFactory.NormalMatrices();
            this.DiffuseMap = UniformsFactory.DiffuseMap();
            this.Light = UniformsFactory.Light();
            this.Position = new Attribute(Declarations.Position);
            this.TesturePosition = new Attribute(Declarations.TexturePosition);
            this.Normal = new Attribute(Declarations.Normal);
            this.TransformIndex = new Attribute(Declarations.TransformIndex);

            super(
                EffectDiffuse.DiffusePS,
                EffectDiffuse.DiffuseVS,
                [this.ProjectionMatrix, this.ModelMatrices, this.NormalMatrices, this.Light, this.DiffuseMap],
                [this.Position, this.TesturePosition, this.Normal, this.TransformIndex]);
        }
    }

    export class EffectSpecularBump extends Effect {
        static SpecularBumpPS: string;
        static SpecularBumpVS: string;

        ProjectionMatrix: EffectParameterMatrix;
        ViewMatrix: EffectParameterMatrix;
        NormalMatrix: EffectParameterMatrix3;
        ModelMatrices: EffectParameterMatrixArray;
        NormalMatrices: EffectParameterMatrix3Array;
        Light: EffectParameterVector;
        Eye: EffectParameterVector;

        SpecularMap: EffectParameterTexture;
        DiffuseMap: EffectParameterTexture;
        NormalMap: EffectParameterTexture;
        GlowMap: EffectParameterTexture;

        GlowLevel: EffectParameterFloat;
        SpecularLight: EffectParameterColor;
        DiffuseLight: EffectParameterColor;
        AmbientLight: EffectParameterColor;
        GlowColor: EffectParameterColor;
        
        Position: Attribute;
        Normal: Attribute;
        TexturePosition: Attribute;
        TransformIndex: Attribute;
        Tangent: Attribute;
        BiTangent: Attribute;


        constructor() {
            this.ProjectionMatrix = UniformsFactory.ProjectionMatrix();
            this.ViewMatrix = UniformsFactory.ViewMatrix();
            this.NormalMatrix = UniformsFactory.NormalMatrix();
            this.ModelMatrices = UniformsFactory.ModelMatrices();
            this.NormalMatrices = UniformsFactory.NormalMatrices();
            this.SpecularMap = UniformsFactory.DiffuseMap();
            this.DiffuseMap = UniformsFactory.DiffuseMap();
            this.NormalMap = UniformsFactory.NormalMap();
            this.GlowMap = UniformsFactory.GlowMap();
            this.GlowLevel = UniformsFactory.GlowLevel();
            this.SpecularLight = UniformsFactory.SpecularLight();
            this.DiffuseLight = UniformsFactory.DiffuseLight();
            this.AmbientLight = UniformsFactory.AmbientLight();
            this.GlowColor = UniformsFactory.GlowColor();
            this.Light = UniformsFactory.Light();
            this.Eye = UniformsFactory.Eye();

            this.Position = new Attribute(Declarations.Position);
            this.TexturePosition = new Attribute(Declarations.TexturePosition);
            this.Normal = new Attribute(Declarations.Normal);
            this.TransformIndex = new Attribute(Declarations.TransformIndex);
            this.Tangent = new Attribute(Declarations.Tangent);
            this.BiTangent = new Attribute(Declarations.BiTangent);

            super(
                EffectSpecularBump.SpecularBumpPS,
                EffectSpecularBump.SpecularBumpVS,
                [
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
                ],
                [
                    this.Position,
                    this.TexturePosition,
                    this.Normal,
                    this.TransformIndex,
                    this.Tangent,
                    this.BiTangent
                ]);
        }
    }

    export class EffectParticlesEmitter extends Effect {
        static ParticlesEmitterPS: string;
        static ParticlesEmitterVS: string;

        Time: EffectParameterFloat;
        AlphaFading: EffectParameterFloat;
        ScaleFading: EffectParameterFloat;
        ProjectionMatrix: EffectParameterMatrix;
        ViewMatrix: EffectParameterMatrix;
        Color: EffectParameterColor;
        TimeStep: EffectParameterFloat;
        ColorMap: EffectParameterTexture;

        MidPoint: Attribute;
        Position: Attribute;
        TexturePosition: Attribute;
        StartVelocity: Attribute;
        Acceleration: Attribute;
        ColorAttribute: Attribute;
        Scale: Attribute;
        LifeTime: Attribute;
        RebornTime: Attribute;
        InitPhase: Attribute;

        constructor() {
            this.Time = UniformsFactory.Time();
            this.AlphaFading = UniformsParticlesFactory.AlphaFading();
            this.ScaleFading = UniformsParticlesFactory.ScaleFading();
            this.ProjectionMatrix = UniformsFactory.ProjectionMatrix();
            this.ViewMatrix = UniformsFactory.ViewMatrix();
            this.Color = UniformsFactory.Color();
            this.TimeStep = UniformsParticlesFactory.TimeStep();
            this.ColorMap = UniformsFactory.Texture();

            this.MidPoint = new Attribute(DeclarationsParticles.MidPoint);
            this.Position = new Attribute(Declarations.Position);
            this.TexturePosition = new Attribute(Declarations.TexturePosition);
            this.StartVelocity = new Attribute(DeclarationsParticles.StartVelocity);
            this.Acceleration = new Attribute(DeclarationsParticles.Acceleration);
            this.ColorAttribute = new Attribute(Declarations.Color);
            this.Scale = new Attribute(DeclarationsParticles.Scale);
            this.LifeTime = new Attribute(DeclarationsParticles.LifeTime);
            this.RebornTime = new Attribute(DeclarationsParticles.RebornTime);
            this.InitPhase = new Attribute(DeclarationsParticles.InitPhase);

            super(
                EffectParticlesEmitter.ParticlesEmitterPS,
                EffectParticlesEmitter.ParticlesEmitterVS,
                [this.Time, this.AlphaFading, this.ScaleFading, this.ProjectionMatrix, this.ViewMatrix, this.Color, this.TimeStep, this.ColorMap],
                [this.MidPoint, this.Position, this.TexturePosition, this.StartVelocity, this.Acceleration, this.ColorAttribute, this.Scale, this.LifeTime, this.RebornTime, this.InitPhase]);
        }
    }

    export class EffectClouds extends Effect {
        static EffectCloudsPS: string;
        static EffectCloudsVS: string;

        ProjectionMatrix: EffectParameterMatrix;
        ViewMatrix: EffectParameterMatrix;
        Color: EffectParameterColor;
        ColorMap: EffectParameterTexture;
        DepthMap: EffectParameterTexture;

        MidPoint: Attribute;
        Position: Attribute;
        TexturePosition: Attribute;
        ColorAttribute: Attribute;
        Scale: Attribute;

        constructor() {
            this.ProjectionMatrix = UniformsFactory.ProjectionMatrix();
            this.ViewMatrix = UniformsFactory.ViewMatrix();
            this.Color = UniformsFactory.Color();
            this.ColorMap = UniformsFactory.Texture();
            this.DepthMap = UniformsFactory.DepthMap();

            this.MidPoint = new Attribute(DeclarationsParticles.MidPoint);
            this.Position = new Attribute(Declarations.Position);
            this.TexturePosition = new Attribute(Declarations.TexturePosition);
            this.ColorAttribute = new Attribute(Declarations.Color);
            this.Scale = new Attribute(DeclarationsParticles.Scale);

            super(
                EffectClouds.EffectCloudsPS,
                EffectClouds.EffectCloudsVS,
                [this.ProjectionMatrix, this.ViewMatrix, this.Color, this.ColorMap, this.DepthMap],
                [this.MidPoint, this.Position, this.TexturePosition, this.ColorAttribute, this.Scale]);
        }
    }
    export class EffectNebula extends Effect {
        static NebulaPS: string;
        static NebulaVS: string;
        ProjectionMatrix: EffectParameterMatrix;
        ViewMatrix: EffectParameterMatrix;
        Cos1: EffectParameterFloat;
        Cos2: EffectParameterFloat;
        Sin1: EffectParameterFloat;
        Sin2: EffectParameterFloat;
        ColorMap1: EffectParameterTexture;
        ColorMap2: EffectParameterTexture;
        Color1: EffectParameterColor;
        Color2: EffectParameterColor;

        Position: Attribute;
        TexturePosition: Attribute;

        constructor() {
            this.ViewMatrix = UniformsFactory.ViewMatrix();
            this.ProjectionMatrix = UniformsFactory.ProjectionMatrix();
            this.Cos1 = UniformsNebulaFactory.Cos1();
            this.Cos2 = UniformsNebulaFactory.Cos2();
            this.Sin1 = UniformsNebulaFactory.Sin1();
            this.Sin2 = UniformsNebulaFactory.Sin2();
            this.ColorMap1 = UniformsFactory.Texture();
            this.ColorMap2 = UniformsFactory.Texture1();
            this.Color1 = UniformsFactory.Color();
            this.Color2 = UniformsFactory.Color1();
            this.Position = new Attribute(Declarations.Position);
            this.TexturePosition = new Attribute(Declarations.TexturePosition);

            super(
                EffectNebula.NebulaPS,
                EffectNebula.NebulaVS,
                [this.ViewMatrix, this.ProjectionMatrix, this.Cos1, this.Cos2, this.Sin1, this.Sin2, this.ColorMap1, this.ColorMap2, this.Color1, this.Color2],
                [this.Position, this.TexturePosition]);
        }
    }

    export class EffectSingleSprite extends rendering.Effect {
        static PS: string;
        static VS: string;
        ProjectionMatrix: rendering.EffectParameterMatrix;
        ModelMatrix: rendering.EffectParameterMatrix;
        Texture: rendering.EffectParameterTexture;
        Color: rendering.EffectParameterColor;
        Position: rendering.Attribute;
        TexturePosition: rendering.Attribute;

        constructor() {
            this.ProjectionMatrix = rendering.UniformsFactory.ProjectionMatrix();
            this.ModelMatrix = rendering.UniformsFactory.ModelMatrix();
            this.Texture = rendering.UniformsFactory.Texture();
            this.Color = rendering.UniformsFactory.Color();
            this.Position = new rendering.Attribute(rendering.Declarations.Position);
            this.TexturePosition = new rendering.Attribute(rendering.Declarations.TexturePosition);

            super(
                EffectSingleSprite.PS,
                EffectSingleSprite.VS,
                [this.ProjectionMatrix, this.ModelMatrix, this.Texture, this.Color],
                [this.Position, this.TexturePosition]);
        }
    }

} 