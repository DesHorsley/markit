
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
        }

        drawComplete(): void {
            // not implemented
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

