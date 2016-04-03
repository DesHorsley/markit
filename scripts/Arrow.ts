
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="Shape.ts" />
/// <reference path="ToolSettings.ts" />

interface String {
    format(args: (string|number)[]  ): string;
}

module markit {

    export class Arrow extends Shape {

        private previousEndPoint: { x: number, y: number };

        protected arrowHead: Snap.Element;
        protected line: Snap.Element;

        constructor(surface: Snap.Paper, origin: { x: number, y: number }, toolSettings: ToolSettings) {
            super(surface, origin, toolSettings);
        }

        draw(coords: { x: number, y: number }): void {

            if (typeof coords == "undefined" || coords == null) {
                throw "coords parameter is required.";
            }

            if (typeof this.arrowHead == "undefined" || this.arrowHead == null) {

                var vertices = this.getVertices(this.origin);
                var angle = this.calculateAngle(coords);
                
                this.arrowHead = this._surface.polygon(vertices);

                this.arrowHead.attr({
                    points: this.getPoints(coords)
                });
                    
                var centre = this.getMidPoint(this.getVertices(coords));

                let str = `rotate(${angle}, ${centre.x}, ${centre.y})`;
                console.log("transform string: " + str);
                this.arrowHead.transform(str);                
                 
                this.arrowHead.attr({
                    stroke: this._toolSettings.stroke,
                    strokeWidth: this._toolSettings.strokeWidth,
                    fill: this._toolSettings.stroke
                });

                this.line = this._surface.line(this.origin.x, this.origin.y, centre.x, centre.y);
                this.line.attr({
                    stroke: this._toolSettings.stroke,
                    strokeWidth: this._toolSettings.strokeWidth
                });                
            }
            else {
               
                var angle = this.calculateAngle(coords);
                
                this.arrowHead.attr({
                    points: this.getPoints(coords)
                });
                var centre = this.getMidPoint(this.getVertices(coords));

                let str = `rotate(${angle}, ${centre.x}, ${centre.y})`;
                console.log("transform string: " + str);
                this.arrowHead.transform(str);

                this.line.attr({
                    x2: centre.x,
                    y2: centre.y
                });
                
            }
        }

        drawComplete(): void {
            this._element = this._surface.group([this.arrowHead, this.line]);
        }

        setToolSettings(settings: ToolSettings): void {

            super.setToolSettings(settings);

            this._element.attr({
                stroke: this._toolSettings.stroke,
                strokeWidth: this._toolSettings.strokeWidth,
                fill: this._toolSettings.fill
            });
        }

        removeElement(): void {

            super.removeElement();

            if (typeof this.arrowHead !== "undefined" && this.arrowHead !== null) {
                this.arrowHead.remove();
                this.arrowHead = null;
            }
            if (typeof this.line !== "undefined" && this.line !== null) {
                this.line.remove();
                this.line = null;
            }
        }

        private calculateAngle(coords: { x: number, y: number }): number {

            let dX = coords.x - this.origin.x;
            let dY = coords.y - this.origin.y;
            let angle = Math.atan2(dY, dX) / Math.PI * 180;           
            return Math.round(angle);
        }

        private getPoints(coords: { x: number, y: number }): string {

            let points = [];
            let vertices = this.getVertices(coords);
            for (let i = 0; i < vertices.length; i++) {
                points.push(vertices[i][0]);
                points.push(vertices[i][1]);
            }

            var str = `${points[0]},${points[1]} ${points[2]},${points[3]} ${points[4]},${points[5]}`;
            console.log("points: " + str);
            return str;
        }

        private getVertices(coords: { x: number, y: number }): number[][] {

            var vertices = [
                [coords.x, coords.y - 10],
                [coords.x + 20, coords.y],
                [coords.x, coords.y + 10]
            ];

            return vertices;
        }

        private getMidPoint(vertices: number[][]): { x: number, y: number } {
                    
            let midpoint;
            let mX = Math.round((vertices[0][0] + vertices[1][0] + vertices[2][0]) / 3);
            let mY = Math.round((vertices[0][1] + vertices[1][1] + vertices[2][1]) / 3);
            midpoint = { x: mX, y: mY };
            return midpoint;
        }
    }
}