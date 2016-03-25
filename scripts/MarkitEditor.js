/// <reference path="ToolsManager.ts" />
var markit;
(function (markit) {
    var MarkitEditor = (function () {
        function MarkitEditor() {
        }
        MarkitEditor.prototype.init = function (canvasId) {
            this.canvas = document.getElementById(canvasId);
            this.toolsManager = new markit.ToolsManager(this.canvas);
            this.toolsManager.init();
        };
        return MarkitEditor;
    })();
    markit.MarkitEditor = MarkitEditor;
})(markit || (markit = {}));
//# sourceMappingURL=MarkitEditor.js.map