<template>
  <v-app class="teal darken-3">
    <v-container>
      <div class="candidateChart">
        <v-row justify="center" align="center">
          <v-col lg="12">
            <h1 class="display-1 text-center white--text">My Skills</h1>
          </v-col>
        </v-row>
        <v-row class="pt-6">
          <v-col sm="12" md="6">
            <div>
              <v-card class="pa-2">
                <v-form ref="form" @submit.prevent="submit">
                  <div class="px-4 pb-2 pt-4 text-left">
                    <v-subheader
                      class="font-weight-medium blue-grey--text text--darken-2"
                    >Your Skills</v-subheader>
                    <v-text-field v-model="skill" label="Enter a Skill"></v-text-field>
                  </div>
                  <div class="px-4 py-2">
                    <v-subheader
                      class="font-weight-medium blue-grey--text text--darken-2"
                    >Add Experience Level (1: Little Experience, 5: Very Experienced):</v-subheader>
                    <v-radio-group v-model="experienceLevel" id="experienceLevel">
                      <v-radio v-for="n in 5" :key="n" :label="`${n}`" :value="n"></v-radio>
                    </v-radio-group>
                  </div>
                  <div class="pa-4 text-center">
                    <v-btn color="primary" type="submit">Add Skill</v-btn>
                  </div>
                </v-form>
                <div class="pa-4">
                  <p class="red--text text-center" id="error">test</p>
                </div>
              </v-card>
            </div>
          </v-col>
          <v-col sm="12" md="5" offset-md="1">
            <div class="canvas"></div>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";
import * as d3 from "d3";
import { legendColor } from 'd3-svg-legend';

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
        if(this.skills == undefined){
          this.skills = [{
            skill: this.skill,
            experienceLevel: this.experienceLevel
          }]
        }else{
          this.skills.push({
            skill: this.skill,
            experienceLevel: this.experienceLevel
          })
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
      const dims = { height: 300, width: 300, radius: 150 };
      const cent = { x: dims.width / 2 + 5, y: dims.height / 2 + 5 };

      const svg = d3
        .select(".canvas")
        .append("svg")
        .attr("width", dims.width + 150)
        .attr("height", dims.height + 150);

      const graph = svg
        .append("g")
        .attr("transform", `translate(${cent.x}, ${cent.y})`);

      const pie = d3
        .pie()
        .sort(null)
        .value(d => d.experienceLevel);

      const arcPath = d3
        .arc()
        .outerRadius(dims.radius)
        .innerRadius(dims.radius / 2);

      const colour = d3.scaleOrdinal(d3['schemeSet1'])

      //legend setup 
      const legendGroup = svg.append('g')
        .attr('transform', `translate(${dims.width + 40}, 10)`)

      const legend = legendColor()
        .shape('circle')
        .shapePadding(10)
        .scale(colour)

      const arcTweenEnter = (d) => {
            var i = d3.interpolate(d.endAngle, d.startAngle)

            return function(t){
              d.startAngle = i(t)
              return arcPath(d)
            }
          }
      
      const arcTweenExit = (d) => {
            var i = d3.interpolate(d.endAngle, d.startAngle)

            return function(t){
              d.startAngle = i(t)
              return arcPath(d)
            }
          }

      // event handlers 
      const handleMouseOver = (d, i, n) => {
        //console.log(n[i])
        d3.select(n[i])
          .transition('changeSliceFill').duration(300)
            .attr('fill', '#fff');
      }

      const handleMouseOut = (d,i,n) => {
        d3.select(n[i])
          .transition('changeSliceFill').duration(300)
          .attr('fill', colour(d.data.name))
      }


      // use function keyword to allow use of 'this'
      function arcTweenUpdate(d){
        //interpolate between the two objects 
        var i = d3.interpolate(this._current, d)
        // update the current prop with new updated data 
        this._current = i(1)

        return function(t){
          return arcPath(i(t))
        }
      }

      //update function
      const update = data => {

        //update colour scale domain
        
        colour.domain(data.map(d => d.skill)); 

        //update and call legend 
        legendGroup.call(legend)
        legendGroup.selectAll('text').attr('fill', 'white')

        //join enhanced (pie) data to path elements
        const paths = graph.selectAll("path").data(pie(data));

        console.log(pie(data))

        //handle the exit selection 
        paths.exit()
        .transition().duration(750)
        .attrTween('d', arcTweenExit)
        .remove();

        //handle the current DOM path updates
        paths.attr('d', arcPath)
          .transition().duration(750)
            .attrTween('d', arcTweenUpdate)

        paths
          .enter()
          .append("path")
          .attr("class", "arc")
          .attr("stroke", "#fff")
          .attr("stroke-width", 3)
          .attr("fill", d => colour(d.data.skill))
          .each(function(d){ this._current = d})
          .transition().duration(750)
            .attrTween("d", arcTweenEnter);
      

      //add events 
      graph.selectAll('path')
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)

      };

      //data array and firesotre
      //var data = [];

      db.collection("candidateUsers")
        .where("user_id", "==", firebase.auth().currentUser.uid)
        .get()
        .then(snapshot => {
          snapshot.forEach(document => {
            let username = document.get("username")
            this.skills = document.get("skills")
            db.collection("candidateUsers").doc(username).onSnapshot(res => {
              this.skills = res.get("skills")
              //this.skills = this.skills
              update(this.skills)
              
            })
             update(this.skills)
          })  
        })
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
          //this.generateChart();
        });
      });
  }
};
</script>

<style>

</style>