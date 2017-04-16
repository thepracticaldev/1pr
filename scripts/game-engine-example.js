/*

Example engine interface.

if (typeof OnePRGame === 'undefined') {
    var OnePRGame = {};
}

// An example game engine. Defines what needs to be supported.
// Could make, say, a text-based game or an isometric perspective,
// in addition to the 2D and 3D currently available.
OnePRGame.EngineExample = function (context, gameBoardClassName) {

	// The map placeholder element's class name.
    this.GameBoardClassName = gameBoardClassName;

	// The map, tileset, player objects.
    this.Context = context;

	// Used for instancing.
    let that = this;

	// Start up engine. May already be started. Draw map, player, setup controls.
    this.Run = function () { };

    // Stop engine. May or may not have intervals to cancel.
	// Callback for when stop is complete.
    this.Stop = function (callback) { };

	// Handle the player action control.
	// Should probably be named something different. Just using it currently to display text.
    this.PlayerAction = function (text) { };
};

*/