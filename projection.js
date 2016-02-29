/**
 * Created by jmartinez on 2/26/2016.
 */
var projWidth = 772;

var xproj = d3.scale.ordinal()
    .rangeRoundBands([0, projWidth], 0.7);

var categories = ['Congregate Meals','Home Meals','NFCSP','Supportive Services', 'Preventive Services'];

var yproj = d3.scale.linear()
    .rangeRound([height, 0]);

var color_proj = d3.scale.ordinal()
    .range(["#4490AF", "#E95D22", "#739B4E", "#9E61B0", "#A22E3B"]);

var xAxisProj = d3.svg.axis()
    .scale(xproj)
    .orient("bottom");

var yAxisProj = d3.svg.axis()
    .scale(yproj)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var projSvg = d3.select("#projContainer").append("svg")
    .attr("width", (projWidth + 125) + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var currencyFormat = d3.format('$,');

function drawProjChart(stateId, scenarioId){

    d3.csv("oaaprojections.csv", function(error, data){
        var nest = d3.nest()
            .key(function(d){return d.id;})
            .entries(data);

        var selectedState = _.find(nest, function(x){return x.key == stateId});
        var selectedData = [];
        selectedState.values.forEach(function(cv){
            if(cv.scenarioId == scenarioId){
                selectedData.push(cv);
            }
        });
        //var selectedData = _.find(selectedState, function(x){return })

        var layers = d3.layout.stack()(categories.map(function(c){
            return selectedData.map(function(d){
                return {x: d.Year, y: parseInt(d[c]), category: c};
            });
        }));

        projSvg.append("text")
            .attr("class", "barChartTitle")
            .attr("x", (projWidth / 2))
            .attr("y", 10)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text(function(d){
                return(selectedData[0].State + " OAA Funding 2006-2014")
            });


        xproj.domain(layers[0].map(function(d){return d.x}));
        yproj.domain([0, 125000000]);

        var layer = projSvg.selectAll(".layer")
            .data(layers)
            .enter()
            .append("g")
            .attr("class", "layer")
            .style("fill", function(d,i){return color_proj(i)});

        layer.selectAll("rect")
            .data(function(d){return d;})
            .enter()
            .append("rect")
            .attr("x", function(d){return xproj(d.x);})
            .attr("y", function(d){return yproj(d.y + d.y0);})
            .attr("height", function(d){return yproj(d.y0) - yproj(d.y + d.y0)})
            .attr("width", xproj.rangeBand() - 1)
            .on("mouseover", function(d){
                d3.select(this).classed("hoverBar", true)
            }).on("mouseout", function(d){
                d3.select(this).classed("hoverBar", false);
            }).append("title")
            .attr("class", "grpTitle")
            .text(function(d){return d.category + ": " + currencyFormat(d.y);});


        projSvg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxisProj);

        projSvg.append("g")
            .attr("class", "y axis")
            .call(yAxisProj);

        var legend = projSvg.selectAll(".legend")
            .data(categories)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", projWidth + 130)
            .attr("y", 91)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color_proj);

        legend.append("text")
            .attr("x", projWidth + 124)
            .attr("y", 100)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

    });
}

function updateProjChart(stateId){
    d3.csv("oaaprojections.csv", function(error, data){
        var nest = d3.nest()
            .key(function(d){return d.id;})
            .entries(data);

        var selectedData = _.find(nest, function(x){return x.key == stateId});
        var layers = d3.layout.stack()(categories.map(function(c){
            return selectedData.map(function(d){
                return {x: d.Year, y: parseInt(d[c]), category: c};
            });
        }));

        projSvg.select(".barChartTitle")
            .text(function(d){
                return(selectedData[0].State + " OAA Funding 2006-2014")
            });
        //
        xproj.domain(layers[0].map(function(d){return d.x}));
        yproj.domain([0, 125000000]);

        var layer = projSvg.selectAll(".layer")
            .data(layers);

        layer.selectAll("rect")
            .data(function(d){return d;})
            .transition()
            .duration(500)
            .attr("x", function(d){return xproj(d.x);})
            .attr("y", function(d){return yproj(d.y + d.y0);})
            .attr("height", function(d){return yproj(d.y0) - yproj(d.y + d.y0)})
            .attr("width", xproj.rangeBand() - 1)
            .select("title").text(function(d){return d.category + ": " + currencyFormat(d.y);});



    });
}

drawProjChart(8, "1");