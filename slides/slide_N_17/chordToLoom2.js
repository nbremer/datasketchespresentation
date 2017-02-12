pt.chordToLoom2 = pt.chordToLoom2 || {};

pt.chordToLoom2.init = function() {
	
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
	var width = $(".slides").width()*0.95 - margin.left - margin.right;
	var height = $(".slides").height() - margin.top - margin.bottom;
				
	//SVG container
	pt.chordToLoom2.svg = d3.select('#chord-to-loom-2 #chordToLoom2')
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);
		
	var svg = pt.chordToLoom2.svg.append("g")
	    .attr("transform", "translate(" + (margin.left + width / 2) + "," + (margin.top + height / 2) + ")");

	///////////////////////////////////////////////////////////////////////////
	//////////////////////////// General variables ////////////////////////////
	///////////////////////////////////////////////////////////////////////////	

	var outerRadius = Math.min(width, height) * 0.5 - 40;
	pt.chordToLoom2.innerRadius = outerRadius*0.96;

	pt.chordToLoom2.arc = d3.arc()
	    .innerRadius(pt.chordToLoom2.innerRadius)
	    .outerRadius(outerRadius);

	var formatValue = d3.formatPrefix(",.0", 1e3);

	pt.chordToLoom2.color = d3.scaleOrdinal()
	    .domain(d3.range(4))
	    .range(["#000000", "#FFDD89", "#957244", "#F26223"]);

	///////////////////////////////////////////////////////////////////////////
	///////////////////////// Different ribbon functions //////////////////////
	///////////////////////////////////////////////////////////////////////////	

	///////////////////////////////////////////////////////////////////////////
	////////////////////////// Draw the similar factors ///////////////////////
	///////////////////////////////////////////////////////////////////////////	

	var arcWrapper = svg.append("g").attr("class", "arcWrapper");

	var chordWrapper = svg.append("g").attr("class", "ribbonWrapper");

}//init

pt.chordToLoom2.adjustedData = function(data) {

	//Set up the new loom and string functions
  	var loom = pt.lotrIntro.loom()
	      .padAngle(0.05)
	      .sortSubgroups(pt.lotrIntro.sortAlpha)
	      .heightInner(0)
	      .emptyPerc(0)
	      .widthOffsetInner(0)
	      //.widthOffsetInner(function(d) { return 6 * d.length; })
	      .value(function(d) { return d.words; })
	      //.inner(function(d) { return d.character; })
	      .outer(function(d) { return d.location; });

	var string = pt.lotrIntro.string()
	      .radius(pt.chordToLoom2.innerRadius)
	      .pullout(0);

	//Add the new arcs for the lotr data
	d3.select("#chordToLoom2 .arcWrapper").selectAll(".arc")
	    .data(loom(data).groups)
	    .enter().append("path")
	    .attr("class", "arc")
	    .style("fill", function(d) { return pt.chordToLoom2.color(d.index); })
	    .style("stroke", function(d) { return d3.rgb(pt.chordToLoom2.color(d.index)).darker(); })
	    .attr("d", pt.chordToLoom2.arc);

	d3.select("#chordToLoom2 .ribbonWrapper").selectAll(".ribbon")
	    .data(loom(data))
	    .enter().append("path")
	  	.attr("class", "ribbon")
	  	.style("fill", function(d) { return pt.chordToLoom2.color(d.outer.index); })
	    .style("stroke", function(d) { return d3.rgb(pt.chordToLoom2.color(d.outer.index)).darker(); })
	    .attr("d", string);

}//function adjustedData


pt.chordToLoom2.string = function() {

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
    
    //Does the group lie on the left side
    leftHalf = sa0+halfPi$2 > pi$3 && sa0+halfPi$2 < tau$3;
    //If the group lies on the other side, switch the inner point offset
    if(leftHalf) toffset = -toffset;
    tx = tx + toffset;
    //And the height of the end point
    theight = leftHalf ? -heightInner : heightInner;
    

        if (!context) context = buffer = d3.path();

    //Change the pullout based on where the string is
    pulloutContext  = (leftHalf ? -1 : 1 ) * pullout;
    sx0 = sx0 + pulloutContext;
    sx1 = sx1 + pulloutContext;
    
    //Start at smallest angle of outer arc
        context.moveTo(sx0, sy0);
    //Circular part along the outer arc
        context.arc(pulloutContext, 0, sr, sa0, sa1);
    //From end outer arc to center (taking into account the pullout)
        xco = d3.interpolateNumber(pulloutContext, sx1)(0.5);
        yco = d3.interpolateNumber(0, sy1)(0.5);
    if( (!leftHalf && sx1 < tx) || (leftHalf && sx1 > tx) ) {
      //If the outer point lies closer to the center than the inner point
      xci = tx + (tx - sx1)/2;
      yci = d3.interpolateNumber(ty + theight/2, sy1)(0.5);
    } else {
      xci = d3.interpolateNumber(tx, sx1)(0.25);
      yci = ty + theight/2;
    }//else
        context.bezierCurveTo(xco, yco, xci, yci, tx, ty + theight/2);
    //Draw a straight line up/down (depending on the side of the circle)
    context.lineTo(tx, ty - theight/2);
    //From center (taking into account the pullout) to start of outer arc
        xco = d3.interpolateNumber(pulloutContext, sx0)(0.5);
        yco = d3.interpolateNumber(0, sy0)(0.5);
    if( (!leftHalf && sx0 < tx) || (leftHalf && sx0 > tx) ) { 
      //If the outer point lies closer to the center than the inner point
      xci = tx + (tx - sx0)/2;
      yci = d3.interpolateNumber(ty - theight/2, sy0)(0.5);
    } else {
      xci = d3.interpolateNumber(tx, sx0)(0.25);
      yci = ty - theight/2;
    }//else
    context.bezierCurveTo(xci, yci, xco, yco, sx0, sy0);
    //Close path
    context.closePath();

        if (buffer) return context = null, buffer + "" || null;
  }//function string

  function constant$11(x) {
      return function() { return x; };
  }//constant$11

  string.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant$11(+_), string) : radius;
  };

  string.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$11(+_), string) : startAngle;
  };

  string.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$11(+_), string) : endAngle;
  };
  
  string.x = function(_) {
    return arguments.length ? (x = _, string) : x;
  };

  string.y = function(_) {
    return arguments.length ? (y = _, string) : y;
  };

  string.offset = function(_) {
    return arguments.length ? (offset = _, string) : offset;
  };
  
  string.heightInner = function(_) {
    return arguments.length ? (heightInner = _, string) : heightInner;
  };

  string.inner = function(_) {
    return arguments.length ? (inner = _, string) : inner;
  };

  string.outer = function(_) {
    return arguments.length ? (outer = _, string) : outer;
  };
  
  string.pullout = function(_) {
    return arguments.length ? (pullout = _, string) : pullout;
  };

  string.context = function(_) {
    return arguments.length ? ((context = _ == null ? null : _), string) : context;
  };

  return string;
  
}//string
