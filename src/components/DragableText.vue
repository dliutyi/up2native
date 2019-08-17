<template>
    <div
        id="dragabletext" 
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
            defaultText: "default text"
        }
    },
    computed: {
        style(){
            return{
                top: this.top + "px",
                left: this.left + "px"
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
    border: 1px outset transparent
    box-sizing: border-box

#dragabletext:hover
    border: 1px outset #AAAAFF

</style>