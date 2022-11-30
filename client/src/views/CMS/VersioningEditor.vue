<template>
  <v-card
    class="mx-auto"
  >
    <v-alert
        :value="alert.value"
        :type="alert.status ? 'success' : 'error'"
        transition="slide-y-transition"
      >{{ alert.message }}</v-alert>
    <v-card-title>Versioning</v-card-title>
    <v-btn
        @click="reorder()"
    >
        Save
    </v-btn>
    <v-select
        v-model="selectedVersion" 
        :items="content"
        item-text="version"
        outlined
        return-object
    ></v-select>
    <v-list>
      <div v-for="(chapter, i) in selectedVersion.chapter" :key="i">
        <v-row>
            <v-col cols="10">
            <v-list-group
                :value="false"
            >
                <template v-slot:activator>
                    <v-list-item-title v-text="chapter.title"></v-list-item-title>
                </template>
                <v-list-item
                    v-for="(section, j) in chapter.section"
                    :key="j"
                >
                    <v-list-item-title v-text="section.title"></v-list-item-title>
                    <v-btn 
                        small 
                        outlined 
                        fab 
                        :disabled="j == 0"
                        @click="moveUpSection(i, j)"
                    >
                        <v-icon>mdi-arrow-up</v-icon>
                    </v-btn>
                    <v-btn 
                        small 
                        outlined 
                        fab 
                        :disabled="j == chapter.section.length-1"
                        @click="moveDownSection(i, j)"
                    >
                        <v-icon>mdi-arrow-down</v-icon>
                    </v-btn>
                </v-list-item>
            </v-list-group>
            </v-col>
            <v-col cols="2" class="my-auto">
                <v-btn 
                    small 
                    outlined 
                    fab 
                    :disabled="i == 0"
                    @click="moveUpChapter(i)"
                >
                    <v-icon>mdi-arrow-up</v-icon>
                </v-btn>
                <v-btn 
                    small 
                    outlined 
                    fab 
                    :disabled="i == selectedVersion.chapter.length-1"
                    @click="moveDownChapter(i)"
                >
                    <v-icon>mdi-arrow-down</v-icon>
                </v-btn>
            </v-col>
        </v-row>
      </div>
    </v-list>
  </v-card>
</template>

<script>
import { store } from '../../store'

export default {
    data(){
        return {
            alert: {value: false, status: true, message: ''},
            content: [],
            selectedVersion : {}
        }
    },
    methods : {
        findVersionIndex() {
            let versionIdx = this.content.findIndex(object => {
                return object.version === this.selectedVersion.version;
            })

            return versionIdx
        },
        moveUpChapter(index) {
            let versionIdx = this.findVersionIndex()
            let prevChapter = this.content[versionIdx].chapter[index-1]
            let crntChapter = this.content[versionIdx].chapter[index]

            this.content[versionIdx].chapter.splice(index-1, 2, crntChapter, prevChapter)
        },
        moveDownChapter(index) {
            let versionIdx = this.findVersionIndex()
            let crntChapter = this.content[versionIdx].chapter[index]
            let nextChapter = this.content[versionIdx].chapter[index+1]

            this.content[versionIdx].chapter.splice(index, 2, nextChapter, crntChapter)
        },
        moveUpSection(chapterIdx, sectionIdx) {
            let versionIdx = this.findVersionIndex()
            let prevSection = this.content[versionIdx].chapter[chapterIdx].section[sectionIdx-1]
            let crntSection = this.content[versionIdx].chapter[chapterIdx].section[sectionIdx]

            this.content[versionIdx].chapter[chapterIdx].section.splice(sectionIdx-1, 2, crntSection, prevSection)
        },
        moveDownSection(chapterIdx, sectionIdx) {
            let versionIdx = this.findVersionIndex()
            let crntSection = this.content[versionIdx].chapter[chapterIdx].section[sectionIdx]
            let nextSection = this.content[versionIdx].chapter[chapterIdx].section[sectionIdx+1]

            this.content[versionIdx].chapter[chapterIdx].section.splice(sectionIdx, 2, nextSection, crntSection)
        },
        reorder(){
            console.log(this.content)
            let content = this.content
            const token = store.getters.getTokens
            this.axios.put(`${this.$apiuri}/documentations/reorder`, {content},
            {
                headers: {
                    "Authorization": 'Bearer ' + token,
                    "x-access-token": token ,
                    "Content-type": "application/json"
                },
            }
            )
                .then(response => {
                // send flash message
                console.log(response.data)
                this.trigger_alert(true, 'urutan Documentation Content berhasil diubah')
                })
                .catch(error => {
                // send flash message
                console.log(error.message)
                this.trigger_alert(true, `Gagal mengubah urutan content, terjadi error ${error.message}`)
                })
        },
        trigger_alert(status, message) {
            this.alert.value = true
            this.alert.status = status
            this.alert.message = message
            // `event` is the native DOM event
            window.setTimeout(() => {
                this.alert.value = false;
            }, 3000)    
        }
    },
    created(){
        const token = store.getters.getTokens
        this.axios.get(`${this.$apiuri}/documentations`,
        {
            headers: {
                "Authorization": 'Bearer ' + token,
                "x-access-token": token ,
                "Content-type": "application/json"
            },
        }
        )
        .then(response => {
            this.content = response.data[0].content
            this.selectedVersion = response.data[0].content[0]
        })
    }

}
</script>

<style>

</style>