var svgWidth = 1000;
var svgHeight = 650;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("/infections.csv").then(function(Data) {
  //console.log(Data.columns.slice(1));
    // number conversion

    var cols = Data.columns.slice(1);
    console.log(cols);
    Data.forEach(function(xdata) {
      // console.log(xdata);
        xdata["1/22/2020"] = +xdata["1/22/2020"];
        xdata.Combined_Key = +xdata.Combined_Key;

    });

    // x function
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(Data, d=>d["1/22/2020"])*0.9,
            d3.max(Data, d => d["1/22/2020"])*1.1])
        .range([0, width]);        

    // y function
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(Data, d => d.Combined_Key)*1.1])
        .range([height, 0]);

    // set bottom/left axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // x axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .style("font-size", "12px")
        .call(bottomAxis);

    // y axis
    chartGroup.append("g")
        .style("font-size", "12px")
        .call(leftAxis);

    // function for circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(Data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.Jan22))
        .attr("cy", d => yLinearScale(d.Combined_Key))
        .attr("r", 10)
        .attr("fill", "lightblue")
        .attr("opacity", ".99");

    // add State abbrev to circles
    chartGroup.selectAll("text.my-text")
        .data(Data)
        .enter()
        .append("text")
        .classed("my-text",true)
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.Jan22))
        .attr("y", d => yLinearScale(d.Combined_Key))
        .attr("dy",5)
        .attr("text-anchor","middle")
        .attr("font-size","12px")
        .attr("fill", "white");

    // y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 30 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("aText", true)
        .text("# of Cases");

    // x axis
    chartGroup.append("text")
        .attr("y", height + margin.bottom/2 - 10)
        .attr("x", width / 2)
        .attr("dy", "1em")
        .classed("aText", true)
        .text("Date");

    

});