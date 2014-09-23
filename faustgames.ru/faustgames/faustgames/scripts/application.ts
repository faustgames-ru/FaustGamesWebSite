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

module application {
    export class ApplicationInstance implements 
        core.ICreate,
        core.ILoad,
        core.IUpdate,
        core.IMotionAll {

        _lastTickCount: number;
        _creates: collections.LinkedList<core.ICreate> = new collections.LinkedList<core.ICreate>();
        _loads: collections.LinkedList<core.ILoad> = new collections.LinkedList<core.ILoad>();
        _upadates: collections.LinkedList<core.IUpdate> = new collections.LinkedList<core.IUpdate>();
        _motions: collections.LinkedList<core.IMotionAll> = new collections.LinkedList<core.IMotionAll>();

        _updateArgs: core.UpdateArgs = new core.UpdateArgs();
        _moveArgs: core.MouseMoveArgs = new core.MouseMoveArgs();
        _createArgs: core.CreateArgs = new core.CreateArgs();

        constructor() {
        }

        removeCreate(create: core.ICreate): void {
            this._creates.remove(create);
        }
        
        removeLoad(load: core.ILoad): void {
            this._loads.remove(load);
        }
        
        removeUpdate(update: core.IUpdate): void {
            this._upadates.remove(update);
        }

        removeMotion(motion: core.IMotionAll): void {
            this._motions.remove(motion);
        }

        addCreate(create: core.ICreate): void {
            this._creates.add(create);
        }

        addLoad(load: core.ILoad): void {
            this._loads.add(load);
        }

        addUpdate(update: core.IUpdate): void {
            this._upadates.add(update);
        }

        addMotion(motion: core.IMotionAll): void {
            this._motions.add(motion);
        }

        motionHover(args: core.MouseMoveArgs): void {
            for (var node = this._motions.firstNode; node != null; node = node.next) {
                node.element.motionHover(args);
            }
        }

        motionMove(args: core.MouseMoveArgs): void {
            for (var node = this._motions.firstNode; node != null; node = node.next) {
                node.element.motionMove(args);
            }
        }

        motionUp(args: core.MouseMoveArgs): void
        {
            for (var node = this._motions.firstNode; node != null; node = node.next) {
                node.element.motionUp(args);
            }
        }

        motionDown(args: core.MouseMoveArgs): void {
            for (var node = this._motions.firstNode; node != null; node = node.next) {
                node.element.motionDown(args);
            }
        }

        motionLeave(args: core.MouseMoveArgs): void {
            for (var node = this._motions.firstNode; node != null; node = node.next) {
                node.element.motionLeave(args);
            }
        }

        start(): void {
            this._lastTickCount = 0;
            this.create(this._createArgs);
            this.doUpdate();
        }

        doUpdate(): void {

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
            setTimeout(() => { this.doUpdate(); }, 0);
        }

        create(args: core.CreateArgs): void {
            for (var node = this._creates.firstNode; node != null; node = node.next) {
                node.element.create(args);
            }
        }

        load(args: core.LoadArgs): void {
            for (var node = this._loads.firstNode; node != null; node = node.next) {
                node.element.load(args);
            }
        }
       
        static LoadComplete: boolean = false;
        static Camera: entities.Camera;
        static TouchController: entities.TouchController;

        Scene: entities.Scene;

        update(args: core.UpdateArgs): void {
            /*
            gl.viewport(0, 0, canvas.offsetWidth, canvas.offsetHeight);
            gl.clearColor(0, 0, 0, 1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.disable(gl.CULL_FACE);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            if (Application.LoadComplete) {
                Application.Camera.setViewport(2.0, canvas.offsetWidth, canvas.offsetHeight);
                Application.Camera.update(args);
                Application.Camera.apply();
                
                var v = Application.Camera.getSkyBoxTransform().transform(mathematics.Vector.create(0, 0, 1));
                this._moveArgs.X = v.getX() * 1000;
                this._moveArgs.Y = v.getY() * 1000;
                this.mouseMove(this._moveArgs);
                this.Scene.update(args);
            }
            gl.flush();
            gl.finish();
            */
            for (var node = this._upadates.firstNode; node != null; node = node.next) {
                node.element.update(args);
            }
        }
    }

    export class Application {
        static Instance: ApplicationInstance = new ApplicationInstance();
        static View: views.BasicView;
        static Run(): void {
            Application.View = new views.BasicView();
            Application.Instance.addCreate(Application.View);
            Application.Instance.addUpdate(Application.View.getCanvas());
            Application.Instance.addMotion(Application.View);
            Application.Instance.start();
        }

        static Scene: entities.Scene;

        static unloadScene(): void {
            if (Application.Scene) {
                Application.View.removeMotion(Application.Scene);
                Application.View.getCanvas().removeRender(Application.Scene);
                Application.Instance.removeUpdate(Application.Scene);
                Application.Scene.unLoad();
            }
            Application.Scene = null;
        }
        static loadScene(scene: entities.Scene): void {
            Application.View.LockMotions = true;
            if (Application.Scene) {
                Application.unloadScene()
            }
            Application.Scene = scene;

            Application.View.addMotion(scene);
            Application.View.getCanvas().addRender(scene);
            Application.Instance.addUpdate(scene);
            var loadArgs = new core.LoadArgs();
            loadArgs.Loader = new core.Loader();

            scene.load(loadArgs).Callback = () => {
                Application.View.LockMotions = false;
            };
        }
    }
}

window.onload = () => {
    application.Application.Run();
    var sceneIndex = 0;
    var scenes: Array<entities.Scene> = [
        new asteroids.Scene(),
        new powerphone.Scene(),
        new coffee.Scene(),
        new springflowers.Scene(),
    ]

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
    if (!application.Application.View) return;
    var args = new core.ResizeArgs();
    application.Application.View.resize(args);
};