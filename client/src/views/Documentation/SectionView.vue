<template>
  <div>
    <SectionLoader v-if="!content" />
    <SectionContent v-if="content" :content="content" />
  </div>
</template>

<script>
import SectionLoader from "@/components/portal/SectionLoader.vue";
import SectionContent from "@/components/portal/SectionContent.vue";
import SectionService from "@/services/SectionService";

export default {
    props: {
        title: String
    },
    components: {
        SectionLoader,
        SectionContent
    },
    data: () => ({
        content: ""
    }),
    methods: {
        async loadSection(){
            try {
                // Get section data
                const id = this.$route.params.id;
                const response = await SectionService.getSectionById(id);
                this.content = response.data[0].content
                // Set tab with format << section title - documentation title >>
                document.title = await response.data[0].title + " - " + this.title
            } catch (error) {
                this.$root.SnackBar.show({ message: "An error occurred when displaying section", color: 'error', icon: 'mdi-close-circle' })
            }
        }
    },
    created(){
        this.loadSection()
    }
}
</script>

<style src="quill/dist/quill.snow.css"></style>

<style>

</style>