const Directions = Object.freeze({
	Up: 0, Right: 1, Down: 2, Left: 3, Idle: 4
});

const MapObjectType = Object.freeze({
	Obstacle: -1, Empty: 0, Snow: 1, Snowball: 2
});

class Bot {
	constructor() {
		this.currentScore = 0;
		this.totalScore = 0;
	}

	get totalScore() {
		let score = 0;
		// foreach base cell
		// check for snowball
		// true: add cost to score
		return score;
	}

	// Minimax
	move(map, state) {
		// depending on current state determine strategy
		// states:
		// LookingForBall
		// CollectingBall
		// ReturningBall
		// foreach 
		// 132
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
    state: 0,
    path: [],
    pathId: -1,

		Init: function({ mapInfo, index }) {
			this.x = mapInfo.spawns[index].x;
			this.y = mapInfo.spawns[index].y;
			this.idx = index;
			this.mapInfo = mapInfo;
			this.mapSize = [mapInfo.height, mapInfo.width];
			// console.log(mapInfo);
		},

		//loop method
		GetDirection: function({ playerPos, enemies, snowball, snowLevelMap }) {
			let dd = this.GetRandomInt(0, 4);
      let map = { }
      if (this.pathId == -1) {
        let endPos = [0, 0];
        this.pathId = 0;
        this.path = this.BFS(map, [playerPos.x, playerPos.y], function (x, y) {
          return x == endPos[0] && y == endPos[1];
        });
      }
      let path = this.path[this.pathId];
      this.pathId += 1;
			// console.log("debug" + dd);
			// console.log(playerPos);
			// console.log(enemies);
			// console.log(snowball);
			// console.log(snowLevelMap);
			return path[2];
		},

		//trash
		GetRandomInt: function(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min)) + min;
		},

		//Glushkov V.K.
		BuildMap: function(snowball, snowLevelMap, enemies) {
			//see MapObjectType
			//init map
			map = new Array(mapInfo.height);
			for (let row = 0; row < mapInfo.height; row++) {
				map[row] = new Array(mapInfo.width);
				for (let col = 0; col < mapInfo.width; col++) {
					switch (mapInfo[row][col]) {
						case "*":
						case "#":
							map[row][col] = [{
								type: MapObjectType.Obstacle,
								value: 0
							}];
							break;
						case ".":
							map[row][col] = [{
								type: MapObjectType.Empty,
								value: 0,
							}];
							//place snow if value != 0
							if (snowLevelMap[row][col] != 0) {
								map[row][col].push({
									type: MapObjectType.Snow,
									value: snowLevelMap[row][col],
								});
							}
							break;
					}
				}
			}
			// place snowballs to map
			for (let sb in snowball) {
				map[sb.y, sb.x].push({
					type: MapObjectType.Snowball,
					value: sb.value
				});
				
			}

			for (let en in enemies) {
				map[en.y, en.x].push({
					type: MapObjectType.Obstacle,
					value: 0
				});
			}
			return map;
			//end init
		},

		Bfs: function(map, startPos, stopperFunc) {
			var dRow = [-1, 0, 1, 0];
			var dCol = [0, 1, 0, -1];
      const dDir = [2, 1, 0, 3];

			var path = [];

			// Stores indices of the matrix cells
			var q = [];

			// Mark the starting cell as visited
			// and push it into the queue
			let { col, row } = startPos;
			// let { endCol, endRow } = endPos;
			q.push([row, col, 4]);

      var vis = Array.from({ length: this.mapSize[0] }, () => 
        Array.from({ length: this.mapSize[1] }, () => false)
      );
			vis[row][col] = true;

			// Iterate while the queue
			// is not empty
			while (q.length != 0) {

				var cell = q[0];
				var x = cell[0];
				var y = cell[1];
        
        if (y != row || x != col) {
          path.push([y, x, dir]);
        }
				
				console.log(grid[x][y] + " ");

				q.shift();

				if (stopperFunc(y, x)) {
					return path;
				}

				// Go to the adjacent cells
				for (var i = 0; i < 4; i++) {

					var adjx = x + dRow[i];
					var adjy = y + dCol[i];
          var curDir = dDir[i];

					if (isValid(vis, map, adjx, adjy)) {
						q.push([adjx, adjy, curDir]);
						vis[adjx][adjy] = true;
					}
				}
			}

			return path;

		},

		IsValid: function(vis, map, row, col) {
			// If cell lies out of bounds
			if (row < 0 || col < 0
				|| row >= this.mapSize[0] || col >= this.mapSize[1] || map[row][col] < 0)
				return false;

			// If cell is already visited
			if (vis[row][col])
				return false;

			// Otherwise
			return true;
		}
	};
}

GetController();