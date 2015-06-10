"use strict";

var margin = {top: 20, right: 20, bottom: 30, left: 100},
    width = 1100 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.ordinal()
    .rangePoints([height, 0])
    .domain(["", "Alzheimer", "Depressie", "Epilepsie", "Huntington", "Parkinson"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(20)
    .tickFormat(d3.format("s"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var fisheye = d3.fisheye.circular()
    .radius(200)
    .distortion(2);

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv("braindiseases.csv", function(error, data) {
  data.forEach(function(d) {
    d.chromosome = +d.chromosome;
  });
  
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

var xDomain = d3.extent(data, function(d) { return d.chromosome; })
var yDomain = d3.extent(data, function(d) { return d["disease"]; });

x.domain(d3.extent(data, function(d) { return d.chromosome; }));

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

svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3)
      .attr("cx", function(d) { return x(d.chromosome); })
      .attr("cy", function(d) { return y(d["disease"]); })
      .style("fill", function(d){
            var colorFunction = colorMappings[d["disease"]];
            return colorFunction(d["rank"])
          })
      /*.on("mousemove", function() {
          //console.log("test");
          fisheye.focus(d3.mouse(this));});
          dot.each(function(d) { d.fisheye = fisheye(d); })
              .attr("cx", function(d) { return d.fisheye.x; })
              .attr("cy", function(d) { return d.fisheye.y; })
              .attr("r", function(d) { return d.fisheye.z * 4.5; })*/
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(250)
               .style("opacity", .9);
          tooltip.html("Gene: " + d["gene"] + "<br/>" )
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