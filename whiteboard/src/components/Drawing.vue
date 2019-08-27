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
        handleMouseDown(event){
            this.moving.isActive = true;
            this.$emit("handleObjClick", { focus: this.callbackFocus, unfocus: this.callbackUnfocus });
        },
        handleMouseUp(event){
            this.moving.isActive = false;
        },
        handleMouseMove(event){
            if(this.moving.isActive){
                console.log("drawing moving");

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
        }
    },
    computed: {
        style(){	
            return{	
                position: "absolute",	
                width: this.width + "px",	
                height: this.height + "px",	
                transformOrigin: "0px 0px",	
                transform: "scale(1, 1)"	
            }	
        }
    },
    props: ["top", "left"]
};

</script>

<style lang="sass">



</style>