﻿
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="Shape.ts" />
/// <reference path="toolSettings.ts" />

module markit {

    export class Rectangle extends Shape {
        
        constructor(paper: Snap.Paper, origin: Point, toolSettings: ToolSettings) {
            super(paper, origin, toolSettings);
        }

        public destroy(): void {
        }

        draw(coords: Point) {

            if (typeof coords == "undefined" || coords == null) {
                throw "coords parameter is required.";
            }

            var endpoints = this.getEndpoints(coords);

            if (typeof this._element == "undefined" || this._element == null) {

                this._element = this.paper.rect(endpoints.x, endpoints.y, endpoints.width, endpoints.height);
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
                    width: endpoints.width,
                    height: endpoints.height
                });
            }
        }

        reDraw() { }

        drawComplete(): void {
            if (!this._element) {
                // Most likely cause is draw was not called - no mouse move event.
                return;
            }

            this._origin.x = Number(this._element.attr("x"));
            this._origin.y = Number(this._element.attr("y"));
        }

        containsElement() {
            return false;
        }

        protected setToolSettings(): void {
            this._element.attr({
                stroke: this._toolSettings.stroke,
                strokeWidth: this._toolSettings.strokeWidth,
                fill: this._toolSettings.fill
            });            
        }

        private getEndpoints(coords: Point): { x: number, y: number, width: number, height: number } {

            var endpoints = {
                x: coords.x < this._origin.x ? coords.x : this._origin.x,
                y: coords.y < this._origin.y ? coords.y : this._origin.y,
                width: Math.abs(this._origin.x - coords.x),
                height: Math.abs(this._origin.y - coords.y)
            };

            return endpoints;
        }        
       
    }
}