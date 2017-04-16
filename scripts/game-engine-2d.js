'use strict';

if (typeof OnePRGame === 'undefined') {
    var OnePRGame = {};
}

OnePRGame.Engine2D = function (context, gameBoardClassName) {

    this.GameBoardClassName = gameBoardClassName;
    this.Context = context;
    this.ScreenWidth = 0;
    this.ScreenHeight = 0;
    this.HalfWidth = 0;
    this.HalfHeight = 0;
    this.MinTop = 0;
    this.MaxTop = 0;
    this.MinLeft = 0;
    this.MaxLeft = 0;
    let that = this;

    this.Run = function () {

        let gameBoardWindow = document.getElementsByClassName('game-board-window')[0];
        that.ScreenWidth = gameBoardWindow.clientWidth;
        that.ScreenHeight = gameBoardWindow.clientHeight;
        that.HalfWidth = that.ScreenWidth / 2;
        that.HalfHeight = that.ScreenHeight / 2;
        that.MinTop = that.ScreenHeight - (that.Context.Map.length * 100);
        that.MaxTop = 0;
        that.MinLeft = that.ScreenWidth - (that.Context.Map[0].length * 100);
        that.MaxLeft = 0;

        let gameBoard = document.getElementsByClassName(that.GameBoardClassName)[0];
        // Remove existing maps
        let existingGameBoardMaps = gameBoard.getElementsByClassName('game-board-2d-map');
        for (let i = 0; i < existingGameBoardMaps.length; i++) {
            gameBoard.removeChild(existingGameBoardMaps[i]);
        }

		// Remove existing controls
        let existingGameBoardControls = gameBoard.getElementsByClassName('game-board-2d-controls');
        if (existingGameBoardControls.length > 0) {
            gameBoard.removeChild(existingGameBoardControls[0]);
        }

        // Draw Map
        let map = document.createElement('div');
        map.className = 'game-board-2d-map';
        map.style.width = (that.Context.Map[0].length * 100) + 'px';

        for (let i = 0; i < that.Context.Map.length; i++) {
            for (let j = 0; j < that.Context.Map[i].length; j++) {
                let tile = document.createElement('div');
                tile.className = 'game-board-2d-tile';
                tile.style.backgroundColor = that.Context.Tileset[that.Context.Map[i][j]].Color;
                tile.textContent = that.Context.Tileset[that.Context.Map[i][j]].Text;
                map.appendChild(tile);
            }

            let rowBreak = document.createElement('div');
            rowBreak.className = 'game-board-2d-row-break';
            map.appendChild(rowBreak);
        }

        // Draw Player
        let player = document.createElement('div');
        player.className = 'game-board-2d-player';
        player.textContent = 'DEV';
        player.style.top = (100 * that.Context.Player.Position[0]) + 'px';
        player.style.left = (100 * that.Context.Player.Position[1]) + 'px';

        map.appendChild(player);

		// Append new map
        gameBoard.appendChild(map);

        // Translate Map
        that.TranslateMap();

        // Setup controls elements
        let controls2d = document.createElement('div');
        controls2d.className = 'game-board-2d-controls';
        controls2d.style.position = 'fixed';
        controls2d.style.bottom = '0px';
        controls2d.style.left = '0px';

        let upButton = document.createElement('button');
        upButton.type = 'button';
        upButton.className = 'game-board-2d-controls-up';
        upButton.textContent = 'Up';
        controls2d.appendChild(upButton);

        let lineBreak1 = document.createElement('br');
        controls2d.appendChild(lineBreak1);

        let leftButton = document.createElement('button');
        leftButton.type = 'button';
        leftButton.className = 'game-board-2d-controls-left';
        leftButton.textContent = 'Left';
        controls2d.appendChild(leftButton);

        let rightButton = document.createElement('button');
        rightButton.type = 'button';
        rightButton.className = 'game-board-2d-controls-right';
        rightButton.textContent = 'Right';
        controls2d.appendChild(rightButton);

        let lineBreak2 = document.createElement('br');
        controls2d.appendChild(lineBreak2);

        let downButton = document.createElement('button');
        downButton.type = 'button';
        downButton.className = 'game-board-2d-controls-down';
        downButton.textContent = 'Down';
        controls2d.appendChild(downButton);

        gameBoard.appendChild(controls2d);

		// Controls event listeners
        gameBoard.getElementsByClassName('game-board-2d-controls-up')[0].addEventListener('click', that.Up, false);

        gameBoard.getElementsByClassName('game-board-2d-controls-down')[0].addEventListener('click', that.Down, false);

        gameBoard.getElementsByClassName('game-board-2d-controls-left')[0].addEventListener('click', that.Left, false);

        gameBoard.getElementsByClassName('game-board-2d-controls-right')[0].addEventListener('click', that.Right, false);

    };

    this.Stop = function (callback) {

        let gameBoard = document.getElementsByClassName(that.GameBoardClassName)[0];

        gameBoard.getElementsByClassName('game-board-2d-controls-up')[0].removeEventListener('click', that.Up, false);

        gameBoard.getElementsByClassName('game-board-2d-controls-down')[0].addEventListener('click', that.Down, false);

        gameBoard.getElementsByClassName('game-board-2d-controls-left')[0].addEventListener('click', that.Left, false);

        gameBoard.getElementsByClassName('game-board-2d-controls-right')[0].addEventListener('click', that.Right, false);

        if (typeof callback !== 'undefined') {
            callback();
        }
    };

    this.Up = function () {
        // Face upwards regardless of the ability to move there.
        that.Context.Player.Direction = Math.PI * 3 / 2;

        // Where am I going?
        let targetTile = OnePRGame.Tileset[OnePRGame.Map[that.Context.Player.Position[0] - 1][that.Context.Player.Position[1]]];

        // Can I get there?
        if (targetTile !== null && !targetTile.Impassable) {
            that.Context.Player.Position[0]--;
            that.UpdatePlayerPosition();
            that.TranslateMap();
            if (typeof targetTile.Event === 'function') {
                targetTile.Event();
            }
        }
        else {
            // Maybe later add an audio queue to let the player know they can't move in this direction.
        }
    };

    this.Down = function () {
        // Face downwards regardless of the ability to move there.
        that.Context.Player.Direction = Math.PI / 2;

        // Where am I going?
        let targetTile = OnePRGame.Tileset[OnePRGame.Map[that.Context.Player.Position[0] + 1][that.Context.Player.Position[1]]];

        // Can I get there?
        if (targetTile !== null && !targetTile.Impassable) {
            that.Context.Player.Position[0]++;
            that.UpdatePlayerPosition();
            that.TranslateMap();
            if (typeof targetTile.Event === 'function') {
                targetTile.Event();
            }
        }
        else {
            // Maybe later add an audio queue to let the player know they can't move in this direction.
        }
    };

    this.Left = function () {
        // Face left regardless of the ability to move there.
        that.Context.Player.Direction = 0;

        // Where am I going?
        let targetTile = OnePRGame.Tileset[OnePRGame.Map[that.Context.Player.Position[0]][that.Context.Player.Position[1] - 1]];

        // Can I get there?
        if (targetTile !== null && !targetTile.Impassable) {
            that.Context.Player.Position[1]--;
            that.UpdatePlayerPosition();
            that.TranslateMap();
            if (typeof targetTile.Event === 'function') {
                targetTile.Event();
            }
        }
        else {
            // Maybe later add an audio queue to let the player know they can't move in this direction.
        }
    };

    this.Right = function () {
        // Face right regardless of the ability to move there.
        that.Context.Player.Direction = Math.PI;

        // Where am I going?
        let targetTile = OnePRGame.Tileset[OnePRGame.Map[that.Context.Player.Position[0]][that.Context.Player.Position[1] + 1]];

        // Can I get there?
        if (targetTile !== null && !targetTile.Impassable) {
            that.Context.Player.Position[1]++;
            that.UpdatePlayerPosition();
            that.TranslateMap();
            if (typeof targetTile.Event === 'function') {
                targetTile.Event();
            }
        }
        else {
            // Maybe later add an audio queue to let the player know they can't move in this direction.
        }
    };

    this.UpdatePlayerPosition = function () {
        let player = document.getElementsByClassName(that.GameBoardClassName)[0].getElementsByClassName('game-board-2d-player')[0];
        player.style.top = (100 * that.Context.Player.Position[0]) + 'px';
        player.style.left = (100 * that.Context.Player.Position[1]) + 'px';
    };

    this.PlayerAction = function (text) {

        let gameBoard = document.getElementsByClassName(that.GameBoardClassName)[0];
        let gameBoardPlayer = gameBoard.getElementsByClassName('game-board-2d-player')[0];
        let gameBoardPlayerActions = gameBoardPlayer.getElementsByClassName('game-board-2d-player-action');
        if (gameBoardPlayerActions.length > 0) {
            gameBoardPlayer.removeChild(gameBoardPlayerActions[0]);
        }

        let newPlayerAction = document.createElement('div');
        newPlayerAction.className = 'game-board-2d-player-action';
        newPlayerAction.textContent = text;
        gameBoardPlayer.appendChild(newPlayerAction);

    };

    this.TranslateMap = function () {

        let gameBoard = document.getElementsByClassName(that.GameBoardClassName)[0];
        let gameBoardMap = gameBoard.getElementsByClassName('game-board-2d-map')[0];

        gameBoardMap.style.top = Math.min(Math.max((-100 * that.Context.Player.Position[0]) + that.HalfHeight - 50, that.MinTop), that.MaxTop) + 'px';
        gameBoardMap.style.left = Math.min(Math.max((-100 * that.Context.Player.Position[1]) + that.HalfWidth - 50, that.MinLeft), that.MaxLeft) + 'px';

    };

};
