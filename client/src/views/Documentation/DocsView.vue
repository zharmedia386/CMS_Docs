<template>
  <v-app>
    <v-navigation-drawer permanent >
        <!-- <router-link v-for="chapter in chapters" v-bind:key="chapter" :to="`/docs/${chapter}`">
            {{ chapter }} <br/>
        </router-link> -->
        <v-list-item-group>
            <v-list-item v-for="(chapter,index) in chapters" v-bind:key="index">
                <v-list-item-icon></v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title v-text="chapter.title"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-group>
                    <v-list-item v-for="section in chapter.sections" v-bind:key="section" :to="{name : 'section', params: { section : section}}">
                        <v-list-item-content>
                            <v-list-item-title v-text="section" ></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list-item>
        </v-list-item-group>
    </v-navigation-drawer>
    <v-main>
        <v-container>
            <router-view :key="$route.path"></router-view>
        </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
    data(){
        return {
            chapters : [
                {
                    title : "Getting Started",
                    sections : [
                        "a",
                        "b",
                        "c"
                    ]
                },
                {
                    title : "Introduction",
                    sections : [
                        "d",
                        "e",
                        "f"
                    ]
                }, 
                {
                    title : "Components",
                    sections : [
                        "g",
                        "h",
                        "i"
                    ]
                }
            ]
        }
    }
}
</script>

<style>

</style>