
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
        private selectedElements: Shape[];
        private leftMouseButtonDown: boolean;
        private svg: SVGElement;
        private elements: Array<Shape>;

        constructor(svg: SVGElement) {

            this.svg = svg;
            this.snap = Snap(svg);
            this.svg.onclick = this.onclick.bind(this);
            this.svg.onmousedown = this.onmousedown.bind(this);
            this.svg.onmousemove = this.onmousemove.bind(this);
            this.svg.onmouseup = this.onmouseup.bind(this);
            this.svg.onmouseout = this.onmouseout.bind(this);
            
            this.activeElement = null;
            this.selectedElements = [];
            this.leftMouseButtonDown = false;
            this.elements = new Array<Shape>();
        }

        onclick(e) {
            e = e || window.event;

            let element = Snap.getElementByPoint(e.clientX, e.clientY);
            let shapes = this.elements.filter(el => el.containsElement(element));
            console.log("shapes found: " + shapes.length);
            if (shapes.length === 1) {
                if (!e.ctrlKey) {
                    this.deselectAll();
                }
                shapes[0].select();
                let selected = this.selectedElements.filter(el => el === shapes[0]);
                console.log("selected shapes found: " + selected.length);
                if (selected.length === 0) {
                    this.selectedElements.push(shapes[0]);
                }                
            }
        }

        private shouldDeselectAll(target: Element): boolean {
            if (this.selectedElements
                && this.selectedElements.length) {
                return !this.selectedElements.some(e => e.containsElement(target));
            }
            return false;
        }

        private deselectAll():void {
            this.selectedElements.forEach(e => e.deselect());
            this.selectedElements = [];
        }

        onmousedown(e) {
            if (typeof this.toolSettings == "undefined" || this.toolSettings == null) {
                return; // toolsettings not set
            }

            if (this.toolSettings.commandMode !== CommandMode.Select) {
                this.deselectAll();
                if (e.which == 1) {
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

                    if (this.activeElement) {
                        this.selectedElements.push(this.activeElement);
                        this.activeElement.select();
                    }
                }
            }                                   
        }

        onmousemove(e) {
            if (this.leftMouseButtonDown) {

                if (this.activeElement) {
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
            // containsPoint required as chrome was misfiring event while still in the canvas
            if (this.containsPoint(e.clientX, e.clientY)) {
                console.log("mouseout misfire.");
                e.stopPropagation();
                return;
            }

            if (this.leftMouseButtonDown) {
                this.leftMouseButtonDown = false;
                if (typeof this.activeElement != "undefined" && this.activeElement != null) {
                    this.activeElement.destroy();
                    this.activeElement = null;
                }
            }
        }

        toLocalCoords(x: number, y: number) : Point {

            var rect = this.svg.getBoundingClientRect();
            var localX = Math.round(x - rect.left);
            var localY = Math.round(y - rect.top);

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