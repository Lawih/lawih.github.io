// Se crea el lienzo donde se carga el juego
var game = new Phaser.Game(800, 320, Phaser.AUTO, 'game');

// Se crean los estados del juego
game.state.add('menu', menu);
game.state.add('poison', poison);
game.state.add('play', play);
game.state.add('end', end);
game.state.add('loose', loose);
game.state.add('drown', drown);

// Se llama al primer estado
game.state.start('menu');