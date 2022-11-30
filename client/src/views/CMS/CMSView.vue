<template>
  <div>
    <div v-if="!user">
      <v-main>
      <v-card max-width="500" class="container">
        <v-card-title>Login</v-card-title>
        <v-form v-model="form.valid" @submit.prevent="loginUser()" lazy-validation>
          <v-text-field
            v-model="form.username"
            label="Username"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.password"
            label="Password"
            :rules="form.passwordRules"
            required
          ></v-text-field>
          <v-btn type="submit">
            login
          </v-btn>
        </v-form>
      </v-card>
    </v-main>
  </div>
    <v-app v-else>
      <v-navigation-drawer app>
        <v-list-item-group>
          <v-list-item v-for="(menu,index) in menus" v-bind:key="index" :to="menu.ref">
                <v-list-item-icon>
                  <v-icon>{{ menu.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title v-text="menu.title"></v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list-item-group>
      </v-navigation-drawer>
      <v-main>
        <v-container>
            <router-view></router-view>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { store } from '../../store'
export default {
  data(){
    return {
      menus : [
        {
          title: 'Metadata',
          ref: {
            name: "metadata"
          },
          icon: 'mdi-database'
        },
        {
          title: 'Chapter',
          ref: {
            name: 'chapterList'
          },
          icon: 'mdi-book'
        },
        {
          title: 'Section',
          ref: {
            name: 'sectionList'
          },
          icon: 'mdi-file-document'
        },
        {
          title: 'Versioning',
          ref: {
            name: 'version'
          },
          icon: 'mdi-folder'
        }
      ],
      // user : store.getters.getAuthorization,
      user : false,
      form : {
        username : "",
        // usernameRules: [
        //   v => !!v || 'Username is required',
        //   v => /.+@.+\..+/.test(v) || 'Username must be valid'
        // ],
        password : "",
        passwordRules: [
          v => !!v || 'Password is required',
          v => v.length >= 4 || 'Min 4 characters'
        ],
        valid : true
      },
      accessToken: '',
    }
  },
  methods: {
        ...mapMutations(["setUser", "setToken"]),
        
        async loginUser() {
            // const token = store.getters.getTokens
            // console.log("Access Token: ", token);

            this.axios.post(`${this.$apiuri}/auth`, 
              { user: this.form.username, pwd: this.form.password }, 
              { headers: {
                  "Content-Type": "application/json"
                },
              },
              )
            .then(response => {
              // send flash message
              console.log("RESPONSE NYA: ", response.data)

              this.accessToken = response.data.accessToken
              console.log(`AccessToken: ` + this.accessToken);
              // this.setToken(this.accessToken);
              store.dispatch('setAccessTokens', this.accessToken)
              // this.trigger_alert(true, 'Login berhasil Berhasil')
              // this.$router.push("/")
              // store.dispatch('setUsersAuthorization', true)
            })
            .catch(error => {
              // send flash message
              this.trigger_alert(true, `Terjadi error ${error.message}`)
            })
            
            // const { accessToken } = await response.json();
            // console.log(refreshToken);

            window.setTimeout(() => {
              this.$router.push("/");
          }, 3000)    
        },

        trigger_alert(status, message) {
          this.alert.value = true
          this.alert.status = status
          this.alert.message = message
          // `event` is the native DOM event
          window.setTimeout(() => {
            this.alert.value = false;
          }, 3000)    
        },
    },
  created(){
    if(this.user){
      this.$router.push("/cms/metadata")
    }
  }
}
</script>

<style>
.container{
  margin: auto;
}
</style>