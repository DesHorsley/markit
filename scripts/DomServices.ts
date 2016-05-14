
module markit {

    export class DomServices {

        protected static svgElement: HTMLElement;

        public static setSVG(svg: HTMLElement): void {
            DomServices.svgElement = svg;
        }

        public static getSVG(): HTMLElement {
            return DomServices.svgElement;
        }

        public static createSpan(): SVGTSpanElement {
            return document.createElementNS("http://www.w3.org/2000/svg", "tspan") as SVGTSpanElement;
        }

        public static createImage(): HTMLImageElement {
            return document.createElement("img") as HTMLImageElement;
        }

        public static createDIV(): HTMLDivElement {
            return document.createElement("div") as HTMLDivElement;
        }
    }
}