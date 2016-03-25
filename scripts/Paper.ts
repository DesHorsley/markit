


/// <reference path="snap/snapsvg.d.ts" />


module markit {

    export class Paper {

        private snap: Snap.Paper;

        constructor(svg: SVGElement) {
            
            this.snap = Snap(svg);
            
        }

    }
}