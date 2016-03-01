/**
 * Created by jmartinez on 2/29/2016.
 */
var mealCategories = [
    {name:'Congregate Meals', cost:7.14},
    {name:'Home Meals', cost:6.59}
];

var scenarios = [
    {id:1, desc:"Following the Seniors allocates the OAA funding based on the proportion of Seniors living in each State. States with growing populations will experience increased funding while States with shrinking populations will lose funding in the future."},
    {id:2, desc:"The Current Senate Bill reformulates the Hold Harmless Clause. Worst case States will receive 99% of their current funding."},
    {id:3, desc:"NA"},
    {id:4, desc:"Current OAA funding creates a floor of 2006 level expenditures for States losing 60+ population."}

]


var mealSvg = d3.select("#mealContainer").append("svg")
    .attr("width", (projWidth + 125) + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var ymeal = d3.scale.linear()
    .range([height, 0]);


var yAxisMeal = d3.svg.axis()
    .scale(ymeal)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var xAxisMeal = d3.svg.axis()
    .scale(xproj)
    .orient("center");

var color_meal = d3.scale.ordinal()
    .range(["#4490AF", "#E95D22"]);

var color_legend_meal = d3.scale.ordinal()
    .range(["#4490AF", "#E95D22"]);

var buildOut = function(dataSeriesCount) {
    var currentXOffsets = [];
    var current_xIndex = 0;
    return function(d, y0, y){
        if(current_xIndex++ % dataSeriesCount === 0){
            currentXOffsets = [0, 0];
        }
        if(y >= 0) {
            d.y0 = currentXOffsets[1];
            d.y = y;
            currentXOffsets[1] += y;
        } else {
            d.y0 = currentXOffsets[0] + y;
            d.y = -y;
            currentXOffsets[0] += y;
        }
    }
};


function drawMealChart(stateId, scenarioId){
    d3.csv("oaaprojections_diff.csv", function(error, data){
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

        var layers = d3.layout.stack().out(buildOut(2))(mealCategories.map(function(c){
            return selectedData.map(function(d){
                return {x: d.Year, y: parseInt(d[c.name] / c.cost), category: c, scenario: d.scenario};
            });
        }));

        mealSvg.append("text")
            .attr("class", "barChartTitle")
            .attr("x", (projWidth / 2))
            .attr("y", 10)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text(function(d){
                return(selectedData[0].State + ": Change in Meals from 2015")
            });


        xproj.domain(layers[0].map(function(d){return d.x}));
        ymeal.domain([-400000, 625000]);

        var layer = mealSvg.selectAll(".layer")
            .data(layers)
            .enter()
            .append("g")
            .attr("class", "layer")
            .style("fill", function(d,i){return color_meal(i)});

        layer.selectAll("rect")
            .data(function(d){return d;})
            .enter()
            .append("rect")
            .attr("x", function(d){return xproj(d.x);})
            .attr("y", function(d){return ymeal(d.y + d.y0);})
            .attr("height", function(d){return ymeal(d.y0) - ymeal(d.y + d.y0)})
            .attr("width", xproj.rangeBand() - 1)
            .on("mouseover", function(d){
                d3.select(this).classed("hoverBar", true)
            }).on("mouseout", function(d){
                d3.select(this).classed("hoverBar", false);
            }).append("title")
            .attr("class", "grpTitle")
            .text(function(d){return d.category.name + ": " + d.y;});


        mealSvg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxisMeal);

        mealSvg.append("g")
            .attr("class", "y axis")
            .call(yAxisMeal)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor","end")
            .text("# of Meals Served");

        var legend = mealSvg.selectAll(".legend")
            .data(mealCategories.map(function(x){return x.name;}))
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", projWidth + 130)
            .attr("y", 91)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color_legend_meal);

        legend.append("text")
            .attr("x", projWidth + 124)
            .attr("y", 100)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });



    });

    var description = d3.select('#descriptionContainer');
    description.selectAll(".desc")
        .data(scenarios)
        .enter()
        .append("h3")
        .attr("class", "desc")
        .text(function(d){
            if(d.id == scenarioId){
                return d.desc;
            }
        }).style("text-align","center")

}

function updateMealChart(stateId, scenarioId){
    d3.csv("oaaprojections_diff.csv", function(error, data){
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

        var layers = d3.layout.stack().out(buildOut(2))(mealCategories.map(function(c){
            return selectedData.map(function(d){
                return {x: d.Year, y: parseInt(d[c.name] / c.cost), category: c, scenario: d.scenario};
            });
        }));

        mealSvg.select(".barChartTitle")
            .text(function(d){
                return(selectedData[0].State + ": Change in Meals from 2015")
            });
        //
        xproj.domain(layers[0].map(function(d){return d.x}));
        ymeal.domain([-400000, 625000]);

        var layer = mealSvg.selectAll(".layer")
            .data(layers);

        layer.selectAll("rect")
            .data(function(d){return d;})
            .transition()
            .duration(500)
            .attr("x", function(d){return xproj(d.x);})
            .attr("y", function(d){return ymeal(d.y + d.y0);})
            .attr("height", function(d){return ymeal(d.y0) - ymeal(d.y + d.y0)})
            .attr("width", xproj.rangeBand() - 1)
            .select("title").text(function(d){return d.category.name + ": " + d.y;});



    });

    d3.selectAll(".desc")
        .text(function(d){
            if(d.id == scenarioId){
                return d.desc;
            }
        })
}

drawMealChart(state, scenario);