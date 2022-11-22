<template>
  <v-card
    class="mx-auto"
  >
    <v-card-title>Versioning</v-card-title>
    <v-select
        v-model="selectedVersion" 
        :items="docs"
        item-text="version"
        outlined
        return-object
    ></v-select>
    <v-list>
      <div v-for="(chapter, i) in selectedVersion.chapters" :key="i">
        <v-row>
            <v-col cols="10">
            <v-list-group
                :value="false"
                :prepend-icon="chapter.icon"
            >
                <template v-slot:activator>
                    <v-list-item-title v-text="chapter.title"></v-list-item-title>
                </template>
                <v-list-item
                    v-for="(section, j) in chapter.sections"
                    :key="j"
                >
                    <v-list-item-title v-text="section.title"></v-list-item-title>
                    <v-btn small outlined fab :disabled="j == 0"><v-icon>mdi-arrow-up</v-icon></v-btn>
                    <v-btn small outlined fab :disabled="j == chapter.sections.length-1"><v-icon>mdi-arrow-down</v-icon></v-btn>
                </v-list-item>
            </v-list-group>
            </v-col>
            <v-col cols="2" class="my-auto">
                <v-btn small outlined fab :disabled="i == 0"><v-icon>mdi-arrow-up</v-icon></v-btn>
                <v-btn small outlined fab :disabled="i == selectedVersion.chapters.length-1"><v-icon>mdi-arrow-down</v-icon></v-btn>
            </v-col>
        </v-row>
      </div>
    </v-list>
  </v-card>
</template>

<script>
export default {
    data(){
        return {
            docs : [
                {
                    version : "1.0.0",
                    chapters : [
                        {
                            title : "Getting started",
                            icon : "mdi-home",
                            sections : [
                                {
                                    title : "Introduction"
                                },
                                {
                                    title : "Download"
                                }
                            ]
                        },
                        {
                            title : "Customize",
                            icon : "mdi-home",
                            sections : [
                                {
                                    title : "Overview"
                                },
                                {
                                    title : "Sass"
                                }
                            ]
                        }
                    ]
                },
                {
                    version : "1.1.0",
                    chapters : [
                        {
                            title : "Layout",
                            icon : "mdi-home",
                            sections : [
                                {
                                    title : "Breakpoints"
                                },
                                {
                                    title : "Containers"
                                }
                            ]
                        },
                        {
                            title : "Content",
                            icon : "mdi-home",
                            sections : [
                                {
                                    title : "Reboot"
                                },
                                {
                                    title : "Typography"
                                }
                            ]
                        },
                        {
                            title : "Content",
                            icon : "mdi-home",
                            sections : [
                                {
                                    title : "Reboot"
                                },
                                {
                                    title : "Typography"
                                }
                            ]
                        }
                    ]
                }
            ],
            chapters : [
                {
                    title : "Getting started",
                    icon : "mdi-pencil"
                },
                {
                    title : "Customize",
                    icon : "mdi-pencil"
                },
                {
                    title : "Layout",
                    icon : "mdi-pencil"
                }
            ],
            sections : [
                {
                    title : "",
                    version : ""
                }
            ],
            showSection : [],
            selectedVersion : {}
        }
    },
    methods : {

    },
    created(){
        this.selectedVersion = this.docs[0]
    }

}
</script>

<style>

</style>