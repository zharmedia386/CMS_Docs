<template>
  <div>
    <div v-if="!user">
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
  </div>
    <v-app v-else>
      <v-app-bar app style="right: auto; box-shadow: none; padding: 0;">
        <v-btn @click="(drawer = !drawer)">
          <v-icon v-text="`${drawer ? 'mdi-chevron-left' : 'mdi-chevron-right'}`"></v-icon>
        </v-btn>
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        app
      >
        <v-list>
          <v-list-item v-for="(menu,index) in menus" v-bind:key="index" :to="menu.ref">
                <v-list-item-icon>
                  <v-icon v-text="menu.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title v-text="menu.title"></v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main class="py-0">
            <router-view></router-view>
      </v-main>
    </v-app>
  </div>
</template>

<script>
export default {
  data(){
    return {
      drawer: true,
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
          title: 'Manage Content',
          ref: {
            name: 'version'
          },
          icon: 'mdi-folder'
        }
      ],
      user : true,
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