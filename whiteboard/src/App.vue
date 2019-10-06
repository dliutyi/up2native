<template>
    <div 
        id="app" 
        v-on:mousedown="handleMouseDown" 
        v-on:mouseup="handleMouseUp"
        v-on:mousemove="handleMouseMove"
        v-bind:style="appStyle"
        >
        <canvas id="background" v-bind:width="maxWidth" v-bind:height="maxHeight"></canvas>
        <div id="menu">
            <img 
                v-bind:src="require('./images/text.svg')" 
                v-bind:style="dragabletextOn"
                v-on:mousedown.stop="" 
                v-on:mouseup.stop="" 
                v-on:mousemove.stop="" 
                v-on:click.stop="handleMenuClick('DragableText')" 
                />
            <img 
                v-bind:src="require('./images/draw.svg')" 
                v-bind:style="drawingOn"
                v-on:mousedown.stop="" 
                v-on:mouseup.stop="" 
                v-on:mousemove.stop="" 
                v-on:click.stop="handleMenuClick('Drawing')" />
        </div>
        <component 
            v-for="(obj, index) in objs" 
            v-bind:key="index" 
            v-bind:is="obj.type" 
            v-bind:id="obj.id"
            v-bind:top="obj.y" 
            v-bind:left="obj.x"
            v-bind:maxWidth="obj.maxWidth"
            v-bind:maxHeight="obj.maxHeight"
            v-on:handleObjClick="handleObjClick"
            v-on:handleObjDrag="handleObjDrag"
            >
        </component>
    </div>
</template>

<script>

import DragableText from "./components/DragableText.vue"
import Drawing from "./components/Drawing.vue"

class Instruments{
    static DragableText = "DragableText";
    static Drawing = "Drawing";
}

export default {
    data() {
        return {
            els: 0,
            width: 0,
            height: 0,
            objs: [],
            resetFocus: null,
            dragging: null,
            selectedInstrument: Instruments.DragableText,
            maxWidth: 3000,
            maxHeight: 3000
        }
    },
    mounted(){
        this.handleResize();
        this.handleBackground();
    },
    components: {
        DragableText,
        Drawing
    },
    methods: {
        handleResize(){
            const centerX = (this.maxWidth - window.innerWidth) / 2;
            const centerY = (this.maxHeight - window.innerHeight) / 2;
            window.scroll(centerX, centerY);
        },
        handleBackground(){
            let canvas = document.getElementById("background");
            let context = canvas.getContext('2d');
            context.clearRect(0, 0, this.maxWidth, this.maxHeight);
            context.fillStyle = "white";
            context.fillRect(0, 0, this.maxWidth, this.maxHeight);
            context.strokeStyle = "#efefef";
            let step = 20;
            for(let i = step; i < this.maxWidth; i += step){
                context.beginPath();
                context.moveTo(i, 0);
                context.lineTo(i, this.maxHeight);
                context.stroke();
            }
            for(let i = step; i < this.maxHeight; i += step){
                context.beginPath();
                context.moveTo(0, i);
                context.lineTo(this.maxWidth, i);
                context.stroke();
            }
        },
        handleMenuClick(item){
            this.selectedInstrument = item;
        },
        handleMouseDown(event){
            if(this.resetFocus != null){
                this.resetFocus();
                this.resetFocus = null;
                return;
            }

            this.els = this.els + 1;
            const uid = "el" + this.els;

            this.objs.push({ type: this.selectedInstrument, x: event.pageX, y: event.pageY, id: uid, maxWidth: this.maxWidth, maxHeight: this.maxHeight });
        },
        handleMouseMove(event){
            if(this.dragging != null){
                this.dragging.move(event);
            }
        },
        handleMouseUp(event){
            if(this.dragging != null){
                this.dragging.up(event);
            }
        },
        handleObjClick(value){
            if(this.resetFocus != null){
                this.resetFocus();
            }

            value.focus();
            this.resetFocus = value.unfocus;
        },
        handleObjDrag(value){
            this.dragging = value;
        }
    },
    computed: {
        appStyle(){
            return{
                width: this.maxWidth + "px",
                height: this.maxHeight + "px"
            }
        },
        dragabletextOn(){
            return {
                background: this.selectedInstrument == Instruments.DragableText ? "#aaa" : "#fff"
            }
        },
        drawingOn(){
            return {
                background: this.selectedInstrument == Instruments.Drawing ? "#aaa" : "#fff"
            }
        }
    }
};

</script>

<style lang="sass">

#app 
    background: #FAFAFA
    font-size: 18px
    font-family: "Roboto", sans-serif

#app canvas
    position: absolute

#menu
    position: fixed
    left: 0
    top: 30%
    z-index: 1000

#menu img
    display: block
    width: 32px
    height: 32px
    margin: 5px
    padding: 3px
    border: 1px solid black;

#menu img:hover
    background: #aaa

</style>