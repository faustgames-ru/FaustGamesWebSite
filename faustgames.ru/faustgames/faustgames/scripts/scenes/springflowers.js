var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var springflowers;
(function (springflowers) {
    var Textures = (function () {
        function Textures() {
        }
        return Textures;
    })();
    springflowers.Textures = Textures;
    var Effects = (function () {
        function Effects() {
        }
        return Effects;
    })();
    springflowers.Effects = Effects;

    var Scene = (function (_super) {
        __extends(Scene, _super);
        //private _steamEmitterBatch: entities.EmitterBatch;
        function Scene() {
            _super.call(this);
            this._loader = new core.Loader();
            this._camera = new entities.Camera();
            this._sunrays = new collections.LinkedList();
        }
        Scene.prototype.onLoad = function (args) {
            var _this = this;
            this._loader = args.Loader;
            setTimeout(function () {
                _this._loader.addTextNode("fx/effect_skybox_vs.fx", function (value) {
                    rendering.EffectSingleSprite.VS = value;
                });
                _this._loader.addTextNode("fx/effect_skybox_ps.fx", function (value) {
                    rendering.EffectSingleSprite.PS = value;
                });
                _this._loader.addTextNode("fx/effect_particles_emitter_vs.fx", function (value) {
                    rendering.EffectParticlesEmitter.ParticlesEmitterVS = value;
                });
                _this._loader.addTextNode("fx/effect_particles_emitter_ps_explicit_alpha.fx", function (value) {
                    rendering.EffectParticlesEmitter.ParticlesEmitterPS = value;
                });

                _this._loader.addImageNode("content/springflowers/background.jpg", function (value) {
                    Textures.Background = new rendering.TextureImage(value, false);
                });

                _this._loader.addImageNode("content/springflowers/sunray1.png", function (value) {
                    Textures.Sunray1 = new rendering.TextureImage(value, false);
                });
                _this._loader.addImageNode("content/springflowers/sunray2.png", function (value) {
                    Textures.Sunray2 = new rendering.TextureImage(value, false);
                });
                _this._loader.addImageNode("content/springflowers/sunray3.png", function (value) {
                    Textures.Sunray3 = new rendering.TextureImage(value, false);
                });
                _this._loader.addImageNode("content/springflowers/sunray4.png", function (value) {
                    Textures.Sunray4 = new rendering.TextureImage(value, false);
                });
                _this._loader.addImageNode("content/springflowers/sunray5.png", function (value) {
                    Textures.Sunray5 = new rendering.TextureImage(value, false);
                });

                _this._loader.startLoadintg(function () {
                    Effects.SingleSprite = new rendering.EffectSingleSprite();
                    entities.Effects.PatriclesEmitter = new rendering.EffectParticlesEmitter();

                    _this._background = new entities.SingleSprite(_this._camera, Textures.Background, Effects.SingleSprite);
                    _this._background.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    _this._background.setScale(mathematics.Vector.create(2.0, 1.0, 1.0));

                    _this._sunrays.add(_this.createSunRay(2.1, 0.0, 1.25, -0.3, Textures.Sunray1));
                    _this._sunrays.add(_this.createSunRay(1.15, 0.0, 1.25, -0.4, Textures.Sunray2));
                    _this._sunrays.add(_this.createSunRay(0.2, 0.0, 1.25, -0.5, Textures.Sunray3));
                    _this._sunrays.add(_this.createSunRay(-0.75, 0.0, 1.25, -0.6, Textures.Sunray4));
                    _this._sunrays.add(_this.createSunRay(-1.7, 0.0, 1.25, -0.7, Textures.Sunray5));
                    /*var steamEmitter = new entities.Emitter();
                    steamEmitter.InitSteam();
                    this._steamEmitterBatch = new entities.EmitterBatch(
                    Textures.Steam,
                    [steamEmitter],
                    entities.ColorTheme.getDefault().Clouds,
                    1.0);*/
                });
            }, 1000);
        };
        Scene.prototype.onUpdate = function (args) {
            var time = args.Delta;
            this._camera.update(args);
            for (var node = this._sunrays.firstNode; node != null; node = node.next) {
                node.element.update(time);
            }
        };

        Scene.prototype.onRender = function (args) {
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
        };
        Scene.prototype.createSunRay = function (x, y, z, rotation, texture) {
            var light = new entities.SingleSprite(this._camera, texture, Effects.SingleSprite);
            light.setTranslate(mathematics.Vector.create(x, y, z));
            light.setScale(mathematics.Vector.create(0.75, 3.0, 1.0));
            light.setRotation(rotation);
            light.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(0.2, 1.5, 0.1, 0.3));
            light.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(0.2, 1.5, 0.3, 0.1));
            light.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(0.2, 1.5, 0.1, 0.3));
            light.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(0.2, 1.5, 0.3, 0.1));
            light.AnimatedAlpha().StartRepeatKey = 0;
            light.AnimatedAlpha().FinishRepeatKey = 3;
            return light;
        };
        return Scene;
    })(entities.Scene);
    springflowers.Scene = Scene;
})(springflowers || (springflowers = {}));
//# sourceMappingURL=springflowers.js.map
