<template>
  <v-app>
    <v-app-bar app>
        <v-toolbar-title>Documentation</v-toolbar-title>
        <v-select
            v-model="choosenVersion"
            :items="versions"
            outlined
            @change="getVersion()"
        ></v-select>
        <v-btn outlined>
            <v-icon>mdi-magnify</v-icon>search
        </v-btn>
        <v-btn>
            <v-icon>mdi-github</v-icon>
        </v-btn>
    </v-app-bar>
    <v-navigation-drawer app >
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
    <v-main>
        <v-container>
            <router-view :key="$route.path"></router-view>
        </v-container>
    </v-main>
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
            choosenVersion: ''
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
    }
}
</script>

<style>

</style>