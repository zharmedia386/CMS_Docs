<template>
  <v-container style="color: #94a3b8;">
    <v-row v-if="!content">
        <v-col>
            <v-skeleton-loader
                type="heading, sentences, image, chip, paragraph, sentences, paragraph"
                dark
                class="skeleton-loader-portal"
            ></v-skeleton-loader>
        </v-col>
        <v-col class="col-3">
            <v-skeleton-loader
                type="heading, sentences, paragraph"
                dark
                class="skeleton-loader-portal"
            ></v-skeleton-loader>
        </v-col>
    </v-row>
    <v-row v-if="content">
        <v-col class="content ql-editor" v-html="content" ></v-col>
        <v-col class="toc col-3" v-show="!this.$vuetify.breakpoint.mobile">
            <div style="position: sticky; top: 76px" class="text-left">
                <h3 style="color: white; margin-bottom: 15px;">On This Section</h3>
                <ul style="padding: 0;">
                    <li v-for="section in innerSection" :key="section.id">
                        <a :href="'#' + section.id" v-if="section.tag === 'h1'"><strong>{{ section.title }}</strong></a>
                        <a :href="'#' + section.id" v-else style="padding-left: 20px;">{{ section.title }}</a>
                    </li>
                </ul>
            </div>
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
import $ from "jquery";

export default {
    data: () => ({
        id : null,
        title : "",
        content: "",
        innerSection: []
    }),
    created(){
        this.axios.get(`${this.$apiuri}/sections/${this.$route.params.id}`)
            .then(response => {
                this.content = response.data[0].content
                this.axios.get(`${this.$apiuri}/documentations/metadata`)
                    .then(res => {
                        document.title = response.data[0].title + " - " + res.data.title
                    })
            })
            .then(() => {
                const IDs = [];
                $("h1, h2").each(function() {
                    const id = "section-" + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
                    IDs.push({id: id, tag: this.localName, title: this.textContent})
                    $(this).nextUntil( "h1, h2" ).wrapAll( `<section id=${id}></section>` );
                    const el = $(this).next();
                    $(this).prependTo(el);
                    console.log(this)
                });
                this.innerSection = IDs;
            })
        
    }
}
</script>

<style src="quill/dist/quill.snow.css"></style>
<style>
.content{
    text-align: left;
}

.content > pre{
    padding: 10px 15px 10px 15px;
    background-color: rgba(0, 0, 0, 0.875);
    border-radius: 5px;
    color: yellowgreen;
    font-family: "Consolas";
    font-size: 13px;
    white-space: pre-wrap;  
}

.skeleton-loader-portal > div {
    margin-bottom: 20px;;
}

.v-skeleton-loader__image {
    height: 300px;
}

.toc ul li {
    list-style: none;
}

.toc ul li a{
    text-decoration: none;
    color: #94a3b8;
}
</style>