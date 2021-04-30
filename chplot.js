!(function (d3) {
$("acontent").empty();

// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;
//default 1200 x 540

// Parse the date / time
var parseDate = d3.time.format("%d-%m-%Y %H:%M:%S").parse;

// Format comma
var formatDecimal = d3.format(".2f");

// Format date
var datedis = d3.time.format("%d-%m-%Y %H:%M:%S");

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.tanggal); })
    .y(function(d) { return y(d.gcharea); });
    
// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");
	
function make_x_axis() {        
    return d3.svg.axis()
        .scale(x)
         .orient("bottom")
         .ticks(15)
}

function make_y_axis() {        
    return d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10)
}

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Get the data
d3.csv("GCHarea.csv", function(error, data) {
    data.forEach(function(d) {
        d.tanggal = parseDate(d.tanggal);
        d.totcharea = +d.totcharea;
        d.gcharea = +d.gcharea;
        d.eta = +d.eta;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.tanggal; }));
    y.domain([0, d3.max(data, function(d) { return d.gcharea; })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));
    
    // Add the scatter plot
    svg.selectAll("dot")    
        .data(data)         
        .enter().append("circle")
        //.style("fill",color(grey))                               
        .attr("r", 2)       
        .attr("cx", function(d) { return x(d.tanggal); })       
        .attr("cy", function(d) { return y(d.gcharea); })     
        .on("mouseover", function(d) {
            tooltip.transition()
               .duration(200)
               .style("opacity", .9);
            tooltip.html("Datetime: " + datedis(d.tanggal) + " UT" + "<br/> Total CH Area: " + d.totcharea + "%" + "<br/> Geoeffective CH Area: " + d.gcharea + "%" + "<br/> Predicted Geomagnetic Scale Activities: " + d["scale"] + "<br/> ETA: " + formatDecimal(d.eta/24) + " days") 
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
               .duration(500)
               .style("opacity", 0);
        });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Date (UT)");

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Coronal Hole Area (%)");
	
	//Add gridlines
	svg.append("g")         
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .style("stroke-dasharray",("1,1"))
        .call(make_x_axis()
            .tickSize(-height, 0, 0)
            .tickFormat("")
        )

    svg.append("g")         
        .attr("class", "grid")
        .style("stroke-dasharray",("1,1"))
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        )

});
})(d3);