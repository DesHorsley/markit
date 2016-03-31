
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="ToolSettings.ts" />

module markit {

    export abstract class Shape {

        protected _origin: { x: number, y: number };
        protected _element: Snap.Element;
        protected _toolSettings: ToolSettings;
        protected _surface: Snap.Paper;

        public get origin(): { x: number, y: number } {
            return this._origin;
        }

        public element(): Snap.Element {
            return this._element;
        }
       
        public get toolSettings(): ToolSettings {
            return this._toolSettings;
        }        
        
        constructor(surface: Snap.Paper, origin: { x: number, y: number }, toolSettings: ToolSettings) {

            if (typeof surface == "undefined" || surface == null) {
                throw "surface parameter is required.";
            }

            if (typeof origin == "undefined" || origin == null) {
                throw "origin parameter is required.";
            }

            if (typeof toolSettings == "undefined" || toolSettings == null) {
                throw "toolSettings parameter is required.";
            }

            this._surface = surface;
            this._origin = origin;
            this._toolSettings = toolSettings;           
        
        }       

        removeElement(): void {
            
            if (typeof this._element !== "undefined" && this._element !== null) {
                this._element.remove();
                this._element = null;
            }            
        }

        abstract draw(coords: { x: number, y: number }): void;
        abstract drawComplete(): void;

        setToolSettings(settings: ToolSettings): void {
        
            if (typeof settings == "undefined" || settings == null) {
                throw "settings parameter is required.";
            }

            this._toolSettings = settings;
        }

    }
    
}