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
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/newMessage', 
      name: NewMessage, 
      component: NewMessage, 
      meta: {
        requiresAuth: true
      }
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
      meta: {
        requiresAuth: true
      }
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
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/CandidateProfileForm',
      name: 'CandidateProfileForm',
      component: CandidateProfileForm, 
      meta: {
        requiresAuth: true
      }
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
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/CandidateFavouriteJobs', 
      name: 'CandidateFavouriteJobs', 
      component: CandidateFavouriteJobs, 
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/CandidateFavouriteEmployers', 
      name: 'CandidateFavouriteEmployers', 
      component: CandidateFavouriteEmployers, 
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/AllEmployers', 
      name: 'AllEmployers', 
      component: AllEmployers, 
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/EmployerProfile/:id',
      name: 'EmployerProfile',
      component: EmployerProfile,
      meta: {
        requiresAuth: true
      }
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
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/EmployerMyJobs/:id', 
      name: 'EmployerMyJobs', 
      component: EmployerMyJobs, 
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/EmployerMap', 
      name: 'EmployerMap', 
      component: EmployerMap, 
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/candidateProfile/:id', 
      name: 'CandidateProfile', 
      component: CandidateProfile, 
      meta: {
        requiresAuth: true
      }

    }, 
    {
      path: '/AllJobs', 
      name: 'AllJobs', 
      component: AllJobs, 
      meta: {
        requiresAuth: true
      }
    }, 
    {
      path: '/candidateMap', 
      name: 'CandidateMap', 
      component: CandidateMap, 
      meta: {
        requiresAuth: true
      }
    }, 
    {
      path: '/candidateMatches', 
      name: 'CandidateMatches', 
      component: CandidateMatches, 
      meta: {
        requiresAuth: true
      }
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
