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

function drawMap(stateId){
    d3.json("us.json", function(error, us) {
        if (error) throw error;

        g.append("g")
            .attr("id", "states")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .enter().append("path")
            .attr("class", "state")
            .attr("class", function(d){
                if(d.id == stateId){
                    return "state selected"
                }else{
                    return "state"
                }
            })
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

                updateMealChart(d.id, scenario);
            });


        g.append("path")
            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("id", "state-borders")
            .attr("d", path);



        drawLineChart(state);
    });
}

function updateMap(scenarioId){
    d3.csv('oaaprojections_diff.csv', function(error, data){
        if(error) throw error;

        var nest = d3.nest()
            .key(function(d){return d.id;})
            .entries(data);

        var states = d3.selectAll(".state");
        states.style("fill", function(d){
            var selectedState = _.find(nest, function(x){return x.key == d.id});
            var selectedYear = [];
            var selectedData = [];

            if(selectedState == undefined){
                return;
            }
            selectedState.values.forEach(function(cv){
                if(cv.Year == 2019){
                    selectedYear.push(cv);
                }
            });

            selectedYear.forEach(function(cv){
                if(cv.scenarioId == scenarioId){
                    selectedData.push(cv);
                }
            });

            var output = "";
            var title3 = parseInt(selectedData[0]["Total Title III"]);

            if(title3 < 0){
                output = "red";
            }
            if(title3 ==0){
                output = "yellow";
            }
            if(title3 > 0){
                output = "green";
            }
            return output;

        });

    })
}

drawMap(state);






