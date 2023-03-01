<template>
  <div>
  <v-container>
    <h1 class="text-containerh1 mb-3">Metadata Settings</h1>
    <v-divider
    :thickness="4"
    class="border-opacity-100"
    color="white"
    ></v-divider>
    <v-row>
      <v-col cols="4" class="mt-6 text-container">
        <v-list-subheader>Logo Picture</v-list-subheader>
      </v-col>

      <v-col cols="1" class="mt-3">
        <v-file-input
                label="Logo"
                rounded="circle"
                
                prepend-icon="mdi-camera "
                v-model="metadata.logo"
                :rules="rules.logo"
                @change="getBase64()"
                filled
                required
        ></v-file-input>
        </v-col>
            <v-col cols="1" style="max-width: 100%; border-radius: 0 20px 0 20px;">
              <img :src="metadata.logo" style="max-width: 100%;" />
            </v-col>
    </v-row>

    <v-row>
      <v-col cols="4" class="mt-4 text-container">
        <v-list-subheader>Title</v-list-subheader>
      </v-col>

    <v-col variant="tonal" cols="8" >
        <v-text-field dark
          v-model="metadata.title"
          :rules="rules.title"
          outlined
          required
          solo-inverted
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4" class="mt-4 text-container">
        <v-list-subheader>Github Link</v-list-subheader>
      </v-col>

      <v-col cols="8">
        <v-text-field dark
          
          v-model="metadata.githubLink"
          :rules="rules.githubLink"
          outlined
          required
          solo-inverted
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col dark 
      cols="4" 
      class="mt-4 text-container"
      
      >
        <v-list-subheader dark
        solo-inverted
        >Footer
        </v-list-subheader>
      </v-col> 

      <v-col cols="8" solo-inverted>
          <vue-editor  v-model="metadata.footer"></vue-editor>
          
      </v-col>
    </v-row>

    <v-divider 
    :thickness="4"
    class="border-opacity-100 mt-8"
    color="white"
    ></v-divider> 

    <div class="d-flex justify-end">
      <v-btn class="mt-3 mr-3 colorbtn1" variant="flat">Discard</v-btn>
      <v-btn type="submit" class="mt-3 colorbtn" >Save Changes</v-btn>
    </div>
     
  </v-container>
</div>
<!-- <v-card>
  <v-container>
    <hr>
    <v-radio-group
      v-model="inline"
      inline
    >
    </v-radio-group>
  </v-container>
  <v-divider
  :thickness="4"
  class="border-opacity-100"
  color="white"
  inset
  ></v-divider>

  <v-divider
    :thickness="4"
    class="border-opacity-100"
    color="white"
    
  ></v-divider>
</v-card> -->

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
      let header = {
        headers: {
          'Authorization' : "Bearer " + localStorage.token
        }
      }
      if(this.$refs.form.validate()){
        this.axios.put(`${this.$apiuri}/documentations/metadata`, this.metadata, header)
          .then(res => {
            this.$root.SnackBar.show({ message: res.data.message, color: 'success', icon: 'mdi-check-circle' })
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
      }
    }
  },
  data(){
    return {
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
.text-container {
  text-align: left;
  color: #FFFFFF;
}
.text-containerh1 {
  text-align: left;
  color: #939AFF;
}
.bgc{
  color:#8B949E !important;
  background-color: #8B949E dark !important;
}

.colorbtn{
  background-color:#939AFF !important;
  color:black;
  
}
.colorbtn1{
  background-color:var(--primary-dark) !important;
  color:white !important;

}
/* .theme--light.v-btn.v-btn--has-bg{
  background-color:#939AFF;
} */
</style>