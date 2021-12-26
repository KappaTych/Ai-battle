const Directions = Object.freeze({
  Up: 0,
  Right: 1,
  Down: 2,
  Left: 3,
  Idle: 4
});

const MapObjectType = Object.freeze({
  Obstacle: -1,
  Empty: 0,
  Snow: 1,
  Snowball: 2
});

const PlayerState = Object.freeze({
  Looking: 0,
  Returning: 1
});

const ACTIONS = [
  { step: [0, -1], dir: Directions.Up },
  { step: [1, 0], dir: Directions.Right },
  { step: [0, 1], dir: Directions.Down },
  { step: [-1, 0], dir: Directions.Left },
  // { step: [0, 0], dir: Directions.Idle },
];

const top = 0;
const parent = i=>((i + 1) >>> 1) - 1;
const left = i=>(i << 1) + 1;
const right = i=>(i + 1) << 1;

function PriorityQueue(comparator) {
  return {
    _heap: [],
    _comparator: comparator,
    size: function() {
      return this._heap.length;
    },
    isEmpty: function() {
      return this.size() == 0;
    },
    peek: function() {
      return this._heap[top];
    },
    push: function(...values) {
      values.forEach(value=>{
        this._heap.push(value);
        this._siftUp();
      }
      );
      return this.size();
    },
    pop: function() {
      const poppedValue = this.peek();
      const bottom = this.size() - 1;
      if (bottom > top) {
        this._swap(top, bottom);
      }
      this._heap.pop();
      this._siftDown();
      return poppedValue;
    },
    replace: function(value) {
      const replacedValue = this.peek();
      this._heap[top] = value;
      this._siftDown();
      return replacedValue;
    },
    _greater: function(i, j) {
      return this._comparator(this._heap[i], this._heap[j]);
    },
    _swap: function(i, j) {
      [this._heap[i],this._heap[j]] = [this._heap[j], this._heap[i]];
    },
    _siftUp: function() {
      let node = this.size() - 1;
      while (node > top && this._greater(node, parent(node))) {
        this._swap(node, parent(node));
        node = parent(node);
      }
    },
    _siftDown: function() {
      let node = top;
      while ((left(node) < this.size() && this._greater(left(node), node)) || (right(node) < this.size() && this._greater(right(node), node))) {
        let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
        this._swap(node, maxChild);
        node = maxChild;
      }
    }
  };
}

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
      }
    }
    return moveScore;
  }
}

var queue = PriorityQueue((a,b)=>a.score < b.score);
var states = new Set();

function GetController() {
  return {
    x: 1,
    y: 1,
    idx: -1,
    mapInfo: {},

    Init: function({mapInfo, index}) {
      this.x = mapInfo.spawns[index].x;
      this.y = mapInfo.spawns[index].y;
      this.idx = index;
      this.mapInfo = mapInfo;
      this.mapSize = [mapInfo.height, mapInfo.width];
    },

    Score: function(map, state) {
      // add score for growing snowball
      // add score for snowball at base
      // add score for shortening ball's path to base
      // remove score for blocked snowball
      return this.GetRandomInt(0, 100);
    },

    Hash(state) {
      let out = [];
      for (let x of state) {
        if (Array.isArray(x)) {
          out.push(this.Hash(x));
        } else {
          out.push(x.toString());
        }
      }
      return '[' + out.join(',') + ']';
    },

    GetDirection: function({playerPos, enemies, snowball, snowLevelMap}) {
      let map = this.BuildMap(snowball, snowLevelMap, enemies);
      //let routes = this.Bfs(map, [playerPos.x, playerPos.y]);
      if (queue.isEmpty()) {
        const startingState = [playerPos.x, playerPos.y, []];
        queue.push({
          score: 0,
          state: startingState,
          move: Directions.Idle
        });
      }
      let item = queue.pop();
      states.add(this.Hash(item.state));
      for (let action of ACTIONS) {
        let x = playerPos.x + action.step[0];
        let y = playerPos.y + action.step[1];
        let new_state = [x, y, snowball];
        if (this.IsGoodMove(map, new_state)) {
          queue.push({
            score: this.Score(map, new_state),
            state: new_state,
            move: action.dir
          });
        }
      }
      return item.move;
    },

    IsGoodMove: function(map, state) {
      let [x, y] = state;
      return (
        x >= 0 &&
        y >= 0 &&
        x < this.mapInfo.width &&
        y < this.mapInfo.height &&
        map[y][x].type >= 0 &&
        !states.has(this.Hash(state))
      );
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
      function isObstacle(point) {
        return map[point.y][point.x].type == MapObjectType.Snowball || map[point.y][point.x].type == MapObjectType.Obstacle;
      }
      for (let sb of snowball) {
        let cond = isObstacle({
          x: sb.x - 1,
          y: sb.y
        }) && isObstacle({
          x: sb.x,
          y: sb.y - 1
        }) && isObstacle({
          x: sb.x + 1,
          y: sb.y
        }) && isObstacle({
          x: sb.x,
          y: sb.y - 1
        }) && isObstacle({
          x: sb.x + 1,
          y: sb.y
        }) && isObstacle({
          x: sb.x,
          y: sb.y + 1
        }) && isObstacle({
          x: sb.x - 1,
          y: sb.y
        }) && isObstacle({
          x: sb.x,
          y: sb.y + 1
        });

        if (!cond) {
          map[sb.y][sb.x] = {
            type: MapObjectType.Obstacle,
            value: 0
          };
        } else {
          map[sb.y][sb.x] = {
            type: MapObjectType.Snowball,
            value: sb.value
          };
        }
      }

      for (let en of enemies) {
        map[en.y][en.x] = {
          type: MapObjectType.Obstacle,
          value: 0
        };
      }
      return map;
    },

    GetRandomInt: function(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    },

    GetPath: function(routes, finish) {
      let b = routes[finish.x][finish.y];
      let path = [];
      let {x, y} = start;
      for (let n = b - 1; n > 0; n--) {
        for (let d of ACTIONS) {
          if (routes[y - d.step[1]][x - d.step[0]] == n) {
            x -= d.step[0];
            y -= d.step[1];
            path.push(d.dir);
            break;
          }
        }
      }
      return path.reverse();
    },

    Bfs: function(map, startPos) {
      var dRow = [-1, 0, 1, 0];
      var dCol = [0, 1, 0, -1];

      var q = [];
      let[col,row] = startPos;
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
      if (
        row < 0 ||
        col < 0 ||
        row >= this.mapSize[0] ||
        col >= this.mapSize[1] ||
        map[row][col].type < 0
      ) {
        return false;
      }
      if (vis[row][col]) {
        return false;
      }
      return true;
    },

    BallBfs: function(map, ballStartPos) {
      var dRow = [-1, 0, 1, 0];
      var dCol = [0, 1, 0, -1];
    },

    GetFreeBasePoint: function(map) {
      let {topLeft, bottomRight} = this.mapInfo.bases[this.idx];
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
              return {
                x: xv,
                y: yv
              }
            }
          }
        }
        return topLeft;
      }
      if ((topRight.x >= this.mapInfo.width / 2) && (topRight.y < this.mapInfo.height / 2)) {
        for (let xv = topRight.x; xv >= bottomLeft.x; xv--) {
          for (let yv = topRight.y; yv <= bottomLeft.y; yv++) {
            if (map[yv][xv].type != MapObjectType.Obstacle && map[yv][xv].type != MapObjectType.Snowball) {
              return {
                x: xv,
                y: yv
              }
            }
          }
        }
        return topRight;
      }
      if ((bottomLeft.x < this.mapInfo.width / 2) && (bottomLeft.y >= this.mapInfo.height / 2)) {
        for (let xv = bottomLeft.x; xv <= topRight.x; xv++) {
          for (let yv = bottomLeft.y; yv >= topRight.y; yv--) {
            if (map[yv][xv].type != MapObjectType.Obstacle && map[yv][xv].type != MapObjectType.Snowball) {
              return {
                x: xv,
                y: yv
              }
            }
          }
        }
        return bottomLeft;
      }
      if ((bottomRight.x >= this.mapInfo.width / 2) && (bottomRight.y >= this.mapInfo.height / 2)) {
        for (let xv = bottomRight.x; xv >= topLeft.x; xv--) {
          for (let yv = bottomRight.y; yv >= topLeft.y; yv--) {
            if (map[yv][xv].type != MapObjectType.Obstacle && map[yv][xv].type != MapObjectType.Snowball) {
              return {
                x: xv,
                y: yv
              }
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
