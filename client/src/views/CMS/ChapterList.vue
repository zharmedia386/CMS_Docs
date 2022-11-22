<template>
  <v-container>
    <v-btn class="d-flex align-start flex-column">Create New Chapter</v-btn>
    <br>
    <v-card>
      <v-card-title>Chapter List</v-card-title>
      <v-card-text v-for="(chapter, index) in chapters" v-bind:key="index" class="d-flex justify-space-between auto" :color="$vuetify.theme.dark ? 'grey lighten-5' : 'white'" flat tile>
        <v-icon>{{chapter.icon}}</v-icon> {{chapter.title}}
        <v-btn outlined fab small><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn outlined fab small><v-icon>mdi-delete</v-icon></v-btn>
      </v-card-text>
    </v-card>
    
  </v-container>
</template>

<script>
export default {
  data(){
    return {
      chapters : [
        {
          title : "Getting Started",
          icon : "mdi-book-open-outline",
        },
        {
          title : "Introduction",
          icon : "mdi-book-open-outline",
        }, 
        {
          title : "Components",
          icon : "mdi-book-open-outline",
        }
      ]
    }
  },
  created(){
  }
}
</script>

<style>

</style>