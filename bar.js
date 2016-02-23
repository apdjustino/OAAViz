/**
 * Created by jmartinez on 2/22/2016.
 */

var barWidth = 375;

var xbar = d3.scale.ordinal()
    .rangeRoundBands([0, barWidth]);

var categories = ['Congregate Meals','Home Meals','NFCSP','Supportive Services', 'Preventive Services'];

var ybar = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);

var xAxisBar = d3.svg.axis()
    .scale(xbar)
    .orient("bottom");

var yAxisBar = d3.svg.axis()
    .scale(ybar)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var barSvg = d3.select("#pieContainer").append("svg")
    .attr("width", (barWidth + 125) + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


function drawBarChart(stateId){
    d3.csv("oaadata.csv", function(error, data){
        var nest = d3.nest()
            .key(function(d){return d.id;})
            .entries(data);

        var selectedData = _.find(nest, function(x){return x.key == stateId});
        var layers = d3.layout.stack()(categories.map(function(c){
            return selectedData.values.map(function(d){
                return {x: d.Year, y: parseInt(d[c])};
            });
        }));

        xbar.domain(layers[0].map(function(d){return d.x}));
        ybar.domain([0, 125000000]);

        var layer = barSvg.selectAll(".layer")
            .data(layers)
            .enter()
            .append("g")
            .attr("class", "layer")
            .style("fill", function(d,i){return color(i)});

        layer.selectAll("rect")
            .data(function(d){return d;})
            .enter()
            .append("rect")
            .attr("x", function(d){return xbar(d.x);})
            .attr("y", function(d){return ybar(d.y + d.y0);})
            .attr("height", function(d){return ybar(d.y0) - ybar(d.y + d.y0)})
            .attr("width", xbar.rangeBand() - 1);

        barSvg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxisBar);

        barSvg.append("g")
            .attr("class", "y axis")
            .call(yAxisBar);

        var legend = barSvg.selectAll(".legend")
            .data(categories)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", barWidth + 100)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", barWidth + 94)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

    });
}

function updateBarChart(stateId){
    d3.csv("oaadata.csv", function(error, data){
        var nest = d3.nest()
            .key(function(d){return d.id;})
            .entries(data);

        var selectedData = _.find(nest, function(x){return x.key == stateId});
        var layers = d3.layout.stack()(categories.map(function(c){
            return selectedData.values.map(function(d){
                return {x: d.Year, y: parseInt(d[c])};
            });
        }));
        //
        xbar.domain(layers[0].map(function(d){return d.x}));
        ybar.domain([0, 125000000]);

        var layer = barSvg.selectAll(".layer")
            .data(layers);

        layer.selectAll("rect")
            .data(function(d){return d;})
            .transition()
            .duration(500)
            .attr("x", function(d){return xbar(d.x);})
            .attr("y", function(d){return ybar(d.y + d.y0);})
            .attr("height", function(d){return ybar(d.y0) - ybar(d.y + d.y0)})
            .attr("width", xbar.rangeBand() - 1);


    });
}

drawBarChart(8);