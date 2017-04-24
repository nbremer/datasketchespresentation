pt.royalNetwork = pt.royalNetwork || {};

pt.royalNetwork.init = function(nodes, links) {
	
	//Remove any existing svgs
	d3.select('#royal-network #royalNetwork svg').remove();

	///////////////////////////////////////////////////////////////////////////
	//////////////////// Set up and initiate svg containers ///////////////////
	///////////////////////////////////////////////////////////////////////////	

	var margin = {
		top: 150,
		right: 100,
		bottom: 150,
		left: 150
	};
	pt.royalNetwork.width = $(".slides").width() - margin.left - margin.right;
	pt.royalNetwork.height = $(".slides").height() - margin.top - margin.bottom;
	
	//SVG container
	pt.royalNetwork.svg = d3.select('#royal-network #royalNetwork')
		.append("svg")
		.attr("width", pt.royalNetwork.width + margin.left + margin.right)
		.attr("height", pt.royalNetwork.height + margin.top + margin.bottom )
		.append("g")
	    .attr("transform", "translate(" + (margin.left) + "," + (margin.top + pt.royalNetwork.height/2) + ")");

	var linkWrapper = pt.royalNetwork.svg.append("g").attr("class", "link-wrapper");
	var nodeWrapper = pt.royalNetwork.svg.append("g").attr("class", "node-wrapper");

	///////////////////////////////////////////////////////////////////////////
	///////////////////// Figure out variables for layout /////////////////////
	///////////////////////////////////////////////////////////////////////////

	var currentRoyalLeaders = [
		{id: "I1208", country: "netherlands"},
		{id: "I1128", country: "belgium"},
		{id: "I610", country: "denmark"},
		{id: "I3012", country: "liechtenstein"}, //added manually
		{id: "I3023", country: "luxembourg"}, //added manually
		{id: "I3034", country: "monaco"}, //added manually
		{id: "I452", country: "norway"},
		{id: "I444", country: "spain"},
		{id: "I603", country: "sweden"},
		{id: "I52", country: "united kingdom"}
	];
	pt.royalNetwork.royals = currentRoyalLeaders.map(function(d) { return d.id; });

	var interestingRoyal = [
	  {id: "I1425", name: "Marie Antoinette"},
	  {id: "I37",   name: "Nicholas II"},
	  {id: "I1372", name: "Eleanor of Aquitaine"},
	  {id: "I1341", name: "Louis XIV"},
	  {id: "I65",   name: "Diana"},
	  {id: "I828",  name: "Henry VIII"},
	  {id: "I3033", name: "Grace Kelly"},
	  {id: "I1247", name: "Mary Stuart"},
	  {id: "I1088", name: "Pauline of Wurttemberg"},
	  {id: "I21",   name: "William II"},
	  {id: "I1122", name: "Umberto II"},
	  {id: "I1196", name: "Elisabeth 'Sissi'"},
	  {id: "I3086", name: "Franz Ferdinand"},
	  {id: "I643",  name: "Karl I"},
	  {id: "I3099", name: "Manuel II"},
	];
	pt.royalNetwork.royalsInteresting = interestingRoyal.map(function(d) { return d.id; });

	///////////////////////////////////////////////////////////////////////////
	//////////////////////////// Create glow filter ///////////////////////////
	///////////////////////////////////////////////////////////////////////////

	//Code taken from http://stackoverflow.com/questions/9630008/how-can-i-create-a-glow-around-a-rectangle-with-svg
	//Filter for the outside glow
	var filter = pt.royalNetwork.svg.append("defs").append("filter")
	  .attr("width", "300%")
	  .attr("x", "-100%")
	  .attr("height", "300%")
	  .attr("y", "-100%")
	  .attr("id","glow-royals");

	filter.append("feGaussianBlur")
	  .attr("class", "blur")
	  .attr("stdDeviation","3")
	  .attr("result","coloredBlur");

	var feMerge = filter.append("feMerge");
	feMerge.append("feMergeNode").attr("in","coloredBlur");
	feMerge.append("feMergeNode").attr("in","SourceGraphic");

	///////////////////////////////////////////////////////////////////////////
	////////////////////////// Create year scale //////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	var minYear = 1000, //d3.min(nodes, function(d) { return d.birth_date; }),
	    maxYear = 2020;
	var yearSpread = [1000, 1344, 1591, 1756, 1850, 1900, 1940, 1980, 2010];
	var yearLoc = d3.range(0, pt.royalNetwork.width, pt.royalNetwork.width/yearSpread.length).concat(pt.royalNetwork.width).reverse();

	pt.royalNetwork.yearScale = d3.scaleLinear()
	    .range(yearLoc)
	    .domain(yearSpread.reverse());

	pt.royalNetwork.yearScaleLinear = d3.scaleLinear()
    	.range([0, pt.royalNetwork.width-100])
    	.domain( d3.extent(nodes, function(d) { return d.birth_date; }) );

    //Add axis
    pt.royalNetwork.xAxis = pt.royalNetwork.svg.append("g")
	    .attr("class", "axis axis--x")
	    .attr("transform", "translate(" + 0 + "," + (pt.royalNetwork.height/2 + 30) + ")");

	///////////////////////////////////////////////////////////////////////////
	////////////////////////// Create other scales ////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	pt.royalNetwork.spreadScale = d3.scaleLinear()
	    .range( [-pt.royalNetwork.height/2, pt.royalNetwork.height/2] )
	    .domain( [0, pt.royalNetwork.royals.length - 1]);

	pt.royalNetwork.strengthScale = d3.scaleLinear()
	      .domain([minYear, maxYear])
	      .range([0.05, 0.075])
	      .clamp(true);

	pt.royalNetwork.color = d3.scaleLinear()
    	.domain( d3.extent(nodes, function(d) { return d.birth_date; }) )
    	.range([1,0]);	

	///////////////////////////////////////////////////////////////////////////
	////////////////////////////// Create links ///////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	pt.royalNetwork.link = linkWrapper.selectAll(".link")
  		.data(links)
    	.enter().append("path")
    	.attr("class", function(d) { return "link " + (d.type === "wife-husband" ? " link-couple" : ""); })
    	.style("stroke", "#c4c4c4");

	///////////////////////////////////////////////////////////////////////////
	//////////////////////////////// Create nodes /////////////////////////////
	///////////////////////////////////////////////////////////////////////////

  	pt.royalNetwork.node = nodeWrapper.selectAll(".node")
		.data(nodes)
    	.enter().append("circle")
        .attr("class", "node")
        .attr("r", function(d) { d.radius = 3; return d.radius; })
      	.style("fill", "#4f4f4f");

	///////////////////////////////////////////////////////////////////////////
	//////////////////////////// Run force simulation /////////////////////////
	///////////////////////////////////////////////////////////////////////////

	pt.royalNetwork.simulation = d3.forceSimulation()
	    .force("link", d3.forceLink().id(function(d) { return d.id; }) )
	    .force("charge", d3.forceManyBody() )
	    .force("center", d3.forceCenter(0, pt.royalNetwork.height/2) );

	pt.royalNetwork.simulation
      	.nodes(nodes)
      	.on("tick", pt.royalNetwork.tickedStraight);

  	pt.royalNetwork.simulation.force("link")
      	.links(links);

}//init

//Just chaos outside of the screen
pt.royalNetwork.chaos = function(nodes, links) {

	///////////////////////////////////////////////////////////////////////////
	/////////////////////////// Initiate simulation ///////////////////////////
	///////////////////////////////////////////////////////////////////////////

	pt.royalNetwork.simulation
	    .force("link", d3.forceLink().id(function(d) { return d.id; }) )
	    .force("charge", d3.forceManyBody() )
	    .force("center", d3.forceCenter(pt.royalNetwork.width/2, 0) )
	    .force("x", null )
	    .force("y", null );	    

	pt.royalNetwork.simulation
       	//.alpha(1)
       	.restart();

  	pt.royalNetwork.simulation.force("link")
      	.links(links);

}//function chaos

//Create a circular hairball
pt.royalNetwork.hairball = function(nodes, links) {

	//In case you move backward
	pt.royalNetwork.node
		.transition().duration(300)
    	.style("fill", "#4f4f4f");

	///////////////////////////////////////////////////////////////////////////
	/////////////////////////// Initiate simulation ///////////////////////////
	///////////////////////////////////////////////////////////////////////////

	pt.royalNetwork.simulation
		.alphaMin(0.001)
	    .force("link", d3.forceLink().id(function(d) { return d.id; }))
	    .force("charge", d3.forceManyBody().strength(-5) )
	    .force("collide", null)
	    .force("center", d3.forceCenter(pt.royalNetwork.width/2, 0) )
	    .force("x", d3.forceX().strength(0.1) )
	    .force("y", d3.forceY().strength(0.1) );

	pt.royalNetwork.simulation
      	.alpha(0.7)
      	.restart();

  	pt.royalNetwork.simulation.force("link")
      	.links(links);

}//function hairball

//Color the circles according to birth year
pt.royalNetwork.colorBirthYear = function() {

	//Hide axis in case you move backwards
	pt.royalNetwork.xAxis
	    .transition().duration(300)
	    .style("opacity", 0);

	//Change the color
	pt.royalNetwork.node
		.transition().duration(500)
	    .style("fill", function(d) { return d3.interpolateViridis( pt.royalNetwork.color(d.birth_date)); });

}//function colorBirthYear

//Create a stretched along birth year
pt.royalNetwork.stretchX = function(nodes, links) {

	//In case you move backwards
	pt.royalNetwork.node
		.transition().duration(300)
		.attr("r", function(d) { d.radius = 3; return d.radius; });

	///////////////////////////////////////////////////////////////////////////
	/////////////////////////// Initiate simulation ///////////////////////////
	///////////////////////////////////////////////////////////////////////////

	pt.royalNetwork.simulation
		.alphaMin(0.15)
	    .force("link", d3.forceLink().id(function(d) { return d.id; }).strength(0.15) )
	    .force("charge", d3.forceManyBody().distanceMax(100).strength(-30) )
	    .force("center", null )
	    .force("collide", d3.forceCollide().radius( function(d) { return d.radius * 1.2; }) )
	    .force("x", d3.forceX(function(d) { return pt.royalNetwork.yearScaleLinear(d.birth_date); }).strength(0.99) )
	    .force("y", d3.forceY().strength(0.1) );

	pt.royalNetwork.simulation
      	.alpha(0.5)
      	.restart();

  	pt.royalNetwork.simulation.force("link")
      	.links(links);

    //Change axis
    pt.royalNetwork.xAxis
	    .call(d3.axisBottom(pt.royalNetwork.yearScaleLinear).tickFormat(d3.format(".0f")))
	    .transition().duration(700)
	    .style("opacity", 1);

}//function stretchX

//Also add stretch along royals
pt.royalNetwork.stretchY = function(nodes, links) {

	//In case you move backwards
	d3.select(".slide-background.stack.present").selectAll(".slide-background.present")
		.style("background", "#FFFFFF");
	pt.royalNetwork.link
		.transition().duration(300).delay(1000)
		.style("opacity", 0.6);
	pt.royalNetwork.node
		.style("filter","none")
		.transition("design").duration(300).delay(1000)
		.style("fill", function(d) { return d3.interpolateViridis( pt.royalNetwork.color(d.birth_date)); })
		.style("opacity", 0.8);

	//Update the node sizes
	pt.royalNetwork.node
		.style("filter","none")
		.transition("size").duration(500)
		.attr("r", function(d) { 
		    if (pt.royalNetwork.royals.indexOf(d.id) > -1) { d.radius = 10; }
		    if (pt.royalNetwork.royalsInteresting.indexOf(d.id) > -1) { d.radius = 6; }
		    return d.radius; 
		});;

	///////////////////////////////////////////////////////////////////////////
	/////////////////////////// Initiate simulation ///////////////////////////
	///////////////////////////////////////////////////////////////////////////

	pt.royalNetwork.simulation
	    .force("link", d3.forceLink().id(function(d) { return d.id; }).strength(0.15) )
	    .force("charge", d3.forceManyBody().distanceMax(100).strength(-30) )
	    .force("center", null )
	    .force("collide", d3.forceCollide().radius( function(d) { return d.radius * (pt.royalNetwork.royals.indexOf(d.id) > -1 ? 1.7 : 1.2); }) )
	    .force("x", d3.forceX(function(d) { return pt.royalNetwork.yearScale(d.birth_date); }).strength(0.99) )
	    .force("y", 
	    	d3
	    		.forceY(function(d) { return pt.royalNetwork.spreadScale(d.min_offset_to_royal-1); })
	    		.strength(function(d) { return pt.royalNetwork.strengthScale(d.birth_date); }) 
	    );

	pt.royalNetwork.simulation
      	.alpha(0.7)
      	.on("tick", pt.royalNetwork.tickedStraight)
      	.restart();

  	pt.royalNetwork.simulation.force("link")
      	.links(links);

    //Change axis
    pt.royalNetwork.xAxis
    	.transition().duration(1000)
	    .call(d3.axisBottom(pt.royalNetwork.yearScale).tickFormat(d3.format(".0f")));

}//function stretchY


pt.royalNetwork.updateDesign = function(nodes, links) {

	//Create color and opacity scale for "starry" design
	var colorScale = d3.scaleLinear()
	    .range(['#fff7b9','#fff196','#ffea72','#ffe348','#fddc18'])
	    .domain([0,1,2,4,6])
	    .clamp(true);
	var interestingRoyalColor = "#C6E2E7";

	var opacityScale = d3.scaleLinear()
	      .range([ 1,0.9,0.4,0.1,0.1])
	      .domain([0,3,  4,  6,  10])
	      .clamp(true);

	//Adjust link opacity
	pt.royalNetwork.link
		.style("opacity", function(d) { return opacityScale(d.min_dist_to_royal)*0.1; });

	//Adjust node style
	pt.royalNetwork.node
		.style("filter","url(#glow-royals)")
		.transition().duration(1500).delay(500)
		.attr("r", function(d) { 
		    if (pt.royalNetwork.royals.indexOf(d.id) > -1) { d.radius = 10; }
		    if (pt.royalNetwork.royalsInteresting.indexOf(d.id) > -1) { d.radius = 6; }
		    return d.radius; 
		})
		.style("fill", function(d) { 
			d.fill = colorScale(d.min_dist_to_royal);
			if (pt.royalNetwork.royalsInteresting.indexOf(d.id) > -1) { d.fill = interestingRoyalColor; }
			return d.fill; 
		})
		.style("opacity", function(d) { 
			d.opacity = opacityScale(d.min_dist_to_royal);
			if (pt.royalNetwork.royalsInteresting.indexOf(d.id) > -1) { d.opacity = 1; }
			return d.opacity; 
		});

	//Update slide background
	d3.select(".slide-background.stack.present").selectAll(".slide-background.present")
		.style("background", "#101420");

	///////////////////////////////////////////////////////////////////////////
	////////////// In case you come in from the previous slide ////////////////
	///////////////////////////////////////////////////////////////////////////

	pt.royalNetwork.simulation
	    .force("link", d3.forceLink().id(function(d) { return d.id; }).strength(0.15) )
	    .force("charge", d3.forceManyBody().distanceMax(100).strength(-30) )
	    .force("center", null )
	    .force("collide", d3.forceCollide().radius( function(d) { return d.radius * (pt.royalNetwork.royals.indexOf(d.id) > -1 ? 1.7 : 1.2); }) )
	    .force("x", d3.forceX(function(d) { return pt.royalNetwork.yearScale(d.birth_date); }).strength(0.99) )
	    .force("y", 
	    	d3
	    		.forceY(function(d) { return pt.royalNetwork.spreadScale(d.min_offset_to_royal-1); })
	    		.strength(function(d) { return pt.royalNetwork.strengthScale(d.birth_date); }) 
	    );

	pt.royalNetwork.simulation
      	.alpha(0.4)
      	.on("tick", pt.royalNetwork.tickedCurved)
      	.restart();

    setTimeout(function() { 
    	d3.select(".slide-background.stack.present").selectAll(".slide-background.present")
			.style("background", "#101420"); 
	}, 2000);

  	pt.royalNetwork.simulation.force("link")
      	.links(links);

    //Show axis
    pt.royalNetwork.xAxis
	    .call(d3.axisBottom(pt.royalNetwork.yearScale).tickFormat(d3.format(".0f")))
	    .style("opacity", 1);

}//function updateDesign

///////////////////////////////////////////////////////////////////////////
///////////////////////// Simulation tick versions ////////////////////////
///////////////////////////////////////////////////////////////////////////

pt.royalNetwork.tickedStraight = function(e) {
	//console.log(pt.royalNetwork.simulation.alpha());

	pt.royalNetwork.link
		.attr("d", function(d) { return "M" + d.source.x + "," + d.source.y + " L" + d.target.x + "," + d.target.y; });

	pt.royalNetwork.node
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; });
}//tickedStraight

pt.royalNetwork.tickedCurved = function() {
	//console.log(pt.royalNetwork.simulation.alpha());

	pt.royalNetwork.link
		.attr("d", function(d) { 
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y;
            var dr = Math.sqrt(dx * dx + dy * dy) * 2;
            return "M" + d.source.x + "," + d.source.y + " A" + dr + "," + dr + " 0 0 1 " + d.target.x + "," + d.target.y;
		});

	pt.royalNetwork.node
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; });
}//tickedCurved

