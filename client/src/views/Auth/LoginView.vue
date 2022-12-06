<template>
  <v-app>
    <v-main>
      <v-card max-width="500" class="container">
        <v-card-title>Login</v-card-title>
        <v-form v-model="form.valid" lazy-validation>
          <v-text-field
            v-model="form.email"
            label="E-mail"
            :rules="form.emailRules"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.password"
            label="Password"
            :rules="form.passwordRules"
            required
          ></v-text-field>
          <v-btn>
            login
          </v-btn>
        </v-form>
      </v-card>
    </v-main>
  </v-app>
  
</template>

<script>
export default {
  data(){
    return {
      form : {
        email : "",
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
        ],
        password : "",
        passwordRules: [
          v => !!v || 'Password is required',
          v => v.length >= 8 || 'Min 8 characters'
        ],
        valid : true
      }
    }
  }
}
</script>

<style>

</style>