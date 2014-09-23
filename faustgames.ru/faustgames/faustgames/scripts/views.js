/// <reference path="framework/collections.ts"/>
/// <reference path="framework/core.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var views;
(function (views) {
    var Control = (function () {
        function Control(elementId) {
            this._elementId = elementId;
            this._htmlElement = window.document.getElementById(elementId);
            this._controls = new collections.LinkedList();
        }
        Control.prototype.create = function (args) {
            this.onCreate(args);
            for (var node = this._controls.firstNode; node != null; node = node.next) {
                node.element.create(args);
            }
        };

        Control.prototype.resize = function (args) {
            //this._htmlElement = window.document.getElementById(this._elementId);
            this.onResize(args);
            for (var node = this._controls.firstNode; node != null; node = node.next) {
                node.element.resize(args);
            }
        };

        Control.prototype.motionHover = function (args) {
            this.onMotionHover(args);
            for (var node = this._controls.firstNode; node != null; node = node.next) {
                node.element.motionMove(args);
            }
        };

        Control.prototype.motionMove = function (args) {
            this.onMotionMove(args);
            for (var node = this._controls.firstNode; node != null; node = node.next) {
                node.element.motionMove(args);
            }
        };

        Control.prototype.motionUp = function (args) {
            this.onMotionUp(args);
            for (var node = this._controls.firstNode; node != null; node = node.next) {
                node.element.motionUp(args);
            }
        };

        Control.prototype.motionDown = function (args) {
            this.onMotionDown(args);
            for (var node = this._controls.firstNode; node != null; node = node.next) {
                node.element.motionDown(args);
            }
        };

        Control.prototype.motionLeave = function (args) {
            this.onMotionLeave(args);
            for (var node = this._controls.firstNode; node != null; node = node.next) {
                node.element.motionLeave(args);
            }
        };

        Control.prototype.onCreate = function (args) {
        };

        Control.prototype.onResize = function (args) {
        };

        Control.prototype.onMotionHover = function (args) {
        };

        Control.prototype.onMotionMove = function (args) {
        };

        Control.prototype.onMotionUp = function (args) {
        };

        Control.prototype.onMotionDown = function (args) {
        };

        Control.prototype.onMotionLeave = function (args) {
        };

        Control.prototype.createControl = function (type, elementId) {
            var newControl = new type(elementId);
            this._controls.add(newControl);
            return newControl;
        };
        return Control;
    })();
    views.Control = Control;

    var AnimatedPanel = (function (_super) {
        __extends(AnimatedPanel, _super);
        function AnimatedPanel() {
            _super.apply(this, arguments);
        }
        AnimatedPanel.prototype.onCreate = function (args) {
        };
        AnimatedPanel.prototype.onMotionMove = function (args) {
            var x = args.X;
            var y = args.Y;
            this._htmlElement.style.backgroundPosition = "0 0, " + ((-x + y) * 0.1) + "px " + "0, " + ((-x + y) * 0.1) + "px " + " 0, 0 0, 0 0";
        };
        return AnimatedPanel;
    })(Control);
    views.AnimatedPanel = AnimatedPanel;

    var Header = (function (_super) {
        __extends(Header, _super);
        function Header() {
            _super.apply(this, arguments);
        }
        return Header;
    })(AnimatedPanel);
    views.Header = Header;

    var Footer = (function (_super) {
        __extends(Footer, _super);
        function Footer() {
            _super.apply(this, arguments);
        }
        return Footer;
    })(AnimatedPanel);
    views.Footer = Footer;

    var InitWebglArgs = (function () {
        function InitWebglArgs() {
        }
        return InitWebglArgs;
    })();
    views.InitWebglArgs = InitWebglArgs;

    var WebglCanvas = (function (_super) {
        __extends(WebglCanvas, _super);
        function WebglCanvas() {
            _super.apply(this, arguments);
            this._graphicsDevice = new rendering.GraphicsDevice();
            this._renderList = new collections.LinkedList();
            this._renderArgs = new rendering.RenderArgs();
            this._clearState = rendering.ClearState.create(mathematics.Color.fromRGBA(0.0, 0.0, 0.0, 1.0), 1.0);
        }
        WebglCanvas.prototype.init = function (args) {
            gl = null;
            var canvas = this._htmlElement;
            canvas.width = args.SizeX;
            canvas.height = args.SizeY;
            try  {
                // Try to grab the standard context. If it fails, fallback to experimental.
                gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            } catch (e) {
            }

            // If we don't have a GL context, give up now
            if (!gl) {
                alert("Unable to initialize WebGL. Your browser may not support it.");
                gl = null;
                return null;
            }

            this._graphicsDevice.setClearState(this._clearState);
            this._graphicsDevice.setDepthState(rendering.DepthTestModes.ReadWrite);
            this._graphicsDevice.clearColorDepth();
        };

        WebglCanvas.prototype.addRender = function (render) {
            this._renderList.add(render);
        };

        WebglCanvas.prototype.removeRender = function (render) {
            this._renderList.remove(render);
        };

        WebglCanvas.prototype.update = function (args) {
            if (!gl)
                return;
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
        };
        return WebglCanvas;
    })(Control);
    views.WebglCanvas = WebglCanvas;

    var Content = (function (_super) {
        __extends(Content, _super);
        function Content() {
            _super.apply(this, arguments);
        }
        return Content;
    })(Control);
    views.Content = Content;

    var LoadingPanel = (function (_super) {
        __extends(LoadingPanel, _super);
        function LoadingPanel() {
            _super.apply(this, arguments);
        }
        return LoadingPanel;
    })(Control);
    views.LoadingPanel = LoadingPanel;

    var TextPanel = (function (_super) {
        __extends(TextPanel, _super);
        function TextPanel() {
            _super.apply(this, arguments);
        }
        return TextPanel;
    })(Control);
    views.TextPanel = TextPanel;

    var BasicView = (function (_super) {
        __extends(BasicView, _super);
        function BasicView() {
            var _this = this;
            _super.call(this, "body");
            this._initWebglArgs = new InitWebglArgs();
            this._down = false;
            this._motionArgs = new core.MouseMoveArgs();
            this._motions = new collections.LinkedList();

            this._htmlElement.onmousemove = function (e) {
                _this.mouseMove(e);
            };
            this._htmlElement.onmousedown = function (e) {
                _this.mouseDown(e);
            };
            this._htmlElement.onmouseup = function (e) {
                _this.mouseUp(e);
            };
            this._htmlElement.onmouseleave = function (e) {
                _this.mouseLeave(e);
            };

            this._header = this.createControl(Header, "header");
            this._content = this.createControl(Content, "content");
            this._canvas = this.createControl(WebglCanvas, "glcanvas");
            this._footer = this.createControl(Footer, "footer");

            this._initWebglArgs.SizeX = this._content._htmlElement.offsetWidth;
            this._initWebglArgs.SizeY = this._content._htmlElement.offsetHeight;
            this._canvas.init(this._initWebglArgs);
        }
        BasicView.prototype.onResize = function (args) {
            this._initWebglArgs.SizeX = this._content._htmlElement.offsetWidth;
            this._initWebglArgs.SizeY = this._content._htmlElement.offsetHeight;
            this._canvas.init(this._initWebglArgs);
        };

        BasicView.prototype.getContent = function () {
            return this._content;
        };

        BasicView.prototype.getCanvas = function () {
            return this._canvas;
        };

        BasicView.prototype.addMotion = function (motion) {
            this._motions.add(motion);
        };

        BasicView.prototype.removeMotion = function (motion) {
            this._motions.remove(motion);
        };

        BasicView.prototype.mouseMove = function (e) {
            if (!e)
                e = window.event;
            this._motionArgs.X = e.clientX;
            this._motionArgs.Y = e.clientY;
            if (this._down) {
                this.motionMove(this._motionArgs);
                for (var node = this._motions.firstNode; node != null; node = node.next) {
                    node.element.motionMove(this._motionArgs);
                }
            } else {
                this.motionHover(this._motionArgs);
                for (var node = this._motions.firstNode; node != null; node = node.next) {
                    node.element.motionHover(this._motionArgs);
                }
            }
        };

        BasicView.prototype.mouseDown = function (e) {
            if (!e)
                e = window.event;
            this._motionArgs.X = e.clientX;
            this._motionArgs.Y = e.clientY;
            this._down = true;
            this.motionDown(this._motionArgs);
            for (var node = this._motions.firstNode; node != null; node = node.next) {
                node.element.motionDown(this._motionArgs);
            }
        };

        BasicView.prototype.mouseUp = function (e) {
            if (!e)
                e = window.event;
            this._motionArgs.X = e.clientX;
            this._motionArgs.Y = e.clientY;
            this._down = false;
            this.motionUp(this._motionArgs);
            for (var node = this._motions.firstNode; node != null; node = node.next) {
                node.element.motionUp(this._motionArgs);
            }
        };

        BasicView.prototype.mouseLeave = function (e) {
            if (!e)
                e = window.event;
            this._down = false;
            this.motionLeave(this._motionArgs);
            for (var node = this._motions.firstNode; node != null; node = node.next) {
                node.element.motionLeave(this._motionArgs);
            }
        };
        return BasicView;
    })(Control);
    views.BasicView = BasicView;
})(views || (views = {}));
//# sourceMappingURL=views.js.map
