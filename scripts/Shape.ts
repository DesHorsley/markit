
/// <reference path="snap/snapsvg.d.ts" />

module markit {

    export abstract class Shape {

        protected _origin: Point;
        protected _element: Snap.Element;
        protected _selectedHandles: Snap.Element[];
        protected _paper: Snap.Paper;
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

        protected get paper(): Snap.Paper {
            return this._paper;
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
        }

        public deselect() {
            console.log("base deselect called.");
            this._selected = false;            
        }
   
        constructor(paper: Snap.Paper, origin: Point, toolSettings: ToolSettings) {

            if (typeof paper == "undefined" || paper == null) {
                throw "paper parameter is required.";
            }

            if (typeof origin == "undefined" || origin == null) {
                throw "origin parameter is required.";
            }

            if (typeof toolSettings == "undefined" || toolSettings == null) {
                throw "toolSettings parameter is required.";
            }

            this._toolSettings = toolSettings;
            this._paper = paper;
            this._origin = origin;    
            this._selectedHandles = [];                  
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

        public redraw(mode: string, offset: Point, handleIndex?: number): void {
        }

        /**
         * Returns true if the supplie element is equal to an element that makes up the shape, or the shapes selectHandles
         * @param element
         */
        abstract containsElement(element: Element): boolean;

        protected abstract setToolSettings(): void;
        
        public handleIndex(element: Element): number {
            return -1;
        }
       
    }
    
}