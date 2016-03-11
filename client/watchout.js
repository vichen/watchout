// start slingin' some d3 here.

var gameVars = {
  svgContainer: null,
  width: 700,
  height: 450,
  enemyR: 30,
};

var initGame = function(myGameVars) {
  if (myGameVars && !myGameVars.svgContainer) {
    myGameVars.svgContainer = d3.select('body').append('svg').attr('width', gameVars.width).attr('height', gameVars.height);
    myGameVars.svgContainer.append('rect').attr('x', 0).attr('y', 0).attr('width', gameVars.width).attr('height', gameVars.height).attr('stroke', 'black').attr('fill', 'none').attr('stroke-width', 'black');
    myGameVars.svgContainer.append('defs').attr('id', 'imgdefs').append('pattern').attr('id', 'astroidPattern')
                        .attr('height', 1)
                        .attr('width', 1)
                        .attr('x', "0")
                        .attr('y', "0")
                        .append("image")
     .attr("x", -130)
     .attr("y", -220)
     .attr("height", 640)
     .attr("width", 480)
     .attr("xlink:href", 'asteroid.png');
  }
};

var addEnemy = function(myGameVars, num) {
  if (!num) {
    num = 1;
  }
  for (var i = 0; i < num; i++) {
    var newX = Math.random() * (myGameVars.width - (myGameVars.enemyR * 2)) + myGameVars.enemyR;
    var newY = Math.random() * (myGameVars.height - (myGameVars.enemyR * 2)) + myGameVars.enemyR;
    myGameVars.svgContainer.append('circle').attr('cx', newX).attr('cy', newY).attr('r', myGameVars.enemyR).attr('fill', "url(#asteroidPattern)");
  }
};
initGame(gameVars);
addEnemy(gameVars, 10);
