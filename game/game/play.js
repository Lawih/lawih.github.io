// Variables usadas en el juego
var level;
var layer;
var cursors;
var girl;
var poison;
var stars;

var play = {

    // Las imagenes y el mapa son cargados en el juego
    preload: function () {

        game.load.tilemap('level', 'resources/map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'resources/platformer_tiles.png', 16, 16);
        game.load.image('background', 'resources/background.png');
        game.load.image('poison', 'resources/poison.png');
        game.load.image('star', 'resources/star.png');
        game.load.spritesheet('girl', 'resources/smallgirl.png', 32, 32);

    },

    // Crea el juego
    create: function () {

        // Agregar el fondo al juego
        game.add.sprite(0, 0, 'background');

        // Agregar nivel
        level = game.add.tilemap('level');

        // Agrega imagenes usadas para el mapa
        level.addTilesetImage('platformer-tiles', 'tiles');

        // Crea la capa 
        layer = level.createLayer('world');

        // Le dice al juego que se usara fisica
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Hace que el mapa tome el espacio del canvas
        layer.resizeWorld();

        // Habilitar las flechas en el teclado
        cursors = game.input.keyboard.createCursorKeys();

        // Asignar colisiones en el juego
        this.setCollisions();

        // Crea la chica en el juego
        this.createGirl();

        // Crea hiedra venenosa en el juego
        this.createPoison();

        this.createStar();

    },

    // Especifica que baldosas del mapa son para colisionar 
    setCollisions: function () {
        level.setCollisionBetween(3, 12);
        level.setCollisionBetween(28, 56);
        level.setCollisionBetween(63, 75);
        level.setCollisionBetween(82, 114);
    },

    createGirl: function () {

        // Agrega la chica
        girl = game.add.sprite(16, 50, 'girl');

        // Hace que la chica pueda saltar
        game.physics.enable(girl);
        girl.body.tilePadding.set(32);

        // Valor de gravedad de la chica (para las caidas)
        game.physics.arcade.gravity.y = 200;

        //  Animacion para moverse a la derecha
        girl.animations.add('right', [143, 145, 147, 149, 151], 273, true);

        //  Animacion para moverse a la izquierda
        girl.animations.add('left', [117, 119, 121, 123, 125], 273, true);

        //  Animacion cuando gana
        girl.animations.add('win', [26, 27, 28, 29, 30, 31, 32], 273, true);

        //  Animacion cuando es tocada por hiedra
        girl.animations.add('poison', [26, 27, 28, 29, 30, 31, 32], 273, true);

        // La camara muestra siempre a la chica
        game.camera.follow(girl);

    },

    createPoison: function () {

        // Crea un grupo de hiedra venenosa
        poison = game.add.group();
        poison.enableBody = true;

        // Asigna cada hiedra en una posicion del juego
        var plant = poison.create(416, 100, 'poison');

        // Asigna gravedad a la hiedra
        plant.body.gravity.y = 10;

        // Hace que la hiedra salte un poco al caer
        plant.body.bounce.y = 0.7 + Math.random() * 0.2;

        plant = poison.create(416, 220, 'poison');
        plant.body.gravity.y = 10;
        plant.body.bounce.y = 0.3 + Math.random() * 0.2;

        plant = poison.create(500, 60, 'poison');
        plant.body.gravity.y = 10;
        plant.body.bounce.y = 0.7 + Math.random() * 0.2;

        plant = poison.create(760, 230, 'poison');
        plant.body.gravity.y = 10;
        plant.body.bounce.y = 0.7 + Math.random() * 0.2;

        plant = poison.create(1400, 100, 'poison');
        plant.body.gravity.y = 10;
        plant.body.bounce.y = 0.7 + Math.random() * 0.2;

    },

    createStar: function () {

        // Crea un grupo de estrellas
        stars = game.add.group();
        stars.enableBody = true;

        // Asigna cada estrella en una posicion del juego
        var star = poison.create(0, 320, 'star');

        // Asigna gravedad a la estrella
        star.body.gravity.y = 10;

        // Hace que la estrella salte un poco al caer
        star.body.bounce.y = 0.7 + Math.random() * 0.2;

        star = stars.create(160, 400, 'star');

        // Asigna gravedad a la estrella
        star.body.gravity.y = 10;

        // Hace que la estrella salte un poco al caer
        star.body.bounce.y = 0.7 + Math.random() * 0.2;

    },

    // Actualiza el juego
    update: function () {

        // Colision entre la chica y el mapa
        game.physics.arcade.collide(girl, layer);

        // Colision entre la hiedra y el mapa
        game.physics.arcade.collide(poison, layer);

        // Colision entre las estrellas y el mapa
        game.physics.arcade.collide(stars, layer);

        // Si la chica toca hiedra venenosa
        game.physics.arcade.overlap(girl, poison, this.loose, null, this);

        // Si la chica toca una estrella
        game.physics.arcade.overlap(girl, stars, this.increaseScore, null, this);

        // Mover a la chica
        this.moveGirl();

    },

    // Movimientos del jugador
    moveGirl: function () {

        // Inicia con velocidad 0
        girl.body.velocity.x = 0;

        // Al presionar izquierda
        if (cursors.left.isDown) {
            girl.body.velocity.x = -100;
            girl.animations.play('left');
        } else if (cursors.right.isDown) {
            //Al presionar derecha
            girl.body.velocity.x = 100;
            girl.animations.play('right');
        } else {
            // Cuando no se hace nada, se detiene
            girl.animations.stop();
            girl.frame = 26;
        }

        // Ver que este en el suelo cuando salte
        if (cursors.up.isDown && girl.body.onFloor()) {
            girl.body.velocity.y = -150;
        }

        // Cuando encuentra la posicion de la cueva, se termina
        if (girl.body.x >= 1500 && girl.body.y <= 97) {
            game.state.start('end');
        }

        // Si cae al agua pierde
        if (girl.body.y >= 320) {
            game.state.start('drown');
        }

    },

    // Muestra el mensaje de perder
    loose: function () {
        game.state.start('loose');
    }

}