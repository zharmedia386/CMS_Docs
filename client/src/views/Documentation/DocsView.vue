<template>
  <v-app>
    <!-- Header Starts Here -->
    <v-app-bar app>
        <img src="@/assets/logo.png" style="max-height: 50%">
        <v-toolbar-title>Documentation</v-toolbar-title>
        <v-btn 
            outlined
            class="search-box ml-auto"
        ><v-icon>mdi-magnify</v-icon>Search
        </v-btn>    
        <v-select 
            v-model="choosenVersion"
            :items="versions"
            outlined
            class="select-box ml-auto"
        ></v-select>
        
        <v-btn
            class="ml-auto"
        ><v-icon>mdi-github</v-icon></v-btn>
    </v-app-bar> 
    <!-- Header Stop Here -->
    <!-- Sidebar Starts Here -->
    <v-navigation-drawer app >
        <v-card v-for="(chapter,index) in chapters" v-bind:key="index">
            <v-card-title><v-icon>{{ chapter.icon }}</v-icon>{{ chapter.title }}</v-card-title>
            <v-list-item-group>
                    <v-list-item v-for="section in chapter.sections" v-bind:key="section" :to="{name : 'section', params: { section : section}}">
                        <v-list-item-content>
                            <v-list-item-title v-text="section" ></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
        </v-card>
    </v-navigation-drawer>
    <!-- Navbar Stop Here -->
    <v-main>
        <v-container>
            <router-view :key="$route.path"></router-view>
        </v-container>
    </v-main>
    <!-- Footer Starts Here -->
    <v-footer
      v-bind="localAttrs"
      :padless="padless"
    >
      <v-card
        elevation="6"
        width="100%"
        class="grey lighten-2 text-center text-dark"
      >
         <v-card-text>
          {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
        </v-card-text>
      </v-card>
    </v-footer>
    <!-- Footer Stops Here -->
  </v-app>
</template>

<script>
import router from '@/router';


export default {


    data(){
        return {
            chapters : [
                {
                    title : "Getting Started",
                    icon : "mdi-book-open-outline",
                    sections : [
                        "Lorem Ipsum",
                        "Lorem Ipsum",
                        "Lorem Ipsum"
                    ]
                },
                {
                    title : "Introduction",
                    icon : "mdi-book-open-outline",
                    sections : [
                        "Lorem Ipsum",
                        "Lorem Ipsum",
                        "Lorem Ipsum"
                    ]
                }, 
                {
                    title : "Components",
                    icon : "mdi-book-open-outline",
                    sections : [
                        "Lorem Ipsum",
                        "Lorem Ipsum",
                        "Lorem Ipsum"
                    ]
                }
            ],
            versions: [
                "1.0.0",
                "1.1.0",
                "2.0.0"
            ],
            choosenVersion: ''
        }
    },
    created(){
        this.choosenVersion = this.versions[0]
        router.push(`/docs/${this.chapters[0].sections[0]}`)
    }

}
</script>

<style>
    .select-box {
        max-width: 100px;
        max-height: 60px;
        display: flex;
    }
    .search-box {
        width: 400px;
        display: flex !important;

    }



</style>