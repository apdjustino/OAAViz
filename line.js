/**
 * Created by jmartinez on 2/19/2016.
 */
var margin = {top: 20, right: 20, bottom: 30, left: 80};
var lineWidth = 800 - margin.left - margin.right;
var lineHeight = 700 - margin.top - margin.bottom;



var x = d3.scale.linear()
    .range([0, width]);

var format = d3.format("04d");
var yFormat = d3.format(".1%");

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(format);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(yFormat);

var line = d3.svg.line()
    .x(function(d) { return x(d.key); })
    .y(function(d) { return y(d.values[0]['pct_chng_pop60']); });

var fundingLine = d3.svg.line()
    .x(function(d){return x(d.key)})
    .y(function(d){return y(d.values[0]['pct_chng_title3'])});

var lineSvg = d3.select("#lineContainer").append("svg")
    .attr("width", lineWidth + margin.left + margin.right)
    .attr("height", lineHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



function drawLineChart(stateId){

    d3.csv("oaadata.csv", function(error, data){
        var nest = d3.nest()
            .key(function(d){return d.id})
            .key(function(d){return d.Year})
            .entries(data);



        var dataToDraw = _.find(nest, function(x){return x.key == stateId});
        x.domain(d3.extent(dataToDraw.values, function(d){return d.key}));
        //x.domain([d3.time.format("%d-%b-%y").parse('01-Jan-04'), d3.time.format("%d-%b-%y").parse('01-Jan-14')]);
        y.domain([-0.10, 0.15]);

        lineSvg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        lineSvg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Percent Change");

        lineSvg.append("path")
            .datum(dataToDraw.values)
            .attr("class", "line")
            .attr("d", line);

        lineSvg.append("path")
            .datum(dataToDraw.values)
            .attr("class", "fundingLine")
            .attr("d", fundingLine);

        lineSvg.selectAll(".circlePop")
            .data(dataToDraw.values)
            .enter()
            .append("circle")
            .attr("cx", function(d){return x(d.key);})
            .attr("cy", function(d){return y(d.values[0]['pct_chng_pop60']);})
            .attr("r", 5)
            .attr("class", function(d){ return "circle" + d.key + " circlePop"})
            .style("fill", "steelblue")
            .on("mouseover", function(d){d3.select(this).classed("mouseOverCircle",true)})
            .on("mouseout", function(d){d3.select(this).classed("mouseOverCircle",false)})
            .on("click", function(d){updatePieChart(d.values[0].id, d.key)});

        lineSvg.selectAll(".circleFunding")
            .data(dataToDraw.values)
            .enter()
            .append("circle")
            .attr("cx", function(d){return x(d.key);})
            .attr("cy", function(d){return y(d.values[0]['pct_chng_title3']);})
            .attr("r", 5)
            .attr("class", function(d){ return "circle" + d.key + " circleFunding"})
            .style("fill", "red")
            .on("mouseover", function(d){d3.select(this).classed("mouseOverCircle",true)})
            .on("mouseout", function(d){d3.select(this).classed("mouseOverCircle",false)})
            .on("click", function(d){updatePieChart(d.values[0].id, d.key)});

    });

}

function updateLineChart(stateId){
    d3.csv("oaadata.csv", function(error, data){
        var nest = d3.nest()
            .key(function(d){return d.id})
            .key(function(d){return d.Year})
            .entries(data);



        var dataToDraw = _.find(nest, function(x){return x.key == stateId});
        x.domain(d3.extent(dataToDraw.values, function(d){return d.key}));
        //x.domain([d3.time.format("%d-%b-%y").parse('01-Jan-04'), d3.time.format("%d-%b-%y").parse('01-Jan-14')]);
        y.domain([-0.10, 0.15]);

        var transition = d3.select('#lineContainer')
            .data(dataToDraw.values);

        transition.select(".line")
            .transition()
            .duration(500)
            .attr("d", line(dataToDraw.values));

        transition.select('.y.axis')
            .transition()
            .duration(500)
            .call(yAxis);

        transition.select(".fundingLine")
            .transition()
            .duration(500)
            .attr("d", fundingLine(dataToDraw.values));

        transition.selectAll(".circlePop")
            .data(dataToDraw.values)
            .transition()
            .duration(500)
            .attr("cy", function(d){return y(d.values[0]['pct_chng_pop60']);});

        transition.selectAll(".circleFunding")
            .data(dataToDraw.values)
            .transition()
            .duration(500)
            .attr("cy", function(d){return y(d.values[0]['pct_chng_title3']);})





    });
}