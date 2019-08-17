<template>
    <div id="app">
        <dragabletext></dragabletext>
    </div>
</template>

<script>

import DragableText from "./components/DragableText.vue"

export default {
    data() {
        return {
            width: 0,
            height: 0
        }
    },
    components: {
        "dragabletext": DragableText
    }
};

</script>

<style lang="sass">

#app 
    font-size: 18px
    font-family: "Roboto", sans-serif


</style>