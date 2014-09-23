module springflowers
{
    export class Textures
    {
        static Background: rendering.Texture;
        static Sunray1: rendering.Texture;
        static Sunray2: rendering.Texture;
        static Sunray3: rendering.Texture;
        static Sunray4: rendering.Texture;
        static Sunray5: rendering.Texture;
    }
    export class Effects {
        static SingleSprite: rendering.EffectSingleSprite;
    }

    export class Scene extends entities.Scene {
        private _camera: entities.Camera;
        private _loader: core.Loader;

        private _background: entities.SingleSprite;
        private _sunrays: collections.LinkedList<entities.SingleSprite>;

        //private _steamEmitterBatch: entities.EmitterBatch;

        constructor() {
            super();
            this._loader = new core.Loader();
            this._camera = new entities.Camera();
            this._sunrays = new collections.LinkedList<entities.SingleSprite>();
        }
        onLoad(args: core.LoadArgs) {
            this._loader = args.Loader;
            setTimeout(() => {
                this._loader.addTextNode("fx/effect_skybox_vs.fx", (value: string) => { rendering.EffectSingleSprite.VS = value });
                this._loader.addTextNode("fx/effect_skybox_ps.fx", (value: string) => { rendering.EffectSingleSprite.PS = value });
                this._loader.addTextNode("fx/effect_particles_emitter_vs.fx", (value: string) => { rendering.EffectParticlesEmitter.ParticlesEmitterVS = value });
                this._loader.addTextNode("fx/effect_particles_emitter_ps_explicit_alpha.fx", (value: string) => { rendering.EffectParticlesEmitter.ParticlesEmitterPS = value });

                this._loader.addImageNode("content/springflowers/background.jpg", (value: any) => { Textures.Background = new rendering.TextureImage(value, false); });

                this._loader.addImageNode("content/springflowers/sunray1.png", (value: any) => { Textures.Sunray1 = new rendering.TextureImage(value, false); });
                this._loader.addImageNode("content/springflowers/sunray2.png", (value: any) => { Textures.Sunray2 = new rendering.TextureImage(value, false); });
                this._loader.addImageNode("content/springflowers/sunray3.png", (value: any) => { Textures.Sunray3 = new rendering.TextureImage(value, false); });
                this._loader.addImageNode("content/springflowers/sunray4.png", (value: any) => { Textures.Sunray4 = new rendering.TextureImage(value, false); });
                this._loader.addImageNode("content/springflowers/sunray5.png", (value: any) => { Textures.Sunray5 = new rendering.TextureImage(value, false); });

                this._loader.startLoadintg(() => {
                    Effects.SingleSprite = new rendering.EffectSingleSprite();
                    entities.Effects.PatriclesEmitter = new rendering.EffectParticlesEmitter();

                    this._background = new entities.SingleSprite(this._camera, Textures.Background, Effects.SingleSprite);
                    this._background.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    this._background.setScale(mathematics.Vector.create(2.0, 1.0, 1.0));

                    this._sunrays.add(this.createSunRay(2.1, 0.0, 1.25, -0.3, Textures.Sunray1));
                    this._sunrays.add(this.createSunRay(1.15, 0.0, 1.25, -0.4, Textures.Sunray2));
                    this._sunrays.add(this.createSunRay(0.2, 0.0, 1.25, -0.5, Textures.Sunray3));
                    this._sunrays.add(this.createSunRay(-0.75, 0.0, 1.25, -0.6, Textures.Sunray4));
                    this._sunrays.add(this.createSunRay(-1.7, 0.0, 1.25, -0.7, Textures.Sunray5));

                    /*var steamEmitter = new entities.Emitter();
                    steamEmitter.InitSteam();
                    this._steamEmitterBatch = new entities.EmitterBatch(
                        Textures.Steam,
                        [steamEmitter],
                        entities.ColorTheme.getDefault().Clouds,
                        1.0);*/
                });
            }, 1000);
        }
        onUpdate(args: core.UpdateArgs): void {
            var time = args.Delta;
            this._camera.update(args);
            for (var node = this._sunrays.firstNode; node != null; node = node.next) {
                node.element.update(time);
            }
        }

        onRender(args: rendering.RenderArgs): void {
            this._camera.setViewport(2.0, args.Viewport.SizeX, args.Viewport.SizeY);
            this._camera.apply();

            this._background.render();
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
            gl.depthMask(false);
            gl.enable(gl.DEPTH_TEST);

            for (var node = this._sunrays.firstNode; node != null; node = node.next) {
                node.element.render();
            }
        }
        private createSunRay(x: number, y: number, z: number, rotation: number, texture: rendering.Texture): entities.SingleSprite {
            var light = new entities.SingleSprite(this._camera, texture, Effects.SingleSprite);
            light.setTranslate(mathematics.Vector.create(x, y, z));
            light.setScale(mathematics.Vector.create(0.75, 3.0, 1.0));
            light.setRotation(rotation);
            light.AnimatedAlpha().TimeLine.add(
                new animation.TimeLineElement(0.2, 1.5, 0.1, 0.3));
            light.AnimatedAlpha().TimeLine.add(
                new animation.TimeLineElement(0.2, 1.5, 0.3, 0.1));
            light.AnimatedAlpha().TimeLine.add(
                new animation.TimeLineElement(0.2, 1.5, 0.1, 0.3));
            light.AnimatedAlpha().TimeLine.add(
                new animation.TimeLineElement(0.2, 1.5, 0.3, 0.1));
            light.AnimatedAlpha().StartRepeatKey = 0;
            light.AnimatedAlpha().FinishRepeatKey = 3;
            return light;
        }
    }
}