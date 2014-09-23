/// <reference path="framework/system.ts"/>
/// <reference path="framework/collections.ts"/>
/// <reference path="framework/core.ts"/>
/// <reference path="framework/math.ts"/>
/// <reference path="framework/rendering.ts"/>
/// <reference path="rendering/effects.ts"/>
/// <reference path="entities/entities.ts"/>
/// <reference path="views.ts"/>
/// <reference path="scenes/Asteroids.ts"/>
/// <reference path="scenes/powerphone.ts"/>
/// <reference path="scenes/coffee.ts"/>
/// <reference path="scenes/springflowers.ts"/>
/*
function initWebGL(canvas) {
gl = null;
var content = document.getElementById("content");;
canvas.width = content.offsetWidth;
canvas.height = content.offsetHeight;
try {
// Try to grab the standard context. If it fails, fallback to experimental.
gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
}
catch (e) { }
// If we don't have a GL context, give up now
if (!gl) {
alert("Unable to initialize WebGL. Your browser may not support it.");
gl = null;
}
return gl;
}
var canvas;
var down = false;
var app: application.ApplicationInstance;
*/
/*
function mouseMove(e) {
if (!application.Application.TouchController) return;
if (!e) e = window.event;
if (down) {
application.Application.TouchController.move(mathematics.Vector.create(e.clientX, e.clientY, 0));
}
else {
application.Application.TouchController.moveSlow(mathematics.Vector.create(e.clientX, e.clientY, 0))
}
//app.mouseMove(e.clientX, e.clientY);
}
function mouseDown(e) {
if (!application.Application.TouchController) return;
if (!e) e = window.event;
down = true;
application.Application.TouchController.down(mathematics.Vector.create(e.clientX, e.clientY, 0));
}
function mouseUp(e) {
if (!application.Application.TouchController) return;
if (!e) e = window.event;
down = false;
application.Application.TouchController.up(mathematics.Vector.create(e.clientX, e.clientY, 0));
}
function mouseLeave(e) {
if (!application.Application.TouchController) return;
if (!e) e = window.event;
down = false;
application.Application.TouchController.leaveSlow(mathematics.Vector.create(e.clientX, e.clientY, 0));
}
function start() {
canvas = document.getElementById("glcanvas");
document.body.onmousemove = mouseMove;
document.body.onmousedown = mouseDown;
document.body.onmouseup = mouseUp;
document.body.onmouseleave = mouseLeave;
gl = initWebGL(canvas);      // Initialize the GL context
// Only continue if WebGL is available and working
if (gl) {
gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
gl.clearDepth(1.0);
gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
}
}
*/
var application;
(function (application) {
    var ApplicationInstance = (function () {
        function ApplicationInstance() {
            this._creates = new collections.LinkedList();
            this._loads = new collections.LinkedList();
            this._upadates = new collections.LinkedList();
            this._motions = new collections.LinkedList();
            this._updateArgs = new core.UpdateArgs();
            this._moveArgs = new core.MouseMoveArgs();
            this._createArgs = new core.CreateArgs();
        }
        ApplicationInstance.prototype.removeCreate = function (create) {
            this._creates.remove(create);
        };

        ApplicationInstance.prototype.removeLoad = function (load) {
            this._loads.remove(load);
        };

        ApplicationInstance.prototype.removeUpdate = function (update) {
            this._upadates.remove(update);
        };

        ApplicationInstance.prototype.removeMotion = function (motion) {
            this._motions.remove(motion);
        };

        ApplicationInstance.prototype.addCreate = function (create) {
            this._creates.add(create);
        };

        ApplicationInstance.prototype.addLoad = function (load) {
            this._loads.add(load);
        };

        ApplicationInstance.prototype.addUpdate = function (update) {
            this._upadates.add(update);
        };

        ApplicationInstance.prototype.addMotion = function (motion) {
            this._motions.add(motion);
        };

        ApplicationInstance.prototype.motionHover = function (args) {
            for (var node = this._motions.firstNode; node != null; node = node.next) {
                node.element.motionHover(args);
            }
        };

        ApplicationInstance.prototype.motionMove = function (args) {
            for (var node = this._motions.firstNode; node != null; node = node.next) {
                node.element.motionMove(args);
            }
        };

        ApplicationInstance.prototype.motionUp = function (args) {
            for (var node = this._motions.firstNode; node != null; node = node.next) {
                node.element.motionUp(args);
            }
        };

        ApplicationInstance.prototype.motionDown = function (args) {
            for (var node = this._motions.firstNode; node != null; node = node.next) {
                node.element.motionDown(args);
            }
        };

        ApplicationInstance.prototype.motionLeave = function (args) {
            for (var node = this._motions.firstNode; node != null; node = node.next) {
                node.element.motionLeave(args);
            }
        };

        ApplicationInstance.prototype.start = function () {
            this._lastTickCount = 0;
            this.create(this._createArgs);
            this.doUpdate();
        };

        ApplicationInstance.prototype.doUpdate = function () {
            var _this = this;
            var tickCount = system.environment.getTickCount();
            if (this._lastTickCount == 0) {
                this._lastTickCount = tickCount;
            }
            var delta = (tickCount - this._lastTickCount) / 1000;
            if (delta < 0.001)
                delta = 0.001;
            this._updateArgs.Delta = delta;
            this.update(this._updateArgs);
            this._lastTickCount = tickCount;
            setTimeout(function () {
                _this.doUpdate();
            }, 0);
        };

        ApplicationInstance.prototype.create = function (args) {
            for (var node = this._creates.firstNode; node != null; node = node.next) {
                node.element.create(args);
            }
        };

        ApplicationInstance.prototype.load = function (args) {
            for (var node = this._loads.firstNode; node != null; node = node.next) {
                node.element.load(args);
            }
        };

        ApplicationInstance.prototype.update = function (args) {
            for (var node = this._upadates.firstNode; node != null; node = node.next) {
                node.element.update(args);
            }
        };
        ApplicationInstance.LoadComplete = false;
        return ApplicationInstance;
    })();
    application.ApplicationInstance = ApplicationInstance;

    var Application = (function () {
        function Application() {
        }
        Application.Run = function () {
            Application.View = new views.BasicView();
            Application.Instance.addCreate(Application.View);
            Application.Instance.addUpdate(Application.View.getCanvas());
            Application.Instance.addMotion(Application.View);
            Application.Instance.start();
        };

        Application.unloadScene = function () {
            if (Application.Scene) {
                Application.View.removeMotion(Application.Scene);
                Application.View.getCanvas().removeRender(Application.Scene);
                Application.Instance.removeUpdate(Application.Scene);
                Application.Scene.unLoad();
            }
            Application.Scene = null;
        };
        Application.loadScene = function (scene) {
            Application.View.LockMotions = true;
            if (Application.Scene) {
                Application.unloadScene();
            }
            Application.Scene = scene;

            Application.View.addMotion(scene);
            Application.View.getCanvas().addRender(scene);
            Application.Instance.addUpdate(scene);
            var loadArgs = new core.LoadArgs();
            loadArgs.Loader = new core.Loader();

            scene.load(loadArgs).Callback = function () {
                Application.View.LockMotions = false;
            };
        };
        Application.Instance = new ApplicationInstance();
        return Application;
    })();
    application.Application = Application;
})(application || (application = {}));

window.onload = function () {
    application.Application.Run();
    var sceneIndex = 0;
    var scenes = [
        new asteroids.Scene(),
        new powerphone.Scene(),
        new coffee.Scene(),
        new springflowers.Scene()
    ];

    application.Application.loadScene(scenes[sceneIndex]);
    /*
    var nextScene = () => {
    sceneIndex++;
    sceneIndex %= scenes.length;
    application.Application.loadScene(scenes[sceneIndex]);
    setTimeout(nextScene, 10000);
    };
    setTimeout(nextScene, 10000);
    */
};

window.onresize = function (event) {
    if (!application.Application.View)
        return;
    var args = new core.ResizeArgs();
    application.Application.View.resize(args);
};
//# sourceMappingURL=application.js.map
