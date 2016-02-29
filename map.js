/**
 * Created by jmartinez on 2/19/2016.
 */

var state = "8";

var width = 672,
    height = 360,
    selected;

var projection = d3.geo.albersUsa()
    .scale(800)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#mapContainer").append("svg")
    .attr("width", width)
    .attr("height", height);


var g = svg.append("g");

d3.json("us.json", function(error, us) {
    if (error) throw error;

    g.append("g")
        .attr("id", "states")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr("class", "state")
        .attr("id", function(d){return "id_" + d.id;})
        .attr("d", path)
        .on("click", function(d){
            var thisElement = this;
            d3.selectAll(".state").classed("selected", function(d){
                return (this === thisElement) ? true : false;
            });
            state = d.id;
            updateLineChart(d.id);
            //updatePieChart(d.id, 2013);
            updateBarChart(d.id);

            updateProjChart(d.id, scenario);
        });


    g.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("id", "state-borders")
        .attr("d", path);



    drawLineChart(state);
});




