
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="Shape.ts" />
/// <reference path="Point.ts" />
/// <reference path="toolSettings.ts" />

module markit {
    
    export class Line extends Shape {

        public endpoint: Point;

        constructor(surface: Snap.Paper, origin: Point, toolSettings: ToolSettings) {
            super(surface, origin, toolSettings);
        }

        public destroy(): void {
        }

        draw(coords: Point): void {
            if (typeof coords == "undefined" || coords == null) {
                throw "coords parameter is required.";
            }
            
            this.endpoint = coords;

            if (!this._element) {
                this.createElement(coords);
            } else {
                this.setElementEnd(coords);
            }

            if (this._selected) {
                this.setHandleLocations(coords);
            } else {
                this.removeHandles();
            }
        }

        private createElement(coords: Point) {
            this._element = this._surface.line(this._origin.x, this.origin.y, coords.x, coords.y);
            this._element.attr({
                stroke: this._toolSettings.stroke,
                strokeWidth: this._toolSettings.strokeWidth
            });
        }

        private setElementEnd(coords: Point) {
            this._element.attr({
                x2: coords.x,
                y2: coords.y
            });
        }

        private setHandleLocations(coords: Point) {
            if (!this._selectedHandles) {
                this.createHandles();
            }

            // Set end handle
            this._selectedHandles[1].transform("t" + (coords.x - this._origin.x) + "," + (coords.y - this._origin.y));
        }

        reDraw() {
            if (this.endpoint) {
                this.draw(this.endpoint);
            }
        }

        public containsElement(element: HTMLElement): boolean {
            let shapesElements 
            if (this._selectedHandles) {
                shapesElements = this._selectedHandles.slice();
            } else {
                shapesElements = [];
            }

            if (shapesElements) {
                shapesElements.push(this._element);
            } else {
                shapesElements = [this._element];
            }

            return shapesElements.filter(e => e.node === element).length > 0;
        }

        private createHandles(): void {
            this._selectedHandles = [];

            // Start handle
            this._selectedHandles.push(this._surface.ellipse(this._origin.x, this.origin.y, 5, 5));
            // End handle
            this._selectedHandles.push(this._surface.ellipse(this._origin.x, this.origin.y, 5, 5));
        }

        private removeHandles(): void {
            if (this._selectedHandles) {
                this._selectedHandles.forEach(s => s.remove());
                this._selectedHandles = null;
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

