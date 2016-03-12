// start slingin' some d3 here.

var gameVars = {
  svgContainer: null,
  width: 700,
  height: 450,
  enemyR: 30,
  playerR: 15,
  numEnemies: 0,
  currentScore: 0,
  highScore: 0,
  collisions: 0,
  hasCollided: false,  
};

var initGame = function(myGameVars) {
  if (myGameVars && !myGameVars.svgContainer) {

    myGameVars.svgContainer = 
      d3.select('body')
      .append('svg')
      .attr('width', gameVars.width)
      .attr('height', gameVars.height);

    myGameVars.svgContainer.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', gameVars.width)
      .attr('height', gameVars.height)
      .attr('stroke', 'black')
      .attr('fill', 'black')
      .attr('stroke-width', 'black');

    myGameVars.svgContainer.append('svg:pattern')
      .attr('id', 'asteroidPattern')
      .attr('width', 1)
      .attr('height', 1)
      .attr('patternUnits', 'objectBoundingBox')
      .append('svg:image')
      .attr('xlink:href', 'shuriken.png')
      .attr('id', 'asteroidPicture')
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
    .attr('r', gameVars.playerR)
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
    .attr('cy', function(d) { return d.y; })
    .tween('custom', tweenCollision);

  gameVars.hasCollided = false;
};

var tweenCollision = function() {
  var enemy = d3.select(this);
  return function() {
    var player = d3.select('#playerCircle');
    var playerX = player.attr('cx');
    var playerY = player.attr('cy');
    var radiusSum = gameVars.enemyR + gameVars.playerR;

    var enemyX = enemy.attr('cx');
    var enemyY = enemy.attr('cy');

    var separation = Math.sqrt(Math.pow(enemyX - playerX, 2) + 
                    Math.pow(enemyY - playerY, 2));

    if (separation < radiusSum) {
      if (gameVars.currentScore > gameVars.highScore) {
        gameVars.highScore = gameVars.currentScore;
      }
      gameVars.currentScore = 0;
      if (!gameVars.hasCollided) {
        gameVars.collisions++;
      }
      gameVars.hasCollided = true;
    }
  };
};

/* init game here */
initGame(gameVars);
addEnemy(gameVars, 10);
addPlayer();
setInterval(moveEnemies, 1000);
setInterval(function() {
  gameVars.currentScore++;
  d3.select('.highScoreSpan').text(gameVars.highScore);
  d3.select('.curScoreSpan').text(gameVars.currentScore);
  d3.select('.collisionsSpan').text(gameVars.collisions);
}, 100);
