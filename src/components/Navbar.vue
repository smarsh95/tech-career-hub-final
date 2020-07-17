<template>
  <nav class="body">
    <v-app-bar flat app color="#F1EFE8">
      <v-app-bar-nav-icon v-if="user" class="grey--text" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase white--text">
        <router-link class="routerLink" :to="{name: 'Home'}">
          <span class="font-weight-light grey--text darken-5 d-none d-sm-flex ml-3 logo">Tech Wizard</span>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- dropdown menu -->
      <v-menu offset-y v-if="user">
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on" color="#4b696f" class="btnFont">
            <v-icon left>mdi-expand_more</v-icon>
            <span>Menu</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="subLink in subLinksToDisplay"
            :key="subLink.text"
            router
            :to="subLink.route"
          >
            <v-list-item-title>{{ subLink.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn text v-if="!user" :to="{ name: 'SignupCandidate' }">
        <span class="blue-grey--text">Sign Up</span>
      </v-btn>
      <v-btn text v-if="!user" :to="{ name: 'Login' }">
        <span class="blue-grey--text">Login</span>
      </v-btn>
      <v-btn text v-if="user" class>
        <a>{{ user.email }}</a>
      </v-btn>
      <v-btn text v-if="user">
        <a @click="logout">Logout</a>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer temporary v-model="drawer" v-if="user" app color="#4b696f">
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
              <v-list-item-content
                class="white--text mt-0 ml-6 left display-2 font-weight-light text-uppercase"
              >
                <v-list-item-title>{{ link.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";

export default {
  name: "Navbar",

  data() {
    return {
      user: null,
      userData: null,
      drawer: false,
      links: [],
      //
      candidateLinks: [
        { text: "Home", route: "/"},
        { text: "Tech Careers", route: "/techCareers" },
        { text: "View Tech Jobs", route: "/allJobs" },
        { text: "View Employers", route: "/allEmployers" }
      ],
      employerLinks: [
        { text: "Home", route: "/"},
        { text: "View Candidates", route: "/allCandidates" }
        ],
      subLinksCandidates: [
        { text: "My Profile", route: "/candidateProfile/:id" },
        { text: "My Skills", route: "/CandidateChart/" },
        { text: "My Favourite Jobs", route: "/candidateFavouriteJobs"},
         { text: "My Favourite Employers", route: "/candidateFavouriteEmployers"}
      ],
      subLinksEmployers: [
        { text: "Company Profile", route: "/EmployerProfile/:id" },
        { text: "My Jobs", route: "/EmployerMyJobs/:id" }
      ],
      subLinksToDisplay: [],
      snackbar: false
    };
  },
  watch: {
    $route(to, from) {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.user = user;
          this.loadSubLinks();
        } else {
          this.user = null;
        }
      });
      console.log(to);
      console.log(from);
    }
  },
  methods: {
    /**
     * loadSubLinks: This method loads the correct menu links depending on the user type 
     */
    loadSubLinks() {
      //variable that references the appropriate database collection depending on the user type
      let ref;

      //depending on the user role, the correct sublinks (specific to user) and menu links(specific to user type) are set to display for the user 
      this.getRole().then(role => {
        if (role == "candidate") {
          this.subLinksToDisplay = this.subLinksCandidates; // store relevant sublinks in the sublinks which will be displayed to the user
          ref = db.collection("candidateUsers");            // set ref variable for candidate user type
          this.links = this.candidateLinks;                 // store relevant menu links in the menu links which will be displayed to the user
        } else if (role == "employer") {
          this.subLinksToDisplay = this.subLinksEmployers;  // store relevant sublinks in the sublinks which will be displayed to the user
          ref = db.collection("employerUsers");             // set ref variable for employer user type
          this.links = this.employerLinks;                  // store relevant menu links in the menu links which will be displayed to the user
        }

        //get current user data from database
        ref
          .where("user_id", "==", firebase.auth().currentUser.uid)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              this.userData = doc.data();
              this.userData.id = doc.id;
            });
          })
          //set route for user for each sublink
          .then(() => {
            this.subLinksToDisplay.forEach(element => {
              element.route = element.route.replace(
                ":id",
                this.userData.id
              );
            });
          });
      });
    },
    /**
     * gets user role from ID Token (using custom claims set on signup)
     */
    getRole() {
      return new Promise(resolve => {
        firebase
          .auth()
          .currentUser.getIdTokenResult()
          .then(idTokenResult => {
            if (idTokenResult.claims.candidate) {
              resolve("candidate");
            } else if (idTokenResult.claims.employer) {
              resolve("employer");
            }
          });
      });
    },
    //user can logout using firebase auth, once logged out the user will be redirected to login page
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ name: "Login" });
        });
    }
  },
  //checking if the user is logged in
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        this.loadSubLinks(); //if user is logged in, execute loadSubLinks() method to display correct links
      } else {
        this.user = null;
      }
    });
  }
};
</script>



<style>
.body {
  font-family: sofia-pro-soft !important;
  font-weight: 400; 
  font-style: normal;
}
.navDrawer {
  padding: 0px 0 !important;
}

.routerLink {
  text-decoration: none;
}

.logo{
  font-family: roboto; 
}

.btnFont{
  font-family: sofia-pro-soft !important;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
}
</style>



