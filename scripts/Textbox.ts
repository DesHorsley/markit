
module markit {

    export class Textbox extends Rectangle {

        protected _text: Snap.Element;
        protected _mask: HTMLElement;
        
        public get text(): Snap.Element {
            return this._text;
        }
       
        public drawComplete(selected?: boolean): void {
            //this.textControl = new TextControl(this);
            super.drawComplete();
            if (typeof this._mask == "undefined" || this._mask == null) {
                this._mask = this.createMask();
                this._mask.focus();
            }                   
        }

        public redraw(mode: string, offset: Point, handleIndex?: number): void {
            super.redraw(mode, offset, handleIndex);
            if (typeof this._mask != "undefined" && this._mask != null) {
                let rect = this.getBoundingRect();
                let svg = DomServices.getSVG();
                let canvasRect = svg.getBoundingClientRect();
                let borderTop = parseInt(svg.style.borderTopWidth);
                let borderLeft = parseInt(svg.style.borderLeftWidth);

                let maskTop = canvasRect.top + borderTop + rect.y + this.toolSettings.strokeWidth;
                let maskLeft = canvasRect.left + rect.x + borderLeft + this.toolSettings.strokeWidth;
                let maskWidth = rect.width - this.toolSettings.strokeWidth * 2;
                let maskHeight = rect.height - this.toolSettings.strokeWidth * 2;
                
                let str = `top: ${maskTop}px; left: ${maskLeft}px; width: ${maskWidth}px; height: ${maskHeight}px`;
                this._mask.style.cssText = str;
            }
            if (typeof this._text != "undefined" && this._text != null) {
                if (mode == "drag") {
                    let rect = this.getBoundingRect();
                    let x = rect.x + this.toolSettings.strokeWidth + 3;
                    let y = rect.y + this.toolSettings.strokeWidth + 12 + (12 / 3)
                    this._text.attr({ x: rect.x + this.toolSettings.strokeWidth, y: rect.y + this.toolSettings.strokeWidth });

                    for (let i = 0; i < this._text.node.children.length; i++) {
                        if (i == 0) {
                            (this._text.node.children[i] as SVGTSpanElement).setAttribute("x", x.toString());
                            (this._text.node.children[i] as SVGTSpanElement).setAttribute("y", y.toString());
                        }
                        else {
                            (this._text.node.children[i] as SVGTSpanElement).setAttribute("x", x.toString());
                        }
                    }
                }
                else if (mode == "resize") {
                    let str = this.getText();
                    this.removeTextLines();
                    let rect = this.getBoundingRect();
                    this._text.attr({ x: rect.x + this.toolSettings.strokeWidth, y: rect.y + this.toolSettings.strokeWidth });
                    let span = DomServices.createSpan();
                    let x = rect.x + this.toolSettings.strokeWidth + 3;
                    let y = rect.y + this.toolSettings.strokeWidth + 12 + (12 / 3);
                    span.setAttribute("x", x.toString());
                    span.setAttribute("y", y.toString());
                    this._text.node.appendChild(span);
                    this.insertText(str);
                }
            }
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

        protected createMask(): HTMLElement {

            let mask = DomServices.createDIV();
            let rect = this.getBoundingRect();
            let borderWidth = parseInt(this._element.attr("strokeWidth"));
            
            let svg = DomServices.getSVG();
            let canvasRect = svg.getBoundingClientRect();
            let borderTop = parseInt(svg.style.borderTopWidth);
            let borderLeft = parseInt(svg.style.borderLeftWidth);

            let maskTop = canvasRect.top + borderTop + rect.y + borderWidth;
            let maskLeft = canvasRect.left + rect.x + borderLeft + borderWidth;
            let maskWidth = rect.width - borderWidth * 2;
            let maskHeight = rect.height - borderWidth * 2;

            mask.contentEditable = "true";
            mask.className = "markit-textmask";
            let str = `top: ${maskTop}px; left: ${maskLeft}px; width: ${maskWidth}px; height: ${maskHeight}px`;
            mask.style.cssText = str;
            let closeIcon = this.createMaskCloseIcon();
            mask.appendChild(closeIcon);
            DomServices.getSVG().parentNode.insertBefore(mask, DomServices.getSVG().nextSibling);                        
            return mask;
        }

        protected hide(): void {
            this.removeMaskEventHandlers();
            DomServices.getSVG().parentNode.removeChild(this._mask);
            this._mask = null;
        }             
        
        protected closeEditor(): void {
            
            let coords = this.getBoundingRect();
            if (typeof this._text == "undefined" || this._text == null) {
                
                let border = this.toolSettings.strokeWidth;
                this._text = this.paper.text(coords.x + border, coords.y + border, "");
                
            }
            while (this._text.node.childNodes.length > 0) {
                this._text.node.removeChild(this._text.node.firstChild);
            }

            let span = DomServices.createSpan();
            let x = coords.x + this.toolSettings.strokeWidth + 3;
            let y = coords.y + this.toolSettings.strokeWidth + 12 + (12/3);
            span.setAttribute("x", x.toString());
            span.setAttribute("y", y.toString());
            this._text.node.appendChild(span);
            this.insertText(this._mask.textContent);            
            this.hide();
        }

        protected insertText(text: string): void {

            let words = text.split(" ");
            let rect = this.getBoundingRect();

            let spanWidth = rect.width - (this.toolSettings.strokeWidth * 2) - 6;
            let span = this._text.node.firstChild as SVGTSpanElement;
            for (let i = 0; i < words.length; i++) {
                span.innerHTML += words[i] + " ";

                let str = "word tested: " + words[i] + "\r\n";
                str += "parent client width: " + span.parentElement.clientWidth;
                str += "\r\nspan client Width: " + span.clientWidth;
                str += "\r\nspan boundingClientRect width: " + span.getBoundingClientRect().width;
                str += "\r\nspan computed text length: " + span.getComputedTextLength();

                console.log(str);

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

        protected createMaskCloseIcon(): HTMLImageElement {

            let closeIcon = DomServices.createImage();
            closeIcon.src = "content/window-close-icon.png";
            closeIcon.className = "markit-close-window";
            closeIcon.onclick = this.closeEditor.bind(this);
            return closeIcon;
        }        

        protected removeMaskEventHandlers(): void {
           let list = this._mask.getElementsByClassName("markit-close-window");
            if (list.length > 0) {
                if (list[0] instanceof HTMLImageElement) {
                    (list[0] as HTMLImageElement).onclick = null;
                }
            }
        }
       
    }
}