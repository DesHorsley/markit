
module markit {

    export enum CommandMode {
        Select = 0,
        Line,
        Rectangle,
        Ellipse
    }

    export class ToolSettings {

        public commandMode: CommandMode;
        public width: number;
        public height: number;
        public strokeThickness: number;
        public color: any;
        
        constructor() {
            this.commandMode = CommandMode.Select;
            this.width = 1;
            this.height = 1;
            this.strokeThickness = 1;
            this.color = "#fff";
        }       
    
    }

}