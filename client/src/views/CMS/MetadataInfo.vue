<template>
  <v-container>
    <v-card class="mx-auto">
        <v-card-title>Metadata</v-card-title>
          <v-row

            justify="space-between"
          >
            <v-col
              cols="12"
              md="6"
            >
              <v-form class="ml-10" ref="form">
                <v-text-field
                  v-model="model"
                  :counter="max"
                  :rules="rules"
                  label="Title"
                ></v-text-field>
              </v-form>

                <v-file-input class="ml-10"
                  accept="image/*"
                  label="Logo"
                ></v-file-input>

              <v-form class="ml-10" ref="form">
                <v-text-field
                  v-model="model"
                  :counter="max"
                  :rules="rules"
                  label="Github Link"
                ></v-text-field>
              </v-form>
            </v-col>


        </v-row>
      
    </v-card>
  </v-container>

</template>



<script>
export default {
  
}
</script>

<style>

</style>