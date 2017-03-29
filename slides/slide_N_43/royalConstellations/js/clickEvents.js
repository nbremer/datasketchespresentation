///////////////////////////////////////////////////////////////////////////
////////////////////////////// Click events ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

function clickedOnNode(d) {

  //Hide the tooltip
  tooltipWrapper.style("opacity", 0);

  if(!clickLocked) {

    clickLocked = true;
    startNode = d;

    //Show the title above the first clicked person
    firstClickedName.text(d.name);
    firstClickedTitle.text(d.title);
    var labelOffset = d.title === "" ? 10 : 25;
    firstClickNodeWrapper
      .attr("transform", "translate(" + d.x + "," + (d.y - labelOffset) + ")")
      .style("opacity", 1)
      .transition().duration(400)
      .attr("transform", "translate(" + d.x + "," + (d.y - labelOffset - 15) + ")");

    //Show the rotating circle on the clicked person
    clickedCircle
      .attr("cx", d.x)
      .attr("cy", d.y)
      .transition().duration(300)
      .style("opacity", 1);

  } else {

    endNode = d;

    //Place rotating circle over newly clicked person
    clickedCircleEnd
      .attr("cx", d.x)
      .attr("cy", d.y)
      .transition().duration(300)
      .style("opacity", 1);

    //Show the title above the clicked person to which the path will be drawn
    pathClickedName.text(d.name);
    pathClickedTitle.text(d.title);
    var labelOffset = d.title === "" ? 10 : 25;
    pathClickNodeWrapper
      .attr("transform", "translate(" + d.x + "," + (d.y - labelOffset) + ")")
      .style("opacity", 1)
      .transition().duration(400)
      .attr("transform", "translate(" + d.x + "," + (d.y - labelOffset - 15) + ")");

    setTimeout( function() {
      //Find the shortest route
      route = sp.findRoute(startNode.id, endNode.id);
      //Highlight the route
      highlightRoute(route.path);
    }, 310);

    pathLocked = true;

  }//else

  //Stop propagation to the SVG
  d3.event.stopPropagation();

}//clickedOnNode

function highlightRoute(path) {

  var distanceNum = 1;
  var dur = 200;

  //Make all nodes in route bright and visual and rest transparent
  var nodesInPath = path.map(function(d) { return d.source; });
  nodesInPath = nodesInPath.concat( path.map(function(d) { return d.target; }) );
  nodesInPath = uniq(nodesInPath);

  d3.selectAll(".node-pulse")
    .transition().duration(dur)
    .style("stroke", function(o) { return nodesInPath.indexOf(o.id) > -1 ? colorScale(distanceNum) : colorScale(1000); })
    .style("opacity", function(o) { return nodesInPath.indexOf(o.id) > -1 ? opacityScaleHover(distanceNum) : 0; });
       
  d3.selectAll(".node")
    .transition().duration(dur)
    .style("fill", function(o) { return nodesInPath.indexOf(o.id) > -1 ? colorScale(distanceNum) : colorScale(1000); })
    .style("opacity", function(o) { return nodesInPath.indexOf(o.id) > -1 ? opacityScaleHover(distanceNum) : 0.1; });

  //Highlight title if (interesting) royal
  labelWrapper.selectAll(".royal-label, .interesting-royal-label")
      .transition().duration(dur)
      .style("opacity", function(l,i) { return nodesInPath.indexOf(l.id) > -1 ? 1 : 0.1; });

  //Highlight the links between these nodes
  d3.selectAll(".link")
      .each(function(o) {           
          o.inPath = false;
          var closeSource = nodesInPath.indexOf(o.source.id),
              closeTarget = nodesInPath.indexOf(o.target.id);
          if (closeSource > -1 && closeTarget > -1) { o.inPath = true; }
      })
      .style("stroke-width", function(o) { return o.inPath ? 2 : 0.5; })
      .transition().duration(dur)
      .style("opacity", function(o) { return o.inPath ? 0.7 : 0.01; });

}//highlightRoute

function clickedToNormal() {

  //Remove the rotating white stroked circles
  d3.selectAll(".node-clicked")
    .transition().duration(300)
    .style("opacity", 0);

  //Free the mouseover events
  clickLocked = false;
  pathLocked = false;

  //Hide the titles
  firstClickNodeWrapper
    .transition("transp").duration(100)
    .style("opacity", 0);
  pathClickNodeWrapper
    .transition("transp").duration(100)
    .style("opacity", 0);

  //Reset the visual
  mouseOut();

}//clickedToNormal