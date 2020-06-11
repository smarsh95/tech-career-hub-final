<template>
  <div class="jobDashboard">
    <v-container class="my-5">
      <v-card flat v-for="job in jobs" :key="job.jobTitle">
        <v-row row wrap :class="`pa-3 job ${job.status}`">
          <v-col cols="12" md="6">
            <div class="caption grey--text">Job Title</div>
            <div>{{ job.jobTitle }}</div>
          </v-col>
          <v-col xs="2">
            <div class="caption grey--text">Company Name</div>
            <div>{{ job.companyName }}</div>
          </v-col>
          <v-col xs="2">
            <div class="caption grey--text">Closing Date</div>
            <div>{{ job.due }}</div>
          </v-col>
          <v-col xs="2">
            <div>
              <v-btn color="light-blue" dark :class="`${job.status} white--text caption my-2`">{{job.status}}</v-btn>
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

export default {
  data() {
    return {
      jobs: []
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
.job {
  border-left: 4px solid lightblue;
}
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
</style>