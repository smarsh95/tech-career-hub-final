
<template>
  <v-container>
    <div class="candidateChart">
      <v-row justify="center" align="center">
        <v-col lg="12">
          <h1 class="display-1 text-center">My Skills</h1>
        </v-col>
      </v-row>
      <v-row class="pt-6">
        <v-col sm="12" md="6" class="ma-3">
          <div>
            <v-card class="pa-2">
              <v-form ref="form" @submit.prevent="submit">
                <div class="px-4 text-left">
                  <v-subheader class="font-weight-medium blue-grey--text text--darken-2">Your Skills</v-subheader>
                  <v-text-field v-model="skill" label="Enter a Skill"></v-text-field>
                </div>
                <div class="px-4">
                  <v-subheader
                    class="font-weight-medium blue-grey--text text--darken-2"
                  >Add Experience Level (1: Little Experience, 5: Very Experienced):</v-subheader>
                  <v-radio-group v-model="experienceLevel" id="experienceLevel">
                    <v-radio v-for="n in 5" :key="n" :label="`${n}`" :value="n"></v-radio>
                  </v-radio-group>
                </div>
                <div class="pa-4 mb-2 text-center">
                  <v-btn color="primary" type="submit">Add Skill</v-btn>
                </div>
              </v-form>
            </v-card>
          </div>
        </v-col>
        <v-col sm="12" md="5" offset-md="1" class="ma-3">
          <div class="canvas mt-6 insideChart"></div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";
import * as d3 from "d3";
import { legendColor } from "d3-svg-legend";
export default {
  data() {
    return {
      candidateUser: null,
      profile: null,
      experienceLevel: null,
      skill: "",
      skills: []
    };
  },
  mounted() {
    this.generateChart();
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        if (this.skills == undefined) {
          this.skills = [
            {
              skill: this.skill,
              experienceLevel: this.experienceLevel
            }
          ];
        } else {
          this.skills.push({
            skill: this.skill,
            experienceLevel: this.experienceLevel
          });
        }
        db.collection("candidateUsers")
          .doc(this.candidateUser.id)
          .update({ skills: this.skills })
          .then(() => {
            this.loading = false;
            this.$emit("moreskillsAdded");
            console.log("Document successfully updated");
          });
      }
    },
    generateChart() {
      console.log("generateChart");
      const dimensions = { height: 300, width: 300, radius: 150 };
      const cent = { x: dimensions.width / 2 + 5, y: dimensions.height / 2 + 5 };
      const svg = d3
        .select(".canvas")
        .append("svg")
        .attr("width", dimensions.width + 200)
        .attr("height", dimensions.height + 150)
      const graph = svg
        .append("g")
        .attr("transform", `translate(${cent.x}, ${cent.y})`);
      const pie = d3
        .pie()
        .sort(null)
        .value(d => d.experienceLevel);
      const arcPath = d3
        .arc()
        .outerRadius(dimensions.radius)
        .innerRadius(dimensions.radius / 2);
      const colour = d3.scaleOrdinal(d3["schemeSet2"]);
      //legend setup
      const legendGroup = svg
        .append("g")
        .attr("transform", `translate(${dimensions.width + 40}, 10)`);
      const legend = legendColor()
        .shape("circle")
        .shapePadding(10)
        .scale(colour);
      //update function
      const update = data => {
        if (data == undefined) return;
        //update colour scale domain
        colour.domain(data.map(d => d.skill));
        //update and call legend
        legendGroup.call(legend);
        legendGroup.selectAll("text").attr("fill", "#2F4858");
        //join enhanced (pie) data to path elements
        const paths = graph.selectAll("path").data(pie(data));
        console.log(pie(data));
        //handle the exit selection
        paths
          .exit()
          .transition()
          .duration(750)
          .attrTween("d", arcTweenExit)
          .remove();
        //handle the current DOM path updates
        paths
          .transition()
          .duration(750)
          .attrTween("d", arcTweenUpdate);
        paths
          .enter()
          .append("path")
          .attr("class", "arc")
          .attr("stroke", "#fff")
          .attr("stroke-width", 3)
          .attr("fill", d => colour(d.data.skill))
          .each(function(d) {
            this._current = d;
          })
          .transition()
          .duration(750)
          .attrTween("d", arcTweenEnter);
        //add events
        graph
          .selectAll("path")
          //.on("mouseover", handleMouseOver)
          //.on("mouseout", handleMouseOut);
        //.on('click', handleClick)
      };
      //data array and firesotre
      //var data = [];
      db.collection("candidateUsers")
        .where("user_id", "==", firebase.auth().currentUser.uid)
        .get()
        .then(snapshot => {
          snapshot.forEach(document => {
            let username = document.get("username");
            this.skills = document.get("skills");
            db.collection("candidateUsers")
              .doc(username)
              .onSnapshot(res => {
                this.skills = res.get("skills");
                //this.skills = this.skills
                update(this.skills);
              });
            update(this.skills);
          });
          update(this.skills);
        });
      const arcTweenEnter = d => {
        var i = d3.interpolate(d.endAngle, d.startAngle);
        return function(t) {
          d.startAngle = i(t);
          return arcPath(d);
        };
      };
      const arcTweenExit = d => {
        var i = d3.interpolate(d.endAngle, d.startAngle);
        return function(t) {
          d.startAngle = i(t);
          return arcPath(d);
        };
      };
      // use function keyword to allow use of 'this'
      function arcTweenUpdate(d) {
        //interpolate between the two objects
        var i = d3.interpolate(this._current, d);
        // update the current prop with new updated data
        this._current = i(1);
        return function(t) {
          return arcPath(i(t));
        };
      }
      /* event handlers
      const handleMouseOver = (d, i, n) => {
        //console.log(n[i])
        d3.select(n[i])
          .transition("changeSliceFill")
          .duration(300)
          .attr("fill", "#fff");
      };
      const handleMouseOut = (d, i, n) => {
        d3.select(n[i])
          .transition("changeSliceFill")
          .duration(300)
          .attr("fill", colour(d.data.skill));
      };*/
    }
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
          //console.log(this.candidateUser.id);
          //console.log(this.candidateUser.skills);
          if (!this.candidateUser.skills) {
            console.log("There are no skills listed yet");
            this.skills = [];
          } else {
            this.skills = this.candidateUser.skills;
          }
        });
      });
  }
};
</script>

<style>
.v-subheader {
  padding: 0 !important;
}
.v-text-field {
  padding-top: 0 !important;
}
.v-main__wrap {
  background-color: #3e5769;
}
h1 {
  color: #4B696F !important;
}
.chart {
  border-radius: 25px;
}
</style>

