<template>
  <v-app>
    <v-app-bar app>
        <v-toolbar-title>Documentation</v-toolbar-title>
        <v-select
            v-model="choosenVersion"
            :items="versions"
            outlined
        ></v-select>
        <v-btn outlined>
            <v-icon>mdi-magnify</v-icon>search
        </v-btn>
        <v-btn>
            <v-icon>mdi-github</v-icon>
        </v-btn>
    </v-app-bar>
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
            chapters : [
                {
                    title : "Getting Started",
                    icon : "mdi-book-open-outline",
                    sections : [
                        "introduction",
                        "b",
                        "c"
                    ]
                },
                {
                    title : "Introduction",
                    icon : "mdi-book-open-outline",
                    sections : [
                        "d",
                        "e",
                        "f"
                    ]
                }, 
                {
                    title : "Components",
                    icon : "mdi-book-open-outline",
                    sections : [
                        "g",
                        "h",
                        "i"
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

</style>