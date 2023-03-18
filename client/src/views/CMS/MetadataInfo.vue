<template>
  <v-container>
    <h1 class="text-containerh1 mb-3">
      Metadata Settings
    </h1>
    <v-divider :thickness="4" class="border-opacity-100" color="white" dark>
    </v-divider>
    <div>
      <v-row>
        <v-col cols="4" class="mt-15 ml-8 text-container">
          <span>Logo Picture</span>
        </v-col>
        <v-col cols="1" class="mt-8">
          <div>
            <label for="input-file">
              <div class="circle">
                <img :src="metadata.logo" />
                <div class="placeholder">
                  Choose an image
                </div>
              </div>
            </label>
            <v-file-input id="input-file" accept="image/*" prepend-icon="mdi-camera" class="camera-input"
              @change="getBase64()" />
          </div>
        </v-col>
      </v-row>
    </div>
    <v-row>
      <v-col cols="4" class="mt-4 ml-8 text-container">
        <span>Title</span>
      </v-col>

      <v-col cols="7" class="mt-1">
        <v-text-field id="input-title" v-model="metadata.title" :rules="rules.title" dark outlined required solo-inverted>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" class="mt-4 ml-8 text-container">
        <span>Github Link</span>
      </v-col>
      <v-col cols="7" class="mt-1">
        <v-text-field id="input-github-link" v-model="metadata.githubLink" :rules="rules.githubLink" dark outlined
          required solo-inverted>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col dark cols="4" class="mt-4 ml-8 text-container">
        <span dark solo-inverted>
          Footer
        </span>
      </v-col>
      <v-col cols="7" class="mb-12" solo-inverted>
        <vue-editor id="input-footer" v-model="metadata.footer"></vue-editor>
      </v-col>
    </v-row>
    <v-divider :thickness="4" class="border-opacity-100 mt-8" color="white" dark></v-divider>
    <div class="d-flex justify-end">
      <v-btn id="form-submit" type="button" class="mt-3 mr-6 colorbtn" @click="updateMetadata">
        Save Changes
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import { VueEditor } from "vue2-editor";
import DocumentationService from "@/services/DocumentationService";

export default {
  components: {
    VueEditor
  },
  data() {
    return {
      metadata: {
        title: "",
        logo: null,
        footer: "",
        githubLink: "",
        username: "",
        image: null
      },
      rules: {
        title: [
          v => !!v || "Title is required",
          v => (v && v.length >= 4) || "Title must be 4 characters at least"
        ],
        logo: [
          v => !!v || "Logo is required"
        ],
        githubLink: [
          v => !!v || "Github link is required"
        ],
        username: [
          v => !!v || "Username is required",
          v => (v && v.length >= 4) || "Username must be 4 characters at least"
        ]
      }
    }
  },
  methods: {
    getBase64() {
      const base64 = new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(this.metadata.logo);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      })
      base64
        .then(res => {
          this.metadata.logo = res
        })
        .catch(err => {
          console.log(err)
        })
    },
    async updateMetadata() {
      const metadata = this.metadata;
      try {
        const response = await DocumentationService.updateMetadata(metadata);
        this.$root.SnackBar.show({ message: response.data.message, color: 'success', icon: 'mdi-check-circle' })
      } catch (error) {
        this.$root.SnackBar.show({ message: error.message, color: 'error', icon: 'mdi-close-circle' })
      }
    },
    async getMetadata() {
      try {
        const response = await DocumentationService.getMetadata()
        this.metadata = response.data
      } catch (error) {
        this.$root.SnackBar.show({ message: "Failed to fetch metadata", color: 'error', icon: 'mdi-close-circle' })
      }
    }
  },
  created() {
    this.getMetadata()
  }
}
</script>

<style>
.text-container {
  text-align: left;
  color: #ffffff;
}

.text-containerh1 {
  text-align: left;
  color: #939aff;
}

.bgc {
  color: #8B949E !important;
  background-color: #8B949E dark !important;
}

.colorbtn {
  background-color: #939AFF !important;
  color: black;

}

.colorbtn1 {
  background-color: var(--primary-dark) !important;
  color: white !important;

}

.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  background-color: white;
}

.circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #ccc;
  background-color: #f5f5f5;
}
#input-file {
  position: absolute;
  left: -99999px;
}

label[for="input-file"] {
  cursor: pointer;
}

.camera-input .v-icon.mdi.mdi-camera {
  margin-bottom: 60px;
  margin-left: 155px;
  background-color: #FF00D6;
  border-radius: 50px;
  padding: 8px;
}

.vue-editor--wrapper {
  background-color: white !important;
}

.vue-editor--wrapper:focus {
  background-color: white;
}
</style>
