<template>
    <div
        v-on:mousedown.stop="handleMouseDown" 
        v-on:mouseover="handleHover(true)" 
        v-on:mouseout="handleHover(false)" 
        v-on:dblclick="handleDblClick"
        v-bind:id="id" 
        v-bind:style="style"
        class="moving"
        >
    </div>
</template>

<script>

import { InstrumentType, Instrument, UpdateType } from "../../data/Domain.js"

export default {
    name: "moving",
    data() {
        return {
        }
    },
    created() {
    },
    methods: {
    },
    computed: {
    },
    props: []
};

</script>

<style lang="sass">

</style>