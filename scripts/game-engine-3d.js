'use strict';

if (typeof OnePRGame === 'undefined') {
    var OnePRGame = {};
}

OnePRGame.Engine3D = function (context, gameBoardClassName) {

    this.GameBoardClassName = gameBoardClassName;
    this.Context = context;
    this.ScreenWidth = 0;
    this.ScreenHeight = 0;
    this.HalfWidth = 0;
    this.HalfHeight = 0;
    this.CanvasContext = null;
	this.Camera = {
        DrawDistance: 4,
        XFieldOfView: 100 * Math.PI / 180,
        YFieldOfView: 100 * Math.PI / 180
    };
    this.MoveQueue = [];
    this.RenderInterval = null;
    this.MoveQueueInterval = null;
    this.Planes = [];
    let that = this;

	// Applying patterns to the 2D image doesn't work right.
    ////this.StoneBrick = that.CanvasContext.createPattern(document.getElementsByClassName('stone-bricks')[0], 'repeat');
    ////for (let i = 2; i < that.Planes.length; i++) {
    ////    that.Planes[i].Color = that.StoneBrick;
    ////}

    this.Run = function () {

        let gameBoardWindow = document.getElementsByClassName('game-board-window')[0];
        that.ScreenWidth = gameBoardWindow.clientWidth;
        that.ScreenHeight = gameBoardWindow.clientHeight;

        that.HalfWidth = that.ScreenWidth / 2;
        that.HalfHeight = that.ScreenHeight / 2;

        that.Camera.XFocalLength = that.HalfWidth / Math.tan(that.Camera.XFieldOfView / 2);
        that.Camera.YFocalLength = that.HalfHeight / Math.tan(that.Camera.YFieldOfView / 2);

        let gameBoard = document.getElementsByClassName(that.GameBoardClassName)[0];

		// Remove old elements
        let existingGameBoardCanvases = gameBoard.getElementsByClassName('game-board-3d-canvas');
        if (existingGameBoardCanvases.length > 0) {
            gameBoard.removeChild(existingGameBoardCanvases[0]);
        }

        let existingGameBoardPlayerActions = gameBoard.getElementsByClassName('game-board-3d-player-action');
        for (let i = existingGameBoardPlayerActions.length - 1; i >= 0; i--) {
            gameBoard.removeChild(existingGameBoardPlayerActions[i]);
        }

        let existingGameBoardControls = gameBoard.getElementsByClassName('game-board-3d-controls');
        if (existingGameBoardControls.length > 0) {
            gameBoard.removeChild(existingGameBoardControls[0]);
        }

        // Add canvas element
        let canvas = document.createElement('canvas');
        canvas.className = 'game-board-3d-canvas';
        canvas.width = that.ScreenWidth;
        canvas.height = that.ScreenHeight;
        gameBoard.appendChild(canvas);
        that.CanvasContext = canvas.getContext('2d');

		// Convert map to planes.
        for (let i = 0; i < that.Context.Map.length; i++) {
            for (let j = 0; j < that.Context.Map[i].length; j++) {
                that.Planes.push({
                    Vertices: [
                        [j, 0, i],
                        [j, 0, i + 1],
                        [j + 1, 0, i + 1],
                        [j + 1, 0, i]
                    ],
                    Color: that.Context.Tileset[that.Context.Map[i][j]].Color
                });
            }
        }

        // This is the frame rate (1000/50 = 20 frames/sec)
        // Mainstream games: 60 FPS is good, 30 FPS low.
        that.RenderInterval = setInterval(function () { that.Render(); }, 50);

        that.MoveQueueInterval = setInterval(function () { that.ExecuteMoveQueue(); }, 25);

        // Setup controls elements
        let controls3d = document.createElement('div');
        controls3d.className = 'game-board-3d-controls';
        controls3d.style.position = 'fixed';
        controls3d.style.bottom = '0px';
        controls3d.style.left = '0px';

        let leftButton = document.createElement('button');
        leftButton.type = 'button';
        leftButton.className = 'game-board-3d-controls-left';
        leftButton.textContent = 'Left';
        controls3d.appendChild(leftButton);

        let forwardButton = document.createElement('button');
        forwardButton.type = 'button';
        forwardButton.className = 'game-board-3d-controls-forward';
        forwardButton.textContent = 'Forward';
        controls3d.appendChild(forwardButton);

        let rightButton = document.createElement('button');
        rightButton.type = 'button';
        rightButton.className = 'game-board-3d-controls-right';
        rightButton.textContent = 'Right';
        controls3d.appendChild(rightButton);

        gameBoard.appendChild(controls3d);

        // Controls event listeners
        gameBoard.getElementsByClassName('game-board-3d-controls-left')[0].addEventListener('click', that.Left, false);

        gameBoard.getElementsByClassName('game-board-3d-controls-forward')[0].addEventListener('click', that.Forward, false);

        gameBoard.getElementsByClassName('game-board-3d-controls-right')[0].addEventListener('click', that.Right, false);

    };

    this.Stop = function (callback) {

        clearInterval(that.RenderInterval);
        clearInterval(that.MoveQueueInterval);

        let gameBoard = document.getElementsByClassName(that.GameBoardClassName)[0];

        gameBoard.getElementsByClassName('game-board-3d-controls-left')[0].removeEventListener('click', that.Left, false);

        gameBoard.getElementsByClassName('game-board-3d-controls-forward')[0].removeEventListener('click', that.Forward, false);

        gameBoard.getElementsByClassName('game-board-3d-controls-right')[0].removeEventListener('click', that.Right, false);

        let stopInterval = setInterval(function () {
            if (that.MoveQueue.length === 0 || that.MoveQueue[0].Status !== 'Executing') {

                clearInterval(stopInterval);

                if (typeof callback !== 'undefined') {
                    callback();
                }
            }
        }, 50);
    };

    this.Forward = function () {
        if (that.MoveQueue.length === 0 || that.MoveQueue[0].Status !== 'Executing') {
            that.MoveQueue.push({
                Status: 'Not Started',
                Move: function () {
                    let isX = that.Context.Player.Direction !== Math.PI / 2 && that.Context.Player.Direction !== Math.PI * 3 / 2;
                    let isAdd = that.Context.Player.Direction !== Math.PI && that.Context.Player.Direction !== Math.PI * 3 / 2;

                    let startPosition = parseFloat((that.Context.Player.Position[isX ? 1 : 0] + 0.5));
                    let endPosition = startPosition + (isAdd ? 1 : -1);

                    // Where am I going?
                    let targetTile = OnePRGame.Tileset[OnePRGame.Map[that.Context.Player.Position[0] + (isX ? 0 : isAdd ? 1 : -1)][that.Context.Player.Position[1] + (!isX ? 0 : isAdd ? 1 : -1)]];

                    // Can I get there?
                    if (targetTile !== null && !targetTile.Impassable) {

                        let intervalId = setInterval(function () {

                            if ((isAdd && (that.Context.Player.Position[isX ? 1 : 0] + 0.5) >= endPosition) || (!isAdd && (that.Context.Player.Position[isX ? 1 : 0] + 0.5) <= endPosition)) {
                                that.Context.Player.Position[isX ? 1 : 0] = endPosition - 0.5;
                                clearInterval(intervalId);
                                that.MoveQueue[0].Status = 'Complete';
                                if (typeof targetTile.Event === 'function') {
                                    targetTile.Event();
                                }
                            }
                            else {
                                that.Context.Player.Position[isX ? 1 : 0] = (parseFloat((that.Context.Player.Position[isX ? 1 : 0] + 0.5)) + (isAdd ? 0.05 : -0.05)).toPrecision(3) - 0.5;
                            }

                        }, 50);

                    }
                    else {
                        that.MoveQueue[0].Status = 'Complete';
                    }
                }
            });
        }
    };

    this.Left = function () {
        if (that.MoveQueue.length === 0 || that.MoveQueue[0].Status !== 'Executing') {
            that.MoveQueue.push({
                Status: 'Not Started',
                Move: function () {
                    let startPosition = parseFloat(that.Context.Player.Direction);
                    let endPosition = startPosition - (Math.PI / 2);

                    let intervalId = setInterval(function () {

                        if (that.Context.Player.Direction <= endPosition) {
                            that.Context.Player.Direction = endPosition;
                            clearInterval(intervalId);
                            if (that.Context.Player.Direction < 0) {
                                that.Context.Player.Direction += Math.PI * 2;
                            }

                            that.MoveQueue[0].Status = 'Complete';
                        }
                        else {
                            that.Context.Player.Direction = parseFloat(that.Context.Player.Direction) - (Math.PI / 20);
                        }
                    }, 50);
                }
            });
        }
    };

    this.Right = function () {
        if (that.MoveQueue.length === 0 || that.MoveQueue[0].Status !== 'Executing') {
            that.MoveQueue.push({
                Status: 'Not Started',
                Move: function () {
                    let startPosition = parseFloat(that.Context.Player.Direction);
                    let endPosition = startPosition + (Math.PI / 2);

                    let intervalId = setInterval(function () {

                        if (that.Context.Player.Direction >= endPosition) {
                            that.Context.Player.Direction = endPosition;
                            clearInterval(intervalId);
                            if (that.Context.Player.Direction > Math.PI * 2) {
                                that.Context.Player.Direction -= Math.PI * 2;
                            }

                            that.MoveQueue[0].Status = 'Complete';
                        }
                        else {
                            that.Context.Player.Direction = parseFloat(that.Context.Player.Direction) + (Math.PI / 20);
                        }
                    }, 50);
                }
            });
        }
    };

    this.PlayerAction = function (text) {

        let playerAction = document.createElement('div');
        playerAction.className = 'game-board-3d-player-action';
        playerAction.textContent = text;
        document.getElementsByClassName(that.GameBoardClassName)[0].appendChild(playerAction);

    };

    this.RotatePointAroundCameraDirection = function (point3d) {
        let x = point3d[0];
        let z = point3d[2];

        let cosRY = Math.cos(that.Context.Player.Direction);
        let sinRY = Math.sin(that.Context.Player.Direction);
        let tempz = z;
        let tempx = x;

        x = Math.round(((tempx * cosRY) + (tempz * sinRY)) * 100) / 100;
        z = Math.round(((tempx * -sinRY) + (tempz * cosRY)) * 100) / 100;

        return [z, point3d[1], x];
    };

    this.GetLocalCoordinates = function (plane3d) {

        let localPlane = {
            Vertices: [],
            Color: plane3d.Color
        };

        for (let i = 0; i < plane3d.Vertices.length; i++) {

            // Camera position modification
            let vertex = [
                plane3d.Vertices[i][0] - (that.Context.Player.Position[1] + 0.5),
                plane3d.Vertices[i][1] - 0.5,
                plane3d.Vertices[i][2] - (that.Context.Player.Position[0] + 0.5)
            ];

            // Camera direction modification
            vertex = that.RotatePointAroundCameraDirection(vertex);

            localPlane.Vertices.push(vertex);
        }

        return localPlane;
    };

    this.Calc3DPointIn2D = function (point3d) {

        // Using projection, not using ray casting. Maybe some other time.

        let x3d = point3d[0];
        let y3d = point3d[1];
        let z3d = point3d[2];

        // Projection
        let x2d = z3d === 0 && x3d > 0 ? that.HalfWidth : z3d === 0 && x3d < 0 ? -that.HalfWidth : (x3d * (that.Camera.XFocalLength / z3d));

        if (z3d < 0) {
            // Using this as a surrogate for proper 3D clipping.
            // See: www.cubic.org/docs/3dclip.htm
            x2d = -6 * x2d;
        }

        let y2d = z3d === 0 && y3d > 0 ? that.HalfHeight : z3d === 0 && y3d < 0 ? -that.HalfHeight : (y3d * (that.Camera.YFocalLength / z3d));

        if (z3d < 0) {
            // Using this as a surrogate for proper 3D clipping.
            // See: www.cubic.org/docs/3dclip.htm
            y2d = -6 * y2d;
        }

        // So, point (0, 0) on the canvas is the upper left corner and positive is in
        // the direction of the bottom of the screen.
        // That means everything is mirrored over the Y, and the code here adjusts for that.
        // And we want (0, 0) in the middle, so we move it to the center of the screen.
        return [x2d + that.HalfWidth, -y2d + that.HalfHeight];

    };

    this.DrawPlaneIn2D = function (plane2d) {

        that.CanvasContext.beginPath();

        for (let i = 0; i < plane2d.Vertices.length; i++) {

            if (i === 0) {
                that.CanvasContext.moveTo.apply(that.CanvasContext, plane2d.Vertices[i]);
            }
            else {
                that.CanvasContext.lineTo.apply(that.CanvasContext, plane2d.Vertices[i]);
            }

        }

        that.CanvasContext.closePath();
        that.CanvasContext.fillStyle = plane2d.Color;
        that.CanvasContext.fill();

    };

    this.RegionContains = function (region, location) {
        var lastPoint = region.Vertices[region.Vertices.length - 1];
        var isInside = false;
        var x = location[2];
        for (var i = 0; i < region.Vertices.length; i++) {
            var x1 = lastPoint[2];
            var x2 = region.Vertices[i][2];
            var dx = x2 - x1;

            if ((x1 <= x && x2 > x) || (x1 >= x && x2 < x)) {
                var grad = (region.Vertices[i][0] - lastPoint[0]) / dx;
                var intersectAtLat = lastPoint[0] + ((x - x1) * grad);

                if (intersectAtLat > location[0]) {
                    isInside = !isInside;
                }
            }

            lastPoint = region.Vertices[i];
        }

        return isInside;
    };

    this.SortByLeastZ = function (a, b) {

        let aX = null, bX = null, aZ = null, bZ = null;
        for (let i = 0; i < a.Vertices.length; i++) {
            if (aX === null || Math.abs(a.Vertices[i][0]) < aX) {
                aX = Math.abs(a.Vertices[i][0]);
            }

            if (a.Vertices[i][2] >= 0 && (aZ === null || a.Vertices[i][2] < aZ)) {
                aZ = a.Vertices[i][2];
            }
        }

        for (let i = 0; i < b.Vertices.length; i++) {
            if (bX === null || Math.abs(b.Vertices[i][0]) < bX) {
                bX = Math.abs(b.Vertices[i][0]);
            }

            if (b.Vertices[i][2] >= 0 && (bZ === null || b.Vertices[i][2] < bZ)) {
                bZ = b.Vertices[i][2];
            }
        }

        return aZ === null && bZ === null ? 0
            : aZ === null && bZ !== null ? 1
                : aZ !== null && bZ === null ? -1
                    : aZ < bZ ? 1
                        : aZ === bZ && aX < bX ? 1
                            : aZ === bZ && aX > bX ? 1
                                : aZ === bZ && aX === bX ? 0
                                    : -1;
    };

    this.Render = function () {

        // If we don't clear out the canvas, old frames will still show.
        that.CanvasContext.fillStyle = "rgb(0,0,0)";
        that.CanvasContext.fillRect(0, 0, that.ScreenWidth, that.ScreenHeight);

        // Get camera relative 3D coordinates.
        let cameraRelative3DPlanes = [];
        for (let i = 0; i < that.Planes.length; i++) {

            // Because planes are stored in global coordinates.
            let plane3d = that.GetLocalCoordinates(that.Planes[i]);

            // Get the camera's field of view. Ignoring Y.
            let cameraFieldOfView = {
                Vertices: [
                    [0, null, 0],
                    [-1 * that.Camera.DrawDistance * Math.tan(that.Camera.XFieldOfView), null, that.Camera.DrawDistance],
                    [that.Camera.DrawDistance * Math.tan(that.Camera.XFieldOfView), null, that.Camera.DrawDistance]
                ]
            };

            // Does plane have at least one vertex in the camera's field of view?
            let hasVertexInFront = false;
            for (let j = 0; j < plane3d.Vertices.length; j++) {
                if (that.RegionContains(cameraFieldOfView, plane3d.Vertices[j])) {
                    hasVertexInFront = true;
                    break;
                }
            }

            // Plane is visible. Store it.
            if (hasVertexInFront) {
                cameraRelative3DPlanes.push(plane3d);
            }

        }

        // Sort them by lowest distance positive vertex.
        cameraRelative3DPlanes.sort(that.SortByLeastZ);

        // Get camera relative 2D coordinates.
        let cameraRelative2DPlanes = [];
        for (let i = 0; i < cameraRelative3DPlanes.length; i++) {

            let plane2d = {
                Vertices: [],
                Color: cameraRelative3DPlanes[i].Color
            };

            // Calculate 2D vertices
            for (let j = 0; j < cameraRelative3DPlanes[i].Vertices.length; j++) {

                let vertex2d = that.Calc3DPointIn2D(cameraRelative3DPlanes[i].Vertices[j]);
                plane2d.Vertices.push(vertex2d);

            }

            cameraRelative2DPlanes.push(plane2d);

        }

        // Draw 2D planes
        for (let i = 0; i < cameraRelative2DPlanes.length; i++) {

            that.DrawPlaneIn2D(cameraRelative2DPlanes[i]);

        }

    };

    this.ExecuteMoveQueue = function () {

        if (that.MoveQueue.length > 0) {
            if (that.MoveQueue[0].Status === 'Complete') {
                that.MoveQueue.shift();
            }
            else if (that.MoveQueue[0].Status === 'Not Started') {
                that.MoveQueue[0].Status = 'Executing';
                that.MoveQueue[0].Move();
            }

            // If status is 'Executing' don't do anything.
        }
    };

};