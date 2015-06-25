/*
Kirsten de Wit
6063098
Programmerproject Data
*/

"use strict";

var margin = {top: 30, right: 20, bottom: 30, left: 100},
    width = 1100 - margin.left - margin.right,
    height = 310 - margin.top - margin.bottom;

// setup x
var x;

// setup y
var y = d3.scale.ordinal()
    .rangePoints([height, 0])
    .domain(["", "Alzheimer", "Depressie", "Epilepsie", "Huntington", "Parkinson"]);

// setup x-axis
var xAxis = d3.svg.axis()
    .orient("bottom")
    .ticks(20)
    .tickFormat(d3.format(",d"));

//setup y-axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var graph_div = d3.select(".graph");

// add graph container to the webpage
var svg = graph_div.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// setup tooltip
var tooltip = graph_div.append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Add a background rectangle for mousemove
svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .style("opacity", 0);


//append y-axis
svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em");

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

  d3.select("[name=al]").on("click", function() {
    graph1(data, "al"); 
    d3.selectAll("[type=button]").style("background", "" ); 
    d3.select("[name=al]").style("background", "#E9967A" );
  });
  d3.select("[name=AD]").on("click", function() {
    graph1(data, "AD"); 
    d3.selectAll("[type=button]").style("background", "" ); 
    d3.select("[name=AD]").style("background", "#E9967A" );
  });
  d3.select("[name=DP]").on("click", function() {
    graph1(data, "DP"); 
    d3.selectAll("[type=button]").style("background", "" ); 
    d3.select("[name=DP]").style("background", "#E9967A" );
  });
  d3.select("[name=EP]").on("click", function() {
    graph1(data, "EP"); 
    d3.selectAll("[type=button]").style("background", "" ); 
    d3.select("[name=EP]").style("background", "#E9967A" );
  });
  d3.select("[name=HD]").on("click", function() {
    graph1(data, "HD"); 
    d3.selectAll("[type=button]").style("background", "" ); 
    d3.select("[name=HD]").style("background", "#E9967A" );
  });
  d3.select("[name=PD]").on("click", function() {
    graph1(data, "PD"); 
    d3.selectAll("[type=button]").style("background", "" ); 
    d3.select("[name=PD]").style("background", "#E9967A" );
  });
  d3.select("[name=normal]").on("click", function() {
    graph2(data); 
    d3.selectAll("[type=button]").style("background", "" ); 
    d3.select("[name=normal]").style("background", "#E9967A" );
  });

  graph1(data, 'al');

});

// moving graph
function graph1(data, disease_key) {
  
  // remove dots and x-axis
  d3.select("g.dots").remove();
  d3.select("g.x.axis").remove();

  //setup x-axis
  var x = d3.fisheye.scale(d3.scale.linear)
  .domain([0.35, 23.2009])
  .range([0, width]);

  xAxis.scale(x);

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

  //draw circles and add tooltip with information
  var dot = svg.append("g")
        .attr("class", "dots")
      .selectAll(".dot")
        .data(data)
      .enter().append("ellipse")
      .filter(function(d) {return d[disease_key] > 0})
        .attr("class", "dot")
        .attr("rx", 2.75)
        .attr("ry", function(d) {return d.rank *  -1 + 24})
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
                .style("opacity", .0);
        });

      svg.on("mousemove", function() {
        var mouse = d3.mouse(this);
        x.distortion(3).focus(mouse[0]);

        dot.call(position);
        svg.select(".x.axis").call(xAxis);
    });
    // dot position
  function position(dot) {
        dot .attr("cx", function(d) { return x(d.chromosome); })
            .attr("cy", function(d) { return y(d["disease"]); })
            .attr("rx", 2.75)
            .attr("ry", function(d) {return d.rank * -1 + 24});
      }
};

// static graph
function graph2 (data) {

  // remove dots and x-axis
  d3.select("g.dots").remove();
  d3.select("g.x.axis").remove();

  // setup x-axis
  var x = d3.scale.linear()
    .domain([0.35, 23.2009])
    .range([0, width]);

  xAxis.scale(x);

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

  // no mousemove
  svg.on("mousemove", null);

  // draw circles and add tooltip with information
  var dot = svg.append("g")
      .attr("class", "dots")
    .selectAll(".dot")
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
};