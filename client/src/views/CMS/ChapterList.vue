<template>
  <v-container>
    <v-card >
      <v-card-title>Chapter List</v-card-title>
      <v-card-text v-for="(chapter, index) in chapters" v-bind:key="index">
        <v-icon>{{chapter.icon}}</v-icon> {{chapter.title}}
        <v-btn outlined fab small><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn outlined fab small><v-icon>mdi-delete</v-icon></v-btn>
      </v-card-text>
    </v-card>
    <v-btn>Create New Chapter</v-btn>
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