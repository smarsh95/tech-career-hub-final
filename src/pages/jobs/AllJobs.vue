<template>
  <div class="jobDashboard">
    <v-container class="my-5">
      <v-card v-for="job in jobs" :key="job.jobTitle" class="my-4 mx-2" color="#2F4858">
        <v-row row wrap :class="`py-3 px-6 job ${job.status}`">
          <v-col cols="12" md="6" lg="6">
            <div class="caption grey--text font-weight-bold text-uppercase">Job Title</div>
            <div class="white--text">{{ job.jobTitle }}</div>
          </v-col>
          <v-col xs="2">
            <div class="caption grey--text font-weight-bold text-uppercase">Company Name</div>
            <div class="white--text">{{ job.companyName }}</div>
          </v-col>
          <v-col xs="2">
            <div class="caption grey--text font-weight-bold text-uppercase">Closing Date</div>
            <div class="white--text">{{ job.due }}</div>
          </v-col>
          <v-col xs="2">
            <div>
              <!--v-btn color="blue" dark :class="`${job.status} caption my-2`">{{job.status}}</v-btn-->
              <JobInfoPopup :job="job"/>
            </div>
          </v-col>
          <v-col xs="2">
            <div>
              <v-btn class="mx-2 my-1" fab dark small color="pink">
                <v-icon dark>mdi-heart</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import db from "@/firebase/init";
import JobInfoPopup from "@/pages/jobs/JobInfoPopup.vue";

export default {
  components: {
        JobInfoPopup
      },
  data() {
    return {
      jobs: [],
    };
  },
  created() {
    db.collection("jobs").onSnapshot(res => {
      const changes = res.docChanges();
      changes.forEach(change => {
        if (change.type === "added") {
          this.jobs.push({
            ...change.doc.data(),
            id: change.doc.id
          });
        }
      });
    });
  }
};
</script>

<style>
.project.ongoing {
  border-left: 4px solid orange;
}
.project.overdue {
  border-left: 4px solid tomato;
}
.v-chip.view {
  background: lightblue !important;
}
.v-chip.ongoing {
  background: #ffaa2c !important;
}
.v-chip.overdue {
  background: #fc5c65 !important;
}
.v-main__wrap {
  background-color: #78909c;
}
</style>