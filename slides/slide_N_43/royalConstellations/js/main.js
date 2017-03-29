// http://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome
// please note, 
// that IE11 now returns undefined again for window.chrome
// and new Opera 30 outputs true for window.chrome
// and new IE Edge outputs to true now for window.chrome
// and if not iOS Chrome check
// so use the below updated condition
var isChromium = window.chrome,
    winNav = window.navigator,
    vendorName = winNav.vendor,
    isOpera = winNav.userAgent.indexOf("OPR") > -1,
    isIEedge = winNav.userAgent.indexOf("Edge") > -1,
    isIOSChrome = winNav.userAgent.match("CriOS");

var isChrome;
if(isIOSChrome){
   isChrome = true;
} else if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
   isChrome = true;
} else { 
   isChrome = false;
}//else

//Hide Chrome notification if it is already Chrome
if(isChrome) {
  d3.select("#top-chrome-note").style("display", "none");
}

///////////////////////////////////////////////////////////////////////////
//////////////////// Set up and initiate svg containers ///////////////////
///////////////////////////////////////////////////////////////////////////	

d3.select("body")
  .on("click", clickedToNormal)
  .on("mouseover", function(d) {
    stopMouseout = false;

    //Hide the tooltip
    tooltipWrapper
      .transition("transp").duration(300)
      .style("opacity", 0);

    mouseOut()
  });

var margin = {
  top: -140,
  right: 90,
  bottom: 60,
  left: 120
};
var width = 1250 - margin.left - margin.right;
var height = 1600 - margin.top - margin.bottom;
			
//SVG container
var svg = d3.select('#royal-chart')
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
  .append("g")
	.attr("transform", "translate(" + (margin.left + width/2) + "," + (margin.top) + ")")
	.style("isolation", "isolate");

//Initiate a group element for each major thing
var circleClipGroup = svg.append("g").attr("class", "circle-clip-wrapper"); 
var linkWrapper = svg.append("g").attr("class", "link-wrapper");
var nodeWrapper = svg.append("g").attr("class", "node-wrapper");
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
//////////////////////////// Create glow filter ///////////////////////////
///////////////////////////////////////////////////////////////////////////

//Container for the gradients
var defs = svg.append("defs");

//Create wrapper for the voronoi clip paths
var clipWrapper = defs.append("g").attr("class", "clip-group-wrapper");

//Code taken from http://stackoverflow.com/questions/9630008/how-can-i-create-a-glow-around-a-rectangle-with-svg
//Filter for the outside glow
var filter = defs.append("filter")
  .attr("width", "300%")
  .attr("x", "-100%")
  .attr("height", "300%")
  .attr("y", "-100%")
  .attr("id","glow");

filter.append("feGaussianBlur")
  .attr("class", "blur")
  .attr("stdDeviation","3")
  .attr("result","coloredBlur");

var feMerge = filter.append("feMerge");
feMerge.append("feMergeNode")
  .attr("in","coloredBlur");
feMerge.append("feMergeNode")
  .attr("in","SourceGraphic");


//Blur for the royal leaders
var filterIntense = defs.append("filter")
  .attr("width", "300%")
  .attr("x", "-100%")
  .attr("height", "300%")
  .attr("y", "-100%")
  .attr("id","glow-intense");

filterIntense.append("feGaussianBlur")
  .attr("class", "blur")
  .attr("stdDeviation","3")
  .attr("result","coloredBlur");

///////////////////////////////////////////////////////////////////////////
///////////////////////////// Set-up voronoi //////////////////////////////
///////////////////////////////////////////////////////////////////////////

var voronoi = d3.voronoi()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; })
  .extent([[-margin.left - width/2, -margin.top], [width/2 + margin.right, height + margin.bottom]]);

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
  });

	var link = linkWrapper.selectAll(".link")
  		.data(links)
    	.enter().append("path")
    	.attr("class", function(d) { return "link" + (d.type === "wife-husband" ? " link-couple" : ""); })
      .style("opacity", function(d) { return opacityScale(d.min_dist_to_royal)*0.1; })
      .attr( "d", function ( d ) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y;
            var dr = Math.sqrt(dx * dx + dy * dy) * 2;
            //Curved lines
            return [ "M", d.source.x, d.source.y, "A", dr, dr, "0 0 1", d.target.x, d.target.y ].join( " " );
      });

  linkSave = links;

  ///////////////////////////////////////////////////////////////////////////
  ////////////////// Circles to capture close mouse event ///////////////////
  ///////////////////////////////////////////////////////////////////////////
 
  //Calculate the voronoi paths
  clipWrapper.selectAll(".clip")
      .data(voronoi.polygons(nodes).filter(function(v) { return v.data; }))
      .enter().append("clipPath")
      .attr("class", "clip")
      .attr("id", function(d,i) { return "clip-" + d.data.id; })
      .append("path")
      .attr("class", "clip-path-circle")
      .attr("d", function(d) { return "M" + d.join(",") + "Z"; });

  //Place the larger circles to eventually capture the mouse
  var circlesOuter = circleClipGroup.selectAll(".circle-mouse-capture")
    .data(nodes)
    .enter().append("circle")
    .attr("class", "circle-mouse-capture")
    .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
    .style("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", 20)
    .on("mouseenter", function(d) { mouseOvered(d, nodes); })
    .on("mouseout", mouseOut)
    .on("click", clickedOnNode);

  ///////////////////////////////////////////////////////////////////////////
  ////////////////////////////// Create nodes ///////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  //Prepare the node data
  nodes.forEach(function(d) { 
    d.birth_date = d.birth_date === "" ? NaN : +d.birth_date;
    d.death_date = d.death_date === "" ? NaN : +d.death_date;

    nodeByID[d.id] = d;
  });

  nodesSave = nodes;

  var nodePulse = nodeWrapper.selectAll(".node-pulse")
    .data(nodes.filter(function(d) { return royals.indexOf(d.id) > -1 || royalsInteresting.indexOf(d.id) > -1; }))
      .enter().append("circle")
        .attr("class", "node-pulse pulse")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d) {
          d.radius = 18;
          if (royalsInteresting.indexOf(d.id) > -1) { d.radius = 14; }
          return d.radius; 
        })
        .style("stroke", function(d) { 
          d.stroke = colorScale(0);
          if (royalsInteresting.indexOf(d.id) > -1) { d.stroke = interestingRoyalColor; }
          return d.stroke; 
        })
        //.style("stroke-width", 1)
        .style("filter","url(#glow-intense)");

  var node = nodeWrapper.selectAll(".node")
		.data(nodes)
    	.enter().append("circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
      	.attr("r", function(d) { 
      		d.radius = 3;
      		if (royals.indexOf(d.id) > -1) { d.radius = 10; }
          if (royalsInteresting.indexOf(d.id) > -1) { d.radius = 6; }
      		return d.radius; 
      	})
      	.style("fill", function(d) { 
          d.fill = colorScale(d.min_dist_to_royal);
          if (royalsInteresting.indexOf(d.id) > -1) { d.fill = interestingRoyalColor; }
          return d.fill; 
        })
        .style("opacity", function(d) { 
          d.opacity = opacityScale(d.min_dist_to_royal);
          if (royalsInteresting.indexOf(d.id) > -1) { d.opacity = 1; }
          return d.opacity ; 
        })
        .style("filter","url(#glow)");

  ///////////////////////////////////////////////////////////////////////////
  //////////////////////// Set-up shortest path finder //////////////////////
  ///////////////////////////////////////////////////////////////////////////

  sp = new ShortestPathCalculator(nodes, links);

}//draw

///////////////////////////////////////////////////////////////////////////
///////////////////////////// Helper functions ////////////////////////////
///////////////////////////////////////////////////////////////////////////

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