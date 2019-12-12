class Document{
    constructor(){
        this.id = 0;
        this.objs = [];
    }
}

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
    static Size = "Size";
    static Text = "Text";
    static Dots = "Dots";
}

export { Document, InstrumentType, Instrument, UpdateType }