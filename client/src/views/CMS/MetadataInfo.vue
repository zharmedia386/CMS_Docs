<template>
  <v-form @submit.prevent="saveData()">
    <v-container>
      <v-alert
        :value="alert.value"
        :type="alert.status ? 'success' : 'error'"
        transition="slide-y-transition"
      >{{ alert.message }}</v-alert>
      <v-card class="mx-auto">
        <v-card-title>Metadata</v-card-title>
          <v-row
            justify="space-between"
          >
            <v-col
              cols="12"
              md="6"
            >
                <v-text-field
                  class="ml-10"
                  v-model="title"
                  label="Title"
                ></v-text-field>
                <v-file-input 
                  class="ml-10"
                  v-model="logo"
                  accept="image/*"
                  label="Logo"
                ></v-file-input>
                <v-text-field
                  class="ml-10"
                  v-model="logoLink"
                  label="Github Link"
                ></v-text-field>
                <v-text-field
                  class="ml-10"
                  v-model="footer"
                  label="Footer"
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row>
          <v-btn type="submit" class="ml-10 mb-5">
            Submit
          </v-btn>
        </v-row>
      </v-card>
    </v-container>
  </v-form>
</template>


<script>
export default {
  data(){
    return {
      alert: {value: false, status: true, message: ''},
      title: "",
      logo: "",
      logoLink: "",
      footer: "",
    }
  },
  methods: {
    saveData(){
      const metadata = {
        title: this.title,
        logo: this.logo,
        logoLink: this.logoLink,
        footer: this.footer,
      }

      console.log(JSON.stringify(metadata))
      this.axios.post(`${this.$apiuri}/documentations/metadata`, metadata)
        .then(response => {
          // send flash message
          console.log(response.data)
          this.trigger_alert(true, 'Metadata berhasil dibuat')
        })
        .catch(error => {
          // send flash message
          this.trigger_alert(true, `Terjadi error ${error.message}`)
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
    this.axios.get(`${this.$apiuri}/documentations/metadata`)
      .then(response => {
          this.title = response.data[0].title
          this.logo = response.data[0].logo
          this.logoLink = response.data[0].logoLink
          this.footer = response.data[0].footer
        })
  }
}
</script>

<style>

</style>