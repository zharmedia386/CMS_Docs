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
      content : "",
      title : ""
    }
  },
  methods: {
    showData(){
      console.log(this.content)
    }
  },
  beforeCreate(){
    if(this.$route.params.id != "create"){
      this.axios.get(`http://localhost:3500/sections/${this.$route.params.id}`)
        .then(response => {
          this.content = response.data[0].content
          this.title = response.data[0].title
        })
    }
  }
}
</script>

<style>

</style>