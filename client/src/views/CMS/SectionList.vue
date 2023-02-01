<template>
  <v-container>
    <v-snackbar
      v-model="snackbar.isShow"
      :timeout="snackbar.timeout"
      :color="snackbar.type"
      elevation="8"
      top
      centered
    >
      <v-icon v-if="snackbar.type == 'success'">mdi-check-circle</v-icon>
      <v-icon v-if="snackbar.type == 'error'">mdi-close-circle</v-icon>
      {{ snackbar.text }}
    </v-snackbar>
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
  props : {
    message : {
      type: String
    },
    status : {
      type: Boolean,
      default: false
    }
  },
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
          this.trigger_notification(res.data.message, 'success')
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
          this.trigger_notification(err.message, 'error')
        })
    },
    getSections(){
      this.axios.get(`${this.$apiuri}/sections`)
      .then(response => {
        this.sections = response.data
      })
    },
    trigger_notification(text, type, timeout=2000){
      this.snackbar = { isShow:true, text, type, timeout }
    }
  },
  created(){
    if(this.status){
      this.trigger_notification(this.message, 'success')
    }
    this.getSections()
  }
}
</script>

<style>

</style>