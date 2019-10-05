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
            selectedInstrument: Instruments.DragableText
        }
    },
    created(){
        this.handleResize();
    },
    components: {
        DragableText,
        Drawing
    },
    methods: {
        handleResize(){
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        },
        handleMouseDown(event){
            if(this.resetFocus != null){
                this.resetFocus();
                this.resetFocus = null;
                return;
            }

            this.els = this.els + 1;
            const uid = "el" + this.els;

            this.objs.push({ type: this.selectedInstrument, x: event.pageX, y: event.pageY, id: uid });
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
                width: this.width + "px",
                height: this.height + "px"
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