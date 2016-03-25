
/// <reference path="ToolsManager.ts" />

module markit {
    export class MarkitEditor {

        private toolsManager: ToolsManager;
        private svg: any;

        constructor() {
        }

        init(svgId: string) {
            this.toolsManager = new ToolsManager();
            var svg = <SVGElement>document.getElementsByTagName("svg")[0];
            this.toolsManager.init(svg as SVGElement);
        }
        }
    }
}

