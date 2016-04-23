
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="Shape.ts" />
/// <reference path="Point.ts" />
/// <reference path="toolSettings.ts" />

module markit {
    
    export class Line extends Shape {

        public endpoint: Point;
        private isDrawing: boolean; 
        private leftMouseButtonDown: boolean;

        constructor(context: Snap.Paper, origin: Point, toolSettings: ToolSettings) {
            super(context, origin, toolSettings);
            this.endpoint = origin;
            this._selectedHandles = [];
            this.isDrawing = false;
            this.leftMouseButtonDown = false;
        }

        public destroy(): void {
            console.log("Line.dsestroy called.");
            if (this._element) {
                if (this._selectedHandles.length) {
                   // this.removeEventHandlers();
                    this.removeHandles();
                }
               // this._element.unclick(this.onclick);
                this.removeLine();
                this._element = null;
            }           
        }

        public draw(coords: Point): void {
            if (typeof coords == "undefined" || coords == null) {
                throw "coords parameter is required.";
            }
            
            this.endpoint = coords;

            if (!this._element) {
                this.createLine();
                if (this._selected) {
                    this.createHandles();
                }
            } else {
                this.setLineCoordinates();
                if (this._selected) {
                    this.setHandleEndpoints(); 
                }
            }            
        }

        private createLine(): void {
            console.log("Line.createLine called.");
            this._element = this.paper.line(this._origin.x, this.origin.y, this.endpoint.x, this.endpoint.y);
            this._element.attr({
                stroke: this._toolSettings.stroke,
                strokeWidth: this._toolSettings.strokeWidth
            });
        }

        private createHandles(): void {                    

            console.log("createHandles starting...");
            // Start handle
            this._selectedHandles.push(this.paper.ellipse(this._origin.x, this.origin.y, 5, 5));
            // End handle
            this._selectedHandles.push(this.paper.ellipse(this.endpoint.x, this.endpoint.y, 5, 5));

            this._selectedHandles[0].attr({
                fill: "#C0C0C0"
            });

            this._selectedHandles[1].attr({
                fill: "#C0C0C0"
            });                       
        }

        private setLineCoordinates(startCoords?: Point, endCoords?: Point): void {
            console.log("Line.setLineCoordinates called.");

            let startPoint = startCoords || this.origin;
            let endPoint = endCoords || this.endpoint;

            console.log("origin: {" + this.origin.x + ", " + this.origin.y + "}, endpoint: {" +
                this.endpoint.x + ", " + this.endpoint.y + "}, startPoint: {" + startPoint.x + ", " +
                startPoint.y + "}, endPoint: {" + endPoint.x + ", " + endPoint.y + "}");
            this._element.attr({
                x1: startPoint.x,
                y1: startPoint.y,
                x2: endPoint.x,
                y2: endPoint.y
            });
        }

        private setHandleEndpoints(startCoords?: Point, endCoords?: Point): void {
            console.log("Line.setHandleEndpoints called.");

            let startPoint = startCoords || this.origin;
            let endPoint = endCoords || this.endpoint;

            this._selectedHandles[0].attr({
                cx: startPoint.x,
                cy: startPoint.y
            });

            this._selectedHandles[1].attr({
                cx: endPoint.x,
                cy: endPoint.y
            });           
        }
       
        public select(): void {
            console.log("Line.select called.");
            if (!this._selected) {
                this._selected = true;
                if (this._element) {
                    this.createHandles();
                 //   this.registerEventHandlers();
                }
            }                        
        }

        public deselect(): void {
            console.log("Line.deselect called.");
            if (this._selected) {
              //  this.removeEventHandlers();
                this.removeHandles();
                this._selected = false;
            }           
        }
       
        public redraw(mode: string, offset: Point, handleIndex?: number): void {
            console.log("line.redraw called.");
            if (mode === "resize") {
                console.log("line.redraw called. mode: resize, handle index: " + handleIndex);
                if (typeof handleIndex === "undefined" || handleIndex === null) {
                    throw "handleIndex required for resizing.";
                }                
                this.resize(offset, handleIndex);
                
            } else if (mode === "drag") {
                this.drag(offset);
            }
        }

        protected resize(offset: Point, handleIndex: number): void {

            let startCoords = null;
            let endCoords = null;
            if (handleIndex === 0) {
                startCoords = {
                    x: this.origin.x + offset.x,
                    y: this.origin.y + offset.y
                };
            } else {
                endCoords = {
                    x: this.endpoint.x + offset.x,
                    y: this.endpoint.y + offset.y
                };
            }
            this.setLineCoordinates(startCoords, endCoords);
            this.setHandleEndpoints(startCoords, endCoords);
        }

        protected drag(offset: Point): void {
            let startCoords = {
                x: this.origin.x + offset.x,
                y: this.origin.y + offset.y
            };
            let endCoords = {
                x: this.endpoint.x + offset.x,
                y: this.endpoint.y + offset.y
            };
            this.setLineCoordinates(startCoords, endCoords);
            this.setHandleEndpoints(startCoords, endCoords);
        }

        public containsElement(element: Element): boolean {
            if (this._selectedHandles.length) {
                if (this._selectedHandles[0].node === element || this._selectedHandles[1].node === element) {
                    return true;
                }
            }
            return this._element.node === element;           
        }

        private removeLine(): void {
            this._element.remove();
           // this._element.unclick(this.onclick);
            this._element = null;
        }

        private removeHandles(): void {
            while (this._selectedHandles.length > 0) {
                let handle = this._selectedHandles.pop();
                handle.remove();
                
                // TODO: remove any event handlers                
            }           
        }

        drawComplete(): void {
            this.select();
           // this.element.click(this.onclick, this);
            let x1 = Number(this._element.attr("x1"));
            let y1 = Number(this._element.attr("y1"));
            let x2 = Number(this._element.attr("x2"));
            let y2 = Number(this._element.attr("y2"));

            console.log("x1: " + x1 + ", y1: " + y1 + ", x2: " + x2 + ", y2: " + y2);
            this.origin.x = x1;
            this.origin.y = y1;
            this.endpoint.x = x2;
            this.endpoint.y = y2;
           
            this.setLineCoordinates();
            this.setHandleEndpoints();
        }

        protected setToolSettings(): void {

            this._element.attr({
                stroke: this.toolSettings.stroke,
                strokeWidth: this.toolSettings.strokeWidth                
            });            
        }
       
        public handleIndex(element: Element): number {
            let index = -1;
            if (this._selectedHandles.length) {
                if (this._selectedHandles[0].node === element) {
                    index = 0;
                } else if (this._selectedHandles[1].node === element) {
                    index = 1;
                }
            }
            return index;
        }

    }
}

