import { BoundingBox, XY } from "./Helper.js";

class Text{
    constructor(ctx){
        this._x = 0;
        this._y = 0;
        this._ctx = ctx;

        this.isActive = false;
        this.isFocused = false;
        this.isHovered = false;

        this._offset = 10;

        this._color = "black";
        this._strokeColor = () => { return this.isActive ? "#0000FF" : (this.isHovered ? "#AAAAFF" : "#FAFAFA"); };

        this._fontSize = 27;
        this._fontUnit = "pt";
        this._fontFamily = "serif";

        this._text = "default text";
    }
    move(x, y){
        this._x = x;
        this._y = y + this._fontSize;
    }
    draw(){
        this._ctx.fillStyle = this._color;
        this._ctx.font = this.font;
        this._ctx.fillText(this._text, this._x, this._y);

        this.drawRectangle();
    }
    drawRectangle(){
        let textWidth = this._ctx.measureText(this._text).width;

        this._ctx.strokeStyle = this._strokeColor();

        this._ctx.beginPath();
        this._ctx.moveTo(this._x - this._offset, this._y - this._fontSize - this._offset);
        this._ctx.lineTo(this._x - this._offset, this._y + this._offset);
        this._ctx.lineTo(this.x + textWidth + this._offset, this._y + this._offset);
        this._ctx.lineTo(this.x + textWidth + this._offset, this._y - this._fontSize - this._offset);
        this._ctx.lineTo(this._x - this._offset, this._y - this._fontSize - this._offset);

        this._ctx.stroke();
    }
    set text(txt){
        this._text = txt;
    }
    get text(){
        return this._text;
    }
    get x(){
        return this._x;
    }
    get y(){
        return this._y;
    }
    get font(){
        return this._fontSize + this._fontUnit + " " + this._fontFamily;
    }
    get boundingBox(){
        let textWidth = this._ctx.measureText(this._text).width;
        return new BoundingBox(
            this._y - this._fontSize - this._offset,
            this._x - this._offset,
            this._y + this._offset,
            this.x + textWidth + this._offset);
    }
}

export { Text as default }