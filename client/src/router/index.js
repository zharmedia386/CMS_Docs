import Vue from 'vue'
import VueRouter from 'vue-router'
import DocsView from '../views/Documentation/DocsView.vue'
import CMSView from '../views/CMS/CMSView.vue'
import SectionView from '../views/Documentation/SectionView.vue'
import SectionList from '../views/CMS/SectionList.vue'
import ChapterList from '../views/CMS/ChapterList.vue'
import AppInfo from '../views/CMS/AppInfo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'docs',
    component: DocsView,
    children: [
      {
        path: 'docs/:section',
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
        name: 'sectionlist',
        component: SectionList
      },
      {
        path: 'chapter',
        name : 'chapterlist',
        component: ChapterList
      },
      {
        path: 'appinfo',
        name: 'appinfo',
        component: AppInfo
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
