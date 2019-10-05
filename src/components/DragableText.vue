<template>
    <div
        v-on:mousedown.stop="handleMouseDown" 
        v-on:mouseover="handleHover(true)" 
        v-on:mouseout="handleHover(false)" 
        v-on:dblclick="handleDblClick"
        v-bind:id="id" 
        v-bind:style="style"
        class="dragabletext"
        >
        <textarea wrap="off" ref="textareaText" v-on:mousedown.stop="{}" v-if="editable" v-model="text" v-bind:style="textareaStyle"></textarea>
        <div ref="divText" v-else>{{ text }}</div>
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
            textWidth: 0,
            textHeight: 0,
            offsetX: 5,
            offsetY: 5,
            editable: false
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
        handleDblClick(event){
            if(this.editable){
                return;
            }

            const el = this.$refs.divText;
            this.textWidth = el.clientWidth;
            this.textHeight = el.clientHeight;

            this.editable = true;
            this.$nextTick(() => this.$refs.textareaText.focus());      
        },
        callbackFocus(text){
            this.isActive = true;
            this.color = "#0000FF";
        },
        callbackUnfocus(text){
            this.isActive = false;
            this.color = "transparent";
            this.editable = false;
            this.defaultText = this.defaultText.trim();
        },
        adjustTextarea(){
            if(!this.editable){
                return;
            }

            const textareaEl = this.$refs.textareaText;
            textareaEl.style.width = 0;
            textareaEl.style.width = textareaEl.scrollWidth + "px";
            textareaEl.style.height = 0;
            textareaEl.style.height = textareaEl.scrollHeight + "px";
        }
    },
    computed: {
        text: {
            set: function(value){
                this.defaultText = value;
                this.adjustTextarea();
            },
            get: function(){
                return this.defaultText;
            }
        },
        textareaStyle(){
            return {
                width: this.textWidth + "px",
                height: this.textHeight + "px"
            }
        },
        style(){
            return {
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

.dragabletext
    position: absolute
    border: none  
    font: 27pt serif
    box-sizing: border-box
    cursor: default

    -webkit-user-select: none
    -khtml-user-select: none
    -moz-user-select: -moz-none
    -o-user-select: none
    user-select: none

.dragabletext div
    margin: 5px;
    overflow-wrap: nowrap
    white-space: pre

.dragabletext:hover
    cursor: pointer

.dragabletext textarea
    margin: 3px;
    font: 27pt serif
    border: none
    background: transparent
    resize: none
    overflow: hidden
    outline: none
    vertical-align: top


</style>