//Width and height
var width = 500;
var height = 300;
//Create SVG element
var vis = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

d3.json('https://data.sfgov.org/api/geospatial/iacs-ws63?method=export&format=GeoJSON', function(json) {
// create a first guess for the projection
  var center = d3.geo.centroid(json);
  var scale = 150;
  var offset = [width / 2, height / 2];
  var projection = d3.geo.mercator().scale(scale).center(center)
  .translate(offset);

  // create the path
  var path = d3.geo.path().projection(projection);

  // using the path determine the bounds of the current map and use 
  // these to determine better values for the scale and translation
  var bounds = path.bounds(json);
  var hscale = scale * width / (bounds[1][0] - bounds[0][0]);
  var vscale = scale * height / (bounds[1][1] - bounds[0][1]);
  var scale = (hscale < vscale) ? hscale : vscale;
  var offset = [width - (bounds[0][0] + bounds[1][0]) / 2,
                height - (bounds[0][1] + bounds[1][1]) / 2];
  offset = [250, 0];  //overwrite offset with new optimized value
  var m0, o0;

  console.log('center:' + center + ' optimal scale:' + scale + ' optimal offset:' + offset);

  // new projection
  projection = d3.geo.mercator()
              .center(center)
              .scale(scale)
              .translate([250, 0]);

  path = path.projection(projection);

  // add a rectangle to see the bound of the svg
  vis.append('rect')
    .attr('width', width)
    .attr('height', height)
    .style('stroke', 'black')
    .style('fill', 'none');

  vis.selectAll('.neighborhood')
    .data(json.features)
    .enter()
    .append('path')
    .attr('d', path)
    //.attr('class', function(d) { return 'neighborhood ' + d.id; })

    // create the outline of each neighborhood
    .style('stroke-width', '1')
    .style('stroke', 'black')

    // make them different colors
    .each(function (d, index) {
      var neighborhood = d3.select(this);
      var colors = ['#ddc', '#cdd', '#cdc', '#dcd', '#ffd699'];
      neighborhood.style('fill', colors[(index % 5)]);
      // console.log(d.properties.neighborho);
      // if (d.properties.neighborho === 'North Beach') 5
      //   myPath.style('fill', colors[2]);
      // } else {
      //   myPath.style('fill', colors[0]);
      // }
    });


  vis.selectAll('.name-label')
    .data(json.features)
    .enter().append('text')
    .attr('class', function(d) { return 'name-label ' + d.properties.neighborho; })
    .attr('transform', function(d) { return 'translate(' + path.centroid(d) + ')'; })
    //.attr('dy', '.35em')
    .text(function(d) { return d.properties.neighborho; });

  
    // .subunit.SCT { fill: #ddc; }
    // .subunit.WLS { fill: #cdd; }
    // .subunit.NIR { fill: #cdc; }
    // .subunit.ENG { fill: #dcd; }
    // .subunit.IRL { display: none; }

  // make map draggable
  var drag = d3.behavior.drag()  
     .on('dragstart', function() {
       m0 = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY];
     })
     .on('drag', function() {
       if (m0) {
         var m1 = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY];
         projection.translate([m1[0] - m0[0] + offset[0], m1[1] - m0[1] + offset[1]]);
         
         vis.selectAll('path')       // re-project path data
         .attr('d', path);
       }
     })
     .on('dragend', function() {
       offset = projection.translate();
     });
     
  vis.call(drag);
});