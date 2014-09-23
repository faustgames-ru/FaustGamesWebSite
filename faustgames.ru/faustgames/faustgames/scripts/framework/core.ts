/// <reference path="collections.ts"/>

module core {
    export interface IDisposable {
        dispose(): void
    }

    export interface ICreate {
        create(args: CreateArgs): void
    }

    export interface IResize {
        resize(args: ResizeArgs): void
    }

    export interface IMotionHover {
        motionHover(args: MouseMoveArgs): void
    }

    export interface IMotionMove {
        motionMove(args: MouseMoveArgs): void
    }

    export interface IMotionUp {
        motionUp(args: MouseMoveArgs): void
    }

    export interface IMotionDown {
        motionDown(args: MouseMoveArgs): void
    }

    export interface IMotionLeave {
        motionLeave(args: MouseMoveArgs): void
    }

    export interface IMotionAll extends IMotionHover, IMotionMove, IMotionUp, IMotionDown, IMotionLeave {
    }

    export interface ILoad {
        load(args: LoadArgs): void
    }

    export interface IUpdate {
        update(args: UpdateArgs): void
    }

    export class UpdateArgs {
        Delta: number
    }

    export class ResizeArgs {
        SizeX: number;
        SizeY: number;
    }

    export class MouseMoveArgs {
        X: number;
        Y: number;
    }

    export class LoadArgs {
        Loader: Loader;
    }

    export class CreateArgs {
    }

    export class Exception {
    }

    export class ExceptionAbstractMethodCall extends Exception {
    }

    export class ExceptionNotImplemented extends Exception {
    }

    export class AsyncAwaiter {
        IsExecuting: boolean = true;
        Callback: () => any;
        reset() {
            this.IsExecuting = true;
            this.Callback = null;
        }
        compleate(): void {
            this.IsExecuting = false;
            if (this.Callback != null)
                this.Callback();
        }
    }

    export class AsyncAwaiterEmpty extends AsyncAwaiter {
        constructor() {
            super();
            setTimeout(() => { this.compleate(); }, 10);
        }
    }

    class LoaderNode {
        Url: string;
        Callback: (v) => any;
        constructor(url: string, callback: (v) => any) {
            this.Url = url;
            this.Callback = callback;
        }
        doLoading(callback: () => any): void {
            throw new core.ExceptionAbstractMethodCall();
        }
    }

    class LoaderNodeText extends LoaderNode {
        constructor(url: string, callback: (v: string) => any) {
            super(url, callback);
        }

        doLoading(callback: () => any): void {
            var txtFile = new XMLHttpRequest();
            txtFile.open("GET", this.Url, true);
            txtFile.onload = () => {
                if (txtFile.readyState === 4) {
                    if (txtFile.status === 200) {
                        this.Callback(txtFile.responseText);
                    }
                }
                callback();
            };
            txtFile.send(null);
        }
    }

    class LoaderNodeFloat32Array extends LoaderNode {
        constructor(url: string, callback: (v: Float32Array) => any) {
            super(url, callback);
        }

        doLoading(callback: () => any): void {
            var file = new XMLHttpRequest();
            file.open("GET", this.Url, true);
            file.responseType = 'arraybuffer';
            file.onload = () => {
                if (file.readyState === 4) {
                    if (file.status === 200) {
                        var buffer = new Float32Array(file.response);
                        this.Callback(buffer);
                    }
                }
                callback();
            };
            file.send(null);
        }
    }

    class LoaderNodeUInt16Array extends LoaderNode {
        constructor(url: string, callback: (v: Uint16Array) => any) {
            super(url, callback);
        }

        doLoading(callback: () => any): void {
            var file = new XMLHttpRequest();
            file.open("GET", this.Url, true);
            file.responseType = 'arraybuffer';
            file.onload = () => {
                if (file.readyState === 4) {
                    if (file.status === 200) {
                        var buffer = new Uint16Array(file.response);
                        this.Callback(buffer);
                    }
                }
                callback();
            };
            file.send(null);
        }
    }


    class LoaderNodeImage extends LoaderNode {
        constructor(url: string, callback: (v: any) => any) {
            super(url, callback);
        }

        doLoading(callback: () => any): void {
            var image = new Image();
            image.onload = () => {
                this.Callback(image);
                callback();
            };
            image.src = this.Url;
        }
    }

    export class Loader {
        private _loads: collections.LinkedList<LoaderNode>;
        private _current: collections.ILinkedListNode<LoaderNode>;
        Callback: () => any = null;
        constructor() {
            this._loads = new collections.LinkedList<LoaderNode>();
        }
        addTextNode(url: string, callback: (v: string) => any): void {
            this._loads.add(new LoaderNodeText(url, callback))
        }
        addImageNode(url: string, callback: (v: any) => any): void {
            this._loads.add(new LoaderNodeImage(url, callback))
        }

        addFloat32ArrayNode(url: string, callback: (v: Float32Array) => any): void {
            this._loads.add(new LoaderNodeFloat32Array(url, callback))
        }

        addUInt16ArrayNode(url: string, callback: (v: Uint16Array) => any): void {
            this._loads.add(new LoaderNodeUInt16Array(url, callback))
        }

        _awaiter: AsyncAwaiter = new AsyncAwaiter();

        startLoadintg(callback: () => any): AsyncAwaiter {
            this._awaiter.reset();
            this._current = this._loads.firstNode;
            var result = new AsyncAwaiter();
            if (this._current == null) {
                setTimeout(() => {
                    callback();
                    this._awaiter.compleate();
                    
                }, 100);
            }
            else {
                setTimeout(() => this.LoadNext(callback), 100);
            }
            return this._awaiter;
        }
        LoadNext(callback: () => any): void {
            this._current.element.doLoading(() => {
                this._current = this._current.next;
                if (this._current == null) {
                    callback();
                    if (this.Callback != null)
                        this.Callback();
                }
                else {
                    this.LoadNext(callback);
                }
            });
        }
    }

    export class AsyncQueueNode {
        _action: () => any
        constructor(action: () => any) {
            this._action = action;
        }
        doAction(callback: () => any): void {
            if (this._action != null)
                this._action();
            setTimeout(() => callback(), 100);
        }
    }

    export class AsyncQueue {
        private _actions: collections.LinkedList<AsyncQueueNode>;
        private _current: collections.ILinkedListNode<AsyncQueueNode>;
        Callback: () => any = null;

        constructor() {
            this._actions = new collections.LinkedList<AsyncQueueNode>();
        }
        addAction(action: () => any): void {
            this._actions.add(new AsyncQueueNode(action))
        }

        _awaiter: AsyncAwaiter = new AsyncAwaiter();
        
        start(): AsyncAwaiter {
            this._awaiter.reset();
            this._current = this._actions.firstNode;
            var result = new AsyncAwaiter();
            if (this._current == null) {
                setTimeout(() => {
                    this._awaiter.compleate();
                }, 100);
            }
            else {
                setTimeout(() => this.startNext(), 100);
            }
            return this._awaiter;
        }

        startNext(): void {
            this._current.element.doAction(() => {
                this._current = this._current.next;
                if (this._current == null) {
                    if (this.Callback != null)
                        this.Callback();
                }
                else {
                    this.startNext();
                }
            });
        }
    }
} 