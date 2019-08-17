class BoundingBox{
    constructor(top, left, bottom, right){
        this.Top = top;
        this.Left = left;
        this.Bottom = bottom;
        this.Right = right;
    }
}

class XY{
    constructor(x, y){
        this.X = x;
        this.Y = y;
    }
}

export { BoundingBox, XY }