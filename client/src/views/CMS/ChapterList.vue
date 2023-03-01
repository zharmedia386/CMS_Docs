<template>
  <v-container>
    <v-card class="chapter-header elevation-0" dark>
      <v-card-title class="d-flex justify-space-between pa-0">
        <v-text-field dense outlined placeholder="Search..." class="search-input"></v-text-field>
        <v-btn 
          @click="dialog = true"
          color="#939AFF"
          class="black--text d-flex align-start flex-column"
        >
          <v-icon class="mr-2">mdi-plus</v-icon>
          Add New
        </v-btn>
      </v-card-title>
    </v-card>

    <div class="chapter-list">
      <v-card variant="tonal" class="chapter-card table-responsive mb-3" dark v-for="(chapter, index) in cloneItems" v-bind:key="index">
        <table style="width: 100%;">
          <tr>
            <td>
              <span>Chapter Title:</span>
              <p>{{ chapter.title }}</p>
            </td>
            <td>
              <span>Last Updated:</span>
              <p><span>{{ new Date(chapter.updatedAt) | moment("from", "now") }}</span></p>
            </td>
            <td>
              <span>Author:</span>
              <p>Fauzi</p>
            </td>
            <td>
              <span>Actions:</span>
              <div>
                <v-btn class="edit-btn tonal mr-2" rounded color="warning" @click="() => { updateDialog = true; choosenChapter = chapter; title = chapter.title }"><v-icon class="mr-2">mdi-pencil</v-icon>Edit</v-btn>
                <v-btn class="delete-btn tonal" rounded color="error" @click="deleteChapter(chapter._id, chapter.version)"><v-icon class="mr-2">mdi-delete</v-icon>Delete</v-btn>
              </div>
            </td>
          </tr>
        </table>
      </v-card>
    </div>

    <v-pagination
      v-if="pagination.total >= pagination.rowsPerPage"
      v-model="pagination.page"
      :length="pages"
      :total-visible="5"
      color="var(--secondary-purple-darker)"
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
      dark
      class="chapter-pagination"
    ></v-pagination>

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
import { store } from '../../store'

export default {
  data(){
    return {
      dialog: false,
      updateDialog: false,
      chapters : [],
      versions: [],
      title: '',
      choosenVersion: '',
      choosenChapter: '',
      pagination: {
        page: 1,
        total: 0,
        rowsPerPage: 5
      }
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
      const token = store.getters.getTokens
      this.axios.get(`${this.$apiuri}/chapters`,
      {
          headers: {
              "Authorization": 'Bearer ' + token,
              "x-access-token": token ,
              "Content-type": "application/json"
          },
      }
      )
      .then(response => {
        this.chapters = response.data
        this.pagination.total = this.chapters.length
      })
    },
  },
  computed: {
    pages () {
      return Math.ceil(this.pagination.total / this.pagination.rowsPerPage)
    },
    cloneItems() {
        var clone = JSON.parse(JSON.stringify(this.chapters));
        var startFrom = (this.pagination.page*this.pagination.rowsPerPage)-this.pagination.rowsPerPage;
        return clone.splice(startFrom, this.pagination.rowsPerPage);
    }
  },
  created(){
    this.updateChapter()
  },
  beforeCreate(){
    // get all version list
    const token = store.getters.getTokens
    this.axios.get(`${this.$apiuri}/documentations/version`,
    {
        headers: {
            "Authorization": 'Bearer ' + token,
            "x-access-token": token ,
            "Content-type": "application/json"
        },
    }
    )
      .then((response) => {
          response.data[0].content.forEach(v => {
              this.versions.push(v.version)
          });
      })
  }
}
</script>

<style scoped>
  button {
    text-transform: none;
    font-weight: bold;
  }

  .chapter-header {
    margin: 0 50px;
    background-color: var(--primary-dark);
  }
  .chapter-header button {
    margin-bottom: 14px;
  }
  .chapter-header .search-input {
    max-width: 300px;
    min-width: 100px;
    margin-top: 12px;
  }

  .chapter-list {
    overflow-x: auto;
    margin: 0 50px;
  }
  .chapter-card {
    padding: 40px 20px;
    background-color: var(--primary-dark-lighter);
    min-width: 1000px;
  }

  table tr td {
    text-align: left;
    min-width: 300px;
  }
  table tr td:nth-child(2),
  table tr td:nth-child(3) {
    min-width: 200px;
  }
  
  table tr td span {
    font-size: 0.8rem;
    font-weight: bold;
  }

  table tr td p,
  table tr td p span {
    font-size: 1.1rem;
    margin-bottom: 0;
    margin-top: 5px;
  }
  
  table tr td:first-child p {
    font-weight: bold;
  }

  table tr td div {
    margin-top: 5px;
  }

  table tr td button {
    height: 35px !important;
  }
  
  table tr td div .edit-btn {
    background-color: #2c5282 !important;
  }

  table tr td div .delete-btn {
    background-color: #a40d14 !important;
  }
</style>