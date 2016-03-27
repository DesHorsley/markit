
/// <reference path="snap/snapsvg.d.ts" />

module markit {

    export abstract class Shape {

        public origin: { x: number, y: number};
        public element: Snap.Element;
        public attributes: Object;
        protected surface: Snap.Paper;

        constructor(theSurface: Snap.Paper, attr?: Object) {
            this.surface = theSurface;
            if (attr !== undefined && attr ) {
                this.attributes = attr
            }
            else {
                this.attributes = {
                    stroke: "#000",
                    strokeWidth: 1
                };
            }               
        
        }       

        remove() {
            if (this.element) {
                this.element.remove();
                this.element = null;
            }
        }

        abstract resize(coords: { x: number, y: number }, fromOrigin: boolean): void;

    }

    export class Line extends Shape {

        public endpoint: { x: number, y: number };

        constructor(theSurface: Snap.Paper, attr?: Object) {
            super(theSurface, attr);
        }

        resize(coords: { x: number, y: number }, fromOrigin = false) {
            
            var previousCoords;
            if (fromOrigin) {
                previousCoords = this.origin;
                this.origin = coords;
            }
            else {
                previousCoords = this.endpoint;
                this.endpoint = coords;
            }

            if (this.element === undefined || this.element === null) {
           
                this.element = this.surface.line(this.origin.x, this.origin.y, this.endpoint.x, this.endpoint.y);
                this.element.attr(this.attributes);
            }
            else {
                this.element.attr({ x2: this.endpoint.x, y2: this.endpoint.y});                
            }            
            
        }
    }
}