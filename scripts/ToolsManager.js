var markit;
(function (markit) {
    var ToolsManager = (function () {
        function ToolsManager(canvas) {
            this.canvas = canvas;
        }
        ToolsManager.prototype.init = function () {
            var toolbar = document.createElement("div");
            this.tools = this.createTools();
            this.tools.forEach(function (e) {
                toolbar.appendChild(e);
            });
            this.canvas.ondrag = this.ondrag;
            this.canvas.ondragstart = this.ondragstart;
            this.canvas.ondragend = this.ondragend;
            this.canvas.onclick = this.onclick;
            this.canvas.parentNode.insertBefore(toolbar, this.canvas);
        };
        ToolsManager.prototype.createTools = function () {
            var tools = new Array();
            var btn = document.createElement("button");
            btn.id = "markit_btnPtr";
            btn.innerText = "Ptr";
            btn.onclick = this.onclick;
            tools.push(btn);
            btn = document.createElement("button");
            btn.id = "markit_btnLine";
            btn.innerText = "Line";
            btn.onclick = this.onclick;
            tools.push(btn);
            btn = document.createElement("button");
            btn.id = "markit_btnRect";
            btn.innerText = "Rectangle";
            btn.onclick = this.onclick;
            tools.push(btn);
            btn = document.createElement("button");
            btn.id = "markit_Ellipse";
            btn.innerText = "Ellipse";
            btn.onclick = this.onclick;
            tools.push(btn);
            return tools;
        };
        ToolsManager.prototype.onclick = function (e) {
            console.log("id: " + e.target.id.toString() + ", " + e.clientX.toString() + ", " + e.clientY.toString());
        };
        ToolsManager.prototype.ondrag = function (e) {
            console.log("id: " + e.target.id.toString() + ", " + e.clientX.toString() + ", " + e.clientY.toString());
        };
        ToolsManager.prototype.ondragstart = function (e) {
            console.log("id: " + e.target.id.toString() + ", " + e.clientX.toString() + ", " + e.clientY.toString());
        };
        ToolsManager.prototype.ondragend = function (e) {
            console.log("id: " + e.target.id.toString() + ", " + e.clientX.toString() + ", " + e.clientY.toString());
        };
        return ToolsManager;
    })();
    markit.ToolsManager = ToolsManager;
})(markit || (markit = {}));
//# sourceMappingURL=ToolsManager.js.map