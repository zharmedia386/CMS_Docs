<template>
  <v-container>
    <v-card>
      <v-card-title>Section List</v-card-title>
      <v-card-text v-for="(section, index) in sections" v-bind:key="index">
        {{section}}
        <v-btn outlined fab small :to="`/cms/section/edit-${section}`"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn outlined fab small><v-icon>mdi-delete</v-icon></v-btn>
      </v-card-text>
    </v-card>
    <v-btn to="/cms/section/create">Create New Section</v-btn>
  </v-container>
</template>

<script>
export default {
  data(){
    return {
      sections: [
        "Introduction",
        "Layout",
        "Components"
      ]
    }
  },
  created(){
  }
}
</script>

<style>

</style>