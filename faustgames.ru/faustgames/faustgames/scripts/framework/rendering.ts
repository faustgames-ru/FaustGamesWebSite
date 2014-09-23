/// <reference path="core.ts"/>
/// <reference path="math.ts"/>

var gl;

module rendering {

    export interface IGraphicsDevice {
        setClearState(value: ClearState): void;
        setDepthState(value: DepthTestMode): void;
        setBlendModel(value: BlendMode): void;
        clearColorDepth(): void;
        clearColor(): void;
        clearDepth(): void;
    }

    export interface IGraphicsDeviceSimple {
    }

    export interface IRender {
        render(args: RenderArgs): void
    }

    export interface ISimpleRender {
        renderSimple(graphicsDevice: IGraphicsDeviceSimple): void
    }

    export class RenderArgs {
        GraphicsDevice: IGraphicsDevice;
        Viewport: RenderViewport = new RenderViewport();
    }

    export class RenderViewport {
        SizeX: number;
        SizeY: number;
    }

    class Uniforms {
        static ProjectionMatrix: string = "u_ProjectionMatrix";
        static ViewMatrix: string = "u_ViewMatrix";
        static NormalMatrix: string = "u_NormalMatrix";
        static ModelMatrix: string = "u_ModelMatrix";
        static ModelMatrices: string = "u_ModelMatrices";
        static NormalMatrices: string = "u_NormalMatrices";
        static Texture: string = "u_Texture";
        static DepthMap: string = "u_DepthMap";
        static SpecularMap: string = "u_SpecularMap";
        static DiffuseMap: string = "u_DiffuseMap";
        static NormalMap: string = "u_NormalMap";
        static GlowMap: string = "u_GlowMap";
        static GlowLevel: string = "u_GlowLevel";
        static SpecularLight: string = "u_SpecularLight";
        static DiffuseLight: string = "u_DiffuseLight";
        static AmbientLight: string = "u_AmbientLight";
        static GlowColor: string = "u_GlowColor";
        static EnvironmentCubeMap: string = "u_EnvironmentCubeMap";
        static EyePosition: string = "u_EyePosition";
        static Texture1: string = "u_Texture1";
        static Color: string = "u_Color";
        static Color1: string = "u_Color1";
        static Time: string = "u_Time";
        static ZNear: string = "u_ZNear";
        static ZFar: string = "u_ZFar";
        static Light: string = "u_Light";
        static Eye: string = "u_Eye";
    }
    
    export class Texture implements core.IDisposable {
        TextureHandler: any; 
        dispose(): void {
            if (this.TextureHandler) {
                gl.deleteTexture(this.TextureHandler);
                Errors.check("gl.deleteTexture");
            }
            this.TextureHandler = null;
        }
    }

    export class TextureImage extends Texture {
        constructor(image: any, wrap: boolean) {
            super();
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
            }
            else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                Errors.check("gl.texParameteri");
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                Errors.check("gl.texParameteri");
            }

            var ext = (
                gl.getExtension('EXT_texture_filter_anisotropic') ||
                gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
                gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
                );
            if (ext) {
                var max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
            }


            gl.generateMipmap(gl.TEXTURE_2D);
            Errors.check("gl.generateMipmap");
            gl.bindTexture(gl.TEXTURE_2D, null);
            Errors.check("gl.bindTexture");
        }
    }
    
    export class TextureCubemap extends Texture {
        constructor(image: any[]) {
            super();
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

            var ext = (
                gl.getExtension('EXT_texture_filter_anisotropic') ||
                gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
                gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
                );
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
    }

    export class TextureRenderTarget extends Texture{
        _frameBuffer: any;
        _depthBuffer: any;
        _width: number;
        _height: number;
        _filter: boolean;

        constructor(width: number, height: number, filter: boolean) {
            super();
            this._filter = filter;
            this._width = width;
            this._height = height;
            this.load();
        }

        resize(width: number, height: number): void {
            this._width = width;
            this._height = height;
        }
        load(): void {
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

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._width, this._height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
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
        }

        setAsRenderTarget(): void{
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
        }

        setDefaultRenderTarget(width: number, height: number): void {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            Errors.check("gl.bindFramebuffer");
            gl.viewport(0, 0, width, height);
            Errors.check("gl.viewport");
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
            Errors.check("gl.clear");
        }

        dispose(): void {
            super.dispose();
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
        }
    }

    export class ExceptionRendering extends core.Exception {
        Code: number;
        Operation: string;
        constructor(code: number, operation: string) {
            super();
            this.Code = code;
            this.Operation = operation;
        }
    }

    export class Errors {
        static check(operation: string) {
        var error: number;
            while ((error = gl.getError()) != gl.NO_ERROR) {
                throw new ExceptionRendering(error, operation);
            }
        }
    }
    
    export class EffectParameter {
        _name: string;
        _parameterHandler: string;
        constructor(name: string) {
            this._name = name;
        }
        setName(value: string): void {
            this._name = value;
        }   
        getName(): string {
            return this._name;
        }   
        create(effect: Effect): void {
            var programHandler = effect._program;
            this._parameterHandler = gl.getUniformLocation(programHandler, this._name);
            Errors.check("gl.getUniformLocation");
        }
        apply(): void {
            throw new core.ExceptionAbstractMethodCall();
        }
    }

    export class EffectParameterFloat extends EffectParameter {
        _value: number;
        constructor(name: string) {
            super(name);
            this._value = 0.0;
        }
        setValue(value: number): void {
            this._value = value;
        }
        getValue(): number {
            return this._value;
        }
        apply(): void {
            gl.uniform1f(this._parameterHandler, this._value);
            Errors.check("gl.Uniform1f");
        }
    }

    export class EffectParameterVector extends EffectParameter {
        _value: mathematics.Vector;
        constructor(name: string) {
            super(name);
            this._value = new mathematics.Vector();
        }
        setValue(value: mathematics.Vector): void {
            this._value = value;
        }
        getValue(): mathematics.Vector {
            return this._value;
        }
        apply(): void {
            gl.uniform3fv(this._parameterHandler, this._value.toArray());
            Errors.check("gl.uniform3fv");
        }
    }

    export class EffectParameterColor extends EffectParameter {
        _value: mathematics.Color;
        constructor(name: string) {
            super(name);
            this._value = new mathematics.Color();
        }
        setValue(value: mathematics.Color): void {
            this._value = value;
        }
        getValue(): mathematics.Color {
            return this._value;
        }
        apply(): void {
            gl.uniform4fv(this._parameterHandler, this._value.toArray());
            Errors.check("gl.uniform4fv");
        }
    }

    export class EffectParameterMatrix extends EffectParameter {
        _value: mathematics.Matrix;
        constructor(name: string) {
            super(name);
            this._value = new mathematics.Matrix();
        }
        setValue(value: mathematics.Matrix): void {
            this._value = value;
        }
        getValue(): mathematics.Matrix {
            return this._value;
        }
        apply(): void {
            gl.uniformMatrix4fv(this._parameterHandler, gl.FALSE, this._value.toArray());
            Errors.check("gl.uniformMatrix4fv");
        }
    }

    export class EffectParameterMatrixArray extends EffectParameter {
        _value: mathematics.Matrix[];
        static _buffer: Float32Array;
        static _bufferValues: number[];

        constructor(name: string) {
            super(name);
            this._value = new Array<mathematics.Matrix>(0);
        }
        setValue(value: mathematics.Matrix[]): void {
            this._value = value;
        }
        getValue(): mathematics.Matrix[] {
            return this._value;
        }
        apply(): void {
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
        }
    }

    export class EffectParameterMatrix3 extends EffectParameter {
        _value: mathematics.Matrix3;
        constructor(name: string) {
            super(name);
            this._value = new mathematics.Matrix3();
        }
        setValue(value: mathematics.Matrix3): void {
            this._value = value;
        }
        getValue(): mathematics.Matrix3 {
            return this._value;
        }
        apply(): void {
            gl.uniformMatrix3fv(this._parameterHandler, false, this._value.toArray());
            Errors.check("gl.uniformMatrix3fv");
        }
    }

    export class EffectParameterMatrix3Array extends EffectParameter {
        static _buffer: Float32Array;
        static _bufferValues: number[];

        _value: mathematics.Matrix3[];
        constructor(name: string) {
            super(name);
            this._value = new Array<mathematics.Matrix3>(0);
        }
        setValue(value: mathematics.Matrix3[]): void {
            this._value = value;
        }
        getValue(): mathematics.Matrix3[] {
            return this._value;
        }
        apply(): void {
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
        }
    }

    export class EffectParameterTexture extends EffectParameter {
        _value: Texture;
        _textureIndex: number;

        static _texturesMap: number[];

        constructor(name: string) {
            super(name);
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
        setValue(value: Texture): void {
            this._value = value;
        }
        getValue(): Texture {
            return this._value;
        }
        create(effect: Effect): void {
            super.create(effect);
            this._textureIndex = effect._texturesCount;
            effect._texturesCount++;
        }
        apply(): void {
            gl.activeTexture(EffectParameterTexture._texturesMap[this._textureIndex]);
            Errors.check("gl.activeTexture");
            gl.bindTexture(gl.TEXTURE_2D, this._value.TextureHandler);
            Errors.check("gl.bindTexture");
            gl.uniform1i(this._parameterHandler, this._textureIndex);
            Errors.check("gl.uniform1i");
        }
    }

    export class EffectParameterCubemap extends EffectParameter {
        _value: TextureCubemap;
        _textureIndex: number;

        constructor(name: string) {
            super(name);
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
        setValue(value: TextureCubemap): void {
            this._value = value;
        }
        getValue(): TextureCubemap {
            return this._value;
        }
        create(effect: Effect): void {
            super.create(effect);
            this._textureIndex = effect._texturesCount;
            effect._texturesCount++;
        }
        apply(): void {
            gl.activeTexture(EffectParameterTexture._texturesMap[this._textureIndex]);
            Errors.check("gl.activeTexture");
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._value.TextureHandler);
            Errors.check("gl.bindTexture");
            gl.uniform1i(this._parameterHandler, this._textureIndex);
            Errors.check("gl.uniform1i");
        }
    }

    export class UniformsFactory {
        static ProjectionMatrix(): EffectParameterMatrix {
            return new EffectParameterMatrix(Uniforms.ProjectionMatrix);
        }
        static ViewMatrix(): EffectParameterMatrix {
            return new EffectParameterMatrix(Uniforms.ViewMatrix);
        }
        static NormalMatrix(): EffectParameterMatrix3 {
            return new EffectParameterMatrix3(Uniforms.NormalMatrix);
        }
        static ModelMatrix(): EffectParameterMatrix {
            return new EffectParameterMatrix(Uniforms.ModelMatrix);
        }
        static ModelMatrices(): EffectParameterMatrixArray {
            return new EffectParameterMatrixArray(Uniforms.ModelMatrices);
        }
        static NormalMatrices(): EffectParameterMatrix3Array {
            return new EffectParameterMatrix3Array(Uniforms.NormalMatrices);
        }
        static Light(): EffectParameterVector {
            return new EffectParameterVector(Uniforms.Light);
        }
        static Eye(): EffectParameterVector {
            return new EffectParameterVector(Uniforms.Eye);
        }
        static SpecularMap(): EffectParameterTexture {
            return new EffectParameterTexture(Uniforms.SpecularMap);
        }
        static DiffuseMap(): EffectParameterTexture {
            return new EffectParameterTexture(Uniforms.DiffuseMap);
        }
        static NormalMap(): EffectParameterTexture {
            return new EffectParameterTexture(Uniforms.NormalMap);
        }
        static GlowMap(): EffectParameterTexture {
            return new EffectParameterTexture(Uniforms.GlowMap);
        }
        static GlowLevel(): EffectParameterFloat {
            return new EffectParameterFloat(Uniforms.GlowLevel);
        }
        static SpecularLight(): EffectParameterColor {
            return new EffectParameterColor(Uniforms.SpecularLight);
        }
        static DiffuseLight(): EffectParameterColor {
            return new EffectParameterColor(Uniforms.DiffuseLight);
        }
        static AmbientLight(): EffectParameterColor {
            return new EffectParameterColor(Uniforms.AmbientLight);
        }
        static GlowColor(): EffectParameterColor {
            return new EffectParameterColor(Uniforms.GlowColor);
        }
        static EnvironmentCubeMap(): EffectParameterCubemap {
            return new EffectParameterCubemap(Uniforms.EnvironmentCubeMap);
        }
        static EyePosition(): EffectParameterVector {
            return new EffectParameterVector(Uniforms.EyePosition);
        }        
        static Texture(): EffectParameterTexture {
            return new EffectParameterTexture(Uniforms.Texture);
        }
        static DepthMap(): EffectParameterTexture {
            return new EffectParameterTexture(Uniforms.DepthMap);
        }
        static Texture1(): EffectParameterTexture {
            return new EffectParameterTexture(Uniforms.Texture1);
        }
        static Color(): EffectParameterColor {
            return new EffectParameterColor(Uniforms.Color);
        }
        static Color1(): EffectParameterColor {
            return new EffectParameterColor(Uniforms.Color1);
        }
        static Time(): EffectParameterFloat {
            return new EffectParameterFloat(Uniforms.Time);
        }
        static ZNear(): EffectParameterFloat {
            return new EffectParameterFloat(Uniforms.ZNear);
        }
        static ZFar(): EffectParameterFloat {
            return new EffectParameterFloat(Uniforms.ZFar);
        }
    }

    export class Declaration {
        _size: number;
        _name: string;
        constructor(size: number, name: string) {
            this._size = size;
            this._name = name;
        }            
        getName(): string {
            return this._name;
        }   
        getSize(): number {
            return this._size;
        }   
    }

    export class DeclarationVertex extends Declaration {
        constructor(name: string) {
            super(3, name);
        }
    }

    export class DeclarationColor extends Declaration {
        constructor(name: string) {
            super(4, name);
        }
    }

    export class DeclarationeVertex2 extends Declaration {
        constructor(name: string) {
            super(2, name);
        }
    }

    export class DeclarationFloat extends Declaration {
        constructor(name: string) {
            super(1, name);
        }
    }

    export class Declarations {
        static Position: DeclarationVertex = new DeclarationVertex("a_Position");
        static Normal: DeclarationVertex = new DeclarationVertex("a_Normal");
        static Tangent: DeclarationVertex = new DeclarationVertex("a_Tangent");
        static BiTangent: DeclarationVertex = new DeclarationVertex("a_BiTangent");
        static TexturePosition: DeclarationeVertex2 = new DeclarationeVertex2("a_TexturePosition");
        static Color: DeclarationColor = new DeclarationColor("a_Color");
        static TransformIndex: DeclarationFloat = new DeclarationFloat("a_TransformIndex");
    }


    export class Attribute {
        _size: number;
        _name: string;
        _attributeHandler: number;
        constructor(declaration: Declaration) {
            this._size = declaration.getSize();
            this._name = declaration.getName();
        }            
        setName(value: string): void {
            this._name = value;
        }
        getName(): string {
            return this._name;
        }   

        create(effect: Effect): void {
            this._attributeHandler = gl.getAttribLocation(effect._program, this._name);
            Errors.check("gl.getAttribLocation");
        }

        apply(offset: number, stride: number): void {
            gl.enableVertexAttribArray(this._attributeHandler);
            Errors.check("gl.enableVertexAttribArray");
            gl.vertexAttribPointer(this._attributeHandler, this._size, gl.FLOAT, false, stride, offset);
            Errors.check("gl.vertexAttribPointer");
        }
    }

    export class VertexSignature {
        _name: string;
        _size: number;
        _offset: number;
        constructor(declaration: Declaration) {
            this._name = declaration.getName();
            this._size = declaration.getSize();
        }
    }

    export class VertexSignatures {
        _signatures: VertexSignature[];
        _size: number;
        _count: number;
        getSize(): number {
            return this._count;
        }
        getCount(): number {
            return this._size;
        }
        constructor(signatures: Declaration[]) {
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
    }

    export class Effect implements core.IDisposable {
        _attributes: Attribute[];
        _parameters: EffectParameter[];
        _vertexShaderCode: string;
        _pixelShaderCode: string;
        _vertexShader: number;
        _pixelShader: number;
        _program: number;
        _texturesCount: number;
        constructor(pixelShader:string,
                    vertexShader: string,
                    parameters: EffectParameter[],
                    attributes: Attribute[]) {
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

        dispose(): void {
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
        }

        loadShader(type: number, shaderCode: string): number {
            var shader = gl.createShader(type);
            Errors.check("gl.createShader");
            gl.shaderSource(shader, shaderCode);
            Errors.check("gl.shaderSource");
            gl.compileShader(shader);
            Errors.check("gl.compileShader");
            return shader;
        }

        compileShader() {
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
        }

        getAttributes(): Attribute[] {
            return this._attributes;
        }
        getParameters(): EffectParameter[] {
            return this._parameters;
        }

        applyParameters() : void {
            gl.useProgram(this._program);
            for (var i = 0; i < this._parameters.length; i++) {
                this._parameters[i].apply();
            }
        }
    }

    export class VertexBuffer implements core.IDisposable {
        _signatures: VertexSignatures;
        _count: number;
        _elementSize: number;
        _buffer: number;

        constructor(signatures: VertexSignatures, vertices: Float32Array) {
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

        getSignature(): VertexSignature[]{
            return this._signatures._signatures;
        }

        getCount(): number {
            return this._count;
        }

        dispose(): void {
            if (this._buffer) {
                gl.deleteBuffer(this._buffer);
            }
            this._buffer = null;
        }
    }

    export class AttributeJoint {
        _signature: VertexSignature;
        _attribute: Attribute;
        constructor(signature: VertexSignature, attribute: Attribute) {
            this._signature = signature;
            this._attribute = attribute;
        }
        apply(stride: number): void  {
            this._attribute.apply(this._signature._offset, stride)
        }
    }

    export class AttributeMap {
        _joints: collections.LinkedList<AttributeJoint>;
        _stride;
        constructor(signatures: VertexSignature[], attributes: Attribute[]) {
            this._joints = new collections.LinkedList<AttributeJoint>();
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

        apply(): void {
            for (var node = this._joints.firstNode; node != null; node = node.next)
                node.element.apply(this._stride);
        }
    }

    export class IndexBuffer {
        _buffer: number;
        Count: number;
        constructor(indices: Uint16Array) {
            this._buffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer);
            Errors.check("gl.bindBuffer");
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
            Errors.check("gl.bufferData");
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            Errors.check("gl.bindBuffer");
            this.Count = indices.length;
        }

        dispose(): void {
            if (this._buffer) {
                gl.deleteBuffer(this._buffer);
            }
            this._buffer = null;
        }
    }


    export class RenderJoint {
        _effect: Effect;
        _vertexBuffer: VertexBuffer;
        _attributeMap: AttributeMap;

        constructor(effect: Effect, vertexBuffer: VertexBuffer) {
            this._effect = effect;
            this._vertexBuffer = vertexBuffer;
            this._attributeMap = new AttributeMap(vertexBuffer.getSignature(), effect.getAttributes());
        }

        private apply(): void {
            gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer._buffer);/// activate VertexBuffer
            Errors.check("gl.bindBuffer");
            this._effect.applyParameters();
            this._attributeMap.apply();
        }

        render(indices: IndexBuffer) {
            this.apply();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices._buffer);
            Errors.check("gl.bindBuffer");
            gl.drawElements(gl.TRIANGLES, indices.Count, gl.UNSIGNED_SHORT, 0);
            Errors.check("gl.drawElements");
        }
    }

    export class ClearState {
        Color: mathematics.Color;
        Depth: number;

        static create(color: mathematics.Color, depth: number): ClearState {
            var result = new ClearState();
            result.Color = color;
            result.Depth = depth;
            return result;
        }
    }

    export class BlendMode {
        setBlendFunction(): void {
        }
    }

    export class NoneBlendMode extends BlendMode {
        constructor() {
            super();
        }
        setBlendFunction(): void {
            gl.disable(gl.BLEND);
        }
    }

    export class AdditiveBlendMode extends BlendMode {
        constructor() {
            super();
        }
        setBlendFunction(): void {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        }
    }

    export class AlphaBlendMode extends BlendMode {
        constructor() {
            super();
        }
        setBlendFunction(): void {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        }
    }

    export class BlendModes {
        static None: NoneBlendMode = new NoneBlendMode();
        static Additive: AdditiveBlendMode = new AdditiveBlendMode();
        static AlphaBlend: AlphaBlendMode = new AlphaBlendMode();
    }

    export class DepthTestMode {
        setDepthTest(): void {
        }
    }

    export class NoneDepthTestMode extends DepthTestMode {
        constructor() {
            super();
        }
        setDepthTest(): void {
            gl.disable(gl.DEPTH_TEST);
            Errors.check("gl.disable");
        }
    }

    export class ReadWriteDepthTestMode extends DepthTestMode {
        constructor() {
            super();
        }
        setDepthTest(): void {
            gl.depthMask(true);
            Errors.check("gl.depthMask");
            gl.enable(gl.DEPTH_TEST);
            Errors.check("gl.enable");
            gl.depthFunc(gl.LEQUAL);
            Errors.check("gl.depthFunc");
        }
    }

    class ReadDepthTestMode extends DepthTestMode {
        constructor() {
            super();
        }
        setDepthTest(): void {
            gl.depthMask(false);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
        }
    }
    
    export class DepthTestModes {
        static None: NoneDepthTestMode = new NoneDepthTestMode();
        static ReadWrite: ReadWriteDepthTestMode = new ReadWriteDepthTestMode();
        static Read: ReadDepthTestMode = new ReadDepthTestMode();
    }

    export class GraphicsDevice implements IGraphicsDevice {

        constructor() {
        }

        setClearState(value: ClearState): void {
            gl.clearColor(
                value.Color.getR(),
                value.Color.getG(),
                value.Color.getB(),
                value.Color.getA());
            Errors.check("gl.clearColor");
            gl.clearDepth(value.Depth);
            Errors.check("gl.clearDepth");
        }

        setDepthState(value: DepthTestMode): void {
            value.setDepthTest();
        }

        setBlendModel(value: BlendMode): void {
            value.setBlendFunction();
        }

        clearColorDepth(): void {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            Errors.check("gl.clear");
        }

        clearColor(): void {
            gl.clear(gl.COLOR_BUFFER_BIT);
            Errors.check("gl.clear");
        }

        clearDepth(): void {
            gl.clear(gl.DEPTH_BUFFER_BIT);
        }
    }
}