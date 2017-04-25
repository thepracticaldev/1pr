'use strict';

if (typeof OnePRGame === 'undefined') {
    var OnePRGame = {};
}

OnePRGame.Engines = [];

OnePRGame.CurrentEngine = 0;

OnePRGame.Player = {
	// [Z, X]
    Position: [0, 0],
	// +X = 0, +Z = Math.PI / 2, -X = Math.PI, -Z = Math.PI * 3 / 2
    Direction: 0
};

// Map is a set of rows,
// each row has a set of tile IDs.
// Y------------------------------> +X
/* | */OnePRGame.Map = [
/* | */    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
/* | */    [0, 0, 0, 0, 0, 0, 0, 9, 0, 0],
/* | */    [0, 1, 2, 3, 4, 5, 6, 7, 8, 0],
/* | */    [0, 0, 0, 0, 0, 6, 0, 0, 0, 0],
/* | */    [0, 0, 0, 0, 0, 7, 0, 0, 0, 0],
/* | */    [0, 0, 0, 0, 0, 8, 0, 0, 0, 0],
/* | */    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
/* | */];
/* V */
/*   */
/*+Z */

// Tileset is the collection of tiles used in the game.
// I just added the 'Id' property for convenience, map refers to array index.
OnePRGame.Tileset = [{
    Id: 0,
    Color: '#000',
    Impassable: true
},
{
    Id: 1,
    Color: '#888',
    Text: 'GO',
    IsStart: true
},
{
    Id: 2,
    Color: '#0FF',
    Event: function () {
        OnePRGame.Engines[OnePRGame.CurrentEngine].PlayerAction('COMMIT!');
    }
},
{
    Id: 3,
    Color: '#0F0',
    Event: function () {
        OnePRGame.Engines[OnePRGame.CurrentEngine].PlayerAction('COMMIT!');
    }
},
{
    Id: 4,
    Color: '#FFF',
    Event: function () {
        OnePRGame.Engines[OnePRGame.CurrentEngine].PlayerAction('COMMIT!');
    }
},
{
    Id: 5,
    Color: '#F0F',
    Event: function () {
        OnePRGame.Engines[OnePRGame.CurrentEngine].PlayerAction('COMMIT!');
    }
},
{
    Id: 6,
    Color: '#F00',
    Event: function () {
        OnePRGame.Engines[OnePRGame.CurrentEngine].PlayerAction('COMMIT!');
    }
},
{
    Id: 7,
    Color: '#00F',
    Event: function () {
        OnePRGame.Engines[OnePRGame.CurrentEngine].PlayerAction('COMMIT!');
    }
},
{
    Id: 8,
    Color: '#FF0',
    Event: function () {
        OnePRGame.Player.Position = [2, 1];
        OnePRGame.Player.Direction = 0;
        OnePRGame.Engines[OnePRGame.CurrentEngine].Stop(function () {
            OnePRGame.Engines[OnePRGame.CurrentEngine].Run();
            OnePRGame.Engines[OnePRGame.CurrentEngine].PlayerAction('PULL REQUEST!');
            document.getElementsByClassName('controls-score')[0].textContent =
                parseInt(document.getElementsByClassName('controls-score')[0].textContent) + 200;
        });
    }
},
{
    Id: 9,
    Color: '#000',
    Event: function () {
        OnePRGame.Engines[OnePRGame.CurrentEngine].PlayerAction('EASTER EGG! +1000 POINTS!');
        document.getElementsByClassName('controls-score')[0].textContent =
            parseInt(document.getElementsByClassName('controls-score')[0].textContent) + 1000;
    }
}];

OnePRGame.LoadControls = function () {

    if (OnePRGame.Engines.length > 1) {

        document.getElementsByClassName('controls-swapengine')[0].addEventListener('click', function () {

            if (OnePRGame.CurrentEngine === 0) {
                OnePRGame.Engines[OnePRGame.CurrentEngine].Stop(function () {
                    document.getElementsByClassName('game-board-2d')[0].style.display = 'none';
                    document.getElementsByClassName('game-board-3d')[0].style.display = 'block';
                    OnePRGame.CurrentEngine = 1;
                    OnePRGame.Engines[OnePRGame.CurrentEngine].Run();
                });
            }
            else if (OnePRGame.CurrentEngine === 1) {
                OnePRGame.Engines[OnePRGame.CurrentEngine].Stop(function () {
                    document.getElementsByClassName('game-board-3d')[0].style.display = 'none';
                    document.getElementsByClassName('game-board-2d')[0].style.display = 'block';
                    OnePRGame.CurrentEngine = 0;
                    OnePRGame.Engines[OnePRGame.CurrentEngine].Run();
                });
            }

        }, false);

    }
    else {

        document.getElementsByClassName('controls-swapengine')[0].style.display = 'none';

    }

};

OnePRGame.Load = function () {

	// Get player start position
    for (let i = 0; i < OnePRGame.Map.length; i++) {
        for (let j = 0; j < OnePRGame.Map[i].length; j++) {
            if (OnePRGame.Tileset[OnePRGame.Map[i][j]].IsStart) {
                OnePRGame.Player.Position = [i, j];
            }
        }
    }

	// Add supported engines
    OnePRGame.Engines.push(new OnePRGame.Engine2D(OnePRGame, 'game-board-2d'));
    OnePRGame.Engines.push(new OnePRGame.Engine3D(OnePRGame, 'game-board-3d'));

    OnePRGame.Engines[OnePRGame.CurrentEngine].Run();

    OnePRGame.LoadControls();

    OnePRGame.Engines[OnePRGame.CurrentEngine].PlayerAction('INITIAL CHECKIN!');

    document.getElementById('loader').style.display = 'none';
};

(function loadGame() {

    OnePRGame.Load();

})();