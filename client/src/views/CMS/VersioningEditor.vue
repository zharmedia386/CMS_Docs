<template>
  <v-container>
    <!-- Notification -->
    <v-snackbar
      v-model="snackbar.isShow"
      :timeout="snackbar.timeout"
      :color="snackbar.type"
      elevation="8"
      top
      centered
    >
      <v-icon v-if="snackbar.type == 'success'">mdi-check-circle</v-icon>
      <v-icon v-if="snackbar.type == 'error'">mdi-close-circle</v-icon>
      {{ snackbar.text }}
    </v-snackbar>
    <!-- Manage Content Version -->
    <v-card class="mx-auto mb-5 ">
      <v-card-title class="d-flex justify-space-between px-5 light-blue lighten-4 font-weight-bold">
        Content Version
      </v-card-title>
      <v-container class="d-flex justify-start pt-5 pb-5">
          <v-btn class="blue darken-4 white--text mr-5" @click="() => { deleteDialog = true }">Delete Version</v-btn>
          <v-btn class="blue darken-4 white--text mr-5" @click="() => { editDialog = true }">Edit Version</v-btn>
          <v-btn class="blue darken-4 white--text mr-5" @click="() => { createDialog = true }">Create Version</v-btn>
      </v-container>
    </v-card>

    <!-- Manage Content Structure -->
    <v-card class="mx-auto">
      <v-card-title class="d-flex justify-space-between px-5 light-blue lighten-4 font-weight-bold">
        Content Structure
      </v-card-title>

      <!-- Reorder Content -->
      <v-row class="d-flex px-5 mt-5 ">
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
          <v-btn
            @click="reorder()"
            class="mt-1 blue darken-4 white--text"
          >
            Reorder Content
          </v-btn>
        </v-col>
      </v-row>
      
      <!-- List Chapter & Section -->
      <v-list>
        <!-- List Chapter -->
        <div v-for="(chapter, i) in selectedVersion.chapter" :key="i">
          <v-row>
            <v-col cols="8">
              <v-list-group :value="false">
                <template v-slot:activator>
                    <v-list-item-title v-text="chapter.title"></v-list-item-title>
                </template>

                <!-- List Section -->
                <v-list-item v-for="(section, j) in chapter.section" :key="j">
                  <v-list-item-title v-text="`${section.title} ${section.alias ? '- ' + section.alias : ''}`"></v-list-item-title>
                  <!-- Remove Section -->
                  <v-btn 
                      small 
                      outlined 
                      fab 
                      @click="removeSection(section)"
                  >
                      <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <!-- Move Up Section -->
                  <v-btn 
                      small 
                      outlined 
                      fab 
                      :disabled="j == 0"
                      @click="moveUpSection(i, j)"
                  >
                      <v-icon>mdi-arrow-up</v-icon>
                  </v-btn>
                  <!-- Move Down Section -->
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
            
            <!-- Add/Remove Button -->
            <v-col cols="2" class="my-auto">
              <!-- Remove Chapter -->
              <v-btn 
                small 
                outlined 
                fab 
                @click="removeChapter(chapter)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <!-- Add Section -->
              <v-btn 
                small 
                outlined 
                fab 
                @click="() => { dialog = true; sectionChapter = chapter }"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>

            <!-- Move Up/Down Chapter -->
            <v-col cols="2" class="my-auto">
              <!-- Move Up Chapter -->
              <v-btn 
                small 
                outlined 
                fab 
                :disabled="i == 0"
                @click="moveUpChapter(i)"
              >
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <!-- Move Down Chapter -->
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
      <!-- Add Chapter -->
      <v-btn 
        @click="() => { chapterDialog = true }"
        class="mt-1 blue darken-4 white--text mb-5"
      >
        Add Chapter
      </v-btn>
    </v-card>

    <!-- Add Section Dialog -->
    <v-dialog 
      v-model="dialog" 
      width="800"
      transition="dialog-bottom-transition"
      scrollable
      persistent
    >
      <v-card>
        <v-toolbar color="primary" class="font-weight-bold" dark>
          Add Section Into Chapter
        </v-toolbar>

        <v-card-text style="max-height: 500px; padding:0;">
          <!-- List of section in checkboxes -->
          <v-list>
            <v-list-item v-for="(section, index) in sections" :key="index">
              <v-checkbox v-model="selectedSections" :value="section" multiple/>
              {{ `${section.title} ${section.alias ? '- ' + section.alias : ''}` }}
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="() => {dialog = false}"
          >
            Cancel
          </v-btn>

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

    <!-- Add Chapter Dialog -->
    <v-dialog 
      v-model="chapterDialog"
      width="800"
      transition="dialog-bottom-transition"
      scrollable
      persistent
    >
      <v-card>
        <v-toolbar color="primary" class="font-weight-bold" dark>
          Add Chapter into Version
        </v-toolbar>

        <v-card-text style="max-height: 500px; padding:0;">
          <v-list>
            <v-list-item v-for="(chapter, index) in chapters" :key="index">
              <v-checkbox v-model="selectedChapters" :value="chapter" multiple/>
              {{ chapter.title }}
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="() => {chapterDialog = false}"
          >
            Cancel
          </v-btn>

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
      width="600"
      transition="dialog-bottom-transition"
      persistent
    >
      <v-form v-model="createFormValid">
        <v-card>
          <v-toolbar class="light-blue lighten-4 text-h5 font-weight-medium px-2">
            Create New Version
          </v-toolbar>

          <v-card-text style="max-height: 500px; padding:0;" class="mt-7 tb-2">
          <v-text-field
            v-model="versionName"
            label="Version Name"
            :rules="[rules.required]"
            class="pl-5 pr-5"
            outlined
          ></v-text-field>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="() => {createDialog = false; versionName = ''}"
            >
              Cancel
            </v-btn>

            <v-btn
              color="primary"
              text
              :disabled="!createFormValid"
              @click="createVersion"
            >
              Create
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- Edit Version Dialog -->
    <v-dialog 
      v-model="editDialog"
      width="600"
      transition="dialog-bottom-transition"
      persistent
    >
      <v-form v-model="editFormValid">
        <v-card>
          <v-toolbar class="light-blue lighten-4 text-h5 font-weight-medium px-2">
            Edit Version
          </v-toolbar>

          <v-card-text class="mt-10">
            <v-select
                v-model="editedVersion" 
                :items="content"
                :rules="[rules.required]"
                label="Choose Version"
                item-text="version"
                outlined
                return-object
            ></v-select>
            <v-text-field
              v-model="newVersionName"
              label="New Version Name"
              :rules="[rules.required]"
              outlined
            ></v-text-field>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="() => {editDialog = false; editedVersion = ''; newVersionName = ''}"
            >
              Cancel
            </v-btn>

            <v-btn
              color="primary"
              text
              @click="editVersion()"
              :disabled="!editFormValid"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- Delete Dialog -->
    <v-dialog 
      v-model="deleteDialog"
      width="800"
      transition="dialog-bottom-transition"
      scrollable
      persistent
    >
      <v-card>
        <v-toolbar class="light-blue lighten-4 text-h5 font-weight-medium px-2">
          Delete Version
        </v-toolbar>

        <v-card-text style="max-height: 500px; padding:0;">
          <v-list>
              <v-list-item v-for="(ct, index) in content" :key="index">
                  <v-checkbox v-model="deletedVersion" :value="ct" multiple/>
                  {{ ct.version }}
              </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="() => {deleteDialog = false}"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            text
            :disabled="!(!!this.deletedVersion.length)"
            @click="deleteVersion"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data(){
    return {
      dialog: false,
      chapterDialog: false,
      createDialog: false,
      editDialog: false,
      deleteDialog: false,

      createFormValid: false,
      editFormValid: false,

      editedVersion: '',
      newVersionName: '',

      deletedVersion: [],

      versionName: '',

      content: [],

      sections: [],
      selectedSections: [],
      sectionChapter: '',

      chapters: [],
      selectedChapters: [],

      selectedVersion : {},

      snackbar: { 
        isShow: false, 
        text: '', 
        type: '', 
        timeout: 2000 
      },

      rules: {
        required: value => !!value || 'Required.',
      }
    }
  },
  methods : {
    createVersion(){
      // Validate forms
      if(!this.createFormValid) {
        this.trigger_notification('Failed to create a version, please fill in the version name first', 'error')
        return
      }

      const versionName = this.versionName;
      this.axios.put(`${this.$apiuri}/versioning/create`, {versionName})
        .then(response => {
          this.trigger_notification(response.data.message, 'success')
        })
        .catch(error => {
          this.trigger_notification(`Failed to create a version, an error occurred ${error.message}`, 'error')
        })
        .finally(() => {
          this.versionName = ''
          this.createDialog = false
          this.updateDocumentationContent()
        })
    },
    editVersion(){
      // Validate Forms
      if(!this.editFormValid) {
        this.trigger_notification('Failed to edit version, please fill all available form input', 'error')
        return
      }

      const editedVersion = this.editedVersion.version;
      const newVersionName = this.newVersionName;

      this.axios.put(`${this.$apiuri}/versioning/edit`, {editedVersion, newVersionName})
        .then(response => {
          this.trigger_notification(response.data.message, 'success')
        })
        .catch(error => {
          this.trigger_notification(`Failed to edit a version, an error occurred ${error.message}`, 'error')
        })
        .finally(() => {
          this.editedVersion = ''
          this.newVersionName = ''
          this.editDialog = false
          this.updateDocumentationContent()
        })
    },
    deleteVersion(){
      if(this.deletedVersion.length==0){
        this.trigger_notification('Failed to delete version, please choose at least one version', 'error')
        return
      }

      const content = this.deletedVersion;

      this.axios.put(`${this.$apiuri}/versioning/delete`, {content})
        .then(response => {
          this.trigger_notification(response.data.message, 'success')
        })
        .catch(error => {
          this.trigger_notification(`Failed to remove version, an error occurred ${error.message}`, 'error')
        })
        .finally(() => {
          this.updateDocumentationContent()
          this.deletedVersion = []
          this.deleteDialog = false
        })
    },
    findVersionIndex() {
      // Get index of version from current selected version
      const versionIdx = this.content.findIndex(object => {
        return object.version === this.selectedVersion.version;
      })

      return versionIdx
    },
    addSection(){
      const version = this.selectedVersion.version;
      const chapter = this.sectionChapter._id
      const sections = this.selectedSections
        .map(section => (!section?.alias) ? 
          ({_id: section._id, title: section.title}) : 
          ({_id: section._id, title: section.title, alias: section.alias})
        )

      this.axios.put(`${this.$apiuri}/versioning/section`, {sections, chapter, version})
        .then(response => {
          this.trigger_notification(response.data.message, 'success')
        })
        .catch(error => {
          this.trigger_notification(`Failed to add section, an error occurred ${error.message}`, 'error')
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
          this.trigger_notification(response.data.message, 'success')
        })
        .catch(error => {
          this.trigger_notification(`Failed to remove section, an error occurred ${error.message}`, 'error')
        })
        .finally(() => {
          this.updateDocumentationContent()
        })
    },
    addChapter(){
      const version = this.selectedVersion.version;
      const chapters = this.selectedChapters
        .map(ch => ({ _id: ch._id, title: ch.title }))
      
      this.axios.put(`${this.$apiuri}/versioning/chapter`, {chapters, version})
        .then(response => {
          this.trigger_notification(response.data.message, 'success')
        })
        .catch(error => {
          this.trigger_notification(`Failed to add chapter, an error occurred ${error.message}`, 'error')
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
      const sectionsId = (chapter?.section) ? chapter?.section.map(sc => sc._id) : []

      this.axios.put(`${this.$apiuri}/versioning/chapter/delete`, {chapterId, sectionsId, version})
        .then(response => {
          this.trigger_notification(response.data.message, 'success')
        })
        .catch(error => {
          this.trigger_notification(`Failed to remove chapter, an error occurred ${error.message}`, 'error')
        }).finally(() => {
          this.updateDocumentationContent()
        })
    },
    reorder(){
      const content = this.content

      this.axios.put(`${this.$apiuri}/versioning/reorder`, {content})
        .then(response => {
          this.trigger_notification(response.data.message, 'success')
        })
        .catch(error => {
          this.trigger_notification(`Failed to modify content structure, an error occurred ${error.message}`, 'error')
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
        this.chapters = response.data.filter(chapter => !chapter.version.includes(this.selectedVersion.version))
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
    trigger_notification(text, type, timeout=2000){
      this.snackbar = { isShow:true, text, type, timeout }
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