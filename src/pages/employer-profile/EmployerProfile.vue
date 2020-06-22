<template>
  <v-container class="view-profile" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="10" md="8">
        <v-card v-if="profile" class="mx-auto blue-grey" flat>
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
                    <!--p class="text-justify">{{profile.careerPaths.toString().replace(/,/g, ", ")}}</p-->
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

</style>



