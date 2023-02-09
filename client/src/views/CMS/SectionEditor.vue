<template>
  <v-form @submit.prevent="saveData()">
    <v-container>
      <v-card v-if="create">
        <v-card-title>
          Load Section
          <v-spacer></v-spacer>
          <v-select
          v-model="selectedSection"
          :items="sections"
          :item-text="section => `${section.title} ${section.alias ? '- ' + section.alias : ''}`"
          :item-value="section => section._id"
          label="Select Section"
          @change="loadSection()"
        >
        </v-select>
        </v-card-title>
        
      </v-card>
      <v-card>
        <v-card-title>Section Title</v-card-title>
        <v-text-field
          v-model="title"
          placeholder="Input Title"
          class="pl-5 pr-5"
          required
        ></v-text-field>
      </v-card>
      <v-card>
        <v-card-title>Section Alias (Optional)</v-card-title>
        <v-text-field
          v-model="alias"
          placeholder="Input Alias"
          class="pl-5 pr-5"
        ></v-text-field>
      </v-card>
      <div class="my-8 ql-editor" v-html="content"></div>
      <vue-editor v-model="content"></vue-editor>
      <v-btn class="mt-1 blue darken-4 white--text" type="submit" v-text="this.create ? 'Create' : 'Save' "></v-btn>
    </v-container>
  </v-form>
</template>

<script>
import { VueEditor } from "vue2-editor";
export default {
  components: {
    VueEditor
  },
  data(){
    return {
      snackbar: { 
        isShow: false, 
        text: '', 
        type: '', 
        timeout: 2000 
      },
      content : "",
      alias : "",
      title : "",
      create: true,
      sections : [],
      selectedSection : ""
    }
  },
  methods: {
    saveData(){
      let section = {
        title: this.title,
        content: this.content
      }

      let header = {
        headers: {
          'Authorization' : "Bearer " + localStorage.token
        }
      }

      if(this.alias.length != 0) section.alias = this.alias;

      if(this.title == "" || this.content == ""){
        this.$root.SnackBar.show({ message: "Error : Please Input Title and Content", color: 'error', icon: 'mdi-close-circle' })
      }
      else{
        console.log(JSON.stringify(section))
        if(this.$route.params.id == "create"){
          this.axios.post(`${this.$apiuri}/sections`, section, header)
            .then(response => {
              // send flash message
              console.log(response.data)
              this.$router.push({name: "sectionList", params: {message: "Section created!", status: true}})
            })
            .catch(error => {
              // send flash message
              if(error.response.status == 401){
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
              this.$root.SnackBar.show({ message: `Error : ${error.message}`, color: 'error', icon: 'mdi-close-circle' })
            })
        }
        else{
          section.id = this.$route.params.id
          this.axios.put(`${this.$apiuri}/sections`, section, header)
          .then(response => {
              // send flash message
              console.log(response.data)
              this.$router.push({name: "sectionList", params: {message: "Section updated!", status: true}})
            })
            .catch(error => {
              // send flash message
              if(error.response.status == 401){
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
              this.$root.SnackBar.show({ message: `Error : ${error.message}`, color: 'error', icon: 'mdi-close-circle' })
            })
        }
        
      }      
    },
    loadSection(){
      console.log(this.selectedSection)
      this.axios.get(`${this.$apiuri}/sections/${this.selectedSection}`)
        .then(response => {
          this.title = response.data[0].title
          this.content = response.data[0].content
          if(response.data[0].alias){
            this.alias = response.data[0].alias
          }
        })
        .catch(error => {
          console.log(error)
          this.selectedSection = ""
          this.title = ""
          this.alias = ""
          this.content = ""
        })
    }
  },
  beforeCreate(){
    if(this.$route.params.id != "create"){
      this.axios.get(`${this.$apiuri}/sections/${this.$route.params.id}`)
        .then(response => {
          this.content = response.data[0].content
          this.title = response.data[0].title
          if(response.data[0].alias) this.alias = response.data[0].alias;
          this.create = false
        })
    }
    else{
      this.axios.get(`${this.$apiuri}/sections`)
        .then(response => {
          this.sections = response.data
        })
    }
  }
}
</script>

<style>

</style>