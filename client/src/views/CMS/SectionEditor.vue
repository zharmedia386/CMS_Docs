<template>
  <v-form @submit.prevent="saveData()">
    <v-container>
      <v-alert
        :value="alert.value"
        :type="alert.status ? 'success' : 'error'"
        transition="slide-y-transition"
      >{{ alert.message }}</v-alert>
      <v-card>
        <v-card-title>Section Title</v-card-title>
        <v-text-field
          v-model="title"
          placeholder="Input Title"
          class="pl-5 pr-5"
        ></v-text-field>
      </v-card>
      <div class="my-8" v-html="content"></div>
      <vue-editor v-model="content"></vue-editor>
      <v-btn type="submit" v-text="this.create ? 'Create' : 'Save' "></v-btn>
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
      alert: {value: false, status: true, message: ''},
      content : "",
      title : "",
      create: true
    }
  },
  methods: {
    saveData(){
      const section = {
        title: this.title,
        content: this.content
      }

      if(this.title == "" || this.content == ""){
        this.trigger_alert(false, 'Harap isi semua field')
      }
      else{
        console.log(JSON.stringify(section))
        if(this.$route.params.id == "create"){
          this.axios.post(`${this.$apiuri}/sections`, section)
            .then(response => {
              // send flash message
              console.log(response.data)
              this.trigger_alert(true, 'Section berhasil dibuat')
            })
            .catch(error => {
              // send flash message
              this.trigger_alert(false, `Terjadi error ${error.message}`)
            })
        }
        else{
          section.id = this.$route.params.id
          this.axios.put(`${this.$apiuri}/sections`, section)
          .then(response => {
              // send flash message
              console.log(response.data)
              this.trigger_alert(true, 'Section berhasil diupdate')
            })
            .catch(error => {
              // send flash message
              this.trigger_alert(false, `Terjadi error ${error.message}`)
            })
        }
        
      }      
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
  beforeCreate(){
    if(this.$route.params.id != "create"){
      this.axios.get(`${this.$apiuri}/sections/${this.$route.params.id}`)
        .then(response => {
          this.content = response.data[0].content
          this.title = response.data[0].title
          this.create = false
        })
    }
  }
}
</script>

<style>

</style>