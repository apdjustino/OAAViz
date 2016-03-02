/**
 * Created by jmartinez on 2/19/2016.
 */
var margin = {top: 20, right: 20, bottom: 30, left: 80};
var lineWidth = 800 - margin.left - margin.right;
var lineHeight = 450 - margin.top - margin.bottom;



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
    .y(function(d) { return y(d.values[0]['pop60']); });


var oaaProjLine = d3.svg.line()
    .x(function(d){return x(d.Year)})
    .y(function(d){return y(d["Total Title III"])});

var popProjLine = d3.svg.line()
    .x(function(d){return x(d.Year)})
    .y(function(d){return y(d["pop60"])});




var fundingLine = d3.svg.line()
    .x(function(d){return x(d.key)})
    .y(function(d){return y(d.values[0]['Total Title III'])});

var lineSvg = d3.select("#lineContainer").append("svg")
    .attr("width", lineWidth + margin.left + margin.right)
    .attr("height", lineHeight + margin.top + margin.bottom)
    .append("g")
    .attr("class","lineSvgGrp")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



function drawLineChart(stateId){

    d3.csv("oaadata_pct.csv", function(error, data){
        var nest = d3.nest()
            .key(function(d){return d.id})
            .key(function(d){return d.Year})
            .entries(data);



        var dataToDraw = _.find(nest, function(x){return x.key == stateId});
        x.domain([2007, 2019]);
        //x.domain([d3.time.format("%d-%b-%y").parse('01-Jan-04'), d3.time.format("%d-%b-%y").parse('01-Jan-14')]);
        y.domain([0, 1]);

        lineSvg.append("text")
            .attr("class", "lineChartTitle")
            .attr("x", (lineWidth / 2))
            .attr("y", 10)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text(function(d){
                return "Percent Change from 2006: Funding & Seniors 60+"
            });

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
            .text("Percent Change from 2006 Levels");

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
            .attr("cy", function(d){return y(d.values[0]['pop60']);})
            .attr("r", 5)
            .attr("class", function(d){ return "circle" + d.key + " circlePop"})
            .style("fill", "steelblue")
            .on("mouseover", function(d){d3.select(this).classed("mouseOverCircle",true)})
            .on("mouseout", function(d){d3.select(this).classed("mouseOverCircle",false)})
            .on("click", function(d){updatePieChart(d.values[0].id, d.key)})
            .append("title")
            .text(function(d){return yFormat(d.values[0]['pop60']);});

        lineSvg.selectAll(".circleFunding")
            .data(dataToDraw.values)
            .enter()
            .append("circle")
            .attr("cx", function(d){return x(d.key);})
            .attr("cy", function(d){return y(d.values[0]['Total Title III']);})
            .attr("r", 5)
            .attr("class", function(d){ return "circle" + d.key + " circleFunding"})
            .style("fill", "chocolate")
            .on("mouseover", function(d){d3.select(this).classed("mouseOverCircle",true)})
            .on("mouseout", function(d){d3.select(this).classed("mouseOverCircle",false)})
            .on("click", function(d){updatePieChart(d.values[0].id, d.key)})
            .append("title")
            .text(function(d){console.log(d); return yFormat(d.values[0]['Total Title III']);});

        var legend = lineSvg.append("g")
            .attr("transform", "translate(150,410)");

        legend.append("line")
            .style("stroke", "steelblue")
            .style("stroke-width", "4.5px")
            .attr("x1",0)
            .attr("y1",0)
            .attr("x2",30)
            .attr("y2",0);

        legend.append("text")
            .text("OAA Funding")
            .attr("x", 35)
            .attr("y", 5);

        var fundingLegend = lineSvg.append("g")
            .attr("transform", "translate(350, 410)");

        fundingLegend.append("line")
            .style("stroke", "chocolate")
            .style("stroke-width", "4.5px")
            .attr("x1",0)
            .attr("y1",0)
            .attr("x2",30)
            .attr("y2",0);

        fundingLegend.append("text")
            .text("60+ Population")
            .attr("x", 35)
            .attr("y", 5)

    });


}


function drawProjLine(stateId, scenarioId){

    d3.csv('oaaprojections_pct.csv', function(error,data){
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

        var svg = d3.select(".lineSvgGrp");

        svg.append("path")
            .datum(selectedData)
            .attr("class", "oaaProjLine")
            .attr("d", oaaProjLine);

        svg.append("path")
            .datum(selectedData)
            .attr("class", "oaaPopLine")
            .attr("d", popProjLine);

        lineSvg.selectAll(".circleFundingProj")
            .data(selectedData)
            .enter()
            .append("circle")
            .attr("cx", function(d){return x(d.Year);})
            .attr("cy", function(d){return y(d['Total Title III']);})
            .attr("r", 5)
            .attr("class", function(d){ return "circle" + d.Year + " circleFundingProj"})
            .style("fill", "steelblue")
            .on("mouseover", function(d){d3.select(this).classed("mouseOverCircle",true)})
            .on("mouseout", function(d){d3.select(this).classed("mouseOverCircle",false)})
            .append("title")
            .text(function(d){console.log(d); return yFormat(d['Total Title III']);});

        lineSvg.selectAll(".circlePopProj")
            .data(selectedData)
            .enter()
            .append("circle")
            .attr("cx", function(d){return x(d.Year);})
            .attr("cy", function(d){return y(d['pop60']);})
            .attr("r", 5)
            .attr("class", function(d){ return "circle" + d.Year + " circlePopProj"})
            .style("fill", "chocolate")
            .on("mouseover", function(d){d3.select(this).classed("mouseOverCircle",true)})
            .on("mouseout", function(d){d3.select(this).classed("mouseOverCircle",false)})
            .append("title")
            .text(function(d){console.log(d); return yFormat(d['pop60']);});


    });


}

function updateProjLine(stateId, scenarioId){

    d3.csv('oaaprojections_pct.csv', function(error,data){
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

        var oaaFundingProj = d3.selectAll('.oaaProjLine')
            .datum(selectedData);

        var oaaPopProj = d3.selectAll('.oaaPopLine')
            .datum(selectedData);

        var oaaFundingCir = d3.selectAll('.circleFundingProj')
            .data(selectedData)
            .transition()
            .duration(500)
            .attr("cy", function(d){return y(d['Total Title III']);})
            .text(function(d){console.log(d); return yFormat(d['Total Title III']);});

        var oaaPopCir = d3.selectAll('.circlePopProj')
            .data(selectedData)
            .transition()
            .duration(500)
            .attr("cy", function(d){return y(d['pop60']);})
            .text(function(d){console.log(d); return yFormat(d['pop60']);});


        oaaFundingProj.transition().duration(500).attr("d", oaaProjLine);
        oaaPopProj.transition().duration(500).attr("d", popProjLine);



    });
}

function updateLineChart(stateId){
    d3.csv("oaadata_pct.csv", function(error, data){
        var nest = d3.nest()
            .key(function(d){return d.id})
            .key(function(d){return d.Year})
            .entries(data);



        var dataToDraw = _.find(nest, function(x){return x.key == stateId});
        x.domain([2007, 2019]);
        //x.domain([d3.time.format("%d-%b-%y").parse('01-Jan-04'), d3.time.format("%d-%b-%y").parse('01-Jan-14')]);
        y.domain([0, 1]);

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
            .attr("cy", function(d){return y(d.values[0]['pop60']);})
            .select("title").text(function(d){return yFormat(d.values[0]['pop60']);});

        transition.selectAll(".circleFunding")
            .data(dataToDraw.values)
            .transition()
            .duration(500)
            .attr("cy", function(d){return y(d.values[0]['Total Title III']);})
            .select("title").text(function(d){return yFormat(d.values[0]['Total Title III']);});





    });
}