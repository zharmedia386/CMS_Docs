<template>
  <v-container>
    <v-card>
      <v-card-title>Section List</v-card-title>
      <div class="text-left" v-for="(section, index) in sections" v-bind:key="index">
        <v-card-subtitle class="d-inline" v-text="section.title"></v-card-subtitle>
        <v-card-text class="d-inline">
          <v-btn outlined fab small :to="`/cms/section/${section._id}`"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn outlined fab small @click="deleteSection(section._id)"><v-icon>mdi-delete</v-icon></v-btn>
        </v-card-text>
        
      </div>
      <!-- <v-card-text class="text-left" v-for="(section, index) in sections" v-bind:key="index">
        <p class="text-left d-inline" v-text="section.title"></p>
        <p class="text-right d-inline">
          <v-btn outlined fab small :to="`/cms/section/${section._id}`"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn outlined fab small @click="deleteSection(section._id)"><v-icon>mdi-delete</v-icon></v-btn>
        </p>
      </v-card-text> -->
    </v-card>
    <v-btn to="/cms/section/create">Create New Section</v-btn>
  </v-container>
</template>

<script>
export default {
  data(){
    return {
      sections: []
    }
  },
  methods :{
    deleteSection(id){
      console.log(id)
    }
  },
  beforeCreate(){
    this.axios.get(`${this.$apiuri}/sections`)
      .then(response => {
        this.sections = response.data
      })
  }
}
</script>

<style>

</style>