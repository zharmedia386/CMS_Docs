<template>
  <v-app>
    <v-main>
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
  name: 'LoginView',
  props : ['message', 'status', 'msgtype'],
  data(){
    return {
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
          this.$root.SnackBar.show({ message: err.message, color: 'error', icon: 'mdi-close-circle' })
        })
      }
    },
  },
  created(){
    if(this.status){
      this.$root.SnackBar.show({ message: this.message, color: this.msgtype, icon: 'mdi-check-circle' })
    }
  }
}
</script>

<style>

</style>