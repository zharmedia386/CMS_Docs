<template>
  <v-container>
    <v-card>
        <v-card-title></v-card-title>
    </v-card>
  </v-container>
</template>

<script>
export default {
    data(){
        return {
            chapters : [
                {
                    title : "Getting started",
                    icon : "mdi-pencil"
                },
                {
                    title : "Customize",
                    icon : "mdi-pencil"
                },
                {
                    title : "Layout",
                    icon : "mdi-pencil"
                }
            ],
            sections : [
                {
                    title : "",
                    version : ""
                }
            ]
        }
    }

}
</script>

<style>

</style>