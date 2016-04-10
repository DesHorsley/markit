
/// <reference path="ToolSettings.ts" />
/// <reference path="ToolSettingsObserver.ts" />

module markit {

    export class ToolsManager {
        
        private tools: Array<HTMLElement>;
        private toolSettingsManager: ToolSettingsObserver;
        
        constructor(tsManager: ToolSettingsObserver) {
            this.toolSettingsManager = tsManager;                          
        }

        init(svgElement: SVGElement) {
            var toolbar = document.createElement("div") as HTMLDivElement;
            this.tools = this.createTools();
            this.tools.forEach(function (e) {
                toolbar.appendChild(e);
            });
            
            svgElement.parentNode.insertBefore(toolbar, svgElement);                        
        }

        createTools() {
            var tools = new Array<HTMLElement>();

            var btn = document.createElement("button") as HTMLButtonElement;
            btn.id = "markit_btnPtr";
            btn.innerText = "Ptr";
            btn.onclick = this.onclick.bind(this);
            tools.push(btn);

            btn = document.createElement("button") as HTMLButtonElement;
            btn.id = "markit_btnLine";            
            btn.innerText = "Line";
            btn.onclick = this.onclick.bind(this);
            tools.push(btn);

            btn = document.createElement("button") as HTMLButtonElement;
            btn.id = "markit_btnRect";            
            btn.innerText = "Rectangle";
            btn.onclick = this.onclick.bind(this);
            tools.push(btn);

            btn = document.createElement("button") as HTMLButtonElement;
            btn.id = "markit_Ellipse";            
            btn.innerText = "Ellipse";
            btn.onclick = this.onclick.bind(this);
            tools.push(btn);

            btn = document.createElement("button") as HTMLButtonElement;
            btn.id = "markit_Arrow";
            btn.innerText = "Arrow";
            btn.onclick = this.onclick.bind(this);
            tools.push(btn);

            btn = document.createElement("input") as HTMLInputElement;
            btn.id = "markit_Image";
            btn.type = "file";
            let multipleAttr = document.createAttribute("multiple");
            btn.setAttribute("multiple", "multiple");
            btn.setAttribute("accept", "image/*");
            btn.innerHTML = "Image";
            btn.onchange = this.onchange.bind(this);
            tools.push(btn);

            return tools;
        }
            
        onclick(e) {
        
            var toolSettings = new ToolSettings();

            switch (e.target.id) {
                case "markit_btnPtr": 
                    
                    toolSettings.commandMode = CommandMode.Select;
                    this.toolSettingsManager.setToolSettings(toolSettings);
                    break;
                
                case "markit_btnLine": 
                    toolSettings.commandMode = CommandMode.Line;
                    this.toolSettingsManager.setToolSettings(toolSettings);
                    break;
                
                case "markit_btnRect": 
                    toolSettings.commandMode = CommandMode.Rectangle;
                    this.toolSettingsManager.setToolSettings(toolSettings);
                    break;
                
                case "markit_Ellipse": 
                    toolSettings.commandMode = CommandMode.Ellipse;
                    this.toolSettingsManager.setToolSettings(toolSettings);
                    break;

                case "markit_Arrow":
                    toolSettings.commandMode = CommandMode.Arrow;
                    this.toolSettingsManager.setToolSettings(toolSettings);
                    break;
                                
            }            
            
        }

        onchange(e) {

            e = e || window.event;

            for (let i = 0; i < e.target.files.length; i++) {

                let reader = new FileReader();
                reader.onload = (function (evt) {

                    this.toolSettingsManager.addImage((<FileReader>evt.target).result);
                                      
                }).bind(this);
                reader.readAsDataURL(e.target.files[i]);
            }            
        }
                        
    }
}