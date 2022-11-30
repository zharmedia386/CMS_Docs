<template>
  <v-app>
    <!-- Header Starts Here -->
    <v-app-bar app style>
<<<<<<< HEAD
        <img src="@/assets/logo.png" style="max-height: 90% ">
        <v-toolbar-title style="font-size:36px">Documentation</v-toolbar-title>
=======
        <img :src="metadata.logo" style="max-height: 50%">
        <v-toolbar-title class="" v-text="metadata.title"></v-toolbar-title>
>>>>>>> 4becd833048fb325d8e4bed3e29ea58dac075de1
        <v-btn 
            outlined
            class="search-box ml-auto"
        ><v-icon>mdi-magnify</v-icon>Search
        </v-btn>    
        <v-select 
            v-model="choosenVersion"
            :items="versions"
            @change="getVersion()"
            outlined
            class="select-box ml-auto"
        ></v-select>
        <v-btn
            class="ml-auto"
            :href="metadata.githubLink"
            target="_blank"
        ><v-icon>mdi-github</v-icon></v-btn>
    </v-app-bar> 
    <!-- Header Stop Here -->
    <!-- Sidebar Starts Here -->
    <v-navigation-drawer app class="fontstyle">
        <v-card v-for="(chapter,i) in chapters" :key="i">
            <v-card-title class="d-flex justify-center font-weight-bold">{{ chapter.title }}</v-card-title>
            <v-list-item-group class="text-left">
                <v-list-item class="font-weight-thin" v-for="(section,j) in chapter.section" :key="j" :to="{name : 'section', params: { id : section._id}}">
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
    >
      <v-card
        elevation="6"
        width="100%"
        class="grey lighten-2 text-center text-dark"
        v-html="metadata.footer"
      >
      </v-card>
    </v-footer>
    <!-- Footer Stops Here -->
    </v-app>
</template>

<script>
import router from '@/router' 

export default {
    data(){
        return {
            chapters : [],
            versions: [],
            arr : [],
            choosenVersion: '',
            metadata : {
                title : "",
                logo : "",
                githubLink : "",
                footer : ""
            }
        }
    },
    methods : {
        getVersion(){
            this.axios.get(`${this.$apiuri}/documentations/${this.choosenVersion}`).then(response => {
                this.chapters = response.data[0].content[0].chapter
                router.push(`/docs/${this.chapters[0].section[0]._id}`)
            }).catch(message => {
                console.log(message)
            })
        }
    },
    created(){
        // let temp = JSON.parse(JSON.stringify(this.versions))
        this.axios.get(`${this.$apiuri}/documentations/version`)
            .then((response) => {
                response.data[0].content.forEach(v => {
                    this.versions.push(v.version)
                });
                this.choosenVersion = this.versions[0]
                this.getVersion()
            })
        this.axios.get(`${this.$apiuri}/documentations/metadata`)
            .then(response => {
                this.metadata = response.data
            })
    }
}
</script>

<style>
    .select-box {
        max-width: 140px;
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