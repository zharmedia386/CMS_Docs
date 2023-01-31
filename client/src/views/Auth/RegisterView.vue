<template>
   <v-main>
      <v-card max-width="500" class="container">
        <v-card-title>Register</v-card-title>
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
          <v-btn type="submit" class="mt-1 blue darken-4 white--text" >register</v-btn>
        </v-form>
      </v-card>
    </v-main>
</template>

<script>
export default {
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
   methods : {
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
    }
   },
   register(){

   }
};
</script>

<style></style>