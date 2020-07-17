import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/home/Home.vue'
import Login from '@/pages/auth/Login.vue'
import AllCandidates from '@/pages/candidate-profile/AllCandidates.vue'
import CandidateMenu from '@/pages/candidate-profile/CandidateMenu.vue'
import CandidateProfile from '@/pages/candidate-profile/CandidateProfile.vue'
import CandidateProfileForm from '@/pages/candidate-profile/CandidateProfileForm.vue'
import SignupCandidate from '@/pages/auth/SignupCandidate.vue'
import SignupEmployer from '@/pages/auth/SignupEmployer.vue'
import AllEmployers from '@/pages/employer-profile/AllEmployers.vue'
import EmployerProfile from '@/pages/employer-profile/EmployerProfile.vue'
import EmployerProfileForm from '@/pages/employer-profile/EmployerProfileForm.vue'
import EmployerMyJobs from '@/pages/employer-profile/EmployerMyJobs.vue'
import EmployerMap from '@/pages/employer-profile/EmployerMap.vue'
import AllJobs from '@/pages/jobs/AllJobs.vue'
import CandidateMap from '@/pages/candidate-profile/CandidateMap.vue'
import CandidateChart from '@/pages/candidate-profile/d3/CandidateChart.vue'
import CandidateMatches from '@/pages/candidate-profile/CandidateMatches.vue'
import CandidateFavouriteJobs from '@/pages/candidate-profile/CandidateFavouriteJobs.vue'
import CandidateFavouriteEmployers from '@/pages/candidate-profile/CandidateFavouriteEmployers.vue'
import TechCareers from '@/pages/techCareers/TechCareers.vue'
import Messaging from '@/messaging/Messaging.vue'
import NewMessage from '@/messaging/NewMessage.vue'
import firebase from 'firebase'



Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/messaging',
      name: Messaging,
      component: Messaging,
    },
    {
      path: '/newMessage',
      name: NewMessage,
      component: NewMessage,
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/techCareers',
      name: 'TechCareers',
      component: TechCareers,
    },
    {
      path: '/about',
      name: 'About',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../pages/about/About.vue')
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/AllCandidates',
      name: 'AllCandidates',
      component: AllCandidates
    },
    {
      path: '/CandidateMenu',
      name: 'CandidateMenu',
      component: CandidateMenu,
    },
    {
      path: '/CandidateProfileForm',
      name: 'CandidateProfileForm',
      component: CandidateProfileForm,
    },
    {
      path: '/SignupCandidate',
      name: 'SignupCandidate',
      component: SignupCandidate,
    },
    {
      path: '/CandidateChart/',
      name: 'CandidateChart',
      component: CandidateChart,
    },
    {
      path: '/CandidateFavouriteJobs',
      name: 'CandidateFavouriteJobs',
      component: CandidateFavouriteJobs,
    },
    {
      path: '/CandidateFavouriteEmployers',
      name: 'CandidateFavouriteEmployers',
      component: CandidateFavouriteEmployers,
    },
    {
      path: '/AllEmployers',
      name: 'AllEmployers',
      component: AllEmployers,
    },
    {
      path: '/EmployerProfile/:id',
      name: 'EmployerProfile',
      component: EmployerProfile,
    },
    {
      path: '/SignupEmployer',
      name: 'SignupEmployer',
      component: SignupEmployer
    },
    {
      path: '/EmployerProfileForm',
      name: 'EmployerProfileForm',
      component: EmployerProfileForm,
    },
    {
      path: '/EmployerMyJobs/:id',
      name: 'EmployerMyJobs',
      component: EmployerMyJobs,
    },
    {
      path: '/EmployerMap',
      name: 'EmployerMap',
      component: EmployerMap,
    },
    {
      path: '/candidateProfile/:id',
      name: 'CandidateProfile',
      component: CandidateProfile,
    },
    {
      path: '/AllJobs',
      name: 'AllJobs',
      component: AllJobs,
    },
    {
      path: '/candidateMap',
      name: 'CandidateMap',
      component: CandidateMap,
    },
    {
      path: '/candidateMatches',
      name: 'CandidateMatches',
      component: CandidateMatches,
    }
  ]
})

router.beforeEach((to, from, next) => {
  // check to see if route requires auth
  if (to.matched.some(rec => rec.meta.requiresAuth)) {
    // check auth state of user 
    let user = firebase.auth().currentUser
    if (user) {
      // user signed in, proceed to route
      next()
    } else {
      // no user signed in, redirect to login 
      next({ name: 'Login' })
    }
  } else {
    next()
  }
})

export default router
