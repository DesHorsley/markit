
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="Shape.ts" />
/// <reference path="Point.ts" />
/// <reference path="toolSettings.ts" />

module markit {
    
    export class Line extends Shape {

        public endpoint: Point;

        constructor(surface: Snap.Paper, origin: Point, toolSettings: ToolSettings) {
            super(surface, origin, toolSettings);
            this.endpoint = origin;
            this._selectedHandles = [];
        }

        public destroy(): void {
            this.removeHandles();
            this.removeLine();
        }

        draw(coords: Point): void {
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
            this._element = this._surface.line(this._origin.x, this.origin.y, this.endpoint.x, this.endpoint.y);
            this._element.attr({
                stroke: this._toolSettings.stroke,
                strokeWidth: this._toolSettings.strokeWidth
            });
        }

        private createHandles(): void {                    

            console.log("createHandles starting...");
            // Start handle
            this._selectedHandles.push(this._surface.ellipse(this._origin.x, this.origin.y, 5, 5));
            // End handle
            this._selectedHandles.push(this._surface.ellipse(this.endpoint.x, this.endpoint.y, 5, 5));

            this._selectedHandles[0].attr({
                fill: "#C0C0C0"
            });

            this._selectedHandles[1].attr({
                fill: "#C0C0C0"
            });                       
        }

        private setLineCoordinates(): void {
            this._element.attr({
                x1: this.origin.x,
                y1: this.origin.y,
                x2: this.endpoint.x,
                y2: this.endpoint.y
            });
        }

        private setHandleEndpoints(): void {
            this._selectedHandles[0].attr({
                cx: this.origin.x,
                cy: this.origin.y
            });

            this._selectedHandles[1].attr({
                cx: this.endpoint.x,
                cy: this.endpoint.y
            });           
        }

        public select(): void {
            console.log("select called.");
            if (!this._selected) {
                this._selected = true;
                if (this._element) {
                    this.createHandles();
                }
            }            
        }

        public deselect(): void {
            console.log("deselect called.");
            if (this._selected) {
                this.removeHandles();
                this._selected = false;
            }           
        }
       
        reDraw() {
        }

        public containsElement(element: Snap.Element): boolean {
            if (this._selectedHandles) {
                if (this._selectedHandles[0] === element || this._selectedHandles[1] === element) {
                    return true;
                }
            }

            return this._element === element;           
        }

        private removeLine(): void {
            this._element.remove();
            // TODO remove any event handlers
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
        }

        setToolSettings(settings: ToolSettings): void {

            super.setToolSettings(settings);

            this._element.attr({
                stroke: this._toolSettings.stroke,
                strokeWidth: this._toolSettings.strokeWidth,
                fill: this._toolSettings.fill
            });            
        }
        
    }
}

