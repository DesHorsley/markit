
module markit {

    export interface IShapeObserver {

        shapeSelected(shape: Shape): void;
        paper: Snap.Paper;
        
    }
}