class InstrumentType{
    static DragableText = "DragableText";
    static Drawing = "Drawing";
}

class Instrument{
    constructor(){
        this.id = 0;
        this.type = 0;
        this.deltas = [];
    }
}

class UpdateType{
    static Position = "Position";
    static Text = "Text";
}

export { InstrumentType, Instrument, UpdateType }