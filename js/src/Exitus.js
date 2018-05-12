import Tile from './Tile';
import City from './City';
import Spriteset from "./Spriteset";
import Point from "./utils/Point";

var isSpriteLoaded = false;
var city = new City();
city.generate();
City.blocks.center = city;

let ctx;
var spriteset;

let startClick = null;
let path = [];

let center = new Point();


window.onload = function(e) {

    let canvas = document.getElementById("exitus");
    canvas.width = document.body.clientWidth; //document.width is obsolete
    canvas.height = document.body.clientHeight; //document.height is obsolete

    center.x = (document.body.clientWidth/2) - ((Tile.SIZE*50)/2);
    center.y = (document.body.clientHeight/2) - ((Tile.SIZE*50)/2);

    City.transX = center.x;
    City.transY = center.y;

    spriteset = new Spriteset(spriteLoaded);

    var mouseDown = false;
    var startX = 0;
    var startY = 0;
    let mouseDownLoc = new Point();

    canvas.onmousedown = inputDown;
    canvas.ontouchstart = inputDown;

    canvas.onmouseup = inputUp;
    canvas.ontouchend = inputUp;

    function inputDown(e)
    {
        let point = new Point();
        if (e.clientX !== undefined) {
            point.x = e.clientX;
            point.y = e.clientY;
        } else {
            point.x = e.touches[0].clientX;
            point.y = e.touches[0].clientY;
        }
        mouseDown = true;
        startX = point.x;
        startY = point.y;
        mouseDownLoc.x = point.x;
        mouseDownLoc.y = point.y;
    }

    function inputMove(e)
    {
        let point = new Point();
        if (e.clientX !== undefined) {
            point.x = e.clientX;
            point.y = e.clientY;
        } else {
            point.x = e.touches[0].clientX;
            point.y = e.touches[0].clientY;
        }
        if (mouseDown === true) {
            City.transX += point.x - startX;
            City.transY += point.y - startY;
            startX = point.x;
            startY = point.y;
        }
        // The world location, used to move to a new block
        let worldLoc = new Point();
        worldLoc.x = Math.floor((-City.transX+center.x+((Tile.SIZE*50)/2)) / (Tile.SIZE*50));
        worldLoc.y = Math.floor((-City.transY+center.y+((Tile.SIZE*50)/2)) / (Tile.SIZE*50));
        // Pixel checking to know when to load in a new city block
        let worldPositionCheck = new Point(((City.transX-center.x) % (Tile.SIZE*50)),((City.transY-center.y) % (Tile.SIZE*50)));

        // Load world East
        if (
            (worldPositionCheck.x < 0 && worldPositionCheck.x > -100) ||
            (worldPositionCheck.x < 400 && worldPositionCheck.x > 300)
        ) {
            if (City.blocks.east === null) {
                City.blocks.east = new City(City.blocks.center.worldLoc.x+1, City.blocks.center.worldLoc.y);
                City.blocks.east.exitPoints.west = City.blocks.center.exitPoints.east;
                City.blocks.east.generate();
            }

            // Load world South East
            if (
                (worldPositionCheck.y < 0 && worldPositionCheck.y > -100) ||
                (worldPositionCheck.y < 400 && worldPositionCheck.y > 300)
            ) {
                if (City.blocks.southEast === null && City.blocks.south !== null) {
                    City.blocks.southEast = new City(City.blocks.center.worldLoc.x + 1, City.blocks.center.worldLoc.y + 1);
                    City.blocks.southEast.exitPoints.west = City.blocks.south.exitPoints.east;
                    City.blocks.southEast.generate();
                }
            }

            // Load world North East
            if (
                (worldPositionCheck.y > 0 && worldPositionCheck.y < 100) ||
                (worldPositionCheck.y > -400 && worldPositionCheck.y < -300)
            ) {
                if (City.blocks.northEast === null && City.blocks.north !== null) {
                    City.blocks.northEast = new City(City.blocks.center.worldLoc.x + 1, City.blocks.center.worldLoc.y - 1);
                    City.blocks.northEast.exitPoints.west = City.blocks.north.exitPoints.east;
                    City.blocks.northEast.generate();
                }
            }

        }

        // Load world West
        if (
            (worldPositionCheck.x > 0 && worldPositionCheck.x < 100) ||
            (worldPositionCheck.x > -400 && worldPositionCheck.x < -300)
        ) {
            if (City.blocks.west === null) {
                City.blocks.west = new City(City.blocks.center.worldLoc.x-1, City.blocks.center.worldLoc.y);
                City.blocks.west.exitPoints.east = City.blocks.center.exitPoints.west;
                City.blocks.west.generate();
            }

            // Load world South West
            if (
                (worldPositionCheck.y < 0 && worldPositionCheck.y > -100) ||
                (worldPositionCheck.y < 400 && worldPositionCheck.y > 300)
            ) {
                if (City.blocks.southWest === null && City.blocks.south !== null) {
                    City.blocks.southWest = new City(City.blocks.center.worldLoc.x - 1, City.blocks.center.worldLoc.y + 1);
                    City.blocks.southWest.exitPoints.east = City.blocks.south.exitPoints.west;
                    City.blocks.southWest.generate();
                }
            }

            // Load world North West
            if (
                (worldPositionCheck.y > 0 && worldPositionCheck.y < 100) ||
                (worldPositionCheck.y > -400 && worldPositionCheck.y < -300)
            ) {
                if (City.blocks.northWest === null && City.blocks.north !== null) {
                    City.blocks.northWest = new City(City.blocks.center.worldLoc.x - 1, City.blocks.center.worldLoc.y - 1);
                    City.blocks.northWest.exitPoints.east = City.blocks.north.exitPoints.west;
                    City.blocks.northWest.generate();
                }
            }
        }

        // Load world South
        if (
            (worldPositionCheck.y < 0 && worldPositionCheck.y > -100) ||
            (worldPositionCheck.y < 400 && worldPositionCheck.y > 300)
        ) {
            if (City.blocks.south === null) {
                City.blocks.south = new City(City.blocks.center.worldLoc.x, City.blocks.center.worldLoc.y+1);
                City.blocks.south.exitPoints.north = City.blocks.center.exitPoints.south;
                City.blocks.south.generate();
            }

            // Load world South East
            if (
                (worldPositionCheck.x < 0 && worldPositionCheck.x > -100) ||
                (worldPositionCheck.x < 400 && worldPositionCheck.x > 300)
            ) {

                if (City.blocks.southEast === null && City.blocks.east !== null) {
                    City.blocks.southEast = new City(City.blocks.center.worldLoc.x + 1, City.blocks.east.worldLoc.y + 1);
                    City.blocks.southEast.exitPoints.north = City.blocks.east.exitPoints.south;
                    City.blocks.southEast.generate();
                }
            }
            // Load world South West
            if (
                (worldPositionCheck.x > 0 && worldPositionCheck.x < 100) ||
                (worldPositionCheck.x > -400 && worldPositionCheck.x < -300)
            ) {
                if (City.blocks.southWest === null && City.blocks.west) {
                    City.blocks.southWest = new City(City.blocks.center.worldLoc.x - 1, City.blocks.west.worldLoc.y + 1);
                    City.blocks.southWest.exitPoints.north = City.blocks.west.exitPoints.south;
                    City.blocks.southWest.generate();
                }
            }

        }
        // Load world North
        if (
            (worldPositionCheck.y > 0 && worldPositionCheck.y < 100) ||
            (worldPositionCheck.y > -400 && worldPositionCheck.y < -300)
        ) {
            if (City.blocks.north === null) {
                City.blocks.north = new City(City.blocks.center.worldLoc.x, City.blocks.center.worldLoc.y-1);
                City.blocks.north.exitPoints.south = City.blocks.center.exitPoints.north;
                City.blocks.north.generate();
            }

            // Load world North East
            if (
                (worldPositionCheck.x < 0 && worldPositionCheck.x > -100) ||
                (worldPositionCheck.x < 400 && worldPositionCheck.x > 300)
            ) {
                if (City.blocks.northEast === null && City.blocks.east !== null) {
                    City.blocks.northEast = new City(City.blocks.center.worldLoc.x + 1, City.blocks.east.worldLoc.y - 1);
                    City.blocks.northEast.exitPoints.south = City.blocks.east.exitPoints.north;
                    City.blocks.northEast.generate();
                }
            }
            // Load world North West
            if (
                (worldPositionCheck.x > 0 && worldPositionCheck.x < 100) ||
                (worldPositionCheck.x > -400 && worldPositionCheck.x < -300)
            ) {
                if (City.blocks.northWest === null && City.blocks.west) {
                    City.blocks.northWest = new City(City.blocks.center.worldLoc.x - 1, City.blocks.west.worldLoc.y - 1);
                    City.blocks.northWest.exitPoints.south = City.blocks.west.exitPoints.north;
                    City.blocks.northWest.generate();
                }
            }

        }

        // Shift world East
        if (worldLoc.x > City.worldLoc.x) {
            City.worldLoc.x++;

            City.blocks.west = City.blocks.center;
            City.blocks.center = City.blocks.east;
            City.blocks.east = null;

            City.blocks.southWest = City.blocks.south;
            City.blocks.south = City.blocks.southEast;
            City.blocks.southEast = null;

            City.blocks.northWest = City.blocks.north;
            City.blocks.north = City.blocks.northEast;
            City.blocks.northEast = null;
        }

        // Shift world West
        if (worldLoc.x < City.worldLoc.x) {
            City.worldLoc.x--;
            City.blocks.east = City.blocks.center;
            City.blocks.center = City.blocks.west;
            City.blocks.west = null;

            City.blocks.northEast = City.blocks.north;
            City.blocks.north = City.blocks.northWest;
            City.blocks.northWest = null;

            City.blocks.southEast = City.blocks.south;
            City.blocks.south = City.blocks.southWest;
            City.blocks.southWest = null;
        }

        // Shift world South
        if (worldLoc.y > City.worldLoc.y) {
            City.worldLoc.y++;
            City.blocks.north = City.blocks.center;
            City.blocks.center = City.blocks.south;
            City.blocks.south = null;

            City.blocks.northEast = City.blocks.east;
            City.blocks.east = City.blocks.southEast;
            City.blocks.southEast = null;

            City.blocks.northWest = City.blocks.west;
            City.blocks.west = City.blocks.southWest;
            City.blocks.southWest = null;
        }
        // Shift world North
        if (worldLoc.y < City.worldLoc.y) {
            City.worldLoc.y--;
            City.blocks.south = City.blocks.center;
            City.blocks.center = City.blocks.north;
            City.blocks.north = null;

            City.blocks.southEast = City.blocks.east;
            City.blocks.east = City.blocks.northEast;
            City.blocks.northEast = null;

            City.blocks.southWest = City.blocks.west;
            City.blocks.west = City.blocks.northWest;
            City.blocks.northWest = null;
        }
    }

    function inputUp(e)
    {
        let point = new Point();
        if (e.clientX !== undefined) {
            point.x = e.clientX;
            point.y = e.clientY;
        } else {
            point.x = e.changedTouches[0].clientX;
            point.y = e.changedTouches[0].clientY;
        }
        mouseDown = false;

        if (mouseDownLoc.x === startX && mouseDownLoc.y === startY) {
            if (startClick === null) {
                path = [];
                startClick = new Point(point.x-City.transX, point.y-City.transY);
            } else {
                let pathNodes = City.polyPath.clickCheck(startClick.x,startClick.y,point.x-City.transX, point.y-City.transY);
                if (pathNodes) {
                    for (var x = 0; x < pathNodes.length; x++) {
                        path.push(pathNodes[x].centre);
                    }
                }
                startClick = null;
            }
        }

    }

    canvas.ontouchmove = inputMove;
    canvas.onmousemove = inputMove;

    ctx = canvas.getContext("2d");
    requestAnimationFrame(redraw);

};

    function spriteLoaded() {
        isSpriteLoaded = true;
    }

function redraw()
{
    let canvas = document.getElementById("exitus");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (City.blocks.center!== null) {
        for (let y = 0; y < City.blocks.center.tiles.length; y++) {
            for (let x = 0; x < City.blocks.center.tiles[0].length; x++) {
                City.blocks.center.tiles[y][x].draw(ctx);
            }
        }
        for (let y = 0; y < City.blocks.center.buildings.length; y++) {
            City.blocks.center.buildings[y].draw(ctx);
        }
        for (let y = 0; y < City.blocks.center.roads.length; y++) {
            City.blocks.center.roads[y].draw(ctx);
        }
    }
    if (City.blocks.east !== null) {
        for (let y = 0; y < City.blocks.east.tiles.length; y++) {
            for (let x = 0; x < City.blocks.east.tiles[0].length; x++) {
                City.blocks.east.tiles[y][x].draw(ctx);
            }
        }
    }
    if (City.blocks.west !== null) {
        for (let y = 0; y < City.blocks.west.tiles.length; y++) {
            for (let x = 0; x < City.blocks.west.tiles[0].length; x++) {
                City.blocks.west.tiles[y][x].draw(ctx);
            }
        }
    }
    if (City.blocks.south !== null) {
        for (let y = 0; y < City.blocks.south.tiles.length; y++) {
            for (let x = 0; x < City.blocks.south.tiles[0].length; x++) {
                City.blocks.south.tiles[y][x].draw(ctx);
            }
        }
    }
    if (City.blocks.north !== null) {
        for (let y = 0; y < City.blocks.north.tiles.length; y++) {
            for (let x = 0; x < City.blocks.north.tiles[0].length; x++) {
                City.blocks.north.tiles[y][x].draw(ctx);
            }
        }
    }
    if (City.blocks.northWest !== null) {
        for (let y = 0; y < City.blocks.northWest.tiles.length; y++) {
            for (let x = 0; x < City.blocks.northWest.tiles[0].length; x++) {
                City.blocks.northWest.tiles[y][x].draw(ctx);
            }
        }
    }
    if (City.blocks.northEast !== null) {
        for (let y = 0; y < City.blocks.northEast.tiles.length; y++) {
            for (let x = 0; x < City.blocks.northEast.tiles[0].length; x++) {
                City.blocks.northEast.tiles[y][x].draw(ctx);
            }
        }
    }
    if (City.blocks.southWest !== null) {
        for (let y = 0; y < City.blocks.southWest.tiles.length; y++) {
            for (let x = 0; x < City.blocks.southWest.tiles[0].length; x++) {
                City.blocks.southWest.tiles[y][x].draw(ctx);
            }
        }
    }
    if (City.blocks.southEast !== null) {
        for (let y = 0; y < City.blocks.southEast.tiles.length; y++) {
            for (let x = 0; x < City.blocks.southEast.tiles[0].length; x++) {
                City.blocks.southEast.tiles[y][x].draw(ctx);
            }
        }
    }

    if (path.length > 0) {
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.beginPath();

        ctx.moveTo(path[0].x+City.transX, path[0].y+City.transY);
        for (var i=1; i < path.length;i++) {
            ctx.lineTo(path[i].x+City.transX, path[i].y+City.transY);
        }

        ctx.stroke();
    }
    requestAnimationFrame(redraw);
}

