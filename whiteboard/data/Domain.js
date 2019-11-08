class Document{
    constructor(){
        this.id = 0;
        this.objs = [];
    }
}

class InstrumentType{
    static DragableText = "DragableText";
    static Drawing = "Drawing";
    static Moving = "Moving";
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
    static Dots = "Dots";
}

export { Document, InstrumentType, Instrument, UpdateType }