pt.olympicIntro = pt.olympicIntro || {};

pt.olympicIntro.init = function(data) {
	
	//Remove any existing svgs
	d3.select('#olympic-intro #olympicIntro svg').remove();

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

  var chartScale = 1.2;

  var outerRadius = 220 * chartScale,
    innerRadius = 40 * chartScale,
    featherPadding = 1.5,
    medalDegree = 320/(50.5*2),
    arcHeight = 5 * chartScale;

  pt.olympicIntro.startPos = [719,372];
  pt.olympicIntro.startScale = 0.293;
  pt.olympicIntro.endPos = [width/2, height/2];
  pt.olympicIntro.endScale = chartScale;

  ////////////////////////////////////////////////////////////
  ////////////////////// Create SVG //////////////////////////
  ////////////////////////////////////////////////////////////
        
  var svg = d3.select('#olympic-intro #olympicIntro').append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .on("mouseover", function() {
        pt.olympicIntro.hideTooltipEdition("olympic-intro-tooltip-edition");
        pt.olympicIntro.hideTooltip("olympic-intro-tooltip");
      })
      .append("g")
      .attr("class", "olympic-group")
      .attr("transform", "translate(" + pt.olympicIntro.startPos[0] + "," + pt.olympicIntro.startPos[1] + ")");

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
  var color = d3.scaleOrdinal()
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

  var arc = d3.arc()
      .outerRadius(function(d) { return timeScale(d.edition) + arcHeight; })
      .innerRadius(function(d) { return timeScale(d.edition); })
      .startAngle(function(d) { 
        //Towards the left for women and right for men
        var sign = d.gender === "Men" ? 1 : -1;
        return sign * ( (d.startMedalCount * medalDegree) * Math.PI/180);// + 1/timeScale(d.edition) ); 
      })
      .endAngle(function(d) { 
        //Towards the left for women and right for men
        var sign = d.gender === "Men" ? 1 : -1;
        return sign * ( ((d.startMedalCount + d.medalCount) * medalDegree) * Math.PI/180);// + 1/timeScale(d.edition) ); 
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

  //Create a group for each circle
  var tails = svg.selectAll(".tail")
    .data(data.filter(function(d,i) { return i === 0; }))
    .enter().append("g")
    .attr("class", function(d,i) { return "tail " + removeSpace(d.group); })
    .attr("transform", function(d,i) { 
      d.circleRotation = 180 + (360 - 2 * d.maxMedals * medalDegree - (d.disciplines.length - 1) * featherPadding)/2;
      return "rotate(" + d.circleRotation + ")"; 
    });

  ////////////////////////////////////////////////////////////
  //////////////////// Create city arcs //////////////////////
  ////////////////////////////////////////////////////////////

  var cityArcs = tails.append("g")
    .attr("class", "city-arcs")
    .attr("transform", function(d,i) { return "rotate(" + -d.circleRotation + ")"; });

  cityArcs.selectAll(".city-arc")
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
    })
    .on("mouseover",function(d) {
      d3.event.stopPropagation();
      
      //Highlight the medals of the hovered over edition
      d3.selectAll(".edition")
        .style("opacity", function(m) {
          return m.edition === d.edition ? 1 : 0.15;
        });

      //Make the arc a bit more apperant
      d3.selectAll(".city-arc")
        .style("opacity", function(m) {
          return m.edition === d.edition ? 0.75 : 0;
        });
      //d3.select(this).style("opacity", 0.5);

      //Hide gender arcs a bit
      d3.selectAll(".gender-arc")
        .style("opacity", 0.5);

      pt.olympicIntro.showTooltipEdition(d, color, "olympic-intro-tooltip-edition"); 
    })
    .on("mouseout",function(d) {
      //Make all medals the same
      d3.selectAll(".edition")
        .style("opacity", 1);

      //Hide the year arc
      //d3.select(this).style("opacity", null);
      d3.selectAll(".city-arc")
        .style("opacity", null);

      //Gender gradients back to normal
      d3.selectAll(".gender-arc")
        .style("opacity", null);

      pt.olympicIntro.hideTooltipEdition("olympic-intro-tooltip-edition");
    });

  ////////////////////////////////////////////////////////////
  //////////////////// Create time axes //////////////////////
  ////////////////////////////////////////////////////////////

  var groupYears = d3.range(startYear + 20, endYear, 20);
  var ticks = d3.range(startYear, endYear + 4, 4);
  ticks = ticks.filter(function(d) { return groupYears.indexOf(d) === -1; });

  var timeAxes = tails.append("g")
    .attr("class", "time-axis")
    .attr("transform", function(d,i) { return "rotate(" + -d.circleRotation + ")"; });

  timeAxes.append("text")
    .attr("class", "time-axis-outer-years")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dy", "0.35em")
    .style("font-size", 13*chartScale + "px")
    .text("1896");

  timeAxes.append("text")
    .attr("class", "time-axis-outer-years")
    .attr("x", 0)
    .attr("y", timeScale(2040))
    .attr("dy", "0.35em")
    .style("font-size", 13*chartScale + "px")
    .text("2016");

  //Create the small years within the axis
  timeAxes.selectAll(".time-axis-small-year")
    .data(tickEditions)
    .enter().append("text")
    .attr("class", "time-axis-small-year")
    .attr("x", 0)
    .attr("y", function(d) { return timeScale(d.edition) + arcHeight/2; })
    .attr("dy", "0.35em")
    .style("font-size", 8*chartScale + "px")
    .text(function(d) { return d.edition; });

  ////////////////////////////////////////////////////////////
  ///////////////////// Create feathers //////////////////////
  ////////////////////////////////////////////////////////////

  var feathers = tails.selectAll(".feather")
    .data(function(d) { return d.disciplines; })
    .enter().append("g")
    .attr("class", function(d,i) { return "feather " + removeSpace(d.discipline); })
    .attr("transform", function(d,i) {
      d.angle = (2*d.featherOffset + d.maxMedals) * medalDegree + i * featherPadding; 
      return "rotate(" + d.angle + ")"; 
    });

  //Append the label names on the outside
  feathers.append("text")
      .attr("dy", ".35em")
      .attr("class", "discipline-title")
      .attr("text-anchor", function(d) { 
        return (d.angle + this.parentNode.parentNode.__data__.circleRotation) > 360 ? "start" : "end"; 
      })
      .attr("transform", function(d) {
      return "rotate(90)translate(" + -timeScale(2028) + ")"
      + ((d.angle + this.parentNode.parentNode.__data__.circleRotation) > 360 ? "rotate(180)" : "");
      })
      .style("font-size", 12*chartScale + "px")
      .text(function(d,i) { return d.discipline; });

  //Create section behind each gender to fill with gradient
  feathers.selectAll(".gender-arc")
    .data(["Men","Women"])
    .enter().append("path")
    .attr("class", function(d) { return "gender-arc gender-" + d.toLowerCase(); })
    .style("fill", function(d) { return "url(#" + d.toLowerCase() + "-gradient)"; })
    .attr("d", genderArc);

  ////////////////////////////////////////////////////////////
  //////////////// Create inside of feathers /////////////////
  ////////////////////////////////////////////////////////////

  var editions = feathers.selectAll(".edition")
    .data(function(d) { return d.editions; })
    .enter().append("g")
    .attr("class", function(d,i) { return "edition year_" + d.edition; });

  var genders = editions.selectAll(".genders")
    .data(function(d) { return d.genders; })
    .enter().append("g")
    .attr("class", function(d,i) { return "gender " + d.gender; });

  //Finally append the paths
  var medalArcs = genders.selectAll(".medal")
      .data(function(d) { return d.continents; })
      .enter().append("path")
      .attr("class", function(d,i) { return "medal " + d.continent; })
      .style("fill", function(d) { 
        return d.continent === "Mixed" ? "url(#mixed-gradient-" + d.edition + ")" : color(d.continent); 
      })
      .attr("d", arc)
    .style("stroke-width", 2*chartScale)
      .on("mouseover", function(d) { 
      d3.event.stopPropagation();
      //Highlight the hovered over medal
      //Append it on top so it lies over all the axis lines
      d3.select(this.parentNode.parentNode.parentNode).append("path")
        .attr("class", "hover-medal")
        .attr("d", arc(d))
        .style("stroke-width", 2*chartScale)
        .style("fill", "none")
        .style("stroke", "#212121")
        //.style("stroke", arcColors[(continents.indexOf(d.continent)+1)%continents.length] )
        .style("pointer-events","none")
        .style("opacity", 0)
        .transition().duration(0)
        .style("opacity", 1);
      //Show tooltip
      pt.olympicIntro.showTooltip(d, color, "olympic-intro-tooltip"); 
    })
      .on("mouseout", function() {
      //Remove hovered over border
      d3.selectAll(".hover-medal")
        .transition().duration(100)
        .style("opacity", 0)
        .remove();
      //Hide the tooltip
      pt.olympicIntro.hideTooltip("olympic-intro-tooltip")
    });

  var olympicRecords = genders.selectAll(".record")
      .data(function(d) { return d.continents.filter(function(r) { return r.OR !== ""; }) ; })
      .enter().append("circle")
      .attr("class", function(d,i) { return "record " + d.ORtype + "-record"; })
      .style("fill", function(d) { return "white"; })
      .attr("cx", function(d) { return arc.centroid(d)[0]; })
      .attr("cy", function(d) { return arc.centroid(d)[1]; })
      .attr("r", function(d) { return dotScale(d.edition) * arcHeight/2*0.8; })
      .style("pointer-events", "none");

  ////////////////////////////////////////////////////////////
  //////////////////// Append Grid Lines /////////////////////
  ////////////////////////////////////////////////////////////

  //Create a line to split the genders
  feathers.append("line")
    .attr("class", "time-line")
    .attr("y1", -timeScale(startYear))
    .attr("y2", -timeScale(endYear) - arcHeight)
    .style("stroke-width", 2*chartScale);

  //Create small rings to siginify 20 years
  feathers.selectAll(".year-outline")
    .data(groupYears)
    .enter().append("path")
    .attr("class", "year-outline")
    .attr("d", yearArc);

  //Create war years
  feathers.selectAll(".war-arc")
    .data(warYears)
    .enter().append("path")
    .attr("class", "war-arc")
    .attr("d", warArc);

  ////////////////////////////////////////////////////////////
  ///////////////////// Start off small //////////////////////
  ////////////////////////////////////////////////////////////

  d3.select("#olympicIntro .olympic-group")
    .attr("transform", "translate(" + pt.olympicIntro.startPos[0] + "," + pt.olympicIntro.startPos[1] + ")scale(" + pt.olympicIntro.startScale + ")")
    .style("opacity", 0);
}//init

////////////////////////////////////////////////////////////
//////////////////// Small circle start ////////////////////
////////////////////////////////////////////////////////////

pt.olympicIntro.smallStart = function() {

  d3.select("#olympic-intro #olympic-image")
    .transition().duration(500)
    .style("opacity", 1);
  d3.select("#olympicIntro .olympic-group")
    .transition().duration(500)
    .attr("transform", "translate(" + pt.olympicIntro.startPos[0] + "," + pt.olympicIntro.startPos[1] + ")scale(" + pt.olympicIntro.startScale + ")")
    .style("opacity", 0);

}//smallStart

pt.olympicIntro.bigEnd = function() {

  d3.select("#olympic-intro #olympic-image")
    .transition().duration(1000)
    .style("opacity", 0);
  d3.select("#olympicIntro .olympic-group")
    .transition().duration(1000)
    .style("opacity", 1)
    .transition().duration(1500)
    .attr("transform", "translate(" + pt.olympicIntro.endPos[0] + "," + pt.olympicIntro.endPos[1] + ")scale(" + pt.olympicIntro.endScale + ")");

}//bigEnd

////////////////////////////////////////////////////////////
////////////////////// Medal tooltips //////////////////////
////////////////////////////////////////////////////////////

//Show the tooltip on hover
pt.olympicIntro.showTooltip = function(d, color, tooltipID) {
    
  //Find location of mouse on page
  var xpos =  d3.event.offsetX - 15;
  var ypos =  d3.event.offsetY - 10;

  //Rest font-style
  d3.select("#" + tooltipID + " #tooltip-country").style("font-size", null);

  //Set the title and discipline
  d3.select("#" + tooltipID + " .tooltip-event").text(d.eventName);
  d3.select("#" + tooltipID + " .tooltip-discipline").text(d.discipline);

  //Set athlete
  if(d.edition === 2016 & d.country === "" & d.athlete === "") {
    var athlete = "To be decided in the coming days";
  } else if (d.athlete === "") {
    var athlete = "";
    d3.select("#" + tooltipID + " #tooltip-country").style("font-size", "13px");
  } else {
    var athlete = d.athlete;
  }//else
  d3.select("#" + tooltipID + " #tooltip-athlete").text(athlete);

  //Set record
  if(d.OR !== "" && typeof d.OR !== "undefined") {
    if(d.ORtype === "OR") { var ORtype = "Olympic record"; }
    else if(d.ORtype === "OB") { var ORtype = "Olympic best"; }
    else if(d.ORtype === "WR") { var ORtype = "Word record"; }
    var record = ORtype + " - " + d.OR;
    d3.select("#" + tooltipID + " #tooltip-record")
      .style("display", null)
      .style("margin-bottom", athlete === "" ? null : "5px")
      .text(record);
  } else {
    d3.select("#" + tooltipID + " #tooltip-record")
      .style("display", "none");
  }//else

  //Set country
  if( d.country === "") {
    var country = "";
  } else if (d.country === "Mixed team") {
    var country = "Mixed team";
  } else {
    var country = d.country + " - " + d.continent;
  }//else
  d3.select("#" + tooltipID + " #tooltip-country")
    .style("color", color(d.continent))
    .text(country);

  //Set edition
  d3.select("#" + tooltipID + " #tooltip-edition")
    .html('<span><span style="color: ' + color(d.cityContinent) + ';">' + d.city + "</span> - " + d.edition + "</span>");

  //Set the tooltip in the right location and have it appear
  d3.select("#" + tooltipID)
    .style("top", ypos + "px")
    .style("left", xpos + "px")
    .transition().duration(0)
    .style("opacity", 1);
}//showTooltip  

//Hide the tooltip
pt.olympicIntro.hideTooltip = function(tooltipID) {    
  d3.select("#" + tooltipID)
    .transition().duration(100)
    .style("opacity", 0); 
}//hideTooltip

////////////////////////////////////////////////////////////
//////////////////// Edition tooltips //////////////////////
////////////////////////////////////////////////////////////

pt.olympicIntro.showTooltipEdition = function(d, color, tooltipID) {
    
  //Find location of mouse on page
  var xpos =  d3.event.offsetX - 10;
  var ypos =  d3.event.offsetY + 100;

  //Set the title and discipline
  d3.select("#" + tooltipID + " #tooltip-edition-edition").text(d.edition);
  
  //Set city and continent
  if(d.city === "none" && d.edition === 1916) {
    var city = "No Olympics - WW I";
    var continent = "-";
    var contColor = "#d2d2d2";
  } else if (d.city === "none") {
    var city = "No Olympics - WW II";
    var continent = "-";
    var contColor = "#d2d2d2";
  } else {
    var city = d.city;
    var continent = d.cityContinent;
    var contColor = color(continent);
  }//else

  d3.select("#" + tooltipID + " #tooltip-edition-city").text(city);
  d3.select("#" + tooltipID + " #tooltip-edition-continent")
    .style("color", contColor)
    .text(continent);

  //Set the tooltip in the right location and have it appear
  d3.select("#" + tooltipID)
    .style("top", ypos + "px")
    .style("left", xpos + "px")
    .transition().duration(0)
    .style("opacity", 1);
}//showTooltipEdition

//Hide the tooltip
pt.olympicIntro.hideTooltipEdition = function(tooltipID) {   
  d3.select("#" + tooltipID)
    .transition().duration(100)
    .style("opacity", 0); 
}//hideTooltipEdition



