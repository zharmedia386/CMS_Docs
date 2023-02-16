<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="5" md="5" >
            
            <v-card round class="elevation-8 rounded-xl" >
              <v-window v-model="step">
                <v-window-item :value="1">
                  <v-row>
                    
                    <v-col cols="12" md="8">
                      <v-card-text rounded class="mt-12 pa-20 py-8 pl-8" >
                        <h1
                          class="text-left display-1 font-weight-normal"
                        >Sign in</h1>

                        <div class="text-center mt-2 ">
                          
                        </div>
                       
                        <v-form ref="form" v-model="form.valid" lazy-validation>
                          
                          <v-text-field
                            v-model="form.username"
                            label="Email"
                            variant="tonal"
                            :rules="form.usernameRules"
                            required
                          ></v-text-field>
                          <v-text-field
                            v-model="form.password"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show1 ? 'text' : 'password'"
                            label="Password"
                            :rules="form.passwordRules"
                            required
                          ></v-text-field>
                          <v-btn block @click="login()"
                          class="ma-1"
                          color="#FF00D6" dark>
                            Sign in
                          </v-btn>

                          <h5>Don't have an account?Create Account</h5>

                        </v-form>
                        
                      </v-card-text>
                      
                    </v-col>
                    <v-col cols="12" md="4" class="black" >
                    <img src="@/assets/docms1.jpeg"  width="200" height="400">
                    </v-col>



                  </v-row>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
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
  },
  
}
</script>

<style lang="scss">
html{scroll-behavior:smooth}

#inspire {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #16192d;
}



</style>