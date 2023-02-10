import { defineStore } from "pinia";
import axios from 'axios';

export const useDocumentationStore = defineStore({
    id: "documentationStore",
    state: () => ({
        documentation: null,
        selectedVersion: null,
        metadata: null,
        loading: false,
        error: null
    }),
    getters: {
        getVersions: (state) => {
            return state?.documentation?.content.map(content => content.version);
        },
        getContentInVersion: (state) => {
            return (version) => state.documentation.content.filter((ct) => ct.version == version)[0].chapter
        }
    },
    actions: {
        async fetchData() {
            this.loading = true;

            try {
                const response = await axios.get('http://localhost:3500/documentations');

                // set all documentations data
                this.documentation = response.data[0];

                // set first version of the documentaion as default
                this.selectedVersion = response.data[0]?.content[0]?.version

                // set metadata
                this.metadata = {
                    title: this.documentation.title,
                    logo: this.documentation.logo,
                    footer: this.documentation.footer,
                    githubLink: this.documentation.githubLink
                }
            } catch (error) {
                this.error = error;          
            } finally {
                this.loading = false;
            }
        }
    }
})