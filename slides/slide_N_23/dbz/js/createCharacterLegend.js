function createCharacterLegend(characters) {

	///////////////////////////////////////////////////////////////////////////
	/////////////////////////// Create legend data ////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	var mainProtagonists = [
		{character: "Goku", fights: 43, text: "The main character of the series and from the Saiyan race. He is immensely strong, pure of heart, and extremely competitive, but dedicated to defending the Earth from evil"},
		{character: "Piccolo", fights: 24, text: "A grumpy and very skilled fighter, this Namekian was originally an antagonist, but becomes an ally and mentor to Gohan during the start of <i>DBZ</i>"},
		{character: "Krillin", fights: 27, text: "As Goku's best friend he is often involved in battles with the bad guys, even though his strength does not compare to the Saiyans. He eventually forms a relationship with Android 18."},
		{character: "Gohan", fights: 33, text: "Goku's first son with Chi-Chi, starting out at age 4 in the series. Gohan slowly becomes one of the strongest characters in the series, eventually defeating Cell."},
		{character: "Future Trunks", fights: 14, text: "The first child of Vegeta and Bulma. Travels back in time to inform Goku of the Androids that in his time killed everyone. He eventually returns to his own time after helping to fight the Androids."},
	];

	var subProtagonists = [
		{character: "Tien Shinhan", fights: 12, text: "Descended from the Three-Eyed People he is a disciplined, reclusive and heavily devoted martial artist. He's best friends with Chiaotzu."},
		{character: "Chiaotzu", fights: 5, text: "Though he is not physically strong, Chiaotzu is skilled with psychokinesis and telepathy. He cares a lot about his best friend Tien Shinhan."},
		{character: "Yamcha", fights: 11, text: "Although mostly outclassed by the non-humans, Yamcha will occasionally lend a helping hand, thus proving himself to be a powerful ally in his own right."},
		{character: "Trunks", fights: 4, text: "Quite different from his future counterpart, young Trunks is cocky like is father Vegeta, spoiled like his mother Bulma and enjoys mischief."},
		{character: "Goten", fights: 6, text: "Looking practically like a young Goku, Goten is Goku & Chi-Chi's second son. He is very kind-hearted and best friends with Trunks."},
		{character: "Gotenks", fights: 4, text: "Overly cocky, arrogant, mischievous, playful and, whiny, Gotenks is the immensely powerful fusion of Trunks and Goten."},
		{character: "Vegito", fights: 2, text: "Both easygoing and cocky, Vegito is the immensely powerful result of the fusion between Goku and Vegeta by using the Potara Earrings."},
		{character: "Mr. Satan", fights: 4, text: "The weakest fighter and not actually part of the Z fighters. He's seen as the savior of Earth because he takes credit for beating Cell & Buu."},
	];
	//Videl, Chi-Chi, Kibito

	var mainAntagonists = [
		{character: "Raditz", fights: 4, text: "The older brother of Goku, he comes to Earth at the start of <i>DBZ</i> to recruit him into conquering other planets together with him, Nappa and Vegeta."},
		{character: "Vegeta", fights: 40, text: "Prince of the Saiyans, Vegeta starts out as a main antagonist, but his persistence to become stronger than Goku eventually results in him fighting for what's good, mostly..."},
		{character: "Frieza", fights: 20, text: "A galactic tyrant that wants the Dragon Balls so he can wish for eternal life. Destroyed the Saiyan planet in fear of the legendary Super Saiyan but is still eventually killed by one."},
		{character: "Cell", fights: 22, text: "He is an artificial life form created using the cells of the strongest fighters, including Goku, Vegeta, Piccolo and Frieza. Very vain, he holds the Cell Games to show off his power."},
		{character: "Buu", fights: 28, text: "A magical life form created by the warlock Bibidi, he goes through several forms, getting more and more evil with each one. Absorbs fighters to inherent their strength."},
	];

	var subAntagonists = [
		{character: "Nappa", fights: 4, text: "An elite Saiyan warrior, he accompanies Vegeta to Earth in search of the Dragon Balls. Isn't strong enough to defeat Goku and is subsequently killed by Vegeta."},
		{character: "Captain Ginyu", fights: 3, text: "Leader of the Ginyu force, he is a ridiculous dancer but strong fighter. Can swap bodies which he does with Goku, Bulma and a frog..."},
		{character: "Android 19", fights: 2, text: "The most obedient towards his creator, this overweight android relies too much on old data and is easily taken care of by Vegeta."},
		{character: "Android 20", fights: 3, text: "Having implanted his own brain into an exact replica of his body, this android is actually their creator Dr. Gero and quickly killed by Android 17."},
		{character: "Android 16", fights: 4, text: "A large fully mechanical android, he refrains from battle, only showing interest in following his orders to search for and kill Goku."},
		{character: "Android 17", fights: 3, text: "A human, brother to Android 18, he is forcefully turned into a cyborg. With nothing better to do, he and 16 & 18 begin to travel in order to kill Goku."},
		{character: "Android 18", fights: 6, text: "Sister to Android 17, she is also forcefully turned into a cyborg. Starting out as an antagonist during the Cell arc she eventually turns to the good side and even marries Krillin."},
		{character: "Cell Jr.", fights: 2, text: "As offspring of Cell they were asexually produced from Cell's tail, through cellular mitosis and have Cell's power and abilities."},
		{character: "Babidi", fights: 1, text: "The creator of Majin Buu, he takes over the minds of many strong warriors in order to help him achieve his goal, even enlisting Vegeta."},
		{character: "Dabura", fights: 4, text: "Dabura was a demon king placed under the wizard Babidi's control by a spell, becoming his right-hand man."},
	];
	//Saibaman, Jeice, Burter, Dodoria, Recoome, Zarbon, Guldo, Evil Buu, King Cold, Spopovich, Pui Pui, Yakon

	//? Olibu, Supreme Kai, Banan, Cui, Jewel, Killa, Pikkon, Pinar, Scarface, Shorty, Sui
	//Not important: Wild Tiger, Nail, Pan, Uub, Yajirobe	

	var allCharacters = mainProtagonists.concat(subProtagonists).concat(mainAntagonists).concat(subAntagonists);
	allCharacters = allCharacters.map(function(d) { return d.character; });
	
	///////////////////////////////////////////////////////////////////////////
	//////////////////////////// General values ///////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	//Fixed size for the circles
	var size = 35,
		sizeSmall = 35/2,
		circleRatio = 1.15;

	var marginSize = Math.round(1.2*size);
	var margin = {
	  top: marginSize*1.9, //To fit title
	  right: marginSize,
	  bottom: marginSize,
	  left: marginSize
	};

	//Scale the stroke of the circles depending on the size of the circles
	var strokeScale = d3.scaleLinear()
		.domain([10, 50])
		.range([1, 4]);

	var hoveredCircle;

	var heightOffset = drawLegend(mainProtagonists, subProtagonists, "Protagonists", 0);
	drawLegend(mainAntagonists, subAntagonists, "Antagonists", heightOffset);

	return allCharacters;

	///////////////////////////////////////////////////////////////////////////
	////////////////// Function to create SVGs and make legend ////////////////
	///////////////////////////////////////////////////////////////////////////

	function drawLegend(mainData, subData, title, heightOffset) {

		///////////////////////////////////////////////////////////////////////////
		//////////////////////////// Set up the SVG ///////////////////////////////
		///////////////////////////////////////////////////////////////////////////

		var width = document.getElementById("character-legend-" + title.toLowerCase()).clientWidth - 4*15 - margin.left - margin.right;
		var height = 8*size;
			
		//SVG container
		var svg = d3.select('#character-legend-' + title.toLowerCase())
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");

		var xOffset = 15,
			yExtraOffset = 0;
		if(title === "Antagonists") {
			if(document.documentElement.clientWidth >= 992-15) {
				xOffset = width + margin.left + margin.right + 5*15;
				yExtraOffset = 0;
			} else {
				xOffset = 15;
				yExtraOffset = heightOffset;
			}//else
		}//if

		d3.select("#character-legend-" + title.toLowerCase() + " svg").on("click", mouseOutLegend);

		///////////////////////////////////////////////////////////////////////////
		////////////////////////// Create defs elements ///////////////////////////
		///////////////////////////////////////////////////////////////////////////

		//Container for the gradients
		var defs = svg.append("defs");

		//Create wrapper for the clip paths
		var imageWrapper = defs.append("g").attr("class", "image-group-wrapper");

		var subDataSwitch = mainData.length;

		//Create a circle with an image for the main characters
		imageWrapper.selectAll(".character-legend-image")
			.data(mainData.concat(subData))
			.enter().append("pattern")
			.attr("id", function(d) { return "character-legend-" + d.character.replace(" ", "_"); })
			.attr("class", "character-legend-image")
			.attr("patternUnits", "objectBoundingBox")
			.attr("height", "100%")
			.attr("width", "100%")
			.append("image")
				.attr("xlink:href", function(d) { return "img/" + d.character + ".jpg"; })
				.attr("width", function(d,i) { 
					var smallSize = i >= subDataSwitch ? 0.5 : 1;
					return 2*size*smallSize; 
				})
				.attr("height", function(d,i) { 
					var smallSize = i >= subDataSwitch ? 0.5 : 1;
					return 2*size*smallSize; 
				});	

		///////////////////////////////////////////////////////////////////////////
		//////////////////////////// Place the titles /////////////////////////////
		///////////////////////////////////////////////////////////////////////////

		//Add title on top
		svg.append("text")
			.attr("class","character-legend-text")
			.attr("x", width/2)
			.attr("y", -size*1.75)
			.attr("dy", "0.3em")
			//.style("fill", "url(#legend-title-gradient)")
			.text(title);

		///////////////////////////////////////////////////////////////////////////
		//////////// Create a circle with image for the main characters ///////////
		///////////////////////////////////////////////////////////////////////////

		var characterCircleWrapper = svg.append("g").attr("class", "character-legend-wrapper");

		var finalRow = 0;
		finalRow = drawCircles(characterCircleWrapper, width, xOffset, yExtraOffset, mainData, "main-" + title.toLowerCase(), finalRow, "big");
		finalRow = drawCircles(characterCircleWrapper, width, xOffset, yExtraOffset, subData, "sub-" + title.toLowerCase(), finalRow + 2*size*0.9, "small");

		//Readjust the height to accomodate all the charcters
		d3.select('#character-legend-' + title.toLowerCase() + ' svg').attr("height", Math.max(0,finalRow) + margin.top + margin.bottom);

		return finalRow + margin.top + margin.bottom;

	}//function drawLegend

	///////////////////////////////////////////////////////////////////////////
	//////////////////// Function to draw the circles /////////////////////////
	///////////////////////////////////////////////////////////////////////////

	function drawCircles(wrapper, width, xOffset, yExtraOffset, data, className, yOffset, type) {

		if(type === "small") {
			var scaleIncrease = 3;
			var s = size/2;
			var cr = 1.2;
			var extraWidth = size;
		} else {
			var scaleIncrease = 2;
			var s = size;
			var cr = circleRatio;
			var extraWidth = 0;
		}//else
		//Very manual change
		if(type === "small" && className === "sub-protagonists") extraWidth = -size*1.5;

		//Save the location of the final row, so the next group can be placed under it in the next function call
		var finalRow;

		var circleTotalWidth = (2*s * cr),
			numPerRow = Math.round( (extraWidth + width) / circleTotalWidth ),
			remainingWidth = round2( (extraWidth + width) - numPerRow * circleTotalWidth)/2,
			remainingCircle = data.length % numPerRow,
			numRows = Math.ceil(data.length / numPerRow);

		//If there are only two rows, divide them up nicely
		if(numRows === 2) {
			numPerRow = Math.ceil(data.length/2) + (data.length%2 === 0 ? 1 : 0);
			remainingWidth = round2( (extraWidth + width) - numPerRow * circleTotalWidth)/2;
			remainingCircle = data.length % numPerRow;
		}//if

		//Add the circles that will be filled with images
		var characterCircle = wrapper.selectAll("." + className)
			.data(data)
			.enter().append("g")
			.attr("class", "character-legend-group " + className)
			.attr("transform", function(d,i) { 
				var offsetX = 0.5;
				//If there is anything left for the last row that isn't exactly numPerRow
				if(i >= data.length - remainingCircle) offsetX = (numPerRow - remainingCircle) * offsetX + offsetX;
				if(i === data.length-1) finalRow = yOffset + Math.floor(i/numPerRow) * circleTotalWidth;

				d.x = - extraWidth/2 + remainingWidth + offsetX*circleTotalWidth + i%numPerRow * circleTotalWidth;
				d.y = yOffset + Math.floor(i/numPerRow) * circleTotalWidth;
				return "translate(" + d.x + "," + d.y + ")"; 
			})
			.each(function(d) {
				d.size = s;
				d.scaleIncrease = scaleIncrease;
			});
			
		//Append the circle itself
		characterCircle.append("circle")
			.style("fill", function(d) { return "url(#character-legend-" + d.character.replace(" ","_") + ")"; })
			.attr("r", s)
			.style("stroke", function(d,i) { 
				var colorPos = characters.map(function(m) { return m.character; }).indexOf(d.character);
				d.color =  colorPos > -1 ? characters[colorPos].color : "#c1c1c1";
				return d.color ; 
			})
			.style("stroke-width", strokeScale(s) )
			.on("click", function() { d3.event.stopPropagation(); })
			.on("mouseover", function(d) {

				hoveredCircle = d3.select(this);

				//Move the circle to the front
				d3.select(this.parentNode).raise();
				//Increase the scale of the image
				hoveredCircle
					.style("filter", "url(#glow)")
					.transition("grow").duration(600)
					.attr("transform", "scale(" + d.scaleIncrease + ")");

				///////////////////////// Adjust the tooltip ////////////////////////		

				//Change the texts inside the tooltip
				if(d.character === "Vegito") d.color = "#39100A";
				d3.select(".tooltip-name").style("color", d.color).html(d.character);
				d3.select(".tooltip-fights").html("fights " + d.fights + "  times");
				d3.select(".tooltip-character-info").html(d.text);

				//Find the location of tooltip
				var xpos = xOffset + d.x + margin.left + 15; //2*15/2 for padding
				var ypos = yExtraOffset + d.y + margin.top - d.size*d.scaleIncrease - 15;

				//Show and move the tooltip
				d3.select("#tooltip-legend")
					.transition("tooltip").duration(500)
					.style("opacity", 1)
					.style("top", ypos + "px")
					.style("left", xpos + "px");
			})
			.on("mouseout", mouseOutLegend);

		return finalRow;

	}//function drawCircles

	function mouseOutLegend(d) {
		//Decrease the scale of the image
		hoveredCircle
			.style("filter", null)
			.transition("grow").duration(400)
			.attr("transform", "scale(1)");

		//Hide tooltip
		d3.select("#tooltip-legend").transition("tooltip").duration(300)
			.style("opacity", 0);
	}//mouseOutLegend

}//createCharacterLegend

