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

const debounce = (callback, delay) => {
    let inDebounce;
    return function(){
        const context = this;
        const args = arguments;
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => callback.apply(context, args), delay);
    }
}

export { BoundingBox, XY, debounce }