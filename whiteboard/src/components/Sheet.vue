<template>
    <div 
        id="sheet" 
        v-on:mousedown="handleMouseDown" 
        v-on:mouseup="handleMouseUp"
        v-on:mousemove="handleMouseMove"
        v-bind:style="sheetStyle"
        >
        <canvas id="background" v-bind:width="maxWidth" v-bind:height="maxHeight"></canvas>
        <div id="menu">
            <img 
                v-bind:src="require('./../images/arrow.svg')" 
                v-bind:style="movingOn"
                v-on:mousedown.stop="" 
                v-on:mouseup.stop="" 
                v-on:mousemove.stop="" 
                v-on:click.stop="handleMenuClick('Moving')" />
            <img 
                v-bind:src="require('./../images/text.svg')" 
                v-bind:style="dragabletextOn"
                v-on:mousedown.stop="" 
                v-on:mouseup.stop="" 
                v-on:mousemove.stop="" 
                v-on:click.stop="handleMenuClick('DragableText')" 
                />
            <img 
                v-bind:src="require('./../images/draw.svg')" 
                v-bind:style="drawingOn"
                v-on:mousedown.stop="" 
                v-on:mouseup.stop="" 
                v-on:mousemove.stop="" 
                v-on:click.stop="handleMenuClick('Drawing')" />
        </div>
        <component 
            ref="objs"
            v-for="(obj, index) in sheet.objs" 
            v-bind:key="index" 
            v-bind:is="obj.type" 
            v-bind:id="obj.id"
            v-bind:top="obj.y" 
            v-bind:left="obj.x"
            v-bind:maxWidth="obj.maxWidth"
            v-bind:maxHeight="obj.maxHeight"
            v-on:handleObjClick="handleObjClick"
            v-on:handleObjDrag="handleObjDrag"
            v-on:handleUpdateFromClient="handleUpdateFromClient"
            >
        </component>
    </div>
</template>

<script>

import io from "socket.io-client";

import { Document, InstrumentType, Instrument, UpdateType } from "../../data/Domain.js"

import DragableText from "./DragableText.vue"
import Drawing from "./Drawing.vue"
import Moving from "./Moving.vue"

export default {
    data() {
        return {
            els: 0,
            width: 0,
            height: 0,
            resetFocus: null,
            dragging: null,
            selectedInstrument: InstrumentType.Moving,
            maxWidth: 3000,
            maxHeight: 3000,
            sheet: new Document(),
            socket: io()
        }
    },
    created() {
        const params = this.$route.params;
        const is_created = this.is_created;
        // if(is_created){
        //     this.socket.emit("create", { id: params.id });
        // }

        this.sheet.id = params.id;
        this.socket.on("update", this.handleBroadcastUpdate);
    },
    mounted(){
        this.handleResize();
        this.handleBackground();
    },
    components: {
        DragableText,
        Drawing,
        Moving
    },
    props: {
        is_created:{
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleBroadcastUpdate(sheet){
            if(this.sheet.id != sheet.id){
                return;
            }

            let data = sheet.objs[0];
            let foundIndex = this.sheet.objs.findIndex((obj) => obj.id == data.id);
            console.log("isAlreadyCreate = " + (foundIndex > -1));

            if(foundIndex > -1){
                this.$refs.objs[foundIndex].receiveUpdate(data);
                return;
            }

            this.addNewInsturment(data);
        },
        addNewInsturment(data){
            this.els = this.els + 1;
            this.sheet.objs.push({ 
                type: data.type, 
                x: data.deltas[0].xy.x, 
                y: data.deltas[0].xy.y, 
                id: data.id, 
                maxWidth: this.maxWidth, 
                maxHeight: this.maxHeight });
        },
        handleUpdateFromClient(data){
            let updateSheet = new Document();
            updateSheet.id = this.sheet.id;
            updateSheet.objs = [ data ];
            this.socket.emit("update", updateSheet);
        },
        handleResize(){
            const centerX = (this.maxWidth - window.innerWidth) / 2;
            const centerY = (this.maxHeight - window.innerHeight) / 2;
            window.scroll(centerX, centerY);
        },
        handleBackground(){
            let context = document.getElementById("background").getContext('2d');
            context.fillStyle = "#ffffff";
            context.strokeStyle = "#efefef";
            context.fillRect(0, 0, this.maxWidth, this.maxHeight);
            this.drawBackgroundLines(context, this.maxWidth, this.maxHeight, 20, 1, 0);
            this.drawBackgroundLines(context, this.maxHeight, this.maxWidth, 20, 0, 1);
        },
        drawBackgroundLines(context, size, length, step, isVertical, isHorizontal){
            for(let i = step; i < size; i += step){
                context.beginPath();
                context.moveTo(i * isVertical, i * isHorizontal);
                context.lineTo(i * isVertical + length * isHorizontal, i * isHorizontal + length * isVertical);
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

            let instruments = new Map ( [
             [ InstrumentType.Moving, Moving.methods ],
             [ InstrumentType.Drawing, Drawing.methods ],
             [ InstrumentType.DragableText, DragableText.methods ]
            ] );

            const uid = "el" + this.els;
            const xy = { x: event.pageX, y: event.pageY }; 
            let instrument = instruments.get(this.selectedInstrument).staticCreate(uid, xy, this.addNewInsturment);   

            if(instrument != null){
                this.handleUpdateFromClient(instrument);
            }
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
        sheetStyle(){
            return{
                width: this.maxWidth + "px",
                height: this.maxHeight + "px"
            }
        },
        dragabletextOn(){
            return {
                background: this.selectedInstrument == InstrumentType.DragableText ? "#ccc" : "#fff"
            }
        },
        drawingOn(){
            return {
                background: this.selectedInstrument == InstrumentType.Drawing ? "#ccc" : "#fff"
            }
        },
        movingOn(){
            return {
                background: this.selectedInstrument == InstrumentType.Moving ? "#ccc" : "#fff"
            }
        }
    }
};

</script>

<style lang="sass">

#sheet 
    background: #FAFAFA
    font-size: 18px
    font-family: "Roboto", sans-serif

#sheet canvas
    position: absolute

#menu
    position: fixed
    left: 0
    top: 10%
    margin: 5px
    z-index: 1000

    border-width: 1px
    border-style: solid
    border-color: #333333
    border-radius: 5px

    background: #FFFFFF

    img
        display: block
        width: 32px
        height: 32px
        margin: 5px
        padding: 10px
        border: none
        border-radius: 5px
        background: #fff

    img:hover
        background: #ccc

</style>