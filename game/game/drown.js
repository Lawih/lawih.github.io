var drown = {
    // Cargar imagen de fondo
    preload: function () {
        game.load.image('background', 'resources/drown.png');
    },

    create: function () {

        // Agregar fondo
        game.add.sprite(0, 0, 'background');

        var rKey = game.input.keyboard.addKey(Phaser.Keyboard.R);

        rKey.onDown.addOnce(this.start, this);
    },

    start: function () {
        game.state.start('play');
    }
}