///////////////////////////////////////////////////////////////////////////
////////////////////////////// Mouse events ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

function mouseOvered(d, nodes) {

    stopMouseout = true;
    repeatSearch = true;
    clearTimeout(startSearch);

    //Don't show the tooltip over the locked nodes
    //these already have a title
    if(!clickLocked || (d.id !== startNode.id && d.id !== endNode.id)) {
      //Move the tooltip to the right location
      tooltipName.text(d.name);
      tooltipTitle.text(d.title);
      var tooltipOffset = d.title === "" ? 12 : 28;
      var isExtra = royalsInteresting.indexOf(d.id);
      if(isExtra > -1) {
        tooltipExtra
          .attr("y", d.title === "" ? 50 : 70)
          .style("opacity", 1)
          .text(interestingRoyal[isExtra].note)
          .call(wrap, 200);
      }//if
      tooltipWrapper
        .transition("move").duration(200)
        .attr("transform", "translate(" + d.x + "," + (d.y - tooltipOffset) + ")")
      tooltipWrapper
        .transition("transp").duration(200)
        .style("opacity", 1);
    }//if

    if(!clickLocked) {
      clearTimeout(connectionsLooper);
      startSearch = setTimeout(function() { 
        if(repeatSearch) initiateConnectionSearch(d, nodes); 
      }, 1000);
    }//if

    //Stop propagation to the SVG
    d3.event.stopPropagation();

    //console.log(d);
}//mouseOvered

function initiateConnectionSearch(d, nodes) {

    //After a earch a mouse out may run again
    doMouseOut = true;

    selectedNodes[d.id] = 0;
    selectedNodeIDs = [d.id];
    oldLevelSelectedNodes = [d.id];
    counter = 0    
    //Loop 6 times (as long as no mouseout was found) to find relatives
    findConnections(nodes, selectedNodes, selectedNodeIDs, oldLevelSelectedNodes, counter);

}//initiateConnectionSearch

//Loop once through all newly found relatives to find relatives one step further
function findConnections(nodes, selectedNodes, selectedNodeIDs, oldLevelSelectedNodes, counter) {

  if(counter === 0) { hideAllNodes(); }

  showNodes(selectedNodeIDs[0], oldLevelSelectedNodes, selectedNodeIDs, selectedNodes);

  if( repeatSearch && counter < 6 ) {
    var levelSelectedNodes = [];
    for(var k = 0; k < oldLevelSelectedNodes.length; k++) {
      //Request all the linked nodes
      var connectedNodes = linkedToID[oldLevelSelectedNodes[k]];
      //Take out all nodes already in the data
      connectedNodes = connectedNodes.filter(function(n) {
        return selectedNodeIDs.indexOf(n) === -1
      });
      //Place the left nodes in the data
      for(var l = 0; l < connectedNodes.length; l++) {
        var id = connectedNodes[l];
        selectedNodes[id] = counter+1;
        selectedNodeIDs.push(id);
        levelSelectedNodes.push(id);
      }//for l
    }//for k

    //Small timeout to leave room for a mouseout to run
    counter += 1;

    oldLevelSelectedNodes = uniq(levelSelectedNodes);
    connectionsLooper = setTimeout(function() { findConnections(nodes, selectedNodes, selectedNodeIDs, oldLevelSelectedNodes, counter); }, 200);
  } else if( repeatSearch && counter >= 6) {
    //If done show the results
    //showNodes(selectedNodeIDs[0], oldLevelSelectedNodes, selectedNodeIDs, selectedNodes);
    stopMouseout = false;
  } //else if

}//findConnections

function hideAllNodes() {
    d3.selectAll(".node-pulse")
      .transition("pulse").duration(0)
      //.style("stroke", colorScaleHover(1000))
      .style("opacity", 0);
          
    d3.selectAll(".node")
      .transition("node").duration(0)
      .style("fill", colorScale(1000))
      .style("opacity", opacityScaleHover(1000));

    d3.selectAll(".link")
      .transition("link").duration(0)
      .style("opacity", 0.01)
      .style("stroke-width", 0.5);

    labelWrapper.selectAll(".royal-label, .interesting-royal-label")
      .transition("label").duration(0)
      .style("opacity", 0.1);
}//hideAllNodes


//Highlight the found relatives
function showNodes(id, nodeIDs, allNodeIDs, selectedNodes) {

    //Save into global variable
    //selectedNodeIDs = nodeIDs;

    d3.selectAll(".node-pulse")
      .filter(function(o) { return nodeIDs.indexOf(o.id) > -1; })
      .each(function(o) { o.closeNode = selectedNodes[o.id]; })
      .transition("pulse").duration(500)
      .style("stroke", function(o) { return colorScaleHover(o.closeNode); })
      .style("opacity", function(o) { return opacityScaleHover(o.closeNode); });
           
    d3.selectAll(".node")
      .filter(function(o) { return nodeIDs.indexOf(o.id) > -1; })
      .each(function(o) { o.closeNode = selectedNodes[o.id]; })
      .transition("node").duration(500)
      .style("fill", function(o) { return colorScaleHover(o.closeNode); })
      .style("opacity", function(o) { return opacityScaleHover(o.closeNode); });

    d3.selectAll(".link")
      .filter(function(o) { return allNodeIDs.indexOf(o.source.id) > -1 && allNodeIDs.indexOf(o.target.id) > -1; })
      .each(function(o) {           
          o.hoverMin = 1000;
          var closeSource = selectedNodes[o.source.id],
              closeTarget = selectedNodes[o.target.id];
          if (typeof closeSource !== "undefined" && typeof closeSource !== "undefined") { o.hoverMin = Math.min(closeSource, closeTarget); }
      })
      .style("stroke-width", function(o) { return o.hoverMin !== 1000 ? thicknessScaleHover(o.hoverMin) : 0.5; })
      .transition("link").duration(1000)
      .style("opacity", function(o) { return opacityScaleHover( o.hoverMin ) * 0.1; });

    //Highlight title if (interesting) royal
    labelWrapper.selectAll(".royal-label, .interesting-royal-label")
      .filter(function(o) { return nodeIDs.indexOf(o.id) > -1; })
      .transition("label").duration(500)
      .style("opacity", 1);

}//showNodes

//Go back to the normal state
function mouseOut() {

  //Remove possible tspan created by wrap function
  tooltipExtra.selectAll("tspan").remove();

  //Don't do a mouse out during the search of neighbours
  if(stopMouseout) return;
  //Don't do a mouseout when a node was clicked
  if(clickLocked) return;

  //Disrupt the mouseover event so no flashing happens
  repeatSearch = false;
  clearTimeout(connectionsLooper);
  clearTimeout(startSearch);

  //Only run the mouse out the first time you really leave a node that you spend a 
  //significant amount of time hovering over
  if(!doMouseOut) return;

  //Show all the pulsing again
  d3.selectAll(".node-pulse")
    .transition().duration(200)
    .style("stroke", function(o) { return o.stroke; })
    .style("opacity", 1);
  //Return to normal
  d3.selectAll(".node")
    .transition("node").duration(200)
    .style("fill", function(o) { return o.fill; })
    .style("opacity", function(o) { return o.opacity; });
  //Return to normal
  d3.selectAll(".link")
    .transition().duration(200)
    .style("stroke-width", 1.5)
    .style("opacity", function(o) { return opacityScale(o.min_dist_to_royal)*0.1; });
  //Reset the opacity
  labelWrapper.selectAll(".royal-label, .interesting-royal-label")
        .style("opacity", null);

  doMouseOut = false;

}//mouseOut
