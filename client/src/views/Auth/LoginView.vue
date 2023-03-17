<template>
  <div id="inspire">
    <v-container class="d-flex justify-center mt-9 mb-10">
      <v-container class="mb-2">
        <v-row class="d-flex justify-center ">
          <v-col class="col-8 white d-flex justify-center align-center pa-8 card-resp" cols="12" sm="8">
            <v-card-text rounded class=" py-10 pl-8 ftl">
              <h1 class="text-left display-1 font-weight-normal">Sign in</h1>
              <div class="text-center mt-2 ">
              </div>
              <v-form ref="form" v-model="form.valid" lazy-validation>
                <v-text-field class="mt-12" v-model="form.username" label="Username" variant="tonal"
                  :rules="form.usernameRules" required></v-text-field>
                <v-text-field v-model="form.password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'" label="Password" :rules="form.passwordRules"
                  @click:append="show1 = !show1" required></v-text-field>
                <v-btn block @click="login()" class="ma-1 mt-15 gradient-btn">
                  Sign in
                </v-btn>
                <div class="mt-3">
                  <h5>Don't have an account?
                    <router-link to="/register" class="text-decoration-none">
                      <span class="font1">Create Account</span>
                    </router-link>
                  </h5>
                </div>
              </v-form>
            </v-card-text>
          </v-col>
          <v-col class="d-none d-sm-flex col-2 d-flex justify-center align-center" cols="0" style="padding: 0;">
            <img src="@/assets/docms1.jpeg" class="d-none d-sm-flex" style="width: 100% ; border-radius: 0 20px 20px 0">
          </v-col>
        </v-row>
      </v-container>
    </v-container>
    <v-footer class="pt-5 pr-8 mt-5 pb-3" style="background-color: rgba(0, 0, 0, 0.25)">
      <v-row>
        <v-col md="3" cols="6" style="color: #8B949E">
          <span class="mr-15 ml-1">@2023 DoCMS.</span>
        </v-col>
        <v-col md="9" cols="6" class="text-right">
          <img src="@/assets/github.png">
        </v-col>
      </v-row>

    </v-footer>
  </div>
</template>

<script>
import AuthService from '@/services/AuthService'

export default {
  name: 'LoginView',
  props: ['message', 'status', 'msgtype'],
  data() {
    return {
      show1: false,

      form: {
        username: "",
        usernameRules: [
          v => !!v || 'Username is required',
          v => v.length >= 4 || 'Min 4 characters'
        ],
        password: "",
        passwordRules: [
          v => !!v || 'Password is required',
          v => v.length >= 8 || 'Min 8 characters'
        ],
        valid: true
      }
    }
  },
  methods: {
    async login() {
      // Check if submission valid
      if (!this.$refs.form.validate()) {
        return;
      }

      const user = {
        username: this.form.username,
        password: this.form.password
      }

      try {
        await AuthService.login(user);
        this.$router.push({ name: 'cms' })
      } catch (error) {
        this.$root.SnackBar.show({ message: error.message, color: 'error', icon: 'mdi-close-circle' })
      }
    },
  },
  created() {
    if (this.status) {
      this.$root.SnackBar.show({ message: this.message, color: this.msgtype, icon: 'mdi-check-circle' })
    }
  },
}
</script>

<style lang="scss">
html {
  scroll-behavior: smooth
}

#inspire {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: linear-gradient(115deg, #181C32, #181C32, #181C32, #00E0FF, #FF00DA);
  overflow: hidden;
}

.gradient-btn {
  background: linear-gradient(90deg, #FF00D6 8.81%, #00E0FF 94.11%);
  color: white !important;
}

.gradient-btn:hover {
  background: linear-gradient(to right, #00E0FF, #FF00DA);
  /* Sesuaikan dengan warna gradient yang diinginkan saat button dihover */
}

.font1 {
  color: #FF00D6;
}

.card-resp {
  border-radius: 20px 0 0 20px;
}

@media only screen and (max-width: 600px) {
  .card-resp {
    border-radius: 20px;
  }
}
</style>