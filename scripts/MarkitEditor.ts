
/// <reference path="ToolsManager.ts" />
module markit {
    export class MarkitEditor {

        private toolsManager: ToolsManager;
        private canvas: HTMLCanvasElement;

        constructor() {
        }

        init(canvasId: string) {
            this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
            this.toolsManager = new ToolsManager(this.canvas);
            this.toolsManager.init();
        }
    }
}

