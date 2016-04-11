var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var markit;
(function (markit) {
    (function (CommandMode) {
        CommandMode[CommandMode["None"] = 0] = "None";
        CommandMode[CommandMode["Select"] = 1] = "Select";
        CommandMode[CommandMode["Line"] = 2] = "Line";
        CommandMode[CommandMode["Rectangle"] = 3] = "Rectangle";
        CommandMode[CommandMode["Ellipse"] = 4] = "Ellipse";
        CommandMode[CommandMode["Arrow"] = 5] = "Arrow";
    })(markit.CommandMode || (markit.CommandMode = {}));
    var CommandMode = markit.CommandMode;
    var ToolSettings = (function () {
        function ToolSettings() {
            this.commandMode = CommandMode.None;
            this.width = 1;
            this.height = 1;
            this.strokeWidth = 2;
            this.stroke = "#000";
            this.fill = "none";
        }
        return ToolSettings;
    }());
    markit.ToolSettings = ToolSettings;
})(markit || (markit = {}));
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="ToolSettings.ts" />
var markit;
(function (markit) {
    var Shape = (function () {
        function Shape(surface, origin, toolSettings) {
            if (typeof surface == "undefined" || surface == null) {
                throw "surface parameter is required.";
            }
            if (typeof origin == "undefined" || origin == null) {
                throw "origin parameter is required.";
            }
            if (typeof toolSettings == "undefined" || toolSettings == null) {
                throw "toolSettings parameter is required.";
            }
            this._surface = surface;
            this._origin = origin;
            this._toolSettings = toolSettings;
        }
        Object.defineProperty(Shape.prototype, "origin", {
            get: function () {
                return this._origin;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shape.prototype, "element", {
            get: function () {
                return this._element;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shape.prototype, "toolSettings", {
            get: function () {
                return this._toolSettings;
            },
            enumerable: true,
            configurable: true
        });
        Shape.prototype.removeElement = function () {
            if (typeof this._element !== "undefined" && this._element !== null) {
                this._element.remove();
                this._element = null;
            }
        };
        Shape.prototype.setToolSettings = function (settings) {
            if (typeof settings == "undefined" || settings == null) {
                throw "settings parameter is required.";
            }
            this._toolSettings = settings;
        };
        return Shape;
    }());
    markit.Shape = Shape;
})(markit || (markit = {}));
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="Shape.ts" />
/// <reference path="ToolSettings.ts" />
var markit;
(function (markit) {
    var Arrow = (function (_super) {
        __extends(Arrow, _super);
        function Arrow(surface, origin, toolSettings) {
            _super.call(this, surface, origin, toolSettings);
        }
        Arrow.prototype.draw = function (coords) {
            if (typeof coords == "undefined" || coords == null) {
                throw "coords parameter is required.";
            }
            if (typeof this.arrowHead == "undefined" || this.arrowHead == null) {
                var vertices = this.getVertices(this.origin);
                var angle = this.calculateAngle(coords);
                this.arrowHead = this._surface.polygon(vertices);
                this.arrowHead.attr({
                    points: this.getPoints(coords)
                });
                var centre = this.getMidPoint(this.getVertices(coords));
                var str = "rotate(" + angle + ", " + centre.x + ", " + centre.y + ")";
                console.log("transform string: " + str);
                this.arrowHead.transform(str);
                this.arrowHead.attr({
                    stroke: this._toolSettings.stroke,
                    strokeWidth: this._toolSettings.strokeWidth,
                    fill: this._toolSettings.stroke
                });
                this.line = this._surface.line(this.origin.x, this.origin.y, centre.x, centre.y);
                this.line.attr({
                    stroke: this._toolSettings.stroke,
                    strokeWidth: this._toolSettings.strokeWidth
                });
            }
            else {
                var angle = this.calculateAngle(coords);
                this.arrowHead.attr({
                    points: this.getPoints(coords)
                });
                var centre = this.getMidPoint(this.getVertices(coords));
                var str = "rotate(" + angle + ", " + centre.x + ", " + centre.y + ")";
                console.log("transform string: " + str);
                this.arrowHead.transform(str);
                this.line.attr({
                    x2: centre.x,
                    y2: centre.y
                });
            }
        };
        Arrow.prototype.drawComplete = function () {
            this._element = this._surface.group(this.arrowHead, this.line);
        };
        Arrow.prototype.setToolSettings = function (settings) {
            _super.prototype.setToolSettings.call(this, settings);
            this._element.attr({
                stroke: this._toolSettings.stroke,
                strokeWidth: this._toolSettings.strokeWidth,
                fill: this._toolSettings.fill
            });
        };
        Arrow.prototype.removeElement = function () {
            _super.prototype.removeElement.call(this);
            if (typeof this.arrowHead !== "undefined" && this.arrowHead !== null) {
                this.arrowHead.remove();
                this.arrowHead = null;
            }
            if (typeof this.line !== "undefined" && this.line !== null) {
                this.line.remove();
                this.line = null;
            }
        };
        Arrow.prototype.calculateAngle = function (coords) {
            var dX = coords.x - this.origin.x;
            var dY = coords.y - this.origin.y;
            var angle = Math.atan2(dY, dX) / Math.PI * 180;
            return Math.round(angle);
        };
        Arrow.prototype.getPoints = function (coords) {
            var points = [];
            var vertices = this.getVertices(coords);
            for (var i = 0; i < vertices.length; i++) {
                points.push(vertices[i][0]);
                points.push(vertices[i][1]);
            }
            var str = points[0] + "," + points[1] + " " + points[2] + "," + points[3] + " " + points[4] + "," + points[5];
            console.log("points: " + str);
            return str;
        };
        Arrow.prototype.getVertices = function (coords) {
            var vertices = [
                [coords.x, coords.y - 10],
                [coords.x + 20, coords.y],
                [coords.x, coords.y + 10]
            ];
            return vertices;
        };
        Arrow.prototype.getMidPoint = function (vertices) {
            var midpoint;
            var mX = Math.round((vertices[0][0] + vertices[1][0] + vertices[2][0]) / 3);
            var mY = Math.round((vertices[0][1] + vertices[1][1] + vertices[2][1]) / 3);
            midpoint = { x: mX, y: mY };
            return midpoint;
        };
        return Arrow;
    }(markit.Shape));
    markit.Arrow = Arrow;
})(markit || (markit = {}));
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="Shape.ts" />
/// <reference path="toolSettings.ts" />
var markit;
(function (markit) {
    var Ellipse = (function (_super) {
        __extends(Ellipse, _super);
        function Ellipse(surface, origin, toolSettings) {
            _super.call(this, surface, origin, toolSettings);
        }
        Ellipse.prototype.draw = function (coords) {
            if (typeof coords == "undefined" || coords == null) {
                throw "coords parameter is required.";
            }
            var endpoints = this.getEndpoints(coords);
            if (typeof this._element == "undefined" || this._element == null) {
                this._element = this._surface.ellipse(endpoints.x, endpoints.y, endpoints.rx, endpoints.ry);
                this._element.attr({
                    stroke: this._toolSettings.stroke,
                    strokeWidth: this._toolSettings.strokeWidth,
                    fill: this._toolSettings.fill
                });
            }
            else {
                this._element.attr({
                    x: endpoints.x,
                    y: endpoints.y,
                    rx: endpoints.rx,
                    ry: endpoints.ry
                });
            }
        };
        Ellipse.prototype.drawComplete = function () {
            if (!this._element) {
                // Most likely cause is draw was not called - no mouse move event.
                return;
            }
            this._origin.x = Number(this._element.attr("x"));
            this._origin.y = Number(this._element.attr("y"));
        };
        Ellipse.prototype.setToolSettings = function (settings) {
            _super.prototype.setToolSettings.call(this, settings);
            this._element.attr({
                stroke: this._toolSettings.stroke,
                strokeWidth: this._toolSettings.strokeWidth,
                fill: this._toolSettings.fill
            });
        };
        Ellipse.prototype.getEndpoints = function (coords) {
            var endpoints = {
                x: coords.x < this._origin.x ? coords.x : this._origin.x,
                y: coords.y < this._origin.y ? coords.y : this._origin.y,
                rx: Math.abs(this._origin.x - coords.x),
                ry: Math.abs(this._origin.y - coords.y)
            };
            return endpoints;
        };
        return Ellipse;
    }(markit.Shape));
    markit.Ellipse = Ellipse;
})(markit || (markit = {}));
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="Shape.ts" />
/// <reference path="toolSettings.ts" />
var markit;
(function (markit) {
    var ImageWrapper = (function (_super) {
        __extends(ImageWrapper, _super);
        function ImageWrapper(surface, origin, toolSettings, imageURL) {
            _super.call(this, surface, origin, toolSettings);
            this._imageURL = imageURL;
        }
        Object.defineProperty(ImageWrapper.prototype, "imageURL", {
            get: function () {
                return this._imageURL;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageWrapper.prototype, "width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageWrapper.prototype, "height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        ImageWrapper.prototype.draw = function (coords) {
            if (typeof coords == "undefined" || coords == null) {
                throw "coords parameter is required.";
            }
            if (typeof this._element == "undefined" || this._element == null) {
                var image = new Image();
                image.src = this._imageURL.toString();
                this._width = image.width;
                this._height = image.height;
                this._element = this._surface.image(this._imageURL.toString(), coords.x, coords.y, this._width, this._height);
            }
            else {
            }
        };
        ImageWrapper.prototype.drawComplete = function () {
            // not implemented
        };
        ImageWrapper.prototype.setToolSettings = function (settings) {
            _super.prototype.setToolSettings.call(this, settings);
            this._element.attr({
                stroke: this._toolSettings.stroke,
                strokeWidth: this._toolSettings.strokeWidth,
                fill: this._toolSettings.fill
            });
        };
        return ImageWrapper;
    }(markit.Shape));
    markit.ImageWrapper = ImageWrapper;
})(markit || (markit = {}));
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="Shape.ts" />
/// <reference path="toolSettings.ts" />
var markit;
(function (markit) {
    var Line = (function (_super) {
        __extends(Line, _super);
        function Line(surface, origin, toolSettings) {
            _super.call(this, surface, origin, toolSettings);
        }
        Line.prototype.draw = function (coords) {
            if (typeof coords == "undefined" || coords == null) {
                throw "coords parameter is required.";
            }
            if (typeof this._element == "undefined" || this._element == null) {
                this._element = this._surface.line(this._origin.x, this.origin.y, coords.x, coords.y);
                this._element.attr({
                    stroke: this._toolSettings.stroke,
                    strokeWidth: this._toolSettings.strokeWidth
                });
            }
            else {
                this._element.attr({
                    x2: coords.x,
                    y2: coords.y
                });
            }
        };
        Line.prototype.drawComplete = function () {
            // not implemented
        };
        Line.prototype.setToolSettings = function (settings) {
            _super.prototype.setToolSettings.call(this, settings);
            this._element.attr({
                stroke: this._toolSettings.stroke,
                strokeWidth: this._toolSettings.strokeWidth,
                fill: this._toolSettings.fill
            });
        };
        return Line;
    }(markit.Shape));
    markit.Line = Line;
})(markit || (markit = {}));
/// <reference path="ToolSettings.ts" />
/// <reference path="ToolSettings.ts" />
/// <reference path="ToolSettingsObserver.ts" />
var markit;
(function (markit) {
    var ToolsManager = (function () {
        function ToolsManager(tsManager) {
            this.toolSettingsManager = tsManager;
        }
        ToolsManager.prototype.init = function (svgElement) {
            var toolbar = document.createElement("div");
            this.tools = this.createTools();
            this.tools.forEach(function (e) {
                toolbar.appendChild(e);
            });
            svgElement.parentNode.insertBefore(toolbar, svgElement);
        };
        ToolsManager.prototype.createTools = function () {
            var tools = new Array();
            var btn = document.createElement("button");
            btn.id = "markit_btnPtr";
            btn.innerText = "Ptr";
            btn.onclick = this.onclick.bind(this);
            tools.push(btn);
            btn = document.createElement("button");
            btn.id = "markit_btnLine";
            btn.innerText = "Line";
            btn.onclick = this.onclick.bind(this);
            tools.push(btn);
            btn = document.createElement("button");
            btn.id = "markit_btnRect";
            btn.innerText = "Rectangle";
            btn.onclick = this.onclick.bind(this);
            tools.push(btn);
            btn = document.createElement("button");
            btn.id = "markit_Ellipse";
            btn.innerText = "Ellipse";
            btn.onclick = this.onclick.bind(this);
            tools.push(btn);
            btn = document.createElement("button");
            btn.id = "markit_Arrow";
            btn.innerText = "Arrow";
            btn.onclick = this.onclick.bind(this);
            tools.push(btn);
            btn = document.createElement("input");
            btn.id = "markit_Image";
            btn.type = "file";
            var multipleAttr = document.createAttribute("multiple");
            btn.setAttribute("multiple", "multiple");
            btn.setAttribute("accept", "image/*");
            btn.innerHTML = "Image";
            btn.onchange = this.onchange.bind(this);
            tools.push(btn);
            return tools;
        };
        ToolsManager.prototype.onclick = function (e) {
            var toolSettings = new markit.ToolSettings();
            switch (e.target.id) {
                case "markit_btnPtr":
                    toolSettings.commandMode = markit.CommandMode.Select;
                    this.toolSettingsManager.setToolSettings(toolSettings);
                    break;
                case "markit_btnLine":
                    toolSettings.commandMode = markit.CommandMode.Line;
                    this.toolSettingsManager.setToolSettings(toolSettings);
                    break;
                case "markit_btnRect":
                    toolSettings.commandMode = markit.CommandMode.Rectangle;
                    this.toolSettingsManager.setToolSettings(toolSettings);
                    break;
                case "markit_Ellipse":
                    toolSettings.commandMode = markit.CommandMode.Ellipse;
                    this.toolSettingsManager.setToolSettings(toolSettings);
                    break;
                case "markit_Arrow":
                    toolSettings.commandMode = markit.CommandMode.Arrow;
                    this.toolSettingsManager.setToolSettings(toolSettings);
                    break;
            }
        };
        ToolsManager.prototype.onchange = function (e) {
            e = e || window.event;
            for (var i = 0; i < e.target.files.length; i++) {
                var reader = new FileReader();
                reader.onload = (function (evt) {
                    this.toolSettingsManager.addImage(evt.target.result);
                }).bind(this);
                reader.readAsDataURL(e.target.files[i]);
            }
        };
        return ToolsManager;
    }());
    markit.ToolsManager = ToolsManager;
})(markit || (markit = {}));
/// <reference path="ToolSettingsObserver.ts" />
/// <reference path="ToolsManager.ts" />
var markit;
(function (markit) {
    var MarkitEditor = (function () {
        function MarkitEditor() {
        }
        MarkitEditor.prototype.init = function (svgId) {
            var svg = document.getElementsByTagName("svg")[0];
            this.paper = new markit.Paper(svg);
            this.paper.toolSettings = new markit.ToolSettings();
            this.toolsManager = new markit.ToolsManager(this);
            this.toolsManager.init(svg);
        };
        MarkitEditor.prototype.setToolSettings = function (toolSettings) {
            this.paper.toolSettings = toolSettings;
            console.log("command: " + toolSettings.commandMode);
        };
        MarkitEditor.prototype.addImage = function (imageDataURL) {
            this.paper.addImage(imageDataURL);
        };
        return MarkitEditor;
    }());
    markit.MarkitEditor = MarkitEditor;
})(markit || (markit = {}));
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="Shape.ts" />
/// <reference path="toolSettings.ts" />
var markit;
(function (markit) {
    var Rectangle = (function (_super) {
        __extends(Rectangle, _super);
        function Rectangle(surface, origin, toolSettings) {
            _super.call(this, surface, origin, toolSettings);
        }
        Rectangle.prototype.draw = function (coords) {
            if (typeof coords == "undefined" || coords == null) {
                throw "coords parameter is required.";
            }
            var endpoints = this.getEndpoints(coords);
            if (typeof this._element == "undefined" || this._element == null) {
                this._element = this._surface.rect(endpoints.x, endpoints.y, endpoints.width, endpoints.height);
                this._element.attr({
                    stroke: this._toolSettings.stroke,
                    strokeWidth: this._toolSettings.strokeWidth,
                    fill: this._toolSettings.fill
                });
            }
            else {
                this._element.attr({
                    x: endpoints.x,
                    y: endpoints.y,
                    width: endpoints.width,
                    height: endpoints.height
                });
            }
        };
        Rectangle.prototype.drawComplete = function () {
            if (!this._element) {
                // Most likely cause is draw was not called - no mouse move event.
                return;
            }
            this._origin.x = Number(this._element.attr("x"));
            this._origin.y = Number(this._element.attr("y"));
        };
        Rectangle.prototype.setToolSettings = function (settings) {
            _super.prototype.setToolSettings.call(this, settings);
            this._element.attr({
                stroke: this._toolSettings.stroke,
                strokeWidth: this._toolSettings.strokeWidth,
                fill: this._toolSettings.fill
            });
        };
        Rectangle.prototype.getEndpoints = function (coords) {
            var endpoints = {
                x: coords.x < this._origin.x ? coords.x : this._origin.x,
                y: coords.y < this._origin.y ? coords.y : this._origin.y,
                width: Math.abs(this._origin.x - coords.x),
                height: Math.abs(this._origin.y - coords.y)
            };
            return endpoints;
        };
        return Rectangle;
    }(markit.Shape));
    markit.Rectangle = Rectangle;
})(markit || (markit = {}));
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="ToolSettings.ts" />
/// <reference path="Shape.ts" />
/// <reference path="Rectangle.ts" />
/// <reference path="Ellipse.ts" />
/// <reference path="Line.ts" />
/// <reference path="Arrow.ts" />
var markit;
(function (markit) {
    var Paper = (function () {
        function Paper(svg) {
            this.svg = svg;
            this.snap = Snap(svg);
            this.svg.onmousedown = this.onmousedown.bind(this);
            this.svg.onmousemove = this.onmousemove.bind(this);
            this.svg.onmouseup = this.onmouseup.bind(this);
            this.svg.onmouseout = this.onmouseout.bind(this);
            this.activeElement = null;
            this.leftMouseButtonDown = false;
            this.elements = new Array();
        }
        Paper.prototype.onmousedown = function (e) {
            if (typeof this.toolSettings == "undefined" || this.toolSettings == null) {
                return; // toolsettings not set
            }
            if (e.which == 1) {
                console.log("lmb: " + this.toolSettings.commandMode);
                this.leftMouseButtonDown = true;
                var coords = this.toLocalCoords(e.clientX, e.clientY);
                if (this.toolSettings.commandMode == markit.CommandMode.Line) {
                    this.activeElement = new markit.Line(this.snap, coords, this.toolSettings);
                }
                else if (this.toolSettings.commandMode == markit.CommandMode.Rectangle) {
                    this.activeElement = new markit.Rectangle(this.snap, coords, this.toolSettings);
                }
                else if (this.toolSettings.commandMode == markit.CommandMode.Ellipse) {
                    this.activeElement = new markit.Ellipse(this.snap, coords, this.toolSettings);
                }
                else if (this.toolSettings.commandMode == markit.CommandMode.Arrow) {
                    this.activeElement = new markit.Arrow(this.snap, coords, this.toolSettings);
                }
            }
        };
        Paper.prototype.onmousemove = function (e) {
            if (this.leftMouseButtonDown) {
                if (typeof this.activeElement != "undefined" && this.activeElement != null) {
                    console.log("mouse move - draw " + this.toolSettings.commandMode);
                    var coords = this.toLocalCoords(e.clientX, e.clientY);
                    this.activeElement.draw(coords);
                }
            }
        };
        Paper.prototype.onmouseup = function (e) {
            this.leftMouseButtonDown = false;
            if (typeof this.activeElement == "undefined" || this.activeElement == null) {
                return;
            }
            this.activeElement.drawComplete();
            this.elements.push(this.activeElement);
            this.activeElement = null;
        };
        Paper.prototype.onmouseout = function (e) {
            console.log("mouse out: " + e.target.id + ", x: " + e.clientX + ", y: " + e.clientY);
            // containsPoint required as chrome was misfiring event while still in the canvas
            if (this.containsPoint(e.clientX, e.clientY)) {
                console.log("mouseout misfire.");
                e.stopPropagation();
                return;
            }
            if (this.leftMouseButtonDown) {
                this.leftMouseButtonDown = false;
                if (typeof this.activeElement != "undefined" && this.activeElement != null) {
                    this.activeElement.removeElement();
                    this.activeElement = null;
                }
            }
        };
        Paper.prototype.toLocalCoords = function (x, y) {
            var rect = this.svg.getBoundingClientRect();
            console.log("rect: left: " + rect.left + ", top: " + rect.top + ", right: " + rect.right + ", bottom: " + rect.bottom);
            var localX = Math.round(x - rect.left);
            var localY = Math.round(y - rect.top);
            console.log("local coords: {x: " + localX + ", y: " + localY + "}}");
            return {
                x: localX,
                y: localY
            };
        };
        Paper.prototype.containsPoint = function (x, y) {
            var rect = this.svg.getBoundingClientRect();
            if (rect.left < x && x < rect.right && rect.top < y && y < rect.bottom) {
                return true;
            }
            return false;
        };
        Paper.prototype.addImage = function (imageURL) {
            var image = new markit.ImageWrapper(this.snap, { x: 0, y: 0 }, this.toolSettings, imageURL);
            image.draw({ x: 0, y: 0 });
            this.elements.push(image);
        };
        return Paper;
    }());
    markit.Paper = Paper;
})(markit || (markit = {}));
