pt.wordSnakeSizes = pt.wordSnakeSizes || {};

pt.wordSnakeSizes.init = function(top100Overall, top1) {
	
	//Remove any existing svgs
	d3.select('#word-snake-sizes #wordSnakeSizes svg').remove();

	///////////////////////////////////////////////////////////////////////////
	//////////////////// Set up and initiate svg containers ///////////////////
	///////////////////////////////////////////////////////////////////////////	

	var margin = {
		top: 50,
		right: 50,
		bottom: 50,
		left: 50
	};
	pt.wordSnakeSizes.width = $(".slides").width() - margin.left - margin.right;
	pt.wordSnakeSizes.height = $(".slides").height() - margin.top - margin.bottom;
	
	//SVG container
	pt.wordSnakeSizes.svg = d3.select('#word-snake-sizes #wordSnakeSizes')
		.append("svg")
		.attr("width", pt.wordSnakeSizes.width + margin.left + margin.right)
		.attr("height", pt.wordSnakeSizes.height + margin.top + margin.bottom )
		.append("g")
	    .attr("transform", "translate(" + (margin.left) + "," + (margin.top + pt.wordSnakeSizes.height/2) + ")");



}//init
