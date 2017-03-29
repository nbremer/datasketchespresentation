///////////////////////////////////////////////////////////////////////////
///////////////////////////// Create legend ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

function createLegend(hoverColors, colorScale, interestingRoyalColor) {

  var margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  };
  var width = 480 - margin.left - margin.right;
  var height = 130 - margin.top - margin.bottom;
        
  //SVG container
  var svg = d3.select('#legend')
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");

  ///////////////////////////////////////////////////////////////////////////
  ////////////////////// Create (interesting) royals ////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  var circleLegendData = [
    {radius: 10, radiusStroke: 18, color: colorScale(0), offset: 20, label: "Current royal leader"},
    {radius: 6, radiusStroke: 14, color: interestingRoyalColor, offset: 65, label: "Famous royal"},
    {radius: 3, radiusStroke: 0, color: colorScale(2), offset: 100, label: "Other people"},
  ]

  svg.selectAll(".node-pulse-legend")
    .data(circleLegendData.filter(function(d) { return d.radiusStroke > 0; }))
    .enter().append("circle")
    .attr("class", "node-pulse-legend pulse")
    .attr("cx", 20)
    .attr("cy", function(d) { return d.offset; })
    .attr("r", function(d) { return d.radiusStroke; })
    .style("stroke", function(d) { return d.color; })
    .style("filter","url(#glow-intense)");

  svg.selectAll(".node-legend")
    .data(circleLegendData)
    .enter().append("circle")
    .attr("class", "node-legend")
    .attr("cx", 20)
    .attr("cy", function(d) { return d.offset; })
    .attr("r", function(d) { return d.radius; })
    .style("fill", function(d) { return d.color; })
    .style("filter","url(#glow)");

  svg.selectAll(".legend-node-text")
    .data(circleLegendData)
    .enter().append("text")
    .attr("class", "legend-node-text")
    .attr("x", 45)
    .attr("y", function(d) { return d.offset; })
    .attr("dy", "0.4em")
    .text(function(d) { return d.label; });

  ///////////////////////////////////////////////////////////////////////////
  //////////////////////// Create link differences //////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  var linkDistance = 90;

  var linkLegendLeft = svg.append("g").attr("class", "link-legend-wrapper")
    .attr("transform", "translate(" + (width/2) + "," + 20 + ")");

  linkLegendLeft.selectAll(".link-circle-legend.left")
    .data([0,1])
    .enter().append("circle")
    .attr("class", "link-circle-legend left")
    .attr("cx", function(d,i) { return i*linkDistance; })
    .attr("r", 3)
    .style("fill", colorScale(2))
    .style("filter","url(#glow)");

  linkLegendLeft.append("path")
    .attr("class", "link-path-legend")
    .attr( "d", function ( d ) {
          var dr = linkDistance;
          return [ "M", 0, 0, "A", dr, dr, "0 0 1", linkDistance, 0 ].join( " " );
    });

  linkLegendLeft.append("text")
    .attr("class", "legend-link-text")
    .attr("x", linkDistance/2)
    .attr("y", 25)
    .text("parent - child");

  var linkLegendRight = svg.append("g").attr("class", "link-legend-wrapper")
    .attr("transform", "translate(" + (width - linkDistance - 7) + "," + 20 + ")");

  linkLegendRight.selectAll(".link-circle-legend.right")
    .data([0,1])
    .enter().append("circle")
    .attr("class", "link-circle-legend right")
    .attr("cx", function(d,i) { return i*linkDistance; })
    .attr("r", 3)
    .style("fill", colorScale(2))
    .style("filter","url(#glow)");

  linkLegendRight.append("path")
    .attr("class", "link-path-legend link-couple")
    .attr( "d", function ( d ) {
          var dr = linkDistance;
          return [ "M", 0, 0, "A", dr, dr, "0 0 1", linkDistance, 0 ].join( " " );
    });

  linkLegendRight.append("text")
    .attr("class", "legend-link-text")
    .attr("x", linkDistance/2)
    .attr("y", 25)
    .text("husband - wife");

  ///////////////////////////////////////////////////////////////////////////
  /////////////////////// Create hover color legend /////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  //Container for the gradients
  var defs = svg.append("defs");

  //Create the gradient for the colored ancestry steps bar
  defs.append("linearGradient")
    .attr("id", "gradient-color")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", width/2).attr("y1", "0%")
    .attr("x2", width).attr("y2", "0%")
    .selectAll("stop") 
    .data(hoverColors)                
    .enter().append("stop") 
    .attr("offset", function(d,i) { return i / (hoverColors.length-1); })   
    .attr("stop-color", function(d,i) { return d; });

  var colorHoverLegendWrapper = svg.append("g").attr("class", "color-legend-wrapper")
    .attr("transform", "translate(" + (width/2) + "," + (height - 20) + ")");

  svg.append("path")
    .attr("class", "legend-color-path")
    .attr("d", "M" + (width/2) + "," + (height - 20) + " L " + width + "," + (height - 20))
    .style("stroke", "url(#gradient-color)")
    .style("stroke-dasharray", "0 16")
    .style("stroke-width", 8);

  colorHoverLegendWrapper.append("text")
    .attr("class", "legend-color-text")
    .attr("x", width/4)
    .attr("y", 20)
    .text("degrees of separation (on hover)");

  colorHoverLegendWrapper.append("text")
    .attr("class", "legend-color-value")
    .attr("x", -5)
    .attr("y", 21)
    .text("1");

  colorHoverLegendWrapper.append("text")
    .attr("class", "legend-color-value")
    .attr("x", width/2 - 4)
    .attr("y", 21)
    .style("text-anchor", "end")
    .text("6");

}//createLegend