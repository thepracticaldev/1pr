var OnePRGame3d = {
    Camera: {
        Position: [0.5, 0.5, 2.5],
        Direction: Math.PI,
		DrawDistance: 4,
        XFieldOfView: 100 * Math.PI / 180,
        YFieldOfView: 100 * Math.PI / 180
    },
    ScreenWidth: 600,
    ScreenHeight: 300,
    Context: document.getElementsByClassName('game-board')[0].getContext('2d'),

	/*

		Y (height)
		|
		|   Z (depth)
		|   /
		|  /
		| /
		|/
		+----------X (width)

		Same map as the 2D game. Donut shaped course, just different starting spot.
		Array lists horizontal walls followed by vertical walls.
		Plane array indices on map:

		Z

		+----------5----------+
		|  V                  |
		|                     |
		|      +---4---+      |
		|      |       |      |
		6      7       8      9
		|      +---3---+      |
		|                     |
		|                     |
		Y----------2----------+    X

		V = camera start

		Planes 0 and 1 are the floor and ceiling.
	*/

    Planes: [
        {  // Ground
            Vertices: [
                [0, 0, 0],
                [0, 0, 3],
                [3, 0, 3],
                [3, 0, 0]
			],
            Color: 'rgb(30,150,30)'
        },
        {  // Sky
            Vertices: [
                [0, 1, 0],
                [0, 1, 3],
                [3, 1, 3],
                [3, 1, 0]
			],
            Color: 'rgb(50,50,50)'
        },
        {  // 2
            Vertices: [
                [0, 0, 0],
				[3, 0, 0],
				[3, 1, 0],
				[0, 1, 0],
			],
            Color: 'rgb(2,22,222)'
        },
        {  // 3
            Vertices: [
                [1, 0, 1],
				[2, 0, 1],
				[2, 1, 1],
				[1, 1, 1],
			],
            Color: 'rgb(3,33,33)'
        },
        {  // 4
            Vertices: [
                [1, 0, 2],
				[2, 0, 2],
				[2, 1, 2],
				[1, 1, 2],
			],
            Color: 'rgb(4,44,44)'
        },
        {  // 5
            Vertices: [
                [0, 0, 3],
				[3, 0, 3],
				[3, 1, 3],
				[0, 1, 3],
			],
            Color: 'rgb(5,55,55)'
        },
        {  // 6
            Vertices: [
                [0, 0, 0],
				[0, 0, 3],
				[0, 1, 3],
				[0, 1, 0],
			],
            Color: 'rgb(255,255,255)'
        },
        {  // 7
            Vertices: [
                [1, 0, 1],
				[1, 0, 2],
				[1, 1, 2],
				[1, 1, 1],
			],
            Color: 'rgb(77,77,77)'
        },
        {  // 8
            Vertices: [
                [2, 0, 1],
				[2, 0, 2],
				[2, 1, 2],
				[2, 1, 1],
			],
            Color: 'rgb(8,8,88)'
        },
        {  //  9
            Vertices: [
				[3, 0, 0],
				[3, 0, 3],
				[3, 1, 3],
				[3, 1, 0]
			],
            Color: 'rgb(99,9,9)'
        }
    ]
};

OnePRGame3d.Load = function () {

	// Applying patterns to the 2D image doesn't work right.
    ////OnePRGame3d.StoneBrick = OnePRGame3d.Context.createPattern(document.getElementsByClassName('stone-bricks')[0], 'repeat');
    ////for (let i = 2; i < OnePRGame3d.Planes.length; i++) {
    ////    OnePRGame3d.Planes[i].Color = OnePRGame3d.StoneBrick;
    ////}

    OnePRGame3d.HalfWidth = OnePRGame3d.ScreenWidth / 2;
    OnePRGame3d.HalfHeight = OnePRGame3d.ScreenHeight / 2;

    OnePRGame3d.Camera.XFocalLength = OnePRGame3d.HalfWidth / Math.tan(OnePRGame3d.Camera.XFieldOfView / 2);
    OnePRGame3d.Camera.YFocalLength = OnePRGame3d.HalfHeight / Math.tan(OnePRGame3d.Camera.YFieldOfView / 2);

    function rotatePointAroundCameraDirection(point3d) {
        let x = point3d[0];
        let z = point3d[2];

        let cosRY = Math.cos(OnePRGame3d.Camera.Direction);
        let sinRY = Math.sin(OnePRGame3d.Camera.Direction);
        let tempz = z;
        let tempx = x;

        x = Math.round(((tempx * cosRY) + (tempz * sinRY)) * 100) / 100;
        z = Math.round(((tempx * -sinRY) + (tempz * cosRY)) * 100) / 100;

        return [x, point3d[1], z];
    }

    function getLocalCoordinates(plane3d) {

        let localPlane = {
            Vertices: [],
            Color: plane3d.Color
        }

        for (let i = 0; i < plane3d.Vertices.length; i++) {

	        // Camera position modification
            let vertex = [
                plane3d.Vertices[i][0] - OnePRGame3d.Camera.Position[0],
                plane3d.Vertices[i][1] - OnePRGame3d.Camera.Position[1],
                plane3d.Vertices[i][2] - OnePRGame3d.Camera.Position[2]
            ]

            // Camera direction modification
            vertex = rotatePointAroundCameraDirection(vertex);

            localPlane.Vertices.push(vertex);
        }

        return localPlane;
    }

    function calc3DPointIn2D(point3d) {

		// Using projection, not using ray casting. Maybe some other time.

        let x3d = point3d[0];
        let y3d = point3d[1];
        let z3d = point3d[2];

        // Projection
        let x2d = z3d == 0 && x3d > 0 ? OnePRGame3d.HalfWidth : z3d == 0 && x3d < 0 ? -OnePRGame3d.HalfWidth : (x3d * (OnePRGame3d.Camera.XFocalLength / z3d));

        if (z3d < 0) {
            // Honestly, couldn't figure out how to calculate correct 2D x-coords
            // for vertices behind the camera, but this works for this map.
			// Coefficient would need to be larger on a larger map.
            x2d = -6 * x2d;
        }

        let y2d = z3d == 0 && y3d > 0 ? OnePRGame3d.HalfHeight : z3d == 0 && y3d < 0 ? -OnePRGame3d.HalfHeight : (y3d * (OnePRGame3d.Camera.YFocalLength / z3d));

        if (z3d < 0) {
            y2d = -6 * y2d;
        }

        // So, point (0, 0) on the canvas is the upper left corner and positive is in
        // the direction of the bottom of the screen.
        // That means everything is mirrored over the Y, and the code here adjusts for that.
		// And we want (0, 0) in the middle, so we move it to the center of the screen.
        return [x2d + OnePRGame3d.HalfWidth, -y2d + OnePRGame3d.HalfHeight];

    }

    function drawPlaneIn2D(plane2d) {

        OnePRGame3d.Context.beginPath();

        for (let i = 0; i < plane2d.Vertices.length; i++) {

            if (i == 0) {
                OnePRGame3d.Context.moveTo.apply(OnePRGame3d.Context, plane2d.Vertices[i]);
            }
            else {
                OnePRGame3d.Context.lineTo.apply(OnePRGame3d.Context, plane2d.Vertices[i]);
            }

        }

        OnePRGame3d.Context.closePath();
        OnePRGame3d.Context.fillStyle = plane2d.Color;
        OnePRGame3d.Context.fill();

    }

    function regionContains(region, location) {
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
    }

    function sortByLeastZ(a, b) {

        let aX = null, bX = null, aZ = null, bZ = null;
        for (let i = 0; i < a.Vertices.length; i++) {
            if (aX == null || Math.abs(a.Vertices[i][0]) < aX) {
                aX = Math.abs(a.Vertices[i][0]);
            }

            if (a.Vertices[i][2] >= 0 && (aZ == null || a.Vertices[i][2] < aZ)) {
                aZ = a.Vertices[i][2];
            }
        }

        for (let i = 0; i < b.Vertices.length; i++) {
            if (bX == null || Math.abs(b.Vertices[i][0]) < bX) {
                bX = Math.abs(b.Vertices[i][0]);
            }

            if (b.Vertices[i][2] >= 0 && (bZ == null || b.Vertices[i][2] < bZ)) {
                bZ = b.Vertices[i][2];
            }
        }

        return aZ == null && bZ == null ? 0
            : aZ == null && bZ != null ? 1
            : aZ != null && bZ == null ? -1
			: aZ < bZ ? 1
			: aZ == bZ && aX < bX ? 1
            : aZ == bZ && aX > bX ? 1
            : aZ == bZ && aX == bX ? 0
			: -1;
    };

    function render() {

		// If we don't clear out the canvas, old frames will still show.
        OnePRGame3d.Context.fillStyle = "rgb(0,0,0)";
        OnePRGame3d.Context.fillRect(0, 0, OnePRGame3d.ScreenWidth, OnePRGame3d.ScreenHeight);

        // Get camera relative 3D coordinates.
        let cameraRelative3DPlanes = [];
        for (let i = 0; i < OnePRGame3d.Planes.length; i++) {

            // Because planes are stored in global coordinates.
            let plane3d = getLocalCoordinates(OnePRGame3d.Planes[i]);

            // Get the camera's field of view. Ignoring Y.
            let cameraFieldOfView = {
                Vertices: [
                    [0, null, 0],
                    [-1 * OnePRGame3d.Camera.DrawDistance * Math.tan(OnePRGame3d.Camera.XFieldOfView), null, OnePRGame3d.Camera.DrawDistance],
                    [OnePRGame3d.Camera.DrawDistance * Math.tan(OnePRGame3d.Camera.XFieldOfView), null, OnePRGame3d.Camera.DrawDistance]
                ]
            };

            // Does plane have at least one vertex in the camera's field of view?
            let hasVertexInFront = false;
            for (let j = 0; j < plane3d.Vertices.length; j++) {
                if (regionContains(cameraFieldOfView, plane3d.Vertices[j])) {
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
        cameraRelative3DPlanes.sort(sortByLeastZ);

        // Get camera relative 2D coordinates.
        let cameraRelative2DPlanes = [];
        for (let i = 0; i < cameraRelative3DPlanes.length; i++) {

			let plane2d = {
                Vertices: [],
                Color: cameraRelative3DPlanes[i].Color
			}

			// Calculate 2D vertices
            for (let j = 0; j < cameraRelative3DPlanes[i].Vertices.length; j++) {

                let vertex2d = calc3DPointIn2D(cameraRelative3DPlanes[i].Vertices[j]);
				plane2d.Vertices.push(vertex2d);

            }

            cameraRelative2DPlanes.push(plane2d);

        }

		// Draw 2D planes
        for (let i = 0; i < cameraRelative2DPlanes.length; i++) {

            drawPlaneIn2D(cameraRelative2DPlanes[i]);

        }

    }

	// This is the frame rate (1000/50 = 20 frames/sec)
	// Mainstream games: 60 FPS is best, 30 FPS low.
    var loop = setInterval(function () { render(); }, 50);

};

OnePRGame3d.MoveForward = function () {
    // Disable move button
    OnePRGame3d.Moving = true;

    let isX = OnePRGame3d.Camera.Direction != Math.PI && OnePRGame3d.Camera.Direction != 0;
    let isAdd = OnePRGame3d.Camera.Direction != Math.PI && OnePRGame3d.Camera.Direction != Math.PI / 2;

    let startPosition = parseFloat(OnePRGame3d.Camera.Position[isX ? 0 : 2]);
    let endPosition = startPosition + (isAdd ? 1 : -1);

    var frame = function () {
        if ((isAdd && OnePRGame3d.Camera.Position[isX ? 0 : 2] >= endPosition) || (!isAdd && OnePRGame3d.Camera.Position[isX ? 0 : 2] <= endPosition)) {
            OnePRGame3d.Camera.Position[isX ? 0 : 2] = endPosition;
            clearInterval(intervalId);

            let actionText = 'COMMIT!';
            if (endPosition == 0.5 || endPosition == 2.5) {
                OnePRGame3d.TurnLeft();

				// if position = starting point, add 200 points.
                if (OnePRGame3d.Camera.Position[0] == 0.5 && OnePRGame3d.Camera.Position[2] == 2.5) {
                    document.getElementsByClassName('controls-score')[0].textContent =
                        parseInt(document.getElementsByClassName('controls-score')[0].textContent) + 200;
                    actionText = 'PULL REQUEST!';
                }
            }
            else {
                OnePRGame3d.Moving = false;
            }

            let gameBoardWindowElement = document.getElementsByClassName('game-board-window')[0];
            gameBoardWindowElement.removeChild(gameBoardWindowElement.childNodes[4]);

            let playerAction = document.createElement('div');
            playerAction.className = 'action';
            playerAction.textContent = actionText;
            gameBoardWindowElement.appendChild(playerAction);
        }
        else {
            OnePRGame3d.Camera.Position[isX ? 0 : 2] = (parseFloat(OnePRGame3d.Camera.Position[isX ? 0 : 2]) + (isAdd ? 0.05 : -0.05)).toPrecision(3);
        }
    }

    let intervalId = setInterval(frame, 50);
};

OnePRGame3d.TurnLeft = function () {
    // Disable move button
    OnePRGame3d.Moving = true;

    let startPosition = parseFloat(OnePRGame3d.Camera.Direction);
    let endPosition = startPosition + (Math.PI / 2);

    var frame = function () {
        if (OnePRGame3d.Camera.Direction >= endPosition) {
            OnePRGame3d.Camera.Direction = endPosition;
            clearInterval(intervalId);
            if (OnePRGame3d.Camera.Direction >= 2 * Math.PI) {
                OnePRGame3d.Camera.Direction = 0;
            }

            OnePRGame3d.Moving = false;
        }
        else {
            OnePRGame3d.Camera.Direction = parseFloat(OnePRGame3d.Camera.Direction) + (Math.PI / 20);
        }
    }

    let intervalId = setInterval(frame, 50);
};

OnePRGame3d.LoadControls = function () {

    document.getElementsByClassName('controls-move')[0].addEventListener('click', function () {

        if (!OnePRGame3d.Moving) {
            OnePRGame3d.MoveForward();
        }

    }, false);

    document.getElementsByClassName('controls-autoplay')[0].addEventListener('click', function () {

        setInterval(function () { if (!OnePRGame3d.Moving) { document.getElementsByClassName('controls-move')[0].click() } }, 50);

    }, false);
};


(function loadGame3d() {

    OnePRGame3d.Load();
    OnePRGame3d.LoadControls();

    let playerAction = document.createElement('div');
    playerAction.className = 'action';
    playerAction.textContent = 'INITIAL CHECKIN!';
    document.getElementsByClassName('game-board-window')[0].appendChild(playerAction);

})();