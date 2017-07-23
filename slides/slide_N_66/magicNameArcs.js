pt.magicNameArcs = pt.magicNameArcs || {};

pt.magicNameArcs.init = function() {

	d3.selectAll("#magic-name-arcs  #magic-is-everywhere-arcs")
	 	.style("transform", "scale(4)")
		.transition().duration(4000).delay(5000)
		.style("transform", "scale(1)");


}//init
