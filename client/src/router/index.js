import Vue from 'vue'
import VueRouter from 'vue-router'
import DocsView from '../views/Documentation/DocsView.vue'
import CMSView from '../views/CMS/CMSView.vue'
import SectionView from '../views/Documentation/SectionView.vue'
import SectionList from '../views/CMS/SectionList.vue'
import ChapterList from '../views/CMS/ChapterList.vue'
import Metadata from '../views/CMS/MetadataInfo.vue'
import SectionEditor from '../views/CMS/SectionEditor.vue'
import Versioning from '../views/CMS/VersioningEditor.vue'
import Login from '../views/Auth/LoginView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'docs',
    component: DocsView,
    children: [
      {
        path: 'docs/:id',
        name: 'section',
        component: SectionView
      }
    ]
  },
  {
    path: '/cms',
    name: 'cms',
    component: CMSView,
    children: [
      {
        path: 'section',
        name: 'sectionList',
        component: SectionList,
        props : true
      },
      {
        path: 'section/:id',
        name: 'sectionEditor',
        component: SectionEditor
      },
      {
        path: 'chapter',
        name : 'chapterList',
        component: ChapterList
      },
      {
        path: 'metadata',
        name: 'metadata',
        component: Metadata
      },
      {
        path: 'version',
        name: 'version',
        component: Versioning
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
