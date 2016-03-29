
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="Shape.ts" />

module markit {

    export class Rectangle extends Shape {
        
        public endpoint: { x: number, y: number };

        private flipX: boolean;
        private flipY: boolean;

        constructor(theSurface: Snap.Paper, attr?: Object) {
            super(theSurface, attr);

            this.flipX = false;
            this.flipY = false;
        }

        resize(coords: { x: number, y: number }, fromOrigin = false) {
                    
            if (fromOrigin) {
                this.origin = coords;
            }
            else {
                this.endpoint = coords;
            }

            if (this.element === undefined || this.element === null) {

                this.element = this.surface.rect(this.origin.x, this.origin.y, 1, 1);
                this.element.attr(this.attributes);
            }
            else {

                var x, y, w, h;
                if (this.endpoint.x < this.origin.x) {
                    this.flipX = true;
                    x = this.endpoint.x;
                }
                else {
                    this.flipX = false;
                    x = this.origin.x;
                }

                if (this.endpoint.y < this.origin.y) {
                    this.flipY = true;
                    y = this.endpoint.y;
                }
                else {
                    this.flipY = false;
                    y = this.origin.y;
                }

                w = Math.abs(this.endpoint.x - this.origin.x);
                h = Math.abs(this.endpoint.y - this.origin.y);
                
                this.element.attr({
                    x: x,
                    y: y,
                    width: w,
                    height: h
                });

            }

        }

        flipCoords(): void {
            
            if (this.flipX) {
                var x = this.origin.x;
                this.origin.x = this.endpoint.x;
                this.endpoint.x = x;
            }

            if (this.flipY) {
                var y = this.origin.y;
                this.origin.y = this.endpoint.y;
                this.endpoint.y = y;
            }
        }
    }
}