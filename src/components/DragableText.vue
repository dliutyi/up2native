<template>
    <div
        id="dragabletext" 
        v-on:mousedown.stop="handleClick" 
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
            isActive: false
        }
    },
    methods: {
        handleHover(isHover){
            if(!this.isActive){
                this.color = isHover ? "#AAAAFF" : "transparent";
            }
        },
        handleClick(event){
            this.$emit("handleObjClick", { focus: this.callbackFocus, unfocus: this.callbackUnfocus });
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
                top: this.top + "px",
                left: this.left + "px",
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

</style>