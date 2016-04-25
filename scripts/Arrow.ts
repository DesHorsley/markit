
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="Shape.ts" />
/// <reference path="ToolSettings.ts" />

interface String {
    format(args: (string|number)[]  ): string;
}

module markit {

    export class Arrow extends Shape {
    
        protected _line: Line;
        protected _arrowHead: Triangle;

        public get element(): Snap.Element {
            return this._line.element;
        }

        constructor(paper: Snap.Paper, origin: Point, toolSettings: ToolSettings) {
            super(paper, origin, toolSettings);

            this._line = new Line(paper, origin, toolSettings);
            this._arrowHead = new Triangle(paper, origin, toolSettings);

            let rect = {
                x: 0,
                y: 0,
                width: 12,
                height: 12
            };
            this._arrowHead.boundingBox = rect;
            this._arrowHead.useDefaultBoundingBox = true;
        }

        public destroy(): void {
            if (this._selectedHandles.length) {
                this.removeHandles();
                this._arrowHead.destroy();
                this._line.destroy();
                this._element = null;
            }
        }

        draw(coords: Point): void {

            if (typeof coords == "undefined" || coords == null) {
                throw "coords parameter is required.";
            }

            this._line.draw(coords);
            this._arrowHead.origin = coords;  
            this._arrowHead.boundingBox.x = coords.x;
            this._arrowHead.boundingBox.y = coords.y - this._arrowHead.boundingBox.height / 2;       
            this._arrowHead.draw(coords);

            let angle = this.calculateAngle(coords);
            this._arrowHead.rotateElement(coords, angle);                     
        }

        private createHandles(): void {           
            this._selectedHandles.push(this.paper.ellipse(this._line.origin.x, this._line.origin.y, 5, 5));
            this._selectedHandles.push(this.paper.ellipse(this._line.endpoint.x, this._line.endpoint.y, 5, 5));           
            this._selectedHandles.forEach(h => h.attr({
                fill: "#C0C0C0"
            }));
        }

        private setHandleCoords(startCoords?: Point, endCoords?: Point): void {

            let start = startCoords || this._line.origin;
            let end = endCoords || this._line.endpoint;
            console.log("arrow.setHandleCoords called: startCoords: x: " + start.x + ", y: " + start.y +
                ", endCoords: x: " + end.x + ", y: " + end.y);
            this._selectedHandles[0].attr({
                cx: start.x,
                cy: start.y
            });           
            this._selectedHandles[1].attr({
                cx: end.x,
                cy: end.y
            });
        }

        private removeHandles(): void {
            while (this._selectedHandles.length > 0) {
                let handle = this._selectedHandles.pop();
                handle.remove();

                // TODO: remove any event handlers                
            }
        }

        public select(): void {
            console.log("arrow.select called.");
            if (!this._selected) {
                this._selected = true;
                this.createHandles();                
            }
        }

        public deselect(): void {
            console.log("Line.deselect called.");
            if (this._selected) {
                this.removeHandles();
                this._selected = false;
            }
        }

        public drawComplete(selectShape?: boolean) {
            console.log("arrow.drawComplete called.");
            this.select();
            this._line.drawComplete(false);
            this._arrowHead.drawComplete(false);
            this.origin.x = this._line.origin.x;
            this.origin.y = this._line.origin.y;
            this.setHandleCoords();
        }

        public redraw(mode: string, offset: Point, handleIndex?: number): void {
            console.log("arrow.redraw called.");
            if (mode === "resize") {
                this.resize(offset, handleIndex);
            } else if (mode === "drag") {
                this.drag(offset);
            }                        
        }

        private resize(offset: Point, handleIndex: number): void {

            let startCoords; 
            let endCoords;           
            if (handleIndex === 0) {
                startCoords = {
                    x: this._line.origin.x + offset.x,
                    y: this._line.origin.y + offset.y
                };
                endCoords = {
                    x: this._line.endpoint.x,
                    y: this._line.endpoint.y
                };                                
            } else {
                startCoords = {
                    x: this._line.origin.x,
                    y: this._line.origin.y
                };
                endCoords = {
                    x: this._line.endpoint.x + offset.x,
                    y: this._line.endpoint.y + offset.y
                };                
            }
            let angle = this.calculateAngle(endCoords,startCoords);
            this._line.redraw("resize", offset, handleIndex);
            this._arrowHead.origin = endCoords;
            this._arrowHead.boundingBox.x = endCoords.x;
            this._arrowHead.boundingBox.y = endCoords.y - this._arrowHead.boundingBox.height / 2;
            this._arrowHead.draw(endCoords);
            this._arrowHead.rotateElement(endCoords, angle);
            this.setHandleCoords(startCoords, endCoords);
        }

        private drag(offset: Point): void {

            let startCoords = {
                x: this._line.origin.x + offset.x,
                y: this._line.origin.y + offset.y
            };
            let endCoords = {
                x: this._line.endpoint.x + offset.x,
                y: this._line.endpoint.y + offset.y
            };
            let angle = this.calculateAngle(endCoords, startCoords);
            this._line.redraw("drag", offset, -1);
            this._arrowHead.origin = endCoords;
            this._arrowHead.boundingBox.x = endCoords.x;
            this._arrowHead.boundingBox.y = endCoords.y - this._arrowHead.boundingBox.height / 2;
            this._arrowHead.draw(endCoords);
            this._arrowHead.rotateElement(endCoords, angle);
            this.setHandleCoords(startCoords, endCoords);
        }

        public containsElement(element: Element): boolean {
            console.log("arrow.containsElement called.");
            if (this._selectedHandles.length) {
                if (this._selectedHandles[0].node === element || this._selectedHandles[1].node === element) {
                    return true;
                }
            }
            return this._line.element.node === element || this._arrowHead.element.node === element;
        }

        protected setToolSettings(): void {
            this._element.attr({
                stroke: this._toolSettings.stroke,
                strokeWidth: this._toolSettings.strokeWidth,
                fill: this._toolSettings.fill
            });
        }
        
        private calculateAngle(coords: Point, startCoords?: Point): number {
            let start = startCoords || this._line.origin;
            let dX = coords.x - start.x;
            let dY = coords.y - start.y;
            let angle = Math.atan2(dY, dX) / Math.PI * 180;           
            return Math.round(angle);
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