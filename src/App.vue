<template>
    <div 
        id="app" 
        v-on:mousedown="handleMouseDown" 
        v-on:mouseup="handleMouseUp"
        v-on:mousemove="handleMouseMove"
        v-bind:style="appStyle"
        >
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
            selectedInstrument: Instruments.Drawing,
            maxWidth: 3000,
            maxHeight: 3000
        }
    },
    mounted(){
        this.handleResize();
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
        }
    }
};

</script>

<style lang="sass">

#app 
    background: #FAFAFA
    font-size: 18px
    font-family: "Roboto", sans-serif


</style>