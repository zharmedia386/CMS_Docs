<template>
  <v-card
    class="mx-auto"
  >
    <v-alert
        :value="alert.value"
        :type="alert.status ? 'success' : 'error'"
        transition="slide-y-transition"
      >{{ alert.message }}</v-alert>
    <v-card-title class="d-flex justify-space-between px-5">
        Versioning
        <v-btn @click="() => { createDialog = true ;}">Create New Version</v-btn>
    </v-card-title>
    <v-row class="d-flex justify-space-between px-5">
        <v-col cols="9">
            <v-select
                v-model="selectedVersion" 
                :items="content"
                item-text="version"
                outlined
                return-object
                @change="() => { updateSection(); updateChapter() }"
            ></v-select>
        </v-col>
        <v-col cols="3">
            <v-container >
        <v-btn
            @click="reorder()"
        >
            Reorder Content
        </v-btn>
    </v-container>
        </v-col>
    </v-row>
    
    <v-list>
      <div v-for="(chapter, i) in selectedVersion.chapter" :key="i">
        <v-row>
            <v-col cols="8">
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
                        @click="removeSection(section)"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
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
            <!-- versioning -->
            <v-col cols="2" class="my-auto">
                <v-btn 
                    small 
                    outlined 
                    fab 
                    @click="removeChapter(chapter)"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-btn 
                    small 
                    outlined 
                    fab 
                    @click="() => { dialog = true; sectionChapter = chapter }"
                >
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </v-col>
            <!-- reorder -->
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
    <v-btn @click="() => { chapterDialog = true ;}">Add Chapter</v-btn>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Add Section Into Chapter
        </v-card-title>

        <v-list>
            <v-list-item v-for="(section, index) in sections" :key="index">
                <v-checkbox v-model="selectedSections" :value="section" multiple/>
                {{ section.title }}
            </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="addSection()"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Chapter Dialog -->
    <v-dialog
      v-model="chapterDialog"
      width="500"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Add Chapter into Version
        </v-card-title>

        <v-list>
            <v-list-item v-for="(chapter, index) in chapters" :key="index">
                <v-checkbox v-model="selectedChapters" :value="chapter" multiple/>
                {{ chapter.title }}
            </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="addChapter"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Create Version Dialog -->
    <v-dialog
      v-model="createDialog"
      width="500"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Create New Version
        </v-card-title>
        <v-text-field
          v-model="versionName"
          placeholder="Input version name"
          class="pl-5 pr-5"
        ></v-text-field>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="createVersion"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
    data(){
        return {
            alert: {value: false, status: true, message: ''},
            dialog: false,
            chapterDialog: false,
            createDialog: false,

            versionName: '',

            content: [],

            sections: [],
            selectedSections: [],
            sectionChapter: '',

            chapters: [],
            selectedChapters: [],

            selectedVersion : {}
        }
    },
    methods : {
        createVersion(){
            const versionName = this.versionName;
            this.axios.put(`${this.$apiuri}/versioning/create`, {versionName})
                .then(response => {
                // send flash message
                console.log(response.data)
                // this.trigger_alert(true, 'urutan Documentation Content berhasil diubah')
                })
                .catch(error => {
                // send flash message
                console.log(error.message)
                // this.trigger_alert(true, `Gagal mengubah urutan content, terjadi error ${error.message}`)
                })
                .finally(() => {
                    this.versionName = ''
                    this.createDialog = false
                    this.updateDocumentationContent()
                })
        },
        findVersionIndex() {
            let versionIdx = this.content.findIndex(object => {
                return object.version === this.selectedVersion.version;
            })

            return versionIdx
        },
        addSection(){
            const version = this.selectedVersion.version;
            const chapter = this.sectionChapter._id
            const sections = this.selectedSections
                .map(section => ({_id: section._id, title: section.title}))

            this.axios.put(`${this.$apiuri}/versioning/section`, {sections, chapter, version})
                .then(response => {
                // send flash message
                console.log(response.data)
                // this.trigger_alert(true, 'urutan Documentation Content berhasil diubah')
                })
                .catch(error => {
                // send flash message
                console.log(error.message)
                // this.trigger_alert(true, `Gagal mengubah urutan content, terjadi error ${error.message}`)
                })
                .finally(() => {
                    this.dialog = false;
                    this.selectedSections = []
                    this.updateDocumentationContent()
                })
        },
        removeSection(section){
            const version = this.selectedVersion.version;
            const sectionId = section._id;
            this.axios.put(`${this.$apiuri}/versioning/section/delete`, {sectionId, version})
                .then(response => {
                // send flash message
                    console.log(response.data)
                // this.trigger_alert(true, 'urutan Documentation Content berhasil diubah')
                })
                .catch(error => {
                // send flash message
                    console.log(error.message)
                // this.trigger_alert(true, `Gagal mengubah urutan content, terjadi error ${error.message}`)
                }).finally(() => {
                    this.updateDocumentationContent()
                })
        },
        addChapter(){
            const version = this.selectedVersion.version;
            const chapters = this.selectedChapters
                .map(ch => ({ _id: ch._id, title: ch.title }))
            
            this.axios.put(`${this.$apiuri}/versioning/chapter`, {chapters, version})
                .then(response => {
                // send flash message
                console.log(response.data)
                // this.trigger_alert(true, 'urutan Documentation Content berhasil diubah')
                })
                .catch(error => {
                // send flash message
                console.log(error.message)
                // this.trigger_alert(true, `Gagal mengubah urutan content, terjadi error ${error.message}`)
                })
                .finally(() => {
                    this.chapterDialog = false;
                    this.selectedChapters = []
                    this.updateDocumentationContent()
                })
        },
        removeChapter(chapter){
            const version = this.selectedVersion.version;
            const chapterId = chapter._id
            const sectionsId = chapter.section.map(sc => sc._id)

            this.axios.put(`${this.$apiuri}/versioning/chapter/delete`, {chapterId, sectionsId, version})
                .then(response => {
                // send flash message
                    console.log(response.data)
                // this.trigger_alert(true, 'urutan Documentation Content berhasil diubah')
                })
                .catch(error => {
                // send flash message
                    console.log(error.message)
                // this.trigger_alert(true, `Gagal mengubah urutan content, terjadi error ${error.message}`)
                }).finally(() => {
                    this.updateDocumentationContent()
                })
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

            this.axios.put(`${this.$apiuri}/versioning/reorder`, {content})
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
        updateSection() {
            this.axios.get(`${this.$apiuri}/sections`)
            .then(response => {
                const sections = response.data
                this.sections = (!sections) ? sections : sections.filter(section => !section?.version?.includes(this.selectedVersion.version))                    
            })
        },
        updateChapter() {
            this.axios.get(`${this.$apiuri}/chapters`)
            .then(response => {
                this.chapters = response.data
                    .filter(chapter => !chapter.version.includes(this.selectedVersion.version))
            })
        },
        updateDocumentationContent() {
            this.axios.get(`${this.$apiuri}/documentations`)
                .then(response => {
                    this.content = response.data[0].content
                    const versionIdx = this.findVersionIndex()
                    this.selectedVersion = response.data[0].content[versionIdx]
                    this.updateSection()
                    this.updateChapter()
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
        this.axios.get(`${this.$apiuri}/documentations`)
            .then(response => {
                this.content = response.data[0].content
                this.selectedVersion = response.data[0].content[0]
                this.updateSection()
                this.updateChapter()
            })
    }

}
</script>

<style>

</style>