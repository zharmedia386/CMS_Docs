<template>
  <v-container>
    
    <br>
    <v-card>
      <v-card-title class="d-flex justify-space-between px-5">
        Chapter List
        <v-btn>Create New Chapter</v-btn>
      </v-card-title>
      <br>
      <v-card-text class="d-flex justify-space-between px-5" v-for="(chapter, index) in chapters" v-bind:key="index">
        <!-- <v-icon>{{chapter.icon}}</v-icon> {{chapter.title}} -->
        {{ chapter.title }}
        <div>
          <v-btn outlined fab small><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn outlined fab small><v-icon>mdi-delete</v-icon></v-btn>
        </div>
      </v-card-text>
    </v-card>
    
  </v-container>
</template>

<script>
export default {
  data(){
    return {
      chapters : []
    }
  },
  beforeCreate(){
    this.axios.get(`${this.$apiuri}/chapters`)
      .then(response => {
        this.chapters = response.data
      })

  }
}
</script>

<style>

</style>