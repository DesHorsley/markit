
/// <reference path="ToolsManager.ts" />
module markit {
    export class MarkitEditor {

        private toolsManager: ToolsManager;
        private svg: any;

        constructor() {
        }

        init(svgId: string) {
            this.svg = document.getElementById(svgId);            
            this.toolsManager = new ToolsManager();
            this.toolsManager.init(this.svg);
        }
    }
}

