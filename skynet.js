const Directions = Object.freeze({
  Up: 0, Right: 1, Down: 2, Left: 3, Idle: 4
});

const MapObjectType = Object.freeze({
  Obstacle: -1, Empty: 0, Snow: 1, Snowball: 2
});

const PlayerState = Object.freeze({
  Looking: 0, Returning: 1
});

class Bot {
  constructor() {
    this.currentScore = 0;
    this.totalScore = 0;
  }

  get totalScore() {
    let score = 0;
    /*// foreach base cell
    // check for snowball
    // true: add cost to score*/
    return score;
  }

  // Minimax
  move(map, state) {
    /*// depending on current state determine strategy
    // states:
    // LookingForBall
    // CollectingBall
    // ReturningBall*/
    direction = Directions.Idle;
    switch (direction) {
      case Directions.Idle:
        break;
      case Directions.Up:
        break;
      case Directions.Down:
        break;
      case Directions.Left:
        break;
      case Directions.Right:
        break;
    }
    return direction;
  }

  score(map, state, direction) {
    let moveScore = 0;
    for (let i = 0; i < map.h; i++) {
      for (let j = 0; j < map.w; i++) {
        //
      }
    }
    return moveScore;
  }
}

function GetController() {
  return {
    x: 1,
    y: 1,
    idx: -1,
    mapInfo: {},
    state: PlayerState.Looking,
    path: [],
    pathId: -1,

    Init: function({ mapInfo, index }) {
      this.x = mapInfo.spawns[index].x;
      this.y = mapInfo.spawns[index].y;
      this.idx = index;
      this.mapInfo = mapInfo;
      this.mapSize = [mapInfo.height, mapInfo.width];
    },

    GetDirection: function({ playerPos, enemies, snowball, snowLevelMap }) {
      let ans;
      let map = this.BuildMap(snowball, snowLevelMap, enemies);
      this.Bfs(map, [playerPos.x, playerPos.y]);
      if (this.pathId == -1) {
        this.pathId = 0;
        this.path = this.OldBfs(map, [playerPos.x, playerPos.y], function(x, y) {
          return map[y][x].type == MapObjectType.Snow;
        });
      }
      switch (this.state) {
        case PlayerState.Looking:
          this.pathId += 1;
          /*// this.path = this.Bfs(map, [playerPos.x, playerPos.y], function(x, y) {
          //   return map[y][x].type == MapObjectType.Snow;
          // });*/
          break;

        case PlayerState.Returing:
          break;
      }
      if (this.pathId < this.path.length) {
        /*console.log(this.pathId, this.path[this.pathId], this.path);*/
        return this.path[this.pathId][2];
      }

      
	  
      return Directions.Idle;
    },

    /*Glushkov V.K.*/
    BuildMap: function(snowball, snowLevelMap, enemies) {
      let map = new Array(this.mapInfo.height);
      for (let row = 0; row < this.mapInfo.height; row++) {
        map[row] = new Array(this.mapInfo.width);
        for (let col = 0; col < this.mapInfo.width; col++) {
          switch (this.mapInfo.map[row][col]) {
            case "*":
            case "#":
              map[row][col] = {
                type: MapObjectType.Obstacle,
                value: 0
              };
              break;
            case ".":
			  if (Array.isArray(snowLevelMap)) {
				if (snowLevelMap[row][col] != 0) {
                	map[row][col] = {
                  		type: MapObjectType.Snow,
                  		value: snowLevelMap[row][col],
                	};
              	} else {
					map[row][col] = {
					type: MapObjectType.Empty,
					value: 0,
					};
				}
			  } else if (snowLevelMap != 0) {
				  map[row][col] = {
                  		type: MapObjectType.Snow,
                  		value: snowLevelMap,
                	};
			  } else {
				map[row][col] = {
				type: MapObjectType.Empty,
				value: 0,
				};
			  }
              break;
          }
        }
      }
      /* place snowballs to map */
      for (let sb of snowball) {
        map[sb.y][sb.x] = {
          type: MapObjectType.Snowball,
          value: sb.value
        };
        /*TODO add check if current snowball	*/			
      }
	  
      for (let en of enemies) {
        map[en.y][en.x] = {
          type: MapObjectType.Obstacle,
          value: 0
        };
      }
      return map;
    },

    GetPath: function (routes, start) {
      let b = routes[start.x][start.y];
      let path = [];
      let dirs = [
        { step: [0, -1], dir: Directions.Up },
        { step: [1, 0], dir: Directions.Right },
        { step: [0, 1], dir: Directions.Down },
        { step: [-1, 0], dir: Directions.Left },
      ];
      let {x , y} = start;
      for (let n = b - 1; n > 0; n--) {
        for (let d of dirs) {
          if (routes[y + d.step[1]][x + d.step[0]] == n) {
            x += d.step[0];
            y += d.step[1];
            path.push(dirs.dir);
            break;
          }
        }
      }
      return path.reverse();
    },

    OldBfs: function(map, startPos, stopperFunc) {
      var dRow = [-1, 0, 1, 0];
      var dCol = [0, 1, 0, -1];
      const dDir = [2, 1, 0, 3];

      var path = [];

      // Stores indices of the matrix cells
      var q = [];

      // Mark the starting cell as visited
      // and push it into the queue
      let [col, row] = startPos;
      // let { endCol, endRow } = endPos;
      q.push([row, col, 0]);

      let vis = new Array(this.mapInfo.height);
      for (let row = 0; row < this.mapInfo.height; row++) {
        vis[row] = new Array(this.mapInfo.width);
      }
      vis[row][col] = true;

      while (q.length != 0) {

        var cell = q[0];
        var x = cell[0];
        var y = cell[1];
        var dir = cell[2];

        path.push([y, x, dir]);

        q.shift();

        if (stopperFunc(y, x)) {
          return path;
        }

        for (var i = 0; i < 4; i++) {

          var adjx = x + dRow[i];
          var adjy = y + dCol[i];
          var curDir = dDir[i];

          if (this.IsValid(vis, map, adjx, adjy)) {
            q.push([adjx, adjy, curDir]);
            vis[adjx][adjy] = true;
          }
        }
      }

      return path;

    },

    Bfs: function(map, startPos) {
      var dRow = [-1, 0, 1, 0];
      var dCol = [0, 1, 0, -1];

      var q = [];
      let [col, row] = startPos;
      q.push([row, col, 0]);

      var vis = new Array(this.mapInfo.height);
      for (let row = 0; row < this.mapInfo.height; row++) {
        vis[row] = new Array(this.mapInfo.width);
      }
      vis[row][col] = true;

      var dist = new Array(this.mapInfo.height);
      for (let row = 0; row < this.mapInfo.height; row++) {
        dist[row] = new Array(this.mapInfo.width);
      }
      dist[row][col] = 0;
      // console.log(dist);

      while (q.length != 0) {

        var cell = q[0];
        var x = cell[0];
        var y = cell[1];
        var d = cell[2];

        d += 1;

        q.shift();

        for (var i = 0; i < 4; i++) {

          var adjx = x + dRow[i];
          var adjy = y + dCol[i];

          if (this.IsValid(vis, map, adjx, adjy)) {
            q.push([adjx, adjy, d]);
            vis[adjx][adjy] = true;
            dist[adjx][adjy] = d;
          }
        }
      }

      // console.log(dist);

      return dist;

    },

    IsValid: function(vis, map, row, col) {
      if (row < 0 || col < 0
        || row >= this.mapSize[0] || col >= this.mapSize[1] || map[row][col].type < 0)
        return false;

      if (vis[row][col])
        return false;

      return true;
    },

	BallBfs: function(map, startPos) {

	},

	GetFreeBasePoint: function(map) {
		let { topLeft, bottomRight } = this.mapInfo.bases[this.idx];
		let topRight = {
			x: bottomRight.x,
			y: topLeft.y,
		};
		let bottomLeft = {
			x: topLeft.x,
			y: bottomRight.y,
		};
		if ((topLeft.x < this.mapInfo.width / 2) && (topLeft.y < this.mapInfo.height / 2)) {
			for (let xv = topLeft.x; xv <= bottomRight.x; xv++) {
				for (let yv = topLeft.y; yv <= bottomRight.y; yv++) {
					if (map[yv][xv].type != MapObjectType.Obstacle && map[yv][xv].type != MapObjectType.Snowball) {
						return {x: xv, y: yv}
					}
				}
			}
			return topLeft;
		}
		if ((topRight.x >= this.mapInfo.width / 2) && (topRight.y < this.mapInfo.height / 2)) {
			for (let xv = topRight.x; xv >= bottomLeft.x; xv--) {
				for (let yv = topRight.y; yv <= bottomLeft.y; yv++) {
					if (map[yv][xv].type != MapObjectType.Obstacle && map[yv][xv].type != MapObjectType.Snowball) {
						return {x: xv, y: yv}
					}
				}
			}
			return topRight;
		}
		if ((bottomLeft.x < this.mapInfo.width / 2) && (bottomLeft.y >= this.mapInfo.height / 2)) {
			for (let xv = bottomLeft.x; xv <= topRight.x; xv++) {
				for (let yv = bottomLeft.y; yv >= topRight.y; yv--) {
					if (map[yv][xv].type != MapObjectType.Obstacle && map[yv][xv].type != MapObjectType.Snowball) {
						return {x: xv, y: yv}
					}
				}
			}
			return bottomLeft;
		}
		if ((bottomRight.x >= this.mapInfo.width / 2) && (bottomRight.y >= this.mapInfo.height / 2)) {
			for (let xv = bottomRight.x; xv >= topLeft.x; xv--) {
				for (let yv = bottomRight.y; yv >= topLeft.y; yv--) {
					if (map[yv][xv].type != MapObjectType.Obstacle && map[yv][xv].type != MapObjectType.Snowball) {
						return {x: xv, y: yv}
					}
				}
			}
			return bottomRight;
		}
		return topLeft;
	},
  };
}

GetController();