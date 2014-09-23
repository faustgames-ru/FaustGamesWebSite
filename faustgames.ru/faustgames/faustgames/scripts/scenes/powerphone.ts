/// <reference path="../framework/rendering.ts"/>
/// <reference path="../framework/animation.ts"/>
module powerphone {
    export class Textures {
        static Background: rendering.Texture;
        static GeneratorRing: rendering.Texture;
        static GeneratorLights: rendering.Texture;
        static GeneratorTrails: rendering.Texture;
        static Lightning1: rendering.Texture;
        static Lightning2: rendering.Texture;
        static Lightning3: rendering.Texture;
        static Lightning4: rendering.Texture;
        static Lightning5: rendering.Texture;
    }

    export class Effects {
        static SingleSprite: rendering.EffectSingleSprite;
    }

    export class Scene extends entities.Scene {
        private _camera: entities.Camera;
        private _loader: core.Loader;

        private _background: entities.SingleSprite;
        private _generatorRing: entities.SingleSprite;
        private _generatorLights: entities.SingleSprite;        
        private _generatorTrails: entities.SingleSprite;

        private _lightning1: entities.SingleSprite;
        private _lightning2: entities.SingleSprite;
        private _lightning3: entities.SingleSprite;
        private _lightning4: entities.SingleSprite;
        private _lightning5: entities.SingleSprite;

        constructor() {
            super();
            this._loader = new core.Loader();
            this._camera = new entities.Camera();
        }

        onLoad(args: core.LoadArgs) {
            this._loader = args.Loader;
            setTimeout(() => {
                this._loader.addTextNode("fx/effect_skybox_vs.fx", (value: string) => { rendering.EffectSingleSprite.VS = value });
                this._loader.addTextNode("fx/effect_skybox_ps.fx", (value: string) => { rendering.EffectSingleSprite.PS = value });

                this._loader.addImageNode("content/powerphone/staticback.jpg", (value: any) => { Textures.Background = new rendering.TextureImage(value, false); });
                this._loader.addImageNode("content/powerphone/generator_ring.png", (value: any) => { Textures.GeneratorRing = new rendering.TextureImage(value, false); });
                this._loader.addImageNode("content/powerphone/generator_lights.png", (value: any) => { Textures.GeneratorLights = new rendering.TextureImage(value, false); });
                this._loader.addImageNode("content/powerphone/generator_trails.png", (value: any) => { Textures.GeneratorTrails = new rendering.TextureImage(value, false); });

                this._loader.addImageNode("content/powerphone/lightning1.png", (value: any) => { Textures.Lightning1 = new rendering.TextureImage(value, false); });
                this._loader.addImageNode("content/powerphone/lightning2.png", (value: any) => { Textures.Lightning2 = new rendering.TextureImage(value, false); });
                this._loader.addImageNode("content/powerphone/lightning3.png", (value: any) => { Textures.Lightning3 = new rendering.TextureImage(value, false); });
                this._loader.addImageNode("content/powerphone/lightning4.png", (value: any) => { Textures.Lightning4 = new rendering.TextureImage(value, false); });
                this._loader.addImageNode("content/powerphone/lightning5.png", (value: any) => { Textures.Lightning5 = new rendering.TextureImage(value, false); });

                this._loader.startLoadintg(() => {
                    Effects.SingleSprite = new rendering.EffectSingleSprite();

                    this._background = new entities.SingleSprite(this._camera, Textures.Background, Effects.SingleSprite);
                    this._background.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    this._background.setScale(mathematics.Vector.create(2.0, 1.0, 1.0));

                    this._generatorRing = new entities.SingleSprite(this._camera, Textures.GeneratorRing, Effects.SingleSprite);
                    this._generatorRing.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    this._generatorRing.setScale(mathematics.Vector.create(0.35, 0.35, 1.0));
                    this._generatorRing.setRotationVelocity(7.0);

                    this._generatorLights = new entities.SingleSprite(this._camera, Textures.GeneratorLights, Effects.SingleSprite);
                    this._generatorLights.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    this._generatorLights.setScale(mathematics.Vector.create(0.35, 0.35, 1.0));
                    this._generatorLights.setRotationVelocity(7.0);

                    this._generatorTrails = new entities.SingleSprite(this._camera, Textures.GeneratorTrails, Effects.SingleSprite);
                    this._generatorTrails.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    this._generatorTrails.setScale(mathematics.Vector.create(0.35, 0.35, 1.0));
                    this._generatorTrails.setRotationVelocity(7.0);
                    

                    this._lightning1 = new entities.SingleSprite(this._camera, Textures.Lightning1, Effects.SingleSprite);
                    this._lightning1.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    this._lightning1.setScale(mathematics.Vector.create(0.45, 0.45, 1.0));
                    this._lightning1.setRotationVelocity(1.0);
                    this._lightning1.AnimatedAlpha().TimeLine.add(
                        new animation.TimeLineElement(0.5, 1.5, 0.0, 0.0));
                    this._lightning1.AnimatedAlpha().TimeLine.add(
                        new animation.TimeLineElement(0.0, 0.1, 0.0, 1.0));
                    this._lightning1.AnimatedAlpha().TimeLine.add(
                        new animation.TimeLineElement(0.0, 0.1, 1.0, 0.0));
                    this._lightning1.AnimatedAlpha().StartRepeatKey = 0;
                    this._lightning1.AnimatedAlpha().FinishRepeatKey = 2;

                    this._lightning2 = new entities.SingleSprite(this._camera, Textures.Lightning2, Effects.SingleSprite);
                    this._lightning2.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    this._lightning2.setScale(mathematics.Vector.create(0.45, 0.45, 1.0));
                    this._lightning2.setRotationVelocity(1.0);
                    this._lightning2.AnimatedAlpha().TimeLine.add(
                        new animation.TimeLineElement(0.5, 1.5, 0.0, 0.0));
                    this._lightning2.AnimatedAlpha().TimeLine.add(
                        new animation.TimeLineElement(0.0, 0.1, 0.0, 1.0));
                    this._lightning2.AnimatedAlpha().TimeLine.add(
                        new animation.TimeLineElement(0.0, 0.1, 1.0, 0.0));
                    this._lightning2.AnimatedAlpha().StartRepeatKey = 0;
                    this._lightning2.AnimatedAlpha().FinishRepeatKey = 2;

                    this._lightning3 = new entities.SingleSprite(this._camera, Textures.Lightning3, Effects.SingleSprite);
                    this._lightning3.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    this._lightning3.setScale(mathematics.Vector.create(0.45, 0.45, 1.0));
                    this._lightning3.setRotationVelocity(1.0);
                    this._lightning3.AnimatedAlpha().TimeLine.add(
                        new animation.TimeLineElement(0.5, 1.5, 0.0, 0.0));
                    this._lightning3.AnimatedAlpha().TimeLine.add(
                        new animation.TimeLineElement(0.0, 0.1, 0.0, 1.0));
                    this._lightning3.AnimatedAlpha().TimeLine.add(
                        new animation.TimeLineElement(0.0, 0.1, 1.0, 0.0));
                    this._lightning3.AnimatedAlpha().StartRepeatKey = 0;
                    this._lightning3.AnimatedAlpha().FinishRepeatKey = 2;

                    this._lightning4 = new entities.SingleSprite(this._camera, Textures.Lightning4, Effects.SingleSprite);
                    this._lightning4.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    this._lightning4.setScale(mathematics.Vector.create(0.45, 0.45, 1.0));
                    this._lightning4.setRotationVelocity(1.0);
                    this._lightning4.AnimatedAlpha().TimeLine.add(
                        new animation.TimeLineElement(0.5, 1.5, 0.0, 0.0));
                    this._lightning4.AnimatedAlpha().TimeLine.add(
                        new animation.TimeLineElement(0.0, 0.1, 0.0, 1.0));
                    this._lightning4.AnimatedAlpha().TimeLine.add(
                        new animation.TimeLineElement(0.0, 0.1, 1.0, 0.0));
                    this._lightning4.AnimatedAlpha().StartRepeatKey = 0;
                    this._lightning4.AnimatedAlpha().FinishRepeatKey = 2;

                    this._lightning5 = new entities.SingleSprite(this._camera, Textures.Lightning5, Effects.SingleSprite);
                    this._lightning5.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    this._lightning5.setScale(mathematics.Vector.create(0.45, 0.45, 1.0));
                    this._lightning5.setRotationVelocity(1.0);
                    this._lightning5.AnimatedAlpha().TimeLine.add(
                        new animation.TimeLineElement(0.5, 1.5, 0.0, 0.0));
                    this._lightning5.AnimatedAlpha().TimeLine.add(
                        new animation.TimeLineElement(0.0, 0.1, 0.0, 1.0));
                    this._lightning5.AnimatedAlpha().TimeLine.add(
                        new animation.TimeLineElement(0.0, 0.1, 1.0, 0.0));
                    this._lightning5.AnimatedAlpha().StartRepeatKey = 0;
                    this._lightning5.AnimatedAlpha().FinishRepeatKey = 2;
                });
            }, 1000); 
        }
        onUpdate(args: core.UpdateArgs): void {
            var time = args.Delta;
            this._camera.update(args);
            this._generatorRing.update(time);
            this._generatorLights.update(time);
            this._generatorTrails.update(time);
            this._lightning1.update(time);
            this._lightning2.update(time);
            this._lightning3.update(time);
            this._lightning4.update(time);
            this._lightning5.update(time);

        }

        onRender(args: rendering.RenderArgs) {
            this._camera.setViewport(2.0, args.Viewport.SizeX, args.Viewport.SizeY);
            this._camera.apply();

            this._background.render();
            //
            gl.enable(gl.BLEND);//!!
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);//!!
            this._generatorRing.render();
            //
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE);//!!
            this._generatorLights.render();
            //
            this._generatorTrails.render();

            this._lightning1.render();
            this._lightning2.render();
            this._lightning3.render();
            this._lightning4.render();
            this._lightning5.render();
        }
    }
}