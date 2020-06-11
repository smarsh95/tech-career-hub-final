import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/home/Home.vue'
import Login from '@/pages/auth/Login.vue'
import CandidateProfile from '@/pages/candidate-profile/CandidateProfile.vue'
import CandidateProfileForm from '@/pages/candidate-profile/CandidateProfileForm.vue'
import SignupCandidate from '@/pages/auth/SignupCandidate.vue'
import SignupEmployer from '@/pages/auth/SignupEmployer.vue'
import Employer from '@/pages/employer-profile/Employer.vue'
import AllJobs from '@/pages/jobs/AllJobs.vue'
import firebase from 'firebase'


Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
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
      path: '/Employer',
      name: 'Employer',
      component: Employer,
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
      path: '/profile/:id', 
      name: CandidateProfile, 
      component: CandidateProfile
    }, 
    {
      path: '/AllJobs', 
      name: AllJobs, 
      component: AllJobs
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
