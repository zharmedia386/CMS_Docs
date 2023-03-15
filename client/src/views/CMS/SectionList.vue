<template>
  <v-container>
    <!-- <v-card>
      <v-card-title class="d-flex justify-space-between px-5 light-blue lighten-4 font-weight-bold">
        Sections List
        <v-btn class="blue darken-4 white--text" to="/cms/section/create">Create New Section</v-btn>
      </v-card-title>
      <br>
      <v-card-text class="d-flex justify-space-between px-5 font-weight-medium black--text" v-for="(section, index) in sections" v-bind:key="index">
        <v-card-subtitle v-text="`${section.title} ${section.alias ? '- ' + section.alias : ''}`"></v-card-subtitle>
        <div>
          <v-btn class="light-blue lighten-4 mr-1" outlined fab small :to="`/cms/section/${section._id}`"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn class="red lighten-2" outlined fab small @click="deleteSection(section._id)"><v-icon>mdi-delete</v-icon></v-btn>
        </div>
      </v-card-text>
    </v-card> -->
    <v-card class="section-header elevation-0" dark>
      <v-card-title class="d-flex justify-space-between pa-0">
        <v-text-field dense outlined placeholder="Search..." class="search-input"  v-model="searchKeyword"></v-text-field>
        <v-btn 
          to="/cms/section/create"
          color="#939AFF"
          class="black--text d-flex align-start flex-column"
        >
          <v-icon class="mr-2">mdi-plus</v-icon>
          Add New
        </v-btn>
      </v-card-title>
    </v-card>

    <div class="section-list">
      <div v-if="filteredSection.length === 0">
        <v-card variant="tonal" class="section-card table-responsive mb-3" dark>
          <span>No result found</span>
        </v-card>
      </div>
      <v-card variant="tonal" class="section-card table-responsive mb-3" dark v-for="(section, index) in (searchKeyword) ? filteredSection: cloneItems" v-bind:key="index">
        <table style="width: 100%;">
          <tr>
            <td>
              <span>Section Title:</span>
              <p>{{ section.title }} {{ section.alias ? '- ' + section.alias : '' }}</p>
            </td>
            <td>
              <span>Last Updated:</span>
              <p><span>{{ new Date(section.updatedAt) | moment("from", "now") }}</span></p>
            </td>
            <td>
              <span>Author:</span>
              <p>Fauzi</p>
            </td>
            <td>
              <span>Actions:</span>
              <div>
                <v-btn class="edit-btn tonal mr-2" rounded color="warning" :to="`/cms/section/${section._id}`"><v-icon class="mr-2">mdi-pencil</v-icon>Edit</v-btn>
                <v-btn class="delete-btn tonal" rounded color="error" @click="deleteSection(section._id)"><v-icon class="mr-2">mdi-delete</v-icon>Delete</v-btn>
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
      class="section-pagination"
    ></v-pagination>
  </v-container>
</template>

<script>
export default {
  props : ['message', 'status'],
  data(){
    return {
      sections: [],
      pagination: {
        page: 1,
        total: 0,
        rowsPerPage: 5
      },
      searchKeyword: ''
    }
  },
  methods :{
    deleteSection(id){
      let header = {
        'Authorization' : "Bearer " + localStorage.token
      }
      this.axios.delete(`${this.$apiuri}/sections`, { data : { id }, headers : header })
        .then(res => {
          console.log(res)
          this.$root.SnackBar.show({ message: res.data.message, color: 'success', icon: 'mdi-check-circle' })
          this.getSections()
        })
        .catch(err => {
          if(err.response.status == 401){
                localStorage.removeItem('token')
                this.$router.push({
                  name: "login",
                  params : {
                    message : "Invalid session",
                    status : true,
                    msgtype : 'error'
                  }
                })
              }
          this.$root.SnackBar.show({ message: err.message, color: 'error', icon: 'mdi-close-circle' })
        })
    },
    getSections(){
      this.axios.get(`${this.$apiuri}/sections`)
      .then(response => {
        this.sections = response.data
        this.pagination.total = this.sections.length
      })
    }
  },
  computed: {
    pages () {
      return Math.ceil(this.pagination.total / this.pagination.rowsPerPage)
    },
    cloneItems() {
        var clone = JSON.parse(JSON.stringify(this.sections));
        var startFrom = (this.pagination.page*this.pagination.rowsPerPage)-this.pagination.rowsPerPage;
        return clone.splice(startFrom, this.pagination.rowsPerPage);
    },
    filteredSection() {
      return this.sections.filter((section) =>
        section.title.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    }
  },
  created(){
    if(this.status){
      this.$root.SnackBar.show({ message: this.message, color: 'success', icon: 'mdi-check-circle' })
    }
    this.getSections()
  }
}
</script>

<style scoped>
button {
  text-transform: none;
  font-weight: bold;
}

.section-header {
  margin: 0 50px;
  background-color: var(--primary-dark);
}
.section-header button {
  margin-bottom: 14px;
}
.section-header .search-input {
  max-width: 300px;
  min-width: 100px;
  margin-top: 12px;
}

.section-list {
    overflow-x: auto;
    margin: 0 50px;
  }
  .section-card {
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