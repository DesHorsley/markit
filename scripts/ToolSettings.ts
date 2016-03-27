
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
        public strokeWidth: number;
        public stroke: any;
        
        constructor() {
            this.commandMode = CommandMode.Select;
            this.width = 1;
            this.height = 1;
            this.strokeWidth = 1;
            this.stroke = "#000";
        }       
    
    }

}