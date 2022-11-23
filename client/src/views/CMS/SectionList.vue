<template>
  <v-container>
    
    <br>
    <v-card>
      <v-card-title class="d-flex justify-space-between px-5">
        Section List
        <v-btn to="/cms/section/create">Create New Section</v-btn>
      </v-card-title>
      <br>
      <v-card-text class="d-flex justify-space-between px-5 text-left" v-for="(section, index) in sections" v-bind:key="index">
        <v-card-subtitle v-text="section.title"></v-card-subtitle>
        <div>
          <v-btn outlined fab small :to="`/cms/section/${section._id}`"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn outlined fab small @click="deleteSection(section._id)"><v-icon>mdi-delete</v-icon></v-btn>
        </div>
      </v-card-text>
      <!-- <v-card-text class="text-left" v-for="(section, index) in sections" v-bind:key="index">
        <p class="text-left d-inline" v-text="section.title"></p>
        <p class="text-right d-inline">
          <v-btn outlined fab small :to="`/cms/section/${section._id}`"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn outlined fab small @click="deleteSection(section._id)"><v-icon>mdi-delete</v-icon></v-btn>
        </p>
      </v-card-text> -->
    </v-card>
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