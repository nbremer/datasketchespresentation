pt.dbzPathSimple = pt.dbzPathSimple || {};

pt.dbzPathSimple.init = function(data) {
	
	//Remove any existing svgs
	d3.select('#dbz-path-simple #dbzPathSimple svg').remove();
	d3.select('#dbz-path-diff-width #dbzPathDiffWidth svg').remove();

	///////////////////////////////////////////////////////////////////////////
	//////////////////// Set up and initiate svg containers ///////////////////
	///////////////////////////////////////////////////////////////////////////	

	var margin = {
		top: -350,
		right: 200,
		bottom: 0,
		left: 200
	};
	var width = 1000 - margin.left - margin.right;
	var height = 6.5*width;
				
	//SVG container
	pt.dbzPathSimple.svg = d3.select('#dbz-path-simple #dbzPathSimple')
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", $(".slides").height() )
		.append("g")
	    .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");

	pt.dbzPathSimple.id = "#dbz-path-simple";
	pt.dbzPathSimple.chosen = "Vegeta";

	pt.dbzPathSimple.createDbzFights(pt.dbzPathSimple.svg, width, height, data);

}//init

pt.dbzPathSimple.createDbzFights = function(svg, width, height, data) {

	///////////////////////////////////////////////////////////////////////////
	//////////////////////////// General variables ////////////////////////////
	///////////////////////////////////////////////////////////////////////////	

	var characters = [
		{character: "Goku", color: "#f27c07"}, //unique
		{character: "Vegeta", color: "#1D75AD"}, //unique
		{character: "Gohan", color: "#3e216d"}, //unique
		{character: "Krillin", color: "#E3A688"}, //unique
		{character: "Piccolo", color: "#56B13E"}, //Namek unique
		{character: "Namekian", color: "#56B13E"}, //Namek unique
		{character: "Nail", color: "#56B13E"}, //Namek unique
		{character: "Future Trunks", color: "#D8A3FA"}, //Trunks unique
		{character: "Tien Shinhan", color: "#C30703"}, //Tien & Chiaotzu
		{character: "Chiaotzu", color: "#C30703"}, //Tien & Chiaotzu
		{character: "Yamcha", color: "#F53B00"}, //unique
		{character: "Gotenks", color: "#6ED3C1"}, //unique
		{character: "Goten", color: "#f2b252"}, //unique
		{character: "Trunks", color: "#D8A3FA"}, //Trunks unique
		{character: "Mr. Satan", color: "#6B313A"}, //unique
		{character: "Videl", color: "#FF8CFA"}, //unique
		{character: "Kibito", color: "#F3A2AB"}, //unique
		{character: "Supreme Kai", color: "#8DDBDD"}, //unique
		{character: "Raditz", color: "#0B2D52"}, //Raditz & Nappa
		{character: "Saibaman", color: "#D8E665"}, //unique
		{character: "Saibamen", color: "#D8E665"}, //unique
		{character: "Nappa", color: "#0B2D52"}, //Raditz & Nappa
		{character: "Dodoria", color: "#E93B86"}, //unique
		{character: "Zarbon", color: "#81C1B3"}, //unique
		{character: "Recoome", color: "#121A03"}, //unique
		{character: "Burter", color: "#6B88EE"}, //unique
		{character: "Jeice", color: "#F8361B"}, //unique
		{character: "Captain Ginyu", color: "#A287CD"}, //unique
		{character: "Frieza", color: "#82307E"}, //unique
		{character: "Android 16", color: "#383838"},
		{character: "Android 17", color: "#383838"},
		{character: "Future Android 17", color: "#383838"},
		{character: "Android 18", color: "#383838"},
		{character: "Future Android 18", color: "#383838"},
		{character: "Android 19", color: "#383838"},
		{character: "Android 20", color: "#383838"},
		{character: "Cell", color: "#9DBD2A"}, //unique
		{character: "Cell Jr.", color: "#0EC1F8"},
		{character: "Future Cell", color: "#9DBD2A"},
		{character: "Spopovich", color: "#C0A87C"}, //unique
		{character: "Babidi", color: "#D4AB03"}, //unique
		{character: "Dabura", color: "#E67152"}, //unique
		{character: "Evil Buu", color: "#C8B4C0"},
		{character: "Good (Majin) Buu", color: "#FFBBBE"},
		{character: "Buu", color: "#F390A4"}, //unique
		{character: "Vegito", color: "url(#vegito-gradient)"}, //unique combined gradient of Goku & Vegeta
	];
	var names = characters.map(function(d) { return d.character; });
	
	///////////////////////////////////////////////////////////////////////////
	//////////////////////// Create extra information /////////////////////////
	///////////////////////////////////////////////////////////////////////////

	pt.dbzPathSimple.sagaData = [
		{id: 1, subSaga: 'Raditz Saga', saga: 'Saiyan', firstEpisode: 1, lastEpisode: 7, numEpisodes: 7, firstFight: 1, lastFight: 4 },
		{id: 2, subSaga: 'Vegeta Saga', saga: 'Saiyan', firstEpisode: 7, lastEpisode: 35, numEpisodes: 29, firstFight: 5, lastFight: 25 },
		{id: 3, subSaga: 'Namek Saga', saga: 'Frieza', firstEpisode: 36, lastEpisode: 67, numEpisodes: 32, firstFight: 26, lastFight: 37 },
		{id: 4, subSaga: 'Captain Ginyu Saga', saga: 'Frieza', firstEpisode: 68, lastEpisode: 74, numEpisodes: 7, firstFight: 38, lastFight: 44 },
		{id: 5, subSaga: 'Frieza Saga', saga: 'Frieza', firstEpisode: 75, lastEpisode: 107, numEpisodes: 33, firstFight: 45, lastFight: 65 },
		//{id: 0, subSaga: 'Garlic Jr. Saga', saga: 'Cell', firstEpisode: 108, lastEpisode: 117, numEpisodes: 10 }, //filler saga
		{id: 6, subSaga: 'Trunks Saga', saga: 'Cell', firstEpisode: 118, lastEpisode: 125, numEpisodes: 8, firstFight: 66, lastFight: 72 },
		{id: 7, subSaga: 'Androids Saga', saga: 'Cell', firstEpisode: 126, lastEpisode: 139, numEpisodes: 14, firstFight: 73, lastFight: 80 },
		{id: 8, subSaga: 'Imperfect Cell Saga', saga: 'Cell', firstEpisode: 140, lastEpisode: 152, numEpisodes: 13, firstFight: 81, lastFight: 87 },
		{id: 9, subSaga: 'Perfect Cell Saga', saga: 'Cell', firstEpisode: 153, lastEpisode: 165, numEpisodes: 13, firstFight: 88, lastFight: 98 },
		{id: 10, subSaga: 'Cell Games Saga', saga: 'Cell', firstEpisode: 166, lastEpisode: 194, numEpisodes: 29, firstFight: 99, lastFight: 110 },
		//{id: 0, subSaga: 'Other World Saga', saga: 'Buu', firstEpisode: 195, lastEpisode: 199, numEpisodes: 5 }, //filler saga
		{id: 11, subSaga: 'Great Saiyaman Saga', saga: 'Buu', firstEpisode: 200, lastEpisode: 209, numEpisodes: 10, firstFight: 111, lastFight: 113 },
		{id: 12, subSaga: 'World Tournament Saga', saga: 'Buu', firstEpisode: 210, lastEpisode: 219, numEpisodes: 10, firstFight: 114, lastFight: 118 },
		{id: 13, subSaga: 'Babidi Saga', saga: 'Buu', firstEpisode: 220, lastEpisode: 231, numEpisodes: 12, firstFight: 119, lastFight: 128 },
		{id: 14, subSaga: 'Majin Buu Saga', saga: 'Buu', firstEpisode: 232, lastEpisode: 253, numEpisodes: 22, firstFight: 129, lastFight: 138 },
		{id: 15, subSaga: 'Fusion Saga', saga: 'Buu', firstEpisode: 254, lastEpisode: 275, numEpisodes: 22, firstFight: 139, lastFight: 152 },
		{id: 16, subSaga: 'Kid Buu Saga', saga: 'Buu', firstEpisode: 276, lastEpisode: 287, numEpisodes: 12, firstFight: 153, lastFight: 163 },
		{id: 17, subSaga: 'Peaceful World Saga', saga: 'Buu', firstEpisode: 288, lastEpisode: 291, numEpisodes: 4, firstFight: 164, lastFight: 166 },
	];
	pt.dbzPathSimple.sagaNames = pt.dbzPathSimple.sagaData.map(function(d) { return d.subSaga; });
		
	//Characters to follow across sub sagas
	pt.dbzPathSimple.fullCharacters = ["Goku","Piccolo","Krillin","Gohan","Future Trunks","Gotenks","Vegeta","Frieza","Cell","Buu","Android 16","Android 17"];
	//Possible extra: ["Tien Shinhan","Yamcha","Chiaotzu","Trunks","Goten"]

	//Divide characters with more than 1 fight into the different camps
	//This will determine on what side the swooshes should be drawn
	pt.dbzPathSimple.goodGuys = ["Goku","Piccolo","Krillin","Gohan","Future Trunks","Tien Shinhan","Chiaotzu","Yamcha","Trunks","Goten","Gotenks","Vegito","Mr. Satan","Namekian","Videl","Yajirobe","Nail","Pan","Android 16"];
	pt.dbzPathSimple.badGuys = ["Raditz","Nappa","Saibaman","Dodoria","Zarbon","Guldo","Recoome","Burter","Jeice","Captain Ginyu","Frieza","Cell","Buu","Android 19","Android 20","Cell Jr.","Yakon","Dabura","Olibu"];
	//Changing characters between good and bad side
	pt.dbzPathSimple.changeGuys = ["Vegeta","Android 17","Android 18"];
	//The fight ids of the fights where the characters changing side were on the bad side
	pt.dbzPathSimple.badFights = [];
	pt.dbzPathSimple.badFights["Vegeta"] = [19,20,21,22,23,24,25,27,30,31,33,43,91,128,129];
	pt.dbzPathSimple.badFights["Android 17"] = [80,83];
	pt.dbzPathSimple.badFights["Android 18"] = [78,79];

	var oddStatesData = [
		{state: "Mecha", color: "#cccccc"}, //Frieza vs Future Trunks
		{state: "Goku's body", color: "#f27c07"}, //By Captain Ginyu
		{state: "Great Ape", color: "#361607"}, //Gohan and Vegeta
		{state: "Great Saiyaman", color: "#6DD903"}, //Gohan
		{state: "Candy", color: "#39100A"}, //Vegito
		{state: "Mighty Mask", color: "#005758"}, //Goten & Trunks
	];
	var oddStates = oddStatesData.map(function(d) { return d.state; });
	var oddStatesColor = oddStatesData.map(function(d) { return d.color; });

	///////////////////////////////////////////////////////////////////////////
	////////////////////////// Create the scales //////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	var sagaScale = d3.scaleLinear()
		.domain([1, 17])
	    .range([0, width]);
	pt.dbzPathSimple.sagaScale = sagaScale;

	var fightScale = d3.scaleLinear()
		.domain( d3.extent(data, function(d) { return d.id; }) )
	    .range([0, height]);
	pt.dbzPathSimple.fightScale = fightScale;

	var colorScale = d3.scaleOrdinal()
		.domain( characters.map(function(d) { return d.character; }) )
		.range( characters.map(function(d) { return d.color; }) );

	pt.dbzPathSimple.xSwoopScale = d3.scaleLinear()
		.domain([1, 20])
	    .range([1, 15]);

	var jitterScale = d3.scaleLinear()
		.domain([1, 15])
	    .range([0.9,0.2])
	    .clamp(true);  
	pt.dbzPathSimple.jitterScale = jitterScale;

	var rScale = d3.scaleLinear() //on purpose
		.domain([300,600,1200])
	    .range([3,4,8]);

	///////////////////////////////////////////////////////////////////////////
	////////////////////////// Create defs elements ///////////////////////////
	///////////////////////////////////////////////////////////////////////////

	//Container for the gradients
	var defs = svg.append("defs");

	//Code taken from http://stackoverflow.com/questions/9630008/how-can-i-create-a-glow-around-a-rectangle-with-svg
	//Filter for the outside glow
	var filter = defs.append("filter").attr("id","shadow");

	filter.append("feColorMatrix")
		.attr("type", "matrix")
		.attr("values", "0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0 0.4 0")
	filter.append("feGaussianBlur")
	  .attr("stdDeviation","3")
	  .attr("result","coloredBlur");;

	var feMerge = filter.append("feMerge");
	feMerge.append("feMergeNode").attr("in","coloredBlur");
	feMerge.append("feMergeNode").attr("in","SourceGraphic");

	//Create a gradient for the fused Goku and Vegeta
	var vegitoGradient = defs.append("linearGradient")    
		.attr("x1", 0).attr("y1", 0)         
		.attr("x2", 1).attr("y2", 0)                 
		.attr("id", "vegito-gradient");
	vegitoGradient.append("stop").attr("offset", "50%").attr("stop-color", "#f27c07");
	vegitoGradient.append("stop").attr("offset", "50%").attr("stop-color", "#1D75AD");

	///////////////////////////////////////////////////////////////////////////
	///////////////////////////// Final data prep /////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	//Nest the data on saga and then on fight
	var fightNestedData = d3.nest()
		.key(function(d) { return d.id; })
		.entries(data);

	//Nest the data on character then by subsaga
	var characterNestedData = d3.nest()
		.key(function(d) { return d.name; })
		.key(function(d) { return d.subSaga; })
		.entries(data);

	var baseRadius = rScale(width); //The default radius of the character circles
	pt.dbzPathSimple.baseRadius = baseRadius;
	pt.dbzPathSimple.baseDistanceRatio = 0.7; //The default distance that the circles are apart
	var backgroundRectSize = height / (fightScale.domain()[1] - fightScale.domain()[0]); //The default size of the background rectangle
	pt.dbzPathSimple.backgroundRectSize = backgroundRectSize;
	var backgroundCircleFactor = 7; //How many times the baseRadius should the background circle become
	pt.dbzPathSimple.hoverScaleIncrease = 3; //How much should the fight group be scaled up
	pt.dbzPathSimple.sagaDistance = sagaScale(2) - sagaScale(1); //Number of pixels between two sagas

	pt.dbzPathSimple.previousStep = "init";

	///////////////////////////////////////////////////////////////////////////
	////////////////////////// Create a line per saga /////////////////////////
	///////////////////////////////////////////////////////////////////////////

	var sagaLine = svg.append("g").attr("class","saga-line-wrapper");

	//Add a vertical line per saga
	sagaLine.selectAll(".saga-line")
		.data(pt.dbzPathSimple.sagaData)
		.enter().append("line")
		.attr("class", "saga-line")
		.attr("x1", function(d,i) { return Math.round(sagaScale( i+1 )); })
		.attr("y1", function(d) { return fightScale(d.firstFight - 1.5); })
		.attr("x2", function(d,i) { return Math.round(sagaScale( i+1 ))+0.01; })
		.attr("y2", function(d) { return fightScale(d.lastFight + 1.5); });

	///////////////////////////////////////////////////////////////////////////
	//////////////////////// Create the character paths ///////////////////////
	///////////////////////////////////////////////////////////////////////////

	var characterLineWrapper = svg.append("g").attr("class", "character-line-wrapper");

	pt.dbzPathSimple.characterLines = characterLineWrapper.selectAll(".character-path-group")
		.data(characterNestedData)
		.enter().append("g")
		.attr("class", function(d) {
			d.className = d.key.replace(" ", "_").toLowerCase();
			return "character-path-group " + d.className; 
		})
		.style("stroke", function(d,i) {
			var loc = names.indexOf(d.key);
			d.color = loc > -1 ? characters[loc].color === "#" ? "#515151" : characters[loc].color : "#c1c1c1";
			return d.color;
		})
		.style("stroke-width", 1)
		.style("fill", function(d,i) { return d.color; })
		.style("opacity", function(d) { 
				d.opacity = d.key === "Goku" ? 1 : 0.4;
				//return d.opacity; 
		})
		.each(function(d,k) { 
			var el = d3.select(this);
			if(pt.dbzPathSimple.chosen !== "") {
				if(d.key === pt.dbzPathSimple.chosen) pt.dbzPathSimple.createSimplePathChosen(el,d,k);
				else pt.dbzPathSimple.singleWidthBadGuysNoAnchor(el,d,k);
			} else {
				pt.dbzPathSimple.diffWidthPath(el,d,k);
			}//else
		});

	///////////////////////////////////////////////////////////////////////////
	///////////////////////// Create a group per fight ////////////////////////
	///////////////////////////////////////////////////////////////////////////

	var fightOuterWrapper = svg.append("g").attr("class", "fight-outer-wrapper");

	//Outer wrapper that will stay in place
	var fightWrapper = fightOuterWrapper.selectAll(".fight-wrapper")
		.data(fightNestedData, function(d) { return d.key; })
		.enter().append("g")
		.attr("class","fight-wrapper")
		.attr("transform", function(d) { 
			d.x = Math.round(sagaScale( pt.dbzPathSimple.sagaData[ pt.dbzPathSimple.sagaNames.indexOf(d.values[0].subSaga) ].id ));
			d.y = fightScale(+d.key);
			return "translate(" + d.x + "," + d.y + ")"; 
		});

	//Inner fight wrapper that can be scaled on hover
	pt.dbzPathSimple.fights = fightWrapper.append("g")
		.attr("class", function(d,i) { 
			//Give a class of each person in the fight
			var fighters = d.values.map(function(f) { return f.name.replace(" ", "_").toLowerCase(); });
			return "fight " + fighters.join(" "); 
		})
		.style("isolation", "isolate")
		.style("opacity", 1)
		.each(function(d) {
			d.x = this.parentNode.__data__.x;
			d.y = this.parentNode.__data__.y;
			d.numFighters = d.values.length;
			//Take one fighter from the Vegito fusion to make the circles spread correctly around 360 degrees
			if( /Vegito/.test(d.values[0].state) ) d.numFighters -=1;
		})
		.on("mouseover", function(d) {
			var el = d3.select(this);
			//Move the parent group to the front
			d3.select(this.parentNode).raise();
			//Attach the stuff to do to the fights and lines
			pt.dbzPathSimple.fightMouseOver(svg, d, el, 1);
		})
		.on("mouseout", function(d) {
			var el = d3.select(this);
			pt.dbzPathSimple.fightMouseOut(svg, d, el, 1);
		});

	///////////////////////////////////////////////////////////////////////////
	//////////////////// Create the circles per character /////////////////////
	///////////////////////////////////////////////////////////////////////////

	//Add an invisible background to capture the mouse events
	var fightBackground = pt.dbzPathSimple.fights.append("rect")
		.attr("class", "fight-background")
		.attr("x", -backgroundRectSize*1.25/2)
		.attr("y", -backgroundRectSize/4)
		.attr("width", backgroundRectSize*1.25)
		.attr("height", backgroundRectSize/2);

	//Extra background that becomes visible on hover
	var fightCircleBackground = pt.dbzPathSimple.fights.append("circle")
		.attr("class", "fight-background-circle")
		.attr("r", baseRadius*backgroundCircleFactor)
		.style("opacity", 0);

	//Create circles along the saga lines
	var fightCharacter = pt.dbzPathSimple.fights.selectAll(".character-circle-group")
		.data(function(d) { return d.values; })
		.enter().append("g")
		.attr("class","character-circle-group")
		// .each(function(d) {
		// 	d.startAngle = fightData[fightLink[d.id]].startAngle * Math.PI/180;	
		// })
		.attr("transform", function(d,i) { 
			//d.x = baseRadius*baseDistanceRatio * Math.cos( i * Math.PI * 2 / this.parentNode.__data__.numFighters + d.startAngle);
			//d.y = baseRadius*baseDistanceRatio * Math.sin( i * Math.PI * 2 / this.parentNode.__data__.numFighters + d.startAngle);
			return "translate(" + d.x + "," + d.y + ")"; 
		})
		.each(function(d,i) {
			var el = d3.select(this);

			//Check for fused Vegito
			var isVegito = /Vegito/.test(d.state);
			//Move to the next if this is the last person in the Vegito fight (which is Vegeta, but he is already represented by Goku)
			if(isVegito && i >= this.parentNode.__data__.numFighters) return;

			//If the state contains Vegito, use Vegito's color
			var name = isVegito ? "Vegito" : d.name;
			var loc = names.indexOf(name);
			d.color = loc > -1 ? characters[loc].color : "#c1c1c1";

			el.append("circle")
				.attr("class", "character-circle")
				.attr("r", baseRadius)
				.style("fill", d.color);

			//Add extra elements depending on the state of the character
			if(d.state === "Super Saiyan" || d.state === "Vegito Super Saiyan" || d.state === "Second Form" || d.state === "Semi-Perfect Form" || d.state === "Super") {
				firstPower(el, d.color, 1.5, 1);
			} else if(d.state === "2nd Grade Super Saiyan") {
				firstPower(el, d.color, 1.5, 1.5);
			} else if(d.state === "3rd Grade Super Saiyan") {
				firstPower(el, d.color, 1.6, 2);
			} else if(d.state === "Full-Power Super Saiyan") {
				firstPower(el, d.color, 1.75, 2.5);
			} else if(d.state === "Super Saiyan 2" || d.state === "Third Form" || d.state === "Perfect Form" || d.state === "Kid") {
				firstPower(el, d.color, 1.5, 1);
				secondPower(el, d.color, 2, 1);
			} else if(d.state === "Majin Super Saiyan 2") { //Vegeta
				firstPower(el, d.color, 1.5, 1);
				secondPower(el, d.color, 2, 1);
			} else if(d.state === "Perfect and Power-weighted Form") { //Cell
				firstPower(el, d.color, 1.5, 1);
				secondPower(el, d.color, 2.1, 1.5);
			} else if(d.state === "Super Saiyan 3" || d.state === "Final Form" || d.state === "Super Perfect Form" ) {
				firstPower(el, d.color, 1.5, 1);
				secondPower(el, d.color, 2, 1);
				thirdPower(el, d.color);
			} else if(d.state === "Mecha") { //Frieza vs Future Trunks
				firstPower(el, "#cccccc", 1.5, 1);
				secondPower(el, "#cccccc", 2, 1);
				thirdPower(el, "#cccccc");
			} else if(d.state === "Goku's body") { //By Captain Ginyu
				firstPower(el, "#f27c07", 1.5, 1); 
			} else if(d.state === "Great Ape") { //Gohan and Vegeta
				firstPower(el, "#361607", 1.5, 1); 
			} else if(d.state === "Great Saiyaman") { //Gohan
				firstPower(el, "#6DD903", 1.5, 1); 
			} else if(d.state === "Vegito Candy") { //Vegito
				firstPower(el, "#39100A", 1.5, 1); 
			} else if(d.state === "Mighty Mask") { //Goten & Trunks
				firstPower(el, "#005758", 1.5, 1); 
			}//else if
		});

	//Functions to add extra stroked circles around the character circle
	//depending on their power level
	function firstPower(el, charColor, radiusRatio, strokeWidth) {
		el.append("circle")
			.attr("class", "character-circle")
			.attr("r", baseRadius * radiusRatio)
			.style("fill", "none")
			.style("stroke", charColor)
			.style("stroke-width", strokeWidth);
	}//firstPower

	function secondPower(el, charColor, radiusRatio, strokeWidth) {
		el.append("circle")
			.attr("class", "character-circle")
			.attr("r", baseRadius * radiusRatio)
			.style("fill", "none")
			.style("stroke", charColor)
			.style("stroke-width", strokeWidth);
	}//secondPower

	function thirdPower(el, charColor) {
		el.append("circle")
			.attr("class", "character-circle")
			.attr("r", baseRadius * 2.5)
			.style("fill", "none")
			.style("stroke", charColor)
			.style("stroke-width", 1);
	}//thirdPower

}//createDbzFights


///////////////////////////////////////////////////////////////////////////
///////////////////////////// Mouse events ////////////////////////////////
///////////////////////////////////////////////////////////////////////////

//Mouse over a line
pt.dbzPathSimple.lineMouseOver = function(svg, d) {
	//Make the hovered line more visible and rest less (also in the mini map)
	svg.selectAll(".character-path-group")
		.transition("fade").duration(300)
		.style("opacity", 0.05);
	svg.selectAll(".character-path-group." + d.className)
		.transition("fade").duration(300)
		.style("opacity", 1);

	//Hide all the battles that do not feature the hovered over person
	svg.selectAll(".fight")
		.classed("nonactive", function(c) { return c.values.map(function(f) { return f.name; }).indexOf(d.key) === -1; })
		.transition("fade").duration(300)
		.style("opacity", 1);
	svg.selectAll(".fight.nonactive")
		.transition("fade").duration(300)
		.style("opacity", 0.1);

	//Hide saga lines & annotation a bit
	svg.selectAll(".saga-line")
		.transition("visible").duration(300)
    	.style("opacity", 0.3);
}//lineMouseOver

//Mouse out a line
pt.dbzPathSimple.lineMouseOut = function(svg, d, chosen) {
	//Hovered lines back to default
	svg.selectAll(".character-path-group")
		.transition("fade").duration(300)
		.style("opacity", function(c) { return chosen ? 1 : c.opacity; });

	//Fights back to default
	svg.selectAll(".fight")
		.transition("fade").duration(300)
		.style("opacity", chosen ? 0.7 : 1);

	//Reveal saga lines
	svg.selectAll(".saga-line")
		.transition("visible").duration(300)
    	.style("opacity", 1);
}//lineMouseOut

//Full mouseover a fight
pt.dbzPathSimple.fightMouseOver = function(svg, d, el, simple, chosen) {

	d3.event.stopPropagation();
	///////////////////////// Adjust the fight circle ////////////////////////
	
	//Make the fight elements bigger
	el
		.style("opacity", 1)
		.transition("grow").duration(500)
		.attr("transform", "scale(" + pt.dbzPathSimple.hoverScaleIncrease + ")");

	//Move the circles apart
	el.selectAll(".character-circle-group")
		.transition("move").duration(700)
		.attr("transform", function(c,i) { return "translate(" + (3/pt.dbzPathSimple.baseDistanceRatio*c.x) + "," + (3/pt.dbzPathSimple.baseDistanceRatio*c.y) + ")"; });

	//Make the background rect smaller
	el.select(".fight-background")
		.transition().duration(500)
		.attr("y", -pt.dbzPathSimple.backgroundRectSize/4/3)
		.attr("height", pt.dbzPathSimple.backgroundRectSize/2/3);

	//Make the background circle visible
	el.select(".fight-background-circle")
		.style("filter", "url(#shadow)")
		.transition().duration(500)
		.style("opacity", 1);

	///////////////////////// Hide other aspects ////////////////////////

	//Names of the people in the fight
	var combatants = d.values.map(function(f) { return f.name; });

	if(!simple) {
		//Make all the character lines less visible, except for those in the fight
		svg.selectAll(".character-path-group" + (chosen ? "." + pt.dbzPathSimple.chosen.toLowerCase() : ""))
			.transition("fade").duration(300)
			.style("opacity", function(c) { return combatants.indexOf(c.key) === -1 ? 0.05 : 1; });
	}//if

	//Hide all the battles that do not feature any of the characters in this fight
	svg.selectAll(".fight")
		.classed("nonactive", function(c) { return c.values.filter(function(n) { return combatants.indexOf(n.name) != -1; }).length === 0; })
		.transition("fade").duration(0)
		.style("opacity", 1)
	svg.selectAll(".fight.nonactive")
		.transition("fade").duration(300)
		.style("opacity", 0.1);

	//Hide saga lines & annotation a bit
	svg.selectAll(".saga-line")
		.transition("visible").duration(300)
    	.style("opacity", 0.3);
}//function fightMouseOver

//Full mouseout a fight
pt.dbzPathSimple.fightMouseOut = function(svg, d, el, simple, chosen) {

	//Return to the normal scale
	el
		.transition("grow").duration(500)
		.attr("transform", "scale(1)");

	//Move circles back together
	el.selectAll(".character-circle-group")
		.transition("move").duration(500)
		.attr("transform", function(c,i) { return "translate(" + c.x + "," + c.y + ")"; });

	//Make the background rect normal
	el.select(".fight-background")
		.transition().duration(500)
		.attr("y", -pt.dbzPathSimple.backgroundRectSize/4)
		.attr("height", pt.dbzPathSimple.backgroundRectSize/2);

	//Hide the background circle
	el.select(".fight-background-circle")
		.transition().duration(500)
		.style("opacity", 0)
		.on("end", function() { d3.select(this).style("filter", null); })

	if(!simple) {
		//Turn all character lines normal
		svg.selectAll(".character-path-group" + (chosen ? "." + pt.dbzPathSimple.chosen.toLowerCase() : ""))
			.transition("fade").duration(300)
			.style("opacity", function(c) { return (chosen ? 1 : c.opacity); });
	}//if

	var opacity = 1;
	if(!simple && chosen) opacity = 0.7;
	//Make all the fights visible
	svg.selectAll(".fight")
		.transition("fade").duration(300)
		.style("opacity", opacity);

	//Reveal saga lines & annotations
	svg.selectAll(".saga-line")
		.transition("visible").duration(300)
    	.style("opacity", 1);
}//function fightMouseOut


///////////////////////////////////////////////////////////////////////////
/////////////////////////////// Fragments /////////////////////////////////
///////////////////////////////////////////////////////////////////////////

//Only show the circles, no lines
pt.dbzPathSimple.showCirclesOnly = function() {

	//In case you move backward
	pt.dbzPathSimple.fights
		.on("mouseover", function(d) {
			var el = d3.select(this);
			d3.select(this.parentNode).raise();
			pt.dbzPathSimple.fightMouseOver(pt.dbzPathSimple.svg, d, el, 1, 1);
		})
		.on("mouseout", function(d) {
			var el = d3.select(this);
			pt.dbzPathSimple.fightMouseOut(pt.dbzPathSimple.svg, d, el, 1, 1);
		})
		.transition().duration(500)
		.style("opacity", 1);
	//No text
	pt.dbzPathSimple.updateText("");

	//Hide the path
	pt.dbzPathSimple.characterLines
		.on("mouseover", null)
		.on("mouseout", null)
		.transition().duration(500)
		.style("opacity", 0);

}//showCirclesOnly


//Show the simplest path, but not the anchor points
pt.dbzPathSimple.showSimplePaths = function() {

	//In case you move backward
	pt.dbzPathSimple.characterLines.selectAll("line, circle")
		.transition("fade").duration(500)
		.style("opacity", 0);

	//Update the text
	pt.dbzPathSimple.updateText("Simple path moving left & right");

	//Hide the circles a bit & full mouseover
	pt.dbzPathSimple.fights
		.on("mouseover", function(d) {
			var el = d3.select(this);
			d3.select(this.parentNode).raise();
			pt.dbzPathSimple.fightMouseOver(pt.dbzPathSimple.svg, d, el, 0, 1);
		})
		.on("mouseout", function(d) {
			var el = d3.select(this);
			pt.dbzPathSimple.fightMouseOut(pt.dbzPathSimple.svg, d, el, 0, 1);
		})
		.transition().duration(1000)
		.style("opacity", 0.7);

	//Show the most simple path
	pt.dbzPathSimple.characterLines
		.on("mouseover", function(d) { pt.dbzPathSimple.lineMouseOver(pt.dbzPathSimple.svg, d); })
		.on("mouseout", function(d) { pt.dbzPathSimple.lineMouseOut(pt.dbzPathSimple.svg, d, 1); })
		.filter(function(d) { return d.key === pt.dbzPathSimple.chosen; })
		.each(function(d,k) { 
			var el = d3.select(this);
			pt.dbzPathSimple.singleWidthNoSwoopAlternatePath(el,d,k)
		})
		.transition().duration(1000)
		.style("opacity", 1);

}//showSimplePaths


//Also show the anchor points
pt.dbzPathSimple.showAnchorPoints = function() {

	//In case you move backward
	pt.dbzPathSimple.characterLines
		.filter(function(d) { return d.key === pt.dbzPathSimple.chosen; })
		.each(function(d,k) { 
			var el = d3.select(this);
			pt.dbzPathSimple.singleWidthNoSwoopAlternatePath(el,d,k)
		});

	//Update the text
	pt.dbzPathSimple.updateText("The 'invisible' anchor points pulling the path outward");

	//Show the anchor points and lines
	pt.dbzPathSimple.characterLines.selectAll("line, circle")
		.transition("fade").duration(1000)
		.style("opacity", 1);

}//showSimplePaths


//Add a jitter and swoop outward the more fights in between
pt.dbzPathSimple.addSwoop = function() {

	//Update the text
	pt.dbzPathSimple.updateText("The longer a section, the more a path is pulled outward");

	//More adjustment with
	pt.dbzPathSimple.characterLines
		.filter(function(d) { return d.key === pt.dbzPathSimple.chosen; })
		.each(function(d,k) { 
			var el = d3.select(this);
			pt.dbzPathSimple.singleWidthAlternatePath(el,d,k)
		});

	pt.dbzPathSimple.previousStep = "addSwoop";

}//addSwoop


//Bad or good guy defines the side
pt.dbzPathSimple.addChangeSide = function() {

	//In case you move backward
	pt.dbzPathSimple.characterLines.selectAll("line, circle")
		.transition("fade").duration(500)
		.style("opacity", 1);
	//Fully show the chosen line
	pt.dbzPathSimple.characterLines
		.filter(function(d) { return d.key === pt.dbzPathSimple.chosen; })
		.transition("fade").duration(500)
		.style("opacity", 1);
	//Hide all the other lines and adjust the mouseover of all
	pt.dbzPathSimple.characterLines
		.on("mouseout", function(d) { pt.dbzPathSimple.lineMouseOut(pt.dbzPathSimple.svg, d, 1); })
		.filter(function(d) { return d.key !== pt.dbzPathSimple.chosen; })
		.selectAll("path")
		.style("display", "none")
		.style("opacity", 0);
	//Adjust the fight opacity and mouseover
	pt.dbzPathSimple.fights
		.on("mouseover", function(d) {
			var el = d3.select(this);
			d3.select(this.parentNode).raise();
			pt.dbzPathSimple.fightMouseOver(pt.dbzPathSimple.svg, d, el, 0, 1);
		})
		.on("mouseout", function(d) {
			var el = d3.select(this);
			pt.dbzPathSimple.fightMouseOut(pt.dbzPathSimple.svg, d, el, 0, 1);
		})
		.transition("fade").duration(500)
		.style("opacity", 0.7);

	//Update the text
	pt.dbzPathSimple.updateText("Bad or Good guy defines the 'swooping' side");

	if(pt.dbzPathSimple.previousStep === "addSwoop") {
		//The side of good/bad guy determines the swoop side
		pt.dbzPathSimple.characterLines
			.filter(function(d) { return d.key === pt.dbzPathSimple.chosen; })
			.each(function(d,k) { 
				var el = d3.select(this);
				pt.dbzPathSimple.singleWidthBadGuys(el,d,k)
			});
	}//if

	pt.dbzPathSimple.previousStep = "changeSide";

}//addChangeSide


//Hide all the anchord and show all the other lines
pt.dbzPathSimple.hideAnchors = function() {

	//In case you come in from the next slide
	if(pt.dbzPathSimple.previousStep !== "changeSide") {
		pt.dbzPathSimple.characterLines
			.filter(function(d) { return d.key === pt.dbzPathSimple.chosen; })
			.each(function(d,k) { 
				var el = d3.select(this);
				pt.dbzPathSimple.singleWidthBadGuys(el,d,k)
			});

		pt.dbzPathSimple.characterLines.selectAll("path")
			.style("display","block");
	}//if

	//Update the text
	pt.dbzPathSimple.updateText("");

	//Full hover
	pt.dbzPathSimple.fights
		.on("mouseover", function(d) {
			var el = d3.select(this);
			d3.select(this.parentNode).raise();
			pt.dbzPathSimple.fightMouseOver(pt.dbzPathSimple.svg, d, el, 0, 0);
		})
		.on("mouseout", function(d) {
			var el = d3.select(this);
			pt.dbzPathSimple.fightMouseOut(pt.dbzPathSimple.svg, d, el, 0, 0);
		})
		.transition("fade").duration(1000)
		.style("opacity", 1);

	//Show all the other lines as well
	pt.dbzPathSimple.characterLines
		.on("mouseover", function(d) { pt.dbzPathSimple.lineMouseOver(pt.dbzPathSimple.svg, d); })
		.on("mouseout", function(d) { pt.dbzPathSimple.lineMouseOut(pt.dbzPathSimple.svg, d, 0); })
		.filter(function(d) { return d.key !== pt.dbzPathSimple.chosen; })
		.selectAll("path")
		.style("display", "block")
		.transition().duration(1000).delay(500)
		.style("opacity", 1);

	//Hide the anchor points
	pt.dbzPathSimple.characterLines.selectAll("line, circle")
		.transition("fade").duration(1000)
		.style("opacity", 0);

	//Hide all the lines a bit
	pt.dbzPathSimple.characterLines
		.transition().duration(1000)
		.style("opacity", 0.6);

	pt.dbzPathSimple.previousStep = "hideAnchors";

}//hideAnchors

///////////////////////////////////////////////////////////////////////////
//////////////////////////// Adjust the text //////////////////////////////
///////////////////////////////////////////////////////////////////////////

pt.dbzPathSimple.updateText = function(text) {
	//Update the explanation text next to the visual
	d3.select(pt.dbzPathSimple.id + " .dbz-text")
		.transition().duration(200)
		.style("opacity", 0)
		.on("end", function(d) {
			d3.select(this)
				.text(text)
				.transition().duration(200)
				.style("opacity", 1);
		});
}//updateText

///////////////////////////////////////////////////////////////////////////
/////////// Single width paths - only for the chosen character ////////////
///////////////////////////////////////////////////////////////////////////

pt.dbzPathSimple.createSimplePathChosen = function(el,d,k) {

	el.selectAll("path").remove();
	el.selectAll("circle").remove();
	el.selectAll("line").remove();

	var sagaFights = d.values;

	//Is the character a main character that should be followed across saga's?
	var fullChar = pt.dbzPathSimple.fullCharacters.indexOf(d.key) > -1;

	var xSwoopDist = pt.dbzPathSimple.sagaDistance/2;

	//Add a bit of jitter to the paths so it is different throughout
	var yDiff,
		xOld, yOld,
		xQ, yQ,
		xBaseline;
	//Save the SVG path string
	var path;

	//To what side of the saga line should the line swoop (-1 left, 1 right)
	var xSwing = Math.random()>0.5 ? -1 : 1;
	d.xSwing = xSwing;

	//For the id of the path
	var counter = 0;

	var anchorPoints = [],
		anchorLines = [];

	//Loop over each saga to calculate the custom path
	sagaFights.forEach(function(s,i) {
		var charFights = s.values;

		//If this isn't a full character and there is only 1 fight in this saga, don't create a line
		if(!fullChar && charFights.length === 1) return;

		var j = 0;
		var x = Math.round(pt.dbzPathSimple.sagaScale( pt.dbzPathSimple.sagaData[ pt.dbzPathSimple.sagaNames.indexOf(charFights[j].subSaga) ].id )),
			y = pt.dbzPathSimple.fightScale(charFights[j].id);

		//For the characters that have a line crossing the different sagas
		if(fullChar && i > 0) { 

			yDiff = y - yOld;
			xDiff = x - xOld;
			xBaseline = xSwing === 1 ? x : xOld;

			xQ = round2(xSwing*xSwoopDist + xBaseline);
			yQ = round2(yDiff/2 + yOld);
			path = path + " Q" + xQ + "," + yQ + " " + x + "," + round2(y);
			//Save the anchor point information to plot them
			anchorPoints.push({xQ: xQ, yQ: yQ});
			anchorLines.push({xQ: xQ, yQ: yQ, x: xOld, y: yOld});
			anchorLines.push({xQ: xQ, yQ: yQ, x: x, y: round2(y)});

			xSwing = -1*xSwing;
					
		 } else { 
		 	path = "M" + x + "," + round2(y);
		 	anchorPoints = [];
		 	anchorLines = [];
		 }//else

		xOld = x;
		yOld = y;

		for(var j=1; j<charFights.length; j++) {

			x = Math.round(pt.dbzPathSimple.sagaScale( pt.dbzPathSimple.sagaData[pt.dbzPathSimple.sagaNames.indexOf(charFights[j].subSaga)].id ));
			y = pt.dbzPathSimple.fightScale(charFights[j].id);

			yDiff = y - yOld;
			xQ = round2(xSwing*xSwoopDist + x);
			yQ = round2(yDiff/2 + yOld);

			//Lots of stuff happening to get some randomness to the lines, so people from the same fight hopefully don't overlap too much
			path = path + " Q" + round2(xSwing*xSwoopDist + x) + "," + round2(yDiff/2 + yOld) + " " + x + "," + round2(y);

			//Save the anchor point information to plot them
			anchorPoints.push({xQ: xQ, yQ: yQ});
			anchorLines.push({xQ: xQ, yQ: yQ, x: xOld, y: yOld});
			anchorLines.push({xQ: xQ, yQ: yQ, x: x, y: round2(y)});

			xOld = x;
			yOld = y;

			xSwing = -1*xSwing;

		}//for j

		//Draw the path if this is either the last saga for a main character
		//or the last fight within a saga for the others
		if(!fullChar || (fullChar && i === sagaFights.length-1)) {
			var id = "id-" + d.key.replace(" ", "_").toLowerCase();

			//Add the lines towards the anchor points
			el.selectAll(".anchor-line")
				.data(anchorLines)
				.enter().append("line")
				.attr("class", "anchor-line")
				.attr("id", function(l,j) { return id + "-anchor-line-" + j; })
				.attr("x1", function(l) { return l.x; })
				.attr("y1", function(l) { return l.y; })
				.attr("x2", function(l) { return l.xQ; })
				.attr("y2", function(l) { return l.yQ; })
				.style("opacity", 0);

			//Append the path
			el.append("path")
				.attr("class","character-path")
				.attr("id", id + "-path-" + counter)
				.style("fill", "none")
				.style("stroke-width", 4)
				.attr("d", path);	

			//Add the anchor point circles
			el.selectAll(".anchor-point")
				.data(anchorPoints)
				.enter().append("circle")
				.attr("class", "anchor-point")
				.attr("id", function(l,j) { return id + "-anchor-point-" + j; })
				.attr("cx", function(l) { return l.xQ; })
				.attr("cy", function(l) { return l.yQ; })
				.attr("r", pt.dbzPathSimple.baseRadius)
				.style("opacity", 0)

			counter+=1;					
		}//if

	});
}//createSimplePathChosen

///////////////////////////////////////////////////////////////////////////
////////// Single width paths - same xSwoop - Alternating sides ///////////
///////////////////////////////////////////////////////////////////////////

pt.dbzPathSimple.singleWidthNoSwoopAlternatePath = function(el,d,k) {

	var sagaFights = d.values;

	//Is the character a main character that should be followed across saga's?
	var fullChar = pt.dbzPathSimple.fullCharacters.indexOf(d.key) > -1;

	var xSwoopDist = pt.dbzPathSimple.sagaDistance/2;

	//Add a bit of jitter to the paths so it is different throughout
	var yDiff,
		xOld, yOld,
		xQ, yQ,
		xBaseline;
	//Save the SVG path string
	var path;

	//To what side of the saga line should the line swoop (-1 left, 1 right)
	var xSwing = d.xSwing;

	//For the id of the path
	var counter = 0;

	var anchorPoints = [],
		anchorLines = [];

	//Loop over each saga to calculate the custom path
	sagaFights.forEach(function(s,i) {
		var charFights = s.values;

		//If this isn't a full character and there is only 1 fight in this saga, don't create a line
		if(!fullChar && charFights.length === 1) return;

		var j = 0;
		var x = Math.round(pt.dbzPathSimple.sagaScale( pt.dbzPathSimple.sagaData[ pt.dbzPathSimple.sagaNames.indexOf(charFights[j].subSaga) ].id )),
			y = pt.dbzPathSimple.fightScale(charFights[j].id);

		//For the characters that have a line crossing the different sagas
		if(fullChar && i > 0) { 

			yDiff = y - yOld;
			xDiff = x - xOld;
			xBaseline = xSwing === 1 ? x : xOld;

			xQ = round2(xSwing*xSwoopDist + xBaseline);
			yQ = round2(yDiff/2 + yOld);
			path = path + " Q" + xQ + "," + yQ + " " + x + "," + round2(y);

			//Save the anchor point information to plot them
			anchorPoints.push({xQ: xQ, yQ: yQ});
			anchorLines.push({xQ: xQ, yQ: yQ, x: xOld, y: yOld});
			anchorLines.push({xQ: xQ, yQ: yQ, x: x, y: round2(y)});

			xSwing = -1*xSwing;
					
		 } else { 
		 	path = "M" + x + "," + round2(y);
		 	anchorPoints = [];
			anchorLines = []; 
		 }//else

		xOld = x;
		yOld = y;

		for(var j=1; j<charFights.length; j++) {

			x = Math.round(pt.dbzPathSimple.sagaScale( pt.dbzPathSimple.sagaData[pt.dbzPathSimple.sagaNames.indexOf(charFights[j].subSaga)].id ));
			y = pt.dbzPathSimple.fightScale(charFights[j].id);

			yDiff = y - yOld;
			xQ = round2(xSwing*xSwoopDist + x);
			yQ = round2(yDiff/2 + yOld);

			//Lots of stuff happening to get some randomness to the lines, so people from the same fight hopefully don't overlap too much
			path = path + " Q" + xQ + "," + yQ + " " + x + "," + round2(y);

			//Save the anchor point information to plot them
			anchorPoints.push({xQ: xQ, yQ: yQ});
			anchorLines.push({xQ: xQ, yQ: yQ, x: xOld, y: yOld});
			anchorLines.push({xQ: xQ, yQ: yQ, x: x, y: round2(y)});

			xOld = x;
			yOld = y;

			xSwing = -1*xSwing;

		}//for j

		//Draw the path if this is either the last saga for a main character
		//or the last fight within a saga for the others
		if(!fullChar || (fullChar && i === sagaFights.length-1)) {
			var id = "id-" + d.key.replace(" ", "_").toLowerCase();

			//Change the lines towards the anchor points
			el.selectAll(".anchor-line")
				.data(anchorLines)
				.transition().duration(1000)
				.attr("x1", function(l) { return l.x; })
				.attr("y1", function(l) { return l.y; })
				.attr("x2", function(l) { return l.xQ; })
				.attr("y2", function(l) { return l.yQ; });

			//Change the path
			el.select("#" + id + "-path-" + counter)
				.transition().duration(1000)
				.attr("d", path);	

			//Change the anchor point circles
			el.selectAll(".anchor-point")
				.data(anchorPoints)
				.transition().duration(1000)
				.attr("cx", function(l) { return l.xQ; })
				.attr("cy", function(l) { return l.yQ; });

			counter+=1;					
		}//if

	});
}//singleWidthNoSwoopAlternatePath

///////////////////////////////////////////////////////////////////////////
/////////// Single width paths - different xSwoop - Alternate /////////////
///////////////////////////////////////////////////////////////////////////

pt.dbzPathSimple.singleWidthAlternatePath = function(el,d,k) {

	var sagaFights = d.values;

	//Is the character a main character that should be followed across saga's?
	var fullChar = pt.dbzPathSimple.fullCharacters.indexOf(d.key) > -1;

	var xSwoopDist = pt.dbzPathSimple.sagaDistance/2;

	//Add a bit of jitter to the paths so it is different throughout
	var jitter = 0, maxJitter, minJitter, jitterUp = 0,
		yDiff,
		xOld, yOld,
		xQ, yQ,
		xBaseline;
	//Save the SVG path string
	var path;

	//For the id of the path
	var counter = 0;

	var anchorPoints = [],
		anchorLines = [];

	//To what side of the saga line should the line swoop (-1 left, 1 right)
	var xSwing = d.xSwing;

	//Loop over each saga to calculate the custom path
	sagaFights.forEach(function(s,i) {
		var charFights = s.values;

		//If this isn't a full character and there is only 1 fight in this saga, don't create a line
		if(!fullChar && charFights.length === 1) return;

		var j = 0;
		var x = Math.round(pt.dbzPathSimple.sagaScale( pt.dbzPathSimple.sagaData[ pt.dbzPathSimple.sagaNames.indexOf(charFights[j].subSaga) ].id )),
			y = pt.dbzPathSimple.fightScale(charFights[j].id);

		//For the characters that have a line crossing the different sagas
		if(fullChar && i > 0) { 

			yDiff = y - yOld;
			xDiff = x - xOld;
			xBaseline = xSwing === 1 ? x : xOld;

			numFightsInBetween = yDiff/pt.dbzPathSimple.backgroundRectSize;
			maxJitter = 1 + pt.dbzPathSimple.jitterScale(numFightsInBetween);
			minJitter = 1 - pt.dbzPathSimple.jitterScale(numFightsInBetween)/2;
			jitter = (Math.random() * (maxJitter - minJitter) + minJitter).toFixed(2);

			xQ = round2(xSwing*xSwoopDist*jitter*pt.dbzPathSimple.xSwoopScale(numFightsInBetween) + xBaseline);
			yQ = round2(yDiff/2 + yOld);
			path = path + " Q" + xQ + "," + yQ + " " + x + "," + round2(y);

			//Save the anchor point information to plot them
			anchorPoints.push({xQ: xQ, yQ: yQ});
			anchorLines.push({xQ: xQ, yQ: yQ, x: xOld, y: yOld});
			anchorLines.push({xQ: xQ, yQ: yQ, x: x, y: round2(y)});

			xSwing = -1*xSwing;
					
		 } else { 
		 	path = "M" + x + "," + round2(y);
		 	anchorPoints = [];
			anchorLines = [];  
		 }//else

		xOld = x;
		yOld = y;

		for(var j=1; j<charFights.length; j++) {

			x = Math.round(pt.dbzPathSimple.sagaScale( pt.dbzPathSimple.sagaData[pt.dbzPathSimple.sagaNames.indexOf(charFights[j].subSaga)].id ));
			y = pt.dbzPathSimple.fightScale(charFights[j].id);
			yDiff = y - yOld;

			numFightsInBetween = yDiff/pt.dbzPathSimple.backgroundRectSize;
			maxJitter = 1 + pt.dbzPathSimple.jitterScale(numFightsInBetween);
			minJitter = 1 - pt.dbzPathSimple.jitterScale(numFightsInBetween)/2;
			jitter = (Math.random() * (maxJitter - minJitter) + minJitter).toFixed(2);
			
			xQ = round2(xSwing*xSwoopDist*jitter*pt.dbzPathSimple.xSwoopScale(numFightsInBetween) + x);
			yQ = round2(yDiff/2 + yOld);

			//Lots of stuff happening to get some randomness to the lines, so people from the same fight hopefully don't overlap too much
			path = path + " Q" + xQ + "," + yQ + " " + x + "," + round2(y);

			//Save the anchor point information to plot them
			anchorPoints.push({xQ: xQ, yQ: yQ});
			anchorLines.push({xQ: xQ, yQ: yQ, x: xOld, y: yOld});
			anchorLines.push({xQ: xQ, yQ: yQ, x: x, y: round2(y)});

			xOld = x;
			yOld = y;

			xSwing = -1*xSwing;

		}//for j

		//Draw the path if this is either the last saga for a main character
		//or the last fight within a saga for the others
		if(!fullChar || (fullChar && i === sagaFights.length-1)) {
			var id = "id-" + d.key.replace(" ", "_").toLowerCase();

			//Change the lines towards the anchor points
			el.selectAll(".anchor-line")
				.data(anchorLines)
				.transition().duration(1000)
				.attr("x1", function(l) { return l.x; })
				.attr("y1", function(l) { return l.y; })
				.attr("x2", function(l) { return l.xQ; })
				.attr("y2", function(l) { return l.yQ; });

			//Change the path
			el.select("#" + id + "-path-" + counter)
				.transition().duration(1000)
				.attr("d", path);	

			//Change the anchor point circles
			el.selectAll(".anchor-point")
				.data(anchorPoints)
				.transition().duration(1000)
				.attr("cx", function(l) { return l.xQ; })
				.attr("cy", function(l) { return l.yQ; });

			counter+=1;					
		}//if

	});
}//singleWidthAlternatePath

///////////////////////////////////////////////////////////////////////////
////// Single width path - different xSwoop - bad vs good guys side ///////
///////////////////////////////////////////////////////////////////////////

pt.dbzPathSimple.singleWidthBadGuys = function(el,d,k) {

	var sagaFights = d.values;

	//Is the character a main character that should be followed across saga's?
	var fullChar = pt.dbzPathSimple.fullCharacters.indexOf(d.key) > -1;

	var xSwoopDist = pt.dbzPathSimple.sagaDistance/2;

	//Add a bit of jitter to the paths so it is different throughout
	var jitter = 0, maxJitter, minJitter, jitterUp = 0,
		yDiff,
		xOld, yOld,
		xQ, yQ,
		xBaseline;
	//Save the SVG path string
	var path;

	//For the id of the path
	var counter = 0;

	var anchorPoints = [],
		anchorLines = [];

	//To what side of the saga line should the line swoop (-1 left, 1 right)
	var xSwing = -1,
		changing = 0;
	if (pt.dbzPathSimple.goodGuys.indexOf(d.key) > -1) {
		xSwing = -1
	} else if (pt.dbzPathSimple.badGuys.indexOf(d.key) > -1) {
		xSwing = 1;
	} else if (pt.dbzPathSimple.changeGuys.indexOf(d.key) > -1) {
		//The swing side needs to be decided per fight
		changing = 1;
	} else {
		//If it is just one fight character, it doesn't matter
		xSwing = 1;
	}

	//Loop over each saga to calculate the custom path
	sagaFights.forEach(function(s,i) {
		var charFights = s.values;

		//If this isn't a full character and there is only 1 fight in this saga, don't create a line
		if(!fullChar && charFights.length === 1) return;

		var j = 0;
		var x = Math.round(pt.dbzPathSimple.sagaScale( pt.dbzPathSimple.sagaData[ pt.dbzPathSimple.sagaNames.indexOf(charFights[j].subSaga) ].id )),
			y = pt.dbzPathSimple.fightScale(charFights[j].id);

		//For the characters that have a line crossing the different sagas
		if(fullChar && i > 0) { 

			//Check if this is a changing character
			if(changing) xSwing = pt.dbzPathSimple.badFights[d.key].indexOf(charFights[j].id) > -1 ? 1 : -1;

			yDiff = y - yOld;
			xDiff = x - xOld;
			xBaseline = xSwing === 1 ? x : xOld;
			numFightsInBetween = yDiff/pt.dbzPathSimple.backgroundRectSize;
			maxJitter = 1 + pt.dbzPathSimple.jitterScale(numFightsInBetween);
			minJitter = 1 - pt.dbzPathSimple.jitterScale(numFightsInBetween)/2;
			jitter = (Math.random() * (maxJitter - minJitter) + minJitter).toFixed(2);
	
			xQ = round2(xSwing*xSwoopDist*jitter*pt.dbzPathSimple.xSwoopScale(numFightsInBetween) + xBaseline);
			yQ = round2(yDiff/2 + yOld);
			path = path + " Q" + xQ + "," + yQ + " " + x + "," + round2(y);

			//Save the anchor point information to plot them
			anchorPoints.push({xQ: xQ, yQ: yQ});
			anchorLines.push({xQ: xQ, yQ: yQ, x: xOld, y: yOld});
			anchorLines.push({xQ: xQ, yQ: yQ, x: x, y: round2(y)});

		 } else { 
		 	path = "M" + x + "," + round2(y); 
		 	anchorPoints = [];
			anchorLines = [];  
		 }//else

		xOld = x;
		yOld = y;

		for(var j=1; j<charFights.length; j++) {
			//Check if this is a changing-side character
			if(changing) xSwing = pt.dbzPathSimple.badFights[d.key].indexOf(charFights[j].id) > -1 ? 1 : -1;

			x = Math.round(pt.dbzPathSimple.sagaScale( pt.dbzPathSimple.sagaData[pt.dbzPathSimple.sagaNames.indexOf(charFights[j].subSaga)].id ));
			y = pt.dbzPathSimple.fightScale(charFights[j].id);
			yDiff = y - yOld;
			numFightsInBetween = yDiff/pt.dbzPathSimple.backgroundRectSize;
			maxJitter = 1 + pt.dbzPathSimple.jitterScale(numFightsInBetween);
			minJitter = 1 - pt.dbzPathSimple.jitterScale(numFightsInBetween)/2;
			jitter = (Math.random() * (maxJitter - minJitter) + minJitter).toFixed(2);

			xQ = round2(xSwing*xSwoopDist*jitter*pt.dbzPathSimple.xSwoopScale(numFightsInBetween) + x);
			yQ = round2(yDiff/2 + yOld);

			//Lots of stuff happening to get some randomness to the lines, so people from the same fight hopefully don't overlap too much
			path = path + " Q" + xQ + "," + yQ + " " + x + "," + round2(y);

			//Save the anchor point information to plot them
			anchorPoints.push({xQ: xQ, yQ: yQ});
			anchorLines.push({xQ: xQ, yQ: yQ, x: xOld, y: yOld});
			anchorLines.push({xQ: xQ, yQ: yQ, x: x, y: round2(y)});

			xOld = x;
			yOld = y;

		}//for j

		//Draw the path if this is either the last saga for a main character
		//or the last fight within a saga for the others
		if(!fullChar || (fullChar && i === sagaFights.length-1)) {
			var id = "id-" + d.key.replace(" ", "_").toLowerCase();

			//Change the lines towards the anchor points
			el.selectAll(".anchor-line")
				.data(anchorLines)
				.transition().duration(1000)
				.attr("x1", function(l) { return l.x; })
				.attr("y1", function(l) { return l.y; })
				.attr("x2", function(l) { return l.xQ; })
				.attr("y2", function(l) { return l.yQ; });

			//Change the path
			el.select("#" + id + "-path-" + counter)
				.transition().duration(1000)
				.attr("d", path);	

			//Change the anchor point circles
			el.selectAll(".anchor-point")
				.data(anchorPoints)
				.transition().duration(1000)
				.attr("cx", function(l) { return l.xQ; })
				.attr("cy", function(l) { return l.yQ; });

			counter+=1;					
		}//if

	});
}//singleWidthBadGuys

///////////////////////////////////////////////////////////////////////////
/// Single width path - different xSwoop - bad guys side - no anchors /////
///////////////////////////////////////////////////////////////////////////

pt.dbzPathSimple.singleWidthBadGuysNoAnchor = function(el,d,k) {

	el.selectAll("path").remove();

	var sagaFights = d.values;

	//Is the character a main character that should be followed across saga's?
	var fullChar = pt.dbzPathSimple.fullCharacters.indexOf(d.key) > -1;

	var xSwoopDist = pt.dbzPathSimple.sagaDistance/2;

	//Add a bit of jitter to the paths so it is different throughout
	var jitter = 0, maxJitter, minJitter, jitterUp = 0,
		yDiff,
		xOld, yOld,
		xQ, yQ,
		xBaseline;
	//Save the SVG path string
	var path;

	//For the id of the path
	var counter = 0;

	//To what side of the saga line should the line swoop (-1 left, 1 right)
	var xSwing = -1,
		changing = 0;
	if (pt.dbzPathSimple.goodGuys.indexOf(d.key) > -1) {
		xSwing = -1
	} else if (pt.dbzPathSimple.badGuys.indexOf(d.key) > -1) {
		xSwing = 1;
	} else if (pt.dbzPathSimple.changeGuys.indexOf(d.key) > -1) {
		//The swing side needs to be decided per fight
		changing = 1;
	} else {
		//If it is just one fight character, it doesn't matter
		xSwing = 1;
	}

	//Loop over each saga to calculate the custom path
	sagaFights.forEach(function(s,i) {
		var charFights = s.values;

		//If this isn't a full character and there is only 1 fight in this saga, don't create a line
		if(!fullChar && charFights.length === 1) return;

		var j = 0;
		var x = Math.round(pt.dbzPathSimple.sagaScale( pt.dbzPathSimple.sagaData[ pt.dbzPathSimple.sagaNames.indexOf(charFights[j].subSaga) ].id )),
			y = pt.dbzPathSimple.fightScale(charFights[j].id);

		//For the characters that have a line crossing the different sagas
		if(fullChar && i > 0) { 

			//Check if this is a changing character
			if(changing) xSwing = pt.dbzPathSimple.badFights[d.key].indexOf(charFights[j].id) > -1 ? 1 : -1;

			yDiff = y - yOld;
			xDiff = x - xOld;
			xBaseline = xSwing === 1 ? x : xOld;
			numFightsInBetween = yDiff/pt.dbzPathSimple.backgroundRectSize;
			maxJitter = 1 + pt.dbzPathSimple.jitterScale(numFightsInBetween);
			minJitter = 1 - pt.dbzPathSimple.jitterScale(numFightsInBetween)/2;
			jitter = (Math.random() * (maxJitter - minJitter) + minJitter).toFixed(2);
	
			xQ = round2(xSwing*xSwoopDist*jitter*pt.dbzPathSimple.xSwoopScale(numFightsInBetween) + xBaseline);
			yQ = round2(yDiff/2 + yOld);
			path = path + " Q" + xQ + "," + yQ + " " + x + "," + round2(y);

		 } else { 
		 	path = "M" + x + "," + round2(y); 
		 }//else

		xOld = x;
		yOld = y;

		for(var j=1; j<charFights.length; j++) {
			//Check if this is a changing-side character
			if(changing) xSwing = pt.dbzPathSimple.badFights[d.key].indexOf(charFights[j].id) > -1 ? 1 : -1;

			x = Math.round(pt.dbzPathSimple.sagaScale( pt.dbzPathSimple.sagaData[pt.dbzPathSimple.sagaNames.indexOf(charFights[j].subSaga)].id ));
			y = pt.dbzPathSimple.fightScale(charFights[j].id);
			yDiff = y - yOld;
			numFightsInBetween = yDiff/pt.dbzPathSimple.backgroundRectSize;
			maxJitter = 1 + pt.dbzPathSimple.jitterScale(numFightsInBetween);
			minJitter = 1 - pt.dbzPathSimple.jitterScale(numFightsInBetween)/2;
			jitter = (Math.random() * (maxJitter - minJitter) + minJitter).toFixed(2);

			xQ = round2(xSwing*xSwoopDist*jitter*pt.dbzPathSimple.xSwoopScale(numFightsInBetween) + x);
			yQ = round2(yDiff/2 + yOld);

			//Lots of stuff happening to get some randomness to the lines, so people from the same fight hopefully don't overlap too much
			path = path + " Q" + xQ + "," + yQ + " " + x + "," + round2(y);

			xOld = x;
			yOld = y;

		}//for j

		//Draw the path if this is either the last saga for a main character
		//or the last fight within a saga for the others
		if(!fullChar || (fullChar && i === sagaFights.length-1)) {
			//Change the path
			el.append("path")
				.attr("class","character-path")
				.attr("d", path)
				.style("fill", "none")
				.style("stroke-width", 4)
				.style("opacity", 0)
				.style("display", "none");			
		}//if

	});
}//singleWidthBadGuysNoAnchor

///////////////////////////////////////////////////////////////////////////
//////////////////// Create different width paths /////////////////////////
///////////////////////////////////////////////////////////////////////////

pt.dbzPathSimple.diffWidthPath = function(el,d,k) {

	var sagaFights = d.values;

	//Is the character a main character that should be followed across saga's?
	var fullChar = pt.dbzPathSimple.fullCharacters.indexOf(d.key) > -1;

	var xSwoopDist = pt.dbzPathSimple.sagaDistance/2;

	//Add a bit of jitter to the paths so it is different throughout
	var jitter = 0, maxJitter, minJitter, jitterUp = 0,
		yDiff,
		xOld, yOld,
		xBaseline;
	//Save the SVG path string
	var path,
		pathUp;

	//To what side of the saga line should the line swoop (-1 left, 1 right)
	var xSwing = -1,
		changing = 0;
	if (pt.dbzPathSimple.goodGuys.indexOf(d.key) > -1) {
		xSwing = -1
	} else if (pt.dbzPathSimple.badGuys.indexOf(d.key) > -1) {
		xSwing = 1;
	} else if (pt.dbzPathSimple.changeGuys.indexOf(d.key) > -1) {
		//The swing side needs to be decided per fight
		changing = 1;
	} else {
		//If it is just one fight character, it doesn't matter
		xSwing = 1;
	}

	//Loop over each saga to calculate the custom path
	sagaFights.forEach(function(s,i) {
		var charFights = s.values;

		//If this isn't a full character and there is only 1 fight in this saga, don't create a line
		if(!fullChar && charFights.length === 1) return;

		var j = 0;
		var x = Math.round(pt.dbzPathSimple.sagaScale( pt.dbzPathSimple.sagaData[ pt.dbzPathSimple.sagaNames.indexOf(charFights[j].subSaga) ].id )),
			y = pt.dbzPathSimple.fightScale(charFights[j].id);

		//For the characters that have a line crossing the different sagas
		if(fullChar && i > 0) { 

			//Check if this is a changing character
			if(changing) xSwing = pt.dbzPathSimple.badFights[d.key].indexOf(charFights[j].id) > -1 ? 1 : -1;

			yDiff = y - yOld;
			xDiff = x - xOld;
			xBaseline = xSwing === 1 ? x : xOld;
			numFightsInBetween = yDiff/pt.dbzPathSimple.backgroundRectSize;
			maxJitter = 1 + pt.dbzPathSimple.jitterScale(numFightsInBetween);
			minJitter = 1 - pt.dbzPathSimple.jitterScale(numFightsInBetween)/2;
			jitter = (Math.random() * (maxJitter - minJitter) + minJitter).toFixed(2);
			jitterUp = jitter - 0.01;
			while(Math.abs(jitterUp - jitter) < 0.1) {
				jitterUp = (Math.random() * (maxJitter - minJitter) + minJitter).toFixed(2);
			}//while

			path = path + " Q" + round2(xSwing*pt.dbzPathSimple.xSwoopScale(numFightsInBetween)*xSwoopDist*jitter + xBaseline) + "," + round2(yDiff/2 + yOld)  + " " + x + "," + round2(y);
			
			//If this is the end of the path, don't attach the current x and y, only the Q
			if(charFights.length === 1 && i === sagaFights.length-1) {
				pathUp = " Q" + round2(xSwing*pt.dbzPathSimple.xSwoopScale(numFightsInBetween)*xSwoopDist*jitterUp + xBaseline) + "," + round2(yDiff/2 + yOld) + " " + pathUp;
			} else {
				pathUp = x + "," + round2(y) + " Q" + round2(xSwing*pt.dbzPathSimple.xSwoopScale(numFightsInBetween)*xSwoopDist*jitterUp + xBaseline) + "," + round2(yDiff/2 + yOld) + " " + pathUp;
			}//else
			
		 } else { 
		 	path = "M" + x + "," + round2(y); 
		 	pathUp = x + "," + round2(y) + " Z";
		 }//else

		xOld = x;
		yOld = y;

		for(var j=1; j<charFights.length; j++) {
			//Check if this is a changing-side character
			if(changing) xSwing = pt.dbzPathSimple.badFights[d.key].indexOf(charFights[j].id) > -1 ? 1 : -1;

			x = Math.round(pt.dbzPathSimple.sagaScale( pt.dbzPathSimple.sagaData[pt.dbzPathSimple.sagaNames.indexOf(charFights[j].subSaga)].id ));
			y = pt.dbzPathSimple.fightScale(charFights[j].id);
			yDiff = y - yOld;
			numFightsInBetween = yDiff/pt.dbzPathSimple.backgroundRectSize;
			maxJitter = 1 + pt.dbzPathSimple.jitterScale(numFightsInBetween);
			minJitter = 1 - pt.dbzPathSimple.jitterScale(numFightsInBetween)/2;
			jitter = (Math.random() * (maxJitter - minJitter) + minJitter).toFixed(2);
			jitterUp = jitter - 0.01;
			while(Math.abs(jitterUp - jitter) < 0.1) {
				jitterUp = (Math.random() * (maxJitter - minJitter) + minJitter).toFixed(2);
			}//while

			//Lots of stuff happening to get some randomness to the lines, so people from the same fight hopefully don't overlap too much
			path = path + " Q" + round2(xSwing*pt.dbzPathSimple.xSwoopScale(numFightsInBetween)*xSwoopDist*jitter + x) + "," + round2(yDiff/2 + yOld) + " " + x + "," + round2(y);
			
			//If this is the end of the path, don't attach the current x and y, only the Q
			if( (!fullChar && j === charFights.length-1) || (fullChar && j === charFights.length-1 && i === sagaFights.length-1) ) {
				pathUp = " Q" + round2(xSwing*pt.dbzPathSimple.xSwoopScale(numFightsInBetween)*xSwoopDist*jitterUp + x) + "," + round2(yDiff/2 + yOld) + " " + pathUp;
			} else {
				pathUp = x + "," + round2(y) + " Q" + round2(xSwing*pt.dbzPathSimple.xSwoopScale(numFightsInBetween)*xSwoopDist*jitterUp + x) + "," + round2(yDiff/2 + yOld) + " " + pathUp;
			}

			xOld = x;
			yOld = y;

		}//for j

		//Draw the path if this is either the last saga for a main character
		//or the last fight within a saga for the others
		if(!fullChar || (fullChar && i === sagaFights.length-1)) {
			el.append("path")
				.attr("class","character-path")
				.attr("d", path + pathUp);						
		}//if

	});
}//diffWidthPath

