<template>
    <div 
        id="app" 
        v-on:mousedown="handleClick" 
        v-bind:style="appStyle"
        >
        <component 
            v-for="(obj, index) in objs" 
            v-bind:key="index" 
            v-bind:is="obj.type" 
            v-bind:top="obj.y" 
            v-bind:left="obj.x"
            v-on:handleObjClick="handleObjClick"
            >
        </component>
    </div>
</template>

<script>

import DragableText from "./components/DragableText.vue"

export default {
    data() {
        return {
            width: 0,
            height: 0,
            objs: [],
            resetFocus: null 
        }
    },
    created(){
        this.handleResize();
    },
    components: {
        DragableText
    },
    methods: {
        handleResize(){
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        },
        handleClick(event){
            if(this.resetFocus != null){
                this.resetFocus();
                this.resetFocus = null;
                return;
            }

            this.objs.push({ type: "DragableText", x: event.pageX, y: event.pageY });
        },
        handleObjClick(value){
            if(this.resetFocus != null){
                this.resetFocus();
            }

            value.focus();
            this.resetFocus = value.unfocus;
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