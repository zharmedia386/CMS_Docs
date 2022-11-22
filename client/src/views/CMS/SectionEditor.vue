<template>
  <v-form @submit.prevent="saveData()">
    <v-container>
      <v-alert
        :value="alert.value"
        :type="alert.status ? 'success' : 'error'"
        transition="slide-y-transition"
      >{{ alert.message }}</v-alert>
      <v-card>
        <v-card-title>Section Title</v-card-title>
        <v-text-field
          v-model="title"
          placeholder="Input Title"
          class="pl-5 pr-5"
        ></v-text-field>
      </v-card>
      <v-select
          v-model="choosenVersion"
          :items="versions"
          outlined
          @change="updateChapterList()"
          placeholder="Choose Version"
          class="mt-6"
      ></v-select>
      <v-select
          v-model="choosenChapter"
          :items="chapters"
          item-text="title"
          return-object
          outlined
          placeholder="Choose Chapters"
      ></v-select>
      <div class="my-8" v-html="content"></div>
      <vue-editor v-model="content"></vue-editor>
      <v-btn type="submit">Save</v-btn>
    </v-container>
  </v-form>
</template>

<script>
import { VueEditor } from "vue2-editor";
export default {
  components: {
    VueEditor
  },
  data(){
    return {
      alert: {value: false, status: true, message: ''},
      versions: [],
      chapters: [],
      content : "",
      title : "",
      choosenVersion: '',
      choosenChapter: {}
    }
  },
  methods: {
    saveData(){
      const section = {
        title: this.title,
        content: this.content,
        chapter: this.choosenChapter,
        version: [ this.choosenVersion ]
      }

      console.log(JSON.stringify(section))
      this.axios.post(`${this.$apiuri}/sections`, section)
        .then(response => {
          // send flash message
          console.log(response.data)
          this.trigger_alert(true, 'Section berhasil dibuat')
        })
        .catch(error => {
          // send flash message
          this.trigger_alert(true, `Terjadi error ${error.message}`)
        })
    },
    updateChapterList(){
      this.axios.get(`${this.$apiuri}/documentations/${this.choosenVersion}`)
        .then(response => {
          // update chapter list within version
          this.chapters = response.data[0].content[0].chapter.map(ch => ({ '_id': ch._id, 'title': ch.title }))

          // clear current selected chapter
          this.choosenChapter = ''
        }).catch(message => {
            console.log(message)
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
  beforeCreate(){
    if(this.$route.params.id != "create"){
      this.axios.get(`${this.$apiuri}/sections/${this.$route.params.id}`)
        .then(response => {
          this.content = response.data[0].content
          this.title = response.data[0].title
        })
    }

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