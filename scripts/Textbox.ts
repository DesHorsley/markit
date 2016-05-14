
module markit {

    export class Textbox extends Rectangle {

        protected _text: Snap.Element;
        protected _mask: HTMLElement;        
        protected _resizing: boolean;

        public get text(): Snap.Element {
            return this._text;
        }

        constructor(paper: Snap.Paper, origin: Point, toolSettings: ToolSettings) {
            super(paper, origin, toolSettings);
            this._resizing = false;
            this._text = null;
            this._mask = null;
        }

        public drawComplete(selected?: boolean): void {            
            super.drawComplete();
            if (this._mask == null) {               
                this.createMask();
                this._mask.focus();                               
            }                              
        }

        public select(): void {
            super.select();
            if (this._mask == null) {
                this.createMask();
                if (this._text != null) {
                    this.transferTextToEditor();
                }                
            }
        }

        public deselect(): void {
            super.deselect();
            this.closeEditor();
        }

        public redraw(mode: string, offset: Point, handleIndex?: number): void {
            super.redraw(mode, offset, handleIndex);
            this.positionMask();            
        }

        public containsElement(element: Element): boolean {

            if (this._text != null) {
                if (this._text.node === element) {
                    return true;
                }                
                for (let i = 0; i < this._text.node.children.length; i++) {
                    if (this._text.node.children[i] === element) {
                        return true;
                    }
                }                               
            }
            return super.containsElement(element);                              
        }

        protected createMask(): void {
            this._mask = DomServices.createDIV();            
            this._mask.contentEditable = "true";
            this._mask.className = "markit-textmask"; 
            this.positionMask();           
            DomServices.getSVG().parentNode.insertBefore(this._mask, DomServices.getSVG().nextSibling);            
        }

        protected positionMask(): void {

            let rect = this.getBoundingRect(); 
            let svg = DomServices.getSVG();
            let canvasRect = svg.getBoundingClientRect();
            let borderTop = parseInt(svg.style.borderTopWidth);
            let borderLeft = parseInt(svg.style.borderLeftWidth);

            let maskTop = canvasRect.top + rect.y + borderTop + this.toolSettings.strokeWidth;
            let maskLeft = canvasRect.left + rect.x + this.toolSettings.strokeWidth;
            //let maskLeft = canvasRect.left + rect.x + borderLeft + this.toolSettings.strokeWidth;
            let maskWidth = rect.width - this.toolSettings.strokeWidth * 2;
            let maskHeight = rect.height - this.toolSettings.strokeWidth * 2;
            let log = `rect width: ${rect.width}, rect left: ${rect.x}, maskWidth: ${maskWidth}, maskLeft: ${maskLeft}`
            console.log(log);
            this._mask.contentEditable = "true";
            this._mask.className = "markit-textmask";
            let str = `top: ${maskTop}px; left: ${maskLeft}px; width: ${maskWidth}px; height: ${maskHeight}px`;
            this._mask.style.cssText = str;
        }

        protected removeMask(): void {            
            DomServices.getSVG().parentNode.removeChild(this._mask);            
            this._mask = null;            
        }             

        protected transferTextToEditor(): void {
            let str = this.getText();
            this._mask.textContent = str;
            this.removeTextLines();
        }

        protected closeEditor(): void {
            
            let coords = this.getBoundingRect();
            if (this._text == null) {                
                let border = this.toolSettings.strokeWidth;
                this._text = this.paper.text(coords.x + border, coords.y + border, "");                
            }
            this.removeTextLines();            
            let span = DomServices.createSpan();
            let x = coords.x + this.toolSettings.strokeWidth + 3;
            let y = coords.y + this.toolSettings.strokeWidth + 12 + (12/3);
            span.setAttribute("x", x.toString());
            span.setAttribute("y", y.toString());
            this._text.node.appendChild(span);
            this.insertText(this._mask.textContent);            
            this.removeMask();
        }

        protected insertText(text: string): void {

            let words = text.split(" ");
            let rect = this.getBoundingRect();
            let spanWidth = rect.width - (this.toolSettings.strokeWidth * 2) - 6;
            let str = `rect width: ${rect.width}, strokeWidth: ${this.toolSettings.strokeWidth}, spanWidth: ${spanWidth}`;
            console.log(str);
            let span = this._text.node.firstChild as SVGTSpanElement;
            for (let i = 0; i < words.length; i++) {
                span.innerHTML += words[i] + " ";

                if (span.getComputedTextLength() >= spanWidth) {
                    span.innerHTML = span.innerHTML.substr(0, span.innerHTML.length - (words[i].length + 1));
                    let newSpan = DomServices.createSpan();
                    let dy = 12 + 12 / 2;
                    newSpan.setAttribute("dy", dy.toString());
                    newSpan.setAttribute("x", span.getAttribute("x"));
                    newSpan.innerHTML = words[i] + " ";
                    this._text.node.appendChild(newSpan);
                    span = newSpan;
                }
            }
        }

        protected removeTextLines(): void {
            while (this._text.node.childNodes.length > 0) {
                this._text.node.removeChild(this._text.node.firstChild);
            }
        }

        protected getText(): string {
            let str = '';
            for (let i = 0; i < this._text.node.children.length; i++) {
                str += this._text.node.children[i].textContent;
            }
            return str;
        }

        protected getBoundingRect(): Rect {
            let width = Number(this._element.attr("width"));
            let height = Number(this._element.attr("height"));
            let top = Number(this._element.attr("y"));
            let left = Number(this._element.attr("x"));
            let rect = {
                x: left,
                y: top,                
                width: width,
                height: height
            };
            return rect;
        }       
       
    }
}