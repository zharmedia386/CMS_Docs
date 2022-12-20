<template>
  <v-app>
    <v-main>
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
      <v-card max-width="500" class="container">
        <v-card-title>Login</v-card-title>
        <v-form ref="form" v-model="form.valid" lazy-validation>
          <v-text-field
            v-model="form.username"
            label="E-mail"
            :rules="form.usernameRules"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.password"
            label="Password"
            :rules="form.passwordRules"
            required
          ></v-text-field>
          <v-btn @click="login()">
            login
          </v-btn>
        </v-form>
      </v-card>
    </v-main>
  </v-app>
  
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
    },
    msgtype : {
      type: String
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
      form : {
        username : "",
        usernameRules: [
          v => !!v || 'Username is required',
          v => v.length >= 4 || 'Min 4 characters'
        ],
        password : "",
        passwordRules: [
          v => !!v || 'Password is required',
          v => v.length >= 4 || 'Min 4 characters'
        ],
        valid : true
      }
    }
  },
  methods: {
    login(){
      localStorage.removeItem('token')
      
      if(this.$refs.form.validate()){
        this.axios.post(`${this.$apiuri}/auth`, {
          user : this.form.username,
          pwd : this.form.password
        })
        .then(res => {
          localStorage.setItem('token', res.data.accessToken)
          this.$router.push({name : 'cms'})
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
  created(){
    if(this.status){
      this.trigger_notification(this.message, this.msgtype)
    }
  }
}
</script>

<style>

</style>