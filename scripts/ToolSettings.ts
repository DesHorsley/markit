
module markit {

    export enum CommandMode {
        None = 0,
        Select,
        Line,
        Rectangle,
        Ellipse,
        Arrow
    }

    export class ToolSettings {

        public commandMode: CommandMode;
        public width: number;
        public height: number;
        public strokeWidth: number;
        public stroke: string;
        public fill: string;

        constructor() {
            this.commandMode = CommandMode.None;
            this.width = 1;
            this.height = 1;
            this.strokeWidth = 1;
            this.stroke = "#000";
            this.fill = "none";
        }       
    
    }

}