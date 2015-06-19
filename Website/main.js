/*
Kirsten de Wit
6063098
Programmerproject Data
*/

"use strict";

// Set the margins
var margin = {top: 20, right: 20, bottom: 30, left: 100},
    width = 1100 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// setup x
var x = d3.fisheye.scale(d3.scale.linear)
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
    .tickFormat(d3.format(",d"));

//setup y-axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// add graph to the webpage
var svg = d3.select(".graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// setup tooltip
var tooltip = d3.select(".graph").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Add a background rectangle for mousemove
svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .style("opacity", 0);

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
      .attr("transform", function(d) {
                return "rotate(-45)" 
                })

// setup colorscale
var colorMappings = {
  "Alzheimer": d3.scale.linear()
    .domain([1, 20])
    .range(["#f77165", "#fefbfb"]),
  "Depressie": d3.scale.linear()
    .domain([1, 20])
    .range(["#7ba8ce", "#fcfdfe"]),
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

function redraw(data, position, disease_key) {
  // draw circles and add tooltip with information
  d3.select('g.dots').remove();

  var dot = svg.append("g")
        .attr("class", "dots")
      .selectAll(".dot")
        .data(data)
      .enter().append("ellipse")
      .filter(function(d) {return d[disease_key] > 0})
        .attr("class", "dot")
        .attr("rx", 2.5)
        .attr("ry", function(d) {return d.rank *  -0.75 + 18.75})
        .style("fill", function(d){
              var colorFunction = colorMappings[d["disease"]];
              return colorFunction(d["rank"])
            })
        .call(position)
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

      svg.on("mousemove", function() {
        var mouse = d3.mouse(this);
        x.distortion(2.5).focus(mouse[0]);

        dot.call(position);
        svg.select(".x.axis").call(xAxis);
    });
};


// load data and convert string to number
d3.csv("braindiseases.csv", function(error, data) {
  data.forEach(function(d) {
    d.chromosome = +d.chromosome;
    d.rank = +d.rank;
    d.AD = +d.AD;
    d.DP = +d.DP;
    d.EP = +d.EP;
    d.HD = +d.HD;
    d.PD = +d.PD;
    d.al = +d.al;
  });
  
  // Filter function for diseases
  redraw(data, position, 'al');
  d3.select("[name=al]").on("click", function() {redraw(data, position, 'al');});
  d3.select("[name=AD]").on("click", function() {redraw(data, position, 'AD');});
  d3.select("[name=DP]").on("click", function() {redraw(data, position, 'DP');});
  d3.select("[name=EP]").on("click", function() {redraw(data, position, 'EP');});
  d3.select("[name=HD]").on("click", function() {redraw(data, position, 'HD');});
  d3.select("[name=PD]").on("click", function() {redraw(data, position, 'PD');});

  // dot position
  function position(dot) {
        dot .attr("cx", function(d) { return x(d.chromosome); })
            .attr("cy", function(d) { return y(d["disease"]); })
            .attr("rx", 2.5)
            .attr("ry", function(d) {return d.rank * -0.75 + 18.75});
      }



});