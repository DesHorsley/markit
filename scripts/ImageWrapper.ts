/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="Shape.ts" />
/// <reference path="toolSettings.ts" />

module markit {

    export class ImageWrapper extends Shape {

        protected _imageURL: URL;

        protected _width: number;
        protected _height: number;

        public get imageURL(): URL {
            return this._imageURL;
        }

        public get width(): number {
            return this._width;
        }

        public get height(): number {
            return this._height;
        }

        constructor(surface: Snap.Paper, origin: { x: number, y: number }, toolSettings: ToolSettings,
            imageURL: URL) {
            super(surface, origin, toolSettings);
            this._imageURL = imageURL;
        }

        draw(coords: { x: number, y: number }): void {

            if (typeof coords == "undefined" || coords == null) {
                throw "coords parameter is required.";
            }

            if (typeof this._element == "undefined" || this._element == null) {

                let image = new Image();
                image.src = this._imageURL.toString();
                this._width = image.width
                this._height = image.height;

                this._element = this._surface.image(this._imageURL.toString(), coords.x, coords.y, this._width, this._height);
                
            }
            else {
                
            }
        }

        reDraw() {
            //TODO: implement
        }

        drawComplete(): void {
            // not implemented
        }

        containsElement(element: any) {
            // TODO: implement
            return false;
        }

        setToolSettings(settings: ToolSettings): void {

            super.setToolSettings(settings);

            this._element.attr({
                stroke: this._toolSettings.stroke,
                strokeWidth: this._toolSettings.strokeWidth,
                fill: this._toolSettings.fill
            });
        }

    }
}