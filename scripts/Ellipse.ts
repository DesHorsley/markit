
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="Shape.ts" />
/// <reference path="toolSettings.ts" />

module markit {

    export class Ellipse extends Shape {

        private _rect: Rect;

        constructor(context: Snap.Paper, origin: Point, toolSettings: ToolSettings) {
            super(context, origin, toolSettings);  
        }

        public destroy(): void {
        }

        draw(coords: Point) {

            if (typeof coords == "undefined" || coords == null) {
                throw "coords parameter is required.";
            }

            this._rect = this.getBounds(coords);
            
            if (typeof this._element == "undefined" || this._element == null) {
                this.createEllipse();               
            }
            else {
                this.setEllipseCoords();
            }
        }

        private createEllipse(): void {
            this._element = this.paper.ellipse(this._rect.x + this._rect.width / 2, this._rect.y + this._rect.height / 2,
                this._rect.width/2, this._rect.height/2);
            this._element.attr({
                stroke: this._toolSettings.stroke,
                strokeWidth: this._toolSettings.strokeWidth,
                fill: this._toolSettings.fill
            });
        }


        private setEllipseCoords(r?: Rect): void {

            let rect = r || this._rect;

            let cx = rect.x + rect.width / 2;
            let cy = rect.y + rect.height / 2;
            let rx = rect.width / 2;
            let ry = rect.height / 2;

            this._element.attr({
                cx: cx,
                cy: cy,
                rx: rx,
                ry: ry
            });
        }

        drawComplete(): void {            
            if (!this._element) {
                // Most likely cause is draw was not called - no mouse move event.
                return;
            }

            this._origin.x = Number(this._element.attr("x"));
            this._origin.y = Number(this._element.attr("y"));
            let rx = Number(this._element.attr("rx"));
            let ry = Number(this._element.attr("ry"));

            this._rect.x = this._origin.x;
            this._rect.y = this._origin.y;
            this._rect.width = rx*2;
            this._rect.height = ry*2;
        }

        reDraw() { };

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

        private getBounds(coords: Point): Rect {
            let rect = {
                x: coords.x < this._origin.x ? coords.x : this._origin.x,
                y: coords.y < this._origin.y ? coords.y : this._origin.y,
                width: Math.abs(this._origin.x - coords.x),
                height: Math.abs(this._origin.y - coords.y)  
            };
            return rect;
        }

    }
}