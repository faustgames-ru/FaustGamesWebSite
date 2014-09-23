var system;
(function (system) {
    var environment = (function () {
        function environment() {
        }
        environment.getTickCount = function () {
            var d = new Date();
            return d.getTime();
        };
        return environment;
    })();
    system.environment = environment;
})(system || (system = {}));
//# sourceMappingURL=system.js.map
