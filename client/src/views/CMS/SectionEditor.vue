<template>
  <v-container>
    <div v-html="content"></div>
    <vue-editor v-model="content"></vue-editor>
    <v-btn @click="showData()">console</v-btn>
  </v-container>
</template>

<script>
import { VueEditor } from "vue2-editor";
export default {
  components: {
    VueEditor
  },
  data(){
    return {
      content : ""
    }
  },
  methods: {
    showData(){
      console.log(this.content)
    }
  }
}
</script>

<style>

</style>