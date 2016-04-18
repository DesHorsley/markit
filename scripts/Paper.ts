
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="ToolSettings.ts" />
/// <reference path="Shape.ts" />
/// <reference path="Rectangle.ts" />
/// <reference path="Ellipse.ts" />
/// <reference path="Line.ts" />
/// <reference path="Arrow.ts" />

module markit {

    export class Paper implements IShapeObserver {

        get toolSettings(): ToolSettings {
            return this._toolSettings;
        }

        set toolSettings(settings: ToolSettings) {
            if (typeof settings == "undefined" || settings == null) {
                throw "settings is required.";
            }
            this._toolSettings = settings;
        }

        public get paper(): Snap.Paper {
            return this._paper;
        }            

        private _paper: Snap.Paper;
        private _toolSettings: ToolSettings;
        private activeElement: Shape;
        private selectedElements: Shape[];
        private leftMouseButtonDown: boolean;
        private svg: SVGElement;
        private elements: Array<Shape>;

        constructor(svg: SVGElement) {

            this.svg = svg;
            this._paper = Snap(svg);
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

        public shapeSelected(shape: Shape, allowMultiple: boolean): void {
            console.log("Paper.shapeSelected called: allowmultiple: " + 
                (allowMultiple ? "true" : "false") + ", selectedElements count: " + this.selectedElements.length);
            if (allowMultiple) {
                if (!this.selectedElements.some(s => s === shape)) {
                    this.selectedElements.push(shape);
                    console.log("Paper.shapeSelected...shape pushed.");
                } else {
                    console.log("Paper.shapeSelected. shape already in list.");
                }
                console.log("Paper.shapeSelected: selectedElements count: " + this.selectedElements.length);
            } else {
                if (this.selectedElements.some(s => s === shape)) {
                    this.deselectAllExcept(shape);
                } else {
                    this.deselectAll();
                    this.selectedElements.push(shape);
                }               
            }
            console.log("Paper.shapeSelected: selectedElements count: " + this.selectedElements.length);
        }

        onclick(e) {
            e = e || window.event;
            console.log("paper.onclick called.");
            //this.deselectAll();
            /*
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
            */
        }

        private deselectAllExcept(shape: Shape): void {
            console.log("Paper.deselectAllExcept called.");
            let remove = [];
            this.selectedElements.forEach(function (s) {
                if (s !== shape) {
                    remove.push(s);
                    s.deselect();
                }
            }, this);

            remove.forEach(function (s) {
                let index = this.selectedElements.indexOf(s);
                if (index > -1) {
                    this.selectedElements = this.selectedElements.splice(index, 1);
                }
            }, this);
            console.log("Paper.deselectAllExcept: selectedElements count: " + this.selectedElements.length);            
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
               // this.deselectAll();
                if (e.which == 1) {
                     
                    this.leftMouseButtonDown = true;
                    var coords = this.toLocalCoords(e.clientX, e.clientY);

                    if (this.toolSettings.commandMode == CommandMode.Line) {
                        this.activeElement = new Line(this, coords, this.toolSettings);
                    }
                    else if (this.toolSettings.commandMode == CommandMode.Rectangle) {
                        this.activeElement = new Rectangle(this, coords, this.toolSettings);
                    }
                    else if (this.toolSettings.commandMode == CommandMode.Ellipse) {
                        this.activeElement = new Ellipse(this, coords, this.toolSettings);
                    }
                    else if (this.toolSettings.commandMode == CommandMode.Arrow) {
                        this.activeElement = new Arrow(this, coords, this.toolSettings);
                    }

                    /*
                    if (this.activeElement) {
                        this.selectedElements.push(this.activeElement);
                        this.activeElement.select();
                    }
                    */
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
            e.stopImmediatePropagation();
            this.leftMouseButtonDown = false;
            if (typeof this.activeElement == "undefined" || this.activeElement == null) {
                return;
            }
            console.log("paper.onmouseup called.");
            if (typeof this.activeElement.element == "undefined" || this.activeElement.element == null) {
                this.activeElement = null;
            }
            else {
                e.stopImmediatePropagation();               
                this.activeElement.drawComplete();
                this.elements.push(this.activeElement);
                this.activeElement.select();
                this.shapeSelected(this.activeElement, false);                
                this.activeElement = null;
            }            
        }

        onmouseout(e) {
            // containsPoint required as chrome was misfiring event while still in the canvas
            if (this.containsPoint(e.clientX, e.clientY)) {
                console.log("mouseout misfire.");
                e.stopImmediatePropagation();
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
            var image = new ImageWrapper(this, { x: 0, y: 0 }, this.toolSettings, imageURL);
            image.draw({ x: 0, y: 0 });
            this.elements.push(image);            
        }
    }
}