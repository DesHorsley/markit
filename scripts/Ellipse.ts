
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="Shape.ts" />
/// <reference path="toolSettings.ts" />

module markit {

    export class Ellipse extends Shape {

        
        constructor(surface: Snap.Paper, origin: { x: number, y: number }, toolSettings: ToolSettings) {
            super(surface, origin, toolSettings);   
        }

        draw(coords: { x: number, y: number }) {

            if (typeof coords == "undefined" || coords == null) {
                throw "coords parameter is required.";
            }

            var endpoints = this.getEndpoints(coords);

            if (typeof this._element == "undefined" || this._element == null) {

                this._element = this._surface.ellipse(endpoints.x, endpoints.y, endpoints.rx, endpoints.ry);
                this._element.attr({
                    stroke: this._toolSettings.stroke,
                    strokeWidth: this._toolSettings.strokeWidth,
                    fill: this._toolSettings.fill
                });
            }
            else {
                this._element.attr({
                    x: endpoints.x,
                    y: endpoints.y,
                    rx: endpoints.rx,
                    ry: endpoints.ry
                });
            }
        }

        drawComplete(): void {            
        
            this._origin.x = Number(this._element.attr("x"));
            this._origin.y = Number(this._element.attr("y"));
        }

        setToolSettings(settings: ToolSettings): void {

            super.setToolSettings(settings);

            this._element.attr({
                stroke: this._toolSettings.stroke,
                strokeWidth: this._toolSettings.strokeWidth,
                fill: this._toolSettings.fill
            });
        }

        private getEndpoints(coords: { x: number, y: number }): { x: number, y: number, rx: number, ry: number } {
            
            var endpoints = {
                x: coords.x < this._origin.x ? coords.x : this._origin.x,
                y: coords.y < this._origin.y ? coords.y : this._origin.y,
                rx: Math.abs(this._origin.x - coords.x),
                ry: Math.abs(this._origin.y - coords.y) 
            };

            return endpoints;
        }

    }
}