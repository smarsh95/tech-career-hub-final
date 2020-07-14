<template>
<div>
  <v-snackbar v-model="snackbar" :timeout="4000" top color="success">
      <span>All done! Your profile changes have been updated!</span>
      <v-btn text color="white" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  <v-container class="view-profile" fluid>
      <v-col cols="12" lg="12" md="12">
        <v-card v-if="profile" class="mx-auto mt-4 blue-grey" id="profilePage" max-width="600px" flat>
         <div>
              <!--v-btn color="blue" dark :class="`${job.status} caption my-2`">{{job.status}}</v-btn-->
              <CandidateProfilePopup @profileChanged="snackbar = true"/>
            </div>
          <v-list-item>
            <v-list-item-content>
              <div>
                <v-col cols="8">
                  <div class="caption grey--text text--lighten-1">Name</div>
                  <h3
                    class="font-weight-light white--text"
                  >{{ profile.firstName + " " + profile.lastName }}</h3>
                </v-col>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <div>
                <v-col cols="8">
                  <div class="caption grey--text text--lighten-1">Top Skills</div>
                  <h3 class="font-weight-light white--text">{{profile.topSkills}}</h3>
                </v-col>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <div>
                <v-col cols="8">
                  <div class="caption grey--text text--lighten-1">Bio</div>
                  <h3 class="font-weight-light white--text">{{profile.bio}}</h3>
                </v-col>
              </div>
            </v-list-item-content>
          </v-list-item>
           <v-list-item>
            <v-list-item-content>
              <div>
                <v-col cols="8">
                  <div class="caption grey--text text--lighten-1">Location</div>
                  <h3 class="font-weight-light white--text">{{profile.location}}</h3>
                </v-col>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <div>
                <v-col cols="8">
                  <div class="caption grey--text text--lighten-1">Work Experience</div>
                  <h3 class="font-weight-light white--text">
                    <p class="text-justify">{{profile.workExperience}}</p>
                  </h3>
                </v-col>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <div>
                <v-col cols="8">
                  <div class="caption grey--text text--lighten-1">Age</div>
                  <h3 class="font-weight-light white--text">
                    <p class="text-justify">{{profile.age}}</p>
                  </h3>
                </v-col>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <div>
                <v-col cols="8">
                  <div class="caption grey--text text--lighten-1">Desired Career Paths</div>
                  <h3 class="font-weight-light white--text">
                    <p class="text-justify">{{profile.careerPaths.toString().replace(/,/g, ", ")}}</p>
                  </h3>
                </v-col>
              </div>
            </v-list-item-content>
          </v-list-item>
           <v-list-item>
            <v-list-item-content>
              <div>
                <v-col cols="8">
                  <div class="caption grey--text text--lighten-1">Available From:</div>
                  <h3 class="font-weight-light white--text">
                    <p class="text-justify">{{profile.due}}</p>
                  </h3>
                </v-col>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
  </v-container>
  </div>
</template>

  <!--v-row align="center" justify="center">
          <v-col cols="8">
            <div class="caption grey--text">Top Skills</div>
            <div>{{profile.topSkills}}</div>
          </v-col>
        </v-row>
         <v-row align="center" justify="center">
          <v-col cols="8">
            <div class="caption grey--text">Bio</div>
            <div>{{profile.bio}}</div>
          </v-col>
        </v-row>
         <v-row align="center" justify="center">
          <v-col cols="8">
            <div class="caption grey--text">Age</div>
            <div>{{profile.age}}</div>
          </v-col>
        </v-row-->

<script>
import firebase from "firebase";
import db from "@/firebase/init";
import CandidateProfilePopup from "@/pages/candidate-profile/CandidateProfilePopup.vue";

export default {
  name: "CandidateProfile",
  components: {
    CandidateProfilePopup
  },
  data() {
    return {
      candidateUser: null,
      profile: null, 
      snackbar: false
    };
  },
  created() {
    let ref = db.collection("candidateUsers");

    // get current user
    ref
      .where("user_id", "==", firebase.auth().currentUser.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          (this.candidateUser = doc.data()), (this.candidateUser.id = doc.id);
        });
      }).then(() => {
        ref.doc(this.candidateUser.id).onSnapshot( res => {
          this.profile = res.data()
        });
      });

    //profile data
    ref
      .doc(this.$route.params.id)
      .get()
      .then(candidateUser => {
        this.profile = candidateUser.data();
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
</style>



