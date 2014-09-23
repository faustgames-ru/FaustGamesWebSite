/// <reference path="collections.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var core;
(function (core) {
    var UpdateArgs = (function () {
        function UpdateArgs() {
        }
        return UpdateArgs;
    })();
    core.UpdateArgs = UpdateArgs;

    var ResizeArgs = (function () {
        function ResizeArgs() {
        }
        return ResizeArgs;
    })();
    core.ResizeArgs = ResizeArgs;

    var MouseMoveArgs = (function () {
        function MouseMoveArgs() {
        }
        return MouseMoveArgs;
    })();
    core.MouseMoveArgs = MouseMoveArgs;

    var LoadArgs = (function () {
        function LoadArgs() {
        }
        return LoadArgs;
    })();
    core.LoadArgs = LoadArgs;

    var CreateArgs = (function () {
        function CreateArgs() {
        }
        return CreateArgs;
    })();
    core.CreateArgs = CreateArgs;

    var Exception = (function () {
        function Exception() {
        }
        return Exception;
    })();
    core.Exception = Exception;

    var ExceptionAbstractMethodCall = (function (_super) {
        __extends(ExceptionAbstractMethodCall, _super);
        function ExceptionAbstractMethodCall() {
            _super.apply(this, arguments);
        }
        return ExceptionAbstractMethodCall;
    })(Exception);
    core.ExceptionAbstractMethodCall = ExceptionAbstractMethodCall;

    var ExceptionNotImplemented = (function (_super) {
        __extends(ExceptionNotImplemented, _super);
        function ExceptionNotImplemented() {
            _super.apply(this, arguments);
        }
        return ExceptionNotImplemented;
    })(Exception);
    core.ExceptionNotImplemented = ExceptionNotImplemented;

    var AsyncAwaiter = (function () {
        function AsyncAwaiter() {
            this.IsExecuting = true;
        }
        AsyncAwaiter.prototype.reset = function () {
            this.IsExecuting = true;
            this.Callback = null;
        };
        AsyncAwaiter.prototype.compleate = function () {
            this.IsExecuting = false;
            if (this.Callback != null)
                this.Callback();
        };
        return AsyncAwaiter;
    })();
    core.AsyncAwaiter = AsyncAwaiter;

    var AsyncAwaiterEmpty = (function (_super) {
        __extends(AsyncAwaiterEmpty, _super);
        function AsyncAwaiterEmpty() {
            var _this = this;
            _super.call(this);
            setTimeout(function () {
                _this.compleate();
            }, 10);
        }
        return AsyncAwaiterEmpty;
    })(AsyncAwaiter);
    core.AsyncAwaiterEmpty = AsyncAwaiterEmpty;

    var LoaderNode = (function () {
        function LoaderNode(url, callback) {
            this.Url = url;
            this.Callback = callback;
        }
        LoaderNode.prototype.doLoading = function (callback) {
            throw new core.ExceptionAbstractMethodCall();
        };
        return LoaderNode;
    })();

    var LoaderNodeText = (function (_super) {
        __extends(LoaderNodeText, _super);
        function LoaderNodeText(url, callback) {
            _super.call(this, url, callback);
        }
        LoaderNodeText.prototype.doLoading = function (callback) {
            var _this = this;
            var txtFile = new XMLHttpRequest();
            txtFile.open("GET", this.Url, true);
            txtFile.onload = function () {
                if (txtFile.readyState === 4) {
                    if (txtFile.status === 200) {
                        _this.Callback(txtFile.responseText);
                    }
                }
                callback();
            };
            txtFile.send(null);
        };
        return LoaderNodeText;
    })(LoaderNode);

    var LoaderNodeFloat32Array = (function (_super) {
        __extends(LoaderNodeFloat32Array, _super);
        function LoaderNodeFloat32Array(url, callback) {
            _super.call(this, url, callback);
        }
        LoaderNodeFloat32Array.prototype.doLoading = function (callback) {
            var _this = this;
            var file = new XMLHttpRequest();
            file.open("GET", this.Url, true);
            file.responseType = 'arraybuffer';
            file.onload = function () {
                if (file.readyState === 4) {
                    if (file.status === 200) {
                        var buffer = new Float32Array(file.response);
                        _this.Callback(buffer);
                    }
                }
                callback();
            };
            file.send(null);
        };
        return LoaderNodeFloat32Array;
    })(LoaderNode);

    var LoaderNodeUInt16Array = (function (_super) {
        __extends(LoaderNodeUInt16Array, _super);
        function LoaderNodeUInt16Array(url, callback) {
            _super.call(this, url, callback);
        }
        LoaderNodeUInt16Array.prototype.doLoading = function (callback) {
            var _this = this;
            var file = new XMLHttpRequest();
            file.open("GET", this.Url, true);
            file.responseType = 'arraybuffer';
            file.onload = function () {
                if (file.readyState === 4) {
                    if (file.status === 200) {
                        var buffer = new Uint16Array(file.response);
                        _this.Callback(buffer);
                    }
                }
                callback();
            };
            file.send(null);
        };
        return LoaderNodeUInt16Array;
    })(LoaderNode);

    var LoaderNodeImage = (function (_super) {
        __extends(LoaderNodeImage, _super);
        function LoaderNodeImage(url, callback) {
            _super.call(this, url, callback);
        }
        LoaderNodeImage.prototype.doLoading = function (callback) {
            var _this = this;
            var image = new Image();
            image.onload = function () {
                _this.Callback(image);
                callback();
            };
            image.src = this.Url;
        };
        return LoaderNodeImage;
    })(LoaderNode);

    var Loader = (function () {
        function Loader() {
            this.Callback = null;
            this._awaiter = new AsyncAwaiter();
            this._loads = new collections.LinkedList();
        }
        Loader.prototype.addTextNode = function (url, callback) {
            this._loads.add(new LoaderNodeText(url, callback));
        };
        Loader.prototype.addImageNode = function (url, callback) {
            this._loads.add(new LoaderNodeImage(url, callback));
        };

        Loader.prototype.addFloat32ArrayNode = function (url, callback) {
            this._loads.add(new LoaderNodeFloat32Array(url, callback));
        };

        Loader.prototype.addUInt16ArrayNode = function (url, callback) {
            this._loads.add(new LoaderNodeUInt16Array(url, callback));
        };

        Loader.prototype.startLoadintg = function (callback) {
            var _this = this;
            this._awaiter.reset();
            this._current = this._loads.firstNode;
            var result = new AsyncAwaiter();
            if (this._current == null) {
                setTimeout(function () {
                    callback();
                    _this._awaiter.compleate();
                }, 100);
            } else {
                setTimeout(function () {
                    return _this.LoadNext(callback);
                }, 100);
            }
            return this._awaiter;
        };
        Loader.prototype.LoadNext = function (callback) {
            var _this = this;
            this._current.element.doLoading(function () {
                _this._current = _this._current.next;
                if (_this._current == null) {
                    callback();
                    if (_this.Callback != null)
                        _this.Callback();
                } else {
                    _this.LoadNext(callback);
                }
            });
        };
        return Loader;
    })();
    core.Loader = Loader;

    var AsyncQueueNode = (function () {
        function AsyncQueueNode(action) {
            this._action = action;
        }
        AsyncQueueNode.prototype.doAction = function (callback) {
            if (this._action != null)
                this._action();
            setTimeout(function () {
                return callback();
            }, 100);
        };
        return AsyncQueueNode;
    })();
    core.AsyncQueueNode = AsyncQueueNode;

    var AsyncQueue = (function () {
        function AsyncQueue() {
            this.Callback = null;
            this._awaiter = new AsyncAwaiter();
            this._actions = new collections.LinkedList();
        }
        AsyncQueue.prototype.addAction = function (action) {
            this._actions.add(new AsyncQueueNode(action));
        };

        AsyncQueue.prototype.start = function () {
            var _this = this;
            this._awaiter.reset();
            this._current = this._actions.firstNode;
            var result = new AsyncAwaiter();
            if (this._current == null) {
                setTimeout(function () {
                    _this._awaiter.compleate();
                }, 100);
            } else {
                setTimeout(function () {
                    return _this.startNext();
                }, 100);
            }
            return this._awaiter;
        };

        AsyncQueue.prototype.startNext = function () {
            var _this = this;
            this._current.element.doAction(function () {
                _this._current = _this._current.next;
                if (_this._current == null) {
                    if (_this.Callback != null)
                        _this.Callback();
                } else {
                    _this.startNext();
                }
            });
        };
        return AsyncQueue;
    })();
    core.AsyncQueue = AsyncQueue;
})(core || (core = {}));
//# sourceMappingURL=core.js.map
