/*
Kirsten de Wit
6063098
Programmerproject Data
*/

"use strict";

d3.select("[name=normal]").on("click", function() {
    d3.select(".graph *").remove();
    draw(); 
    d3.selectAll("[type=button]").style("background", "" ); 
    d3.select("[name=normal]").style("background", "#E9967A" );
});

function draw(){

  // Set the margins
  var margin = {top: 30, right: 20, bottom: 30, left: 100},
      width = 1100 - margin.left - margin.right,
      height = 310 - margin.top - margin.bottom;

  // setup x
  var x = d3.scale.linear()
      .range([0, width])
      .domain([0.35, 23.2009]);

  // setup y
  var y = d3.scale.ordinal()
      .rangePoints([height, 0])
      .domain(["", "Alzheimer", "Depressie", "Epilepsie", "Huntington", "Parkinson"]);

  // setup x-axis
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .ticks(20)
      .tickFormat(d3.format("s"));

  //setup y-axis
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  // add graph to body of webpage
  var svg = d3.select(".graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // setup tooltip
  var tooltip = d3.select(".graph").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // load data and convert string to number
  d3.csv("braindiseases.csv", function(error, data) {
    data.forEach(function(d) {
      d.chromosome = +d.chromosome;
    });
    
    // setup colorscale
    var colorMappings = {
      "Alzheimer": d3.scale.linear()
        .domain([1, 20])
        .range(["#f77165", "#fde1df"]),
      "Depressie": d3.scale.linear()
        .domain([1, 20])
        .range(["#7ba8ce", "#ebf2f8"]),
      "Epilepsie": d3.scale.linear()
        .domain([1, 20])
        .range(["#9ad78c", "#fefffe"]),
      "Huntington": d3.scale.linear()
        .domain([1, 20])
        .range(["#be99ca", "#fefdfe"]),
      "Parkinson": d3.scale.linear()
        .domain([1, 20])
        .range(["#fdb95a", "#fff9f2"])
    }

    // append x-axis
    svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", -6)
          .style("text-anchor", "end")
          .text("Chromosoom");

    //append y-axis
    svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")

    // draw circles and add tooltip with information
    d3.select('g.dots').remove();

    svg.selectAll(".dot")
          .data(data)
        .enter().append("ellipse")
          .attr("class", "dot")
          .attr("cx", function(d) { return x(d.chromosome); })
          .attr("cy", function(d) { return y(d["disease"]); })
          .attr("rx", 2.75)
          .attr("ry", function(d) {return d.rank *  -1 + 24})
          .style("fill", function(d){
                var colorFunction = colorMappings[d["disease"]];
                return colorFunction(d["rank"])
              })
          .on("mouseover", function(d) {
              tooltip.transition()
                   .duration(250)
                   .style("opacity", .9);
              tooltip.html("Gene: " + d["gene"] + "<br/>" + "Rank: " + d.rank + "<br/>")
                  .style("left", function(d){
                    if (d3.event.pageX < 720){
                      return ((d3.event.pageX + 5) + "px");
                    }
                    else{
                      return ((d3.event.pageX - 250) + "px");
                    }
                  })
                  .style("top", (d3.event.pageY - 28) + "px")   
              tooltip.append('a')
                    .attr("href", d["information"])
                    .text(d["information"]);
          })
          .on("mouseout", function(d) {
              tooltip.transition()
                   .duration(5000)
                   .style("opacity", 0);
          });

  });
  }