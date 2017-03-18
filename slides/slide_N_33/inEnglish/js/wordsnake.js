/////////////////////////////////////////////////////////////////////////////////////
// Create the visualization with word snake around the most translated word of all //
/////////////////////////////////////////////////////////////////////////////////////
var resizeWordSnake;

function createWordSnake() {

	///////////////////////////////////////////////////////////////////////////
	////////////////////////////// Set up the SVG /////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	var divWidth = parseInt(d3.select("#viz-word-snake").style("width"));
	var margin = {
	  top: 10,
	  right: 10,
	  bottom: 40,
	  left: 10 
	};
	var width = divWidth - margin.left - margin.right;
	var height = width;

	//SVG container
	var svg = d3.select("#viz-word-snake").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");

	var parseTime = d3.timeParse("%Y-%m-%d");

	///////////////////////////////////////////////////////////////////////////
	/////////////////////// Create the tooltip line chart /////////////////////
	///////////////////////////////////////////////////////////////////////////

	var tooltipPadding = 40;
	var tooltipMaxSize = 1;
	var tooltipAvailWidth = divWidth*tooltipMaxSize - tooltipPadding;
	var tooltipMaxWidth = 450;
	var ttMiddle = tooltipAvailWidth < tooltipMaxWidth;
	//The size of the annotation dotted circle
	var annotationCircleRadius = ttMiddle ? 10 : 15;

	var tmargin = {
	  top: 20,
	  right: 10,
	  bottom: 20,
	  left: 60 
	};
	if(ttMiddle) tmargin.left = 30;

	var twidth = Math.min(tooltipAvailWidth, tooltipMaxWidth) - tmargin.left - tmargin.right;
	var theight = Math.max(twidth*1/4, 80);

	var tooltip = d3.select("#tooltip-chart").append("svg")
		.attr("width", twidth + tmargin.left + tmargin.right)
		.attr("height", theight + tmargin.top + tmargin.bottom)
		.append("g")
		.attr("transform", "translate(" + tmargin.left + "," + tmargin.top + ")");

	var tooltipOffset = 15;
	if(window.innerWidth > 690) tooltipOffset = 0;

	//line function
	var line = d3.line()
		.curve(d3.curveCatmullRomOpen)
      	.x(function(d) { return xScale(d.date); })
      	.y(function(d) { return yScale(d.hits); });

	//Create the scales and axes
	var xScale = d3.scaleTime()
		.range([0, twidth]);
	var yScale = d3.scaleLinear()
		.domain([0,100])
		.range([theight, 0]);

	//Create the x-axis
 	var xAxis = tooltip.append("g")
	    .attr("class", "axis axis-x")
	    .attr("transform", "translate(" + 0 + "," + theight + ")");

 	var yAxis = tooltip.append("g")
	    .attr("class", "axis axis-y")
	    .attr("transform", "translate(" + (twidth) + "," + 0 + ")")
	    .call(d3.axisLeft(yScale).tickSize(twidth + tmargin.left).tickValues([25,50,75,100]));
	//Move the y axis textual values
	var newWords = ["","half as popular","","max search popularity"];
	if(ttMiddle) newWords = ["","50%","","max popularity"];
	tooltip.selectAll(".axis-y text")
		.attr("transform", "translate(2,-7)")
		.text(function(d,i) { return newWords[i]; });
	//Adjust the axes line length a bit
	tooltip.selectAll(".axis-y line")
		.attr("x2", function(d,i) { 
			if(i%2 === 0) return -twidth;
			else return -(twidth + tmargin.left); 
		});

	//Set-up the line
	var tooltipLine = tooltip.append("path")
      	.attr("class", "tooltip-line")
      	.style("stroke", darkgrey);

    //Set-up the annotation
	var annotationGroup = tooltip
	  	.append("g")
	  	.attr("class", "annotation-group");
	//Set up the extra circles on the annotation
	var annotationCircleGroup = tooltip
	  	.append("g")
	  	.attr("class", "annotation-circle");

	//Set-up the tooltip function
	var makeAnnotations = d3.annotation()
	  	.accessors({
	    	x: function(d) { return xScale(parseTime(d.date)); },
	    	y: function(d) { return yScale(d.hits); }
	  	});

	///////////////////////////////////////////////////////////////////////////
	////////////////// Create the tooltip related words chart /////////////////
	///////////////////////////////////////////////////////////////////////////

	var wmargin = {
	  top: 10,
	  right: 0,
	  bottom: 0,
	  left: 0 
	};

	var wwidth = Math.min(tooltipAvailWidth, tooltipMaxWidth) - wmargin.left - wmargin.right;
	var wheight = Math.max(wwidth*1/4, 80);
	if(ttMiddle) wheight = 120;

	//Create the wordcloud svg
	var tooltipWordcloud = d3.select("#tooltip-word-chart").append("svg")
		.attr("width", wwidth + wmargin.left + wmargin.right)
		.attr("height", wheight + wmargin.top + wmargin.bottom)
		.append("g")
		.attr("transform", "translate(" + (wmargin.left+wwidth/2) + "," + (wmargin.top+wheight/2) + ")");

	//Create the scales
	var wordCloudScale = d3.scalePow()
		.exponent(4)
		.domain([0,100])
		.range([9,(ttMiddle ? 14 : 18)])
		.clamp(true);

	var colorScale = d3.scaleLinear()
		.domain([0, 100])
		.range(["#afafaf","#161616"]);

	//Initiate the word cloud layout
	//https://github.com/jasondavies/d3-cloud
	//http://blockbuilder.org/bricedev/8b2da06ddef27d94cde9
	var wordcloudLayout = d3.layout.cloud()
	    .size([wwidth, wheight])
	    .rotate(0)
	    .padding(function(l) { return wordCloudScale(l.score)/4; })
	    .font(function(l) { return l.score > 50 ? "'Dancing Script', cursive" : "'Lato', sans-serif"; })
	    .fontSize(function(l,i) { return (l.score > 50 ? 2 : 1) * wordCloudScale(l.score); })
	    .text(function(l) { return l.related; })
	    .spiral("archimedean")
	    .on("end", drawWordCloud);

	//Place the wordcloud texts
  	function drawWordCloud(words) {
  		tooltipWordcloud.selectAll(".word-cloud")
  			.remove();
		tooltipWordcloud.selectAll(".word-cloud")
	        .data(words)
	    	.enter().append("text")
	        .attr("class","word-cloud")
	        .style("font-size", function(d) { return d.size + "px"; })
	        .style("font-family", function(d) { return d.font; })
	        .style("fill", function(d) { return colorScale(d.score); })
	        .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
	        .text(function(d) { return d.text; });
  	}//function drawWordCloud

	///////////////////////////////////////////////////////////////////////////
	///////////////////// Variables for tooltip placement /////////////////////
	///////////////////////////////////////////////////////////////////////////

	var tooltipHeight = parseInt(d3.select("#tooltip").style("height"));
	var tooltipWidth = parseInt(d3.select("#tooltip").style("width"));
	var chartOffsetTop = document.getElementById("viz-word-snake").offsetTop;
	var chartOffsetLeft = document.getElementById("viz-word-snake").offsetLeft;

	///////////////////////////////////////////////////////////////////////////
	///////////////////// Figure out variables for layout /////////////////////
	///////////////////////////////////////////////////////////////////////////

	var angle = 35 * Math.PI/180;
	var radius = 75;
	var newXmargin = margin.left; 
	var n;

	function calculateGrid() {
		//How many circles fir in one "row"
		var s = width / Math.cos(angle);
		var numCircle = Math.min(4, Math.floor(s / (2*radius)));
		//I don't want 1 circle
		if(numCircle === 1) numCircle = 2;
		//If it's not an exact fit, make it so
		radius = Math.min(radius, round2((s/numCircle)/2));

		//Save the x-locations if each circle
		var xLoc = new Array(numCircle);
		for(var i = 0; i<numCircle; i++){
			xLoc[i] = round2( (1 + 2*i) * radius * Math.cos(angle)); 
		}//for i

		//Locations for the textPath
		var xLocArc = new Array(numCircle+1);
		for(var i = 0; i<=numCircle; i++){
			xLocArc[i] = round2(2*i * radius * Math.cos(angle)); 
		}//for i

		//New width & divide margins so it will sit in the center
		width = xLocArc[numCircle];
		newXmargin = round2((divWidth - width)/2);
		svg.attr("transform", "translate(" + newXmargin + "," + (margin.top) + ")");

		return {xLoc: xLoc, xLocArc: xLocArc, numCircle: numCircle };
	}//function calculateGrid

	var grid = calculateGrid();

	///////////////////////////////////////////////////////////////////////////
	//////////////////////////// Read in the data /////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	d3.queue() 
	  .defer(d3.csv, "data/top1_per_language_English_combined.csv")
	  .defer(d3.csv, "data/top100_overall.csv")
	  .defer(d3.csv, "data/google_trends_data_top_1_words.csv")
	  .defer(d3.csv, "data/relatedCombined.csv")
	  .await(drawWordSnake);

	function drawWordSnake(error, top1, top100Overall, trends, related) {

		///////////////////////////////////////////////////////////////////////////
		///////////////////////////// Final data prep /////////////////////////////
		///////////////////////////////////////////////////////////////////////////
		
		if (error) throw error;

		top100Overall.forEach(function(d,i) {
			d.rank = +d.rank;
			//d.totalWord = (i+1) + " " + d.translation + "\u00A0\u00A0";
			d.totalWord = d.translation + "\u00A0\u00A0";
		});

		top1.forEach(function(d) {
			d.frequency = +d.frequency;
		});

		trends.forEach(function(d) {
			d.hits = +d.hits;
			d.date = parseTime(d.week);
		});
		// Scale the range of the trend data
   	 	xScale.domain(d3.extent(trends, function(d) { return d.date; }));
   	 	xAxis.call(d3.axisBottom(xScale));

		related.forEach(function(d) {
			d.score = +d.score;
		});

		///////////////////////////////////////////////////////////////////////////
		//////////////////////////// Create node data /////////////////////////////
		///////////////////////////////////////////////////////////////////////////

		var nodes = [];

		top1.forEach(function(d,i) {
			//Are there more original words for this translation?
			var words = d.original.split(" | ");
			nodes.push({
				rank: i,
				frequency: d.frequency,
				radius: radius,
				translation: d.translation,
				original: d.original,
				language: languageMap[d.language],
				originalMore: words.length > 1,
				counter: 0,
				originalSeparate: words
			})
		});

		n = nodes.length;

		///////////////////////////////////////////////////////////////////////////
		///////////////////////////// Create the nodes ////////////////////////////
		///////////////////////////////////////////////////////////////////////////

		var nodeWrapper = svg.append("g").attr("class", "node-wrapper");

		//Create a group for each circle
		var pos = 0, add = 1;
	  	var node = nodeWrapper.selectAll(".node")
			.data(nodes)
	    	.enter().append("g")
	        .attr("class", "node noselect")
	        .attr("transform", function(d,i) { 
	        	//Save the locations
	        	d.x = grid.xLoc[pos];
        		d.y = (1 + 2*i) * radius * Math.sin(angle);

        		//Figure out which position of the xLoc to use on the next one
        		if(pos === grid.numCircle-1) { add = -1; }
	        	else if (pos === 0) { add = 1; }
	        	pos = pos + add;

        		return "translate(" + d.x + "," + d.y + ")";
        	})
        	.on("mouseover", mouseoverNode)
        	.on("mouseout", hideTooltip)
        	.on("click", clickOnNode);

        //Hide tooltip again on body/svg click
        d3.select("body").on("click", hideTooltip);
        d3.select("#viz-word-snake").on("click", hideTooltip);
        d3.select("#tooltip-close").on("click", hideTooltip);

		///////////////////////////////////////////////////////////////////////////
		//////////////////////// Create the central words /////////////////////////
		///////////////////////////////////////////////////////////////////////////

		//Create background circle for the hover & click
		node.append("circle")
			.attr("class", "circle-background")
			.attr("r", radius);

	    //Attach center words to each group
		var originalText = node.append("text")
	    	.attr("class", "circle-center-original")
	    	.attr("y", 0)
	    	.attr("dy", "0.35em")
	    	.style("fill", darkgrey)
	    	.style("font-family", function(d) { return d.language === "Russian" ? "'Cormorant Infant', serif" : null; })
	    	.text(function(d) { return d.originalSeparate[0]; });
	   	node.append("text")
	    	.attr("class", "circle-center-translation")
	    	.attr("y", 22)
	    	.attr("dy", "0.35em")
	    	.style("fill", "#787878")
	    	.text(function(d) { return d.translation; });
	    node.append("text")
	    	.attr("class", "circle-center-language")
	    	.attr("dy", "0.35em")
	    	.attr("y", -25)
	    	.style("fill", lightgrey)
	    	.text(function(d) { return d.language; });

		///////////////////////////////////////////////////////////////////////////
		////////////////////// Create the outer circular paths ////////////////////
		///////////////////////////////////////////////////////////////////////////

	    //Create path
	    svg.append("path")
	    	.attr("class", "circle-path")
	    	.attr("id", "circle-word-path")
	    	//.style("stroke", "#d2d2d2")
	    	.attr("d", calculateSnakePath(grid, n));
		
		//Create the text itself
		var wordString = "1 ";
		top100Overall.forEach(function(d,i) {
			var rank = "";
			if((i+1) % 10 === 0) rank = (i+1) + " ";
			wordString = wordString + rank + d.translation + "\u00A0\u00A0" ;
		});

	   	//Create text on path
	    var wordSnake = svg.append("text")
			.attr("class", "circle-path-text noselect")
			.style("fill", "none")
			.attr("dy", "0.15em")
			.append("textPath")
				.attr("id", "top-word-string")
			  	.style("text-anchor","middle")
			  	.style("fill", lightgrey)
				.attr("xlink:href", "#circle-word-path")
				.attr("startOffset", "0%")
				.text(wordString + "\u00A0\u00A0\u00A0" + wordString);
				//.text(top100Overall.map(function(d){ return d.translation; }).join("\u00A0\u00A0"));

		///////////////////////////////////////////////////////////////////////////
		/////////////////////// Create the word string legend /////////////////////
		///////////////////////////////////////////////////////////////////////////

		var legend = svg.append("g")
			.attr("class", "word-snake-legend")
			.attr("transform", "translate(" + grid.xLoc[1] +  "," + (3 * radius * Math.sin(angle)) + ")");

		//Create the path for the legend
		legend.append("path")
	    	.attr("class", "circle-path")
	    	.attr("id", "circle-legend-path")
	    	//.style("stroke", "#d2d2d2")
	    	.attr("d", function(d) {
	    		var r = radius * 1.2;
	    		return "M" + (-r*Math.cos(angle)) + "," + (-r*Math.sin(angle)) + 
	    				" A" + r + "," + r + " 0 1,1" + (-r*Math.cos(angle*0.99)) + "," + (-r*Math.sin(angle*0.99)) + " ";
	    	});

	    //Append text to path
		legend.append("text")
			.attr("class", "circle-path-legend noselect")
			.style("fill", "none")
			.attr("dy", "0.15em")
			.append("textPath")
			  	.style("text-anchor","middle")
			  	.attr("startOffset", "25%")
			  	.style("fill", darkgrey)
				.attr("xlink:href", "#circle-legend-path")
				.text("the most often translated words across all languages");	

		///////////////////////////////////////////////////////////////////////////
		////////////////////////// Mouse and Click events /////////////////////////
		///////////////////////////////////////////////////////////////////////////

		function mouseoverNode(d) {
			//Stop propagation to the SVG
  			d3.event.stopPropagation();
  			
  			//Hide the X mark in the top right because it's a hover
			//d3.select("#tooltip-close").style("visibility", "hidden");

			//Find the locations of the center of the tooltip on top of the x and y
			var ypos = d.y + margin.top + chartOffsetTop - tooltipHeight/2;
			var xpos = chartOffsetLeft + newXmargin + d.x - tooltipWidth/2;

			//Find the dimensions of the tooltip
			var nodeLoc = this.getBoundingClientRect();
			//See where the best placement is, otherwise place it above
			if(nodeLoc.top + 0.25*radius > tooltipHeight*0.9) { //Does the tooltip fit above?
				ypos = ypos - 0.5*tooltipHeight - 0.5*radius;
			} else if(window.innerHeight - nodeLoc.bottom + 0.25*radius > tooltipHeight*0.9) { //Does the tooltip fit below?
				ypos = ypos + 0.5*tooltipHeight + 0.5*radius;
			} else if (nodeLoc.left > tooltipWidth) { //Does the tooltip fit left?
				xpos = xpos - 0.5*tooltipWidth - 0.75*radius;
			} else if (window.innerWidth - nodeLoc.right > tooltipWidth) { //Does the tooltip fit right?
				xpos = xpos + 0.5*tooltipWidth + 0.75*radius;
			} else { //The default is to place it above or below depending on which has the most space
				if(window.innerHeight - (nodeLoc.top + radius) < window.innerHeight/2) ypos = ypos - 0.5*tooltipHeight - 0.5*radius;
				else ypos = ypos + 0.5*tooltipHeight + 0.5*radius;
			}//else

			//If the window is smaller than the max size of the tooltip, center it
			if(window.innerWidth < 900) xpos = divWidth/2 + chartOffsetLeft - tooltipWidth/2;

			showTooltip(d, xpos, ypos);
		}//function showTooltip

		function hideTooltip(d) {
			//Hide tooltip
			d3.select("#tooltip")
				.transition("tooltip").duration(300)
				.style("opacity", 0);
		}//function hideTooltip

		function clickOnNode(d) {
			//Stop propagation to the SVG
  			d3.event.stopPropagation();

  			//Hide the X mark in the top right because it's a hover
			//d3.select("#tooltip-close").style("visibility", "visible");

			//If the window is smaller than the max size of the tooltip, center it
			if(window.innerWidth < 900) {
				xpos = divWidth/2 + chartOffsetLeft - tooltipWidth/2;
				//Where is the top of the SVG
				var SVGtop = document.getElementById('viz-word-snake').getBoundingClientRect();
				ypos = margin.top + chartOffsetTop - SVGtop.top + window.innerHeight/2 - tooltipHeight/2;
			} else {

				//Find the locations of the center of the tooltip on top of the x and y
				var ypos = d.y + margin.top + chartOffsetTop - tooltipHeight/2;
				var xpos = chartOffsetLeft + newXmargin + d.x - tooltipWidth/2;

				//Find the dimensions of the tooltip
				var nodeLoc = this.getBoundingClientRect();
				//See where the best placement is, otherwise place it above
				if(nodeLoc.top + 0.25*radius > tooltipHeight*0.9) { //Does the tooltip fit above?
					ypos = ypos - 0.5*tooltipHeight - 0.5*radius;
				} else if(window.innerHeight - nodeLoc.bottom + 0.25*radius > tooltipHeight*0.9) { //Does the tooltip fit below?
					ypos = ypos + 0.5*tooltipHeight + 0.5*radius;
				} else if (nodeLoc.left > tooltipWidth) { //Does the tooltip fit left?
					xpos = xpos - 0.5*tooltipWidth - 0.75*radius;
				} else if (window.innerWidth - nodeLoc.right > tooltipWidth) { //Does the tooltip fit right?
					xpos = xpos + 0.5*tooltipWidth + 0.75*radius;
				} else { //The default is to place it above
					ypos = ypos - 0.5*tooltipHeight - 0.5*radius;
				}//else

			}//else

  			showTooltip(d, xpos, ypos);
		}//function clickOnNode

		//Function to show the tooltip when hovering/clicking on a node
		function showTooltip(d, xpos, ypos) {

			//Change title
			d3.select("#tooltip-translation").text(d.translation);

			//Show and move the tooltip
			d3.select("#tooltip")
				.style("top", ypos + "px")
				.style("left", xpos + "px")
				.transition("tooltip").duration(400)
				.style("opacity", 1);

			//Create the line chart
			tooltipLine.datum(trends.filter(function(l) { return l.word === d.translation; }))
				.attr("d", line);

			//Get the correct annotations for the chosen language
			var ann = setupAnnotation(d.translation);
			//Feed the new data to the annotation function
			makeAnnotations.annotations(ann.annotations);
			//Create the annotation
			annotationGroup.call(makeAnnotations);

			//Add extra circles without textual annotations
			annotationCircleGroup.selectAll(".annotation-circle")
				.remove();
			annotationCircleGroup.selectAll(".annotation-circle")
				.data(ann.annotationCircles.filter(function(l) { return l.date !== ann.annotations[0].data.date; }))
				.enter().append("circle")
				.attr("class", "annotation-circle")
				.attr("cx", function(d) { return xScale(parseTime(d.date)); })
				.attr("cy", function(d) { return yScale(d.hits); })
				.attr("r", annotationCircleRadius);

			//Update the related words
			wordcloudLayout
				.words(related.filter(function(l) { return l.word === d.translation; }))
				.start();
		}//function showTooltip

	};//function drawWordSnake

	///////////////////////////////////////////////////////////////////////////
	/////////////// Calculate the arching path between the words //////////////
	///////////////////////////////////////////////////////////////////////////

	function calculateSnakePath(grid, n) {
	    var pos = 0, add = 1;
		function newPos() {
			if(pos === grid.numCircle) { add = -1; } 
        	else if (pos === 0) { add = 1; }
	        pos = pos + add;
		}//newPos

		var xOld = 0, 
			yOld = 0,
			sweep = 0,
			switchSide = 1;

		var path = "M0,0 ";

		//Construct the custom SVG paths out of arcs
		for(var i = 1; i <= n; i++) {

			if(i !== 1 && (i-1)%(grid.numCircle-1) === 0 && grid.numCircle%2 === 1 && switchSide === 1) {
				//For the outside in an uneven row count when the arc should be the short side
				//console.log(i, "outer side, short arc");
				switchSide = 0;

	        	x = grid.xLocArc[pos];
	        	newPos();
	        	newPos();

	        	y = yOld + round2( 2 * radius * Math.sin(angle) );
    			path = path + " A" + radius + "," + radius + " 0 0," + sweep + " " + x + "," + y + " ";
    			yOld = y;
    			sweep = sweep ? 0 : 1;

			} else if (i !== 1 && (i-1)%(grid.numCircle-1) === 0) {	    				
				//For the outside rows in the even row count or,
				//For the outside in an uneven row count when the arc should be the long side
				//console.log(i, "outer side, long arc");
				if(grid.numCircle%2 === 1) switchSide = 1;

        		newPos();
	        	x = grid.xLocArc[pos];
	        	y = yOld + round2( 2 * radius * Math.sin(angle) );
    			path = path + " A" + radius + "," + radius + " 0 0," + sweep + " " + x + "," + y + " ";
        		
        		newPos();
	        	x = grid.xLocArc[pos];
	        	path = path + " A" + radius + "," + radius + " 0 0," + sweep + " " + x + "," + y + " ";

	        	xOld = x;
				yOld = y;
				sweep = sweep ? 0 : 1;

			} else {
				//For the inbetween circles
				//console.log(i, "inbetween");

    			newPos()
	        	x = grid.xLocArc[pos];
	        	y = yOld + round2( 2 * radius * Math.sin(angle) );
    			path = path + " A" + radius + "," + radius + " 0 0," + sweep + " " + x + "," + y + " ";
    			xOld = x;
    			yOld = y;
    			sweep = sweep ? 0 : 1;

			}//else

		}//for i

		//Adjust the height of the SVG
		height = yOld;
		d3.select("#viz-word-snake svg").attr("height", height + margin.top + margin.bottom);

		return path;
	}//function calculateSnakePath

	///////////////////////////////////////////////////////////////////////////
	//////////////////////// Resize the path on an update /////////////////////
	///////////////////////////////////////////////////////////////////////////

	resizeWordSnake = function() {
		//console.log("resize word snake");

		// ------------------------ Update the SVGs --------------------------- //

		divWidth = parseInt(d3.select("#viz-tree-ring").style("width"));
		width = divWidth - margin.left - margin.right;

		//Adjust SVG container
		d3.select("#viz-word-snake svg").attr("width", width + margin.left + margin.right);
		svg = d3.select("#viz-word-snake svg g");

		// --------------------- Update locations and sizes ---------------------- //
		
		grid = calculateGrid();

		//Adjust the node locations
		var pos = 0, add = 1;
	  	var node = svg.selectAll(".node")
	        .attr("transform", function(d,i) { 
	        	//Save the locations
	        	d.x = grid.xLoc[pos];
        		d.y = (1 + 2*i) * radius * Math.sin(angle);

        		//Figure out which position of the xLoc to use on the next one
        		if(pos === grid.numCircle-1) { add = -1; }
	        	else if (pos === 0) { add = 1; }
	        	pos = pos + add;

        		return "translate(" + d.x + "," + d.y + ")";
        	});

        //Adjust the path
        svg.select("#circle-word-path")
	    	.attr("d", calculateSnakePath(grid, n));

       	//Adjust the legend location
       	svg.select(".word-snake-legend")
       		.attr("transform", "translate(" + grid.xLoc[1] +  "," + (3 * radius * Math.sin(angle)) + ")");

       	// --------------------- Update the tooltip line chart ---------------------- //

		tooltipAvailWidth = divWidth*tooltipMaxSize - tooltipPadding;
		ttMiddle = tooltipAvailWidth < tooltipMaxWidth;
		//The size of the annotation dotted circle
		annotationCircleRadius = ttMiddle ? 10 : 15;
		//New sizes of the chart
		tmargin.left = ttMiddle ? 30 : 60;
		twidth = Math.min(tooltipAvailWidth, tooltipMaxWidth) - tmargin.left - tmargin.right;
		theight = Math.max(twidth*1/4, 80);

		//Adjust the tooltip SVG
		d3.select("#tooltip-chart svg")
			.attr("width", twidth + tmargin.left + tmargin.right)
			.attr("height", theight + tmargin.top + tmargin.bottom)
		tooltip.attr("transform", "translate(" + tmargin.left + "," + tmargin.top + ")");

		tooltipOffset = window.innerWidth > 690 ? 0 : 15;

		//Adjust the scales and axes
		xScale.range([0, twidth]);
		yScale.range([theight, 0]);

		//Adjust the axes
	 	xAxis.attr("transform", "translate(" + 0 + "," + theight + ")")
	 		.call(d3.axisBottom(xScale));
		yAxis.attr("transform", "translate(" + (twidth) + "," + 0 + ")")
		    .call(d3.axisLeft(yScale).tickSize(twidth + tmargin.left).tickValues([25,50,75,100]));
		//Move the y axis textual values
		var newWords = ["","half as popular","","max search popularity"];
		if(ttMiddle) newWords = ["","50%","","max popularity"];
		tooltip.selectAll(".axis-y text")
			.text(function(d,i) { return newWords[i]; });
		//Adjust the axes line length a bit
		tooltip.selectAll(".axis-y line")
			.attr("x2", function(d,i) { 
				if(i%2 === 0) return -twidth;
				else return -(twidth + tmargin.left); 
			});

		// --------------------- Update the tooltip word cloud ---------------------- //

		wwidth = Math.min(tooltipAvailWidth, tooltipMaxWidth) - wmargin.left - wmargin.right;
		wheight = ttMiddle ? 120 : Math.max(wwidth*1/4, 80);

		d3.select("#tooltip-word-chart svg")
			.attr("width", wwidth + wmargin.left + wmargin.right)
			.attr("height", wheight + wmargin.top + wmargin.bottom)
		tooltipWordcloud.attr("transform", "translate(" + (wmargin.left+wwidth/2) + "," + (wmargin.top+wheight/2) + ")");

		//Create the scales
		wordCloudScale
			.range([9,(ttMiddle ? 14 : 18)]);

		//Adjust the word cloud layout
		wordcloudLayout = d3.layout.cloud()
		    .size([wwidth, wheight])
		    .rotate(0)
		    .padding(function(l) { return wordCloudScale(l.score)/4; })
		    .font(function(l) { return l.score > 50 ? "'Dancing Script', cursive" : "'Lato', sans-serif"; })
		    .fontSize(function(l,i) { return (l.score > 50 ? 2 : 1) * wordCloudScale(l.score); })
		    .text(function(l) { return l.related; })
		    .spiral("archimedean")
		    .on("end", drawWordCloud);

		// --------------------- Update the tooltip positioning ---------------------- //

		tooltipHeight = parseInt(d3.select("#tooltip").style("height"));
		tooltipWidth = parseInt(d3.select("#tooltip").style("width"));
		chartOffsetTop = document.getElementById("viz-word-snake").offsetTop;
		chartOffsetLeft = document.getElementById("viz-word-snake").offsetLeft;

	}//function resizeWordSnake

	///////////////////////////////////////////////////////////////////////////
	///////////////////////// The different annotations ///////////////////////
	///////////////////////////////////////////////////////////////////////////

	function setupAnnotation(word) {

		var annotations = [];
		var annotationCircles = [];

		if(word === "colleague") {
			annotations = [{
		        note: {label: "No need to search for colleagues leaving during Christmas", wrap: 120 },
		        data: {date: "2014-12-28", hits: 52},
		        type: d3.annotationCalloutCircle,
		        dy: -60,
		        dx: 45,
		        subject: {
		          radius: annotationCircleRadius,
		          radiusPadding: 5
		        }
		    }];
			//For the small chart, place the annotation somewhere else
			if(ttMiddle) {
				annotations[0].note = {label: "No colleagues leaving during Christmas?", wrap: 100 },
				annotations[0].data = {date: "2013-12-22", hits: 45},
				annotations[0].dy = 9;
				annotations[0].dx = 20;
			}//if
			//Add extra circles without annotations
			annotationCircles = [
				{date: "2012-12-23", hits: 43},
				{date: "2013-12-22", hits: 45},
				{date: "2014-12-28", hits: 52},
				{date: "2015-12-27", hits: 60},
				{date: "2016-12-25", hits: 60},
			];
		} else if(word === "good") {
			annotations = [{
		        note: {label: "The yearly interest in Good Friday, a Christian holiday", wrap: 140 },
		        data: {date: "2014-04-13", hits: 97},
		        type: d3.annotationCalloutCircle,
		        dy: 40,
		        dx: 30,
		        subject: {
		          radius: annotationCircleRadius,
		          radiusPadding: 5
		        }
		    }];
			//For the small chart, place the annotation somewhere else
			if(ttMiddle) {
				annotations[0].note = {label: "The yearly interest in Good Friday", wrap: 110 },
				annotations[0].data = {date: "2013-03-24", hits: 93},
				annotations[0].dy = 33;
				annotations[0].dx = 35;
			}//if
			//Add extra circles without annotations
			annotationCircles = [
				{date: "2012-04-01", hits: 90},
				{date: "2013-03-24", hits: 93},
				{date: "2014-04-13", hits: 97},
				{date: "2015-03-29", hits: 99},
				{date: "2016-03-20", hits: 100},
			];
		} else if(word === "beautiful") {
			annotations = [
				{
			        note: {label: "South Korean drama 'To the beautiful you' runs for 16 weeks", wrap: 100 },
			        data: {date: "2012-09-16", hits: 95},
			        type: d3.annotationCalloutCircle,
			        dy: -40,
			        dx: -10,
			        subject: {
			          radius: annotationCircleRadius,
			          radiusPadding: 5
			        }
			    },{
			        note: {label: "Lana Del Rey, Mariah Carey & Candice Glover all release a song with the word 'beautiful'", wrap: 200 },
			        data: {date: "2013-06-23", hits: 95},
			        type: d3.annotationCalloutCircle,
			        dy: 37,
			        dx: 30,
			        subject: {
			          radius: annotationCircleRadius*1.2,
			          radiusPadding: 5
			        }
			    }];
			//For the small chart, place the annotation somewhere else
			if(ttMiddle) {
				annotations[0].note = {label: "South Korean drama 'To the beautiful you'", wrap: 65 },
				annotations[0].dy = -30;
				annotations[0].dx = -5;
				annotations[1].note = {label: "3 popstars all release a song with the word 'beautiful'", wrap: 140 },
				annotations[1].dy = 32;
				annotations[1].dx = 20;
			}//if
		} else if(word === "work") {
			annotations = [
				{
			        note: {label: "Annual dips to search for work during Christmas", wrap: 120 },
			        data: {date: "2012-12-23", hits: 55},
			        type: d3.annotationCalloutCircle,
			        dy: -65,
			        dx: -20,
			        subject: {
			          radius: annotationCircleRadius,
			          radiusPadding: 5
			        }
			    },{
				    note: {label: "Fifth Harmony releases 'Work from Home' after Rihanna released 'Work' a month before", wrap: 200 },
			        data: {date: "2016-02-21", hits: 100},
			        type: d3.annotationCalloutCircle,
			        dy: 50,
			        dx: -20,
			        subject: {
			          radius: annotationCircleRadius,
			          radiusPadding: 5
			        }
			    }];
			//For the small chart, place the annotation somewhere else
			if(ttMiddle) {
				annotations[0].note = {label: "Annual dips at Christmas", wrap: 120 };
				annotations[0].dx = 5;
				annotations[0].dy = -45;
				annotations[1].note = {label: "Fifth Harmony releases 'Work from Home'", wrap: 120 };
				annotations[1].dx = -2;
				annotations[1].dy = 45;
			}//if
		} else if(word === "thursday") {
			annotations = [
				{
			        note: {label: "Sharp spikes for holy Thursday, another Christian holiday", wrap: 120 },
			        data: {date: "2013-03-24", hits: 86},
			        type: d3.annotationCalloutCircle,
			        dy: -40,
			        dx: -15,
			        subject: {
			          radius: annotationCircleRadius,
			          radiusPadding: 5
			        }
			    },
			    {
			        note: {label: "The NFL Thursday night football season", wrap: 90 },
			        data: {date: "2015-11-01", hits: 70},
			        type: d3.annotationCalloutCircle,
			        dy: -50,
			        dx: 20,
			        subject: {
			          radius: annotationCircleRadius*1.2,
			          radiusPadding: 5
			        }
			    }];
			//For the small chart, place the annotation somewhere else
			if(ttMiddle) {
				annotations[0].note = {label: "Holy Thursday", wrap: 100 },
				annotations[0].dy = -20;
				annotations[0].dx = 15;
				annotations[1].note = {label: "Thursday night football", wrap: 80 },
				annotations[1].dy = -30;
				annotations[1].dx = 0;
			}//if
		} else if(word === "mama") {
			annotations = [
				{
			        note: { label: "Typical period for Mother's Day", wrap: 100 },
			        data: {date: "2013-05-05", hits: 97},
			        type: d3.annotationCalloutCircle,
			        dy: -40,
			        dx: -30,
			        subject: {
			          radius: annotationCircleRadius,
			          radiusPadding: 5
			        }
			    },{
			        note: { label: "The yearly Mnet Asian Music Awards (MAMA) take place", wrap: 140 },
			        data: {date: "2015-11-29", hits: 96},
			        type: d3.annotationCalloutCircle,
			        dy: 50,
			        dx: -20,
			        subject: {
			          radius: annotationCircleRadius,
			          radiusPadding: 5
			        }
			    },{
			        note: { label: "The horror movie 'Mama' is released", wrap: 100 },
			        data: {date: "2013-01-31", hits: 70},
			        type: d3.annotationCalloutCircle,
			        dy: 35,
			        dx: -20,
			        subject: {
			          radius: annotationCircleRadius*0.9,
			          radiusPadding: 5
			        }
			    }
			];
			//For the small chart, place the annotation somewhere else
			if(ttMiddle) {
				annotations[0].note = { label: "Mother's Day period", wrap: 100};
				annotations[0].data = { date: "2014-05-04", hits: 92};
				annotations[0].dy = 35;
				annotations[0].dx = 15;
				annotations[1].note = { label: "The yearly Mnet Asian Music Awards", wrap: 250};
				annotations[1].dy = -18;
				annotations[1].dx = -5;
				annotations[2].note = { label: "Horror movie 'Mama'", wrap: 100};
				annotations[2].dy = 38;
				annotations[2].dx = 0;
			}//if
		}//else if

		return {annotations: annotations, annotationCircles: annotationCircles};

	}//function setupAnnotation

	///////////////////////////////////////////////////////////////////////////
	//////////////////////////// Animation run times //////////////////////////
	///////////////////////////////////////////////////////////////////////////

	var loopWordsnakeWords = setInterval(loopWords, 4500);
	//Go through the different options for languages with multiple words for the same English translation
	function loopWords() {
		//For the languages that have multiple variants in the original, loop through the words
   		d3.selectAll(".circle-center-original").filter(function(d) { return d.originalMore; })
   			.transition().duration(0).delay(function(d) { return Math.random() * 2500; })
   			.on("end", function() {
   				d3.select(this)
		   			.text(function(d) { 
		   				d.counter = (d.counter + 1) % d.originalSeparate.length;
		   				return d.originalSeparate[d.counter]; 
		   			});
   			});
	}//loopWords

	//Animate the top 100 word snake
	function animateWordSnake() {
		d3.select("#top-word-string")
			.transition("move").duration(120000)
			.ease(d3.easeLinear)
			.attr("startOffset",  "100%")
			.transition("move").duration(120000)
			.ease(d3.easeLinear)
			.attr("startOffset",  "0%");
	}//function animateWordSnake

	//http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
	var checkWordSnake = onVisibilityChange(function(visible) {
		//Stop the animation if the visual is not on the screen
		if(!visible) {
			d3.select("#top-word-string").interrupt("move");
			clearInterval(loopWordsnakeWords);
		} else { //If it is on the screen restart it
			d3.select("#top-word-string").attr("startOffset",  "0%");
			animateWordSnake();
			loopWordsnakeWords = setInterval(loopWords, 4500);
		}//else
	});
	if (window.addEventListener) { 
	    addEventListener('scroll', checkWordSnake, false); 
	    addEventListener('resize', checkWordSnake, false); 
	} else if (window.attachEvent)  {
	    attachEvent('onscroll', checkWordSnake);
	    attachEvent('onresize', checkWordSnake);
	}//else if

	function isElementInViewport (el) {
	    var rect = el.getBoundingClientRect();
	    return (
	        !((rect.top > window.innerHeight && rect.bottom > 0) || (rect.top < 0 && rect.bottom < 0))
	    );
	}//function isElementInViewport
	function onVisibilityChange(callback) {
	    var old_visible;
	    return function () {
	        var visible = isElementInViewport(document.getElementById('viz-word-snake'));
	        if (visible != old_visible) {
	            old_visible = visible;
	            if (typeof callback == 'function') {
	                callback(visible);
	            }//if
	        }//if
	    }//return
	}//function onVisibilityChange

}//function createWordSnake

