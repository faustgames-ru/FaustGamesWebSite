var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var coffee;
(function (coffee) {
    var Textures = (function () {
        function Textures() {
        }
        return Textures;
    })();
    coffee.Textures = Textures;

    var Effects = (function () {
        function Effects() {
        }
        return Effects;
    })();
    coffee.Effects = Effects;

    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene() {
            _super.call(this);
            this._loader = new core.Loader();
            this._camera = new entities.Camera();
            this._lights = new collections.LinkedList();
        }
        Scene.prototype.onLoad = function (args) {
            var _this = this;
            this._loader = args.Loader;
            setTimeout(function () {
                _this._loader.addTextNode("fx/effect_single_sprite_vs.fx", function (value) {
                    rendering.EffectSingleSprite.VS = value;
                });
                _this._loader.addTextNode("fx/effect_single_sprite_ps.fx", function (value) {
                    rendering.EffectSingleSprite.PS = value;
                });
                _this._loader.addTextNode("fx/effect_particles_emitter_vs.fx", function (value) {
                    rendering.EffectParticlesEmitter.ParticlesEmitterVS = value;
                });
                _this._loader.addTextNode("fx/effect_particles_emitter_ps_explicit_alpha.fx", function (value) {
                    rendering.EffectParticlesEmitter.ParticlesEmitterPS = value;
                });

                _this._loader.addImageNode("content/coffee/background.jpg", function (value) {
                    Textures.Background = new rendering.TextureImage(value, false);
                });
                _this._loader.addImageNode("content/coffee/steam.png", function (value) {
                    Textures.Steam = new rendering.TextureImage(value, false);
                });
                _this._loader.addImageNode("content/coffee/light.png", function (value) {
                    Textures.Light = new rendering.TextureImage(value, false);
                });

                _this._loader.startLoadintg(function () {
                    Effects.SingleSprite = new rendering.EffectSingleSprite();
                    entities.Effects.PatriclesEmitter = new rendering.EffectParticlesEmitter();

                    _this._background = new entities.SingleSprite(_this._camera, Textures.Background, Effects.SingleSprite);
                    _this._background.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    _this._background.setScale(mathematics.Vector.create(2.0, 1.0, 1.0));

                    _this._lights.add(_this.createLight(1.65, 0.95, 1.25));
                    _this._lights.add(_this.createLight(1.75, 0.7, 1.25));
                    _this._lights.add(_this.createLight(1.8, 0.5, 1.25));
                    _this._lights.add(_this.createLight(1.75, 0.25, 1.25));
                    _this._lights.add(_this.createLight(1.65, -0.1, 1.25));
                    _this._lights.add(_this.createLight(1.5, -0.5, 1.25));
                    _this._lights.add(_this.createLight(1.2, -0.9, 1.25));

                    //
                    _this._lights.add(_this.createLight(-0.6, 0.8, 1.25));
                    _this._lights.add(_this.createLight(-0.9, 0.9, 1.25));
                    _this._lights.add(_this.createLight(-1.2, 0.8, 1.25));
                    _this._lights.add(_this.createLight(-1.5, 0.7, 1.25));
                    _this._lights.add(_this.createLight(-1.7, 0.5, 1.25));
                    _this._lights.add(_this.createLight(-1.9, 0.2, 1.25));
                    _this._lights.add(_this.createLight(-1.95, -0.2, 1.25));
                    _this._lights.add(_this.createLight(-1.7, -0.5, 1.25));
                    _this._lights.add(_this.createLight(-1.4, -0.85, 1.25));

                    var steamEmitter = new entities.Emitter();
                    steamEmitter.InitSteam();
                    _this._steamEmitterBatch = new entities.EmitterBatch(Textures.Steam, [steamEmitter], entities.ColorTheme.getDefault().Clouds, 1.0);
                });
            }, 1000);
        };
        Scene.prototype.onUpdate = function (args) {
            var time = args.Delta;
            this._camera.update(args);
            this._steamEmitterBatch.update(time);
            for (var node = this._lights.firstNode; node != null; node = node.next) {
                node.element.update(time);
            }
        };

        Scene.prototype.onRender = function (args) {
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
        };

        Scene.prototype.createLight = function (x, y, z) {
            var light = new entities.SingleSprite(this._camera, Textures.Light, Effects.SingleSprite);
            light.setTranslate(mathematics.Vector.create(x, y, z));
            light.setScale(mathematics.Vector.create(0.7, 0.7, 1.0));
            light.setRotationVelocity(1.0);
            light.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(1.0, 3.5, 0.0, 0.0));
            light.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(0.7, 0.9, 0.0, 0.5));
            light.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(0.7, 0.9, 0.5, 0.0));
            light.AnimatedAlpha().StartRepeatKey = 0;
            light.AnimatedAlpha().FinishRepeatKey = 2;
            return light;
        };
        return Scene;
    })(entities.Scene);
    coffee.Scene = Scene;
})(coffee || (coffee = {}));
//# sourceMappingURL=coffee.js.map
