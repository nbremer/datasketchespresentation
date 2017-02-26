function createFightMap(originalWidth, originalHeight, originalMargin, characterPaths, fightNestedData, baseRadius) {
	
	var totalWidthOriginal = originalWidth + originalMargin.left + originalMargin.right,
		marginRatio = originalMargin.left/originalWidth;

	var windowHeight = document.documentElement.clientHeight;
	var margin = {};

	///////////////////////////////////////////////////////////////////////////
	//////////////////////////// Set up the SVG ///////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	//How much width is available
	var availWidth = (document.documentElement.clientWidth - totalWidthOriginal)/2;
	//If there is not enough space available, don't make the map
	if(availWidth < 100) return;

	//Minimal margins required
	margin.top = 30;
	margin.bottom = 30;
	//What would be the optimal dimensions
	var height = windowHeight - margin.top - margin.bottom,
		width = Math.min(height/6.5, availWidth*0.70);

	//Recalculate the height & margins needed now that we know the width
	height = width*6.5;
	margin.top = margin.bottom = (windowHeight - height)/2;

	var marginPadding = 20,
		marginNeeded = Math.round(width*marginRatio);
	margin.left = marginNeeded + marginPadding;
	margin.right = marginNeeded + marginPadding;
    
    //Place the mini map just to the right of the main visual
    var totalWidth = width + margin.left + margin.right,
    	inbetweenPadding = Math.min(100, Math.max(30, totalWidth*0.5));
    var map = document.getElementById('map');
    map.style.right = Math.max(0, (document.documentElement.clientWidth - totalWidthOriginal - totalWidth)/2 - inbetweenPadding) + "px";

	//If there is not enough space available, don't make the map - old version
	//if(document.documentElement.clientWidth - totalWidthOriginal - totalWidth - inbetweenPadding < 0) return;

	//Ratio difference of the map, thus many values need to be multiplied by this to create the mini map, based on the big map
	var mr = width/originalWidth;

	//SVG container
	var svg = d3.select('#map')
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");

	///////////////////////////////////////////////////////////////////////////
	////////////////////////// Create defs elements ///////////////////////////
	///////////////////////////////////////////////////////////////////////////

	//Container for the gradients
	var defs = svg.append("defs");

	//Create a gradient to fill the lines from the annotations circles to the fights
	var sectionGradient = defs.append("linearGradient")             
		.attr("id", "section-rect-gradient")   
		.attr("x1", 0).attr("y1", 0)         
		.attr("x2", 1).attr("y2", 1);
	sectionGradient.append("stop").attr("offset", "0%").attr("stop-color", "#ff4800"); //.attr("stop-opacity", 0.15);
	sectionGradient.append("stop").attr("offset", "20%").attr("stop-color", "#ff6c00"); //.attr("stop-opacity", 0.15);
	sectionGradient.append("stop").attr("offset", "80%").attr("stop-color", "#FFC200"); //.attr("stop-opacity", 0.15);
	sectionGradient.append("stop").attr("offset", "100%").attr("stop-color", "#ffe500"); //.attr("stop-opacity", 0.15);

	///////////////////////////////////////////////////////////////////////////
	/////////////////////// Add background rectangles /////////////////////////
	///////////////////////////////////////////////////////////////////////////

	//Insert a rectangle that will be placed behind the mini map
	svg.append("rect")
		.attr("class","background-rect")
		.attr("x", -marginNeeded)
		.attr("y", -marginPadding)
		.attr("width", width + 2*marginNeeded)
		.attr("height", height + 2*marginPadding)
		.style("filter", "url(#shadow)")
		.style("fill", "white");

	var sectionRect = svg.append("rect")
		.attr("class","section-rect")
		.attr("x", -marginNeeded)
		.attr("y", 0)
		.attr("width", width + 2*marginNeeded)
		.attr("height", 100)
		.style("opacity", 0.15)
		//.style("fill", "#FFC200")
		.style("fill", "url(#section-rect-gradient)");

	///////////////////////////////////////////////////////////////////////////
	////////////////////////// Draw the character paths ///////////////////////
	///////////////////////////////////////////////////////////////////////////

	//http://stackoverflow.com/questions/17374893/how-to-extract-floating-numbers-from-strings-in-javascript
	//http://stackoverflow.com/questions/13636997/extract-all-numbers-from-string-in-javascript
	var regex = /[-+]?\d*(\.(?=\d))?\d+/g; // /[+-]?\d+\.*\d+/g;

	var characterLineWrapper = svg.append("g").attr("class", "character-line-wrapper").style("isolation", "isolate");

	characterLineWrapper.selectAll(".character-path-group")
		.data(characterPaths)
		.enter().append("g")
		.attr("class", function(d,i) { return "character-path-group " + d.key.replace(" ", "_").toLowerCase(); })
		.style("opacity", function(d) { 
				d.opacity = d.key === "Goku" ? 1 : 0.4;
				return d.opacity; 
		})
		.each(function(d,i) {
			var el = d3.select(this);
			for(var j=0; j<d.length; j++) {
				//Make the path smaller by dividing all numbers by the mapratio

				//Get all the numbers
				var floats = d[j].match(regex).map(function(v) { return parseFloat(v); });

				//Create the new path
				var newPath = "M";
				var counter = 0;
				while(counter < floats.length) {
					newPath = newPath + round2(floats[counter++]*mr) + "," + round2(floats[counter++]*mr);
					if(counter < floats.length - 2) {
						newPath = newPath + " Q" + round2(floats[counter++]*mr) + "," + round2(floats[counter++]*mr) + " ";
					}//if
				}//while
				newPath = newPath + "Z";

				//Draw the new mini path
				el.append("path")
					.attr("class","character-path")
					.attr("d", newPath);					
			}//for j
		})
		.style("stroke", function(d) { return d.color; })
		.style("stroke-width", 0.5)
		.style("fill", function(d,i) { return d.color; });

	///////////////////////////////////////////////////////////////////////////
	///////////////////////// Draw the character circles //////////////////////
	///////////////////////////////////////////////////////////////////////////

	var fightWrapper = svg.append("g").attr("class", "fight-wrapper");

	//Group for each fight
	var fights = fightWrapper.selectAll(".fight")
		.data(fightNestedData, function(d) { return d.key; })
		.enter().append("g")
		.attr("class", function(d,i) { 
			//Give a class of each person in the fight
			var fighters = d.values.map(function(f) { return f.name.replace(" ", "_").toLowerCase(); });
			return "fight " + fighters.join(" "); 
		})
		.style("isolation", "isolate")
		.attr("transform", function(d) { return "translate(" + (mr*d.x) + "," + (mr*d.y) + ")"; });

	//Create circles for each character in a fight
	var fightCharacter = fights.selectAll(".character-circle-group")
		.data(function(d) { return d.values; })
		.enter().append("circle")
		.attr("class", "character-circle")
		.attr("cx", function(d) { return mr*d.x; })
		.attr("cy", function(d) { return mr*d.y; })
		.attr("r", mr*baseRadius)
		.style("fill", function(d,i) {
			//Check for fused Vegito
			var isVegito = /Vegito/.test(d.state);
			//Move to the next if this is the last person in the Vegito fight 
			//(which is Vegeta, but he is already represented by Goku)
			if(isVegito && i >= this.parentNode.__data__.numFighters) return "none";
			else return d.color;
		});

	///////////////////////////////////////////////////////////////////////////
	//////////////////////////// Make the map sticky //////////////////////////
	///////////////////////////////////////////////////////////////////////////

	//Based on http://stackoverflow.com/questions/1216114/how-can-i-make-a-div-stick-to-the-top-of-the-screen-once-its-been-scrolled-to
    map.style.position = 'absolute';
    var topOffset = originalMargin.top - margin.top;
    map.style.top = topOffset + "px";

    //Find the absolute y-position of the map in the page
    var startMapPos = findPosY(map) - topOffset;
    //Find the abolute end point of the last fight in the big map
    var endFightPos = startMapPos + topOffset + originalHeight;

    var yTop, yBottom;

    //Move the map and colored rect on scroll
    window.onscroll = function() { moveMap() };
    moveMap();

	///////////////////////////////////////////////////////////////////////////
	/////////////////////// Functions to calculate movement ///////////////////
	///////////////////////////////////////////////////////////////////////////

    function moveMap() {

    	if (pageYOffset + height + margin.top >= endFightPos + margin.bottom) { //When the bottom of the fight map is above the fold
        	map.style.position = 'absolute';
        	map.style.top = "auto";
            map.style.bottom = (originalMargin.bottom - margin.bottom) + "px";

            //Move the boundary
            yTop = round2(Math.min(1, (pageYOffset - startMapPos - originalMargin.top)/originalHeight) * height);
            sectionRect.attr("y", yTop).attr("height", height - yTop);

        } else if (pageYOffset >= startMapPos + topOffset){ //When the fight map fills the window
            map.style.position = 'fixed';
            map.style.top = 0;
            map.style.bottom = "auto";

            //Move the boundary
            yTop = round2(Math.max(0, (pageYOffset - startMapPos - originalMargin.top)/originalHeight) * height);
            yBottom = round2(Math.min(1, (pageYOffset - startMapPos - originalMargin.top + windowHeight)/originalHeight) * height);
            sectionRect.attr("y", yTop).attr("height", yBottom - yTop);

       } else { //When the top of the page is higher than the top of the map
            map.style.position = 'absolute';
            map.style.top = topOffset + "px";
            map.style.bottom = "auto";

            //Move the boundary
            yBottom = round2(Math.max(0, (windowHeight + pageYOffset - startMapPos - originalMargin.top)/originalHeight * height));
            sectionRect.attr("y", 0).attr("height", yBottom);

        }//else

    }//function moveMap

    function findPosY(obj) {
        var curtop = 0;
        if (typeof (obj.offsetParent) != 'undefined' && obj.offsetParent) {
            while (obj.offsetParent) {
                curtop += obj.offsetTop;
                obj = obj.offsetParent;
            }
            curtop += obj.offsetTop;
        } else if (obj.y)
            curtop += obj.y;
        return curtop;
    }//function findPosY

} //function createFightMap