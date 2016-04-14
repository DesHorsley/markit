
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="Shape.ts" />
/// <reference path="toolSettings.ts" />

module markit {

    export class Line extends Shape {

        public endpoint: { x: number, y: number };

        constructor(surface: Snap.Paper, origin: { x: number, y: number }, toolSettings: ToolSettings) {
            super(surface, origin, toolSettings);
        }

        draw(coords: { x: number, y: number }): void {
            
            if (typeof coords == "undefined" || coords == null) {
                throw "coords parameter is required.";
            }
            
            this.endpoint = coords;

            if (! this._element) {
                this._element = this._surface.line(this._origin.x, this.origin.y, coords.x, coords.y);
                this._element.attr({
                    stroke: this._toolSettings.stroke,
                    strokeWidth: this._toolSettings.strokeWidth
                });
            } else {
                this._element.attr({
                    x2: coords.x,
                    y2: coords.y
                });
            }

            if (this._selected) {
                if (!this._selectedHandles) {
                    this.createHandles();
                }

                this._selectedHandles[1].transform("t" + (coords.x - this._origin.x) + "," + (coords.y - this._origin.y));

            } else {
                this._selectedHandles.forEach(s => s.remove());
                this._selectedHandles = null;
            }
        }

        reDraw() {
            if (this.endpoint) {
                this.draw(this.endpoint);
            }
        }

        public containsElement(element: HTMLElement): boolean {
            let shapesElements = this._selectedHandles;

            if (shapesElements) {
                shapesElements.push(this._element);
            } else {
                shapesElements = [this._element];
            }

            return shapesElements.filter(e => e.node === element).length > 0;
        }

        private createHandles(): void {
            console.log('Create handles');
            this._selectedHandles = [];
            this._selectedHandles.push(this._surface.ellipse(this._origin.x, this.origin.y,5,5));
            this._selectedHandles.push(this._surface.ellipse(this._origin.x, this.origin.y, 5, 5));
            console.log(`Created  ${this._selectedHandles.length} handles`);
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

