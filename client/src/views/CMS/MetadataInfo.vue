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
    <v-card class="mx-auto">
        <v-card-title class="d-flex justify-space-between px-5 light-blue lighten-4 font-weight-bold" >Metadata</v-card-title>
        <v-form
          ref="form" 
          style="padding: 16px;"
          lazy-validation
          @submit.prevent="updateMetadata()"
        >
          <v-text-field
            label="Title"
            v-model="metadata.title"
            :rules="rules.title"
            outlined
            required
          >
          </v-text-field>
          <v-row>
            <v-col cols="2">
              <v-file-input
                label="Logo"
                prepend-icon="mdi-camera"
                v-model="metadata.logo"
                :rules="rules.logo"
                @change="getBase64()"
                filled
                required
              ></v-file-input>
            </v-col>
            <v-col cols="1">
              <img :src="metadata.logo" style="max-width: 100%;" />
            </v-col>
            <v-col cols="9">

            </v-col>
          </v-row>
          
          <v-text-field
            label="Github Link"
            v-model="metadata.githubLink"
            :rules="rules.githubLink"
            outlined
            required
          >
          </v-text-field>
          <v-text-field
            label="Username"
            v-model="metadata.username"
            :rules="rules.username"
            outlined
            required
          >
          </v-text-field>
          <v-text-field
            label="New Password"
            v-model="metadata.password"
            :rules="rules.password"
            outlined
          >
          </v-text-field>
          <v-card-subtitle>Footer</v-card-subtitle>
          <vue-editor v-model="metadata.footer"></vue-editor>
          <v-btn type="submit" class="mt-1 blue darken-4 white--text" >Save</v-btn>
        </v-form>
         
    </v-card>
  </v-container>

</template>



<script>
import { VueEditor } from "vue2-editor";

export default {
  components: {
    VueEditor
  },
  methods: {
    getBase64(){
      const base64 = new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(this.metadata.logo);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      })
      base64
      .then(res => {
        this.metadata.logo = res
      })
      .catch(err => {
        console.log(err)
      })
    },
    updateMetadata(){
      if(this.$refs.form.validate()){
        this.axios.put(`${this.$apiuri}/documentations/metadata`, this.metadata)
          .then(res => {
            this.trigger_notification(res.data.message, 'success')
          })
          .catch(err => {
            this.trigger_notification(err.message, 'error')
          })
      }
    },
    trigger_notification(text, type, timeout=2000){
      this.snackbar = { isShow:true, text, type, timeout }
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
      metadata: {
        title : "",
        logo : null,
        footer : "",
        githubLink : "",
        username : "",
        password : ""
      },
      rules : {
        title : [
          v => !!v || "Title is required",
          v => (v && v.length >= 4) || "Title must be 4 characters at least"
        ],
        logo : [
          v => !!v || "Logo is required"
        ],
        githubLink : [
          v => !!v || "Github link is required"
        ],
        username : [
          v => !!v || "Username is required",
          v => (v && v.length >= 4) || "Username must be 4 characters at least"
        ],
        password : [
          v => ((v && v.length >= 4) || v.length == 0) || "Password must be 4 characters at least"
        ]
      }
    }
  },
  created(){
    this.axios.get(`${this.$apiuri}/documentations/metadata`)
    .then(res => {
      this.metadata = res.data
      this.metadata.password = ""
    })
  }
}
</script>

<style>

</style>