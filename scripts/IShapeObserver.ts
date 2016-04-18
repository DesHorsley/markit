
module markit {

    export interface IShapeObserver {

        shapeSelected(shape: Shape, allowMultiple: boolean): void;
        paper: Snap.Paper;
        
    }
}