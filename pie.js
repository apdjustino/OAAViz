/**
 * Created by jmartinez on 2/22/2016.
 */
var radius = Math.min(width, height) / 2;

var percentFormat = d3.format(".1%");

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var labelArc = d3.svg.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.value; });

var pieSvg = d3.select("#pieContainer").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


function drawPieChart(stateId, year){
    d3.csv("oaadata.csv", function(error, data) {
        var nest = d3.nest()
            .key(function(d){return d.id})
            .key(function(d){return d.Year})
            .entries(data);


        var dataByState = _.find(nest, function(x){return (x.key == stateId)});
        var dataByYear = _.find(dataByState.values, function(x){return x.key == year.toString()});

        //now we have to transform data into an array of objects like {name:xxx, value:xxx}
        //only add data in the five categories
        var categories = ['Congregate Meals','Home Meals','NFCSP','Supportive Services', 'Preventive Services'];
        var valueObj = dataByYear.values[0];
        var dataArr = [];
        for(var prop in valueObj){
            if(valueObj.hasOwnProperty(prop)){
                if(_.indexOf(categories, prop) >= 0){
                    dataArr.push({name: prop, value: valueObj[prop]});
                }
            }
        }

        //now calculate percentage of values
        var total = valueObj["Total Title III"];
        dataArr.forEach(function(cv){
            cv["pct"] = cv.value / total;
        });

        var g = pieSvg.selectAll(".arc")
            .data(pie(dataArr))
            .enter()
            .append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d){return color(d.data.name);});

        g.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function(d) { return d.data.name + ' ' + percentFormat(d.data.pct); });


    });


}

function updatePieChart(stateId, year){
    d3.csv("oaadata.csv", function(error, data) {
        var nest = d3.nest()
            .key(function(d){return d.id})
            .key(function(d){return d.Year})
            .entries(data);


        var dataByState = _.find(nest, function(x){return (x.key == stateId)});
        var dataByYear = _.find(dataByState.values, function(x){return x.key == year.toString()});

        //now we have to transform data into an array of objects like {name:xxx, value:xxx}
        //only add data in the five categories
        var categories = ['Congregate Meals','Home Meals','NFCSP','Supportive Services', 'Preventive Services'];
        var valueObj = dataByYear.values[0];
        var dataArr = [];
        for(var prop in valueObj){
            if(valueObj.hasOwnProperty(prop)){
                if(_.indexOf(categories, prop) >= 0){
                    dataArr.push({name: prop, value: valueObj[prop]});
                }
            }
        }

        //now calculate percentage of values
        var total = valueObj["Total Title III"];
        dataArr.forEach(function(cv){
            cv["pct"] = cv.value / total;
        });

        var transition = d3.select("#pieContainer");

        transition.selectAll("path")
            .data(pie(dataArr))
            .transition()
            .duration(500)
            .attr("d", arc)
            .style("fill", function(d){return color(d.data.name);})
            .text(function(d) { return d.data.name + ' ' + percentFormat(d.data.pct); });


    });
}

drawPieChart(8, 2008);