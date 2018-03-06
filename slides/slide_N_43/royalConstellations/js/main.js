///////////////////////////////////////////////////////////////////////////
//////////////////// Set up and initiate svg containers ///////////////////
///////////////////////////////////////////////////////////////////////////	

d3.select("body")
  .on("click", clickedToNormal)
  .on("mouseover", function(d) {
    stopMouseout = false;

    //Hide the tooltip
    tooltipWrapper
      .transition("transp").duration(200)
      .style("opacity", 0);

    if(mouseOverDone) mouseOut();
  });

var margin = {
  top: -140,
  right: 90,
  bottom: 60,
  left: 120
};
var totalWidth = 1250;
var totalHeight = 1600;
var width = totalWidth - margin.left - margin.right;
var height = totalHeight - margin.top - margin.bottom;

//Canvas
var canvasLinks = d3.select('#royal-chart')
  .append("canvas")
  .attr('width', 2 * totalWidth)
  .attr('height', 2 * totalHeight)
  .style('width', totalWidth + "px")
  .style('height', totalHeight + "px")
var ctxLinks = canvasLinks.node().getContext("2d")
ctxLinks.scale(2,2);
ctxLinks.translate(margin.left + width/2, margin.top);

var canvasNodes = d3.select('#royal-chart')
  .append("canvas")
  .attr('width', 2 * totalWidth)
  .attr('height', 2 * totalHeight)
  .style('width', totalWidth + "px")
  .style('height', totalHeight + "px")
var ctxNodes = canvasNodes.node().getContext("2d")
ctxNodes.scale(2,2);
ctxNodes.translate(margin.left + width/2, margin.top);
			
//SVG container
var svg = d3.select('#royal-chart')
	.append("svg")
	.attr("width", totalWidth)
	.attr("height", totalHeight)
  .append("g")
	.attr("transform", "translate(" + (margin.left + width/2) + "," + (margin.top) + ")")
  .style("isolation", "isolate");
  
var hoverRect = svg.append("rect")
  .attr("class","hoverRect")
  .attr("x", -width/2 - margin.left)
  .attr("y", -margin.top)
  .attr("width", totalWidth)
  .attr("height", totalHeight);

//Initiate a group element for each major thing
var labelWrapper = svg.append("g").attr("class", "label-wrapper");

var linkedByIndex = {},
    linkedToID = {},
    nodeByID = {};

///////////////////////////////////////////////////////////////////////////
/////////////////////////// Create royal data /////////////////////////////
///////////////////////////////////////////////////////////////////////////

var currentRoyalLeaders = [
  {id: "I3012", country: "Liechtenstein",  title: "Prince of Liechtenstein",      name:"Hans-Adam II"}, //added manually
  {id: "I3023", country: "Luxembourg",     title: "Grand Duke of Luxembourg",     name:"Henri"}, //added manually
	{id: "I1128", country: "Belgium",        title: "King of Belgium",              name:"Philippe"},
	{id: "I610",  country: "Denmark",        title: "Queen of Denmark",             name:"Margrethe II"},
  {id: "I452",  country: "Norway",         title: "King of Norway",               name:"Harald V"},
  {id: "I52",   country: "United Kingdom", title: "Queen of the United Kingdom",  name:"Elizabeth II"},
	{id: "I603",  country: "Sweden",         title: "King of Sweden",               name:"Carl XVI Gustaf"},
  {id: "I444",  country: "Spain",          title: "King of Spain",                name:"Felipe VI"},
  {id: "I1208", country: "Netherlands",    title: "King of the Netherlands",      name:"Willem Alexander"},
  {id: "I3034", country: "Monaco",         title: "Prince of Monaco",             name:"Albert II"} //added manually
];
var royals = currentRoyalLeaders.map(function(d) { return d.id; });

var interestingRoyal = [
  {id: "I1425", country: "France",          title: "Queen of France",     name: "Marie Antoinette", note:"Killed by the guillotine during the French revolution"},
  {id: "I37",   country: "Russia",          title: "Tsar of France",      name: "Nicholas II", note:"The last Tsar of Russia"},
  {id: "I1372", country: "France",          title: "Queen of France",     name: "Eleanor of Aquitaine", note:"Became Queen of France & England during her life"},
  {id: "I1341", country: "France",          title: "King of France",      name: "Louis XIV", note:"The Sun King King was, with 72 years, the longest reigning monarch in European history"},
  {id: "I65",   country: "United Kingdom",  title: "Princess of Wales",   name: "Diana", note:"Hugely popular and loved, sadly killed in a car crash in 1997"},
  {id: "I828",  country: "United Kingdom",  title: "King of England",     name: "Henry VIII", note:"Had six wives, two of whom were executed"},
  {id: "I3033", country: "Monaco",          title: "Queen of Monaco",     name: "Grace Kelly", note:"American actress who became a much loved Princess of Monaco"},
  {id: "I1247", country: "Scotland",        title: "Queen of the Scots",  name: "Mary Stuart", note:"Acceded to the throne of Scotland six days after being born"},
  {id: "I1088", country: "Netherlands",     title: "Duchessof Nassau",    name: "Pauline of Wurttemberg", note:"Ancestress of the present Belgian, Danish, Dutch, Luxembourg, Norwegian, and Swedish Royal families"},
  {id: "I21",   country: "Germany",         title: "Emperor of Germany",  name: "William II", note:"The last German & Prussian Emperor"},
  {id: "I1122", country: "Italy",           title: "King of Italy",       name: "Umberto II", note:"The last King of Italy"},
  {id: "I1196", country: "Austria",         title: "Queen of Austria",    name: "Elisabeth 'Sissi'", note:"Was considered one of the greatest beauties of her time"},
  {id: "I3086", country: "Austria",         title: "Heir to Austria",     name: "Franz Ferdinand", note:"His assassination was the last drop that started World War I"},
  {id: "I643",  country: "Austria",         title: "Emperor of Austria",  name: "Karl I", note:"The last Emperor/King of Austria & Hungary"},
  {id: "I3099", country: "Portugal",        title: "King of Portugal",    name: "Manuel II", note:"The last King of Portugal"},
  {id: "I1", 	country: "United Kingdom",  title: "Queen of England",    name: "Victoria", note:"Known as 'the grandmother of Europe' after her 9 children married into royal and noble houses across Europe"},
  {id: "I849", 	country: "United Kingdom",  title: "Queen of England",    name: "Elizabeth I", note:"The Virgin Queen was the last monarch of the Tudor dynasty"}	
];
var royalsInteresting = interestingRoyal.map(function(d) { return d.id; });

///////////////////////////////////////////////////////////////////////////
////////////////////////// Create year scale //////////////////////////////
///////////////////////////////////////////////////////////////////////////

var minYear = 1000, //d3.min(nodes, function(d) { return d.birth_date; }),
    maxYear = 2020;
var yearSpread = [];
// for(var j = 0; j < 10; j++ ) {
//   var decrease = easeOut( j * 0.1, 4) ;
//   yearSpread.push( minYear + (maxYear - minYear) * decrease );
// }//for j
yearSpread = [1000, 1344, 1591, 1756, 1850, 1900, 1940, 1980, 2020];
var yearLoc = d3.range(0, height, height/yearSpread.length).concat(height).reverse();

var yearScale = d3.scaleLinear()
    .range(yearLoc)
    .domain(yearSpread);

svg.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + (-width/2 - 70) + "," + 0 + ")")
    .call(d3.axisLeft(yearScale).tickFormat(d3.format(".0f")));

///////////////////////////////////////////////////////////////////////////
////////////////////////// Create other scales ////////////////////////////
///////////////////////////////////////////////////////////////////////////

var spreadScale = d3.scaleLinear()
    .range( [-width/2, width/2] )
    .domain( [0, royals.length - 1]);

var colorScale = d3.scaleLinear()
    	.range(['#fff7b9','#fff196','#ffea72','#ffe348','#fddc18'])
      .domain([0,1,2,4,6])
      .clamp(true);

var hoverColors = ['#fd150b','#ff8314','#ffc33b','#f3f5e7','#6fb7d0','#2970ac'].reverse();
var colorScaleHover = d3.scaleLinear()
      //.range(['#fefcd3','#fefcd3','#ffe769','#fddc18'])
      //.domain([0,1,2,7])
      .range(hoverColors)
      .domain([1,2,3,4,5,6])
      .clamp(true);
var interestingRoyalColor = "#C6E2E7";

var opacityScale = d3.scaleLinear()
      .range([ 1,0.9,0.4,0.1,0.1])
      .domain([0,3,  4,  6,  10])
      .clamp(true);
var opacityScaleHover = d3.scaleLinear()
      .range([ 1,0.95,0.7,0.075])
      .domain([0,1,   6,  7])
      .clamp(true);

var thicknessScaleHover = d3.scaleLinear()
      .range([2.5,1.5])
      .domain([0,6]);

///////////////////////////////////////////////////////////////////////////
///////////////////////////// Set-up voronoi //////////////////////////////
///////////////////////////////////////////////////////////////////////////

var voronoi = d3.voronoi()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; })
  .extent([[-margin.left - width/2, -margin.top], [width/2 + margin.right, height + margin.bottom]]);

var diagram;

///////////////////////////////////////////////////////////////////////////
///////////////////////////// Create legend ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

createLegend(hoverColors, colorScale, interestingRoyalColor);

///////////////////////////////////////////////////////////////////////////
////////////////////////////// Add Tooltip ////////////////////////////////
///////////////////////////////////////////////////////////////////////////

var tooltipWrapper = labelWrapper.append("g")
  .attr("class", "tooltip-wrapper")
  .attr("transform", "translate(" + 0 + "," + 0 + ")")
  .style("opacity", 0);

var tooltipName = tooltipWrapper.append("text")
  .attr("class", "tooltip-name")
  .text("Alex");

var tooltipTitle = tooltipWrapper.append("text")
  .attr("class", "tooltip-title")
  .attr("y", 15)
  .text("King");

var tooltipExtra = tooltipWrapper.append("text")
  .attr("class", "tooltip-extra-info")
  .attr("x", 0)
  .attr("y", 50)
  .attr("dy", 0)
  .style("opacity", 0)
  .text("");

///////////////////////////////////////////////////////////////////////////
/////////////////////////// Add x axis label //////////////////////////////
///////////////////////////////////////////////////////////////////////////

labelWrapper.append("text")
  .attr("class", "birth-year-label")
  .attr("transform", "translate(" + (spreadScale(-0.85)) + "," + yearScale(1990) + ")rotate(-90)" )
  .text("Year of birth (approximately)");

///////////////////////////////////////////////////////////////////////////
/////////////////////////// Add royal labels //////////////////////////////
///////////////////////////////////////////////////////////////////////////

var royalTextWrapper = labelWrapper.selectAll(".royal-label")
  .data(currentRoyalLeaders)
  .enter().append("g")
  .attr("class", "royal-label")
  .attr("transform", function(d,i) { return "translate(" + (spreadScale(i)) + "," + yearScale(2020) + ")"; });

royalTextWrapper.append("text")
  .attr("class", "royal-name")
  .text(function(d) { return d.name; });

royalTextWrapper.append("text")
  .attr("class", "royal-country")
  .attr("y", 15)
  .text(function(d) { return d.country; });

var interestingRoyalTextWrapper = labelWrapper.selectAll(".interesting-royal-label")
  .data(interestingRoyal)
  .enter().append("g")
  .attr("class", "interesting-royal-label")
  .style("opacity", 0);

interestingRoyalTextWrapper.append("text")
  .attr("class", "royal-name interesting-royal-name")
  .attr("y", 23)
  .text(function(d) { return d.name; });

///////////////////////////////////////////////////////////////////////////
////////////////////////////// Mouse events ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

//Variables needed to disrupt mouseover loop
var repeatSearch;
var connectionsLooper;
var startSearch;
var doMouseOut = true;
var stopMouseout;
var counter = 0;
var mouseOverDone = false;

var selectedNodes = {},
    selectedNodeIDs = [],
    oldLevelSelectedNodes;

///////////////////////////////////////////////////////////////////////////
////////////////////////////// Click events ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

var clickLocked = false;
var pathLocked = false;
var startNode = {},
    endNode = {};
startNode.id = 0;
endNode.id = 0;
var route;

//Create circle to show clicked node
var clickedCircle = svg.append("circle")
  .attr("class", "node-clicked")
  .attr("r", 16)
  .style("opacity", 0);

var clickedCircleEnd = svg.append("circle")
  .attr("class", "node-clicked")
  .attr("r", 16)
  .style("opacity", 0);

//Shortest path finder eventually
var sp;

//Title for the first clicked person
var firstClickNodeWrapper = labelWrapper.append("g")
  .attr("class", "tooltip-wrapper")
  .attr("transform", "translate(" + 0 + "," + 0 + ")")
  .style("opacity", 0);

var firstClickedName = firstClickNodeWrapper.append("text")
  .attr("class", "tooltip-name")
  .text("");

var firstClickedTitle = firstClickNodeWrapper.append("text")
  .attr("class", "tooltip-title")
  .attr("y", 15)
  .text("");

//Title for the clicked person to which a path will be drawn
var pathClickNodeWrapper = labelWrapper.append("g")
  .attr("class", "tooltip-wrapper")
  .attr("transform", "translate(" + 0 + "," + 0 + ")")
  .style("opacity", 0);

var pathClickedName = pathClickNodeWrapper.append("text")
  .attr("class", "tooltip-name")
  .text("");

var pathClickedTitle = pathClickNodeWrapper.append("text")
  .attr("class", "tooltip-title")
  .attr("y", 15)
  .text("");

///////////////////////////////////////////////////////////////////////////
//////////////////////////// Read in the data /////////////////////////////
///////////////////////////////////////////////////////////////////////////

//Create two arrays that will be global variables that hold the data
var nodesSave,
    linkSave;

d3.queue() 
  .defer(d3.json, "data/royal-families-links-force.json")
  .defer(d3.csv, "data/royal-families-members-force.csv")
  .await(draw);

function draw(error, links, nodes) {

  if (error) throw error;

  ///////////////////////////////////////////////////////////////////////////
  /////////// Set the interesting royal labels to their locations ///////////
  ///////////////////////////////////////////////////////////////////////////

  interestingRoyalTextWrapper
      .attr("transform", function(d,i) { 
        var chosenNode = nodes.filter(function(n) { return n.id === d.id; })[0];
        return "translate(" + chosenNode.x + "," + chosenNode.y + ")"; 
      })
      .style("opacity", null);

  ///////////////////////////////////////////////////////////////////////////
  ////////////////////////////// Create links ///////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  links.forEach(function(d) {
    linkedByIndex[d.source.id + "," + d.target.id] = true;

    //Save all of the links to a specific node
    if(!linkedToID[d.source.id]) linkedToID[d.source.id] = [];
    if(!linkedToID[d.target.id]) linkedToID[d.target.id] = [];
    linkedToID[d.source.id].push(d.target.id); 
    linkedToID[d.target.id].push(d.source.id); 

    d.opacity = opacityScale(d.min_dist_to_royal)*0.1;
    d.sign = Math.random() > 0.5;

    //Find a good radius
    d.r = Math.sqrt(sq(d.target.x - d.source.x) + sq(d.target.y - d.source.y)) * 2;
    //Find center of the arc function
    var centers = findCenters(d.r, d.source, d.target);
    d.center = d.sign ? centers.c2 : centers.c1;
    d.lineDash = (d.type === "wife-husband" ? [5,5] : []);
  });

  linkSave = links;
  ctxLinks.strokeStyle = "#d4d4d4";
  ctxLinks.lineWidth = 1.5;
  drawLinks(links);

  ///////////////////////////////////////////////////////////////////////////
  ////////////////////////////// Create nodes ///////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  //Prepare the node data
  nodes.forEach(function(d) { 
    d.birth_date = d.birth_date === "" ? NaN : +d.birth_date;
    d.death_date = d.death_date === "" ? NaN : +d.death_date;

    d.radius = 3;
    if (royals.indexOf(d.id) > -1) { d.radius = 10; }
    if (royalsInteresting.indexOf(d.id) > -1) { d.radius = 6; }

    d.fill = colorScale(d.min_dist_to_royal);
    if (royalsInteresting.indexOf(d.id) > -1) { d.fill = interestingRoyalColor; }

    d.opacity = opacityScale(d.min_dist_to_royal);
    if (royalsInteresting.indexOf(d.id) > -1) { d.opacity = 1; }

    nodeByID[d.id] = d;
  });

  diagram = voronoi(nodes);
  nodesSave = nodes;
  drawNodes(nodes);

  ///////////////////////////////////////////////////////////////////////////
  /////////////////////// Capture close mouse events ///////////////////////
  ///////////////////////////////////////////////////////////////////////////
 
  var currentHover = null;

  hoverRect.on("mousemove", function() {
    d3.event.stopPropagation();

    //Find the nearest person to the mouse, within a distance of X pixels
    var m = d3.mouse(this);
    var found = diagram.find(m[0], m[1], 10);

    if(currentHover === found) {
      //do nothing
    }
    else if (found) { 
      d3.event.preventDefault();
      mouseOvered(found.data, nodes); 
    } else { 
      mouseOut() 
    } 

    currentHover = found;
  })//on mousemove

  //Select the person
  hoverRect.on("click", function() {
      d3.event.stopPropagation();

      //Find the nearest person to the mouse, within a distance of X pixels
      var m = d3.mouse(this);
      var found = diagram.find(m[0], m[1], 20);

      if (found) {
        clickedOnNode(found.data);  
      } else {
        clickedToNormal();
      }
  })//on click

  ///////////////////////////////////////////////////////////////////////////
  //////////////////////// Set-up shortest path finder //////////////////////
  ///////////////////////////////////////////////////////////////////////////

  sp = new ShortestPathCalculator(nodes, links);

}//draw

///////////////////////////////////////////////////////////////////////////
////////////////////////////// Canvas functions ///////////////////////////
///////////////////////////////////////////////////////////////////////////

function clearCanvas() {
  //Clear the canvas
  ctxLinks.clearRect(-margin.left - width/2, -margin.top, totalWidth, totalHeight);
  ctxNodes.clearRect(-margin.left - width/2, -margin.top, totalWidth, totalHeight);
}//function clearCanvas

///////////////////////////////////////////////////////////////////////////
/////////////////////////////// Draw the nodes ////////////////////////////
///////////////////////////////////////////////////////////////////////////

function drawNodes(nodes, opacity, fill) {
  nodes.forEach(function(d) {
		ctxNodes.beginPath();
		ctxNodes.moveTo(d.x + d.radius, d.y);
		ctxNodes.arc(d.x, d.y, d.radius, 0, 2 * Math.PI);
		ctxNodes.globalAlpha = opacity ? opacity : d.opacity;
    ctxNodes.fillStyle = fill ? fill : d.fill;
    ctxNodes.shadowBlur = royals.indexOf(d.id) > -1 || royalsInteresting.indexOf(d.id) > -1 ? 30 : 15;
    ctxNodes.shadowColor = d.fill;
		ctxNodes.fill();
		ctxNodes.closePath();
  });
  ctxNodes.shadowBlur = 0;
}//function drawNodes

///////////////////////////////////////////////////////////////////////////
/////////////////////////////// Draw the links ////////////////////////////
///////////////////////////////////////////////////////////////////////////

function drawLinks(links) {
	links.forEach(function(d) {
    ctxLinks.setLineDash(d.lineDash);
    ctxLinks.globalAlpha = d.opacity;
    ctxLinks.beginPath();
    drawCircleArc(d.center, d.r, d.source, d.target, d.sign);
    ctxLinks.stroke();
  })//forEach
}//function drawLinks

//https://stackoverflow.com/questions/26030023/draw-arc-initial-point-radius-and-final-point-in-javascript-canvas
//http://jsbin.com/jutidigepeta/3/edit?html,js,output
function findCenters(r, p1, p2) {
  // pm is middle point of (p1, p2)
  var pm = { x : 0.5 * (p1.x + p2.x) , y: 0.5*(p1.y+p2.y) } ;
  // compute leading vector of the perpendicular to p1 p2 == C1C2 line
  var perpABdx= - ( p2.y - p1.y );
  var perpABdy = p2.x - p1.x;
  // normalize vector
  var norm = Math.sqrt(sq(perpABdx) + sq(perpABdy));
  perpABdx/=norm;
  perpABdy/=norm;
  // compute distance from pm to p1
  var dpmp1 = Math.sqrt(sq(pm.x-p1.x) + sq(pm.y-p1.y));
  // sin of the angle between { circle center,  middle , p1 } 
  var sin = dpmp1 / r ;
  // is such a circle possible ?
  if (sin<-1 || sin >1) return null; // no, return null
  // yes, compute the two centers
  var cos = Math.sqrt(1-sq(sin));   // build cos out of sin
  var d = r*cos;
  var res1 = { x : pm.x + perpABdx*d, y: pm.y + perpABdy*d };
  var res2 = { x : pm.x - perpABdx*d, y: pm.y - perpABdy*d };
  return { c1 : res1, c2 : res2} ;  
}//function findCenters

function drawCircleArc(c, r, p1, p2, side) {
  var ang1 = Math.atan2(p1.y-c.y, p1.x-c.x);
  var ang2 = Math.atan2(p2.y-c.y, p2.x-c.x);
  ctxLinks.arc(c.x, c.y, r, ang1, ang2, side);
}//function drawCircleArc

///////////////////////////////////////////////////////////////////////////
///////////////////////////// Helper functions ////////////////////////////
///////////////////////////////////////////////////////////////////////////

function sq(x) { return x*x ; }

//Check if node a and b are connected
function isConnected(a, b) {
    return linkedByIndex[a + "," + b] || linkedByIndex[b + "," + a]; //|| a.index == b.index;
}

function easeOut( iteration, power ) {
	var p = power || 3;
	//returned: 0 - 1
	return 1 - Math.pow(1 - iteration, p);
}//easeOut

function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}//uniq

//Wrap text in SVG
function wrap(text, width, heightLine) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = (typeof heightLine === "undefined" ? 1.6 : heightLine), // ems
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}//wrap