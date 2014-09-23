/// <reference path="core.ts"/>
/// <reference path="math.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var gl;

var rendering;
(function (rendering) {
    var RenderArgs = (function () {
        function RenderArgs() {
            this.Viewport = new RenderViewport();
        }
        return RenderArgs;
    })();
    rendering.RenderArgs = RenderArgs;

    var RenderViewport = (function () {
        function RenderViewport() {
        }
        return RenderViewport;
    })();
    rendering.RenderViewport = RenderViewport;

    var Uniforms = (function () {
        function Uniforms() {
        }
        Uniforms.ProjectionMatrix = "u_ProjectionMatrix";
        Uniforms.ViewMatrix = "u_ViewMatrix";
        Uniforms.NormalMatrix = "u_NormalMatrix";
        Uniforms.ModelMatrix = "u_ModelMatrix";
        Uniforms.ModelMatrices = "u_ModelMatrices";
        Uniforms.NormalMatrices = "u_NormalMatrices";
        Uniforms.Texture = "u_Texture";
        Uniforms.DepthMap = "u_DepthMap";
        Uniforms.SpecularMap = "u_SpecularMap";
        Uniforms.DiffuseMap = "u_DiffuseMap";
        Uniforms.NormalMap = "u_NormalMap";
        Uniforms.GlowMap = "u_GlowMap";
        Uniforms.GlowLevel = "u_GlowLevel";
        Uniforms.SpecularLight = "u_SpecularLight";
        Uniforms.DiffuseLight = "u_DiffuseLight";
        Uniforms.AmbientLight = "u_AmbientLight";
        Uniforms.GlowColor = "u_GlowColor";
        Uniforms.EnvironmentCubeMap = "u_EnvironmentCubeMap";
        Uniforms.EyePosition = "u_EyePosition";
        Uniforms.Texture1 = "u_Texture1";
        Uniforms.Color = "u_Color";
        Uniforms.Color1 = "u_Color1";
        Uniforms.Time = "u_Time";
        Uniforms.ZNear = "u_ZNear";
        Uniforms.ZFar = "u_ZFar";
        Uniforms.Light = "u_Light";
        Uniforms.Eye = "u_Eye";
        return Uniforms;
    })();

    var Texture = (function () {
        function Texture() {
        }
        Texture.prototype.dispose = function () {
            if (this.TextureHandler) {
                gl.deleteTexture(this.TextureHandler);
                Errors.check("gl.deleteTexture");
            }
            this.TextureHandler = null;
        };
        return Texture;
    })();
    rendering.Texture = Texture;

    var TextureImage = (function (_super) {
        __extends(TextureImage, _super);
        function TextureImage(image, wrap) {
            _super.call(this);
            this.TextureHandler = gl.createTexture();
            Errors.check("gl.createTexture");
            gl.bindTexture(gl.TEXTURE_2D, this.TextureHandler);
            Errors.check("gl.bindTexture");
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            Errors.check("gl.texImage2D");
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            Errors.check("gl.texParameteri");
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            Errors.check("gl.texParameteri");

            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            //Errors.check("gl.texParameteri");
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            //Errors.check("gl.texParameteri");
            if (wrap) {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                Errors.check("gl.texParameteri");
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                Errors.check("gl.texParameteri");
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                Errors.check("gl.texParameteri");
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                Errors.check("gl.texParameteri");
            }

            var ext = (gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('MOZ_EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic'));
            if (ext) {
                var max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
            }

            gl.generateMipmap(gl.TEXTURE_2D);
            Errors.check("gl.generateMipmap");
            gl.bindTexture(gl.TEXTURE_2D, null);
            Errors.check("gl.bindTexture");
        }
        return TextureImage;
    })(Texture);
    rendering.TextureImage = TextureImage;

    var TextureCubemap = (function (_super) {
        __extends(TextureCubemap, _super);
        function TextureCubemap(image) {
            _super.call(this);
            this.TextureHandler = gl.createTexture();
            Errors.check("gl.createTexture");
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.TextureHandler);
            Errors.check("gl.bindTexture");
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            Errors.check("gl.texParameteri");
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            Errors.check("gl.texParameteri");
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            Errors.check("gl.texParameteri");
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            Errors.check("gl.texParameteri");

            var ext = (gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('MOZ_EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic'));
            if (ext) {
                var max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                gl.texParameterf(gl.TEXTURE_CUBE_MAP, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
            }

            for (var i = 0; i < image.length; i++) {
                var face = gl.TEXTURE_CUBE_MAP_POSITIVE_X + i;
                gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image[i]);
                Errors.check("gl.texImage2D");
            }

            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            Errors.check("gl.generateMipmap");
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
            Errors.check("gl.bindTexture");
        }
        return TextureCubemap;
    })(Texture);
    rendering.TextureCubemap = TextureCubemap;

    var TextureRenderTarget = (function (_super) {
        __extends(TextureRenderTarget, _super);
        function TextureRenderTarget(width, height, filter) {
            _super.call(this);
            this._filter = filter;
            this._width = width;
            this._height = height;
            this.load();
        }
        TextureRenderTarget.prototype.resize = function (width, height) {
            this._width = width;
            this._height = height;
        };
        TextureRenderTarget.prototype.load = function () {
            this._frameBuffer = gl.createFramebuffer();
            Errors.check("gl.createFramebuffer");
            this._depthBuffer = gl.createRenderbuffer();
            Errors.check("gl.createRenderbuffer");

            this.TextureHandler = gl.createTexture();
            Errors.check("gl.createTexture");
            gl.bindTexture(gl.TEXTURE_2D, this.TextureHandler);
            Errors.check("gl.bindTexture");
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._filter ? gl.LINEAR : gl.NEAREST);
            Errors.check("gl.texParameteri");
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._filter ? gl.LINEAR : gl.NEAREST);
            Errors.check("gl.texParameteri");
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            Errors.check("gl.texParameteri");
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            Errors.check("gl.texParameteri");

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._width, this._height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            Errors.check("gl.texImage2D");

            gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
            Errors.check("gl.bindFramebuffer");
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.TextureHandler, 0);
            Errors.check("gl.framebufferTexture2D");

            gl.bindRenderbuffer(gl.RENDERBUFFER, this._depthBuffer);
            Errors.check("gl.bindRenderbuffer");
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this._width, this._height);
            Errors.check("gl.renderbufferStorage");

            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._depthBuffer);
            Errors.check("gl.framebufferRenderbuffer");

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            Errors.check("gl.bindFramebuffer");
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            Errors.check("gl.bindRenderbuffer");
            gl.bindTexture(gl.TEXTURE_2D, null);
            Errors.check("gl.bindTexture");
        };

        TextureRenderTarget.prototype.setAsRenderTarget = function () {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
            Errors.check("gl.bindFramebuffer");
            var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
            Errors.check("gl.checkFramebufferStatus");
            if (status != gl.FRAMEBUFFER_COMPLETE)
                return;
            gl.viewport(0, 0, this._width, this._height);
            Errors.check("gl.viewport");
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
            Errors.check("gl.clear");
        };

        TextureRenderTarget.prototype.setDefaultRenderTarget = function (width, height) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            Errors.check("gl.bindFramebuffer");
            gl.viewport(0, 0, width, height);
            Errors.check("gl.viewport");
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
            Errors.check("gl.clear");
        };

        TextureRenderTarget.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            if (this._frameBuffer) {
                gl.deleteFramebuffer(this._frameBuffer);
                Errors.check("gl.deleteFramebuffer");
            }
            if (this._depthBuffer) {
                gl.deleteRenderbuffer(this._depthBuffer);
                Errors.check("gl.deleteRenderbuffer");
            }
            this._frameBuffer = null;
            this._depthBuffer = null;
        };
        return TextureRenderTarget;
    })(Texture);
    rendering.TextureRenderTarget = TextureRenderTarget;

    var ExceptionRendering = (function (_super) {
        __extends(ExceptionRendering, _super);
        function ExceptionRendering(code, operation) {
            _super.call(this);
            this.Code = code;
            this.Operation = operation;
        }
        return ExceptionRendering;
    })(core.Exception);
    rendering.ExceptionRendering = ExceptionRendering;

    var Errors = (function () {
        function Errors() {
        }
        Errors.check = function (operation) {
            var error;
            while ((error = gl.getError()) != gl.NO_ERROR) {
                throw new ExceptionRendering(error, operation);
            }
        };
        return Errors;
    })();
    rendering.Errors = Errors;

    var EffectParameter = (function () {
        function EffectParameter(name) {
            this._name = name;
        }
        EffectParameter.prototype.setName = function (value) {
            this._name = value;
        };
        EffectParameter.prototype.getName = function () {
            return this._name;
        };
        EffectParameter.prototype.create = function (effect) {
            var programHandler = effect._program;
            this._parameterHandler = gl.getUniformLocation(programHandler, this._name);
            Errors.check("gl.getUniformLocation");
        };
        EffectParameter.prototype.apply = function () {
            throw new core.ExceptionAbstractMethodCall();
        };
        return EffectParameter;
    })();
    rendering.EffectParameter = EffectParameter;

    var EffectParameterFloat = (function (_super) {
        __extends(EffectParameterFloat, _super);
        function EffectParameterFloat(name) {
            _super.call(this, name);
            this._value = 0.0;
        }
        EffectParameterFloat.prototype.setValue = function (value) {
            this._value = value;
        };
        EffectParameterFloat.prototype.getValue = function () {
            return this._value;
        };
        EffectParameterFloat.prototype.apply = function () {
            gl.uniform1f(this._parameterHandler, this._value);
            Errors.check("gl.Uniform1f");
        };
        return EffectParameterFloat;
    })(EffectParameter);
    rendering.EffectParameterFloat = EffectParameterFloat;

    var EffectParameterVector = (function (_super) {
        __extends(EffectParameterVector, _super);
        function EffectParameterVector(name) {
            _super.call(this, name);
            this._value = new mathematics.Vector();
        }
        EffectParameterVector.prototype.setValue = function (value) {
            this._value = value;
        };
        EffectParameterVector.prototype.getValue = function () {
            return this._value;
        };
        EffectParameterVector.prototype.apply = function () {
            gl.uniform3fv(this._parameterHandler, this._value.toArray());
            Errors.check("gl.uniform3fv");
        };
        return EffectParameterVector;
    })(EffectParameter);
    rendering.EffectParameterVector = EffectParameterVector;

    var EffectParameterColor = (function (_super) {
        __extends(EffectParameterColor, _super);
        function EffectParameterColor(name) {
            _super.call(this, name);
            this._value = new mathematics.Color();
        }
        EffectParameterColor.prototype.setValue = function (value) {
            this._value = value;
        };
        EffectParameterColor.prototype.getValue = function () {
            return this._value;
        };
        EffectParameterColor.prototype.apply = function () {
            gl.uniform4fv(this._parameterHandler, this._value.toArray());
            Errors.check("gl.uniform4fv");
        };
        return EffectParameterColor;
    })(EffectParameter);
    rendering.EffectParameterColor = EffectParameterColor;

    var EffectParameterMatrix = (function (_super) {
        __extends(EffectParameterMatrix, _super);
        function EffectParameterMatrix(name) {
            _super.call(this, name);
            this._value = new mathematics.Matrix();
        }
        EffectParameterMatrix.prototype.setValue = function (value) {
            this._value = value;
        };
        EffectParameterMatrix.prototype.getValue = function () {
            return this._value;
        };
        EffectParameterMatrix.prototype.apply = function () {
            gl.uniformMatrix4fv(this._parameterHandler, gl.FALSE, this._value.toArray());
            Errors.check("gl.uniformMatrix4fv");
        };
        return EffectParameterMatrix;
    })(EffectParameter);
    rendering.EffectParameterMatrix = EffectParameterMatrix;

    var EffectParameterMatrixArray = (function (_super) {
        __extends(EffectParameterMatrixArray, _super);
        function EffectParameterMatrixArray(name) {
            _super.call(this, name);
            this._value = new Array(0);
        }
        EffectParameterMatrixArray.prototype.setValue = function (value) {
            this._value = value;
        };
        EffectParameterMatrixArray.prototype.getValue = function () {
            return this._value;
        };
        EffectParameterMatrixArray.prototype.apply = function () {
            if (!EffectParameterMatrixArray._bufferValues) {
                EffectParameterMatrixArray._bufferValues = [];
                for (var i = 0; i < (16 * 48); i++)
                    EffectParameterMatrixArray._bufferValues.push(0.0);
                EffectParameterMatrixArray._buffer = new Float32Array(EffectParameterMatrixArray._bufferValues);
            }
            var k = 0;
            for (var i = 0; i < this._value.length; i++)
                for (var j = 0; j < 16; j++) {
                    EffectParameterMatrixArray._buffer[k] = this._value[i]._v[j];
                    k++;
                }
            gl.uniformMatrix4fv(this._parameterHandler, false, EffectParameterMatrixArray._buffer);
            Errors.check("gl.uniformMatrix4fv");
        };
        return EffectParameterMatrixArray;
    })(EffectParameter);
    rendering.EffectParameterMatrixArray = EffectParameterMatrixArray;

    var EffectParameterMatrix3 = (function (_super) {
        __extends(EffectParameterMatrix3, _super);
        function EffectParameterMatrix3(name) {
            _super.call(this, name);
            this._value = new mathematics.Matrix3();
        }
        EffectParameterMatrix3.prototype.setValue = function (value) {
            this._value = value;
        };
        EffectParameterMatrix3.prototype.getValue = function () {
            return this._value;
        };
        EffectParameterMatrix3.prototype.apply = function () {
            gl.uniformMatrix3fv(this._parameterHandler, false, this._value.toArray());
            Errors.check("gl.uniformMatrix3fv");
        };
        return EffectParameterMatrix3;
    })(EffectParameter);
    rendering.EffectParameterMatrix3 = EffectParameterMatrix3;

    var EffectParameterMatrix3Array = (function (_super) {
        __extends(EffectParameterMatrix3Array, _super);
        function EffectParameterMatrix3Array(name) {
            _super.call(this, name);
            this._value = new Array(0);
        }
        EffectParameterMatrix3Array.prototype.setValue = function (value) {
            this._value = value;
        };
        EffectParameterMatrix3Array.prototype.getValue = function () {
            return this._value;
        };
        EffectParameterMatrix3Array.prototype.apply = function () {
            if (!EffectParameterMatrix3Array._bufferValues) {
                EffectParameterMatrix3Array._bufferValues = [];
                for (var i = 0; i < (9 * 48); i++)
                    EffectParameterMatrix3Array._bufferValues.push(0.0);
                EffectParameterMatrix3Array._buffer = new Float32Array(EffectParameterMatrix3Array._bufferValues);
            }
            var k = 0;
            for (var i = 0; i < this._value.length; i++)
                for (var j = 0; j < 9; j++) {
                    EffectParameterMatrix3Array._buffer[k] = this._value[i]._v[j];
                    k++;
                }
            gl.uniformMatrix3fv(this._parameterHandler, false, EffectParameterMatrix3Array._buffer);
            Errors.check("gl.uniformMatrix3fv");
        };
        return EffectParameterMatrix3Array;
    })(EffectParameter);
    rendering.EffectParameterMatrix3Array = EffectParameterMatrix3Array;

    var EffectParameterTexture = (function (_super) {
        __extends(EffectParameterTexture, _super);
        function EffectParameterTexture(name) {
            _super.call(this, name);
            this._value = null;
            if (!EffectParameterTexture._texturesMap) {
                EffectParameterTexture._texturesMap = [
                    gl.TEXTURE0,
                    gl.TEXTURE1,
                    gl.TEXTURE2,
                    gl.TEXTURE3,
                    gl.TEXTURE4,
                    gl.TEXTURE5,
                    gl.TEXTURE6,
                    gl.TEXTURE7];
            }
        }
        EffectParameterTexture.prototype.setValue = function (value) {
            this._value = value;
        };
        EffectParameterTexture.prototype.getValue = function () {
            return this._value;
        };
        EffectParameterTexture.prototype.create = function (effect) {
            _super.prototype.create.call(this, effect);
            this._textureIndex = effect._texturesCount;
            effect._texturesCount++;
        };
        EffectParameterTexture.prototype.apply = function () {
            gl.activeTexture(EffectParameterTexture._texturesMap[this._textureIndex]);
            Errors.check("gl.activeTexture");
            gl.bindTexture(gl.TEXTURE_2D, this._value.TextureHandler);
            Errors.check("gl.bindTexture");
            gl.uniform1i(this._parameterHandler, this._textureIndex);
            Errors.check("gl.uniform1i");
        };
        return EffectParameterTexture;
    })(EffectParameter);
    rendering.EffectParameterTexture = EffectParameterTexture;

    var EffectParameterCubemap = (function (_super) {
        __extends(EffectParameterCubemap, _super);
        function EffectParameterCubemap(name) {
            _super.call(this, name);
            this._value = null;
            if (!EffectParameterTexture._texturesMap) {
                EffectParameterTexture._texturesMap = [
                    gl.TEXTURE0,
                    gl.TEXTURE1,
                    gl.TEXTURE2,
                    gl.TEXTURE3,
                    gl.TEXTURE4,
                    gl.TEXTURE5,
                    gl.TEXTURE6,
                    gl.TEXTURE7];
            }
        }
        EffectParameterCubemap.prototype.setValue = function (value) {
            this._value = value;
        };
        EffectParameterCubemap.prototype.getValue = function () {
            return this._value;
        };
        EffectParameterCubemap.prototype.create = function (effect) {
            _super.prototype.create.call(this, effect);
            this._textureIndex = effect._texturesCount;
            effect._texturesCount++;
        };
        EffectParameterCubemap.prototype.apply = function () {
            gl.activeTexture(EffectParameterTexture._texturesMap[this._textureIndex]);
            Errors.check("gl.activeTexture");
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._value.TextureHandler);
            Errors.check("gl.bindTexture");
            gl.uniform1i(this._parameterHandler, this._textureIndex);
            Errors.check("gl.uniform1i");
        };
        return EffectParameterCubemap;
    })(EffectParameter);
    rendering.EffectParameterCubemap = EffectParameterCubemap;

    var UniformsFactory = (function () {
        function UniformsFactory() {
        }
        UniformsFactory.ProjectionMatrix = function () {
            return new EffectParameterMatrix(Uniforms.ProjectionMatrix);
        };
        UniformsFactory.ViewMatrix = function () {
            return new EffectParameterMatrix(Uniforms.ViewMatrix);
        };
        UniformsFactory.NormalMatrix = function () {
            return new EffectParameterMatrix3(Uniforms.NormalMatrix);
        };
        UniformsFactory.ModelMatrix = function () {
            return new EffectParameterMatrix(Uniforms.ModelMatrix);
        };
        UniformsFactory.ModelMatrices = function () {
            return new EffectParameterMatrixArray(Uniforms.ModelMatrices);
        };
        UniformsFactory.NormalMatrices = function () {
            return new EffectParameterMatrix3Array(Uniforms.NormalMatrices);
        };
        UniformsFactory.Light = function () {
            return new EffectParameterVector(Uniforms.Light);
        };
        UniformsFactory.Eye = function () {
            return new EffectParameterVector(Uniforms.Eye);
        };
        UniformsFactory.SpecularMap = function () {
            return new EffectParameterTexture(Uniforms.SpecularMap);
        };
        UniformsFactory.DiffuseMap = function () {
            return new EffectParameterTexture(Uniforms.DiffuseMap);
        };
        UniformsFactory.NormalMap = function () {
            return new EffectParameterTexture(Uniforms.NormalMap);
        };
        UniformsFactory.GlowMap = function () {
            return new EffectParameterTexture(Uniforms.GlowMap);
        };
        UniformsFactory.GlowLevel = function () {
            return new EffectParameterFloat(Uniforms.GlowLevel);
        };
        UniformsFactory.SpecularLight = function () {
            return new EffectParameterColor(Uniforms.SpecularLight);
        };
        UniformsFactory.DiffuseLight = function () {
            return new EffectParameterColor(Uniforms.DiffuseLight);
        };
        UniformsFactory.AmbientLight = function () {
            return new EffectParameterColor(Uniforms.AmbientLight);
        };
        UniformsFactory.GlowColor = function () {
            return new EffectParameterColor(Uniforms.GlowColor);
        };
        UniformsFactory.EnvironmentCubeMap = function () {
            return new EffectParameterCubemap(Uniforms.EnvironmentCubeMap);
        };
        UniformsFactory.EyePosition = function () {
            return new EffectParameterVector(Uniforms.EyePosition);
        };
        UniformsFactory.Texture = function () {
            return new EffectParameterTexture(Uniforms.Texture);
        };
        UniformsFactory.DepthMap = function () {
            return new EffectParameterTexture(Uniforms.DepthMap);
        };
        UniformsFactory.Texture1 = function () {
            return new EffectParameterTexture(Uniforms.Texture1);
        };
        UniformsFactory.Color = function () {
            return new EffectParameterColor(Uniforms.Color);
        };
        UniformsFactory.Color1 = function () {
            return new EffectParameterColor(Uniforms.Color1);
        };
        UniformsFactory.Time = function () {
            return new EffectParameterFloat(Uniforms.Time);
        };
        UniformsFactory.ZNear = function () {
            return new EffectParameterFloat(Uniforms.ZNear);
        };
        UniformsFactory.ZFar = function () {
            return new EffectParameterFloat(Uniforms.ZFar);
        };
        return UniformsFactory;
    })();
    rendering.UniformsFactory = UniformsFactory;

    var Declaration = (function () {
        function Declaration(size, name) {
            this._size = size;
            this._name = name;
        }
        Declaration.prototype.getName = function () {
            return this._name;
        };
        Declaration.prototype.getSize = function () {
            return this._size;
        };
        return Declaration;
    })();
    rendering.Declaration = Declaration;

    var DeclarationVertex = (function (_super) {
        __extends(DeclarationVertex, _super);
        function DeclarationVertex(name) {
            _super.call(this, 3, name);
        }
        return DeclarationVertex;
    })(Declaration);
    rendering.DeclarationVertex = DeclarationVertex;

    var DeclarationColor = (function (_super) {
        __extends(DeclarationColor, _super);
        function DeclarationColor(name) {
            _super.call(this, 4, name);
        }
        return DeclarationColor;
    })(Declaration);
    rendering.DeclarationColor = DeclarationColor;

    var DeclarationeVertex2 = (function (_super) {
        __extends(DeclarationeVertex2, _super);
        function DeclarationeVertex2(name) {
            _super.call(this, 2, name);
        }
        return DeclarationeVertex2;
    })(Declaration);
    rendering.DeclarationeVertex2 = DeclarationeVertex2;

    var DeclarationFloat = (function (_super) {
        __extends(DeclarationFloat, _super);
        function DeclarationFloat(name) {
            _super.call(this, 1, name);
        }
        return DeclarationFloat;
    })(Declaration);
    rendering.DeclarationFloat = DeclarationFloat;

    var Declarations = (function () {
        function Declarations() {
        }
        Declarations.Position = new DeclarationVertex("a_Position");
        Declarations.Normal = new DeclarationVertex("a_Normal");
        Declarations.Tangent = new DeclarationVertex("a_Tangent");
        Declarations.BiTangent = new DeclarationVertex("a_BiTangent");
        Declarations.TexturePosition = new DeclarationeVertex2("a_TexturePosition");
        Declarations.Color = new DeclarationColor("a_Color");
        Declarations.TransformIndex = new DeclarationFloat("a_TransformIndex");
        return Declarations;
    })();
    rendering.Declarations = Declarations;

    var Attribute = (function () {
        function Attribute(declaration) {
            this._size = declaration.getSize();
            this._name = declaration.getName();
        }
        Attribute.prototype.setName = function (value) {
            this._name = value;
        };
        Attribute.prototype.getName = function () {
            return this._name;
        };

        Attribute.prototype.create = function (effect) {
            this._attributeHandler = gl.getAttribLocation(effect._program, this._name);
            Errors.check("gl.getAttribLocation");
        };

        Attribute.prototype.apply = function (offset, stride) {
            gl.enableVertexAttribArray(this._attributeHandler);
            Errors.check("gl.enableVertexAttribArray");
            gl.vertexAttribPointer(this._attributeHandler, this._size, gl.FLOAT, false, stride, offset);
            Errors.check("gl.vertexAttribPointer");
        };
        return Attribute;
    })();
    rendering.Attribute = Attribute;

    var VertexSignature = (function () {
        function VertexSignature(declaration) {
            this._name = declaration.getName();
            this._size = declaration.getSize();
        }
        return VertexSignature;
    })();
    rendering.VertexSignature = VertexSignature;

    var VertexSignatures = (function () {
        function VertexSignatures(signatures) {
            var l = signatures.length;
            this._signatures = [];
            for (var i = 0; i < l; i++) {
                this._signatures[i] = new VertexSignature(signatures[i]);
            }
            var offset = 0;
            this._count = 0;
            for (var i = 0; i < this._signatures.length; i++) {
                this._signatures[i]._offset = offset;
                offset += this._signatures[i]._size * 4;
                this._count += this._signatures[i]._size;
            }
            this._size = offset;
        }
        VertexSignatures.prototype.getSize = function () {
            return this._count;
        };
        VertexSignatures.prototype.getCount = function () {
            return this._size;
        };
        return VertexSignatures;
    })();
    rendering.VertexSignatures = VertexSignatures;

    var Effect = (function () {
        function Effect(pixelShader, vertexShader, parameters, attributes) {
            this._pixelShaderCode = pixelShader;
            this._vertexShaderCode = vertexShader;
            this._attributes = attributes;
            this._parameters = parameters;
            this.compileShader();
            this._texturesCount = 0;
            for (var i = 0; i < this._parameters.length; i++) {
                this._parameters[i].create(this);
            }
            for (var i = 0; i < this._attributes.length; i++) {
                this._attributes[i].create(this);
            }
        }
        Effect.prototype.dispose = function () {
            if (this._program) {
                if (this._vertexShader) {
                    gl.detachShader(this._program, this._pixelShader);
                    Errors.check("gl.detachShader");
                }
                if (this._vertexShader) {
                    gl.detachShader(this._program, this._vertexShader);
                    Errors.check("gl.detachShader");
                }
                gl.deleteProgram(this._program);
                Errors.check("gl.deleteProgram");
            }
            if (this._vertexShader) {
                gl.deleteShader(this._vertexShader);
                Errors.check("gl.deleteProgram");
            }
            if (this._pixelShader) {
                gl.deleteShader(this._pixelShader);
                Errors.check("gl.deleteProgram");
            }
            this._program = null;
            this._pixelShader = null;
            this._vertexShader = null;
        };

        Effect.prototype.loadShader = function (type, shaderCode) {
            var shader = gl.createShader(type);
            Errors.check("gl.createShader");
            gl.shaderSource(shader, shaderCode);
            Errors.check("gl.shaderSource");
            gl.compileShader(shader);
            Errors.check("gl.compileShader");
            return shader;
        };

        Effect.prototype.compileShader = function () {
            this._vertexShader = this.loadShader(gl.VERTEX_SHADER, this._vertexShaderCode);
            this._pixelShader = this.loadShader(gl.FRAGMENT_SHADER, this._pixelShaderCode);

            this._program = gl.createProgram();
            Errors.check("gl.CreateProgram");
            gl.attachShader(this._program, this._vertexShader);
            Errors.check("gl.attachShader");
            gl.attachShader(this._program, this._pixelShader);
            Errors.check("gl.attachShader");
            gl.linkProgram(this._program);
            Errors.check("gl.linkProgram");
            gl.useProgram(this._program);
            Errors.check("gl.useProgram");
        };

        Effect.prototype.getAttributes = function () {
            return this._attributes;
        };
        Effect.prototype.getParameters = function () {
            return this._parameters;
        };

        Effect.prototype.applyParameters = function () {
            gl.useProgram(this._program);
            for (var i = 0; i < this._parameters.length; i++) {
                this._parameters[i].apply();
            }
        };
        return Effect;
    })();
    rendering.Effect = Effect;

    var VertexBuffer = (function () {
        function VertexBuffer(signatures, vertices) {
            this._signatures = signatures;
            this._elementSize = 0;
            this._count = 0;
            for (var i = 0; i < this._signatures._signatures.length; i++) {
                this._elementSize += this._signatures._signatures[i]._size;
            }
            this._count = vertices.length / this._elementSize;

            this._buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
            Errors.check("gl.bindBuffer");
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            Errors.check("gl.bufferData");
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            Errors.check("gl.BindBuffer");
        }
        VertexBuffer.prototype.getSignature = function () {
            return this._signatures._signatures;
        };

        VertexBuffer.prototype.getCount = function () {
            return this._count;
        };

        VertexBuffer.prototype.dispose = function () {
            if (this._buffer) {
                gl.deleteBuffer(this._buffer);
            }
            this._buffer = null;
        };
        return VertexBuffer;
    })();
    rendering.VertexBuffer = VertexBuffer;

    var AttributeJoint = (function () {
        function AttributeJoint(signature, attribute) {
            this._signature = signature;
            this._attribute = attribute;
        }
        AttributeJoint.prototype.apply = function (stride) {
            this._attribute.apply(this._signature._offset, stride);
        };
        return AttributeJoint;
    })();
    rendering.AttributeJoint = AttributeJoint;

    var AttributeMap = (function () {
        function AttributeMap(signatures, attributes) {
            this._joints = new collections.LinkedList();
            this._stride = 0;
            for (var i = 0; i < signatures.length; i++) {
                for (var j = 0; j < attributes.length; j++) {
                    if (signatures[i]._name == attributes[j].getName()) {
                        this._joints.add(new AttributeJoint(signatures[i], attributes[j]));
                    }
                }
                this._stride += signatures[i]._size * 4;
            }
        }
        AttributeMap.prototype.apply = function () {
            for (var node = this._joints.firstNode; node != null; node = node.next)
                node.element.apply(this._stride);
        };
        return AttributeMap;
    })();
    rendering.AttributeMap = AttributeMap;

    var IndexBuffer = (function () {
        function IndexBuffer(indices) {
            this._buffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer);
            Errors.check("gl.bindBuffer");
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
            Errors.check("gl.bufferData");
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            Errors.check("gl.bindBuffer");
            this.Count = indices.length;
        }
        IndexBuffer.prototype.dispose = function () {
            if (this._buffer) {
                gl.deleteBuffer(this._buffer);
            }
            this._buffer = null;
        };
        return IndexBuffer;
    })();
    rendering.IndexBuffer = IndexBuffer;

    var RenderJoint = (function () {
        function RenderJoint(effect, vertexBuffer) {
            this._effect = effect;
            this._vertexBuffer = vertexBuffer;
            this._attributeMap = new AttributeMap(vertexBuffer.getSignature(), effect.getAttributes());
        }
        RenderJoint.prototype.apply = function () {
            gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer._buffer); /// activate VertexBuffer
            Errors.check("gl.bindBuffer");
            this._effect.applyParameters();
            this._attributeMap.apply();
        };

        RenderJoint.prototype.render = function (indices) {
            this.apply();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices._buffer);
            Errors.check("gl.bindBuffer");
            gl.drawElements(gl.TRIANGLES, indices.Count, gl.UNSIGNED_SHORT, 0);
            Errors.check("gl.drawElements");
        };
        return RenderJoint;
    })();
    rendering.RenderJoint = RenderJoint;

    var ClearState = (function () {
        function ClearState() {
        }
        ClearState.create = function (color, depth) {
            var result = new ClearState();
            result.Color = color;
            result.Depth = depth;
            return result;
        };
        return ClearState;
    })();
    rendering.ClearState = ClearState;

    var BlendMode = (function () {
        function BlendMode() {
        }
        BlendMode.prototype.setBlendFunction = function () {
        };
        return BlendMode;
    })();
    rendering.BlendMode = BlendMode;

    var NoneBlendMode = (function (_super) {
        __extends(NoneBlendMode, _super);
        function NoneBlendMode() {
            _super.call(this);
        }
        NoneBlendMode.prototype.setBlendFunction = function () {
            gl.disable(gl.BLEND);
        };
        return NoneBlendMode;
    })(BlendMode);
    rendering.NoneBlendMode = NoneBlendMode;

    var AdditiveBlendMode = (function (_super) {
        __extends(AdditiveBlendMode, _super);
        function AdditiveBlendMode() {
            _super.call(this);
        }
        AdditiveBlendMode.prototype.setBlendFunction = function () {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        };
        return AdditiveBlendMode;
    })(BlendMode);
    rendering.AdditiveBlendMode = AdditiveBlendMode;

    var AlphaBlendMode = (function (_super) {
        __extends(AlphaBlendMode, _super);
        function AlphaBlendMode() {
            _super.call(this);
        }
        AlphaBlendMode.prototype.setBlendFunction = function () {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        };
        return AlphaBlendMode;
    })(BlendMode);
    rendering.AlphaBlendMode = AlphaBlendMode;

    var BlendModes = (function () {
        function BlendModes() {
        }
        BlendModes.None = new NoneBlendMode();
        BlendModes.Additive = new AdditiveBlendMode();
        BlendModes.AlphaBlend = new AlphaBlendMode();
        return BlendModes;
    })();
    rendering.BlendModes = BlendModes;

    var DepthTestMode = (function () {
        function DepthTestMode() {
        }
        DepthTestMode.prototype.setDepthTest = function () {
        };
        return DepthTestMode;
    })();
    rendering.DepthTestMode = DepthTestMode;

    var NoneDepthTestMode = (function (_super) {
        __extends(NoneDepthTestMode, _super);
        function NoneDepthTestMode() {
            _super.call(this);
        }
        NoneDepthTestMode.prototype.setDepthTest = function () {
            gl.disable(gl.DEPTH_TEST);
            Errors.check("gl.disable");
        };
        return NoneDepthTestMode;
    })(DepthTestMode);
    rendering.NoneDepthTestMode = NoneDepthTestMode;

    var ReadWriteDepthTestMode = (function (_super) {
        __extends(ReadWriteDepthTestMode, _super);
        function ReadWriteDepthTestMode() {
            _super.call(this);
        }
        ReadWriteDepthTestMode.prototype.setDepthTest = function () {
            gl.depthMask(true);
            Errors.check("gl.depthMask");
            gl.enable(gl.DEPTH_TEST);
            Errors.check("gl.enable");
            gl.depthFunc(gl.LEQUAL);
            Errors.check("gl.depthFunc");
        };
        return ReadWriteDepthTestMode;
    })(DepthTestMode);
    rendering.ReadWriteDepthTestMode = ReadWriteDepthTestMode;

    var ReadDepthTestMode = (function (_super) {
        __extends(ReadDepthTestMode, _super);
        function ReadDepthTestMode() {
            _super.call(this);
        }
        ReadDepthTestMode.prototype.setDepthTest = function () {
            gl.depthMask(false);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
        };
        return ReadDepthTestMode;
    })(DepthTestMode);

    var DepthTestModes = (function () {
        function DepthTestModes() {
        }
        DepthTestModes.None = new NoneDepthTestMode();
        DepthTestModes.ReadWrite = new ReadWriteDepthTestMode();
        DepthTestModes.Read = new ReadDepthTestMode();
        return DepthTestModes;
    })();
    rendering.DepthTestModes = DepthTestModes;

    var GraphicsDevice = (function () {
        function GraphicsDevice() {
        }
        GraphicsDevice.prototype.setClearState = function (value) {
            gl.clearColor(value.Color.getR(), value.Color.getG(), value.Color.getB(), value.Color.getA());
            Errors.check("gl.clearColor");
            gl.clearDepth(value.Depth);
            Errors.check("gl.clearDepth");
        };

        GraphicsDevice.prototype.setDepthState = function (value) {
            value.setDepthTest();
        };

        GraphicsDevice.prototype.setBlendModel = function (value) {
            value.setBlendFunction();
        };

        GraphicsDevice.prototype.clearColorDepth = function () {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            Errors.check("gl.clear");
        };

        GraphicsDevice.prototype.clearColor = function () {
            gl.clear(gl.COLOR_BUFFER_BIT);
            Errors.check("gl.clear");
        };

        GraphicsDevice.prototype.clearDepth = function () {
            gl.clear(gl.DEPTH_BUFFER_BIT);
        };
        return GraphicsDevice;
    })();
    rendering.GraphicsDevice = GraphicsDevice;
})(rendering || (rendering = {}));
//# sourceMappingURL=rendering.js.map
