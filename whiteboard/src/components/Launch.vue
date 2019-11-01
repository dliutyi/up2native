<template>
    <div id="launch">
        <div>
            <input type="text" maxlength="20" placeholder="Enter code" v-model="text" />
            <div class="links">
                <router-link :to="linkOpen">OPEN</router-link>
                <router-link :to="linkCreate">CREATE</router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            text: ""
        };
    },
    computed: {
        linkOpen: function(){
            return this.text;
        },
        linkCreate: function(){
            return "create/" + this.text;
        }
    }
}
</script>

<style lang="sass">

body
    background: #FAFAFA


#launch 
    position: fixed
    top: 30%

    div
        position: fixed
        width: 100%
        font-family: "Roboto", sans-serif

        input
            position: fixed
            left: calc(25% - 20px)
            width: 50%
            color: #3C3C3C
            font-size: 35px
            text-align: center
            padding: 10px 20px
            border-radius: 15px 15px 0px 0px
            border-width: 1px
            border-color: #6C6C6C
            border-style: solid
            outline: none
            height: 40px;

        input:hover
            border-color: #3C3C3C

        input:focus
            border-color: #3C3C3C

        .links
            position: fixed
            top: calc(30% + 60px)
            left: calc(25% - 20px)
            width: 50%
            color: #3C3C3C
            font-size: 35px
            padding: 10px 20px
            border-radius: 0px 0px 15px 15px
            border-width: 1px
            border-color: #6C6C6C
            border-style: solid
            outline: none
            background: #CACACA

        .links a
            float: left
            width: 50%
            color: #FAFAFA
            text-align: center
            text-decoration: none

        .links a:hover
            cursor: pointer
            color: #E0EEEE
</style>