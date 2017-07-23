pt.dbzPathFinal = pt.dbzPathFinal || {};

pt.dbzPathFinal.init = function(data) {
	
	//If the chart already exists, do nothing and return
	var chartDBZ = document.getElementById("dbzPathFinal").getElementsByClassName("svg-canvas");
	if(chartDBZ.length > 0) { return; }

	//Remove any existing svgs
	//d3.select('#dbz-path-final #dbzPathFinal svg').remove();

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
	pt.dbzPathSimple.svg = d3.select('#dbz-path-final #dbzPathFinal')
		.append("svg")
		.attr("class", "svg-canvas")
		.attr("width", width + margin.left + margin.right)
		.attr("height", $(".slides").height() )
		.append("g")
	    .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");

	pt.dbzPathSimple.chosen = "";
	
	pt.dbzPathSimple.createDbzFights(pt.dbzPathSimple.svg, width, height, data);

	pt.dbzPathSimple.setFinal();

}//init

pt.dbzPathSimple.setFinal = function() {

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
		.style("opacity", 1);

	//Show all the other lines as well
	pt.dbzPathSimple.characterLines
		.on("mouseover", function(d) { pt.dbzPathSimple.lineMouseOver(pt.dbzPathSimple.svg, d); })
		.on("mouseout", function(d) { pt.dbzPathSimple.lineMouseOut(pt.dbzPathSimple.svg, d, 0); })
		.style("opacity", function(d) { return d.opacity; });

}
