<template>
    <canvas
        id="drawing" 
        v-on:mousedown.stop="handleMouseDown" 
        v-on:mouseover="handleHover(true)" 
        v-on:mouseout="handleHover(false)" 
        v-bind:width="width"
        v-bind:height="height"
        v-bind:style="style"
        >
    </canvas>
</template>

<script>

export default {
    name: "drawing",
    data() {
        return {
            color: "transparent",
            isActive: false,
            moving: { isActive: false },
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            editable: false,
            canvas: null,
            context: null,
            dots: []
        }
    },
    created() {
        console.log("drawing instrument");
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.dots.push({ x: this.left, y: this.top });
    },
    mounted(){
        this.moving.isActive = true;

        this.canvas = document.getElementById("drawing");
        this.context = this.canvas.getContext("2d");

        this.context.clearRect(0, 0, this.width, this.height);

        this.context.beginPath();
        this.context.moveTo(this.dots[0].x, this.dots[0].y);

        this.$emit("handleObjDrag", { move: this.handleMouseMove, up: this.handleMouseUp });
    },
    methods: {
        handleHover(isHover){
            if(!this.isActive){
                this.color = isHover ? "#AAAAFF" : "transparent";
            }
        },
        resizeWindow(event){
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
            window.addEventListener("resize", this.resizeWindow);

            this.moving.isActive = true;
            this.$emit("handleObjClick", { focus: this.callbackFocus, unfocus: this.callbackUnfocus });
        },
        handleMouseUp(event){
            this.moving.isActive = false;

            let aabb = this.getBoundingBox();

            console.log(aabb.LeftUp.x + " " + aabb.LeftUp.y);
            console.log(aabb.RightDown.x + " " + aabb.RightDown.y);

            this.x = aabb.LeftUp.x;
            this.y = aabb.LeftUp.y;
            this.width = aabb.RightDown.x - aabb.LeftUp.x;
            this.height = aabb.RightDown.y - aabb.LeftUp.y;
        },
        handleMouseMove(event){
            if(this.moving.isActive){
                this.context.lineTo(event.pageX, event.pageY);
                this.context.stroke();

                this.dots.push({ x: event.pageX, y: event.pageY });
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
                transformOrigin: "0px 0px",	
                transform: "scale(1, 1)",
                border: "1px outset " + this.color	
            }	
        }
    },
    props: ["top", "left"]
};

</script>

<style lang="sass">



</style>