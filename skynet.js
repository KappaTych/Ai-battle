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
            console.log(mapInfo);
        },
        GetDirection: function({playerPos, enemies, snowball, snowLevelMap}) {
            let dd = this.GetRandomInt(0, 4);
            console.log("debug" + dd);
            console.log(playerPos);
            console.log(enemies);
            console.log(snowball);
            console.log(snowLevelMap);
            return dd;
        },
        GetRandomInt: function(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
        },
        BuildMap: function(snowball, snowLevelMap) {
            
        },
    };
}

GetController();