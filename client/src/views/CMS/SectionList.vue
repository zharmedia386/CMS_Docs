<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex justify-space-between px-5 light-blue lighten-4 font-weight-bold">
        Sections List
        <v-btn class="blue darken-4 white--text" to="/cms/section/create">Create New Section</v-btn>
      </v-card-title>
      <br>
      <v-card-text class="d-flex justify-space-between px-5 font-weight-medium black--text" v-for="(section, index) in sections" v-bind:key="index">
        <v-card-subtitle v-text="`${section.title} ${section.alias ? '- ' + section.alias : ''}`"></v-card-subtitle>
        <div>
          <v-btn class="light-blue lighten-4 mr-1" outlined fab small :to="`/cms/section/${section._id}`"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn class="red lighten-2" outlined fab small @click="deleteSection(section._id)"><v-icon>mdi-delete</v-icon></v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props : ['message', 'status'],
  data(){
    return {
      snackbar: { 
        isShow: false, 
        text: '', 
        type: '', 
        timeout: 2000 
      },
      sections: []
    }
  },
  methods :{
    deleteSection(id){
      let header = {
        'Authorization' : "Bearer " + localStorage.token
      }
      this.axios.delete(`${this.$apiuri}/sections`, { data : { id }, headers : header })
        .then(res => {
          console.log(res)
          this.$root.SnackBar.show({ message: res.data.message, color: 'success', icon: 'mdi-check-circle' })
          this.getSections()
        })
        .catch(err => {
          if(err.response.status == 401){
                localStorage.removeItem('token')
                this.$router.push({
                  name: "login",
                  params : {
                    message : "Invalid session",
                    status : true,
                    msgtype : 'error'
                  }
                })
              }
          this.$root.SnackBar.show({ message: err.message, color: 'error', icon: 'mdi-close-circle' })
        })
    },
    getSections(){
      this.axios.get(`${this.$apiuri}/sections`)
      .then(response => {
        this.sections = response.data
      })
    }
  },
  created(){
    if(this.status){
      this.$root.SnackBar.show({ message: this.message, color: 'success', icon: 'mdi-check-circle' })
    }
    this.getSections()
  }
}
</script>

<style>

</style>