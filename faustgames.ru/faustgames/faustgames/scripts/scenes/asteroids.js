var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var asteroids;
(function (asteroids) {
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene() {
            _super.call(this);
            this._scyboxCube = [null, null, null, null, null, null];

            //this._loader = new core.Loader();
            this._camera = new entities.Camera();
        }
        Scene.prototype.onLoad = function (args) {
            var _this = this;
            this._loader = args.Loader;
            setTimeout(function () {
                _this._loader.addTextNode("fx/effect_skybox_vs.fx", function (value) {
                    rendering.EffectSkybox.SkyboxVS = value;
                });
                _this._loader.addTextNode("fx/effect_skybox_ps.fx", function (value) {
                    rendering.EffectSkybox.SkyboxPS = value;
                });
                _this._loader.addTextNode("fx/effect_particles_emitter_vs.fx", function (value) {
                    rendering.EffectParticlesEmitter.ParticlesEmitterVS = value;
                });
                _this._loader.addTextNode("fx/effect_particles_emitter_ps.fx", function (value) {
                    rendering.EffectParticlesEmitter.ParticlesEmitterPS = value;
                });
                _this._loader.addTextNode("fx/effect_particles_emitter_clouds_vs.fx", function (value) {
                    rendering.EffectClouds.EffectCloudsVS = value;
                });
                _this._loader.addTextNode("fx/effect_particles_emitter_clouds_ps.fx", function (value) {
                    rendering.EffectClouds.EffectCloudsPS = value;
                });
                _this._loader.addTextNode("fx/effect_nebula_vs.fx", function (value) {
                    rendering.EffectNebula.NebulaVS = value;
                });
                _this._loader.addTextNode("fx/effect_nebula_ps.fx", function (value) {
                    rendering.EffectNebula.NebulaPS = value;
                });
                _this._loader.addTextNode("fx/effect_volume_fog_vs.fx", function (value) {
                    rendering.EffectVolumeFog.EffectVolumeFogVS = value;
                });
                _this._loader.addTextNode("fx/effect_volume_fog_ps.fx", function (value) {
                    rendering.EffectVolumeFog.EffectVolumeFogPS = value;
                });
                _this._loader.addTextNode("fx/effect_volume_fog_postprocess_vs.fx", function (value) {
                    rendering.EffectVolumeFogPostProcess.EffectPostProcessVS = value;
                });
                _this._loader.addTextNode("fx/effect_volume_fog_postprocess_ps.fx", function (value) {
                    rendering.EffectVolumeFogPostProcess.EffectPostProcessPS = value;
                });
                _this._loader.addTextNode("fx/effect_depth_map_postprocess_vs.fx", function (value) {
                    rendering.EffectDepthMapPostProcess.EffectPostProcessVS = value;
                });
                _this._loader.addTextNode("fx/effect_depth_map_postprocess_ps.fx", function (value) {
                    rendering.EffectDepthMapPostProcess.EffectPostProcessPS = value;
                });
                _this._loader.addTextNode("fx/effect_planar_fog_vs.fx", function (value) {
                    rendering.EffectPlanarFog.PlanarFogVS = value;
                });
                _this._loader.addTextNode("fx/effect_planar_fog_ps.fx", function (value) {
                    rendering.EffectPlanarFog.PlanarFogPS = value;
                });
                _this._loader.addTextNode("fx/effect_depth_map_vs.fx", function (value) {
                    rendering.EffectDepthMap.DepthMapVS = value;
                });
                _this._loader.addTextNode("fx/effect_depth_map_ps.fx", function (value) {
                    rendering.EffectDepthMap.DepthMapPS = value;
                });
                _this._loader.addTextNode("fx/effect_volume_fog_depth_map_vs.fx", function (value) {
                    rendering.EffectVolumeFogDepthMap.VolumeFogDepthMapVS = value;
                });
                _this._loader.addTextNode("fx/effect_volume_fog_depth_map_ps.fx", function (value) {
                    rendering.EffectVolumeFogDepthMap.VolumeFogDepthMapPS = value;
                });
                _this._loader.addTextNode("fx/effect_solid_vs.fx", function (value) {
                    rendering.EffectSolid.SolidVS = value;
                });
                _this._loader.addTextNode("fx/effect_solid_ps.fx", function (value) {
                    rendering.EffectSolid.SolidPS = value;
                });
                _this._loader.addTextNode("fx/effect_diffuse_vs.fx", function (value) {
                    rendering.EffectDiffuse.DiffuseVS = value;
                });
                _this._loader.addTextNode("fx/effect_diffuse_ps.fx", function (value) {
                    rendering.EffectDiffuse.DiffusePS = value;
                });
                _this._loader.addTextNode("fx/effect_specular_bump_vs.fx", function (value) {
                    rendering.EffectSpecularBump.SpecularBumpVS = value;
                });
                _this._loader.addTextNode("fx/effect_specular_bump_ps.fx", function (value) {
                    rendering.EffectSpecularBump.SpecularBumpPS = value;
                });

                //this._loader.addImageNode("content/asteroids/skybox2_xm.png", (value: any) => { entities.Textures.SkyboxXM = new rendering.Texture(value, false); });
                //this._loader.addImageNode("content/asteroids/skybox2_xp.png", (value: any) => { entities.Textures.SkyboxXP = new rendering.Texture(value, false); });
                //this._loader.addImageNode("content/asteroids/skybox2_ym.png", (value: any) => { entities.Textures.SkyboxYM = new rendering.Texture(value, false); });
                //this._loader.addImageNode("content/asteroids/skybox2_yp.png", (value: any) => { entities.Textures.SkyboxYP = new rendering.Texture(value, false); });
                //this._loader.addImageNode("content/asteroids/skybox2_zm.png", (value: any) => { entities.Textures.SkyboxZM = new rendering.Texture(value, false); });
                //this._loader.addImageNode("content/asteroids/skybox2_zp.png", (value: any) => { entities.Textures.SkyboxZP = new rendering.Texture(value, false); });
                _this._loader.addImageNode("content/asteroids/Asteroid_180_spc.jpg", function (value) {
                    entities.Textures.AsteroidsSpecular = _this.addDisposeObject(new rendering.TextureImage(value, false));
                });
                _this._loader.addImageNode("content/asteroids/Asteroid_180.jpg", function (value) {
                    entities.Textures.AsteroidsDiffuse = _this.addDisposeObject(new rendering.TextureImage(value, false));
                });
                _this._loader.addImageNode("content/asteroids/Asteroid_180_nrm.png", function (value) {
                    entities.Textures.AsteroidsNormal = _this.addDisposeObject(new rendering.TextureImage(value, false));
                });
                _this._loader.addImageNode("content/asteroids/Asteroid_180_glw.jpg", function (value) {
                    entities.Textures.AsteroidsGlow = _this.addDisposeObject(new rendering.TextureImage(value, false));
                });

                _this._loader.addImageNode("content/asteroids/Asteroid_80_spc.jpg", function (value) {
                    entities.Textures.AsteroidsSpecular1 = _this.addDisposeObject(new rendering.TextureImage(value, false));
                });
                _this._loader.addImageNode("content/asteroids/Asteroid_80.jpg", function (value) {
                    entities.Textures.AsteroidsDiffuse1 = _this.addDisposeObject(new rendering.TextureImage(value, false));
                });
                _this._loader.addImageNode("content/asteroids/Asteroid_80_nrm.png", function (value) {
                    entities.Textures.AsteroidsNormal1 = _this.addDisposeObject(new rendering.TextureImage(value, false));
                });
                _this._loader.addImageNode("content/asteroids/Asteroid_80_glw.jpg", function (value) {
                    entities.Textures.AsteroidsGlow1 = _this.addDisposeObject(new rendering.TextureImage(value, false));
                });

                _this._loader.addImageNode("content/asteroids/skybox_hd_xp.jpg", function (value) {
                    _this._scyboxCube[0] = value;
                    entities.Textures.SkyboxXP = _this.addDisposeObject(new rendering.TextureImage(value, false));
                });

                _this._loader.addImageNode("content/asteroids/skybox_hd_xm.jpg", function (value) {
                    _this._scyboxCube[1] = value;
                    entities.Textures.SkyboxXM = _this.addDisposeObject(new rendering.TextureImage(value, false));
                });

                _this._loader.addImageNode("content/asteroids/skybox_hd_yp.jpg", function (value) {
                    _this._scyboxCube[2] = value;
                    entities.Textures.SkyboxYP = _this.addDisposeObject(new rendering.TextureImage(value, false));
                });

                _this._loader.addImageNode("content/asteroids/skybox_hd_ym.jpg", function (value) {
                    _this._scyboxCube[3] = value;
                    entities.Textures.SkyboxYM = _this.addDisposeObject(new rendering.TextureImage(value, false));
                });

                _this._loader.addImageNode("content/asteroids/skybox_hd_zp.jpg", function (value) {
                    _this._scyboxCube[4] = value;
                    entities.Textures.SkyboxZP = _this.addDisposeObject(new rendering.TextureImage(value, false));
                });

                _this._loader.addImageNode("content/asteroids/skybox_hd_zm.jpg", function (value) {
                    _this._scyboxCube[5] = value;
                    entities.Textures.SkyboxZM = _this.addDisposeObject(new rendering.TextureImage(value, false));
                });

                _this._loader.addImageNode("content/asteroids/particle.png", function (value) {
                    _this.addDisposeObject(entities.Textures.Particle = new rendering.TextureImage(value, false));
                });
                _this._loader.addImageNode("content/asteroids/cloud.png", function (value) {
                    _this.addDisposeObject(entities.Textures.Cloud = new rendering.TextureImage(value, false));
                });

                _this._loader.addImageNode("content/asteroids/nebula1.png", function (value) {
                    _this.addDisposeObject(entities.Textures.Nebula1 = new rendering.TextureImage(value, false));
                });
                _this._loader.addImageNode("content/asteroids/nebula2.png", function (value) {
                    _this.addDisposeObject(entities.Textures.Nebula2 = new rendering.TextureImage(value, false));
                });

                _this._loader.addUInt16ArrayNode("content/asteroids/asteroids_180.i", function (value) {
                    _this._meshBatchIndexBuffer = _this.addDisposeObject(new rendering.IndexBuffer(value));
                });
                _this._loader.addFloat32ArrayNode("content/asteroids/asteroids_180.t", function (value) {
                    _this._meshBatchMatrices = mathematics.Matrix.createArray(value);
                });
                _this._loader.addFloat32ArrayNode("content/asteroids/asteroids_180.v", function (value) {
                    _this._meshBatchVertexBuffer = _this.addDisposeObject(new rendering.VertexBuffer(new rendering.VertexSignatures([
                        rendering.Declarations.Position,
                        rendering.Declarations.Normal,
                        rendering.Declarations.Tangent,
                        rendering.Declarations.BiTangent,
                        rendering.Declarations.TexturePosition,
                        rendering.Declarations.TransformIndex]), value));
                });

                _this._loader.addUInt16ArrayNode("content/asteroids/asteroids_80.i", function (value) {
                    _this._meshPartsBatchIndexBuffer = _this.addDisposeObject(new rendering.IndexBuffer(value));
                });
                _this._loader.addFloat32ArrayNode("content/asteroids/asteroids_80.t", function (value) {
                    _this._meshPartsBatchMatrices = mathematics.Matrix.createArray(value);
                });

                _this._loader.addFloat32ArrayNode("content/asteroids/asteroids_80.v", function (value) {
                    _this._meshPartsBatchVertexBuffer = _this.addDisposeObject(new rendering.VertexBuffer(new rendering.VertexSignatures([
                        rendering.Declarations.Position,
                        rendering.Declarations.Normal,
                        rendering.Declarations.Tangent,
                        rendering.Declarations.BiTangent,
                        rendering.Declarations.TexturePosition,
                        rendering.Declarations.TransformIndex]), value));
                });

                _this._loader.startLoadintg(function () {
                    entities.Effects.Skybox = _this.addDisposeObject(new rendering.EffectSkybox());
                    entities.Effects.PatriclesEmitter = _this.addDisposeObject(new rendering.EffectParticlesEmitter());
                    entities.Effects.Nebula = _this.addDisposeObject(new rendering.EffectNebula());
                    entities.Effects.VolumeFog = _this.addDisposeObject(new rendering.EffectVolumeFog());
                    entities.Effects.VolumeFogPostProcess = _this.addDisposeObject(new rendering.EffectVolumeFogPostProcess());
                    entities.Effects.DepthMap = _this.addDisposeObject(new rendering.EffectDepthMap());
                    entities.Effects.DepthMapPostProcess = _this.addDisposeObject(new rendering.EffectDepthMapPostProcess());
                    entities.Effects.VolumeFogDepthMap = _this.addDisposeObject(new rendering.EffectVolumeFogDepthMap());
                    entities.Effects.Solid = _this.addDisposeObject(new rendering.EffectSolid());
                    entities.Effects.Diffuse = _this.addDisposeObject(new rendering.EffectDiffuse());
                    entities.Effects.SpecularBump = _this.addDisposeObject(new rendering.EffectSpecularBump());
                    entities.Effects.Clouds = _this.addDisposeObject(new rendering.EffectClouds());
                    entities.Effects.PlanarFog = _this.addDisposeObject(new rendering.EffectPlanarFog());

                    //entities.Textures.SkyboxCubemap = new rendering.TextureCubemap(this._scyboxCube);
                    var asteroidsSpecular = entities.Textures.AsteroidsSpecular;
                    var asteroidsDiffuse = entities.Textures.AsteroidsDiffuse;
                    var asteroidsNormal = entities.Textures.AsteroidsNormal;
                    var asteroidsGlow = entities.Textures.AsteroidsGlow;

                    var asteroidsSpecular1 = entities.Textures.AsteroidsSpecular1;
                    var asteroidsDiffuse1 = entities.Textures.AsteroidsDiffuse1;
                    var asteroidsNormal1 = entities.Textures.AsteroidsNormal1;
                    var asteroidsGlow1 = entities.Textures.AsteroidsGlow1;

                    var particlesTexture = entities.Textures.Particle;
                    var cloudsTexture = entities.Textures.Cloud;
                    var firesEmitter = new entities.Emitter();
                    var emitter = new entities.Emitter();
                    firesEmitter.InitFires();

                    _this._emitterBatch = _this.addDisposeObject(new entities.EmitterBatch(particlesTexture, [emitter, firesEmitter], entities.ColorTheme.getDefault().AdditiveParticles, 0.4));

                    _this._blackEmitterBatch = _this.addDisposeObject(new entities.EmitterBatch(particlesTexture, [new entities.Emitter()], entities.ColorTheme.getDefault().Particles, 0.4));

                    var cloudsEmitter = new entities.Emitter();
                    cloudsEmitter.InitClouds();
                    _this._cloudsEmitterBatch = _this.addDisposeObject(new entities.EmitterBatch(cloudsTexture, [cloudsEmitter], entities.ColorTheme.getDefault().Clouds, 1.0));

                    _this._nebulaBatch = _this.addDisposeObject(new entities.NebulaBatch([
                        new entities.Nebula(mathematics.Vector.create(-400, 0, 0), 100, false),
                        new entities.Nebula(mathematics.Vector.create(400, 0, 0), 100, true)], entities.Textures.Nebula1, entities.Textures.Nebula2));
                    _this._skybox = _this.addDisposeObject(new entities.Skybox());

                    _this._asteroids = new entities.AsteroidsBatch(_this._meshBatchVertexBuffer, _this._meshBatchIndexBuffer, _this._meshBatchMatrices, asteroidsSpecular, asteroidsDiffuse, asteroidsNormal, asteroidsGlow, entities.Textures.SkyboxCubemap);

                    _this._asteroidsParts = new entities.AsteroidsBatch(_this._meshPartsBatchVertexBuffer, _this._meshPartsBatchIndexBuffer, _this._meshPartsBatchMatrices, asteroidsSpecular1, asteroidsDiffuse1, asteroidsNormal1, asteroidsGlow1, entities.Textures.SkyboxCubemap);

                    _this._planarFogBatch = new entities.PlanarFogBatch();

                    _this._depthMap = new rendering.TextureRenderTarget(1024, 512, false);
                });
            }, 1000);
        };

        Scene.prototype.onUpdate = function (args) {
            var time = args.Delta;
            this._camera.update(args);
            this._emitterBatch.update(time);
            this._blackEmitterBatch.update(time);
            this._cloudsEmitterBatch.update(time);
            this._nebulaBatch.update(time);
            this._asteroids.update(time);
            this._asteroidsParts.update(time);
            //this.renderAsteroidsToDepthMap();
            //this.renderVolumeFogDepthBackMap();
            //this.renderVolumeFogDepthFrontMap();
            /*
            this.renderSkyBox();
            //this.renderNebula();
            gl.clear(gl.DEPTH_BUFFER_BIT);
            this.renderAsteroids();
            //this.renderEmitters();
            */
            //gl.depthMask(false);
            //gl.disable(gl.DEPTH_TEST);
            //gl.enable(gl.BLEND);
            //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            //this._volumeFogPostProcess.render(this._volumeFogDepthFrontMap, this._volumeFogDepthBackMap);
            //this._depthMapPostProcess.render(this._volumeFogDepthFrontMap);
        };

        Scene.prototype.debugRenderTarget = function (renderTarget) {
            if (!this._postProcessVertices) {
                this._postProcessVertices = new rendering.VertexBuffer(new rendering.VertexSignatures([rendering.Declarations.Position, rendering.Declarations.TexturePosition]), new Float32Array([
                    -1.0, -1.0, 0, 0, 0,
                    -1.0, -0.7, 0, 0, 1,
                    -0.7, -0.7, 0, 1, 1,
                    -0.7, -1.0, 0, 1, 0
                ]));
            }
            if (!this._postProcessIndices) {
                this._postProcessIndices = new rendering.IndexBuffer(new Uint16Array([
                    0, 1, 2,
                    0, 2, 3
                ]));
            }
            if (!this._postProcessRenderJoint) {
                this._postProcessRenderJoint = new rendering.RenderJoint(entities.Effects.DepthMapPostProcess, this._postProcessVertices);
            }
            entities.Effects.DepthMapPostProcess.Texture.setValue(renderTarget);
            this._postProcessRenderJoint.render(this._postProcessIndices);
        };

        Scene.prototype.onRender = function (args) {
            //gl.enable(gl.TEXTURE_CUBE_MAP);
            //rendering.Errors.check("gl.enable");
            //gl.enable(gl.TEXTURE_CUBE_MAP_EXT);
            //rendering.Errors.check("gl.enable");
            this._camera.setViewport(1.5, args.Viewport.SizeX, args.Viewport.SizeY);
            this._camera.apply();

            this.renderAsteroidsToDepthMap(args);

            this.renderSkyBox();

            //this.renderNebula();
            gl.clear(gl.DEPTH_BUFFER_BIT);
            this.renderAsteroids();
            this.renderEmitters();
            //gl.clear(gl.DEPTH_BUFFER_BIT);
            //this._planarFogBatch.render(entities.Textures.Cloud, this._depthMap);
            //gl.clear(gl.DEPTH_BUFFER_BIT);
            //this.debugRenderTarget(this._depthMap);
        };

        Scene.prototype.createTouchController = function () {
            return new entities.TouchController(this._camera);
        };

        Scene.prototype.renderAsteroids = function () {
            gl.depthMask(true);
            gl.enable(gl.DEPTH_TEST);
            gl.disable(gl.BLEND);
            this._asteroids.renderSpecularBump(this._camera);
            this._asteroidsParts.renderSpecularBump(this._camera);
            //this._asteroids.renderDiffuse(this._camera);
            //this._asteroidsParts.renderDiffuse(this._camera);
        };

        Scene.prototype.renderAsteroidsToDepthMap = function (args) {
            this._depthMap.setAsRenderTarget();
            gl.depthMask(true);
            gl.enable(gl.DEPTH_TEST);
            gl.disable(gl.BLEND);
            this._asteroids.renderDepthMap(this._camera);
            this._asteroidsParts.renderDepthMap(this._camera);

            this._depthMap.setDefaultRenderTarget(args.Viewport.SizeX, args.Viewport.SizeY);
        };

        Scene.prototype.renderVolumeFog = function () {
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.BACK);
            gl.frontFace(gl.CW);

            //gl.depthMask(false);
            //gl.disable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            //this._volumeFog.render(this._camera, this._volumeFogDepthMap);
            gl.disable(gl.CULL_FACE);
        };

        Scene.prototype.renderSkyBox = function () {
            gl.depthMask(false);
            gl.disable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
            this._skybox.render(this._camera);
        };

        Scene.prototype.renderEmitters = function () {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
            gl.depthMask(false);
            gl.enable(gl.DEPTH_TEST);
            this._emitterBatch._color = entities.ColorTheme.getDefault().AdditiveParticles;
            this._emitterBatch.render(this._camera);

            //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            this._cloudsEmitterBatch._color = entities.ColorTheme.getDefault().Clouds;
            this._cloudsEmitterBatch.render(this._camera);

            //this._cloudsEmitterBatch.renderClouds(this._camera, this._depthMap);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.depthMask(false);
            gl.enable(gl.DEPTH_TEST);
            this._blackEmitterBatch._color = entities.ColorTheme.getDefault().Particles;
            this._blackEmitterBatch.render(this._camera);
        };

        Scene.prototype.renderNebula = function () {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
            gl.depthMask(false);
            gl.disable(gl.DEPTH_TEST);
            this._nebulaBatch.render(this._camera);
        };
        return Scene;
    })(entities.Scene);
    asteroids.Scene = Scene;
})(asteroids || (asteroids = {}));
//# sourceMappingURL=asteroids.js.map
