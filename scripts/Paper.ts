
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="ToolSettings.ts" />
/// <reference path="Shape.ts" />
/// <reference path="Rectangle.ts" />
/// <reference path="Ellipse.ts" />
/// <reference path="Line.ts" />
/// <reference path="Arrow.ts" />

module markit {

    export class Paper {

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
        
        public get selected(): Shape[] {
            return this.selectedElements;
        }

        private _paper: Snap.Paper;
        private _toolSettings: ToolSettings;
        private activeElement: Shape;
        private selectedElements: Shape[];
        private leftMouseButtonDown: boolean;
        private svg: SVGElement;
        private elements: Array<Shape>;
        private redrawMode: boolean;
        private sourcePoint: Point;
        private sourceElement: Element;
        private wasDrawing: boolean;

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
            this.redrawMode = false;
            this.wasDrawing = false;
        }

        private shapeSelected(shape: Shape, allowMultiple: boolean): void {
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

        private onclick(e: MouseEvent): void {
            
            console.log("paper.onclick called.");

            if (this.wasDrawing) {
                this.wasDrawing = false;
                console.log("paper.onclick called. - wasdrawing");
            } else if (this.toolSettings.commandMode === CommandMode.Select) {
                
                let localCoords = this.toLocalCoords(e.clientX, e.clientY);
                let element = Snap.getElementByPoint(e.clientX, e.clientY);
                let shape = this.getShape(element.node);
                console.log("paper.onclick called. - shape found: " + (shape ? "true" : "false") +
                    ", select multiple: " + e.ctrlKey);
                if (shape) {
                    shape.select();
                    this.shapeSelected(shape, e.ctrlKey);
                } else {
                    this.deselectAll();
                }
            }           
        }

        private deselectAllExcept(shape: Shape): void {
            // console.log("Paper.deselectAllExcept called.");
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
            // console.log("Paper.deselectAllExcept: selectedElements count: " + this.selectedElements.length);            
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

        private getSelectedShape(element: Element): Shape {

            let shape = null;
            for (let i = 0; i < this.selectedElements.length; i++) {
                if (this.selectedElements[i].containsElement(element)) {
                    shape = this.selectedElements[i];
                    break;
                }
            }
            return shape;    
        }

        private getShape(element: Element): Shape {
            let shape = null;
            for (let i = 0; i < this.elements.length; i++) {
                if (this.elements[i].containsElement(element)) {
                    shape = this.elements[i];
                    break;
                }
            }
            return shape;
        }

        private onmousedown(e: MouseEvent) : void {
            if (typeof this.toolSettings == "undefined" || this.toolSettings == null) {
                return; // toolsettings not set
            }

            if (e.which === 1) {

                let target = e.srcElement;
                if (this.selectedElements.some(el => el.containsElement(target))) {
                    this.activeElement = this.getSelectedShape(target);
                    if (this.activeElement) {
                        this.redrawMode = true;
                        this.sourcePoint = this.toLocalCoords(e.clientX, e.clientY);
                        this.sourceElement = target;
                    }
                    return;
                }

                if (this.toolSettings.commandMode !== CommandMode.Select) {
                    this.leftMouseButtonDown = true;
                    var coords = this.toLocalCoords(e.clientX, e.clientY);

                    if (this.toolSettings.commandMode == CommandMode.Line) {
                        this.activeElement = new Line(this.paper, coords, this.toolSettings);
                    }
                    else if (this.toolSettings.commandMode == CommandMode.Rectangle) {
                        this.activeElement = new Rectangle(this.paper, coords, this.toolSettings);
                    }
                    else if (this.toolSettings.commandMode == CommandMode.Ellipse) {
                        this.activeElement = new Ellipse(this.paper, coords, this.toolSettings);
                    }
                    else if (this.toolSettings.commandMode == CommandMode.Arrow) {
                        this.activeElement = new Arrow(this.paper, coords, this.toolSettings);
                    }
                }
            }                              
        }

        private onmousemove(e: MouseEvent): void {

            if (e.which === 1) {
                let coords = this.toLocalCoords(e.clientX, e.clientY);
                if (this.redrawMode) {
                    this.redraw(coords);                    
                } else if (this.activeElement) {
                    this.activeElement.draw(coords);
                }    
            }
        }

        private onmouseup(e: MouseEvent) : void {
            e.stopImmediatePropagation();
            this.leftMouseButtonDown = false;
            if (typeof this.activeElement == "undefined" || this.activeElement == null) {
                return;
            }
            // console.log("paper.onmouseup called.");
            if (typeof this.activeElement.element == "undefined" || this.activeElement.element == null) {
                this.activeElement = null;
                return;
            }

            if (this.redrawMode) {
                this.redrawMode = false;
                this.selectedElements.forEach(el => el.drawComplete());
                this.wasDrawing = true;
                this.activeElement = null;
            } else {
                              
                this.activeElement.drawComplete();
                this.elements.push(this.activeElement);                
                this.shapeSelected(this.activeElement, false);                
                this.activeElement = null;
            }
                        
        }

        private onmouseout(e: MouseEvent) : void {
            // containsPoint required as chrome was misfiring event while still in the canvas
            if (this.containsPoint(e.clientX, e.clientY)) {
                // console.log("mouseout misfire.");
                e.stopImmediatePropagation();
                return;
            }           
        }

        private toLocalCoords(x: number, y: number) : Point {
            var rect = this.svg.getBoundingClientRect();
            var localX = Math.round(x - rect.left);
            var localY = Math.round(y - rect.top);

            return {
                x: localX,
                y: localY
            };
        }

        private containsPoint(x: number, y: number): boolean {
            var rect = this.svg.getBoundingClientRect();
            if (rect.left < x && x < rect.right && rect.top < y && y < rect.bottom) {
                return true;
            }
            return false;
        }

        public addImage(imageURL: URL): void {
            var image = new ImageWrapper(this.paper, { x: 0, y: 0 }, this.toolSettings, imageURL);
            image.draw({ x: 0, y: 0 });
            this.elements.push(image);            
        }

        protected redraw(coords: Point): void {
            let offset = this.getOffset(coords);
            let handleIndex = this.activeElement.handleIndex(this.sourceElement);
            console.log("paper.redraw called. offset: {" + offset.x + ", " + offset.y + "}, " +
                "handle index: " + handleIndex);
            if (handleIndex > -1) {
                this.selectedElements.forEach(s => s.redraw("resize", offset, handleIndex));
            } else {
                this.selectedElements.forEach(s => s.redraw("drag", offset));
            }
        }

        private getOffset(coords: Point): Point {
            let offset = {
                x: coords.x - this.sourcePoint.x,
                y: coords.y - this.sourcePoint.y
            };

            return offset;
        }
       
    }
}