<template>
  <v-app>
    <!-- Header Starts Here -->
    <v-app-bar app style>
        <img src="@/assets/logo.png" style="max-height: 50%">
        <v-toolbar-title class="">Documentation</v-toolbar-title>
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
    <v-navigation-drawer app class="fontstyle">
        <v-card v-for="(chapter,i) in chapters" :key="i">
            <v-card-title>{{ chapter.title }}</v-card-title>
            <v-list-item-group>
                <v-list-item v-for="(section,j) in chapter.section" :key="j" :to="{name : 'section', params: { id : section._id}}">
                    <v-list-item-content>
                        <v-list-item-title v-text="section.title" ></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-card>
    </v-navigation-drawer>
    <!-- Sidebar Stop Here -->
    <v-main style="padding-top: 16px">
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
import router from '@/router' 
// import http from "../../http-common";
import { store } from '../../store'

export default {
    data(){
        return {
            chapters : [],
            versions: [],
            arr : [],
            choosenVersion: ''
        }
    },
    methods : {
        getVersion(){
            const token = store.getters.getTokens
            this.axios.get(`${this.$apiuri}/documentations/${this.choosenVersion}`,
            {
                headers: {
                    "Authorization": 'Bearer ' + token,
                    "x-access-token": token ,
                    "Content-type": "application/json"
                },
            }
            ).then(response => {
                this.chapters = response.data[0].content[0].chapter
                router.push(`/docs/${this.chapters[0].section[0]._id}`)
            }).catch(message => {
                console.log(message)
            })
        }
    },
    created(){
        const token = store.getters.getTokens
        // let temp = JSON.parse(JSON.stringify(this.versions))
        this.axios.get(`${this.$apiuri}/documentations/version`,
            {
                headers: {
                    "Authorization": 'Bearer ' + token,
                    "x-access-token": token ,
                    "Content-type": "application/json"
                },
            }
        )
            .then((response) => {
                response.data[0].content.forEach(v => {
                    this.versions.push(v.version)
                });
                this.choosenVersion = this.versions[0]
                this.getVersion()
            })
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
    .fontstyle{
        font-family: "Merienda", Helvetica, Arial;
    }
</style>