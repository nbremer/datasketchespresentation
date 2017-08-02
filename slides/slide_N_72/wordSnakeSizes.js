pt.wordSnakeSizes = pt.wordSnakeSizes || {};

pt.wordSnakeSizes.init = function(top100Overall, top1) {
	
	//Remove any existing svgs
	d3.select('#word-snake-sizes #wordSnakeSizes svg').remove();

	///////////////////////////////////////////////////////////////////////////
	//////////////////// Set up and initiate svg containers ///////////////////
	///////////////////////////////////////////////////////////////////////////	

	pt.wordSnakeSizes.margin = {
		top: 10,
		right: 50,
		bottom: 20,
		left: 50
	};
	pt.wordSnakeSizes.fixedWidth = pt.wordSnakeSizes.width = 800;
	var height = $(".slides").height()*0.85 - pt.wordSnakeSizes.margin.top - pt.wordSnakeSizes.margin.bottom;
	
	//SVG container
	pt.wordSnakeSizes.svgUpper = d3.select('#word-snake-sizes #wordSnakeSizes')
		.append("svg")
		.attr("width", pt.wordSnakeSizes.width)
		.attr("height", height + pt.wordSnakeSizes.margin.top + pt.wordSnakeSizes.margin.bottom );

	pt.wordSnakeSizes.svg = pt.wordSnakeSizes.svgUpper.append("g")
		.attr("transform", "translate(" + pt.wordSnakeSizes.margin.left + "," + pt.wordSnakeSizes.margin.top + ")");
			
	///////////////////////////////////////////////////////////////////////////
	/////////////////////////// General variables /////////////////////////////
	///////////////////////////////////////////////////////////////////////////

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
	///////////////////// Figure out variables for layout /////////////////////
	///////////////////////////////////////////////////////////////////////////

	pt.wordSnakeSizes.angle = 35 * Math.PI/180;
	pt.wordSnakeSizes.radius = 75;
	pt.wordSnakeSizes.n;

	var grid = pt.wordSnakeSizes.calculateGrid();
	pt.wordSnakeSizes.svg.attr("transform", "translate(" + pt.wordSnakeSizes.margin.left + "," + (pt.wordSnakeSizes.margin.top) + ")");

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
			radius: pt.wordSnakeSizes.radius,
			translation: d.translation,
			original: d.original,
			language: languageMap[d.language],
			originalMore: words.length > 1,
			counter: 0,
			originalSeparate: words
		})
	});

	pt.wordSnakeSizes.n = nodes.length;

	///////////////////////////////////////////////////////////////////////////
	///////////////////////////// Create the nodes ////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	var nodeWrapper = pt.wordSnakeSizes.svg.append("g").attr("class", "node-wrapper");

	//Create a group for each circle
	var pos = 0, add = 1;
	var node = nodeWrapper.selectAll(".node")
		.data(nodes)
		.enter().append("g")
		.attr("class", "node noselect")
		.attr("transform", function(d,i) { 
			//Save the locations
			d.x = grid.xLoc[pos];
			d.y = (1 + 2*i) * pt.wordSnakeSizes.radius * Math.sin(pt.wordSnakeSizes.angle);

			//Figure out which position of the xLoc to use on the next one
			if(pos === grid.numCircle-1) { add = -1; }
			else if (pos === 0) { add = 1; }
			pos = pos + add;

			return "translate(" + d.x + "," + d.y + ")";
		})
			
	///////////////////////////////////////////////////////////////////////////
	//////////////////////// Create the central words /////////////////////////
	///////////////////////////////////////////////////////////////////////////

	//Create background circle for the hover & click
	node.append("circle")
		.attr("class", "circle-background")
		.attr("r", pt.wordSnakeSizes.radius);

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
	pt.wordSnakeSizes.svg.append("path")
		.attr("class", "circle-path")
		.attr("id", "circle-word-path")
		//.style("stroke", "#d2d2d2")
		.attr("d", pt.wordSnakeSizes.calculateSnakePath(grid, pt.wordSnakeSizes.n));
	
	//Create the text itself
	var wordString = "1 ";
	top100Overall.forEach(function(d,i) {
		var rank = "";
		if((i+1) % 10 === 0) rank = (i+1) + " ";
		wordString = wordString + rank + d.translation + "\u00A0\u00A0" ;
	});

	//Create text on path
	var wordSnake = pt.wordSnakeSizes.svg.append("text")
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
	///////////////////// Draw the lines around the edges /////////////////////
	/////////////////////////////////////////////////////////////////////////// 

	//Create group
	var boundaryWrapper = pt.wordSnakeSizes.svgUpper
		.append("g")
		.attr("transform", "translate(" + (pt.wordSnakeSizes.fixedWidth/2) + ",0)");

	pt.wordSnakeSizes.boundaryMargin = 50;
	var triangle = d3.symbol()
		.type(d3.symbolTriangle)
		.size(180);

	//Create a group per side
	pt.wordSnakeSizes.boundaries = boundaryWrapper.selectAll(".boundary")
		.data([{side: -1},{side: 1}])
		.enter().append("g")
		.attr("transform", function(d) { 
			d.x = d.side * (pt.wordSnakeSizes.fixedWidth/2 + pt.wordSnakeSizes.boundaryMargin);
			d.y = height/2;
			return "translate(" + d.x + "," + d.y + ")"; 
		});

	//Create the lines on the boundary
	pt.wordSnakeSizes.boundaryLine = pt.wordSnakeSizes.boundaries.append("line")
		.attr("class", "boundary-line")
		.attr("x1", 0)
		.attr("y1", -height/2)
		.attr("x2", 0)
		.attr("y2", height/2);

	//Create the triangles
	pt.wordSnakeSizes.triangles = pt.wordSnakeSizes.boundaries.append("path")
		.attr("class", "boundary-triangle")
		.attr('d', triangle)
		.attr("transform", function(d) { 
			d.offset = d.side * (pt.wordSnakeSizes.boundaryMargin*0.5);
			d.rotate = d.side * 90;
			return "translate(" + d.offset + ",0)rotate(" + d.rotate + ")"; 
		});

	///////////////////////////////////////////////////////////////////////////
	//////////////////////////// Animation run times //////////////////////////
	///////////////////////////////////////////////////////////////////////////

	pt.wordSnakeSizes.loopWordsnakeWords = setInterval(pt.wordSnakeSizes.loopWords, 4500);
	//Go through the different options for languages with multiple words for the same English translation
	pt.wordSnakeSizes.loopWords = function() {
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
	pt.wordSnakeSizes.animateWordSnake = function() {
		d3.select("#top-word-string")
			.transition("move").duration(120000)
			.ease(d3.easeLinear)
			.attr("startOffset",  "100%")
			.transition("move").duration(120000)
			.ease(d3.easeLinear)
			.attr("startOffset",  "0%");
	}//function animateWordSnake
	pt.wordSnakeSizes.animateWordSnake();

	///////////////////////////////////////////////////////////////////////////
	//////////////////// Start the squeezing of the layout ////////////////////
	///////////////////////////////////////////////////////////////////////////

	pt.wordSnakeSizes.squeeze();

}//init

///////////////////////////////////////////////////////////////////////////
/////////////// Calculate the arching path between the words //////////////
///////////////////////////////////////////////////////////////////////////

pt.wordSnakeSizes.calculateGrid = function() {
	//How many circles fir in one "row"
	var radius = pt.wordSnakeSizes.radius;
	var angle = pt.wordSnakeSizes.angle;
	var s = pt.wordSnakeSizes.width / Math.cos(pt.wordSnakeSizes.angle);
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

	//debugger;

	//New width & divide margins so it will sit in the center
	pt.wordSnakeSizes.width = xLocArc[numCircle];
	pt.wordSnakeSizes.margin.left = round2((pt.wordSnakeSizes.fixedWidth - pt.wordSnakeSizes.width)/2);
	pt.wordSnakeSizes.margin.right = pt.wordSnakeSizes.margin.left;

	return {xLoc: xLoc, xLocArc: xLocArc, numCircle: numCircle};
}//function calculateGrid


///////////////////////////////////////////////////////////////////////////
/////////////// Calculate the arching path between the words //////////////
///////////////////////////////////////////////////////////////////////////

pt.wordSnakeSizes.calculateSnakePath = function(grid, n) {
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

	var radius = pt.wordSnakeSizes.radius;
	var angle = pt.wordSnakeSizes.angle;

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

	return path;
}//function calculateSnakePath


///////////////////////////////////////////////////////////////////////////
//////////////////////// Resize the path on an update /////////////////////
///////////////////////////////////////////////////////////////////////////

pt.wordSnakeSizes.resizeWordSnake = function(grid) {

	pt.wordSnakeSizes.svg.attr("transform", "translate(" + pt.wordSnakeSizes.margin.left + "," + (pt.wordSnakeSizes.margin.top) + ")");

	//Adjust the node locations
	var pos = 0, add = 1;
	var node = pt.wordSnakeSizes.svg.selectAll(".node")
		.attr("transform", function(d,i) { 
			//Save the locations
			d.x = grid.xLoc[pos];
			d.y = (1 + 2*i) * pt.wordSnakeSizes.radius * Math.sin(pt.wordSnakeSizes.angle);

			//Figure out which position of the xLoc to use on the next one
			if(pos === grid.numCircle-1) { add = -1; }
			else if (pos === 0) { add = 1; }
			pos = pos + add;

			return "translate(" + d.x + "," + d.y + ")";
		});

	//Adjust the path
	pt.wordSnakeSizes.svg.select("#circle-word-path").attr("d", pt.wordSnakeSizes.calculateSnakePath(grid, pt.wordSnakeSizes.n));

}//function resizeWordSnake

///////////////////////////////////////////////////////////////////////////
/////////////// Animate making the window smaller and bigger //////////////
///////////////////////////////////////////////////////////////////////////

pt.wordSnakeSizes.squeeze = function() {

	var predefinedWidth = [pt.wordSnakeSizes.fixedWidth, 450, 300];
	var counter = 1;
		direction = 1;
	var newWidth, grid;

	pt.wordSnakeSizes.squeezeInterval = setInterval(function() {
		newWidth = predefinedWidth[counter];
		pt.wordSnakeSizes.width = newWidth;
		grid = pt.wordSnakeSizes.calculateGrid();

		//Adjust the boundary markers
		pt.wordSnakeSizes.boundaries
			.transition().duration(2000)
			.attr("transform", function(d) { 
				d.x = d.side * (newWidth/2 + pt.wordSnakeSizes.boundaryMargin);;
				return "translate(" + d.x + "," + d.y + ")"; 
			});
		//Adjust the triangles if the movement switches sides
		if(counter === 1) {
			pt.wordSnakeSizes.triangles
				.transition().duration(500)
				.attr("transform", function(d) { 
					d.rotate = -1 * d.rotate;
					return "translate(" + d.offset + ",0)rotate(" + d.rotate + ")"; 
				});
		}//if

		//Do the resizing of the chart
		setTimeout(function() { pt.wordSnakeSizes.resizeWordSnake(grid); },1000);

		if(counter <= 0) direction = 1;
		else if(counter >= predefinedWidth.length-1) direction = -1;
		counter += direction

	},3000);

}//function squeeze