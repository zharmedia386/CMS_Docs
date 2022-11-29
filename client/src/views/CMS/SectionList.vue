<template>
  <v-container>
    <v-alert
        :value="alert.value"
        :type="alert.status ? 'success' : 'error'"
        transition="slide-y-transition"
    >{{ alert.message }}</v-alert>
    <v-card>
      <v-card-title class="d-flex justify-space-between px-5 light-blue lighten-4 font-weight-bold">
        Section List
        <v-btn class="blue darken-4 white--text" to="/cms/section/create">Create New Section</v-btn>
      </v-card-title>
      <br>
      <v-card-text class="d-flex justify-space-between px-5 text-left" v-for="(section, index) in sections" v-bind:key="index">
        <v-card-subtitle v-text="section.title"></v-card-subtitle>
        <div>
          <v-btn class="light-blue lighten-4" outlined fab small :to="`/cms/section/${section._id}`"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn class="red lighten-2" outlined fab small @click="deleteSection(section._id)"><v-icon>mdi-delete</v-icon></v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data(){
    return {
      alert: {value: false, status: true, message: ''},
      sections: []
    }
  },
  methods :{
    deleteSection(id){
      console.log(id)
      this.axios.delete(`${this.$apiuri}/sections`, { data : {id} })
        .then(res => {
          console.log(res)
          this.trigger_alert(true, "Section berhasil di delete!")
          this.getSections()
        })
        .catch(err => {
          this.trigger_alert(false, err.message)
        })
    },
    getSections(){
      this.axios.get(`${this.$apiuri}/sections`)
      .then(response => {
        this.sections = response.data
      })
    },
    trigger_alert(status, message) {
      this.alert.value = true
      this.alert.status = status
      this.alert.message = message
      // `event` is the native DOM event
      window.setTimeout(() => {
        this.alert.value = false;
      }, 3000)    
    }
  },
  created(){
    this.getSections()
  }
}
</script>

<style>

</style>