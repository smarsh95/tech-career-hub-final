<template>
  <nav>
    <v-app-bar flat app>
      <v-app-bar-nav-icon class="grey--text" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase grey--text">
        <span class="font-weight-light">Tech Wizard</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!user" :to="{ name: 'SignupCandidate' }" text color="grey">
        <span class="font-weight-regular">Sign Up</span>
      </v-btn>
      <v-btn v-if="!user" :to="{ name: 'Login' }" text color="grey">
        <span class="font-weight-regular">Login</span>
      </v-btn>
      <v-btn v-if="user">
        <a>{{ user.email }}</a>
      </v-btn>
      <v-btn v-if="user">
        <a @click="logout">Logout</a>
      </v-btn>

    </v-app-bar>

    <v-navigation-drawer temporary v-model="drawer" app color="primary">
      <v-row>
        <v-col class="mt-5">
          <v-list class="navDrawer">
            <v-list-item
              v-for="link in links"
              :key="link.text"
              router
              :to="link.route"
              class="ml-2"
            >
              <v-list-item-content class="white--text mt-0 ml-6 left display-3">
                <v-list-item-title class="">{{ link.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import firebase from 'firebase'
export default {
  data() {
    return {
      user: null,
      drawer: false,
      links: [
        { text: "Explore Tech Careers", route: "/" },
        { text: "View Jobs", route: "/projects" },
        { text: "View Employers", route: "/team" },
        { text: "View Candidates", route: "/team" }
      ]
    };
  }, 
  methods: {
    logout() {
      firebase.auth().signOut.then(() => {
        this.$router.push({ name: 'Login'})
      })
    }
  }, 
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.user = user
      } else {
        this.user = null
      }
    })
  }
};
</script>

<style>
  .navDrawer{
    padding: 0px 0!important;
  }
</style>