// start slingin' some d3 here.

var gameVars = {
  svgContainer: null,
  width: 700,
  height: 450,
  enemyR: 30,
  numEnemies: 0
};

var initGame = function(myGameVars) {
  if (myGameVars && !myGameVars.svgContainer) {

    myGameVars.svgContainer = 
      d3.select('body')
      .append('svg')
      .attr('width', gameVars.width)
      .attr('height', gameVars.height);

    myGameVars.svgContainer
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', gameVars.width)
      .attr('height', gameVars.height)
      .attr('stroke', 'black')
      .attr('fill', 'none')
      .attr('stroke-width', 'black');

    myGameVars.svgContainer
      .append('svg:pattern')
      .attr('id', 'asteroidPattern')
      .attr('width', 1)
      .attr('height', 1)
      .attr('patternUnits', 'objectBoundingBox')
      .append('svg:image')
      .attr('xlink:href', 'asteroid.png')
      .attr('width', 60)
      .attr('height', 60)
      .attr('x', 0)
      .attr('y', 0);
  }
};

var tick = function(pt) {
  var player = d3.select('body').selectAll('#playerCircle');
  
  player.attr('cx', pt[0])
        .attr('cy', pt[1]);
};

var addPlayer = function() {
  var playerCircle = gameVars.svgContainer
    .append('circle')
    .attr('id', 'playerCircle')
    .attr('r', 10)
    .attr('cx', gameVars.width / 2)
    .attr('cy', gameVars.height / 2)
    .attr('fill', 'green');

  gameVars.svgContainer.on('mousemove', function() {
    tick(d3.mouse(this));
  });
};

var addEnemy = function(myGameVars, num) {
  if (!num) {
    num = 1;
  }
  myGameVars.numEnemies = num;
  for (var i = 0; i < num; i++) {
    var newX = Math.random() * (myGameVars.width - (myGameVars.enemyR * 2)) + myGameVars.enemyR;
    var newY = Math.random() * (myGameVars.height - (myGameVars.enemyR * 2)) + myGameVars.enemyR;

    var enemyCircle = 
      myGameVars.svgContainer
      .append('circle')
      .attr('id', 'enemyCircle')
      .attr('cx', newX)
      .attr('cy', newY)
      .attr('r', myGameVars.enemyR)
      .attr('fill', 'url(#asteroidPattern)');
  }
};

var moveEnemies = function() {
  var coordArray = [];
  for (var i = 0; i < gameVars.numEnemies; i++) {
    coordArray.push({x: Math.random() * (gameVars.width - (gameVars.enemyR * 2)) + gameVars.enemyR, 
                     y: Math.random() * (gameVars.height - (gameVars.enemyR * 2)) + gameVars.enemyR});
  }

  var enemyCircles = d3.select('body').selectAll('#enemyCircle')
    .data(coordArray)
    .transition().duration(1000)
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; });
};

/* init game here */
initGame(gameVars);
addEnemy(gameVars, 10);
addPlayer();
setInterval(moveEnemies, 1100);
