<template>
    <div
        id="dragabletext" 
        v-on:mousedown.stop="handleMouseDown" 
        v-on:mouseover="handleHover(true)" 
        v-on:mouseout="handleHover(false)" 
        v-bind:style="style"
        >
        {{ defaultText }}
    </div>
</template>

<script>

export default {
    name: "dragabletext",
    data() {
        return {
            defaultText: "default text",
            color: "transparent",
            isActive: false,
            moving: { isActive: false, x: 0, y: 0 },
            x: 0,
            y: 0,
            offsetX: 5,
            offsetY: 5
        }
    },
    created() {
        this.y = this.top - this.offsetX;
        this.x = this.left - this.offsetY;
    },
    methods: {
        handleHover(isHover){
            if(!this.isActive){
                this.color = isHover ? "#AAAAFF" : "transparent";
            }
        },
        handleMouseDown(event){
            this.moving.isActive = true;
            this.moving.x = event.offsetX;
            this.moving.y = event.offsetY;

            this.$emit("handleObjClick", { focus: this.callbackFocus, unfocus: this.callbackUnfocus });
            this.$emit("handleObjDrag", { move: this.handleMouseMove, up: this.handleMouseUp });
        },
        handleMouseUp(event){
            this.moving.isActive = false;
        },
        handleMouseMove(event){
            if(this.moving.isActive){
                this.y = event.pageY - this.moving.y;
                this.x = event.pageX - this.moving.x;
            }
        },
        callbackFocus(text){
            this.isActive = true;
            this.color = "#0000FF";
        },
        callbackUnfocus(text){
            this.isActive = false;
            this.color = "transparent";
        }
    },
    computed: {
        style(){
            return{
                top: this.y + "px",
                left: this.x + "px",
                border: "1px outset " + this.color
            }
        }
    },
    props: ["top", "left"]
};

</script>

<style lang="sass">

#dragabletext
    position: absolute
    padding: 5px
    border: none  
    font: 27pt serif
    box-sizing: border-box
    cursor: default

    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: -moz-none;
    -o-user-select: none;
    user-select: none;

#dragabletext
    cursor: pointer

</style>