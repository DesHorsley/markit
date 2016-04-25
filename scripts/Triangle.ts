
module markit {

    export class Triangle extends Shape {

        private _boundingBox: Rect;

        public get boundingBox(): Rect {
            return this._boundingBox;
        }

        public set boundingBox(box: Rect) {
            this._boundingBox = box;
        }

        public set origin(coords: Point) {
            this._origin = coords;
        }

        public useDefaultBoundingBox: boolean;

        constructor(paper: Snap.Paper, origin: Point, toolSettings: ToolSettings) {
            super(paper, origin, toolSettings);

            this.useDefaultBoundingBox = false;
        }

        public destroy(): void {
            if (this._selectedHandles.length) {
                this.removeHandles();
            }
            if (typeof this._element !== "undefined" && this._element) {
                this._element.remove();
                this._element = null;
            }
        }

        public draw(coords: Point): void {
            if (typeof coords == "undefined" || coords == null) {
                throw "coords parameter is required.";
            }

            let rect;
            if (this.useDefaultBoundingBox) {
                rect = this._boundingBox;
            }
            else {
                rect = this.calculateRect(coords);
                this._boundingBox = rect;
            }
            
            if (typeof this._element == "undefined" || this._element == null) {
                this.createElement(rect, coords);
            }
            else {
                let fromLeft = true;
                if (coords.x < this._origin.x) {
                    fromLeft = false;
                }
                this.setElementCoords(rect, fromLeft);
            }
        }

        private createElement(rect: Rect, coords: Point): void {

            let vertices;
            if (this._origin.x < coords.x) {
                vertices = this.getVertices(rect);
            } else {
                vertices = this.getVertices(rect, false);
            }

            this._element = this.paper.polygon(vertices);
            this._element.attr({
                    stroke: this._toolSettings.stroke,
                    strokeWidth: this._toolSettings.strokeWidth,
                    fill: this._toolSettings.stroke
            });          
        }               

        private setElementCoords(r?: Rect, fromLeft: boolean = true): void {
            let rect = r || this.boundingBox;
            let vertices;
            if (fromLeft) {
                vertices = this.getVertices(rect);
            } else {
                vertices = this.getVertices(rect, false);
            }
            let verticeString = this.getVerticesAsString(vertices);
            //let angle = this.getAngle(coords);

            this._element.attr({
                points: verticeString
            });            
        }

        private createHandles(): void {
            if (this._selected) {
                this._selectedHandles.push(this.paper.ellipse(this._boundingBox.x, this._boundingBox.y, 5, 5));
                this._selectedHandles.push(this.paper.ellipse(this._boundingBox.x + this._boundingBox.width, this._boundingBox.y, 5, 5));
                this._selectedHandles.push(this.paper.ellipse(this._boundingBox.x + this._boundingBox.width, this._boundingBox.y + this._boundingBox.height, 5, 5));
                this._selectedHandles.push(this.paper.ellipse(this._boundingBox.x, this._boundingBox.y + this._boundingBox.height, 5, 5));
                this._selectedHandles.forEach(h => h.attr({
                    fill: "#C0C0C0"
                }));
            }            
        }

        private setHandleCoords(r?: Rect): void {

            if (this._selected) {
                let rect = r || this._boundingBox;
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
        }

        private removeHandles(): void {
            while (this._selectedHandles.length > 0) {
                let h = this._selectedHandles.pop();
                h.remove();
            }
        }

        public rotateElement(coords: Point, angle: number): void {
            let str = `rotate(${angle}, ${coords.x}, ${coords.y})`;
            console.log("triangle.rotateElement called: " + str);
            this._element.transform(str); 
        }

        public select(): void {
            console.log("triangle.select called.");
            if (!this._selected) {
                this._selected = true;
                if (this._element) {
                    this.createHandles();
                }
            }
        }

        public deselect(): void {
            console.log("triangle.deselect called.");
            if (this._selected) {
                this.removeHandles();
                this._selected = false;
            }
        }

        public drawComplete(selectShape?: boolean): void {

            let selected = true;
            if (typeof selectShape !== "undefined" && selectShape != null) {
                selected = selectShape;
            }
            
            console.log("traingle.drawComplete called: selectShape: " + selectShape);
            if (selected) {
                this.select();
            }            

            let box = this._element.getBBox();
            this._boundingBox.x = box.x;
            this._boundingBox.width = box.w;
            this._boundingBox.y = box.y;
            this._boundingBox.height = box.h;
            this._origin.x = box.x;
            this._origin.y = box.y;

            console.log("triangle.drawComplete called: bounding box: {" + box.x + "," + box.y + "}, width: " + box.w + ", height: " + box.h);
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
            this.setElementCoords(rect,h.fromLeft);
            this.setHandleCoords(rect);
        }

        private resizeFromTop(offset: Point): { y: number, height: number } {

            let y, height;
            if (offset.y < 0) {
                y = this.boundingBox.y + offset.y;
                height = this.boundingBox.height - offset.y;
            } else if (offset.y > this.boundingBox.height) {
                y = this.boundingBox.y + this.boundingBox.height;
                height = offset.y - this.boundingBox.height;
            } else {
                y = this.boundingBox.y + offset.y;
                height = this.boundingBox.height - offset.y;
            }

            return {
                y: y,
                height: height
            };
        }

        private resizeFromBottom(offset: Point): { y: number, height: number } {

            let y, height;
            if (offset.y > 0) {
                y = this.boundingBox.y;
                height = this.boundingBox.height + offset.y;
            } else if (Math.abs(offset.y) > this.boundingBox.height) {
                y = this.boundingBox.y + this.boundingBox.height + offset.y;
                height = Math.abs(offset.y) - this.boundingBox.height;
            } else {
                y = this.boundingBox.y;
                height = this.boundingBox.height + offset.y;
            }

            return {
                y: y,
                height: height
            };
        }

        private resizeFromLeft(offset: Point): { x: number, width: number, fromLeft: boolean } {
            let x, width;
            let drawFromLeft = true;
            if (offset.x < 0) {
                x = this.boundingBox.x + offset.x;
                width = this.boundingBox.width - offset.x;
            } else if (offset.x > this.boundingBox.width) {
                x = this.boundingBox.x + this.boundingBox.width;
                width = offset.x - this.boundingBox.width;
                drawFromLeft = false;
            } else {
                x = this.boundingBox.x + offset.x;
                width = this.boundingBox.width - offset.x;
            }

            return {
                x: x,
                width: width,
                fromLeft: drawFromLeft
            };
        }

        private resizeFromRight(offset: Point): { x: number, width: number, fromLeft: boolean } {

            let x, width;
            let drawFromLeft = true;
            if (offset.x > 0) {
                x = this.boundingBox.x;
                width = this.boundingBox.width + offset.x;
            } else if (Math.abs(offset.x) > this.boundingBox.width) {
                x = this.boundingBox.x + this.boundingBox.width + offset.x;
                width = Math.abs(offset.x) - this.boundingBox.width;
                drawFromLeft = false;
            } else {
                x = this.boundingBox.x;
                width = this.boundingBox.width + offset.x;
            }
            return {
                x: x,
                width: width,
                fromLeft: drawFromLeft
            };
        }

        protected drag(offset: Point): void {

            let rect = {
                x: this.boundingBox.x + offset.x,
                y: this.boundingBox.y + offset.y,
                width: this.boundingBox.width,
                height: this.boundingBox.height
            };
            this.setElementCoords(rect);
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
                stroke: this.toolSettings.stroke,
                strokeWidth: this.toolSettings.strokeWidth,
                fill: this.toolSettings.fill
            });
        }

        private getVertices(r?: Rect, fromLeft: boolean = true): number[][] {

            let rect = r || this._boundingBox;
            let p1, p2, p3 = [];
            if (fromLeft) {
                p1 = [rect.x, rect.y];
                p2 = [rect.x + rect.width, rect.y + rect.height/2];
                p3 = [rect.x, rect.y + rect.height];
            } else {
                p1 = [rect.x + rect.width, rect.y];
                p2 = [rect.x, rect.y + rect.height/2];
                p3 = [rect.x + rect.width, rect.y + rect.height];
            }
            let vertices = [p1, p2, p3];
            return vertices;
        }

        private getVerticesAsString(vertices: number[][]): string {

            let str: string;
            str = "";
            for (let i = 0; i < vertices.length; i++) {
                str += `${vertices[i][0]},${vertices[i][1]} `;
            }
            str = str.trim();
            return str;
        }

        private getAngle(coords: Point): number {

            let dX = coords.x - this.origin.x;
            let dY = coords.y - this.origin.y;
            let angle = Math.atan2(dY, dX) / Math.PI * 180;
            return Math.round(angle);
        }

        private calculateRect(coords: Point): Rect {

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