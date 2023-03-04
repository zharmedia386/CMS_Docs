<template>
  <div>
  <v-container>
    <h1 class="text-containerh1 mb-3">Metadata Settings</h1>
    <v-divider
    :thickness="4"
    class="border-opacity-100"
    color="white"
    ></v-divider>
    <div style="relative">
    <v-row>
      <v-col cols="4" class="mt-15 ml-8 text-container">
        <v-list-subheader>Logo Picture</v-list-subheader>
      </v-col>

      <v-col cols="1" class="mt-8">
        <!-- <v-file-input
                label="Logo"
                rounded="circle"
                
                prepend-icon="mdi-camera "
                v-model="metadata.logo"
                :rules="rules.logo"
                @change="getBase64()"
                filled
                required
        ></v-file-input> -->
        <!-- <v-file-input
          v-model="image"
          accept="image/*"
          @change="getBase64()"
          prepend-icon="mdi-camera"
        >
            <div class="circle">
              <img :src="metadata.logo" class="preview-image" />
            </div>
            <div class="circle placeholder">{{ text }}</div>

        </v-file-input> -->
        <div>
          <label for="input-file">
            <div class="circle">
              <img :src="metadata.logo"  />
              <div class="placeholder">Choose an image</div>
            </div>
          </label>
          <!-- <input id="input-file" type="file" accept="image/*" @change="getBase64()" /> -->
          <v-file-input
            id="input-file"
            accept="image/*"
            prepend-icon="mdi-camera"
            class="camera-input"
            @change="getBase64()"
          />
        </div>

        </v-col>
            <!-- <v-col cols="1" style="max-width: 100%; border-radius: 0 20px 0 20px;">
              <img :src="metadata.logo" style="max-width: 100%;" />
            </v-col> -->
        
    </v-row>
    </div>
    <v-row>
      
    <v-col cols="4" class="mt-4 ml-8 text-container">
      <v-list-subheader>Title</v-list-subheader>
    </v-col>

    <v-col cols="7" class="mt-1" >
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
      <v-col cols="4" class="mt-4 ml-8 text-container">
        <v-list-subheader>Github Link</v-list-subheader>
      </v-col>

      <v-col cols="7" class="mt-1">
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
      class="mt-4 ml-8 text-container">
        <v-list-subheader dark
        solo-inverted
        >Footer
        </v-list-subheader>
      </v-col> 

      <v-col cols="7" class="mb-12" solo-inverted>
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
      <v-btn type="submit" class="mt-3 mr-6 colorbtn" >Save Changes</v-btn>
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
    // handleImageUpload(event) {
    //   const file = event.target.files[0];
    //   const reader = new FileReader();
    //   reader.readAsDataURL(file);
    //   reader.onload = () => {
    //     this.image = reader.result;
    //   };
    // },
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
        password : "",
        image :null
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
.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  background-color:white;
}

.circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #ccc;
  background-color: #f5f5f5;
}
#input-file {
  position: absolute;
  left: -99999px;
}

label[for="input-file"] {
  cursor: pointer;
}
/* .my-icon-class {
  margin-bottom: 50px;
  margin-right: 50px;
} */
.camera-input .v-icon.mdi.mdi-camera {
    margin-bottom: 60px;
    margin-left: 155px;
    background-color: #FF00D6;
    border-radius: 50px;
    padding: 8px;
}
.vue-editor--wrapper {
  background-color: white !important;
}

.vue-editor--wrapper:focus {
  background-color: white;
}
/* .v-icon.mdi-camera:not(.v-icon--disabled)::before {
  border: none;
} */

/* .v-icon.mdi-camera{
  margin-top: 50px;
  color: #2c3e50; */
  /* background-color: var(--primary-dark); */
/* } */
/* .theme--light.v-file-input .v-icon.mdi-camera:before {
  box-shadow: none;
} */
/* .theme--light.v-btn.v-btn--has-bg{
  background-color:#939AFF;
} */
</style>