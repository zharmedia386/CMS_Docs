<template>
    <v-app>
      <v-app-bar app style="right: auto; box-shadow: none; padding: 0; background-color: transparent;">
        <v-btn @click="(drawer = !drawer)">
          <v-icon v-text="`${drawer ? 'mdi-chevron-left' : 'mdi-chevron-right'}`"></v-icon>
        </v-btn>
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        app
      >
        <v-list class="d-flex flex-column">
          <v-list-item v-for="(menu,index) in menus" v-bind:key="index" :to="menu.ref">
              <v-list-item-icon>
                <v-icon v-text="menu.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                  <v-list-item-title style="white-space: break-spaces;" v-text="menu.title"></v-list-item-title>
              </v-list-item-content>
          </v-list-item>
          <v-list-item @click="logout()">
            <v-list-item-icon>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                  <v-list-item-title style="white-space: break-spaces;"><strong>Logout</strong></v-list-item-title>
              </v-list-item-content>
          </v-list-item>
        </v-list>
        <!-- <v-btn color="error" @click="logout()">
          <v-icon>mdi-logout</v-icon>LOGOUT
        </v-btn> -->
      </v-navigation-drawer>
      <v-main class="py-0">
            <router-view></router-view>
      </v-main>
    </v-app>
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
      user : true
    }
  },
  created(){
    this.axios.get(`${this.$apiuri}/documentations/metadata`)
      .then(res => {
        document.title = "CMS - " + res.data.title
      })
    this.$router.push("/cms/metadata")
  },
  methods: {
    logout(){
      if(localStorage.token){
        localStorage.removeItem('token')
        this.$router.push({name: "login", params: {message: "Logout success!", status: true, msgtype: 'success'}})
      }
    }
  }
}
</script>

<style>
.container{
  margin: auto;
}
</style>