<template>
    <div id="app" :style="appStyle">
        <canvas 
            v-on:mousedown="handleClick" 
            v-on:mousemove="handleHover"
            v-bind:width="width" 
            v-bind:height="height" 
            v-bind:style="canvasStyle" id="whiteboard"></canvas>
    </div>
</template>

<script>

import Text from "./objects/text.js"

export default {
    data() {
        return {
            width: 0,
            height: 0,
            context: CanvasRenderingContext2D,
            objs: []
        };
    },
    created() {
        window.addEventListener("resize", this.handleResize);
        this.handleResize();
    },
    mounted(){
        this.finalizeCanvas();
    },
    destroyed() {
        width.removeEventListener("resize", this.handleResize);
    },
    computed: {
        appStyle(){
            return{
                width: this.width + "px",
                height: this.height + "px",
                transformOrigin: "0px 0px",
                transform: "scale(1, 1)"
            }
        },
        canvasStyle(){
            return{
                position: "absolute",
                width: this.width + "px",
                height: this.height + "px",
                transformOrigin: "0px 0px",
                transform: "scale(1, 1)"
            }
        }
    },
    methods: {
        handleResize() {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        },
        handleClick: function(event){
            let shouldBeAdded = true;
            for(let obj of this.objs){
                let isBB = this.isBoundingBox(obj, event);
                if(isBB && obj.isActive){
                    shouldBeAdded = false;
                }
                if(isBB && shouldBeAdded == true){
                    obj.isActive = true;
                    shouldBeAdded = false;
                }
                else{
                    if(obj.isActive){
                        shouldBeAdded = false;
                    }
                    obj.isActive = false;
                }
            }
            
            if(shouldBeAdded){
                let textObj = new Text(this.context);
                textObj.move(event.pageX, event.pageY);
                this.objs.push(textObj);
            
                this.updateCanvas(textObj);
            }
            else{
                this.drawCanvas();
            }
        },
        handleHover: function(event){
            for(let obj of this.objs){
                let bb = obj.boundingBox;
                obj.isHovered = this.isBoundingBox(obj, event);
            }

            this.drawCanvas();
        },
        isBoundingBox: function(obj, event){
            let bb = obj.boundingBox;
            return event.pageX > bb.Left && event.pageY > bb.Top && event.pageX < bb.Right && event.pageY < bb.Bottom;
        },
        updateCanvas: function(obj){
            this.context.save();
            obj.draw();
            this.context.restore();
        },
        drawCanvas: function(){
            this.context.clearRect(0, 0, this.width, this.height);
            for(let obj of this.objs){
                obj.draw();
            }
        },
        finalizeCanvas: function(){
            let canvas = document.getElementById("whiteboard");

            this.context = canvas.getContext('2d');
            this.context.clearRect(0, 0, this.width, this.height);
        }
    }
};

</script>

<style lang="sass">

canvas
    background: #FAFAFA

#app 
    font-size: 18px
    font-family: "Roboto", sans-serif


</style>