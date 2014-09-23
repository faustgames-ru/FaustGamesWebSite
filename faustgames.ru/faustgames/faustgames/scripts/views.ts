/// <reference path="framework/collections.ts"/>
/// <reference path="framework/core.ts"/>

module views {
    export class Control implements core.ICreate, core.IMotionAll, core.IResize {
        _htmlElement: HTMLElement;
        _controls: collections.LinkedList<Control>;
        _elementId: string;
        constructor(elementId: string) {
            this._elementId = elementId;
            this._htmlElement = window.document.getElementById(elementId);
            this._controls = new collections.LinkedList<Control>();
        }

        create(args: core.UpdateArgs): void {
            this.onCreate(args);
            for (var node = this._controls.firstNode; node != null; node = node.next) {
                node.element.create(args);
            }
        }

        resize(args: core.ResizeArgs): void {
            //this._htmlElement = window.document.getElementById(this._elementId);
            this.onResize(args);
            for (var node = this._controls.firstNode; node != null; node = node.next) {
                node.element.resize(args);
            }
        }

        motionHover(args: core.MouseMoveArgs): void {
            this.onMotionHover(args);
            for (var node = this._controls.firstNode; node != null; node = node.next) {
                node.element.motionMove(args);
            }
        }

        motionMove(args: core.MouseMoveArgs): void {
            this.onMotionMove(args);
            for (var node = this._controls.firstNode; node != null; node = node.next) {
                node.element.motionMove(args);
            }
        }

        motionUp(args: core.MouseMoveArgs): void {
            this.onMotionUp(args);
            for (var node = this._controls.firstNode; node != null; node = node.next) {
                node.element.motionUp(args);
            }
        }

        motionDown(args: core.MouseMoveArgs): void {
            this.onMotionDown(args);
            for (var node = this._controls.firstNode; node != null; node = node.next) {
                node.element.motionDown(args);
            }
        }

        motionLeave(args: core.MouseMoveArgs): void {
            this.onMotionLeave(args);
            for (var node = this._controls.firstNode; node != null; node = node.next) {
                node.element.motionLeave(args);
            }
        }

        onCreate(args: core.UpdateArgs): void {
        }

        onResize(args: core.ResizeArgs): void {
        }

        onMotionHover(args: core.MouseMoveArgs): void {
        }

        onMotionMove(args: core.MouseMoveArgs): void {
        }

        onMotionUp(args: core.MouseMoveArgs): void {
        }

        onMotionDown(args: core.MouseMoveArgs): void {
        }

        onMotionLeave(args: core.MouseMoveArgs): void {
        }

        createControl(type, elementId: string): any {
            var newControl = new type(elementId);
            this._controls.add(newControl);
            return newControl;
        }
    }

    export class AnimatedPanel extends Control {
        onCreate(args: core.UpdateArgs): void {
        }
        onMotionMove(args: core.MouseMoveArgs): void {
            var x = args.X;
            var y = args.Y;
            this._htmlElement.style.backgroundPosition = "0 0, " + ((-x + y) * 0.1) + "px " + "0, " + ((-x + y) * 0.1) + "px " + " 0, 0 0, 0 0";
        }
    }

    export class Header extends AnimatedPanel {
    }

    export class Footer extends AnimatedPanel {
    }

    export class InitWebglArgs {
        SizeX: number;
        SizeY: number;
    }

    export class WebglCanvas extends Control implements core.IUpdate {
        _graphicsDevice: rendering.GraphicsDevice = new rendering.GraphicsDevice();
        _renderList: collections.LinkedList<rendering.IRender> = new collections.LinkedList<rendering.IRender>();
        _renderArgs: rendering.RenderArgs = new rendering.RenderArgs();
        _clearState: rendering.ClearState = rendering.ClearState.create(
            mathematics.Color.fromRGBA(0.0, 0.0, 0.0, 1.0),
            1.0);
        init(args: InitWebglArgs): any {
            gl = null;
            var canvas: any = this._htmlElement;
            canvas.width = args.SizeX;
            canvas.height = args.SizeY;
            try {
                // Try to grab the standard context. If it fails, fallback to experimental.
                gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            }
            catch (e) { }
            // If we don't have a GL context, give up now
            if (!gl) {
                alert("Unable to initialize WebGL. Your browser may not support it.");
                gl = null;
                return null;
            }

            this._graphicsDevice.setClearState(this._clearState);
            this._graphicsDevice.setDepthState(rendering.DepthTestModes.ReadWrite);
            this._graphicsDevice.clearColorDepth();
        }

        addRender(render: rendering.IRender): void {
            this._renderList.add(render);
        }

        removeRender(render: rendering.IRender): void {
            this._renderList.remove(render);
        }

        update(args: core.UpdateArgs): void {
            if (!gl) return;
            gl.viewport(0, 0, this._htmlElement.offsetWidth, this._htmlElement.offsetHeight);
            gl.clearColor(0, 0, 0, 1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.disable(gl.CULL_FACE);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            this._renderArgs.GraphicsDevice = this._graphicsDevice;
            this._renderArgs.Viewport.SizeX = this._htmlElement.offsetWidth;
            this._renderArgs.Viewport.SizeY = this._htmlElement.offsetHeight;
            for (var node = this._renderList.firstNode; node != null; node = node.next) {
                node.element.render(this._renderArgs);
            }
            
            gl.flush();
            gl.finish();
        }
    }

    export class Content extends Control {
    }

    export class LoadingPanel extends Control {
    }

    export class TextPanel extends Control {
    }

    export class BasicView extends Control {    
        _header: Header;
        _footer: Footer;
        _content: Content;
        _canvas: WebglCanvas;
        _initWebglArgs: InitWebglArgs = new InitWebglArgs();
        _down: boolean = false;
        _motionArgs: core.MouseMoveArgs = new core.MouseMoveArgs();
        _motions: collections.LinkedList<core.IMotionAll> = new collections.LinkedList<core.IMotionAll>();

        LockMotions: boolean;

        constructor() {
            super("body");

            this._htmlElement.onmousemove = (e) => { this.mouseMove(e); };
            this._htmlElement.onmousedown = (e) => { this.mouseDown(e); };
            this._htmlElement.onmouseup = (e) => { this.mouseUp(e); };
            this._htmlElement.onmouseleave = (e) => { this.mouseLeave(e); };

            this._header = this.createControl(Header, "header");
            this._content = this.createControl(Content, "content");
            this._canvas = this.createControl(WebglCanvas, "glcanvas");
            this._footer = this.createControl(Footer, "footer");

            this._initWebglArgs.SizeX = this._content._htmlElement.offsetWidth;
            this._initWebglArgs.SizeY = this._content._htmlElement.offsetHeight;
            this._canvas.init(this._initWebglArgs);
        }

        onResize(args: core.ResizeArgs): void {
            this._initWebglArgs.SizeX = this._content._htmlElement.offsetWidth;
            this._initWebglArgs.SizeY = this._content._htmlElement.offsetHeight;
            this._canvas.init(this._initWebglArgs);
        }

        getContent(): Content {
            return this._content;
        }

        getCanvas(): WebglCanvas {
            return this._canvas;
        }

        addMotion(motion: core.IMotionAll): void {
            this._motions.add(motion);
        }

        removeMotion(motion: core.IMotionAll): void {
            this._motions.remove(motion);
        }

        mouseMove(e: any) {
            if (!e) e = window.event;
            this._motionArgs.X = e.clientX;
            this._motionArgs.Y = e.clientY;
            if (this._down) {
                this.motionMove(this._motionArgs);
                for (var node = this._motions.firstNode; node != null; node = node.next) {
                    node.element.motionMove(this._motionArgs);
                }
            }
            else {
                this.motionHover(this._motionArgs);
                for (var node = this._motions.firstNode; node != null; node = node.next) {
                    node.element.motionHover(this._motionArgs);
                }
            }
        }

        mouseDown(e: any) {
            if (!e) e = window.event;
            this._motionArgs.X = e.clientX;
            this._motionArgs.Y = e.clientY;
            this._down = true;
            this.motionDown(this._motionArgs);
            for (var node = this._motions.firstNode; node != null; node = node.next) {
                node.element.motionDown(this._motionArgs);
            }
        }

        mouseUp(e: any) {
            if (!e) e = window.event;
            this._motionArgs.X = e.clientX;
            this._motionArgs.Y = e.clientY;
            this._down = false;
            this.motionUp(this._motionArgs);
            for (var node = this._motions.firstNode; node != null; node = node.next) {
                node.element.motionUp(this._motionArgs);
            }
        }

        mouseLeave(e: any) {
            if (!e) e = window.event;
            this._down = false;
            this.motionLeave(this._motionArgs);
            for (var node = this._motions.firstNode; node != null; node = node.next) {
                node.element.motionLeave(this._motionArgs);
            }
        }
    }
}