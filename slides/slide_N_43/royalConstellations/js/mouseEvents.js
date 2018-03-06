///////////////////////////////////////////////////////////////////////////
////////////////////////////// Mouse events ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

function mouseOvered(d, nodes) {

    // stopMouseout = true;
    repeatSearch = true;
    mouseOverDone = true;
    clearTimeout(startSearch);
    tooltipExtra.selectAll("tspan").remove();

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
        .transition("move").duration(100)
        .attr("transform", "translate(" + d.x + "," + (d.y - tooltipOffset) + ")")
      tooltipWrapper
        .transition("transp").duration(100)
        .style("opacity", 1);
    }//if

    if(!clickLocked) {
      clearTimeout(connectionsLooper);
      startSearch = setTimeout(function() { 
        if(repeatSearch) initiateConnectionSearch(d, nodes); 
      }, 500);
    }//if

    //Stop propagation to the SVG
    d3.event.stopPropagation();
}//mouseOvered

function initiateConnectionSearch(d, nodes) {

    //After a each a mouse out may run again
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
    connectionsLooper = setTimeout(function() { findConnections(nodes, selectedNodes, selectedNodeIDs, oldLevelSelectedNodes, counter); }, 80);
  } else if( repeatSearch && counter >= 6) {
    //If done show the results
    //showNodes(selectedNodeIDs[0], oldLevelSelectedNodes, selectedNodeIDs, selectedNodes);
    // stopMouseout = false;
  } //else if

}//findConnections

function hideAllNodes() {
    clearCanvas();

    //Draw the lines
    ctxLinks.globalAlpha = 0.01;
    ctxLinks.lineWidth = 0.5;
    ctxLinks.beginPath();
    linkSave.forEach(function(d) {
      ctxLinks.setLineDash(d.lineDash);
      drawCircleArc(d.center, d.r, d.source, d.target, d.sign);
    })//forEach
    ctxLinks.stroke();
    ctxLinks.closePath();

    //Draw the nodes
    ctxNodes.globalAlpha = opacityScaleHover(1000);
    ctxNodes.fillStyle = colorScale(1000);
    ctxNodes.beginPath();
    nodesSave.forEach(function(d) {
      ctxNodes.moveTo(d.x + d.radius, d.y);
      ctxNodes.arc(d.x, d.y, d.radius, 0, 2 * Math.PI);
    });
    ctxNodes.fill();
    ctxNodes.closePath();

    labelWrapper.selectAll(".royal-label, .interesting-royal-label")
      .transition("label").duration(0)
      .style("opacity", 0.1);
}//hideAllNodes


//Highlight the found relatives
function showNodes(id, nodeIDs, allNodeIDs, selectedNodes) {

  //Draw the more visible lines
  linkSave
    .filter(function(d) { return allNodeIDs.indexOf(d.source.id) > -1 && allNodeIDs.indexOf(d.target.id) > -1; })
    .forEach(function(d) {
      d.hoverMin = 1000;
      var closeSource = selectedNodes[d.source.id],
          closeTarget = selectedNodes[d.target.id];
      if (typeof closeSource !== "undefined" && typeof closeTarget !== "undefined") { d.hoverMin = Math.min(closeSource, closeTarget); }

      ctxLinks.lineWidth = d.hoverMin !== 1000 ? thicknessScaleHover(d.hoverMin) : 0.5; 
      ctxLinks.globalAlpha = Math.min(opacityScaleHover( d.hoverMin ) * 0.1, 0.05);

      ctxLinks.setLineDash(d.lineDash);
      ctxLinks.beginPath();
      drawCircleArc(d.center, d.r, d.source, d.target, d.sign);
      ctxLinks.stroke();
      ctxLinks.closePath();
    })//forEach

  //Draw the more visible nodes
  nodesSave
    .filter(function(d) { return nodeIDs.indexOf(d.id) > -1; })
    .forEach(function(d) {
      d.closeNode = selectedNodes[d.id];

      ctxNodes.globalAlpha = opacityScaleHover(d.closeNode);
      ctxNodes.fillStyle = colorScaleHover(d.closeNode);
      ctxNodes.shadowBlur = royals.indexOf(d.id) > -1 || royalsInteresting.indexOf(d.id) > -1 ? 30 : 15;
      ctxNodes.shadowColor = colorScaleHover(d.closeNode);

      ctxNodes.beginPath();
      ctxNodes.moveTo(d.x + d.radius, d.y);
      ctxNodes.arc(d.x, d.y, d.radius, 0, 2 * Math.PI);
      ctxNodes.fill();
      ctxNodes.closePath();
    });
  ctxNodes.shadowBlur = 0;

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
  tooltipWrapper.transition("transp").duration(100).style("opacity", 0);

  //Don't do a mouse out during the search of neighbors
  //if(stopMouseout) return;
  //Don't do a mouseout when a node was clicked
  if(clickLocked) return;

  //Disrupt the mouseover event so no flashing happens
  repeatSearch = false;
  clearTimeout(connectionsLooper);
  clearTimeout(startSearch);

  //Only run the mouse out the first time you really leave a node that you spend a 
  //significant amount of time hovering over
  if(!doMouseOut) return;

  //Redraw the visual
  clearCanvas();
  ctxLinks.strokeStyle = "#d4d4d4";
  ctxLinks.lineWidth = 1.5;
  drawLinks(linkSave);
  drawNodes(nodesSave);

  //Reset the opacity
  labelWrapper.selectAll(".royal-label, .interesting-royal-label").style("opacity", null);

  doMouseOut = false;

}//mouseOut
