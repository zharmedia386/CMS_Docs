<template>
  <v-container>
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
        <v-toolbar class="light-blue lighten-4 text-h5 font-weight-medium">
          Update Chapter
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
        
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="title.length == 0"
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
            this.$root.SnackBar.show({ message: 'Chapter deleted successfully', color: 'success', icon: 'mdi-check-circle' })
            this.updateChapter()
          })
          .catch(error => {
            this.$root.SnackBar.show({ message: `Failed to delete chapter, an error has occured ${error.message}`, color: 'error', icon: 'mdi-close-circle' })
          })
        })
        .catch(err => {
            this.$root.SnackBar.show({ message: `Failed to delete chapter, an error has occured ${err.message}`, color: 'error', icon: 'mdi-close-circle' })
        })
      
    },
    save(){
      const chapter = {
        title: this.title,
        version: [ this.choosenVersion ]
      }

      let header = {
        headers: {
          'Authorization' : "Bearer " + localStorage.token
        }
      }

      this.axios.post(`${this.$apiuri}/chapters`, chapter, header)
        .then(response => {
          // send flash message
          console.log(response.data)
          this.$root.SnackBar.show({ message: 'Chapter created successfully', color: 'success', icon: 'mdi-check-circle' })
          this.updateChapter()
        })
        .catch(error => {
          this.$root.SnackBar.show({ message: `Failed to create a chapter, an error has occured ${error.message}`, color: 'error', icon: 'mdi-close-circle' })
        })

      this.dialog = false
      this.title = ''
      this.choosenVersion = ''
    },
    update(){
      const chapter = {
        id: this.choosenChapter._id,
        title: this.title
      }

      let header = {
        headers: {
          'Authorization' : "Bearer " + localStorage.token
        }
      }

      this.axios.put(`${this.$apiuri}/chapters`, chapter, header)
        .then(response => {
          console.log(response.data)
          this.$root.SnackBar.show({ message: 'Chapter changed successfully', color: 'success', icon: 'mdi-check-circle' })
          this.updateChapter()
        })
        .catch(error => {
          this.$root.SnackBar.show({ message: `Failed to update a chapter, an error has occured ${error.message}`, color: 'error', icon: 'mdi-close-circle' })
        })

        this.updateDialog = false
        this.title = ''
        this.choosenChapter = ''
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