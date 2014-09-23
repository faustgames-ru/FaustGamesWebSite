var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../framework/rendering.ts"/>
/// <reference path="../framework/animation.ts"/>
var powerphone;
(function (powerphone) {
    var Textures = (function () {
        function Textures() {
        }
        return Textures;
    })();
    powerphone.Textures = Textures;

    var Effects = (function () {
        function Effects() {
        }
        return Effects;
    })();
    powerphone.Effects = Effects;

    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene() {
            _super.call(this);
            this._loader = new core.Loader();
            this._camera = new entities.Camera();
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

                _this._loader.addImageNode("content/powerphone/staticback.jpg", function (value) {
                    Textures.Background = new rendering.TextureImage(value, false);
                });
                _this._loader.addImageNode("content/powerphone/generator_ring.png", function (value) {
                    Textures.GeneratorRing = new rendering.TextureImage(value, false);
                });
                _this._loader.addImageNode("content/powerphone/generator_lights.png", function (value) {
                    Textures.GeneratorLights = new rendering.TextureImage(value, false);
                });
                _this._loader.addImageNode("content/powerphone/generator_trails.png", function (value) {
                    Textures.GeneratorTrails = new rendering.TextureImage(value, false);
                });

                _this._loader.addImageNode("content/powerphone/lightning1.png", function (value) {
                    Textures.Lightning1 = new rendering.TextureImage(value, false);
                });
                _this._loader.addImageNode("content/powerphone/lightning2.png", function (value) {
                    Textures.Lightning2 = new rendering.TextureImage(value, false);
                });
                _this._loader.addImageNode("content/powerphone/lightning3.png", function (value) {
                    Textures.Lightning3 = new rendering.TextureImage(value, false);
                });
                _this._loader.addImageNode("content/powerphone/lightning4.png", function (value) {
                    Textures.Lightning4 = new rendering.TextureImage(value, false);
                });
                _this._loader.addImageNode("content/powerphone/lightning5.png", function (value) {
                    Textures.Lightning5 = new rendering.TextureImage(value, false);
                });

                _this._loader.startLoadintg(function () {
                    Effects.SingleSprite = new rendering.EffectSingleSprite();

                    _this._background = new entities.SingleSprite(_this._camera, Textures.Background, Effects.SingleSprite);
                    _this._background.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    _this._background.setScale(mathematics.Vector.create(2.0, 1.0, 1.0));

                    _this._generatorRing = new entities.SingleSprite(_this._camera, Textures.GeneratorRing, Effects.SingleSprite);
                    _this._generatorRing.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    _this._generatorRing.setScale(mathematics.Vector.create(0.35, 0.35, 1.0));
                    _this._generatorRing.setRotationVelocity(7.0);

                    _this._generatorLights = new entities.SingleSprite(_this._camera, Textures.GeneratorLights, Effects.SingleSprite);
                    _this._generatorLights.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    _this._generatorLights.setScale(mathematics.Vector.create(0.35, 0.35, 1.0));
                    _this._generatorLights.setRotationVelocity(7.0);

                    _this._generatorTrails = new entities.SingleSprite(_this._camera, Textures.GeneratorTrails, Effects.SingleSprite);
                    _this._generatorTrails.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    _this._generatorTrails.setScale(mathematics.Vector.create(0.35, 0.35, 1.0));
                    _this._generatorTrails.setRotationVelocity(7.0);

                    _this._lightning1 = new entities.SingleSprite(_this._camera, Textures.Lightning1, Effects.SingleSprite);
                    _this._lightning1.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    _this._lightning1.setScale(mathematics.Vector.create(0.45, 0.45, 1.0));
                    _this._lightning1.setRotationVelocity(1.0);
                    _this._lightning1.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(0.5, 1.5, 0.0, 0.0));
                    _this._lightning1.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(0.0, 0.1, 0.0, 1.0));
                    _this._lightning1.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(0.0, 0.1, 1.0, 0.0));
                    _this._lightning1.AnimatedAlpha().StartRepeatKey = 0;
                    _this._lightning1.AnimatedAlpha().FinishRepeatKey = 2;

                    _this._lightning2 = new entities.SingleSprite(_this._camera, Textures.Lightning2, Effects.SingleSprite);
                    _this._lightning2.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    _this._lightning2.setScale(mathematics.Vector.create(0.45, 0.45, 1.0));
                    _this._lightning2.setRotationVelocity(1.0);
                    _this._lightning2.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(0.5, 1.5, 0.0, 0.0));
                    _this._lightning2.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(0.0, 0.1, 0.0, 1.0));
                    _this._lightning2.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(0.0, 0.1, 1.0, 0.0));
                    _this._lightning2.AnimatedAlpha().StartRepeatKey = 0;
                    _this._lightning2.AnimatedAlpha().FinishRepeatKey = 2;

                    _this._lightning3 = new entities.SingleSprite(_this._camera, Textures.Lightning3, Effects.SingleSprite);
                    _this._lightning3.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    _this._lightning3.setScale(mathematics.Vector.create(0.45, 0.45, 1.0));
                    _this._lightning3.setRotationVelocity(1.0);
                    _this._lightning3.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(0.5, 1.5, 0.0, 0.0));
                    _this._lightning3.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(0.0, 0.1, 0.0, 1.0));
                    _this._lightning3.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(0.0, 0.1, 1.0, 0.0));
                    _this._lightning3.AnimatedAlpha().StartRepeatKey = 0;
                    _this._lightning3.AnimatedAlpha().FinishRepeatKey = 2;

                    _this._lightning4 = new entities.SingleSprite(_this._camera, Textures.Lightning4, Effects.SingleSprite);
                    _this._lightning4.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    _this._lightning4.setScale(mathematics.Vector.create(0.45, 0.45, 1.0));
                    _this._lightning4.setRotationVelocity(1.0);
                    _this._lightning4.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(0.5, 1.5, 0.0, 0.0));
                    _this._lightning4.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(0.0, 0.1, 0.0, 1.0));
                    _this._lightning4.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(0.0, 0.1, 1.0, 0.0));
                    _this._lightning4.AnimatedAlpha().StartRepeatKey = 0;
                    _this._lightning4.AnimatedAlpha().FinishRepeatKey = 2;

                    _this._lightning5 = new entities.SingleSprite(_this._camera, Textures.Lightning5, Effects.SingleSprite);
                    _this._lightning5.setTranslate(mathematics.Vector.create(0.0, 0.0, 1.25));
                    _this._lightning5.setScale(mathematics.Vector.create(0.45, 0.45, 1.0));
                    _this._lightning5.setRotationVelocity(1.0);
                    _this._lightning5.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(0.5, 1.5, 0.0, 0.0));
                    _this._lightning5.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(0.0, 0.1, 0.0, 1.0));
                    _this._lightning5.AnimatedAlpha().TimeLine.add(new animation.TimeLineElement(0.0, 0.1, 1.0, 0.0));
                    _this._lightning5.AnimatedAlpha().StartRepeatKey = 0;
                    _this._lightning5.AnimatedAlpha().FinishRepeatKey = 2;
                });
            }, 1000);
        };
        Scene.prototype.onUpdate = function (args) {
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
        };

        Scene.prototype.onRender = function (args) {
            this._camera.setViewport(2.0, args.Viewport.SizeX, args.Viewport.SizeY);
            this._camera.apply();

            this._background.render();

            //
            gl.enable(gl.BLEND); //!!
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); //!!
            this._generatorRing.render();

            //
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE); //!!
            this._generatorLights.render();

            //
            this._generatorTrails.render();

            this._lightning1.render();
            this._lightning2.render();
            this._lightning3.render();
            this._lightning4.render();
            this._lightning5.render();
        };
        return Scene;
    })(entities.Scene);
    powerphone.Scene = Scene;
})(powerphone || (powerphone = {}));
//# sourceMappingURL=powerphone.js.map
