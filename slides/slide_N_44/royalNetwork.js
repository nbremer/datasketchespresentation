pt.royalNetwork = pt.royalNetwork || {};

pt.royalNetwork.init = function(nodes, links) {
	
	//Remove any existing svgs
	d3.select('#royal-network #royalNetwork svg').remove();
	d3.select('#royal-network #royalNetwork canvas').remove();

	///////////////////////////////////////////////////////////////////////////
	//////////////////// Set up and initiate svg containers ///////////////////
	///////////////////////////////////////////////////////////////////////////	

	pt.royalNetwork.margin = {
		top: 150,
		right: 100,
		bottom: 150,
		left: 150
	};
	pt.royalNetwork.width = $(".slides").width() - pt.royalNetwork.margin.left - pt.royalNetwork.margin.right;
	pt.royalNetwork.height = $(".slides").height() - pt.royalNetwork.margin.top - pt.royalNetwork.margin.bottom;
	
	pt.royalNetwork.total_width = pt.royalNetwork.width + pt.royalNetwork.margin.left + pt.royalNetwork.margin.right,
	pt.royalNetwork.total_height = pt.royalNetwork.height + pt.royalNetwork.margin.top + pt.royalNetwork.margin.bottom;

	//Canvas
	pt.royalNetwork.canvas = d3.select('#royal-network #royalNetwork')
		.append("canvas")
		.attr('width', 2 * pt.royalNetwork.total_width)
		.attr('height', 2 * pt.royalNetwork.total_height)
		.style('width', pt.royalNetwork.total_width + "px")
		.style('height', pt.royalNetwork.total_height + "px")
	pt.royalNetwork.ctx = pt.royalNetwork.canvas.node().getContext("2d")
	pt.royalNetwork.ctx.scale(2,2);
	pt.royalNetwork.ctx.translate(pt.royalNetwork.margin.left, pt.royalNetwork.margin.top + pt.royalNetwork.height/2);

	//SVG container
	pt.royalNetwork.svg = d3.select('#royal-network #royalNetwork')
		.append("svg")
		.attr("width", pt.royalNetwork.total_width)
		.attr("height", pt.royalNetwork.total_height)
		.append("g")
	    .attr("transform", "translate(" + (pt.royalNetwork.margin.left) + "," + (pt.royalNetwork.margin.top + pt.royalNetwork.height/2) + ")");

	// var linkWrapper = pt.royalNetwork.svg.append("g").attr("class", "link-wrapper");
	// var nodeWrapper = pt.royalNetwork.svg.append("g").attr("class", "node-wrapper");

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

	// ///////////////////////////////////////////////////////////////////////////
	// //////////////////////////// Create glow filter ///////////////////////////
	// ///////////////////////////////////////////////////////////////////////////



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

	var colorScale = d3.scaleLinear()
	    .range(['#fff7b9','#fff196','#ffea72','#ffe348','#fddc18'])
	    .domain([0,1,2,4,6])
	    .clamp(true);
	var interestingRoyalColor = "#C6E2E7";

	var opacityScale = d3.scaleLinear()
	      .range([ 1,0.9,0.4,0.1,0.1])
	      .domain([0,3,  4,  6,  10])
		  .clamp(true);

	///////////////////////////////////////////////////////////////////////////
	////////////////////////////// Create links ///////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	links.forEach(function(d,i) {
		d.sign = Math.random() > 0.5 ? 1 : -1;
		d.opacity = opacityScale(d.min_dist_to_royal)*0.1;
	})

	///////////////////////////////////////////////////////////////////////////
	//////////////////////////////// Create nodes /////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	nodes.forEach(function(d,i) {
		d.radius = 3;

		d.color = d3.interpolateViridis( pt.royalNetwork.color(d.birth_date) );

		d.opacity = opacityScale(d.min_dist_to_royal);
		if (pt.royalNetwork.royalsInteresting.indexOf(d.id) > -1) { d.opacity = 1; }

		d.fill = colorScale(d.min_dist_to_royal);
		if (pt.royalNetwork.royalsInteresting.indexOf(d.id) > -1) { d.fill = interestingRoyalColor; } 
	})

	///////////////////////////////////////////////////////////////////////////
	//////////////////////////// Run force simulation /////////////////////////
	///////////////////////////////////////////////////////////////////////////

	pt.royalNetwork.simulation = d3.forceSimulation()
	    .force("link", d3.forceLink().id(function(d) { return d.id; }) )
	    .force("charge", d3.forceManyBody() )
	    .force("center", d3.forceCenter(0, pt.royalNetwork.height/2) );

	pt.royalNetwork.simulation.nodes(nodes);

  	pt.royalNetwork.simulation.force("link")
		  .links(links);
		 
	pt.royalNetwork.ctx.fillStyle = "#4f4f4f";
	pt.royalNetwork.ctx.strokeStyle = "#c4c4c4";

	pt.royalNetwork.simulation
		  .on("tick", pt.royalNetwork.tickedStraight.bind(this, nodes, links));

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
	pt.royalNetwork.ctx.fillStyle = "#4f4f4f";
	pt.royalNetwork.ctx.strokeStyle = "#c4c4c4";

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
		.on("tick", pt.royalNetwork.tickedStraight.bind(this, nodes, links))
      	.restart();

  	pt.royalNetwork.simulation.force("link")
      	.links(links);

}//function hairball

//Color the circles according to birth year
pt.royalNetwork.colorBirthYear = function(nodes, links) {

	//Hide axis in case you move backwards
	pt.royalNetwork.xAxis
	    .transition().duration(300)
		.style("opacity", 0);
		
	pt.royalNetwork.simulation
		.on("tick", pt.royalNetwork.tickedStraightColor.bind(this, nodes, links));

}//function colorBirthYear

//Create a stretched along birth year
pt.royalNetwork.stretchX = function(nodes, links) {

	//In case you move backward
	nodes.forEach(function(d,i) {
		d.radius = 3;
	})

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
		.on("tick", pt.royalNetwork.tickedStraightColor.bind(this, nodes, links))
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
	pt.royalNetwork.ctx.strokeStyle = "#c4c4c4";
	// pt.royalNetwork.ctx.shadowBlur = 0;

	d3.select(".slide-background.stack.present").selectAll(".slide-background.present")
		.style("background", "#FFFFFF");

	nodes.forEach(function(d,i) {
		if (pt.royalNetwork.royals.indexOf(d.id) > -1) { d.radius = 10; }
		if (pt.royalNetwork.royalsInteresting.indexOf(d.id) > -1) { d.radius = 6; }
	});

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
      	.on("tick", pt.royalNetwork.tickedStraightColor.bind(this, nodes, links))
      	.restart();

  	pt.royalNetwork.simulation.force("link")
      	.links(links);

    //Change axis
    pt.royalNetwork.xAxis
    	.transition().duration(1000)
	    .call(d3.axisBottom(pt.royalNetwork.yearScale).tickFormat(d3.format(".0f")));

}//function stretchY


pt.royalNetwork.updateDesign = function(nodes, links) {

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

	// pt.royalNetwork.ctx.shadowBlur = 20;

	pt.royalNetwork.simulation
      	.alpha(0.4)
      	.on("tick", pt.royalNetwork.tickedCurved.bind(this, nodes, links))
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

pt.royalNetwork.tickedStraight = function(nodes, links) {	
	//Clear canvas
	pt.royalNetwork.ctx.clearRect(-pt.royalNetwork.margin.left, -pt.royalNetwork.margin.top - pt.royalNetwork.height/2, pt.royalNetwork.total_width, pt.royalNetwork.total_height);

	//Draw links
	pt.royalNetwork.ctx.globalAlpha = 0.6;
	pt.royalNetwork.ctx.beginPath();
	links.forEach(pt.royalNetwork.drawLink);
	pt.royalNetwork.ctx.stroke();
	pt.royalNetwork.ctx.closePath();
	
	//Draw nodes
	pt.royalNetwork.ctx.globalAlpha = 0.8;
	pt.royalNetwork.ctx.beginPath();
	nodes.forEach(function(d,i) {
		pt.royalNetwork.ctx.moveTo(d.x + d.radius, d.y);
		pt.royalNetwork.ctx.arc(d.x, d.y, d.radius, 0, 2 * Math.PI);
	});
	pt.royalNetwork.ctx.fill();
	pt.royalNetwork.ctx.closePath();
}//tickedStraight

pt.royalNetwork.tickedStraightColor = function(nodes, links) {	
	//Clear canvas
	pt.royalNetwork.ctx.clearRect(-pt.royalNetwork.margin.left, -pt.royalNetwork.margin.top - pt.royalNetwork.height/2, pt.royalNetwork.total_width, pt.royalNetwork.total_height);

	//Draw links
	pt.royalNetwork.ctx.globalAlpha = 0.6;
	pt.royalNetwork.ctx.beginPath();
	links.forEach(pt.royalNetwork.drawLink);
	pt.royalNetwork.ctx.stroke();
	pt.royalNetwork.ctx.closePath();
	
	//Draw nodes
	pt.royalNetwork.ctx.globalAlpha = 0.8;
	nodes.forEach(function(d,i) {
		pt.royalNetwork.ctx.beginPath();
		pt.royalNetwork.ctx.moveTo(d.x + d.radius, d.y);
		pt.royalNetwork.ctx.arc(d.x, d.y, d.radius, 0, 2 * Math.PI);
		pt.royalNetwork.ctx.fillStyle = d.color;
		pt.royalNetwork.ctx.fill();
		pt.royalNetwork.ctx.closePath();
	});
}//tickedStraightColor

pt.royalNetwork.tickedCurved = function(nodes, links) {
	//Clear canvas
	pt.royalNetwork.ctx.clearRect(-pt.royalNetwork.margin.left, -pt.royalNetwork.margin.top - pt.royalNetwork.height/2, pt.royalNetwork.total_width, pt.royalNetwork.total_height);
			
	//Draw links
	links.forEach(function(d,i) {

		//Find the anchor point
		var dx = d.target.x - d.source.x,
			dy = d.target.y - d.source.y,
			dist = Math.sqrt(dx * dx + dy * dy);
		var angle_1 = Math.atan(dy/dx),
			angle_2 = Math.atan((dist*0.2)/(dist/2)),
			dist_2 =  (dist/2) / Math.cos(angle_2);
		var c_x = Math.cos(angle_1 + d.sign * angle_2) * dist_2,
			c_y = Math.sin(angle_1 + d.sign * angle_2) * dist_2;

		pt.royalNetwork.ctx.globalAlpha = d.opacity;
		pt.royalNetwork.ctx.beginPath();
		pt.royalNetwork.ctx.moveTo(d.source.x, d.source.y);
		pt.royalNetwork.ctx.quadraticCurveTo(d.source.x + c_x, d.source.y + c_y, d.target.x, d.target.y);
		pt.royalNetwork.ctx.stroke();
		pt.royalNetwork.ctx.closePath();
	});
	
	//Draw nodes
	nodes.forEach(function(d,i) {
		pt.royalNetwork.ctx.beginPath();
		pt.royalNetwork.ctx.moveTo(d.x + d.radius, d.y);
		pt.royalNetwork.ctx.arc(d.x, d.y, d.radius, 0, 2 * Math.PI);
		pt.royalNetwork.ctx.globalAlpha = d.opacity;
		pt.royalNetwork.ctx.fillStyle = d.fill;
		// pt.royalNetwork.ctx.shadowColor = d.fill;
		pt.royalNetwork.ctx.fill();
		pt.royalNetwork.ctx.closePath();
	});
}//tickedCurved

pt.royalNetwork.drawLink = function(d) {
	pt.royalNetwork.ctx.moveTo(d.source.x, d.source.y);
	pt.royalNetwork.ctx.lineTo(d.target.x, d.target.y);
}
