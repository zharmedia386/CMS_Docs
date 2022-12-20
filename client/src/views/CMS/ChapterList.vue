<template>
  <v-container>
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
    <br>
    <v-card>
      <v-card-title class="d-flex justify-space-between px-5 light-blue lighten-4 font-weight-bold">
        Chapters List
        <v-btn 
        @click="dialog = true"
        class="blue darken-4 white--text d-flex align-start flex-column"
        >
          Create New Chapter
        </v-btn>
      </v-card-title>
      <br>
      <v-card-text class="d-flex justify-space-between px-5 font-weight-medium black--text" v-for="(chapter, index) in chapters" v-bind:key="index">
        <!-- <v-icon>{{chapter.icon}}</v-icon> {{chapter.title}} -->
        {{ chapter.title }}
        <div>
          <v-btn class="light-blue lighten-4 mr-1" outlined fab small
          @click="() => { updateDialog = true; choosenChapter = chapter; title = chapter.title }"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn class="red lighten-2" outlined fab small @click="deleteChapter(chapter._id, chapter.version)"><v-icon>mdi-delete</v-icon></v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- insert dialog -->
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-form>
        <v-card>
          <v-toolbar class="light-blue lighten-4 text-h5 font-weight-medium">
            Create New Chapter
          </v-toolbar>
          <br>
          <v-text-field
            v-model="title"
            label="Input Title"
            class="pl-5 pr-5"
            :rules="[v => !!v || 'Chapter title is required']"
            outlined
            required
          ></v-text-field>

          <v-select
              v-model="choosenVersion"
              :items="versions"
              outlined
              label="Choose Version"
              class="pl-5 pr-5"
              :rules="[v => !!v || 'Please choose version']"
              required
          ></v-select>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="title.length == 0 || choosenVersion.length == 0"
              color="primary"
              text
              @click="save"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
      
    </v-dialog>

    <!-- Update dialog -->
    <v-dialog
      v-model="updateDialog"
      width="500"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Update Chapter
        </v-card-title>

        <v-text-field
          v-model="title"
          placeholder="Input Title"
          class="pl-5 pr-5"
        ></v-text-field>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="update"
          >
            Update
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
      snackbar: { 
        isShow: false, 
        text: '', 
        type: '', 
        timeout: 2000 
      },
      dialog: false,
      updateDialog: false,
      chapters : [],
      versions: [],
      title: '',
      choosenVersion: '',
      choosenChapter: ''
    }
  },
  methods: {
    deleteChapter(id, version){
      let header = {
        'Authorization' : "Bearer " + localStorage.token
      }
      this.axios.get(`${this.$apiuri}/documentations`)
        .then(res => {
          this.axios.delete(`${this.$apiuri}/chapters`, { 
            data : {
              chapterId : id,
              version : version,
              content : res.data[0].content
            }, 
            headers: header
          })
          .then(() => {
            this.trigger_notification('Chapter deleted successfully', 'success')
            this.updateChapter()
          })
          .catch(error => {
            this.trigger_notification(`Failed to delete chapter, an error has occured ${error.message}`, 'error')
          })
        })
        .catch(err => {
            this.trigger_notification(`Failed to delete chapter, an error has occured ${err.message}`, 'error')
        })
      
    },
    save(){
      const chapter = {
        title: this.title,
        version: [ this.choosenVersion ]
      }

      this.axios.post(`${this.$apiuri}/chapters`, chapter)
        .then(response => {
          // send flash message
          console.log(response.data)
          this.trigger_notification('Chapter created successfully', 'success')
          this.updateChapter()
        })
        .catch(error => {
          // send flash message
          this.trigger_notification(`Failed to create a chapter, an error has occured ${error.message}`, 'error')
        })

      console.log(JSON.stringify(chapter))

      this.dialog = false
      this.title = ''
      this.choosenVersion = ''
    },
    update(){
      const chapter = {
        id: this.choosenChapter._id,
        title: this.title
      }

      this.axios.put(`${this.$apiuri}/chapters`, chapter)
        .then(response => {
          // send flash message
          console.log(response.data)
          this.trigger_notification('Chapter changed successfully', 'success')
          this.updateChapter()
        })
        .catch(error => {
          // send flash message
          this.trigger_notification(`Failed to create a chapter, an error has occured ${error.message}`, 'error')
        })

        this.updateDialog = false
        this.title = ''
        this.choosenChapter = ''
    },
    trigger_notification(text, type, timeout=2000){
      this.snackbar = { isShow:true, text, type, timeout }
    },
    updateChapter(){
      this.axios.get(`${this.$apiuri}/chapters`)
      .then(response => {
        this.chapters = response.data
      })
    }
  },
  created(){
    this.updateChapter()
  },
  beforeCreate(){
    // get all version list
    this.axios.get(`${this.$apiuri}/documentations/version`)
      .then((response) => {
          response.data[0].content.forEach(v => {
              this.versions.push(v.version)
          });
      })
  }
}
</script>

<style>

</style>