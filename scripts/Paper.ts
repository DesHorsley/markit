
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="ToolSettings.ts" />
/// <reference path="Shape.ts" />
/// <reference path="Rectangle.ts" />
/// <reference path="Ellipse.ts" />
/// <reference path="Line.ts" />
/// <reference path="Arrow.ts" />

module markit {

    export class Paper {

        private snap: Snap.Paper;
        public toolSettings: ToolSettings;

        private activeElement: Shape;
        private leftMouseButtonDown: boolean;
        private svg: SVGElement;
        private elements: Array<Shape>;

        constructor(svg: SVGElement) {

            this.svg = svg;
            this.snap = Snap(svg);
            this.svg.onmousedown = this.onmousedown.bind(this);
            this.svg.onmousemove = this.onmousemove.bind(this);
            this.svg.onmouseup = this.onmouseup.bind(this);
            this.svg.onmouseout = this.onmouseout.bind(this);

            this.activeElement = null;
            this.leftMouseButtonDown = false;
            this.elements = new Array<Shape>();
        }

        onmousedown(e) {

            if (typeof this.toolSettings == "undefined" || this.toolSettings == null) {
                return; // toolsettings not set
            }

            if (e.which == 1) {

                console.log("lmb: " + this.toolSettings.commandMode);
                this.leftMouseButtonDown = true;
                var coords = this.toLocalCoords(e.clientX, e.clientY);

                if (this.toolSettings.commandMode == CommandMode.Line) {
                    this.activeElement = new Line(this.snap, coords, this.toolSettings);
                }
                else if (this.toolSettings.commandMode == CommandMode.Rectangle) {
                    this.activeElement = new Rectangle(this.snap, coords, this.toolSettings);
                }
                else if (this.toolSettings.commandMode == CommandMode.Ellipse) {
                    this.activeElement = new Ellipse(this.snap, coords, this.toolSettings);
                }
                else if (this.toolSettings.commandMode == CommandMode.Arrow) {
                    this.activeElement = new Arrow(this.snap, coords, this.toolSettings);
                }
            }
        }

        onmousemove(e) {

            if (this.leftMouseButtonDown) {

                if (typeof this.activeElement != "undefined" && this.activeElement != null) {

                    console.log("mouse move - draw " + this.toolSettings.commandMode);
                    var coords = this.toLocalCoords(e.clientX, e.clientY);
                    this.activeElement.draw(coords);
                }
            }
        }

        onmouseup(e) {
            this.leftMouseButtonDown = false;
            if (typeof this.activeElement == "undefined" || this.activeElement == null) {
                return;
            }

            this.activeElement.drawComplete();
            this.elements.push(this.activeElement);
            this.activeElement = null;
        }

        onmouseout(e) {
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
        }

        toLocalCoords(x: number, y: number) {

            var rect = this.svg.getBoundingClientRect();
            console.log("rect: left: " + rect.left + ", top: " + rect.top + ", right: " + rect.right + ", bottom: " + rect.bottom);

            var localX = Math.round(x - rect.left);
            var localY = Math.round(y - rect.top);
            console.log("local coords: {x: " + localX + ", y: " + localY + "}}");

            return {
                x: localX,
                y: localY
            };
        }

        containsPoint(x: number, y: number) {
            var rect = this.svg.getBoundingClientRect();
            if (rect.left < x && x < rect.right && rect.top < y && y < rect.bottom) {
                return true;
            }
            return false;
        }

        addImage(imageURL: URL): void {

            var image = new ImageWrapper(this.snap, { x: 0, y: 0 }, this.toolSettings, imageURL);
            image.draw({ x: 0, y: 0 });
            this.elements.push(image);            
        }

    }
}