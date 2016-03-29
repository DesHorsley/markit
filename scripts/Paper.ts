
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="ToolSettings.ts" />
/// <reference path="Shape.ts" />
/// <reference path="Rectangle.ts" />

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
            
            if (this.toolSettings === undefined || this.toolSettings == null) {
                return; // toolsettings not set
            }

            if (e.which == 1) {
                console.log("lmb: " + this.toolSettings.commandMode);
                if (this.toolSettings.commandMode == CommandMode.Line) {
                    this.leftMouseButtonDown = true;

                    this.activeElement = new Line(this.snap, null);
                    var coords = this.toLocalCoords(e.clientX, e.clientY);
                    this.activeElement.origin = coords;
                    this.activeElement.resize(coords, false);
                }
                else if (this.toolSettings.commandMode == CommandMode.Rectangle) {
                    this.leftMouseButtonDown = true;
                    this.activeElement = new Rectangle(this.snap, { stroke: this.toolSettings.stroke, fill: this.toolSettings.fill, strokeWidth: this.toolSettings.strokeWidth });
                    var coords = this.toLocalCoords(e.clientX, e.clientY);
                    this.activeElement.origin = coords;
                    this.activeElement.resize(coords, false);
                }
                else if (this.toolSettings.commandMode == CommandMode.Ellipse) {
                    this.leftMouseButtonDown = true;
                    this.activeElement = new Ellipse(this.snap, { stroke: this.toolSettings.stroke, fill: this.toolSettings.fill, strokeWidth: this.toolSettings.strokeWidth });
                    var coords = this.toLocalCoords(e.clientX, e.clientY);
                    this.activeElement.origin = coords;
                    this.activeElement.resize(coords, false);
                } 
            }            
        }

        onmousemove(e) {
            
            if (this.leftMouseButtonDown) {
                if (this.toolSettings.commandMode == CommandMode.Line ||
                    this.toolSettings.commandMode == CommandMode.Rectangle ||
                    this.toolSettings.commandMode == CommandMode.Ellipse) {
                    console.log("mouse move - draw " + this.toolSettings.commandMode);
                    if (this.activeElement) {
                        this.activeElement.resize(this.toLocalCoords(e.clientX, e.clientY), false);
                    }                    
                }
            }          
        }

        onmouseup(e) {
            this.leftMouseButtonDown = false;
            if (this.activeElement === undefined || this.activeElement === null) {
                return;
            }

            if (this.activeElement instanceof Rectangle) {
                (<Rectangle>this.activeElement).flipCoords();
            }
            else if (this.activeElement instanceof Ellipse) {
                (<Ellipse>this.activeElement).flipCoords();
            }

            this.elements.push(this.activeElement);
            this.activeElement = null;
        }

        onmouseout(e) {
            console.log("mouse out: " + e.target.id + ", x: " + e.clientX + ", y: " + e.clientY);

            // containsPoint rewquired as chrome was misfiring event while still in the canvas
            if (this.containsPoint(e.clientX, e.clientY)) {
                console.log("mouseout misfire.");
                e.stopPropagation();
                return;
            }

            if (this.leftMouseButtonDown) {
                this.leftMouseButtonDown = false;
                if (this.activeElement) {
                    this.activeElement.remove();
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

    }
}