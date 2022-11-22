<template>
  <v-container>
    <v-btn class="d-flex align-start flex-column" to="/cms/section/create">Create New Section</v-btn>
    <br>
    <v-card>
      <v-card-title>Section List</v-card-title>
      <v-card-text v-for="(section, index) in sections" v-bind:key="index">
        <v-card class="d-flex justify-space-between auto" :color="$vuetify.theme.dark ? 'grey lighten-5' : 'white'" flat tile>
          {{section}}
          <div>
            <v-btn outlined fab small :to="`/cms/section/edit-${section}`"><v-icon>mdi-pencil</v-icon></v-btn>
            <v-btn outlined fab small><v-icon>mdi-delete</v-icon></v-btn>
          </div>
        </v-card>
      </v-card-text>
    </v-card>
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