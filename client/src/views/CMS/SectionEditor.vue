<template>
  <v-form @submit.prevent="saveData()">
    <v-container>
      <h1 style="color: var(--primary-purple); text-align: left; margin-bottom: 10px;">Section Editor</h1>
      <hr>
      <div style="color: white; width: 300px; margin-top: 40px;">
        <label for="select-section" style="text-align: left; display: block;">Load Section</label>
        <v-select
          id="select-section"
          class="section-editor-input"
            v-model="selectedSection"
            :items="sections"
            :item-text="section => `${section.title} ${section.alias ? '- ' + section.alias : ''}`"
            :item-value="section => section._id"
            placeholder="Select Section"
            @change="loadSection()"
            dark
          >
        </v-select>
      </div>
      <div style="color: white; width: 300px;">
        <label for="input-title" style="text-align: left; display: block;">Input Section Title <span style="color:red">*</span></label>
        <v-text-field
          id="input-title"
          class="section-editor-input"
          v-model="title"
          placeholder="Input Title"
          required
          dark
        ></v-text-field>
      </div>
      <div style="color: white; width: 300px;">
        <label for="input-alias" style="text-align: left; display: block;">Input Section Alias (Opsional)</label>
        <v-text-field
          id="input-alias"
          class="section-editor-input"
          v-model="alias"
          placeholder="Input Alias"
          dark
        ></v-text-field>
      </div>
    
      <div class="" style="background-color: white; padding: 10px;">
        <p style="margin-bottom: 0; text-align: left; font-weight: bold;"><v-icon class="mr-2">mdi-eye</v-icon>Section Preview</p>
      </div>
      <div class="mb-8 ql-editor" style="background-color: #37404D; color: white; border: 1px solid white;" v-html="content"></div>
      <vue-editor v-model="content"></vue-editor>
      <div class="d-flex justify-end mt-4">
        <v-btn class="mt-1 blue darken-4 white--text" type="submit" v-text="this.create ? 'Create' : 'Save' "></v-btn>
      </div>
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
.quillWrapper {
  background-color: #37404D;
  color: white;
}

.quillWrapper .ql-toolbar {
  background-color: white;
}

.quillWrapper .ql-toolbar > svg {
  border: 1px solid red !important;
}

.section-editor-input .v-select__slot {
  background-color: #37404D !important;
  padding: 5px 10px;
}
.section-editor-input .v-text-field__slot {
  background-color: #37404D !important;
  padding: 5px 10px;
}
</style>