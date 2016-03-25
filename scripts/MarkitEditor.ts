
/// <reference path="ToolSettingsObserver.ts" />
/// <reference path="ToolsManager.ts" />

module markit {
    export class MarkitEditor implements ToolSettingsObserver {

        private toolsManager: ToolsManager;
        private svg: any;
        private paper: Paper;

        constructor() {
        }

        init(svgId: string) {
            var svg = <SVGElement>document.getElementsByTagName("svg")[0];
            this.paper = new markit.Paper(svg);            
            this.toolsManager = new ToolsManager(this);
            this.toolsManager.init(svg as SVGElement);
        }

        setToolSettings(toolSettings: ToolSettings) {
            console.log("command: " + toolSettings.commandMode);
        }
    }
}

