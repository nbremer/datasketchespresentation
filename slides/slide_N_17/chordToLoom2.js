pt.chordToLoom2 = pt.chordToLoom2 || {};

pt.chordToLoom2.init = function (data) {

	//Remove any existing svgs
	d3.select('#chord-to-loom-2 #chordToLoom2 svg').remove();

	///////////////////////////////////////////////////////////////////////////
	//////////////////// Set up and initiate svg containers ///////////////////
	///////////////////////////////////////////////////////////////////////////	

	var margin = {
		top: 10,
		right: 0,
		bottom: 10,
		left: 0
	};
	var width = $(".slides").width() * 0.95 - margin.left - margin.right;
	var height = $(".slides").height() - margin.top - margin.bottom;

	//SVG container
	pt.chordToLoom2.svg = d3.select('#chord-to-loom-2 #chordToLoom2')
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);

	var svg = pt.chordToLoom2.svg.append("g")
		.attr("transform", "translate(" + (margin.left + width / 2) + "," + (margin.top + height / 2) + ")");

	////////////////////////////////////////////////////////////
	//////////////////// Character notes ///////////////////////
	////////////////////////////////////////////////////////////
		
	pt.chordToLoom2.characterNotes = [];
	pt.chordToLoom2.characterNotes["Gandalf"] = "Speaking almost twice as many words as the second most abundant speaker, Gandalf is taking up a large portion of dialogue in almost every location he's in, but stays rather quiet in Mordor";
	pt.chordToLoom2.characterNotes["Sam"] = "An unexpected runner up to having spoken the most words, Sam flourishes after the battle at Amon Hen, taking up a considerable portion of the words said in both Mordor and Gondor";
	pt.chordToLoom2.characterNotes["Aragorn"] = "Although eventually being crowned in Minas Tirith, Gondor, Aragorn is by far most talkative in that other human region, Rohan, fighting a battle at Helm's Deep and convincing an army of dead";
	pt.chordToLoom2.characterNotes["Frodo"] = "Frodo seems most comfortable speaking in the Shire, (mostly) when still an innocent youth, but he feels the burden of the ring increasingly towards the end and leaves the talking to his best friend Sam";
	pt.chordToLoom2.characterNotes["Gimli"] = "Gimli is a quiet character at practically all locations until he reaches Rohan, where he speaks almost half of all his lines";
	pt.chordToLoom2.characterNotes["Pippin"] = "Like Merry, Pippin is also seen saying something at all locations, but his presence is mostly felt when he sings his song in Minas Tirith, serving the steward of Gondor, Denethor";
	pt.chordToLoom2.characterNotes["Merry"] = "Merry manages to say an average sentence worth of words at all locations, but is most active during his time with Treebeard in Fangorn forest and bonding with Eowyn in Rohan";
	pt.chordToLoom2.characterNotes["Boromir"] = "Boromir speaks his finest lines during the march up Caradhras in the Misty Mountains and right before the Uruk-hai battle at Amon Hen, Parth Galen, taking up a large portion of the total number of words spoken at those locations";
	pt.chordToLoom2.characterNotes["Legolas"] = "Although a very memorable presence throughout the movies, Legolas speaks even less in 3 movies than Boromir, who is alive in only the first movie";

	///////////////////////////////////////////////////////////////////////////
	//////////////////////////// General variables ////////////////////////////
	///////////////////////////////////////////////////////////////////////////	

	var outerRadius = 300; //Math.min(width, height) * 0.5 - 40;
	pt.chordToLoom2.innerRadius = outerRadius * 0.96;

	pt.chordToLoom2.pullOutSize = 20 + 30 / 135 * pt.chordToLoom2.innerRadius;
	pt.chordToLoom2.numFormat = d3.format(",.0f");
	pt.chordToLoom2.defaultOpacity = 0.85;
	pt.chordToLoom2.fadeOpacity = 0.05;

	pt.chordToLoom2.arc = d3.arc()
		.innerRadius(pt.chordToLoom2.innerRadius * 1.01)
		.outerRadius(outerRadius);

	//Old colors
	pt.chordToLoom2.colorOld = d3.scaleOrdinal()
		.domain(d3.range(4))
		.range(["#000000", "#FFDD89", "#957244", "#F26223"]);

	//Color for the unique locations
	var locations = ["Bree", "Emyn Muil", "Fangorn Forest", "Gondor", "Isengard", "Lothlorien", "Misty Mountains", "Mordor", "Moria", "Parth Galen", "Rivendell", "Rohan", "The Shire"];
	var colors = ["#5a3511", "#47635f", "#223e15", "#C6CAC9", "#0d1e25", "#53821a", "#4387AA", "#770000", "#373F41", "#602317", "#8D9413", "#c17924", "#3C7E16"];
	pt.chordToLoom2.color = d3.scaleOrdinal()
		.domain(locations)
		.range(colors);

	//Find the total number of words per character
	pt.chordToLoom2.dataChar = d3.nest()
		.key(function (d) { return d.character; })
		.rollup(function (leaves) { return d3.sum(leaves, function (d) { return d.words; }); })
		.entries(data)
		.sort(function (a, b) { return d3.descending(a.value, b.value); });
	//Unflatten the result
	var characterOrder = pt.chordToLoom2.dataChar.map(function (d) { return d.key; });
	//Sort the characters on a specific order
	pt.chordToLoom2.sortCharacter = function (a, b) {
		return characterOrder.indexOf(a) - characterOrder.indexOf(b);
	}//sortCharacter

	pt.chordToLoom2.heightInner = pt.chordToLoom2.innerRadius * 0.75 / characterOrder.length;

	///////////////////////////////////////////////////////////////////////////
	///////////////////////// Different ribbon functions //////////////////////
	///////////////////////////////////////////////////////////////////////////	

	//Loom function that pulls all strings to the center
	pt.chordToLoom2.loom1 = pt.chordToLoom2.loom()
		.padAngle(0.05)
		.sortSubgroups(pt.chordToLoom2.sortAlpha)
		.heightInner(0)
		.emptyPerc(0)
		.widthOffsetInner(0)
		.value(function (d) { return d.words; })
		.outer(function (d) { return d.location; });

	//Very basic string function
	pt.chordToLoom2.string1 = pt.chordToLoom2.string()
		.radius(pt.chordToLoom2.innerRadius)
		.pullout(0);

	//Loom function with the inner locations spread out vertically
	pt.chordToLoom2.loom2 = pt.chordToLoom2.loom()
		.padAngle(0.05)
		.sortSubgroups(pt.chordToLoom2.sortCharacter)
		.heightInner(pt.chordToLoom2.heightInner)
		.emptyPerc(0)
		.widthOffsetInner(50)
		.value(function (d) { return d.words; })
		.inner(function (d) { return d.character; })
		.outer(function (d) { return d.location; });

	//String function with the basic shape, but with pull out
	pt.chordToLoom2.string2 = pt.chordToLoom2.string()
		.radius(pt.chordToLoom2.innerRadius)
		.pullout(pt.chordToLoom2.pullOutSize);

	//Loom function that also has the pull out
	pt.chordToLoom2.loom3 = pt.chordToLoom2.loomFinal()
		.padAngle(0.05)
		.sortSubgroups(pt.chordToLoom2.sortCharacter)
		.heightInner(pt.chordToLoom2.heightInner)
		.emptyPerc(0.2)
		.widthOffsetInner(50)
		.value(function (d) { return d.words; })
		.inner(function (d) { return d.character; })
		.outer(function (d) { return d.location; });

	//Final string function that also includes the pull out
	pt.chordToLoom2.string3 = pt.chordToLoom2.stringFinal()
		.radius(pt.chordToLoom2.innerRadius)
		.pullout(pt.chordToLoom2.pullOutSize);

	///////////////////////////////////////////////////////////////////////////
	//////////////////////////// Create the filter ////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	//Container for the gradients
	var defs = svg.append("defs");

	//Filter for the outside glow
	var filter = defs.append("filter").attr("id", "glow");

	filter.append("feGaussianBlur")
		.attr("class", "blur")
		.attr("stdDeviation", "2")
		.attr("result", "coloredBlur");

	var feMerge = filter.append("feMerge");
	feMerge.append("feMergeNode")
		.attr("in", "coloredBlur");
	feMerge.append("feMergeNode")
		.attr("in", "SourceGraphic");

	////////////////////////////////////////////////////////////
	//////////////// Draw the ring inscription /////////////////
	////////////////////////////////////////////////////////////

	pt.chordToLoom2.ringWrapper = svg.append("g").attr("class", "ring-wrapper").style("opacity", 0);
	var ringR = pt.chordToLoom2.innerRadius * 0.65;

	pt.chordToLoom2.ringWrapper.append("path")
		.attr("id", "ring-path-top")
		.attr("class", "ring-path")
		.style("fill", "none")
		.attr("d", "M" + -ringR + "," + 0 + " A" + ringR + "," + ringR + " 0 0,1 " + ringR + "," + 0);

	pt.chordToLoom2.ringWrapper.append("text")
		.attr("class", "ring-text")
		.append("textPath")
		.attr("startOffset", "50%")
		.attr("xlink:href", "#ring-path-top")
		.style("filter", "url(#glow)")
		.text("AE5,Ex26Yw1EjYzH= AE5,Exx:w%P1Dj^");

	pt.chordToLoom2.ringWrapper.append("path")
		.attr("id", "ring-path-bottom")
		.attr("class", "ring-path")
		.style("fill", "none")
		.attr("d", "M" + -ringR + "," + 0 + " A" + ringR + "," + ringR + " 0 0,0 " + ringR + "," + 0);

	pt.chordToLoom2.ringWrapper.append("text")
		.attr("class", "ring-text")
		.append("textPath")
		.attr("startOffset", "50%")
		.attr("xlink:href", "#ring-path-bottom")
		.style("filter", "url(#glow)")
		.text("AE5,Ex37zD1EjYzH= X#w6Ykt^AT`Bz7qTp1EjY");

	////////////////////////////////////////////////////////////
	///////////////////// Set-up title /////////////////////////
	////////////////////////////////////////////////////////////

	pt.chordToLoom2.titles = svg.append("g").attr("class", "texts").style("opacity", 0);
		
	pt.chordToLoom2.titles.append("text")
		.attr("class", "name-title")
		.attr("x", 0)
		.attr("y", -pt.chordToLoom2.innerRadius*5/6);
		
	pt.chordToLoom2.titles.append("text")
		.attr("class", "value-title")
		.attr("x", 0)
		.attr("y", -pt.chordToLoom2.innerRadius*5/6 + 35);
	
	//The character pieces	
	pt.chordToLoom2.titles.append("text")
		.attr("class", "character-note")
		.attr("x", 0)
		.attr("y", pt.chordToLoom2.innerRadius/2)
		.attr("dy", "0.35em");
					

	///////////////////////////////////////////////////////////////////////////
	///////////////////// Wrappers for the chords and arcs ////////////////////
	///////////////////////////////////////////////////////////////////////////	

	var arcWrapper = svg.append("g").attr("class", "arcWrapper");

	var ribbonWrapper = svg.append("g").attr("class", "ribbonWrapper");

	////////////////////////////////////////////////////////////
	//////////////////// Draw outer labels /////////////////////
	////////////////////////////////////////////////////////////

	//The text needs to be rotated with the offset in the clockwise direction
	pt.chordToLoom2.outerLabels = arcWrapper.selectAll(".outer-labels")
		.data(pt.chordToLoom2.loom3(data).groups)
		.enter().append("g")
		.attr("class", "outer-labels")
		.each(function (d) {
			d.angle = ((d.startAngle + d.endAngle) / 2);
			d.pullOutSize = (pt.chordToLoom2.pullOutSize * (d.startAngle > Math.PI + 1e-2 ? -1 : 1));
		})
		.attr("text-anchor", function (d) { return d.angle > Math.PI ? "end" : null; })
		.attr("transform", function (d, i) {
			var c = pt.chordToLoom2.arc.centroid(d);
			return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
				+ "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
				+ "translate(" + 26 + ",0)"
				+ (d.angle > Math.PI ? "rotate(180)" : "")
		})
		.style("opacity", 0);

	var elvishName = ["175{#", "7R`B4#6Y", "x{#75$iY1", "t%j4#7iT", "93GlExj6T",
		"KiAZADDÚMU", "j3Hj~N7`B5$", "q7E3 xj#5$", "t$I5 thUj",
		"79N5#", "ex{#7Y5", "x2{^6Y", "t7Y46Y"];
	//The outer name in Elvish 
	pt.chordToLoom2.outerLabels.append("text")
		.attr("class", function (d, i) { return d.outername === "Moria" ? "dwarfish-outer-label" : "elvish-outer-label"; })
		.attr("dy", ".15em")
		.text(function (d, i) { return elvishName[i]; });

	//The outer name
	pt.chordToLoom2.outerLabels.append("text")
		.attr("class", "outer-label")
		.attr("dy", ".35em")
		.text(function (d, i) { return d.outername; });

	//The value below it
	pt.chordToLoom2.outerLabels.append("text")
		.attr("class", "outer-label-value")
		.attr("dy", "1.5em")
		.text(function (d, i) { return 	pt.chordToLoom2.numFormat(d.value) + " words"; });

	///////////////////////////////////////////////////////////////////////////
	//////////////////////// Draw the arcs and strings ////////////////////////
	///////////////////////////////////////////////////////////////////////////	

	//Add the arcs for the lotr data
	pt.chordToLoom2.arcs = arcWrapper.selectAll(".arc")
		.data(pt.chordToLoom2.loom1(data).groups)
		.enter().append("path")
		.attr("class", "arc")
		.style("fill", function (d) { return pt.chordToLoom2.colorOld(d.index); })
		.style("stroke", function (d) { return d3.rgb(pt.chordToLoom2.colorOld(d.index)).darker(); })
		.attr("d", pt.chordToLoom2.arc);

	//Add the strings for the lotr data
	pt.chordToLoom2.ribbons = ribbonWrapper.selectAll(".ribbon")
		.data(pt.chordToLoom2.loom1(data))
		.enter().append("path")
		.attr("class", "ribbon")
		.style("mix-blend-mode", "multiply")
		.style("fill", function (d) { return pt.chordToLoom2.colorOld(d.outer.index); })
		.style("stroke", function (d) { return d3.rgb(pt.chordToLoom2.colorOld(d.outer.index)).darker(); })
		.style("opacity", 0.7)
		.attr("d", pt.chordToLoom2.string1);

	////////////////////////////////////////////////////////////
	//////////////////// Draw inner labels /////////////////////
	////////////////////////////////////////////////////////////

	//The text also needs to be displaced in the horizontal directions
	//And also rotated with the offset in the clockwise direction
	pt.chordToLoom2.innerLabels = svg.append("g")
		.attr("class", "inner-labels")
		.selectAll("text")
		.data(pt.chordToLoom2.loom2(data).innergroups)
		.enter().append("text")
		.attr("class", "inner-label")
		.attr("x", function (d, i) { return d.x; })
		.attr("y", 0)
		.style("text-anchor", "middle")
		.attr("dy", ".35em")
		.style("opacity", 0)
		.text(function (d, i) { return d.name; })

	//Adjust the top title
	d3.select("#chord-to-loom-2 .chord-steps").text("Insert the LotR data...");

	pt.chordToLoom2.direction = "forward";
	pt.chordToLoom2.previousStep = "init";
}//init






pt.chordToLoom2.adjustedData = function () {

	//Adjust the top title
	d3.select("#chord-to-loom-2 .chord-steps").text("Insert the LotR data...");

	//Back to defaults colors
	pt.chordToLoom2.arcs
		.transition("color").duration(500)
		.style("fill", function (d) { return pt.chordToLoom2.colorOld(d.index); })
		.style("stroke", function (d) { return d3.rgb(pt.chordToLoom2.colorOld(d.index)).darker(); })
		.style("stroke-opacity", 1);
	pt.chordToLoom2.ribbons
		.transition("color").duration(500)
		.style("opacity", 0.7)
		.style("fill", function (d) { return pt.chordToLoom2.colorOld(d.outer.index); })
		.style("stroke", function (d) { return d3.rgb(pt.chordToLoom2.colorOld(d.outer.index)).darker(); })
		.style("stroke-opacity", 1);

}//function adjustedData




//Adjust the colors to the lotr final version
pt.chordToLoom2.adjustedColors = function (data) {

	//Adjust the top title
	pt.chordToLoom.changeTitle("chord-to-loom-2", "...and apply more LotR-y colors");

	//In case you move back
	pt.chordToLoom2.innerLabels
		.transition("fade").duration(1000)
		.attr("y", 0)
		.style("opacity", 0);

	//Adjust the color to the final one
	pt.chordToLoom2.arcs
		.transition("color").duration(1000)
		.style("fill", function (d) { return pt.chordToLoom2.color(d.outername); })
		.style("stroke-opacity", 0);

	//Adjust the colors to the final one
	pt.chordToLoom2.ribbons
		.data(pt.chordToLoom2.loom1(data))
		.transition("color").duration(1000)
		.attr("d", pt.chordToLoom2.string1)
		.style("opacity", pt.chordToLoom2.defaultOpacity)
		.style("fill", function (d) { return d3.rgb(pt.chordToLoom2.color(d.outer.outername)).brighter(0.2); })
		.style("stroke-opacity", 0);

	pt.chordToLoom2.previousStep = "adjustedColors";

}//adjustedColors




//Move the inner locations apart for each fellowship member
pt.chordToLoom2.innerLocation = function (data) {

	//In case you move backward
	pt.chordToLoom2.arcs
		.data(pt.chordToLoom2.loom2(data).groups)
		.style("stroke", null)
		.transition("arc").duration(1000)
		.attr("transform", "translate(0,0)")
		.attr("d", pt.chordToLoom2.arc);

	//Adjust the top title
	pt.chordToLoom.changeTitle("chord-to-loom-2", "Divide inner chords amongst the characters");

	//Adjust the strings so that the middle moves apart
	pt.chordToLoom2.ribbons
		.data(pt.chordToLoom2.loom2(data))
		.transition("string").duration(1000)
		.attr("d", pt.chordToLoom2.string1);

	//Show the inner label names
	pt.chordToLoom2.innerLabels
		.transition("move").duration(1000)
		.attr("y", function (d, i) { return d.y; })
		.style("opacity", 1);

	pt.chordToLoom2.previousStep = "innerLocation";

}//innerLocation




//Move the two halves apart
pt.chordToLoom2.moveApart = function (data) {

	//In case you move backward
	pt.chordToLoom2.outerLabels
		.transition("fade").duration(500)
		.style("opacity", 0);
	pt.chordToLoom2.ringWrapper
		.transition("fade").duration(500)
		.style("opacity", 0);
	pt.chordToLoom2.innerLabels
		.on("mouseover", null)
		.on("mouseout", null);
	d3.selectAll("#chordToLoom2 .arc, #chordToLoom2 .outer-labels")
		.on("mouseover", null)
		.on("mouseout", null);

	//Adjust the top title
	pt.chordToLoom.changeTitle("chord-to-loom-2", "Move the two halves farther apart");

	//Adjust the strings to move outward
	pt.chordToLoom2.ribbons
		.data(pt.chordToLoom2.loom3(data))
		.transition("string").duration(1000)
		.attr("d", pt.chordToLoom2.string2);

	//Adjust the arcs to move outward
	pt.chordToLoom2.arcs
		.data(pt.chordToLoom2.loom3(data).groups)
		.each(function (d) { d.pullOutSize = (pt.chordToLoom2.pullOutSize * (d.startAngle > Math.PI + 1e-2 ? -1 : 1)) })
		.style("fill", function (d) { return pt.chordToLoom2.color(d.outername); })
		.style("stroke", null)
		.transition("arc").duration(1000)
		.attr("transform", function (d, i) { return "translate(" + d.pullOutSize + ',' + 0 + ")"; })
		.attr("d", pt.chordToLoom2.arc);

	pt.chordToLoom2.previousStep = "moveApart";

}//moveApart





//Adjust the string shape to the final one
pt.chordToLoom2.stringShape = function(data) {

	//Adjust the top title
	d3.select("#chord-to-loom-2 .chord-steps")
		.transition("hide").duration(500)
		.style("opacity", 0)
		.on("end", function () {
			d3.select(this)
				.text("Create more natural chord shapes")
				.transition("show").duration(500)
				.style("opacity", 1)
				.transition("show").duration(1500).delay(1500)
				.style("opacity", 0);
		});

	//In case you come from the next slide backwards
	pt.chordToLoom2.innerLabels
		.attr("y", function (d, i) { return d.y; })
		.style("opacity", 1)
		.on("mouseover", function(d) { pt.chordToLoom2.mouseOverInner(d, data); })
		.on("mouseout", pt.chordToLoom2.mouseOutInner);

	d3.selectAll("#chordToLoom2 .arc, #chordToLoom2 .outer-labels")
		.on("mouseover", function(d) { pt.chordToLoom2.mouseOverOuter(d, data); })
		.on("mouseout", pt.chordToLoom2.mouseOutOuter);

	pt.chordToLoom2.arcs
		.data(pt.chordToLoom2.loom3(data).groups)
		.each(function (d) { d.pullOutSize = (pt.chordToLoom2.pullOutSize * (d.startAngle > Math.PI + 1e-2 ? -1 : 1)) })
		.style("fill", function (d) { return pt.chordToLoom2.color(d.outername); })
		.style("stroke", null)
		.transition("arc").duration(1000)
		.attr("transform", function (d, i) { return "translate(" + d.pullOutSize + ',' + 0 + ")"; })
		.attr("d", pt.chordToLoom2.arc);

	//Adjust the strings to their new shape
	pt.chordToLoom2.ribbons
		.data(pt.chordToLoom2.loom3(data))
		.style("fill", function (d) { return d3.rgb(pt.chordToLoom2.color(d.outer.outername)).brighter(0.2); })
		.style("stroke", null)
		.style("opacity", pt.chordToLoom2.defaultOpacity)
		.transition("string").duration(1000).delay(function (d, i) { return i * 10; })
		.attr("d", pt.chordToLoom2.string3);

	//Show the outer labels
	pt.chordToLoom2.outerLabels
		.transition("fade").duration(1000).delay(1000)
		.style("opacity", 1);

	//Show the ring inscription
	pt.chordToLoom2.ringWrapper
		.transition("fade").duration(2000).delay(1500)
		.style("opacity", 1);

	pt.chordToLoom2.direction = "backward";
	d3.select("#chord-to-loom-2").attr("data-autoslide", 0);
	pt.chordToLoom2.previousStep === "stringShape";

}//stringShape


////////////////////////////////////////////////////////////
/////////////// Mouse hovers for inner side ////////////////
////////////////////////////////////////////////////////////

pt.chordToLoom2.mouseOverInner = function(d, data) {

	//Show all the strings of the highlighted character and hide all else
	pt.chordToLoom2.ribbons
		.transition()
		.style("opacity", function (s) {
			return s.outer.innername !== d.name ? pt.chordToLoom2.fadeOpacity : 1;
		});

	//Update the word count of the outer labels
	var characterData = pt.chordToLoom2.loom3(data).filter(function (s) { return s.outer.innername === d.name; });
	pt.chordToLoom2.outerLabels.selectAll(".outer-label-value")
		.text(function (s, i) {
			//Find which characterData is the correct one based on location
			var loc = characterData.filter(function (c) { return c.outer.outername === s.outername; });
			if (loc.length === 0) {
				var value = 0;
			} else {
				var value = loc[0].outer.value;
			}
			return pt.chordToLoom2.numFormat(value) + (value === 1 ? " word" : " words");

		});

	//Hide the arc & outer labels where the character hasn't said a thing
	d3.selectAll("#chordToLoom2 .arc, #chordToLoom2 .outer-labels")
		.transition()
		.style("opacity", function (s) {
			//Find which characterData is the correct one based on location
			var loc = characterData.filter(function (c) { return c.outer.outername === s.outername; });
			return loc.length === 0 ? 0.1 : 1;
		});

	//Update the title to show the total word count of the character
	pt.chordToLoom2.titles
		.transition()
		.style("opacity", 1);
	pt.chordToLoom2.titles.select(".name-title")
		.text(d.name);
	pt.chordToLoom2.titles.select(".value-title")
		.text(function () {
			var words = pt.chordToLoom2.dataChar.filter(function (s) { return s.key === d.name; });
			return pt.chordToLoom2.numFormat(words[0].value) + " words";
		});

	//Show the character note
	pt.chordToLoom2.titles.selectAll(".character-note")
		.text(pt.chordToLoom2.characterNotes[d.name])
		.call(wrap, 2.25 * pt.chordToLoom2.pullOutSize);

	//Hide ring text
	pt.chordToLoom2.ringWrapper
		.transition()
		.style("opacity", pt.chordToLoom2.fadeOpacity);

}//function mouseOverInner
			

pt.chordToLoom2.mouseOutInner = function(d) {

	//Put the string opacity back to normal
	pt.chordToLoom2.ribbons
		.transition()
		.style("opacity", pt.chordToLoom2.defaultOpacity);

	//Return the word count to what it was
	pt.chordToLoom2.outerLabels.selectAll(".outer-label-value")
		.text(function (s, i) { return pt.chordToLoom2.numFormat(s.value) + " words"; });

	//Show all arcs & outer labels again
	d3.selectAll("#chordToLoom2 .arc, #chordToLoom2 .outer-labels")
		.transition()
		.style("opacity", 1);

	//Hide the title
	pt.chordToLoom2.titles
		.transition()
		.style("opacity", 0);

	//Show ring text
	pt.chordToLoom2.ringWrapper
		.transition()
		.style("opacity", 1);

}//function mouseOutInner

////////////////////////////////////////////////////////////
/////////////// Mouse hovers for outer side ////////////////
////////////////////////////////////////////////////////////

pt.chordToLoom2.mouseOverOuter = function (d, data) {

	//Hide all other arcs	& texts
	d3.selectAll("#chordToLoom2 .arc, #chordToLoom2 .outer-labels")
		.transition()
		.style("opacity", function (s) { 
			return s.outername === d.outername ? 1 : pt.chordToLoom2.fadeOpacity; 
		});

	//Hide all other strings
	pt.chordToLoom2.ribbons
		.transition()
		.style("opacity", function (s) { 
			return s.outer.outername === d.outername ? 1 : pt.chordToLoom2.fadeOpacity; 
		});

	//Hide ring text
	pt.chordToLoom2.ringWrapper
		.transition()
		.style("opacity", pt.chordToLoom2.fadeOpacity);

	//Find the data for the strings of the hovered over location
	var locationData = pt.chordToLoom2.loom3(data).filter(function (s) { return s.outer.outername === d.outername; });
	//Hide the characters who haven't said a word
	pt.chordToLoom2.innerLabels
		.transition()
		.style("opacity", function (s) {
			//Find out how many words the character said at the hovered over location
			var char = locationData.filter(function (c) { return c.outer.innername === s.name; });
			return char.length === 0 ? 0.1 : 1;
		});

}//function mouseOverOuter

pt.chordToLoom2.mouseOutOuter = function (d) {

	//Show all arc labels
	d3.selectAll("#chordToLoom2 .arc, #chordToLoom2 .outer-labels")
		.transition()
		.style("opacity", 1);

	//Show all strings again
	pt.chordToLoom2.ribbons
		.transition()
		.style("opacity", pt.chordToLoom2.defaultOpacity);

	//Show all characters again
	pt.chordToLoom2.innerLabels
		.transition()
		.style("opacity", 1);

	//Show ring text
	pt.chordToLoom2.ringWrapper
		.transition()
		.style("opacity", 1);

}//function mouseOutOuter
				 
////////////////////////////////////////////////////////////
///////////////////// Extra functions //////////////////////
////////////////////////////////////////////////////////////

//Sort alphabetically
pt.chordToLoom2.sortAlpha = function (a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}//sortAlpha


//Slight adjustment so that Rohan is put on the left half, even though it starts slighty on the right half
pt.chordToLoom2.loom = function () {

	var pi$3 = Math.PI;
	var tau$3 = pi$3 * 2;
	var max$1 = Math.max;

	var padAngle = 0,
		sortGroups = null,
		sortSubgroups = null,
		sortStrings = null,
		heightInner = 20,
		widthOffsetInner = function () { return x; },
		emptyPerc = 0.2,
		value = function (d) { return d; },
		inner = function (d) { return d.source; },
		outer = function (d) { return d.target; };

	function loom(data) {

		//Nest the data on the outer variable
		data = d3.nest().key(outer).entries(data);

		var n = data.length,
			groupSums = [],
			groupIndex = d3.range(n),
			subgroupIndex = [],
			looms = [],
			groups = looms.groups = new Array(n),
			subgroups,
			numSubGroups,
			uniqueInner = looms.innergroups = [],
			uniqueCheck = [],
			emptyk,
			k,
			x,
			x0,
			dx,
			i,
			j,
			l,
			m,
			s,
			v,
			sum,
			counter,
			reverseOrder = false,
			approxCenter;

		//Loop over the outer groups and sum the values
		k = 0;
		numSubGroups = 0;
		for (i = 0; i < n; i++) {
			v = data[i].values.length;
			sum = 0;
			for (j = 0; j < v; j++) {
				sum += value(data[i].values[j]);
			}//for j
			groupSums.push(sum);
			subgroupIndex.push(d3.range(v));
			numSubGroups += v;
			k += sum;
		}//for i

		// Sort groups…
		if (sortGroups) groupIndex.sort(function (a, b) {
			return sortGroups(groupSums[a], groupSums[b]);
		});

		// Sort subgroups…
		if (sortSubgroups) subgroupIndex.forEach(function (d, i) {
			d.sort(function (a, b) {
				return sortSubgroups(inner(data[i].values[a]), inner(data[i].values[b]));
			});
		});

		//After which group are we past the center
		//TODO: make something for if there is no nice split in two...
		l = 0;
		for (i = 0; i < n; i++) {
			l += groupSums[groupIndex[i]];
			if (l > k / 2) {
				approxCenter = groupIndex[i];
				break;
			}//if
		}//for i

		//How much should be added to k to make the empty part emptyPerc big of the total
		emptyk = k * emptyPerc / (1 - emptyPerc);
		k += emptyk;

		// Convert the sum to scaling factor for [0, 2pi].
		k = max$1(0, tau$3 - padAngle * n) / k;
		dx = k ? padAngle : tau$3 / n;

		// Compute the start and end angle for each group and subgroup.
		// Note: Opera has a bug reordering object literal properties!
		subgroups = new Array(numSubGroups);
		x = emptyk * 0.25 * k; //quarter of the empty part //0;
		counter = 0;
		for (i = 0; i < n; i++) {
			var di = groupIndex[i],
				outername = data[di].key;

			if (approxCenter === di) {
				x = x + emptyk * 0.5 * k;
			}//if
			x0 = x;
			//If you've crossed the bottom, reverse the order of the inner strings
			if (x > pi$3 * 0.9) reverseOrder = true;
			s = subgroupIndex[di].length;
			for (j = 0; j < s; j++) {
				var dj = reverseOrder ? subgroupIndex[di][(s - 1) - j] : subgroupIndex[di][j],
					v = value(data[di].values[dj]),
					innername = inner(data[di].values[dj]);
				a0 = x,
					a1 = x += v * k;
				subgroups[counter] = {
					index: di,
					subindex: dj,
					startAngle: a0,
					endAngle: a1,
					value: v,
					outername: outername,
					innername: innername
				};

				//Check and save the unique inner names
				if (!uniqueCheck[innername]) {
					uniqueCheck[innername] = true;
					uniqueInner.push({ name: innername });
				}//if

				counter += 1;
			}//for j

			groups[di] = {
				index: di,
				startAngle: x0,
				endAngle: x,
				value: groupSums[di],
				outername: outername
			};
			x += dx;
		}//for i

		//Sort the inner groups in the same way as the strings
		uniqueInner.sort(function (a, b) {
			return sortSubgroups(a.name, b.name);
		});
		//Find x and y locations of the inner categories
		//TODO: make x depend on length of inner name 
		m = uniqueInner.length
		for (i = 0; i < m; i++) {
			uniqueInner[i].x = 0;
			uniqueInner[i].y = -m * heightInner / 2 + i * heightInner;
			uniqueInner[i].offset = widthOffsetInner(uniqueInner[i].name, i, uniqueInner);
		}//for i

		//Generate bands for each (non-empty) subgroup-subgroup link
		counter = 0;
		for (i = 0; i < n; i++) {
			var di = groupIndex[i];
			s = subgroupIndex[di].length;
			for (j = 0; j < s; j++) {
				var outerGroup = subgroups[counter];
				var innerTerm = outerGroup.innername;
				//Find the correct inner object based on the name
				var innerGroup = searchTerm(innerTerm, "name", uniqueInner);
				if (outerGroup.value) {
					looms.push({ inner: innerGroup, outer: outerGroup });
				}//if
				counter += 1;
			}//for j
		}//for i

		return sortStrings ? looms.sort(sortStrings) : looms;
	};//function loom(matrix)

	function searchTerm(term, property, arrayToSearch) {
		for (var i = 0; i < arrayToSearch.length; i++) {
			if (arrayToSearch[i][property] === term) {
				return arrayToSearch[i];
			}//if
		}//for i
	}//searchTerm

	function constant$11(x) {
		return function () { return x; };
	}//constant$11

	loom.padAngle = function (_) {
		return arguments.length ? (padAngle = max$1(0, _), loom) : padAngle;
	};

	loom.inner = function (_) {
		return arguments.length ? (inner = _, loom) : inner;
	};

	loom.outer = function (_) {
		return arguments.length ? (outer = _, loom) : outer;
	};

	loom.value = function (_) {
		return arguments.length ? (value = _, loom) : value;
	};

	loom.heightInner = function (_) {
		return arguments.length ? (heightInner = _, loom) : heightInner;
	};

	loom.widthOffsetInner = function (_) {
		return arguments.length ? (widthOffsetInner = typeof _ === "function" ? _ : constant$11(+_), loom) : widthOffsetInner;
	};

	loom.emptyPerc = function (_) {
		return arguments.length ? (emptyPerc = _ < 1 ? max$1(0, _) : max$1(0, _ * 0.01), loom) : emptyPerc;
	};

	loom.sortGroups = function (_) {
		return arguments.length ? (sortGroups = _, loom) : sortGroups;
	};

	loom.sortSubgroups = function (_) {
		return arguments.length ? (sortSubgroups = _, loom) : sortSubgroups;
	};

	loom.sortBands = function (_) {
		return arguments.length ? (_ == null ? sortBands = null : (sortBands = compareValue(_))._ = _, loom) : sortBands && sortBands._;
	};

	return loom;

}//loom

//Adjusted string function to mimic the old - simple string shapes
pt.chordToLoom2.string = function () {

	var slice$5 = Array.prototype.slice;

	var cos = Math.cos;
	var sin = Math.sin;
	var pi$3 = Math.PI;
	var halfPi$2 = pi$3 / 2;
	var tau$3 = pi$3 * 2;
	var max$1 = Math.max;

	var inner = function (d) { return d.inner; },
		outer = function (d) { return d.outer; },
		radius = function (d) { return d.radius; },
		startAngle = function (d) { return d.startAngle; },
		endAngle = function (d) { return d.endAngle; },
		x = function (d) { return d.x; },
		y = function (d) { return d.y; },
		offset = function (d) { return d.offset; },
		pullout = 50,
		heightInner = 0,
		context = null;

	function string() {
		var buffer,
			argv = slice$5.call(arguments),
			out = outer.apply(this, argv),
			inn = inner.apply(this, argv),
			sr = +radius.apply(this, (argv[0] = out, argv)),
			sa0 = startAngle.apply(this, argv) - halfPi$2,
			sa1 = endAngle.apply(this, argv) - halfPi$2,
			sx0 = sr * cos(sa0),
			sy0 = sr * sin(sa0),
			sx1 = sr * cos(sa1),
			sy1 = sr * sin(sa1),
			tr = +radius.apply(this, (argv[0] = inn, argv)),
			tx = x.apply(this, argv),
			ty = round2(y.apply(this, argv)),
			toffset = offset.apply(this, argv),
			theight,
			leftHalf,
			pullOutContext;

		//Does the group lie on the left side
		leftHalf = sa1 + halfPi$2 > pi$3 && sa1 + halfPi$2 < tau$3;
		//If the group lies on the other side, switch the inner point offset
		if (leftHalf) toffset = -toffset;
		tx = tx + toffset;

		if (!context) context = buffer = d3.path();

		//Change the pullout based on where the string is
		pulloutContext = (leftHalf ? -1 : 1) * pullout;
		sx0 = sx0 + pulloutContext;
		sx1 = sx1 + pulloutContext;
		//Halfway in between the pull out and the arc
		xCenter0 = d3.interpolateNumber(pulloutContext, sx0)(0.5);
		xCenter1 = d3.interpolateNumber(pulloutContext, sx1)(0.5);

		//Start at smallest angle of outer arc
		context.moveTo(sx0, sy0);
		//Circular part along the outer arc
		context.arc(pulloutContext, 0, sr, sa0, sa1);
		//From end outer arc to center (taking into account the pullout)
		context.bezierCurveTo(xCenter1, sy1, xCenter1, ty, tx, ty);
		//Draw a straight line up/down (depending on the side of the circle)
		context.lineTo(tx, ty);
		//From center (taking into account the pullout) to start of outer arc
		context.bezierCurveTo(xCenter0, ty, xCenter0, sy0, sx0, sy0);
		//Close path
		context.closePath();

		if (buffer) return context = null, buffer + "" || null;
	}//function string

	//Round number to 2 behind the decimal
	function round2(num) {
		return (Math.round((num + 0.00001) * 100) / 100);
	}//round2

	function constant$11(x) {
		return function () { return x; };
	}//constant$11

	string.radius = function (_) {
		return arguments.length ? (radius = typeof _ === "function" ? _ : constant$11(+_), string) : radius;
	};

	string.startAngle = function (_) {
		return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$11(+_), string) : startAngle;
	};

	string.endAngle = function (_) {
		return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$11(+_), string) : endAngle;
	};

	string.x = function (_) {
		return arguments.length ? (x = _, string) : x;
	};

	string.y = function (_) {
		return arguments.length ? (y = _, string) : y;
	};

	string.offset = function (_) {
		return arguments.length ? (offset = _, string) : offset;
	};

	string.heightInner = function (_) {
		return arguments.length ? (heightInner = _, string) : heightInner;
	};

	string.inner = function (_) {
		return arguments.length ? (inner = _, string) : inner;
	};

	string.outer = function (_) {
		return arguments.length ? (outer = _, string) : outer;
	};

	string.pullout = function (_) {
		return arguments.length ? (pullout = _, string) : pullout;
	};

	string.context = function (_) {
		return arguments.length ? ((context = _ == null ? null : _), string) : context;
	};

	return string;

}//string


//Final loom function
pt.chordToLoom2.loomFinal = function () {

  var pi$3 = Math.PI;
  var tau$3 = pi$3 * 2;
  var max$1 = Math.max;

  var padAngle = 0,
    sortGroups = null,
    sortSubgroups = null,
    sortStrings = null,
    heightInner = 20,
    widthOffsetInner = function () { return x; },
    emptyPerc = 0.2,
    value = function (d) { return d; },
    inner = function (d) { return d.source; },
    outer = function (d) { return d.target; };

  function loom(data) {

    //Nest the data on the outer variable
    data = d3.nest().key(outer).entries(data);

    var n = data.length,
      groupSums = [],
      groupIndex = d3.range(n),
      subgroupIndex = [],
      looms = [],
      groups = looms.groups = new Array(n),
      subgroups,
      numSubGroups,
      uniqueInner = looms.innergroups = [],
      uniqueCheck = [],
      emptyk,
      k,
      x,
      x0,
      dx,
      i,
      j,
      l,
      m,
      s,
      v,
      sum,
      counter,
      reverseOrder = false,
      approxCenter;

    //Loop over the outer groups and sum the values
    k = 0;
    numSubGroups = 0;
    for (i = 0; i < n; i++) {
      v = data[i].values.length;
      sum = 0;
      for (j = 0; j < v; j++) {
        sum += value(data[i].values[j]);
      }//for j
      groupSums.push(sum);
      subgroupIndex.push(d3.range(v));
      numSubGroups += v;
      k += sum;
    }//for i

    // Sort groups…
    if (sortGroups) groupIndex.sort(function (a, b) {
      return sortGroups(groupSums[a], groupSums[b]);
    });

    // Sort subgroups…
    if (sortSubgroups) subgroupIndex.forEach(function (d, i) {
      d.sort(function (a, b) {
        return sortSubgroups(inner(data[i].values[a]), inner(data[i].values[b]));
      });
    });

    //After which group are we past the center
    //TODO: make something for if there is no nice split in two...
    l = 0;
    for (i = 0; i < n; i++) {
      l += groupSums[groupIndex[i]];
      if (l > k / 2) {
        approxCenter = groupIndex[i];
        break;
      }//if
    }//for i

    //How much should be added to k to make the empty part emptyPerc big of the total
    emptyk = k * emptyPerc / (1 - emptyPerc);
    k += emptyk;

    // Convert the sum to scaling factor for [0, 2pi].
    k = max$1(0, tau$3 - padAngle * n) / k;
    dx = k ? padAngle : tau$3 / n;

    // Compute the start and end angle for each group and subgroup.
    // Note: Opera has a bug reordering object literal properties!
    subgroups = new Array(numSubGroups);
    x = emptyk * 0.25 * k; //quarter of the empty part //0;
    counter = 0;
    for (i = 0; i < n; i++) {
      var di = groupIndex[i],
        outername = data[di].key;

      if (approxCenter === di) {
        x = x + emptyk * 0.5 * k;
      }//if
      x0 = x;
      //If you've crossed the bottom, reverse the order of the inner strings
      if (x > pi$3) reverseOrder = true;
      s = subgroupIndex[di].length;
      for (j = 0; j < s; j++) {
        var dj = reverseOrder ? subgroupIndex[di][(s - 1) - j] : subgroupIndex[di][j],
          v = value(data[di].values[dj]),
          innername = inner(data[di].values[dj]);
        a0 = x,
          a1 = x += v * k;
        subgroups[counter] = {
          index: di,
          subindex: dj,
          startAngle: a0,
          endAngle: a1,
          value: v,
          outername: outername,
          innername: innername
        };

        //Check and save the unique inner names
        if (!uniqueCheck[innername]) {
          uniqueCheck[innername] = true;
          uniqueInner.push({ name: innername });
        }//if

        counter += 1;
      }//for j

      groups[di] = {
        index: di,
        startAngle: x0,
        endAngle: x,
        value: groupSums[di],
        outername: outername
      };
      x += dx;
    }//for i

    //Sort the inner groups in the same way as the strings
    uniqueInner.sort(function (a, b) {
      return sortSubgroups(a.name, b.name);
    });
    //Find x and y locations of the inner categories
    //TODO: make x depend on length of inner name 
    m = uniqueInner.length
    for (i = 0; i < m; i++) {
      uniqueInner[i].x = 0;
      uniqueInner[i].y = -m * heightInner / 2 + i * heightInner;
      uniqueInner[i].offset = widthOffsetInner(uniqueInner[i].name, i, uniqueInner);
    }//for i

    //Generate bands for each (non-empty) subgroup-subgroup link
    counter = 0;
    for (i = 0; i < n; i++) {
      var di = groupIndex[i];
      s = subgroupIndex[di].length;
      for (j = 0; j < s; j++) {
        var outerGroup = subgroups[counter];
        var innerTerm = outerGroup.innername;
        //Find the correct inner object based on the name
        var innerGroup = searchTerm(innerTerm, "name", uniqueInner);
        if (outerGroup.value) {
          looms.push({ inner: innerGroup, outer: outerGroup });
        }//if
        counter += 1;
      }//for j
    }//for i

    return sortStrings ? looms.sort(sortStrings) : looms;
  };//function loom(matrix)

  function searchTerm(term, property, arrayToSearch) {
    for (var i = 0; i < arrayToSearch.length; i++) {
      if (arrayToSearch[i][property] === term) {
        return arrayToSearch[i];
      }//if
    }//for i
  }//searchTerm

  function constant$11(x) {
    return function () { return x; };
  }//constant$11

  loom.padAngle = function (_) {
    return arguments.length ? (padAngle = max$1(0, _), loom) : padAngle;
  };

  loom.inner = function (_) {
    return arguments.length ? (inner = _, loom) : inner;
  };

  loom.outer = function (_) {
    return arguments.length ? (outer = _, loom) : outer;
  };

  loom.value = function (_) {
    return arguments.length ? (value = _, loom) : value;
  };

  loom.heightInner = function (_) {
    return arguments.length ? (heightInner = _, loom) : heightInner;
  };

  loom.widthOffsetInner = function (_) {
    return arguments.length ? (widthOffsetInner = typeof _ === "function" ? _ : constant$11(+_), loom) : widthOffsetInner;
  };

  loom.emptyPerc = function (_) {
    return arguments.length ? (emptyPerc = _ < 1 ? max$1(0, _) : max$1(0, _ * 0.01), loom) : emptyPerc;
  };

  loom.sortGroups = function (_) {
    return arguments.length ? (sortGroups = _, loom) : sortGroups;
  };

  loom.sortSubgroups = function (_) {
    return arguments.length ? (sortSubgroups = _, loom) : sortSubgroups;
  };

  loom.sortBands = function (_) {
    return arguments.length ? (_ == null ? sortBands = null : (sortBands = compareValue(_))._ = _, loom) : sortBands && sortBands._;
  };

  return loom;

}//loom

//Adjusted string version for this presentation, because the Rohan to Legolas slice starts just on the right half. So I'm moving it to the left half for better animation in the whole sense
pt.chordToLoom2.stringFinal = function () {

  var slice$5 = Array.prototype.slice;

  var cos = Math.cos;
  var sin = Math.sin;
  var pi$3 = Math.PI;
  var halfPi$2 = pi$3 / 2;
  var tau$3 = pi$3 * 2;
  var max$1 = Math.max;

  var inner = function (d) { return d.inner; },
    outer = function (d) { return d.outer; },
    radius = function (d) { return d.radius; },
    startAngle = function (d) { return d.startAngle; },
    endAngle = function (d) { return d.endAngle; },
    x = function (d) { return d.x; },
    y = function (d) { return d.y; },
    offset = function (d) { return d.offset; },
    pullout = 50,
    heightInner = 0,
    context = null;

  function string() {
    var buffer,
      argv = slice$5.call(arguments),
      out = outer.apply(this, argv),
      inn = inner.apply(this, argv),
      sr = +radius.apply(this, (argv[0] = out, argv)),
      sa0 = startAngle.apply(this, argv) - halfPi$2,
      sa1 = endAngle.apply(this, argv) - halfPi$2,
      sx0 = sr * cos(sa0),
      sy0 = sr * sin(sa0),
      sx1 = sr * cos(sa1),
      sy1 = sr * sin(sa1),
      tr = +radius.apply(this, (argv[0] = inn, argv)),
      tx = x.apply(this, argv),
      ty = y.apply(this, argv),
      toffset = offset.apply(this, argv),
      theight,
      xco,
      yco,
      xci,
      yci,
      leftHalf,
      pulloutContext;


    /////////////////////////////////////////////////////////////////////
    ////// Adjusted part because of the one Rohan slice to Legolas //////
    /////////////////////////////////////////////////////////////////////
    //Does the group lie on the left side
    //leftHalf = sa0+halfPi$2 > pi$3 && sa0+halfPi$2 < tau$3;
    leftHalf = sa1 + halfPi$2 > pi$3 && sa1 + halfPi$2 < tau$3;
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////

    //If the group lies on the other side, switch the inner point offset
    if (leftHalf) toffset = -toffset;
    tx = tx + toffset;
    //And the height of the end point
    theight = leftHalf ? -heightInner : heightInner;

    if (!context) context = buffer = d3.path();

    //Change the pullout based on where the string is
    pulloutContext = (leftHalf ? -1 : 1) * pullout;
    sx0 = sx0 + pulloutContext;
    sx1 = sx1 + pulloutContext;

    //Start at smallest angle of outer arc
    context.moveTo(sx0, sy0);
    //Circular part along the outer arc
    context.arc(pulloutContext, 0, sr, sa0, sa1);
    //From end outer arc to center (taking into account the pullout)
    xco = d3.interpolateNumber(pulloutContext, sx1)(0.5);
    yco = d3.interpolateNumber(0, sy1)(0.5);
    if ((!leftHalf && sx1 < tx) || (leftHalf && sx1 > tx)) {
      //If the outer point lies closer to the center than the inner point
      xci = tx + (tx - sx1) / 2;
      yci = d3.interpolateNumber(ty + theight / 2, sy1)(0.5);
    } else {
      xci = d3.interpolateNumber(tx, sx1)(0.25);
      yci = ty + theight / 2;
    }//else
    context.bezierCurveTo(xco, yco, xci, yci, tx, ty + theight / 2);
    //Draw a straight line up/down (depending on the side of the circle)
    context.lineTo(tx, ty - theight / 2);
    //From center (taking into account the pullout) to start of outer arc
    xco = d3.interpolateNumber(pulloutContext, sx0)(0.5);
    yco = d3.interpolateNumber(0, sy0)(0.5);
    if ((!leftHalf && sx0 < tx) || (leftHalf && sx0 > tx)) {
      //If the outer point lies closer to the center than the inner point
      xci = tx + (tx - sx0) / 2;
      yci = d3.interpolateNumber(ty - theight / 2, sy0)(0.5);
    } else {
      xci = d3.interpolateNumber(tx, sx0)(0.25);
      yci = ty - theight / 2;
    }//else
    context.bezierCurveTo(xci, yci, xco, yco, sx0, sy0);
    //Close path
    context.closePath();

    if (buffer) return context = null, buffer + "" || null;
  }//function string

  function constant$11(x) {
    return function () { return x; };
  }//constant$11

  string.radius = function (_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant$11(+_), string) : radius;
  };

  string.startAngle = function (_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$11(+_), string) : startAngle;
  };

  string.endAngle = function (_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$11(+_), string) : endAngle;
  };

  string.x = function (_) {
    return arguments.length ? (x = _, string) : x;
  };

  string.y = function (_) {
    return arguments.length ? (y = _, string) : y;
  };

  string.offset = function (_) {
    return arguments.length ? (offset = _, string) : offset;
  };

  string.heightInner = function (_) {
    return arguments.length ? (heightInner = _, string) : heightInner;
  };

  string.inner = function (_) {
    return arguments.length ? (inner = _, string) : inner;
  };

  string.outer = function (_) {
    return arguments.length ? (outer = _, string) : outer;
  };

  string.pullout = function (_) {
    return arguments.length ? (pullout = _, string) : pullout;
  };

  string.context = function (_) {
    return arguments.length ? ((context = _ == null ? null : _), string) : context;
  };

  return string;

}//string
