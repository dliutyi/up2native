<template>
    <canvas
        v-on:mousedown.stop="handleMouseDown" 
        v-on:mouseover="handleHover(true)" 
        v-on:mouseout="handleHover(false)" 
        v-bind:id="id" 
        v-bind:width="width"
        v-bind:height="height"
        v-bind:style="style"
        >
    </canvas>
</template>

<script>

import { InstrumentType, Instrument, UpdateType } from "../../data/Domain.js"
import { debounce } from "./../objects/Helper.js";

export default {
    name: "drawing",
    data() {
        return {
            color: "transparent",
            isActive: false,
            moving: { isActive: false, isFocus: false },
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            editable: false,
            canvas: null,
            context: null,
            dots: [],
            instrument: new Instrument(),
            redrawDrawings: null
        }
    },
    created() {
        console.log("drawing instrument");
        this.instrument.id = this.id;
        this.instrument.type = this.selectedInstrument;
        this.instrument.deltas.push({ xy: { x: this.left, y: this.top} });

        if(!this.isUpdated){
            this.width = this.maxWidth;
            this.height = this.maxHeight;
            this.dots.push({ x: this.left, y: this.top });
        }

        this.redrawDrawings = debounce(this.handleDeboubcing, 10);
    },
    mounted(){
        this.canvas = document.getElementById(this.id);
        this.context = this.canvas.getContext("2d");
        
        if(!this.isUpdated){
            this.moving.isActive = true;

            this.context.clearRect(0, 0, this.width, this.height);

            this.context.beginPath();
            this.context.moveTo(this.dots[0].x, this.dots[0].y);
        }
        this.$emit("handleObjDrag", { move: this.handleDrawingMove, up: this.handleDrawingEnd });
    },
    methods: {
        receiveUpdate(data){
            for(let delta of data.deltas){
                this.instrument.deltas.push(delta);
                console.log("updates received in Drawing - " + delta.type);
                switch(delta.type){
                    case UpdateType.Position:
                        this.x = delta.xy.x;
                        this.y = delta.xy.y;
                        break;
                    case UpdateType.Size:
                        this.width = delta.xy.x;
                        this.height = delta.xy.y;
                        break;
                    case UpdateType.Dots:
                        console.log("dots = " + delta.dots.length);
                        this.dots = delta.dots;
                        this.redrawDrawings();
                        break;
                }
            }
        },
        sendUpdate(deltas){
            let updateInstrument = new Instrument();
            updateInstrument.id = this.instrument.id;
            updateInstrument.type = InstrumentType.Drawing;
            updateInstrument.deltas = deltas;
            this.$emit("handleUpdateFromClient", updateInstrument);
        },
        resizeDrawings(){
            let aabb = this.getBoundingBox();
            this.x = aabb.LeftUp.x;
            this.y = aabb.LeftUp.y;
            this.width = aabb.RightDown.x - aabb.LeftUp.x;
            this.height = aabb.RightDown.y - aabb.LeftUp.y;
        },
        handleHover(isHover){
            if(!this.isActive){
                this.color = isHover ? "#BBBBBB" : "transparent";
            }
        },
        handleDeboubcing(event){
            console.log("resizeWindow");

            window.removeEventListener("resize", this.resizeWindow);

            this.context.clearRect(0, 0, this.width, this.height);

            this.context.beginPath();
            this.context.moveTo(this.dots[0].x, this.dots[0].y);
            for(let dot of this.dots){
                this.context.lineTo(dot.x, dot.y);
            }
            this.context.stroke();
        },
        handleMouseDown(event){
            this.moving.isFocus = true;
            this.moving.x = event.offsetX;
            this.moving.y = event.offsetY;

            this.$emit("handleObjClick", { focus: this.callbackFocus, unfocus: this.callbackUnfocus });
            this.$emit("handleObjDrag", { move: this.handleMouseMove, up: this.handleMouseUp });
        },
        handleMouseUp(event){
            if(this.moving.isFocus){
                this.moving.isFocus = false;
                this.sendUpdate([{ type: UpdateType.Position, xy: { x: this.x, y: this.y } }]);
            }
        },
        handleDrawingEnd(event){
            if(this.moving.isActive){
                this.moving.isActive = false;

                this.resizeDrawings();

                for(let i = 0; i < this.dots.length; ++i){
                    this.dots[i].x -= this.x;
                    this.dots[i].y -= this.y;
                }

                this.redrawDrawings();

                this.sendUpdate([
                    { type: UpdateType.Position, xy: { x: this.x, y: this.y } },
                    { type: UpdateType.Size, xy: { x: this.width, y: this.height } },
                    { type: UpdateType.Dots, dots: this.dots }
                ]);
            }
        },
        handleDrawingMove(event){
            if(this.moving.isActive){
                this.context.lineTo(event.pageX, event.pageY);
                this.context.stroke();

                this.dots.push({ x: event.pageX, y: event.pageY });
            }
        },
        handleMouseMove(event){
            if(this.moving.isFocus){
                this.y = event.pageY - this.moving.y;
                this.x = event.pageX - this.moving.x;
            }
        },
        handleDblClick(event){
            this.editable = true;
        },
        callbackFocus(text){
            this.isActive = true;
            this.color = "#777777";
        },
        callbackUnfocus(text){
            this.isActive = false;
            this.color = "transparent";
            this.editable = false;
        },
        getBoundingBox(){
            let leftUp = { x: this.width, y: this.height };
            let rightDown = { x: 0, y: 0 };
            
            for(let dot of this.dots){
                if(dot.x < leftUp.x){
                    leftUp.x = dot.x;
                }
                if(dot.y < leftUp.y){
                    leftUp.y = dot.y;
                }
                if(dot.x > rightDown.x){
                    rightDown.x = dot.x;
                }
                if(dot.y > rightDown.y){
                    rightDown.y = dot.y;
                }
            }

            return { LeftUp: leftUp, RightDown: rightDown };
        }
    },
    computed: {
        style(){	
            return{	
                position: "absolute",	
                width: this.width + "px",	
                height: this.height + "px",
                top: this.y + "px",
                left: this.x + "px",	
                border: "1px solid " + this.color,
                borderRadius: "5px"
            }	
        }
    },
    props: ["top", "left", "id", "maxWidth", "maxHeight", "isUpdated"]
};

</script>

<style lang="sass">



</style>