module coffee {
    export class Textures {
        static Background: rendering.Texture;
        static Steam: rendering.Texture;
        static Light: rendering.Texture;
    }

    export class Effects {
        static SingleSprite: rendering.EffectSingleSprite;
    }

    export class Scene extends entities.Scene {
        private _camera: entities.Camera;
        private _loader: core.Loader;

        private _background: entities.SingleSprite;
        private _lights: collections.LinkedList<entities.SingleSprite>;
        
        private _steamEmitterBatch: entities.EmitterBatch;

        constructor() {
            super();
            this._loader = new core.Loader();
            this._camera = new entities.Camera();
            this._lights = new collections.LinkedList<entities.SingleSprite>();
        }

        onLoad(args: core.LoadArgs) {
            this._loader = args.Loader;
            setTimeout(() => {
                this._loader.addTextNode("fx/effect_single_sprite_vs.fx", (value: string) => { rendering.EffectSingleSprite.VS = value });
                this._loader.addTextNode("fx/effect_single_sprite_ps.fx", (value: string) => { rendering.EffectSingleSprite.PS = value });
                this._loader.addTextNode("fx/effect_particles_emitter_vs.fx", (value: string) => { rendering.EffectParticlesEmitter.ParticlesEmitterVS = value });
                this._loader.addTextNode("fx/effect_particles_emitter_ps_explicit_alpha.fx", (value: string) => { rendering.EffectParticlesEmitter.ParticlesEmitterPS = value });

                this._loader.addImageNode("content/coffee/background.jpg", (value: any) => { Textures.Background = new rendering.TextureImage(value, false); });
                this._loader.addImageNode("content/coffee/steam.png", (value: any) => { Textures.Steam = new rendering.TextureImage(value, false); });
                this._loader.addImageNode("content/coffee/light.png", (value: any) => { Textures.Light = new rendering.TextureImage(value, false); });

                this._loader.startLoadintg(() => {
                    Effects.SingleSprite = new rendering.EffectSingleSprite();
                    entities.Effects.PatriclesEmitter = new rendering.EffectParticlesEmitter();

                    this._background = new entities.SingleSprite(this._camera, Textures.Background, Effects.SingleSprite);
                    this._background.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    this._background.setScale(mathematics.Vector.create(2.0, 1.0, 1.0));

                    this._lights.add(this.createLight(1.65, 0.95, 1.25));
                    this._lights.add(this.createLight(1.75, 0.7, 1.25));
                    this._lights.add(this.createLight(1.8, 0.5, 1.25));
                    this._lights.add(this.createLight(1.75, 0.25, 1.25));
                    this._lights.add(this.createLight(1.65, -0.1, 1.25));
                    this._lights.add(this.createLight(1.5, -0.5, 1.25));
                    this._lights.add(this.createLight(1.2, -0.9, 1.25));
                    //
                    this._lights.add(this.createLight(-0.6, 0.8, 1.25));
                    this._lights.add(this.createLight(-0.9, 0.9, 1.25));
                    this._lights.add(this.createLight(-1.2, 0.8, 1.25));
                    this._lights.add(this.createLight(-1.5, 0.7, 1.25));
                    this._lights.add(this.createLight(-1.7, 0.5, 1.25));
                    this._lights.add(this.createLight(-1.9, 0.2, 1.25));
                    this._lights.add(this.createLight(-1.95, -0.2, 1.25));
                    this._lights.add(this.createLight(-1.7, -0.5, 1.25));
                    this._lights.add(this.createLight(-1.4, -0.85, 1.25));

                    var steamEmitter = new entities.Emitter();
                    steamEmitter.InitSteam();
                    this._steamEmitterBatch = new entities.EmitterBatch(
                        Textures.Steam,
                        [steamEmitter],
                        entities.ColorTheme.getDefault().Clouds,
                        1.0);
                });
            }, 1000);
        }
        onUpdate(args: core.UpdateArgs): void {
            var time = args.Delta;
            this._camera.update(args);
            this._steamEmitterBatch.update(time);
            for (var node = this._lights.firstNode; node != null; node = node.next)
            {
                node.element.update(time);
            }                     
        }

        onRender(args: rendering.RenderArgs): void {
            this._camera.setViewport(2.0, args.Viewport.SizeX, args.Viewport.SizeY);
            this._camera.apply();

            this._background.render();

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.depthMask(false);
            gl.enable(gl.DEPTH_TEST);
            this._steamEmitterBatch.render(this._camera);

            for (var node = this._lights.firstNode; node != null; node = node.next) {
                node.element.render();
            }
        }

        private createLight(x: number, y: number, z: number): entities.SingleSprite
        {
            var light = new entities.SingleSprite(this._camera, Textures.Light, Effects.SingleSprite);
            light.setTranslate(mathematics.Vector.create(x, y, z));
            light.setScale(mathematics.Vector.create(0.7, 0.7, 1.0));
            light.setRotationVelocity(1.0);
            light.AnimatedAlpha().TimeLine.add(
                new animation.TimeLineElement(1.0, 3.5, 0.0, 0.0));
            light.AnimatedAlpha().TimeLine.add(
                new animation.TimeLineElement(0.7, 0.9, 0.0, 0.5));
            light.AnimatedAlpha().TimeLine.add(
                new animation.TimeLineElement(0.7, 0.9, 0.5, 0.0));
            light.AnimatedAlpha().StartRepeatKey = 0;
            light.AnimatedAlpha().FinishRepeatKey = 2;
            return light;
        }
    }
} 