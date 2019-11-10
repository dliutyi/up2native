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
    constructor(id = 0, type = 0, isSyncable = false, deltas = []){
        this.id = id;
        this.type = type;
        this.isSyncable = isSyncable;
        this.deltas = deltas;
    }
}

class UpdateType{
    static Position = "Position";
    static Text = "Text";
    static Dots = "Dots";
}

export { Document, InstrumentType, Instrument, UpdateType }