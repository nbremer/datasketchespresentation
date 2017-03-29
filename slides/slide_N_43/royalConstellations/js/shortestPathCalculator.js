/*
 *
 * Dijkstra Short Path Calculator and Graph Plotter
 * Uses D3 JS (V3)
 * 
 * Taken & adjusted from https://github.com/julianbrowne/dijkstra/blob/master/javascripts/ShortestPathCalculator.js
 * by N. Bremer - VisualCinnamon.com
 *
 */

var ShortestPathCalculator = function(nodes, paths) {

	this.nodes = nodes; // nodes => [ { index: 0, value: 'a', r: 20 }, ... ]
	this.paths = paths; // paths => [ { source: 0, target: 1 }, ... ]
	//this.distances = [];

	this.idIndex = {};
	for(var i=0; i < nodes.length; i++) {
		this.idIndex[nodes[i].id] = i;
	}//for i

    this.makeDistanceArrayFromNodes();
    this.populateDistances();

}//ShortestPathCalculator

ShortestPathCalculator.prototype.findRoute = function(source, target) {

	this.result = this.dijkstra(source, target);
	return this.result;

}//findRoute

ShortestPathCalculator.prototype.makeDistanceArrayFromNodes = function() {

	this.distances = [];

	for(var i=0; i<this.nodes.length; i++) {

		this.distances[i] = [];

		for(var j=0; j<this.nodes.length; j++){
			this.distances[i][j] = 'x';
		}//for j
	}//for i

}//makeDistanceArrayFromNodes

ShortestPathCalculator.prototype.populateDistances = function() {

	for(var i=0; i<this.paths.length; i++) {

		var s = this.idIndex[this.paths[i].source.id];
		var t = this.idIndex[this.paths[i].target.id];
        //Give more weight to a wife-husband link
        var distance = this.paths[i].type === "wife-husband" ? 2 : 1;

		this.distances[s][t] = distance;
		this.distances[t][s] = distance;
	}//for i

}//populateDistances

/*
 *
 * Calculate shortest path between two nodes in a graph
 * 
 * @param {string} start     index of node to start from
 * @param {string} end       index of node to end at
 *
 */

ShortestPathCalculator.prototype.dijkstra = function(start, end) {

    var nodeCount = this.distances.length,
        infinity = 99999,  // larger than largest distance in distances array
        shortestPath = new Array(nodeCount),
        nodeChecked  = new Array(nodeCount),
        pred         = new Array(nodeCount);

    // initialise data placeholders

    for(var i=0; i<nodeCount; i++) {
        shortestPath[i] = infinity;
        pred[i]=null;
        nodeChecked[i]=false;
    }//for i

    shortestPath[this.idIndex[start]]=0;

    for(var i=0; i<nodeCount; i++) {

        var minDist = infinity;
        var closestNode = null;
        
        for (var j=0; j<nodeCount; j++) {

            if(!nodeChecked[j]) {
                if(shortestPath[j] <= minDist) {
                    minDist = shortestPath[j];
                    closestNode = j;
                }//if
            }//if
        }//for j

        nodeChecked[closestNode] = true;

        for(var k=0; k<nodeCount; k++) {
            if(!nodeChecked[k]){
                var nextDistance = distanceBetween(closestNode, k, this.distances);

                if ((parseInt(shortestPath[closestNode]) + parseInt(nextDistance)) < parseInt(shortestPath[k])){
                    soFar = parseInt(shortestPath[closestNode]);
                    extra = parseInt(nextDistance);
                    
                    shortestPath[k] = soFar + extra;
                    
                    pred[k] = closestNode;
                }//if
            }//if
        }//for k
                
    }//for i
  
    if(shortestPath[this.idIndex[end]] < infinity) {

        var newPath = [];
        var step    = { target: end };

        var v = parseInt(this.idIndex[end]);
        
        while (v>=0) {

            v = pred[v];

            if (v!==null && v>=0) {
                step.source = this.nodes[v].id;
                newPath.unshift(step);
                step = {target: this.nodes[v].id};
            }//if

        }//while

        totalDistance = shortestPath[this.idIndex[end]];
        
        return {mesg:'OK', path: newPath, source: start, target: end, distance:totalDistance};
    }//if 
    else {
        return {mesg:'No path found', path: null, source: start, target: end, distance: 0 };
    }//else
    
    function distanceBetween(fromNode, toNode, distances) {

        dist = distances[fromNode][toNode];

        if(dist==='x') dist = infinity;
        
        return dist;
    }//distanceBetween

}//dijkstra

