<template>
  <div id="inspire">
    <v-container class="d-flex justify-center mt-9 mb-10">
      <v-container class="mb-2">
        <v-row class="d-flex justify-center">
          <v-col
            class="col-8 white d-flex justify-center align-center pa-8 card-resp"
            cols="12"
            sm="8"
          >
            <v-card-text rounded class="py-8 pl-8 mb-4 ftl">
              <h1 class="text-left display-1 font-weight-normal">
                Create Account
              </h1>

              <div class="text-center mt-2"></div>

              <v-form ref="form" v-model="form.valid" lazy-validation>
                <v-text-field
                  id="input-email"
                  class="mt-12"
                  v-model="form.email"
                  label="Email"
                  variant="tonal"
                  :rules="form.emailRules"
                  required
                ></v-text-field>
                <v-text-field
                  id="input-username"
                  v-model="form.username"
                  label="Username"
                  variant="tonal"
                  :rules="form.usernameRules"
                  required
                ></v-text-field>
                <v-text-field
                  id="input-password"
                  v-model="form.password"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  label="Password"
                  :rules="form.passwordRules"
                  @click:append="show1 = !show1"
                  required
                ></v-text-field>
                <v-btn
                  block
                  @click="register()"
                  class="ma-1 mt-15 gradient-btn"
                >
                  Create Account
                </v-btn>

                <!-- <v-row class="one">
                            <v-col class="second">
                              <v-sheet class="pa-2 ma-2">
                                <h5>Already have an account?</h5> 
                              </v-sheet>
                            </v-col>
                            <v-col class="third">
                              <v-sheet class="pa-2 ma-2">
                                <router-link to="/login" color="#FF00D6" class="text-decoration-none">
                                  <h5 class="font1">Log in</h5>
                                </router-link>
                              </v-sheet>
                            </v-col>
                          </v-row> -->
                <div class="mt-3">
                  <h5>
                    Already have an account?
                    <router-link to="/login" class="text-decoration-none">
                      <span class="font1">Log in</span>
                    </router-link>
                  </h5>
                </div>
              </v-form>
            </v-card-text>
          </v-col>
          <v-col
            class="d-none d-sm-flex col-2 d-flex justify-center align-center"
            cols="0"
            style="padding: 0"
          >
            <img
              src="@/assets/docms1.jpeg"
              class="d-none d-sm-flex"
              style="width: 100%; border-radius: 0 20px 20px 0"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-container>
    <v-footer
      class="pt-5 pr-8 mt-5 pb-3 card-resp"
      style="background-color: rgba(0, 0, 0, 0.25)"
    >
      <v-row>
        <v-col md="3" cols="6" style="color: #8b949e">
          <span class="mr-15 ml-1">@2023 DoCMS.</span>
          <!-- <span class="mr-9">Terms</span>
        <span>Privacy(Updated 8/2022)</span> -->
        </v-col>
        <v-col md="9" cols="6" class="text-right">
          <img src="@/assets/github.png" />
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  props: ["message", "status", "msgtype"],
  data() {
    return {
      show1: false,

      form: {
        email: "",
        emailRules: [
          (v) => !!v || "Email is required",
          (v) => v.length >= 4 || "Min 4 characters",
        ],
        username: "",
        usernameRules: [
          (v) => !!v || "Username is required",
          (v) => v.length >= 4 || "Min 4 characters",
        ],
        password: "",
        passwordRules: [
          (v) => !!v || "Password is required",
          (v) => v.length >= 8 || "Min 8 characters",
        ],
        valid: true,
      },
    };
  },
  methods: {
    login() {
      localStorage.removeItem("token");

      if (this.$refs.form.validate()) {
        this.axios
          .post(`${this.$apiuri}/auth`, {
            user: this.form.username,
            pwd: this.form.password,
          })
          .then((res) => {
            localStorage.setItem("token", res.data.accessToken);
            this.$router.push({ name: "cms" });
          })
          .catch((err) => {
            this.$root.SnackBar.show({
              message: err.message,
              color: "error",
              icon: "mdi-close-circle",
            });
          });
      }
    },
  },
  created() {
    if (this.status) {
      this.$root.SnackBar.show({
        message: this.message,
        color: this.msgtype,
        icon: "mdi-check-circle",
      });
    }
  },
};
</script>

<style lang="scss">
html {
  scroll-behavior: smooth;
}

#inspire {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: linear-gradient(
    115deg,
    #181c32,
    #181c32,
    #181c32,
    #00e0ff,
    #ff00da
  );
  overflow: hidden;
}

// .one{
//   padding-left: 74px;
//   padding-right: 200px;
// }
// .second{
//   padding: -100px;
//   margin-left: 110px;
// }
// .third{
//   margin-left: -50px;
//   padding-right: -200px;
// }

.gradient-btn {
  background: linear-gradient(90deg, #ff00d6 8.81%, #00e0ff 94.11%);
  color: white;
}

.gradient-btn:hover {
  background: linear-gradient(to right, #00e0ff, #ff00da);
  /* Sesuaikan dengan warna gradient yang diinginkan saat button dihover */
}

.font1 {
  color: #ff00d6;
}

.ftl {
  margin-bottom: 84px;
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
