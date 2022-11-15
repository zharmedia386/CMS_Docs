<template>
  <v-app>
    <div v-if="!user">
      <v-card>
        
      </v-card>
    </div>
    <div v-else>
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
    </div>
  </v-app>
</template>

<script>
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
      user :true
    }
  }
}
</script>

<style>

</style>