module asteroids {
    export class Scene extends entities.Scene
    {
        private _camera: entities.Camera;
        private  _loader: core.Loader;
        private _emitterBatch: entities.EmitterBatch;
        private _blackEmitterBatch: entities.EmitterBatch;
        private _cloudsEmitterBatch: entities.EmitterBatch;
        private _nebulaBatch: entities.NebulaBatch;
        private _skybox: entities.Skybox;
        private _asteroids: entities.AsteroidsBatch;
        private _asteroidsParts: entities.AsteroidsBatch;
        private _planarFogBatch: entities.PlanarFogBatch;
        private _meshBatchVertexBuffer: rendering.VertexBuffer;
        private _meshBatchIndexBuffer: rendering.IndexBuffer;
        private _meshBatchMatrices: mathematics.Matrix[];
        
        private _meshPartsBatchVertexBuffer: rendering.VertexBuffer;
        private _meshPartsBatchIndexBuffer: rendering.IndexBuffer;
        private _meshPartsBatchMatrices: mathematics.Matrix[];
        private _depthMap: rendering.TextureRenderTarget;

        private _scyboxCube: any[] = [null, null, null, null, null, null];

        constructor() {
            super();
            //this._loader = new core.Loader();
            this._camera = new entities.Camera();
        }

        onLoad(args: core.LoadArgs) {
            this._loader = args.Loader;
            setTimeout(() => {
                this._loader.addTextNode("fx/effect_skybox_vs.fx", (value: string) => { rendering.EffectSkybox.SkyboxVS = value });
                this._loader.addTextNode("fx/effect_skybox_ps.fx", (value: string) => { rendering.EffectSkybox.SkyboxPS = value });
                this._loader.addTextNode("fx/effect_particles_emitter_vs.fx", (value: string) => { rendering.EffectParticlesEmitter.ParticlesEmitterVS = value });
                this._loader.addTextNode("fx/effect_particles_emitter_ps.fx", (value: string) => { rendering.EffectParticlesEmitter.ParticlesEmitterPS = value });
                this._loader.addTextNode("fx/effect_particles_emitter_clouds_vs.fx", (value: string) => { rendering.EffectClouds.EffectCloudsVS = value });
                this._loader.addTextNode("fx/effect_particles_emitter_clouds_ps.fx", (value: string) => { rendering.EffectClouds.EffectCloudsPS = value });
                this._loader.addTextNode("fx/effect_nebula_vs.fx", (value: string) => { rendering.EffectNebula.NebulaVS = value });
                this._loader.addTextNode("fx/effect_nebula_ps.fx", (value: string) => { rendering.EffectNebula.NebulaPS = value });
                this._loader.addTextNode("fx/effect_volume_fog_vs.fx", (value: string) => { rendering.EffectVolumeFog.EffectVolumeFogVS = value });
                this._loader.addTextNode("fx/effect_volume_fog_ps.fx", (value: string) => { rendering.EffectVolumeFog.EffectVolumeFogPS = value });
                this._loader.addTextNode("fx/effect_volume_fog_postprocess_vs.fx", (value: string) => { rendering.EffectVolumeFogPostProcess.EffectPostProcessVS = value });
                this._loader.addTextNode("fx/effect_volume_fog_postprocess_ps.fx", (value: string) => { rendering.EffectVolumeFogPostProcess.EffectPostProcessPS = value });
                this._loader.addTextNode("fx/effect_depth_map_postprocess_vs.fx", (value: string) => { rendering.EffectDepthMapPostProcess.EffectPostProcessVS = value });
                this._loader.addTextNode("fx/effect_depth_map_postprocess_ps.fx", (value: string) => { rendering.EffectDepthMapPostProcess.EffectPostProcessPS = value });
                this._loader.addTextNode("fx/effect_planar_fog_vs.fx", (value: string) => { rendering.EffectPlanarFog.PlanarFogVS = value });
                this._loader.addTextNode("fx/effect_planar_fog_ps.fx", (value: string) => { rendering.EffectPlanarFog.PlanarFogPS = value });
                this._loader.addTextNode("fx/effect_depth_map_vs.fx", (value: string) => { rendering.EffectDepthMap.DepthMapVS = value });
                this._loader.addTextNode("fx/effect_depth_map_ps.fx", (value: string) => { rendering.EffectDepthMap.DepthMapPS = value });
                this._loader.addTextNode("fx/effect_volume_fog_depth_map_vs.fx", (value: string) => { rendering.EffectVolumeFogDepthMap.VolumeFogDepthMapVS = value });
                this._loader.addTextNode("fx/effect_volume_fog_depth_map_ps.fx", (value: string) => { rendering.EffectVolumeFogDepthMap.VolumeFogDepthMapPS = value });
                this._loader.addTextNode("fx/effect_solid_vs.fx", (value: string) => { rendering.EffectSolid.SolidVS = value });
                this._loader.addTextNode("fx/effect_solid_ps.fx", (value: string) => { rendering.EffectSolid.SolidPS = value });
                this._loader.addTextNode("fx/effect_diffuse_vs.fx", (value: string) => { rendering.EffectDiffuse.DiffuseVS = value });
                this._loader.addTextNode("fx/effect_diffuse_ps.fx", (value: string) => { rendering.EffectDiffuse.DiffusePS = value });
                this._loader.addTextNode("fx/effect_specular_bump_vs.fx", (value: string) => { rendering.EffectSpecularBump.SpecularBumpVS = value });
                this._loader.addTextNode("fx/effect_specular_bump_ps.fx", (value: string) => { rendering.EffectSpecularBump.SpecularBumpPS = value });

                //this._loader.addImageNode("content/asteroids/skybox2_xm.png", (value: any) => { entities.Textures.SkyboxXM = new rendering.Texture(value, false); });
                //this._loader.addImageNode("content/asteroids/skybox2_xp.png", (value: any) => { entities.Textures.SkyboxXP = new rendering.Texture(value, false); });
                //this._loader.addImageNode("content/asteroids/skybox2_ym.png", (value: any) => { entities.Textures.SkyboxYM = new rendering.Texture(value, false); });
                //this._loader.addImageNode("content/asteroids/skybox2_yp.png", (value: any) => { entities.Textures.SkyboxYP = new rendering.Texture(value, false); });
                //this._loader.addImageNode("content/asteroids/skybox2_zm.png", (value: any) => { entities.Textures.SkyboxZM = new rendering.Texture(value, false); });
                //this._loader.addImageNode("content/asteroids/skybox2_zp.png", (value: any) => { entities.Textures.SkyboxZP = new rendering.Texture(value, false); });

                this._loader.addImageNode("content/asteroids/Asteroid_180_spc.jpg", (value: any) => { entities.Textures.AsteroidsSpecular = this.addDisposeObject(new rendering.TextureImage(value, false)); });
                this._loader.addImageNode("content/asteroids/Asteroid_180.jpg", (value: any) => { entities.Textures.AsteroidsDiffuse = this.addDisposeObject(new rendering.TextureImage(value, false)); });
                this._loader.addImageNode("content/asteroids/Asteroid_180_nrm.png", (value: any) => { entities.Textures.AsteroidsNormal = this.addDisposeObject(new rendering.TextureImage(value, false)); });
                this._loader.addImageNode("content/asteroids/Asteroid_180_glw.jpg", (value: any) => { entities.Textures.AsteroidsGlow = this.addDisposeObject(new rendering.TextureImage(value, false)); });

                this._loader.addImageNode("content/asteroids/Asteroid_80_spc.jpg", (value: any) => { entities.Textures.AsteroidsSpecular1 = this.addDisposeObject(new rendering.TextureImage(value, false)); });
                this._loader.addImageNode("content/asteroids/Asteroid_80.jpg", (value: any) => { entities.Textures.AsteroidsDiffuse1 = this.addDisposeObject(new rendering.TextureImage(value, false)); });
                this._loader.addImageNode("content/asteroids/Asteroid_80_nrm.png", (value: any) => { entities.Textures.AsteroidsNormal1 = this.addDisposeObject(new rendering.TextureImage(value, false)); });
                this._loader.addImageNode("content/asteroids/Asteroid_80_glw.jpg", (value: any) => { entities.Textures.AsteroidsGlow1 = this.addDisposeObject(new rendering.TextureImage(value, false)); });
                
                this._loader.addImageNode("content/asteroids/skybox_hd_xp.jpg", (value: any) => {
                    this._scyboxCube[0] = value;
                    entities.Textures.SkyboxXP = this.addDisposeObject(new rendering.TextureImage(value, false));
                });

                this._loader.addImageNode("content/asteroids/skybox_hd_xm.jpg", (value: any) => {
                    this._scyboxCube[1] = value;
                    entities.Textures.SkyboxXM = this.addDisposeObject(new rendering.TextureImage(value, false));
                });

                this._loader.addImageNode("content/asteroids/skybox_hd_yp.jpg", (value: any) => {
                    this._scyboxCube[2] = value;
                    entities.Textures.SkyboxYP = this.addDisposeObject(new rendering.TextureImage(value, false));
                });

                this._loader.addImageNode("content/asteroids/skybox_hd_ym.jpg", (value: any) => {
                    this._scyboxCube[3] = value;
                    entities.Textures.SkyboxYM = this.addDisposeObject(new rendering.TextureImage(value, false));
                });

                this._loader.addImageNode("content/asteroids/skybox_hd_zp.jpg", (value: any) => {
                    this._scyboxCube[4] = value;
                    entities.Textures.SkyboxZP = this.addDisposeObject(new rendering.TextureImage(value, false));
                });

                this._loader.addImageNode("content/asteroids/skybox_hd_zm.jpg", (value: any) => {
                    this._scyboxCube[5] = value;
                    entities.Textures.SkyboxZM = this.addDisposeObject(new rendering.TextureImage(value, false));
                });

                this._loader.addImageNode("content/asteroids/particle.png", (value: any) => { this.addDisposeObject(entities.Textures.Particle = new rendering.TextureImage(value, false)); });
                this._loader.addImageNode("content/asteroids/cloud.png", (value: any) => { this.addDisposeObject(entities.Textures.Cloud = new rendering.TextureImage(value, false)); });

                this._loader.addImageNode("content/asteroids/nebula1.png", (value: any) => { this.addDisposeObject(entities.Textures.Nebula1 = new rendering.TextureImage(value, false)); });
                this._loader.addImageNode("content/asteroids/nebula2.png", (value: any) => { this.addDisposeObject(entities.Textures.Nebula2 = new rendering.TextureImage(value, false)); });
                                               
                this._loader.addUInt16ArrayNode("content/asteroids/asteroids_180.i", (value: Uint16Array) => {
                    this._meshBatchIndexBuffer = this.addDisposeObject(new rendering.IndexBuffer(value));
                });
                this._loader.addFloat32ArrayNode("content/asteroids/asteroids_180.t", (value: Float32Array) => {
                    this._meshBatchMatrices = mathematics.Matrix.createArray(value);
                });
                this._loader.addFloat32ArrayNode("content/asteroids/asteroids_180.v", (value: Float32Array) => {
                    this._meshBatchVertexBuffer = this.addDisposeObject(new rendering.VertexBuffer(new rendering.VertexSignatures([
                        rendering.Declarations.Position,
                        rendering.Declarations.Normal,
                        rendering.Declarations.Tangent,
                        rendering.Declarations.BiTangent,
                        rendering.Declarations.TexturePosition,
                        rendering.Declarations.TransformIndex]), value));
                });
                
                this._loader.addUInt16ArrayNode("content/asteroids/asteroids_80.i", (value: Uint16Array) => {
                    this._meshPartsBatchIndexBuffer = this.addDisposeObject(new rendering.IndexBuffer(value));
                });
                this._loader.addFloat32ArrayNode("content/asteroids/asteroids_80.t", (value: Float32Array) => {
                    this._meshPartsBatchMatrices = mathematics.Matrix.createArray(value);
                });
                
                this._loader.addFloat32ArrayNode("content/asteroids/asteroids_80.v", (value: Float32Array) => {
                    this._meshPartsBatchVertexBuffer = this.addDisposeObject(new rendering.VertexBuffer(new rendering.VertexSignatures([
                        rendering.Declarations.Position,
                        rendering.Declarations.Normal,
                        rendering.Declarations.Tangent,
                        rendering.Declarations.BiTangent,
                        rendering.Declarations.TexturePosition,
                        rendering.Declarations.TransformIndex]), value));
                });


                this._loader.startLoadintg(() => {
                    entities.Effects.Skybox = this.addDisposeObject(new rendering.EffectSkybox());
                    entities.Effects.PatriclesEmitter = this.addDisposeObject(new rendering.EffectParticlesEmitter());
                    entities.Effects.Nebula = this.addDisposeObject(new rendering.EffectNebula());
                    entities.Effects.VolumeFog = this.addDisposeObject(new rendering.EffectVolumeFog());
                    entities.Effects.VolumeFogPostProcess = this.addDisposeObject(new rendering.EffectVolumeFogPostProcess());
                    entities.Effects.DepthMap = this.addDisposeObject(new rendering.EffectDepthMap());
                    entities.Effects.DepthMapPostProcess = this.addDisposeObject(new rendering.EffectDepthMapPostProcess());
                    entities.Effects.VolumeFogDepthMap = this.addDisposeObject(new rendering.EffectVolumeFogDepthMap());
                    entities.Effects.Solid = this.addDisposeObject(new rendering.EffectSolid());
                    entities.Effects.Diffuse = this.addDisposeObject(new rendering.EffectDiffuse());
                    entities.Effects.SpecularBump = this.addDisposeObject(new rendering.EffectSpecularBump());
                    entities.Effects.Clouds = this.addDisposeObject(new rendering.EffectClouds());
                    entities.Effects.PlanarFog = this.addDisposeObject(new rendering.EffectPlanarFog());

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

                    this._emitterBatch = this.addDisposeObject(new entities.EmitterBatch(
                        particlesTexture,
                        [emitter, firesEmitter],
                        entities.ColorTheme.getDefault().AdditiveParticles,
                        0.4));

                    this._blackEmitterBatch = this.addDisposeObject(new entities.EmitterBatch(
                        particlesTexture,
                        [new entities.Emitter()],
                        entities.ColorTheme.getDefault().Particles,
                        0.4));

                    var cloudsEmitter = new entities.Emitter();
                    cloudsEmitter.InitClouds();
                    this._cloudsEmitterBatch = this.addDisposeObject(new entities.EmitterBatch(
                        cloudsTexture,
                        [cloudsEmitter],
                        entities.ColorTheme.getDefault().Clouds,
                        1.0));

                    this._nebulaBatch = this.addDisposeObject(new entities.NebulaBatch([
                        new entities.Nebula(mathematics.Vector.create(-400, 0, 0), 100, false),
                        new entities.Nebula(mathematics.Vector.create(400, 0, 0), 100, true)],
                        entities.Textures.Nebula1, entities.Textures.Nebula2));
                    this._skybox = this.addDisposeObject(new entities.Skybox());

                    this._asteroids = new entities.AsteroidsBatch(this._meshBatchVertexBuffer, this._meshBatchIndexBuffer, this._meshBatchMatrices,
                        asteroidsSpecular,
                        asteroidsDiffuse,
                        asteroidsNormal,
                        asteroidsGlow,
                        entities.Textures.SkyboxCubemap
                        );
                    
                    this._asteroidsParts = new entities.AsteroidsBatch(this._meshPartsBatchVertexBuffer, this._meshPartsBatchIndexBuffer, this._meshPartsBatchMatrices,
                        asteroidsSpecular1,
                        asteroidsDiffuse1,
                        asteroidsNormal1,
                        asteroidsGlow1,
                        entities.Textures.SkyboxCubemap
                        );   

                    this._planarFogBatch = new entities.PlanarFogBatch();

                    this._depthMap = new rendering.TextureRenderTarget(1024, 512, false);
                });
            }, 1000);
        }

        onUpdate(args: core.UpdateArgs): void {
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
        }

        _postProcessVertices: rendering.VertexBuffer;
        _postProcessIndices: rendering.IndexBuffer;
        _postProcessRenderJoint: rendering.RenderJoint;

        debugRenderTarget(renderTarget: rendering.TextureRenderTarget): void {
            if (!this._postProcessVertices) {
                this._postProcessVertices = new rendering.VertexBuffer(new rendering.VertexSignatures([rendering.Declarations.Position, rendering.Declarations.TexturePosition]), new Float32Array([
                    -1.0, -1.0, 0, 0, 0,
                    -1.0, -0.7, 0, 0, 1,
                    -0.7, -0.7, 0, 1, 1,
                    -0.7, -1.0, 0, 1, 0,
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
        }


        onRender(args: rendering.RenderArgs): void {
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
            
        }


        createTouchController(): entities.TouchController {
            return new entities.TouchController(this._camera);
        }

        private renderAsteroids(): void {
            gl.depthMask(true);
            gl.enable(gl.DEPTH_TEST);
            gl.disable(gl.BLEND);
            this._asteroids.renderSpecularBump(this._camera);
            this._asteroidsParts.renderSpecularBump(this._camera);

            //this._asteroids.renderDiffuse(this._camera);
            //this._asteroidsParts.renderDiffuse(this._camera);
        }

        private renderAsteroidsToDepthMap(args: rendering.RenderArgs): void {
            this._depthMap.setAsRenderTarget();
            gl.depthMask(true);
            gl.enable(gl.DEPTH_TEST);
            gl.disable(gl.BLEND);
            this._asteroids.renderDepthMap(this._camera);
            this._asteroidsParts.renderDepthMap(this._camera);

            this._depthMap.setDefaultRenderTarget(args.Viewport.SizeX, args.Viewport.SizeY);
        }

        private renderVolumeFog(): void {
            gl.enable(gl.CULL_FACE);
            gl.cullFace(gl.BACK);
            gl.frontFace(gl.CW);

            //gl.depthMask(false);
            //gl.disable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            //this._volumeFog.render(this._camera, this._volumeFogDepthMap);
            gl.disable(gl.CULL_FACE);
        }

        private renderSkyBox(): void {
            gl.depthMask(false);
            gl.disable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
            this._skybox.render(this._camera);
        }

        private renderEmitters(): void {
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
        }

        private renderNebula(): void {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
            gl.depthMask(false);
            gl.disable(gl.DEPTH_TEST);
            this._nebulaBatch.render(this._camera);
        }
    }
}