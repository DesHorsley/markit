
/// <reference path="snap/snapsvg.d.ts" />

module markit {

    export abstract class Shape {

        protected _origin: Point;
        protected _element: Snap.Element;
        protected _selectedHandles: Snap.Element[];
        protected _observer: IShapeObserver;
        protected _selected: boolean;
        protected _toolSettings: ToolSettings;

        public get toolSettings(): ToolSettings {
            return this._toolSettings;
        }

        public get selected(): boolean {
            return this._selected;
        }

        public set toolSettings(settings: ToolSettings) {
            if (typeof settings == "undefined" || settings == null) {
                throw "settings required.";
            }
            this._toolSettings = settings;
            this.setToolSettings();
        }

        public get origin(): { x: number, y: number } {
            return this._origin;
        }

        public get element(): Snap.Element {
            return this._element;
        }

        public select() {
            console.log("base select called.");

            this._selected = true;
            this.reDraw();
        }

        public deselect() {
            console.log("base deselect called.");
            this._selected = false;
            this.reDraw();
        }
   
        constructor(observer: IShapeObserver, origin: Point, toolSettings: ToolSettings) {

            if (typeof observer == "undefined" || observer == null) {
                throw "observer parameter is required.";
            }

            if (typeof origin == "undefined" || origin == null) {
                throw "origin parameter is required.";
            }

            if (typeof toolSettings == "undefined" || toolSettings == null) {
                throw "toolSettings parameter is required.";
            }

            this._toolSettings = toolSettings;
            this._observer = observer;
            this._origin = origin;                      
        }       

        abstract destroy(): void;

        removeElement(): void {
            
            if (typeof this._element !== "undefined" && this._element !== null) {
                this._element.remove();
                this._element = null;
            }            
        }

        abstract draw(coords: { x: number, y: number }, actCoords?: any): void;
        abstract drawComplete(): void;

        /**
         * Repaints the element. Used after selecting the element to display selectHandles
         */
        abstract reDraw(): void;

        /**
         * Returns true if the supplie element is equal to an element that makes up the shape, or the shapes selectHandles
         * @param element
         */
        abstract containsElement(element: any): boolean;

        protected abstract setToolSettings(): void;

    }
    
}