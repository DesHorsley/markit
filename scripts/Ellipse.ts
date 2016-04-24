
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

        private createHandles(): void {
            this._selectedHandles.push(this.paper.ellipse(this._rect.x, this._rect.y, 5, 5));
            this._selectedHandles.push(this.paper.ellipse(this._rect.x + this._rect.width, this._rect.y, 5, 5));
            this._selectedHandles.push(this.paper.ellipse(this._rect.x + this._rect.width, this._rect.y + this._rect.height, 5, 5));
            this._selectedHandles.push(this.paper.ellipse(this._rect.x, this._rect.y + this._rect.height, 5, 5));
            this._selectedHandles.forEach(h => h.attr({
                fill: "#C0C0C0"
            }));
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

        private setHandleCoords(r?: Rect): void {
            let rect = r || this._rect;
            this._selectedHandles[0].attr({
                cx: rect.x,
                cy: rect.y
            });
            this._selectedHandles[1].attr({
                cx: rect.x + rect.width,
                cy: rect.y
            });
            this._selectedHandles[2].attr({
                cx: rect.x + rect.width,
                cy: rect.y + rect.height
            });
            this._selectedHandles[3].attr({
                cx: rect.x,
                cy: rect.y + rect.height
            });
        }

        private removeHandles(): void {
            while (this._selectedHandles.length > 0) {
                let h = this._selectedHandles.pop();
                h.remove();
            }
        }

        public select(): void {
            console.log("ellipse.select called.");
            if (!this._selected) {
                this._selected = true;
                if (this._element) {
                    this.createHandles();
                }
            }
        }

        public deselect(): void {
            console.log("ellipse.deselect called.");
            if (this._selected) {
                this.removeHandles();
                this._selected = false;
            }
        }

        drawComplete(): void {            
            
            this.select();
            let cx = Number(this._element.attr("cx"));
            let cy = Number(this._element.attr("cy"));
            let rx = Number(this._element.attr("rx"));
            let ry = Number(this._element.attr("ry"));

            this._origin.x = cx - rx;
            this._origin.y = cy - ry;
            this._rect.x = this._origin.x;
            this._rect.y = this._origin.y;
            this._rect.width = rx*2;
            this._rect.height = ry*2;
        }

        public redraw(mode: string, offset: Point, handleIndex?: number): void {
            console.log("ellipse.redraw called.");
            if (mode === "resize") {
                console.log("rectangle.redraw called. mode: resize, handle index: " + handleIndex);
                if (typeof handleIndex === "undefined" || handleIndex === null) {
                    throw "handleIndex required for resizing.";
                }
                this.resize(offset, handleIndex);

            } else if (mode === "drag") {
                this.drag(offset);
            }
        }

        protected resize(offset: Point, handleIndex: number): void {

            let h, v;

            if (handleIndex === 0) {
                h = this.resizeFromLeft(offset);
                v = this.resizeFromTop(offset);
            } else if (handleIndex === 1) {
                h = this.resizeFromRight(offset);
                v = this.resizeFromTop(offset);
            } else if (handleIndex === 2) {
                h = this.resizeFromRight(offset);
                v = this.resizeFromBottom(offset);
            } else {
                h = this.resizeFromLeft(offset);
                v = this.resizeFromBottom(offset);
            }

            let rect = {
                x: h.x,
                width: h.width,
                y: v.y,
                height: v.height
            };
            this.setEllipseCoords(rect);
            this.setHandleCoords(rect);
        }

        private resizeFromTop(offset: Point): { y: number, height: number } {

            let y, height;
            if (offset.y < 0) {
                y = this._rect.y + offset.y;
                height = this._rect.height - offset.y;
            } else if (offset.y > this._rect.height) {
                y = this._rect.y + this._rect.height;
                height = offset.y - this._rect.height;
            } else {
                y = this._rect.y + offset.y;
                height = this._rect.height - offset.y;
            }

            return {
                y: y,
                height: height
            };
        }

        private resizeFromBottom(offset: Point): { y: number, height: number } {

            let y, height;
            if (offset.y > 0) {
                y = this._rect.y;
                height = this._rect.height + offset.y;
            } else if (Math.abs(offset.y) > this._rect.height) {
                y = this._rect.y + this._rect.height + offset.y;
                height = Math.abs(offset.y) - this._rect.height;
            } else {
                y = this._rect.y;
                height = this._rect.height + offset.y;
            }

            return {
                y: y,
                height: height
            };
        }

        private resizeFromLeft(offset: Point): { x: number, width: number } {
            let x, width;
            if (offset.x < 0) {
                x = this._rect.x + offset.x;
                width = this._rect.width - offset.x;
            } else if (offset.x > this._rect.width) {
                x = this._rect.x + this._rect.width;
                width = offset.x - this._rect.width;
            } else {
                x = this._rect.x + offset.x;
                width = this._rect.width - offset.x;
            }

            return {
                x: x,
                width: width
            };
        }

        private resizeFromRight(offset: Point): { x: number, width: number } {

            let x, width;
            if (offset.x > 0) {
                x = this._rect.x;
                width = this._rect.width + offset.x;
            } else if (Math.abs(offset.x) > this._rect.width) {
                x = this._rect.x + this._rect.width + offset.x;
                width = Math.abs(offset.x) - this._rect.width;
            } else {
                x = this._rect.x;
                width = this._rect.width + offset.x;
            }
            return {
                x: x,
                width: width
            };
        }

        protected drag(offset: Point): void {

            let rect = {
                x: this._rect.x + offset.x,
                y: this._rect.y + offset.y,
                width: this._rect.width,
                height: this._rect.height
            };
            this.setEllipseCoords(rect);
            this.setHandleCoords(rect);
        }

        public containsElement(element: Element): boolean {
            if (this._selectedHandles.length) {
                for (let i = 0; i < this._selectedHandles.length; i++) {
                    if (this._selectedHandles[i].node === element) {
                        return true;
                    }
                }
            }
            return this._element.node === element;
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

        public handleIndex(element: Element): number {
            let index = -1;
            if (this._selectedHandles.length) {
                for (let i = 0; i < this._selectedHandles.length; i++) {
                    if (this._selectedHandles[i].node === element) {
                        index = i;
                        break;
                    }
                }
            }
            return index;
        }

    }
}