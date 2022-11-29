<template>
  <v-container>
    <v-alert
        :value="alert.value"
        :type="alert.status ? 'success' : 'error'"
        transition="slide-y-transition"
      >{{ alert.message }}</v-alert>
    <br>
    <v-card>
      <v-card-title class="d-flex justify-space-between px-5 light-blue lighten-4 font-weight-bold">
        Chapter List
        <v-btn 
        @click="dialog = true"
        class="blue darken-4 white--text d-flex align-start flex-column"
        >
          Create New Chapter
        </v-btn>
      </v-card-title>
      <br>
      <v-card-text class="d-flex justify-space-between px-5" v-for="(chapter, index) in chapters" v-bind:key="index">
        <!-- <v-icon>{{chapter.icon}}</v-icon> {{chapter.title}} -->
        {{ chapter.title }}
        <div>
          <v-btn class="light-blue lighten-4" outlined fab small
          @click="() => { updateDialog = true; choosenChapter = chapter; title = chapter.title }"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn class="red lighten-2" outlined fab small><v-icon>mdi-delete</v-icon></v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- insert dialog -->
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title class="blue darken-4 text-h5 grey lighten-2  ">
          Create New Chapter
        </v-card-title>

        <v-text-field
          v-model="title"
          placeholder="Input Title"
          class="pl-5 pr-5"
        ></v-text-field>

        <v-select
            v-model="choosenVersion"
            :items="versions"
            outlined
            placeholder="Choose Version"
            class="pl-5 pr-5"
        ></v-select>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="save"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
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
      alert: {value: false, status: true, message: ''},
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
    save(){
      const chapter = {
        title: this.title,
        version: [ this.choosenVersion ]
      }

      this.axios.post(`${this.$apiuri}/chapters`, chapter)
        .then(response => {
          // send flash message
          console.log(response.data)
          this.trigger_alert(true, 'Chapter berhasil dibuat')
          this.updateChapter()
        })
        .catch(error => {
          // send flash message
          this.trigger_alert(true, `Gagal membuat chapter, terjadi error ${error.message}`)
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
          this.trigger_alert(true, 'Chapter berhasil diubah')
          this.updateChapter()
        })
        .catch(error => {
          // send flash message
          this.trigger_alert(true, `Gagal membuat chapter, terjadi error ${error.message}`)
        })

        this.updateDialog = false
        this.title = ''
        this.choosenChapter = ''
    },
    trigger_alert(status, message) {
      this.alert.value = true
      this.alert.status = status
      this.alert.message = message
      // `event` is the native DOM event
      window.setTimeout(() => {
        this.alert.value = false;
      }, 3000)    
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