<template>
  <v-container class="view-profile" fluid>
    <v-row align="center" justify="center">
       <v-col cols="2 pl-0">
        <v-card flat class="navDrawer left my-5 ml-0" color="#F1EFE8">
          <v-navigation-drawer permanent expand-on-hover dark color="orange darken-2">
            <v-list nav>
              <v-list-item link>
                <v-list-item-icon>
                  <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Dashboard</v-list-item-title>
              </v-list-item>
              <v-list-item link>
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item>
              <v-list-item link>
                <v-list-item-icon>
                  <v-icon>mdi-android-messages</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Messages</v-list-item-title>
              </v-list-item>
              <v-list-item link>
                <v-list-item-icon>
                  <v-icon>mdi-bell-ring</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Notifications</v-list-item-title>
              </v-list-item>
              <v-list-item link>
                <v-list-item-icon>
                  <v-icon>mdi-heart</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Favourites</v-list-item-title>
              </v-list-item>
              <v-list-item link>
                <v-list-item-icon>
                  <v-icon>mdi-cog-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Settings</v-list-item-title>
              </v-list-item>
              <v-list-item link>
                <v-list-item-icon>
                  <v-icon>mdi-logout</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-card>
      </v-col>
      <v-col cols="10" lg="10" md="8">
        <v-card v-if="profile" class="mx-auto blue-grey mr-10 mt-5" flat id="employerProfile" max-width="600px">
          <v-list-item>
            <v-list-item-content>
              <div>
                <v-col cols="8">
                  <div class="caption grey--text text--lighten-1">Company Name</div>
                  <h3
                    class="font-weight-light white--text"
                  >{{ profile.companyName }}</h3>
                </v-col>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <div>
                <v-col cols="8">
                  <div class="caption grey--text text--lighten-1">Company Overview</div>
                  <div class="white--text">{{profile.companyOverview}}</div>
                </v-col>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <div>
                <v-col cols="8">
                  <div class="caption grey--text text--lighten-1">Company Vision</div>
                  <div class="white--text">{{profile.companyVision}}</div>
                </v-col>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <div>
                <v-col cols="8">
                  <div class="caption grey--text text--lighten-1">Company Values</div>
                  <div class="white--text">
                    <p class="text-justify">{{profile.companyValues}}</p>
                  </div>
                </v-col>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <div>
                <v-col cols="8">
                  <div class="caption grey--text text--lighten-1">Career Paths Offered</div>
                  <div class="white--text">
                    <p class="text-justify">{{profile.companyCareerPathsOffered.toString().replace(/,/g, ", ")}}</p>
                  </div>
                </v-col>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";

export default {
  name: "EmployerProfile",
  data() {
    return {
      employerUser: null,
      profile: null, 
    };
  },
  created() {
    let ref = db.collection("employerUsers");

    // get current user
    ref
      .where("user_id", "==", firebase.auth().currentUser.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          (this.employerUser = doc.data()), (this.employerUser.id = doc.id);
        });
      });

    //profile data
    ref
      .doc(this.$route.params.id)
      .get()
      .then(employerUser => {
        this.profile = employerUser.data();
        console.log(this.employerUser);
        console.log(this.profile);
      });
  }
};
</script>

<style>
.v-content__wrap {
  margin-left: -16px;
}
.v-main__wrap {
  background-color: #3e5769;
}

#employerProfile{
  margin: 0 !important;
  margin-top: 25px !important;
  margin-left: 100px !important;
}
@media screen and (max-width: 768px) {
  #profilePage {
    margin-left: 0px !important;
  }
}

</style>



