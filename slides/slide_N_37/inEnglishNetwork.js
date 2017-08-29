pt.inEnglishNetwork = pt.inEnglishNetwork || {};

pt.inEnglishNetwork.init = function(links, switching, slideID, chartID) {
	
	//Remove any existing svgs
	d3.select('#in-english-network-bad #inEnglishNetworkBad svg').remove();
	d3.select('#in-english-network-good #inEnglishNetworkGood svg').remove();

	pt.inEnglishNetwork.goodSwitch = switching;

	///////////////////////////////////////////////////////////////////////////
	//////////////////// Set up and initiate svg containers ///////////////////
	///////////////////////////////////////////////////////////////////////////	

	var margin = {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	};
	var width = $(".slides").width() - margin.left - margin.right;
	var height = $(".slides").height() - margin.top - margin.bottom;
	
	//The radius of the network in circular shape
	var radius = Math.min(width/2 * 0.8, height/2 * 0.6, 300);
	
	//SVG container
	pt.inEnglishNetwork.svg = d3.select('#' + slideID + ' #' + chartID)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", $(".slides").height() )
		.append("g")
	    .attr("transform", "translate(" + (margin.left + width/2) + "," + (margin.top + height/2) + ")")
	    .style("font-size", "15px");

	///////////////////////////////////////////////////////////////////////////
	///////////////////// Figure out variables for layout /////////////////////
	///////////////////////////////////////////////////////////////////////////

	pt.inEnglishNetwork.middleLang = "all"; //starting language in the middle
	pt.inEnglishNetwork.middleLangOld = "all";

	//Scale for the white circles, one for each language
	var circleScale = d3.scaleLinear()
		.domain([50, 300])
		.range([10, 45]);

	//Opacities for the links (without words)
	var linkOpacity = 0.2,
		middleLinkOpacity = 0.9,
		hoverLinkOpacity = 0.4;

	//Scale for the stroke width - based on the radius of the circle
	var strokeScale = d3.scaleLinear()
		.domain([100, 250])
		.range([1, 3]);

	var darkgrey = "#161616",
		middlegrey = "#a7a7a7",
		lightgrey = "#afafaf";

	var languageMap = [];
		languageMap["de"] = "German";
		languageMap["es"] = "Spanish";
		languageMap["fr"] = "French";
		languageMap["it"] = "Italian";
		languageMap["ja"] = "Japanese";
		languageMap["nl"] = "Dutch";
		languageMap["pl"] = "Polish";
		languageMap["pt"] = "Portuguese";
		languageMap["ru"] = "Russian";
		languageMap["tr"] = "Turkish";
		languageMap["all"] = "All languages";

	///////////////////////////////////////////////////////////////////////////
	////////////////////////// Create shadow filter ///////////////////////////
	///////////////////////////////////////////////////////////////////////////

	//Filter for the outside glow
	var filter = pt.inEnglishNetwork.svg.append("defs").append("filter").attr("id","shadow-circle");

	filter.append("feColorMatrix")
		.attr("type", "matrix")
		.attr("values", "0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0 0.4 0")
	filter.append("feGaussianBlur")
	  .attr("stdDeviation","3")
	  .attr("result","coloredBlur");;

	var feMerge = filter.append("feMerge");
	feMerge.append("feMergeNode").attr("in","coloredBlur");
	feMerge.append("feMergeNode").attr("in","SourceGraphic");

	///////////////////////////////////////////////////////////////////////////
	//////////////////////////// Read in the data /////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	var nodesByName = {};
	function nodeByName(name) { 
		return nodesByName[name] || (nodesByName[name] = {name: name}); 
	}//function nodeByName

  	//Create nodes for each unique source and target.
  	links.forEach(function(link,i) {
  		//Needed because you can go back and forth through the slides
  		if(link.index === undefined) {
	  		link.index = i;
	    	link.source = nodeByName(link.source);
	    	link.target = nodeByName(link.target);
	    } else {
	    	link.source = link.source.name;
	    	link.source = nodeByName(link.source);
	    	link.target = link.target.name
	    	link.target = nodeByName(link.target);
	    }//else
  	});
  	//Extract the array of nodes from the map by name.
  	var nodes = d3.values(nodesByName);

  	//For the hover effects
  	//http://stackoverflow.com/questions/8739072/highlight-selected-node-its-links-and-its-children-in-a-d3-force-directed-grap
  	var linkedByIndex = {};
	links.forEach(function(d) {
	  linkedByIndex[d.source.name + "," + d.target.name] = 1;
	});

	//Set up the locations of the nodes
	calculateNodePositions(nodes);

	//Calculate the positions of the language circles
	function calculateNodePositions(nodes) {
		var counter = 0;
		nodes.forEach(function(d) {
			if(d.name === pt.inEnglishNetwork.middleLang) {
				d.xOld = 0;
				d.yOld = 0;
				d.angleOld = 0;
				d.x = 0;
				d.y = 0;
				d.angle = 0;
			} else {
				d.angle = counter * 2*Math.PI/(nodes.length-1);
				d.x = +round2(radius * Math.cos(d.angle));
				d.y = +round2(radius * Math.sin(d.angle));
				d.xOld = d.x;
				d.yOld = d.y;
				d.angleOld = d.angle;
				counter+=1;
			}//else
		});//forEach nodes
	}//calculateNodePositions

	///////////////////////////////////////////////////////////////////////////
	//////////////////////////// Create the links /////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	var link = pt.inEnglishNetwork.svg.selectAll(".link")
		.data(links)
		.enter().append("g")
		.attr("class", "link");

	//Create the paths
	link.append("path")
		.attr("id", function(d) { return "link-id-" + d.index; })
		.attr("class", "link-path")
		.style("stroke", lightgrey) 
		.style("stroke-width", function(d) {
			return pt.inEnglishNetwork.middle(d) ? +round2(strokeScale(radius)) : +round2(strokeScale(radius))*0.75;
		})
		.style("opacity", function(d) { return pt.inEnglishNetwork.middle(d) ? middleLinkOpacity : linkOpacity; })
		.attr("d", function(d) { return pt.inEnglishNetwork.linkPathCalculation(d); });

	//Create a text element for the big bold part in the middle
	var textMiddle = link.append("text")
		.attr("class", "link-text-bold noselect")
		.style("fill", "black")
		.attr("dy", "0.15em");

	//Create the text on the paths
	pt.inEnglishNetwork.updateLinkTextPaths();

	///////////////////////////////////////////////////////////////////////////
	//////////////////////////// Create the nodes /////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	var node = pt.inEnglishNetwork.svg.selectAll(".node")
		.data(nodes)
		.enter().append("g")
		.attr("class", "node")
		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
		.on("click", switchCenterLanguage)
		.on("mouseover", nodeMouseOver)
		.on("mouseout", nodeMouseOut);

	//Append a white circle for each language
	node.append("circle")
		.attr("class", "node-background-circle")
		.attr("r", circleScale(radius))
		.style("fill", "white")
		.style("filter", "url(#shadow-circle)");

	//Append the language text in the circle
	node.append("text")
		.attr("class", "node-language-text")
		.attr("dy", "0.35em")
		.text(function(d) { return languageMap[d.name]; });

	///////////////////////////////////////////////////////////////////////////
	///////////////////////////// Switch languages ////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	function switchCenterLanguage(d) {

		//Do nothing if the middle one was clicked
		if(d.name === pt.inEnglishNetwork.middleLang) {
			return;
		} else {
			var x = d.x, 
				y = d.y, 
				angle = d.angle;

			//Remeber the before middle node's language
			pt.inEnglishNetwork.middleLangOld = pt.inEnglishNetwork.middleLang;
			//Change id for middle language
			pt.inEnglishNetwork.middleLang = d.name;

			//Deactivate the mouse events 
			pt.inEnglishNetwork.svg.selectAll(".node")
				.on("click", null)
				.on("mouseover", null)
				.on("mouseout", null);

			//Fade out the textPaths and then remove them
			pt.inEnglishNetwork.svg.selectAll(".link").selectAll("textPath")
				.transition("fade").duration(200)
				.style("opacity", 0)
				.call(endall, intermediateSwitch)
				.remove();

			function intermediateSwitch() {

				//Switch locations of the middle and clicked on node
				nodes.forEach(function(n,i) {
					if( n.name === pt.inEnglishNetwork.middleLangOld ) {
						n.xOld = 0;
						n.yOld = 0;
						n.angleOld = 0;
						n.x = x;
				 		n.y = y;
				 		n.angle = angle;
					} else if ( n.name === d.name ) {
						n.xOld = x;
						n.yOld = y;
						n.angleOld = angle;
						n.x = 0;
				 		n.y = 0;
				 		n.angle = 0;
					} else {
						n.xOld = n.x;
						n.yOld = n.y
						n.angleOld = n.angle;
					}
				 });//forEach

				var dur = 1500;

				//Switch locations of the center and clicked node
				pt.inEnglishNetwork.svg.selectAll(".node")
					.transition("change").duration(dur)
					.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
					.transition().duration(0).delay(200)
					.call(endall, fadeIn);

				//Update the paths
				pt.inEnglishNetwork.svg.selectAll(".link-path")
					//Update the hidden paths - before the move - so the transition will look smooth
					.filter(function(d) {
						//Only change the paths that move
						return pt.inEnglishNetwork.middle(d) || pt.inEnglishNetwork.middleOld(d);
					})
					.attr("d", function(d) { 
						if( pt.inEnglishNetwork.goodSwitch ) return pt.inEnglishNetwork.linkPathCalculationSwitch(d);
						else return d3.select(this).attr("d"); 
					})
					.transition("reform").duration(dur)
					.attrTween("d", function(n) {
			      		//https://bl.ocks.org/mbostock/3916621
			      		var d1 = pt.inEnglishNetwork.linkPathCalculation(n), 
			      			precision = 10;

				      	var path0 = this,
					        path1 = path0.cloneNode(),
					        n0 = path0.getTotalLength(),
					        n1 = (path1.setAttribute("d", d1), path1).getTotalLength();

					    // Uniform sampling of distance based on specified precision.
					    var distances = [0], i = 0, dt = precision / Math.max(n0, n1);
					    while ((i += dt) < 1) distances.push(i);
					    distances.push(1);

					    // Compute point-interpolators at each distance.
					    var points = distances.map(function(t) {
					    	var p0 = path0.getPointAtLength(t * n0),
					          	p1 = path1.getPointAtLength(t * n1);
					    	return d3.interpolate([p0.x, p0.y], [p1.x, p1.y]);
					    });

					    return function(t) {
					    	return t < 1 ? "M" + points.map(function(p) { return p(t); }).join("L") : d1;
					    };
				    });

				pt.inEnglishNetwork.svg.selectAll(".link-path")
					.filter(function(d) { return pt.inEnglishNetwork.middle(d) || pt.inEnglishNetwork.middleOld(d); })
					.transition("changeColor").duration(dur)
				    .style("opacity", function(d) { return pt.inEnglishNetwork.middle(d) ? middleLinkOpacity : linkOpacity; })
					.call(endall, pt.inEnglishNetwork.updateLinkTextPaths) //Adjust the text paths

			}//function intermediateSwitch

			//Basically do a mouseout but then more slowly
			function fadeIn() {
				//Fade everything back in
				pt.inEnglishNetwork.svg.selectAll(".node, .link")
					.transition("fade").duration(500)
					.style("opacity", 1);
				pt.inEnglishNetwork.svg.selectAll(".link-path")
					.style("stroke-width", function(d) {
						return (pt.inEnglishNetwork.middle(d) ? +round2(strokeScale(radius)) : (+round2(strokeScale(radius))*0.75));
					})
				//Set the hovers back on
				pt.inEnglishNetwork.svg.selectAll(".node")
					.on("click", switchCenterLanguage)
					.on("mouseover", nodeMouseOver)
					.on("mouseout", nodeMouseOut);
			}//function fadeIn

		}//else
	}//function switchCenterLanguage

	///////////////////////////////////////////////////////////////////////////
	///////////////////////////// Extra functions /////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	//Mouse over a language circle
	function nodeMouseOver(d) {
		var opacity = 0.1;
		//Dim all other nodes
		pt.inEnglishNetwork.svg.selectAll(".node")
			.style("opacity", function(o) { return neighboring(d, o) || d === o ? 1 : opacity; });
		//Dim unconnected links
		pt.inEnglishNetwork.svg.selectAll(".link")
			.style("opacity", function(o) { return o.source === d || o.target === d ? 1 : opacity; });
		pt.inEnglishNetwork.svg.selectAll(".link-path")
			.filter(function(o) { return !pt.inEnglishNetwork.middle(o); })
			.style("opacity", function(o) { return o.source === d || o.target === d ? hoverLinkOpacity : opacity; });
	}//nodeMouseOver

	//Mouse out a language circle
	function nodeMouseOut(d) {
		//Bring everything back to normal
		pt.inEnglishNetwork.svg.selectAll(".node").style("opacity", 1);
		pt.inEnglishNetwork.svg.selectAll(".link").style("opacity", 1);
		pt.inEnglishNetwork.svg.selectAll(".link").selectAll(".link-path")
			.style("opacity", function(d) { return pt.inEnglishNetwork.middle(d) ? middleLinkOpacity : linkOpacity; });
	}//nodeMouseOut

	function neighboring(a, b) { 
		return linkedByIndex[a.name + "," + b.name] || linkedByIndex[b.name + "," + a.name]; 
	}//function neighboring

}//init

///////////////////////////////////////////////////////////////////////////
////////////////////////////// Extra functions ////////////////////////////
///////////////////////////////////////////////////////////////////////////

//Is the link attached to the middle circle
pt.inEnglishNetwork.middle = function(d) {
	return d.source.name === pt.inEnglishNetwork.middleLang || d.target.name === pt.inEnglishNetwork.middleLang;
}//function middle

pt.inEnglishNetwork.middleOld = function(d) {
	return d.source.name === pt.inEnglishNetwork.middleLangOld || d.target.name === pt.inEnglishNetwork.middleLangOld;
}//function middleOld

///////////////////////////////////////////////////////////////////////////
///////////////////////// Do all the textPath things //////////////////////
///////////////////////////////////////////////////////////////////////////

pt.inEnglishNetwork.updateLinkTextPaths = function() {

	//Remove all the text paths, because we need to recalculate the text lengths
	pt.inEnglishNetwork.svg.selectAll("textPath").remove();

	//Add the bold middle translation back in
	pt.inEnglishNetwork.svg.selectAll(".link-text-bold")
		.filter(function(d) { return pt.inEnglishNetwork.middle(d); })
		.each(function(d) {
	    	var el = d3.select(this);

	    	var startOff = d.st === "stn" ? "60%" : "40%";
	    	if(d.target.name === pt.inEnglishNetwork.middleLang) startOff = d.st === "stn" ? "40%" : "60%";

			el.append("textPath")
				.style("text-shadow", "0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff")
			  	.attr("class", "link-text-middle")
			  	.attr("startOffset", startOff)
			  	.style("text-anchor","middle")
			  	.style("opacity", 0)
				.attr("xlink:href", "#link-id-" + d.index)
				.text(d.translation);
		});

	//Now show them
	pt.inEnglishNetwork.svg.selectAll("textPath")
		.transition("fade").duration(500)
		.style("opacity", 1);
}//function updateLinkTextPaths

///////////////////////////////////////////////////////////////////////////
/////////////////////////// Calculate the paths ///////////////////////////
///////////////////////////////////////////////////////////////////////////

//Calculate the path shape of the links
pt.inEnglishNetwork.linkPathCalculation = function(d) {

	//The fraction of the radius the links should expand outward
    var radiusNOdd = [-0.3, 0.3, 0.5];
    var radiusNEven = [-0.9, 0.2, 0.5];

	var dx = d.target.x - d.source.x,
    	dy = d.target.y - d.source.y,
    	dr = Math.sqrt(dx * dx + dy * dy),
     	arc;

    d.sweepflag = d.linknum % 2 === 0 ? 1 : 0;
    d.st = "stn"; //Normal from source to target line

    //Figure out the best radius to give the arc
    if(d.max%2 === 1) { //Is the total number of links uneven
    	if(d.linknum === 1) { //For the first link
    		//If there are multiple links to draw between these nodes, make the first straight
    		if(d.max !== 1) {
    			d.arc = 0
    		} else { //If there is only 1 link, make it curved
    			//For the line towards the center, just make it all clockwise
    			if(d.source.name === pt.inEnglishNetwork.middleLang) {
    				d.sweepflag = 1;
    			} else if(d.target.name === pt.inEnglishNetwork.middleLang) {
    				d.sweepflag = 0;
    			} else { //For the rest, figure out in which quadrant it lies wrt the source
	        		var da = (d.target.angle - d.source.angle)/Math.PI;
					if( (da >= 0 && da < 1) || (da >= -2 && da < -1) ) {
						d.sweepflag = 1;
					}//if	        				
    			}//else
				d.arc = dr; 
			}//else
    	} else { //for the links greater than number 1
    		d.arc = dr - radiusNOdd[Math.floor(d.linknum/2)-1] * dr;
    	}//else
    } else { //for the even numbered total links
    	d.arc = dr - radiusNEven[Math.ceil(d.linknum/2)-1] * dr;
    } //else

    var x1 = round2(d.source.x),
    	y1 = round2(d.source.y),
		x2 = round2(d.target.x),
		y2 = round2(d.target.y);

    //Make sure the middle paths, on which text will be written will be sort of upside
    if(pt.inEnglishNetwork.middle(d)) {
    	if(d.source.name === pt.inEnglishNetwork.middleLang && d.target.x < 0) { 
    		//middlelang is the source & target is on the left of the middle node
			d.sweepflag = d.sweepflag ? 0 : 1;
			d.st = "str"; //Reversed: from target to source line
			x1 = round2(d.target.x);
			y1 = round2(d.target.y);
			x2 = round2(d.source.x);
			y2 = round2(d.source.y);
    	} else if(d.target.name === pt.inEnglishNetwork.middleLang && d.source.x > 0) { 
    		//middleLang is the target & source is on the right of the middle node
			d.sweepflag = d.sweepflag ? 0 : 1;
			d.st = "str"; //Reversed: from target to source line
			x1 = round2(d.target.x);
			y1 = round2(d.target.y);
			x2 = round2(d.source.x);
			y2 = round2(d.source.y);
    	}//else if
    }//if

	var path = "M" + x1 + "," + y1 + " A" + round2(d.arc) + "," + round2(d.arc) + " 0 0," + d.sweepflag + " " + x2 + "," + y2;
    return path;
}//function linkPathCalculation

//Intermediate link path calculation for when the center node switches
pt.inEnglishNetwork.linkPathCalculationSwitch = function(d) {

    var sweepflag;
    var st = "stn";

    var x1 = round2(d.source.xOld),
    	y1 = round2(d.source.yOld),
		x2 = round2(d.target.xOld),
		y2 = round2(d.target.yOld);

    //Make sure the middle paths, on which text will be written will be sort of upside
    if(pt.inEnglishNetwork.middle(d)) {
    	if(d.source.name === pt.inEnglishNetwork.middleLang && d.target.x < 0) { 
    		//middlelang is the source & target is on the left of the middle node
			st = "str";
			x1 = round2(d.target.xOld);
			y1 = round2(d.target.yOld);
			x2 = round2(d.source.xOld);
			y2 = round2(d.source.yOld);
    	} else if(d.target.name === pt.inEnglishNetwork.middleLang && d.source.x > 0) { 
    		//middleLang is the target & source is on the right of the middle node
			st = "str";
			x1 = round2(d.target.xOld);
			y1 = round2(d.target.yOld);
			x2 = round2(d.source.xOld);
			y2 = round2(d.source.yOld);
    	}//else if
    }//if

    //Rules to figure out what the sweepflag should be
    if(d.st === "stn" && st === "stn") sweepflag = d.sweepflag;
    if((d.st === "str" && st === "stn") || (d.st === "stn" && st === "str")) sweepflag = d.sweepflag ? 0 : 1;
    //if(d.st === "str" && st === "str") console.log("from str to str");

	var path = "M" + x1 + "," + y1 + " A" + round2(d.arc) + "," + round2(d.arc) + " 0 0," + sweepflag + " " + x2 + "," + y2;
    return path;

}//function linkPathCalculationSwitch


