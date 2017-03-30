var OnePRGame = {
    Map: [{
        Row: [
            {
                Color: '#000'
            },
            {
                Color: '#000'
            },
            {
                Color: '#000'
            },
            {
                Color: '#000'
            },
            {
                Color: '#000'
            }
        ]
    },
    {
        Row: [
            {
                Color: '#000'
            },
            {
                Color: '#888',
                Text: 'GO',
                Move: 'Down',
                IsStart: true,
                OnArrive: function (user) {
                    return user.Score += 200;
                }
            },
            {
                Color: '#FF0',
                Move: 'Left'
            },
            {
                Color: '#00F',
                Move: 'Left'
            },
            {
                Color: '#000'
            }
        ]
    },
    {
        Row: [
            {
                Color: '#000'
            },
            {
                Color: '#0FF',
                Move: 'Down'
            },
            {
                Color: '#000'
            },
            {
                Color: '#F00',
                Move: 'Up'
            },
            {
                Color: '#000'
            }
        ]
    },
    {
        Row: [
            {
                Color: '#000'
            },
            {
                Color: '#0F0',
                Move: 'Right'
            },
            {
                Color: '#FFF',
                Move: 'Right'
            },
            {
                Color: '#F0F',
                Move: 'Up'
            },
            {
                Color: '#000'
            }
        ]
    },
    {
        Row: [
            {
                Color: '#000'
            },
            {
                Color: '#000'
            },
            {
                Color: '#000'
            },
            {
                Color: '#000'
            },
            {
                Color: '#000'
            }
        ]
    }]
};

OnePRGame.Load = function () {
    let startRow = 0, startCol = 0;

    for (let i = 0; i < OnePRGame.Map.length; i++) {
        for (let j = 0; j < OnePRGame.Map[i].Row.length; j++) {
            if (OnePRGame.Map[i].Row[j].IsStart) {
                startRow = i;
                startCol = j;
            }

            OnePRGame.Map[i].Row[j].Row = i;
            OnePRGame.Map[i].Row[j].Column = j;
        }
    }

    /*

{{#Map}}
{{#Row}}
<div class="game-board-tile" data-row="{{Row}}" data-column="{{Column}}" style="background-color:{{Color}}">{{Text}}</div>
{{/Row}}
<div class="game-board-row-break"></div>
{{/Map}}

    */

    for (let i = 0; i < OnePRGame.Map.length; i++) {
        for (let j = 0; j < OnePRGame.Map[i].Row.length; j++) {
            let tile = document.createElement('div');
            tile.className = 'game-board-tile';
            tile.setAttribute('data-row', OnePRGame.Map[i].Row[j].Row);
            tile.setAttribute('data-column', OnePRGame.Map[i].Row[j].Column);
            tile.style.backgroundColor = OnePRGame.Map[i].Row[j].Color;
            tile.textContent = OnePRGame.Map[i].Row[j].Text;
            document.getElementsByClassName('game-board')[0].appendChild(tile);
        }

        let rowBreak = document.createElement('div');
        rowBreak.className = 'game-board-row-break';
        document.getElementsByClassName('game-board')[0].appendChild(rowBreak);

    }

    OnePRGame.LoadUser(startRow, startCol);
    OnePRGame.LoadControls();
};

OnePRGame.LoadUser = function (startRow, startCol) {
    let player = document.createElement('div');
    player.className = 'player';
    player.textContent = 'X';
    player.style.top = (100 * startRow) + 'px';
    player.style.left = (100 * startCol) + 'px';
    document.getElementsByClassName('game-board')[0].appendChild(player);

    OnePRGame.Player = {
        Id: 1,
        Row: startRow,
        Column: startCol,
        Score: 0
    };
};

OnePRGame.LoadControls = function () {

    document.getElementsByClassName('controls-move')[0].addEventListener('click', function () {

        let direction = OnePRGame.Map[OnePRGame.Player.Row].Row[OnePRGame.Player.Column].Move;
        switch (direction) {
            case 'Up':
                OnePRGame.Player.Row--;
                break;
            case 'Down':
                OnePRGame.Player.Row++;
                break;
            case 'Left':
                OnePRGame.Player.Column--;
                break;
            case 'Right':
                OnePRGame.Player.Column++;
                break;
        }

        let player = document.getElementsByClassName('player')[0];
        player.style.top = (100 * OnePRGame.Player.Row) + 'px';
        player.style.left = (100 * OnePRGame.Player.Column) + 'px';

        if (typeof OnePRGame.Map[OnePRGame.Player.Row].Row[OnePRGame.Player.Column].OnArrive !== 'undefined') {
            OnePRGame.Map[OnePRGame.Player.Row].Row[OnePRGame.Player.Column].OnArrive(OnePRGame.Player);
        }

        document.getElementsByClassName('controls-score')[0].textContent = OnePRGame.Player.Score;

    }, false);

};

(function loadGame() {

    OnePRGame.Load();

})();