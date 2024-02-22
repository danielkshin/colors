// Player class
class Player {
    constructor(x, y) {
        this.offset = 0.13;
        this.x = x + this.offset;
        this.y = y + this.offset;
        this.w = 25 - this.offset * 2;
        this.h = 25 - this.offset * 2;
        this.xv = 0;
        this.yv = 0;
        this.g = 0.5;
        this.speed = 3;
        this.onGround = false;
        this.previewBars = false;
        this.colorIndex = 1;
        this.color = colors[this.colorIndex];
        this.colorChanged = false;
        this.inBlock = false;
    }

    // Update player velocity / color
    update() {
        if (keys[37] || keys[65]) {
            this.xv = -this.speed;
        } else if (keys[39] || keys[68]) {
            this.xv = this.speed;
        } else {
            this.xv = 0;
        }

        if ((keys[38] || keys[87]) && this.onGround == true) {
            this.yv = -8.75;
            this.onGround = false;
        }

        if (keys[32]) {
            if (!this.colorChanged)
                this.changeColor();
        } else {
            this.colorChanged = false;
        }

        this.previewBars = keys[16];

        if (this.inBlock) {
            this.color = color(240, 240, 240);
        } else {
            this.color = colors[this.colorIndex]
        }
    }

    // Change player color
    changeColor() {
        if (!this.inBlock) {
            this.colorIndex += 1;
            this.colorChanged = true;
            if (this.colorIndex > colors.length - 2) {
                this.colorIndex = 1;
            }
            this.color = colors[this.colorIndex];
        }
    }

    // Get previous / next player color
    getColor(index) {
        if (index > colors.length - 2) {
            return colors[1];
        } else if (index < 1) {
            return colors[colors.length - 2];
        } else {
            return colors[index];
        }
    }

    // Display player
    display() {
        noStroke();
        fill(this.color);
        rect(this.x - this.offset, this.y - this.offset, 25, 25);

        // Color preview bars
        if (this.previewBars) {
            fill(this.getColor(this.colorIndex - 1));
            rect(this.x - this.offset - 4, this.y - this.offset + 3, 2, 19);

            fill(this.getColor(this.colorIndex + 1));
            rect(this.x - this.offset + 27, this.y - this.offset + 3, 2, 19);
        }
    }
}


// Portal class
class Portal {
    constructor(x, y, colorIndex) {
        this.x = x;
        this.y = y;
        this.w = 25;
        this.h = 25;
        this.colorIndex = colorIndex;
        this.color = allColors[this.colorIndex];
    }

    // Display portal
    display() {
        strokeWeight(2);
        stroke(this.color);
        noFill();
        rect(this.x, this.y, this.w, this.h);
    }
}

// Block class
class Block {
    constructor(x, y, colorIndex) {
        this.x = x;
        this.y = y;
        this.w = 25;
        this.h = 25;
        this.colorIndex = colorIndex;
        this.color = colors[this.colorIndex];
    }

    // Display class
    display() {
        noStroke();
        fill(this.color);
        rect(this.x, this.y, this.w, this.h);
    }
}

// Transition class
class Transition {
    constructor(game) {
        this.game = game;
        this.reset();
    }

    // Reset transition
    reset() {
        this.timer = 0;
        this.timerInc = 0;
        this.type = '';
        this.complete = true;
        this.scene = 0;
    }

    // Display transition
    display() {
        if (this.type != '') {
            this.timer += this.timerInc;
            if (this.type != 'startGame') {
                this.game.player.xv = 0;
                this.game.player.yv = 0;
            }
        }

        // Death transition
        if (this.type == 'death') {
            this.timerInc = 25;

            noStroke();
            fill(colors[this.game.levelIndex + 2]);
            rect(this.timer * 0.8 - 500, 0, this.timer, 550);

            if (this.timer > 500) {
                this.game.reset();
            }

            if (this.timer > 1500) {
                this.reset();
            }
        }
        // Level complete / game start transitions
        else if (this.type == 'levelComplete' || this.type == 'startGame' || this.type == 'hint') {
            this.timerInc = 1;

            noStroke();
            fill(red(colors[this.game.levelIndex + 2]), green(colors[this.game.levelIndex + 2]), blue(colors[this.game.levelIndex + 2]), sin(this.timer * 0.01) * 1000);
            rect(0, 0, 700, 550);

            textFont('monospace');
            textAlign(CENTER);
            fill(250, 250, 250, sin((this.timer) * 0.01) * 1000 - 500);
            if (this.type == 'hint') {
                textSize(15);
                text(levels[this.game.levelIndex].hint, 350, 230);
            } else {
                textSize(25);
                text(levels[this.game.levelIndex].name, 350, 230);
            }

            if (this.timer > 150) {
                if (this.type == 'startGame')
                    this.game.scene = 'game';
                this.game.reset();
            }
            if (sin(this.timer * 0.01) * 1000 < 0) {
                this.reset();
            }
        }
    }

    // Trigger transition
    trigger(type) {
        this.complete = false;
        this.type = type;
    }
}

// Menu class
class Menu {
    constructor() {
        this.timer = 0;
    }

    // Display menu
    display() {
        this.timer++;

        textFont('monospace');
        textAlign(CENTER);

        for (let i = 0; i < 6; i++) {
            textSize(60);
            fill(red(allColors[3 + i]), green(allColors[3 + i]), blue(allColors[3 + i]), sin((this.timer - i * 20) / 70) * 500);
            text('colors'.substring(i, i + 1), 175 + i * 70, 230);
        }

        for (let i = 0; i < 11; i++) {
            textSize(30);
            fill(60, 60, 60, sin((this.timer - i * 10 - 220) / 70) * 500);
            text('daniel shin'.substring(i, i + 1), 175 + i * 35, 230);
        }

        textSize(12);
        fill(60, 60, 60, sin(this.timer / 70) * 500);
        text('press [space] to play', 350, 290);

        fill(60, 60, 60, -sin(this.timer / 70) * 500);
        text('created with p5.js', 350, 290);

        textSize(10);
        fill(100, 100, 100);
        text('movement          color        hint\n[w] [a] [d]   preview [shift]    [h]  \n[<] [^] [>]    change [space]         ', 350, 500);
    }

}

// Game class
class Game {
    constructor() {
        this.transition = new Transition(this);
        this.menu = new Menu();
        this.levelIndex = 0;
        this.scene = 'menu';
    }

    // Reset level
    reset() {
        this.generateLevel(levels[this.levelIndex]['level']);
    }

    // Generate level
    generateLevel(level) {
        this.blocks = [];
        for (let i = 0; i < level.length; i++) {
            for (let j = 0; j < level[i].length; j++) {
                if (level[i][j] == 'p') {
                    this.player = new Player(j * 25, i * 25);
                } else if (level[i][j] == 'o') {
                    this.portal = new Portal(j * 25, i * 25, this.levelIndex + 3);
                } else if (level[i][j] != ' ') {
                    this.blocks.push(new Block(j * 25, i * 25, int(level[i][j])));
                }
            }
        }
    }

    // Check for collisions
    rectCollision(r1, r2) {
        return (
            r1.x < r2.x + r2.w &&
            r1.y < r2.y + r2.h &&
            r1.x + r1.w > r2.x &&
            r1.y + r1.h > r2.y
        );
    }

    // Game collisions
    checkCollisions() {
        // Player x axis movement
        this.player.x += this.player.xv;

        // Game bounds
        if (this.player.x < 0) {
            this.player.x = 0;
        } else if (this.player.x + this.player.w > 700) {
            this.player.x = 700 - this.player.w;
        }

        // Collision with block of same color (in block)
        for (const block of this.blocks) {
            if (this.player.colorIndex == block.colorIndex) {
                if (this.rectCollision(this.player, block)) {
                    this.player.onGround = false;
                    this.player.inBlock = true;
                    break;
                } else {
                    this.player.inBlock = false;
                }
            }
        }

        // Collision on x axis with blocks
        for (const block of this.blocks) {
            if (this.player.colorIndex != block.colorIndex && block.colorIndex != colors.length - 1) {
                if (this.rectCollision(this.player, block)) {
                    if (this.player.xv < 0) {
                        this.player.x = block.x + block.w;
                    } else if (this.player.xv > 0) {
                        this.player.x = block.x - block.w;
                    }
                }
            }
        }

        // Player y axis movement
        this.player.y += this.player.yv;
        this.player.yv += this.player.g;

        // Collision on y axis with blocks
        for (const block of this.blocks) {
            if (this.player.colorIndex != block.colorIndex && block.colorIndex != colors.length - 1) {
                if (this.rectCollision(this.player, block)) {
                    if (this.player.yv > 0) {
                        this.player.onGround = true;
                        this.player.yv = 0
                        this.player.y = block.y - block.h;
                    } else if (this.player.yv < 0) {
                        this.player.yv = 0
                        this.player.y = block.y + block.h;
                    }
                }
            }
        }

        // Collision with death block (undiscovered color)
        if (this.levelIndex != 0) {
            for (const block of this.blocks) {
                if (block.colorIndex == colors.length - 1) {
                    if (this.rectCollision(this.player, block)) {
                        this.transition.trigger('death');
                    }
                }
            }
        }

        // Collision with portal
        if (this.rectCollision(this.player, this.portal) && this.transition.complete) {
            if (this.levelIndex != 0)
                colors.push(allColors[colors.length]);
            this.levelIndex++;
            this.transition.trigger('levelComplete');
        }
    }

    // Display game
    display() {
        if (this.scene == 'menu') {
            this.menu.display();
            this.transition.display();

            if (keys[32]) {
                this.transition.trigger('startGame');
            }
        } else if (this.scene == 'game') {
            for (const b of this.blocks) {
                b.display();
            }
            this.player.display();
            if (this.transition.complete)
                this.player.update();
            this.portal.display();
            this.checkCollisions();
            this.transition.display();

            if (keys[72] && this.transition.complete) {
                this.transition.trigger('hint');
            }
        }
    }
}

// Set up program
function setup() {
    // Set up canvas
    pixelDensity(1);
    canvas = createCanvas(700, 550);
    canvas.parent('game');

    // Color palette
    allColors = [
        color(0, 0, 0),  // Black(solid block)
        color(140, 140, 140),  // Gray(player)
        color(60, 60, 60),  // Dark Gray
        color(255, 80, 80),  // R
        color(255, 180, 100),  // O
        color(230, 210, 100),  // Y
        color(120, 170, 120),  // G
        color(100, 150, 170),  // B
        color(60, 60, 60),  // Dark Gray
        color(60, 60, 60),  // Dark Gray
    ]
    colors = allColors.slice(0, 4);

    // Keyboard data
    keys = [];

    // Level data
    levels = [
        {
            "name": "the two tranquil trees",
            "hint": "instead of going under the trees,\njump over them.",
            "level": [
                "                            ",
                "                            ",
                "                            ",
                "                            ",
                "                            ",
                "                            ",
                "                            ",
                "                            ",
                "                1111        ",
                "              1111111       ",
                "             11121111       ",
                "        222  111211111      ",
                "       22222 122101121      ",
                "      222222  11000121      ",
                "      222222    11001       ",
                "      212122      20        ",
                "        11        20        ",
                "  p      1       2220    o  ",
                " 000     1     2222220  000 ",
                "0000000000000000000000000000",
                "0000000000000000000000000000",
                "0000000000000000000000000000",
            ],
        },
        {
            "name": "the secret below the volcano",
            "hint": "take the darker path down the volcano.",
            "level": [
                "    221111122               ",
                "    211111112               ",
                "     11111111               ",
                "      111111                ",
                "      11111                 ",
                "     0333332                ",
                "    0033333222              ",
                " p 0023333322222            ",
                " 0002333333322222           ",
                "00222333333322222221        ",
                "222233333333222222111       ",
                "22223333333332223222111     ",
                "222233333333322233222211    ",
                "2223333003333322233222211   ",
                "223333000033332223322222111 ",
                "2333330020333322222222221111",
                "3333332222333332222222211111",
                "3333332222333332222222211111",
                "3333332222233322222211111111",
                "3333322222233322222111111111",
                "33333222o2233322221111111133",
                "3333332000223222111113113333",
                "0000000000222222033330000000",
                "0000000000000000000000000000",
            ],
        },
        {
            "name": "rising with the flame",
            "hint": "take the right path up the smoke.",
            "level": [
                "                            ",
                "                            ",
                "            1     o1        ",
                "           11     111       ",
                "           11  4   11       ",
                "       3                    ",
                "              1     3       ",
                "             11     43      ",
                "             1      43      ",
                "         3                  ",
                "        343    3   4   11   ",
                "         3    333 43  111   ",
                "              3433    111   ",
                "             3344333 111    ",
                "             3444443        ",
                "        2   334444433       ",
                "        22  3444444443      ",
                "      4 22  3444444443      ",
                "     24422  3444444443      ",
                "     222222234444422222221  ",
                "      222222222222222222111 ",
                " p 44 222222222222222222211 ",
                "0000000000000000000000000000",
            ],
        },
        {
            "name": "the tricky path up the pyramid",
            "hint": "be patient and think before jumping.",
            "level": [
                "                            ",
                "   44                       ",
                "  4554       111       444  ",
                "  4o5411    11111   4444    ",
                " 14411111                   ",
                "  111111                    ",
                "                 5    4     ",
                "               555   544    ",
                "             555    55454   ",
                "                   4554554  ",
                " 55  p      555   455544554 ",
                "55   22    55    55555545554",
                "     22   55    455555545555",
                "   2 22 2      4555555544555",
                "   2 2222     55555555554555",
                "   222222    555555555554555",
                "     22     4555555555554555",
                "     22    45555555555554555",
                "5555 22   444444555555554444",
                "5555555555555544444444444555",
                "5555555555555555555555555555",
                "5555555555555555555555555555",
            ],
        },
        {
            "name": "the starry night of the fruitful forest",
            "hint": "navigate your way down the yellow tree,\nup the orange tree, and atop the red tree.",
            "level": [
                "2222222222222222222222222222",
                "2222225222222222222o22222222",
                "2222222222522222222222222252",
                "2225222225 22252222666662222",
                "2222222225 22222266466666222",
                "2222222222522222666664666622",
                "     22222      646666664622",
                " p              6666666666  ",
                "65     6663     6646666466  ",
                "66     63666     66661666   ",
                "666   6666663       1264    ",
                "6665  3663666    4  11      ",
                "5666  6666666   111 11      ",
                "666    66166      1111      ",
                "66       11         111166  ",
                "11 5     1111       12 66   ",
                "1111     21         11      ",
                "11       11        6112     ",
                "11      2111      6611166  6",
                "111     1111    4 6111111666",
                "2226666622226666662222222266",
                "6666666666666666666666666666",
            ],
        },
        {
            "name": "hidden within the waterfall",
            "hint": "jump from the top of the tree\nto climb the waterfall.",
            "level": [
                "                            ",
                "                            ",
                "                            ",
                "                            ",
                "                            ",
                "55                          ",
                "455                 66666666",
                "5545                2  00000",
                "5555               2222200 0",
                "5454              77222 0000",
                "4555      7      777722000  ",
                "55     7       2277772220   ",
                "2            7   7777       ",
                "2 22  7          7777       ",
                "222       1   1117777       ",
                "2       1111111117777       ",
                "2        111111117777       ",
                "22           7  77777       ",
                "222 p          777777     o ",
                "666666777772277777777    000",
                "6666666777777777777722222000",
                "6666666667777777772222222200",
                "7777777777777777777777777777",
            ],
        },
        {
            "name": "someplace familiar",
            "hint": "this is the end,\nthank you for playing.",
            "level": [
                "7777777777777777777777777777",
                "7777447777777777777777777777",
                "7774554777777777777777777777",
                "7774554  7777777777777777777",
                "777744    777777777777777777",
                "7777777777777777777777777777",
                "77777777777        777777777",
                "7777777                77777",
                "                3666        ",
                "              6666666       ",
                "             63626366       ",
                "        666  666266666      ",
                "       36666 622626626      ",
                "      666636  66222623      ",
                "      366666    36226       ",
                "      626263      22        ",
                "        22        22        ",
                "  p      2       2222       ",
                " 000     2     2222222      ",
                "6666666666666666666666666666",
                "6666666666666666666666666666",
                "6666666666666666666666666666",
                "0000000000000000000000000000",
                "000000000000000000000000000o",
            ],
        },
    ]

    // Create game
    game = new Game();
}

// Draw the program
function draw() {
    background(240);
    game.display();
}

// Keyboard interactions
function keyPressed() {
    keys[keyCode] = true;
};
function keyReleased() {
    keys[keyCode] = false;
};