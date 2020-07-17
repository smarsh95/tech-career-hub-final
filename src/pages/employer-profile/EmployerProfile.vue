<template>
  <div>
    <v-snackbar v-model="snackbar" :timeout="4000" top color="success">
      <span>All done! Your profile changes have been updated!</span>
      <v-btn text color="white" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-container class="view-profile" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" lg="12" md="10">
          <v-card
            v-if="profile"
            class="mx-auto mt-4 blue-grey"
            flat
            id="employerProfile"
            max-width="600px"
          >
            <div>
              <EmployerProfilePopup v-if="isOwner" @profileChanged="snackbar = true" />
            </div>
            <v-list-item>
              <v-list-item-content>
                <div>
                  <v-col cols="8">
                    <div class="caption grey--text text--lighten-1">Company Name</div>
                    <h3 class="font-weight-light white--text">{{ profile.companyName }}</h3>
                  </v-col>
                </div>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <div>
                  <v-col cols="8">
                    <div class="caption grey--text text--lighten-1">Company Location</div>
                    <h3 class="font-weight-light white--text">{{ profile.companyLocation }}</h3>
                  </v-col>
                </div>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <div>
                  <v-col cols="8">
                    <div class="caption grey--text text--lighten-1">Company Overview</div>
                    <h3 class="font-weight-light white--text">{{profile.companyOverview}}</h3>
                  </v-col>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div>
                  <v-col cols="8">
                    <div class="caption grey--text text--lighten-1">Company Vision</div>
                    <h3 class="font-weight-light white--text">{{profile.companyVision}}</h3>
                  </v-col>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div>
                  <v-col cols="8">
                    <div class="caption grey--text text--lighten-1">Company Values</div>
                    <h3 class="font-weight-light white--text">
                      <p class="text-justify">{{profile.companyValues}}</p>
                    </h3>
                  </v-col>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div>
                  <v-col cols="8">
                    <div class="caption grey--text text--lighten-1">Career Paths Offered</div>
                    <h3 class="font-weight-light white--text">
                      <p
                        class="text-justify"
                      >{{profile.companyCareerPathsOffered.toString().replace(/,/g, ", ")}}</p>
                    </h3>
                  </v-col>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";
import EmployerProfilePopup from "@/pages/employer-profile/EmployerProfilePopup.vue";

export default {
  name: "EmployerProfile",
  components: {
    EmployerProfilePopup
  },
  data() {
    return {
      employerUser: null,
      profile: null,
      snackbar: false,
      isOwner: false
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
          if (
            this.employerUser.id.toLowerCase() ==
            this.$route.params.id.toLowerCase()
          )
            this.isOwner = true;
        });
      })
      .then(() => {
        if (this.isOwner) {
          ref.doc(this.employerUser.id).onSnapshot(res => {
            this.profile = res.data();
          });
        } else {
          ref
            .doc(this.$route.params.id)
            .get()
            .then(employerUser => {
              this.profile = employerUser.data();
              console.log(this.employerUser);
              console.log(this.profile);
            });
        }
      });

    //profile data
  }
};
</script>

<style>
#employerProfile {
  font-family: sofia-pro-soft !important;
}
.v-content__wrap {
  margin-left: -16px;
}
.v-main__wrap {
  background-color: #3e5769;
}
</style>



