pt.olympicBuildUp = pt.olympicBuildUp || {};

pt.olympicBuildUp.init = function(data) {
	
	//Remove any existing svgs
	d3.select('#olympic-buildup #olympicBuildUp svg').remove();

	///////////////////////////////////////////////////////////////////////////
	//////////////////// Set up and initiate svg containers ///////////////////
	///////////////////////////////////////////////////////////////////////////	

	var margin = {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	};
	var width = $(".slides").width() - margin.left - margin.right;
	var height = $(".slides").height() - margin.top - margin.bottom;

  var chartScale = 0.7;

  var outerRadius = 220 * chartScale,
      innerRadius = 40 * chartScale,
      featherPadding = 1.5,
      medalDegree = 320/(50.5*2),
      arcHeight = 5 * chartScale;

  ////////////////////////////////////////////////////////////
  ////////////////////// Create SVG //////////////////////////
  ////////////////////////////////////////////////////////////
        
  var svg = d3.select('#olympic-buildup #olympicBuildUp').append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .on("mouseover", function() {
          pt.olympicIntro.hideTooltipEdition("olympic-buildup-tooltip-edition");
          pt.olympicIntro.hideTooltip("olympic-buildup-tooltip");
      })
      .append("g")
      .attr("transform", "translate(" + (margin.left + width/2) + "," + (margin.top + height/2) + ")");

  ////////////////////////////////////////////////////////////
  //////////////////////// Editions //////////////////////////
  ////////////////////////////////////////////////////////////

  var olympicEditions = [
      {"edition": 1896, "city": "Athens", "cityContinent": "Europe"},
      {"edition": 1900, "city": "Paris", "cityContinent": "Europe"},
      {"edition": 1904, "city": "St. Louis", "cityContinent": "Americas"},
      {"edition": 1908, "city": "London", "cityContinent": "Europe"},
      {"edition": 1912, "city": "Stockholm", "cityContinent": "Europe"},
      {"edition": 1916, "city": "none", "cityContinent": "none"},
      {"edition": 1920, "city": "Antwerp", "cityContinent": "Europe"},
      {"edition": 1924, "city": "Paris", "cityContinent": "Europe"},
      {"edition": 1928, "city": "Amsterdam", "cityContinent": "Europe"},
      {"edition": 1932, "city": "Los Angeles", "cityContinent": "Americas"},
      {"edition": 1936, "city": "Berlin", "cityContinent": "Europe"},
      {"edition": 1940, "city": "none", "cityContinent": "none"},
      {"edition": 1944, "city": "none", "cityContinent": "none"},
      {"edition": 1948, "city": "London", "cityContinent": "Europe"},
      {"edition": 1952, "city": "Helsinki", "cityContinent": "Europe"},
      {"edition": 1956, "city": "Melbourne", "cityContinent": "Oceania"},
      {"edition": 1960, "city": "Rome", "cityContinent": "Europe"},
      {"edition": 1964, "city": "Tokyo", "cityContinent": "Asia"},
      {"edition": 1968, "city": "Mexico City", "cityContinent": "Americas"},
      {"edition": 1972, "city": "Munich", "cityContinent": "Europe"},
      {"edition": 1976, "city": "Montreal", "cityContinent": "Americas"},
      {"edition": 1980, "city": "Moscow", "cityContinent": "Europe"},
      {"edition": 1984, "city": "Los Angeles", "cityContinent": "Americas"},
      {"edition": 1988, "city": "Seoul", "cityContinent": "Asia"},
      {"edition": 1992, "city": "Barcelona", "cityContinent": "Europe"},
      {"edition": 1996, "city": "Atlanta", "cityContinent": "Americas"},
      {"edition": 2000, "city": "Sydney", "cityContinent": "Oceania"},
      {"edition": 2004, "city": "Athens", "cityContinent": "Europe"},
      {"edition": 2008, "city": "Beijing", "cityContinent": "Asia"},
      {"edition": 2012, "city": "London", "cityContinent": "Europe"},
      {"edition": 2016, "city": "Rio de Janeiro", "cityContinent": "Americas"}
  ];

  var tickEditions = [
      {"edition": 1916, "city": "none", "cityContinent": "none"},
      {"edition": 1936, "city": "Berlin", "cityContinent": "Europe"},
      {"edition": 1956, "city": "Melbourne / Stockholm", "cityContinent": "Oceania"},
      {"edition": 1976, "city": "Montreal", "cityContinent": "Americas"},
      {"edition": 1996, "city": "Atlanta", "cityContinent": "Americas"}
  ];


  var startYear = 1896,
      endYear = 2016;

  var warYears = [1916, 1940, 1944];

  ////////////////////////////////////////////////////////////
  //////////////////// Colors & Scales ///////////////////////
  ////////////////////////////////////////////////////////////
          
  //Although not designed to represent continents (https://en.wikipedia.org/wiki/Olympic_symbols) 
  //I will use the general accepted coloring of:
  //Americas - Red
  //Europe - Blue
  //Africa - Black
  //Asia - Yellow
  //Oceania - Green
  //Mixed - all of them - gradient

  var continents = ["Europe","Asia","Africa","Oceania","Americas"];
  var arcColors = ["#1482C6","#FAB349","#242021","#17A554","#EA1F46"];
  //Colors for the medals
  pt.olympicBuildUp.color = d3.scaleOrdinal()
      .domain(continents)
      .range(arcColors)
      .unknown("#c6c6c6");

  var timeScale = d3.scaleLinear()
      .domain([startYear, endYear])
      .range([innerRadius, outerRadius]);

  var dotScale = d3.scaleSqrt()
      .domain([startYear, endYear])
      .range([0.4,1]);

  ////////////////////////////////////////////////////////////
  ///////////////////////// Gradients ////////////////////////
  ////////////////////////////////////////////////////////////

  var defs = svg.append("defs");

  //Create a radial gradient for the men part of the feather
  defs.append("radialGradient")
    .attr("id", "men-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", outerRadius) //not really needed, since 50% is the default
    .selectAll("stop")
    .data([
        {offset: "20%", color: "white"},
        {offset: "100%", color: "#E1F2FF"} //"#E2F6FF"}
      ])
    .enter().append("stop")
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return d.color; });

  //Create a radial gradient for the women part of the feather
  defs.append("radialGradient")
    .attr("id", "women-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", outerRadius)
    .selectAll("stop")
    .data([
        {offset: "20%", color: "white"},
        {offset: "100%", color: "#FDEAEA"} //"#FFE6FB"
      ])
    .enter().append("stop")
    .attr("offset", function(d) { return d.offset; })
    .attr("stop-color", function(d) { return d.color; });

  //Create gradient for the mixed team gold medal winners in 1896, 1900 & 1904
  var mixedGradients = defs.selectAll(".mixed-gradient")
    .data([1896, 1900, 1904])
    .enter().append("radialGradient")
    .attr("class", "mixed-gradient")
    .attr("id", function(d) { return "mixed-gradient-" + d; })
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r",  function(d) { return timeScale(d) + arcHeight; });
  //Create the stops per gradient year
  mixedGradients.selectAll("stop")
    .data(arcColors)
    .enter().append("stop")
    .attr("offset", function(d,i) { 
      var edition = this.parentNode.__data__;
      return  (timeScale(edition) + (i/(arcColors.length-1)) * arcHeight) / (timeScale(edition) + arcHeight); 
    })
    .attr("stop-color", function(d) { return d; });

  ////////////////////////////////////////////////////////////
  /////////////////////// Arc set-up /////////////////////////
  ////////////////////////////////////////////////////////////

  pt.olympicBuildUp.arc = d3.arc()
      .outerRadius(function(d) { return timeScale(d.edition) + arcHeight; })
      .innerRadius(function(d) { return timeScale(d.edition); })
      .startAngle(function(d) { 
        //Towards the left for women and right for men
        var sign = d.gender === "Men" ? 1 : -1;
        return sign * ( (d.startMedalCount * medalDegree) * Math.PI/180);
      })
      .endAngle(function(d) { 
        //Towards the left for women and right for men
        var sign = d.gender === "Men" ? 1 : -1;
        return sign * ( ((d.startMedalCount + d.medalCount) * medalDegree) * Math.PI/180);
      });

  pt.olympicBuildUp.arcBasic = d3.arc()
      .outerRadius(function(d) { return timeScale(startYear) + arcHeight;  })
      .innerRadius(function(d) { return timeScale(startYear); })
      .startAngle(0)
      .endAngle(function(d) { 
        //Towards the left for women and right for men
        var sign = d.gender === "Men" ? 1 : -1;
        return sign * ( (d.medalCount * medalDegree) * Math.PI/180);// + 1/timeScale(d.edition) ); 
      });

  pt.olympicBuildUp.arcEdition = d3.arc()
      .outerRadius(function(d) { return timeScale(d.edition) + arcHeight;  })
      .innerRadius(function(d) { return timeScale(d.edition); })
      .startAngle(0)
      .endAngle(function(d) { 
        //Towards the left for women and right for men
        var sign = d.gender === "Men" ? 1 : -1;
        return sign * ( (d.medalCount * medalDegree) * Math.PI/180);// + 1/timeScale(d.edition) ); 
      });

  //Arc function for the section behind the arcs to signify the gender difference
  var genderArc = d3.arc()
      .outerRadius(outerRadius + arcHeight)
      .innerRadius(innerRadius)
      .startAngle(0)
      .endAngle(function(d) { 
        //Towards the left for women and right for men
        var sign = d === "Men" ? 1 : -1;
        return sign * (this.parentNode.__data__.maxMedals * medalDegree) * Math.PI/180;
      });

  //Small arcs to make it easier to see the years
  var yearArc = d3.arc()
      .outerRadius(function(d) { return timeScale(d) + 1*chartScale; })
      .innerRadius(function(d) { return timeScale(d) - 1*chartScale;} )
      .startAngle(function(d) { return -this.parentNode.__data__.maxMedals * medalDegree * Math.PI/180; })
      .endAngle(function(d) { return this.parentNode.__data__.maxMedals * medalDegree * Math.PI/180; }); 

  //Large arcs to siginify the 3 games not done due to war
  var warArc = d3.arc()
      .outerRadius(function(d) { return timeScale(d) + arcHeight; })
      .innerRadius(function(d) { return timeScale(d);} )
      .startAngle(function(d) { return -this.parentNode.__data__.maxMedals * medalDegree * Math.PI/180; })
      .endAngle(function(d) { return this.parentNode.__data__.maxMedals * medalDegree * Math.PI/180; }); 

  ////////////////////////////////////////////////////////////
  /////////////////// Create tails/circles ///////////////////
  ////////////////////////////////////////////////////////////

  //Locations of each circle
  var circleLocations = [
    {id: 1, x: outerRadius * -3, y: outerRadius * -1.3},
    {id: 2, x: outerRadius * -1.5, y: outerRadius * 1.3},
    {id: 3, x: 0, y: outerRadius * -1.3},
    {id: 4, x: outerRadius * 1.5, y: outerRadius * 1.3},
    {id: 5, x: outerRadius * 3, y: outerRadius * -1.3}
  ];

  //Create a group for each circle
  pt.olympicBuildUp.tails = svg.selectAll(".tail")
      .data(data)
      .enter().append("g")
      .attr("class", function(d,i) { return "tail " + removeSpace(d.group); })
      .attr("transform", function(d,i) { 
          d.circleRotation = 180 + (360 - 2 * d.maxMedals * medalDegree - (d.disciplines.length - 1) * featherPadding)/2;
          d.x = circleLocations[i].x;
          d.y = circleLocations[i].y;
          return "translate(" + d.x + "," + d.y + ")"; 
      });

  ////////////////////////////////////////////////////////////
  //////////////////// Create city arcs //////////////////////
  ////////////////////////////////////////////////////////////

  var cityArcGroup = pt.olympicBuildUp.tails.append("g")
      .attr("class", "city-arcs")
      .attr("transform", function(d,i) { return "rotate(" + -d.circleRotation + ")"; });

  pt.olympicBuildUp.cityArcs = cityArcGroup.selectAll(".city-arc")
      .data(olympicEditions)
      .enter().append("path")
      .attr("class", "city-arc")
      .attr("d", function(d) {
          var cityStartAngle = -(this.parentNode.__data__.circleRotation - 180) * Math.PI/180 + Math.PI; 
          var cityEndAngle = (this.parentNode.__data__.circleRotation - 180) * Math.PI/180 + Math.PI; 

          return d3.arc()
              .outerRadius(function(d) { return timeScale(d.edition) + arcHeight; })
              .innerRadius(function(d) { return timeScale(d.edition); })
              .startAngle( cityStartAngle )
              .endAngle( cityEndAngle )(d);
      });

  ////////////////////////////////////////////////////////////
  //////////////////// Create time axes //////////////////////
  ////////////////////////////////////////////////////////////

  var groupYears = d3.range(startYear + 20, endYear, 20);
  var ticks = d3.range(startYear, endYear + 4, 4);
  ticks = ticks.filter(function(d) { return groupYears.indexOf(d) === -1; });

  pt.olympicBuildUp.timeAxes = pt.olympicBuildUp.tails.append("g")
      .attr("class", "time-axis");

  pt.olympicBuildUp.timeAxes.append("text")
      .attr("class", "time-axis-outer-years")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "0.35em")
      .style("font-size", 13*chartScale + "px")
      .text("1896");

  pt.olympicBuildUp.endYear = pt.olympicBuildUp.timeAxes.append("text")
      .attr("class", "time-axis-outer-years")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "0.35em")
      .style("font-size", 13*chartScale + "px")
      .each(function(d) { d.textLoc = timeScale(2040); })
      .text("2016");

  //Create the small years within the axis
  pt.olympicBuildUp.yearAxis = pt.olympicBuildUp.timeAxes.selectAll(".time-axis-small-year")
      .data(tickEditions)
      .enter().append("text")
      .attr("class", "time-axis-small-year")
      .attr("x", 0)
      .attr("y", function(d) { return timeScale(startYear) + arcHeight/2; })
      .attr("dy", "0.35em")
      .style("font-size", 8*chartScale + "px")
      .each(function(d) { d.textLoc = timeScale(d.edition) + arcHeight/2; })
      .text(function(d) { return d.edition; });

  ////////////////////////////////////////////////////////////
  ///////////////////// Create feathers //////////////////////
  ////////////////////////////////////////////////////////////

  pt.olympicBuildUp.feathers = pt.olympicBuildUp.tails.selectAll(".feather")
      .data(function(d) { return d.disciplines; })
      .enter().append("g")
      .attr("class", function(d,i) { return "feather " + removeSpace(d.discipline); })
      .each(function(d,i) {
          d.angle = (2*d.featherOffset + d.maxMedals) * medalDegree + i * featherPadding; 
      });

  //Append the label names on the outside
  pt.olympicBuildUp.feathers.append("text")
      .attr("dy", ".35em")
      .attr("class", "discipline-title")
      .attr("text-anchor", "end")
      .attr("transform", function(d) { return "rotate(90)translate(" + -timeScale(2028) + ")"; })
      .style("font-size", 12*chartScale + "px")
      .text(function(d,i) { return d.discipline; });

  //Create section behind each gender to fill with gradient
  pt.olympicBuildUp.feathers.selectAll(".gender-arc")
      .data(["Men","Women"])
      .enter().append("path")
      .attr("class", function(d) { return "gender-arc gender-" + d.toLowerCase(); })
      .style("fill", function(d) { return "url(#" + d.toLowerCase() + "-gradient)"; })
      .attr("d", genderArc);

  ////////////////////////////////////////////////////////////
  //////////////// Create inside of feathers /////////////////
  ////////////////////////////////////////////////////////////

  pt.olympicBuildUp.editions = pt.olympicBuildUp.feathers.selectAll(".edition")
    .data(function(d) { return d.editions; })
    .enter().append("g")
    .attr("class", function(d,i) { return "edition year_" + d.edition; });

  pt.olympicBuildUp.genders = pt.olympicBuildUp.editions.selectAll(".genders")
    .data(function(d) { return d.genders; })
    .enter().append("g")
    .attr("class", function(d,i) { return "gender " + d.gender; });

  //Finally append the paths
  pt.olympicBuildUp.medalArcs = pt.olympicBuildUp.genders.selectAll(".medal")
      .data(function(d) { return d.continents; })
      .enter().append("path")
      .attr("class", function(d,i) { return "medal " + d.continent; })
      .style("fill", function(d) { return d.continent === "Mixed" ? "url(#mixed-gradient-" + d.edition + ")" : pt.olympicBuildUp.color(d.continent); })
      .attr("d", pt.olympicBuildUp.arcBasic)
      .style("stroke-width", 2*chartScale);

  pt.olympicBuildUp.olympicRecords = pt.olympicBuildUp.genders.selectAll(".record")
      .data(function(d) { return d.continents.filter(function(r) { return r.OR !== ""; }) ; })
      .enter().append("circle")
      .attr("class", function(d,i) { return "record " + d.ORtype + "-record"; })
      .style("fill", function(d) { return "white"; })
      .attr("cx", function(d) { return pt.olympicBuildUp.arcBasic.centroid(d)[0]; })
      .attr("cy", function(d) { return pt.olympicBuildUp.arcBasic.centroid(d)[1]; })
      .attr("r", function(d) { return dotScale(d.edition) * arcHeight/2*0.8; })
      .style("pointer-events", "none");

  ////////////////////////////////////////////////////////////
  //////////////////// Append Grid Lines /////////////////////
  ////////////////////////////////////////////////////////////

  //Create a line to split the genders
  pt.olympicBuildUp.feathers.append("line")
    .attr("class", "time-line")
    .attr("y1", -timeScale(startYear))
    .attr("y2", -timeScale(endYear) - arcHeight)
    .style("stroke-width", 2*chartScale)
    .style("opacity", 0);

  //Create small rings to siginify 20 years
  pt.olympicBuildUp.feathers.selectAll(".year-outline")
    .data(groupYears)
    .enter().append("path")
    .attr("class", "year-outline")
    .attr("d", yearArc)
    .style("opacity", 0);

  //Create war years
  pt.olympicBuildUp.feathers.selectAll(".war-arc")
    .data(warYears)
    .enter().append("path")
    .attr("class", "war-arc")
    .attr("d", warArc)
    .style("opacity", 0);

}//init

pt.olympicBuildUp.initializeCircles = function() {

  //In case you move backward
  pt.olympicBuildUp.tails
      .transition().duration(1000)
      .attr("transform", function(d,i) { return "translate(" + d.x + "," + d.y + ")"; });

  pt.olympicBuildUp.previousstep = "initializeCircles";

}//function initializeCircles

pt.olympicBuildUp.rotateCircles = function() {

  //In case you move backward
  pt.olympicBuildUp.feathers
      .transition().duration(1000)
      .attr("transform", "rotate(0)");
  pt.olympicBuildUp.timeAxes
    .transition().duration(1000).delay(1000)
    .attr("transform", "rotate(0)");

  //Rotate the tails into the right angle
  pt.olympicBuildUp.tails
      .transition().duration(2000)
      .attr("transform", function(d,i) { return "translate(" + d.x + "," + d.y + ")" + "rotate(" + d.circleRotation + ")"; });

  pt.olympicBuildUp.previousstep = "rotateCircles";
}//function rotateCircles

pt.olympicBuildUp.rotateFeathers = function() {

  //In case you move backward
  pt.olympicBuildUp.medalArcs
      .transition().duration(500)
      .attr("d", pt.olympicBuildUp.arcBasic);
  pt.olympicBuildUp.endYear
      .transition().duration(500)
      .attr("y", 0);
  pt.olympicBuildUp.yearAxis
      .transition().duration(500)
      .attr("y", 0);
  pt.olympicBuildUp.feathers.selectAll(".time-line, .year-outline, .war-arc")
      .transition().duration(500)
      .style("opacity", 0);

  //Simple scale to make the rotation duration depend on initial angle
  var rotateSpeed = d3.scaleLinear()
    .domain([0, 360])
    .range([0, 1500]);

  //Rotate the feathers into the right angle afterwards
  if(pt.olympicBuildUp.previousstep === "rotateCircles") {
    pt.olympicBuildUp.feathers
        .transition().duration(function(d) { return 2000 + rotateSpeed(d.angle); })
        .attrTween("transform", function(d) { 
          var interpolate = d3.interpolateString("rotate(0)", "rotate(" + d.angle + ")");
          return function(t) {
              return interpolate(t);
          };
        });
        //.attr("transform", function(d) { return "rotate(" + d.angle + ")"; });
  }//if

  //Rotate the year axes into the right angle
  pt.olympicBuildUp.timeAxes
    .transition().duration(1000)
    .attr("transform", function(d,i) { return "rotate(" + -d.circleRotation + ")"; });

  pt.olympicBuildUp.previousstep = "rotateFeathers"

}//function rotateFeathers

pt.olympicBuildUp.outwardEditions = function() {

  //In case you move backward
  pt.olympicBuildUp.cityArcs
      .on("mouseover", null)
      .on("mouseout", null);

  //Move the editions outward
  pt.olympicBuildUp.medalArcs
      .transition().duration(1000)
      .attr("d", pt.olympicBuildUp.arcEdition);

  //Move the time axis outward
  pt.olympicBuildUp.endYear
      .transition().duration(1000)
      .attr("y", function(d) { return d.textLoc; });
  pt.olympicBuildUp.yearAxis
      .transition().duration(1000)
      .attr("y", function(d) { return d.textLoc; });

  //Show the year arcs
  pt.olympicBuildUp.feathers.selectAll(".time-line, .year-outline, .war-arc")
      .transition().duration(1000).delay(1500)
      .style("opacity", 1);

  pt.olympicBuildUp.previousstep = "outwardEditions";

}//function outwardEditions


pt.olympicBuildUp.outwardMedals = function() {

  //In case you come in from the next slide - thus move backward
  pt.olympicBuildUp.tails.attr("transform", function(d,i) { return "translate(" + d.x + "," + d.y + ")" + "rotate(" + d.circleRotation + ")"; });
  pt.olympicBuildUp.feathers.attr("transform", function(d) { return "rotate(" + d.angle + ")"; });
  pt.olympicBuildUp.timeAxes.attr("transform", function(d,i) { return "rotate(" + -d.circleRotation + ")"; });
  pt.olympicBuildUp.endYear.attr("y", function(d) { return d.textLoc; });
  pt.olympicBuildUp.yearAxis.attr("y", function(d) { return d.textLoc; });
  pt.olympicBuildUp.feathers.selectAll(".time-line, .year-outline, .war-arc").style("opacity", 1);
  pt.olympicBuildUp.medalArcs.attr("d", pt.olympicBuildUp.arcEdition);

  //Move the editions outward
  pt.olympicBuildUp.medalArcs
      .transition().duration(1500)
      .attr("d", pt.olympicBuildUp.arc);

  //Initiate the hover over the editions
  pt.olympicBuildUp.cityArcs
      .on("mouseover",function(d) {
          d3.event.stopPropagation();
          //Highlight the medals of the hovered over edition
          pt.olympicBuildUp.tails.selectAll(".edition")
              .style("opacity", function(m) { return m.edition === d.edition ? 1 : 0.15; });
          //Make the arc a bit more apperant
          pt.olympicBuildUp.tails.selectAll(".city-arc")
              .style("opacity", function(m) { return m.edition === d.edition ? 0.75 : 0;});
          //Hide gender arcs a bit
          pt.olympicBuildUp.tails.selectAll(".gender-arc").style("opacity", 0.5);
          pt.olympicIntro.showTooltipEdition(d, pt.olympicBuildUp.color, "olympic-buildup-tooltip-edition"); 
      })
      .on("mouseout",function(d) {
          //Make all medals the same
          pt.olympicBuildUp.tails.selectAll(".edition").style("opacity", 1);
          //Hide the year arc
          pt.olympicBuildUp.tails.selectAll(".city-arc").style("opacity", null);
          //Gender gradients back to normal
          pt.olympicBuildUp.tails.selectAll(".gender-arc").style("opacity", null);
          pt.olympicIntro.hideTooltipEdition("olympic-buildup-tooltip-edition");
      });

  //Initiate the hover over the medals
  pt.olympicBuildUp.medalArcs
      .on("mouseover", function(d) { 
          d3.event.stopPropagation();
          //Highlight the hovered over medal
          //Append it on top so it lies over all the axis lines
          d3.select(this.parentNode.parentNode.parentNode).append("path")
              .attr("class", "hover-medal")
              .attr("d", pt.olympicBuildUp.arc(d))
              .style("stroke-width", 1.5)
              .style("fill", "none")
              .style("stroke", "#212121")
              //.style("stroke", arcColors[(continents.indexOf(d.continent)+1)%continents.length] )
              .style("pointer-events","none")
              .style("opacity", 0)
              .transition().duration(0)
              .style("opacity", 1);
          //Show tooltip
          pt.olympicIntro.showTooltip(d, pt.olympicBuildUp.color, "olympic-buildup-tooltip"); 
      })
      .on("mouseout", function() {
          //Remove hovered over border
          pt.olympicBuildUp.tails.selectAll(".hover-medal")
              .transition().duration(100)
              .style("opacity", 0)
              .remove();
          //Hide the tooltip
          pt.olympicIntro.hideTooltip("olympic-buildup-tooltip")
      });

}//function outwardMedals

