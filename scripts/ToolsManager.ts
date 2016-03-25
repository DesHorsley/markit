
module markit {

    export class ToolsManager {
        
        private canvas: HTMLCanvasElement;
        private tools: Array<HTMLElement>;

        constructor(canvas: HTMLCanvasElement) {
            this.canvas = canvas;            
        }

        init() {
            var toolbar = document.createElement("div") as HTMLDivElement;
            this.tools = this.createTools();
            this.tools.forEach(function (e) {
                toolbar.appendChild(e);
            });
        }

        createTools() {
            var tools = new Array<HTMLElement>();

            var btn = document.createElement("button") as HTMLButtonElement;
            btn.id = "markit_btnPtr";
            btn.innerText = "Ptr";
            btn.onclick = this.onclick;
            tools.push(btn);

            btn = document.createElement("button") as HTMLButtonElement;
            btn.id = "markit_btnLine";            
            btn.innerText = "Line";
            btn.onclick = this.onclick;
            tools.push(btn);

            btn = document.createElement("button") as HTMLButtonElement;
            btn.id = "markit_btnRect";            
            btn.innerText = "Rectangle";
            btn.onclick = this.onclick;
            tools.push(btn);

            btn = document.createElement("button") as HTMLButtonElement;
            btn.id = "markit_Ellipse";            
            btn.innerText = "Ellipse";
            btn.onclick = this.onclick;
            tools.push(btn);

            return tools;
        }
            
        onclick(e) {            
            console.log("id: " + e.target.id.toString() + ", " + e.clientX.toString() + ", " + e.clientY.toString());
        }
                        
    }
}