<template>
  <v-card
    class="mx-auto"
  >
    <v-card-title>Versioning</v-card-title>
    <v-list>
      <v-list-group
        v-for="(doc,i) in docs"
        :key="i"
        :value="false"
      >
        <template v-slot:activator>
          <v-list-item-title v-text="doc.version"></v-list-item-title>
        </template>
        <v-list-item
            v-for="(chapter,j) in doc.chapters"
            :key="j"
          >
            <v-list-item-title v-text="chapter.title"></v-list-item-title>
            <v-btn outlined fab small :disabled="k == 0"><v-icon>mdi-arrow-up</v-icon></v-btn>
            <v-btn outlined fab small :disabled="k == doc.chapters.length-1"><v-icon>mdi-arrow-down</v-icon></v-btn>
            <v-btn><v-icon>mdi-chevron-down</v-icon></v-btn>
        </v-list-item>
        <v-list-group
          v-for="(chapter,j) in doc.chapters"
          :key="j"
          :value="false"
          no-action
          sub-group
        >
          <template v-slot:activator>
            <v-list-item-content>
                <v-list-item-title v-text="chapter.title"></v-list-item-title>
            </v-list-item-content>
              
          </template>
                <v-btn outlined fab small :disabled="j == 0"><v-icon>mdi-arrow-up</v-icon></v-btn>
                <v-btn outlined fab small :disabled="j == doc.chapters.length-1"><v-icon>mdi-arrow-down</v-icon></v-btn>
          <v-list-item
            v-for="(section, k) in chapter.sections"
            :key="k"
          >
            <v-list-item-title v-text="section.title"></v-list-item-title>
            <v-btn outlined fab small :disabled="k == 0"><v-icon>mdi-arrow-up</v-icon></v-btn>
            <v-btn outlined fab small :disabled="k == chapter.sections.length-1"><v-icon>mdi-arrow-down</v-icon></v-btn>
          </v-list-item>
        </v-list-group>

      </v-list-group>
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
            ]
        }
    },
    methods : {

    }

}
</script>

<style>

</style>