<template>
  <v-container>
    <v-card>
      <v-card-title>Section Title</v-card-title>
      <v-text-field
        v-model="title"
      ></v-text-field>
    </v-card>
    <div class="my-8" v-html="content"></div>
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
      this.axios.get(`${this.$apiuri}/sections/${this.$route.params.id}`)
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