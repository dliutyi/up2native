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
            redrawDrawings: null
        }
    },
    created() {
        console.log("drawing instrument");
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.dots.push({ x: this.left, y: this.top });

        this.redrawDrawings = debounce(this.handleDeboubcing, 10);
    },
    mounted(){
        this.moving.isActive = true;

        this.canvas = document.getElementById(this.id);
        this.context = this.canvas.getContext("2d");

        this.context.clearRect(0, 0, this.width, this.height);

        this.context.beginPath();
        this.context.moveTo(this.dots[0].x, this.dots[0].y);

        this.$emit("handleObjDrag", { move: this.handleDrawingMove, up: this.handleDrawingEnd });
    },
    methods: {
        handleHover(isHover){
            if(!this.isActive){
                this.color = isHover ? "#AAAAFF" : "transparent";
            }
        },
        handleDeboubcing(event){
            console.log("resizeWindow");

            window.removeEventListener("resize", this.resizeWindow);

            this.context.clearRect(0, 0, this.width, this.height);

            this.context.beginPath();
            this.context.moveTo(this.dots[0].x - this.x, this.dots[0].y - this.y);
            for(let dot of this.dots){
                this.context.lineTo(dot.x - this.x, dot.y - this.y);
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
            this.moving.isFocus = false;
        },
        handleDrawingEnd(event){
            if(this.moving.isActive){
                this.moving.isActive = false;

                let aabb = this.getBoundingBox();

                console.log(aabb.LeftUp.x + " " + aabb.LeftUp.y);
                console.log(aabb.RightDown.x + " " + aabb.RightDown.y);

                this.x = aabb.LeftUp.x;
                this.y = aabb.LeftUp.y;
                this.width = aabb.RightDown.x - aabb.LeftUp.x;
                this.height = aabb.RightDown.y - aabb.LeftUp.y;

                this.redrawDrawings();
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
            this.color = "#0000FF";
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
                border: "1px outset " + this.color	
            }	
        }
    },
    props: ["top", "left", "id"]
};

</script>

<style lang="sass">



</style>