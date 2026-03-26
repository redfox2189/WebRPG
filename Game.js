const $ = (selector) => document.querySelector(selector);

const dom = {
    Message: $('#Message'),
    Monster_Side: $('#Monster_Side'),
    Monster_Name: $('#Monster_Name'),
    Monster_Image: $('#Monster_Image'),
    Monster_Health: $('#Monster_Health'),
    Start: $('#Start'),
    Combat: $('#Combat'),
    Shop: $('#Shop'),
    Bag: $('#Bag'),
    Player_Side: $('#Player_Side'),
    Health: $('#Health'),
    Attack: $('#Attack'),
    Defence: $('#Defence'),
    Gold: $('#Gold'),
    Bag: $('#Bag'),
    Item_List: $('#Item_List'),
    UseBtn: $('#UseBtn'),
    DropBtn: $('#DropBtn'),
}

class player {
    constructor(health, attack, defence, gold) {
        this.health = 100;
        this.attack = 10;
        this.defence = 5;
        this.gold = 0;
    }
}

class monster {
    constructor(Monster_Name, Monster_Image, Monster_Health, Attack, Defence) {
        this.Monster_Name = Monster_Name;
        this.Monster_Image = Monster_Image;
        this.Monster_Health = Monster_Health;
        this.Attack = Attack;
        this.Defence = Defence;
    }
}

class item {
    constructor(name, effect) {
        this.name = name;
        this.effect = effect;
    }
}

class Goblin extends monster {
    constructor() {
        super('Goblin', '/goblin.png', 30, 10, 5);
    }
}

class Orc extends monster {
    constructor() {
        super('Orc', '/orc.png', 50, 15, 10);
    }
}

class Dragon extends monster {
    constructor() {
        super('Dragon', '/dragon.png', 100, 20, 15);
    }
}

class HealthPoton extends item {
    constructor() {
        super('Health Potion', 'Restores 20 health');
    }
}

class AttackPotion extends item {
    constructor() {
        super('Attack Potion', 'Increases attack by 5 for next combat');
    }
}

class DefencePotion extends item {
    constructor() {
        super('Defence Potion', 'Increases defence by 5 for next combat');
    }
}

class Game {
    constructor() {
        this.player = new player('Hero', 100, 20, 10, 50);
        this.monsters = [new Goblin(), new Orc(), new Dragon()];
        this.items = [new HealthPoton(), new AttackPotion(), new DefencePotion()];
        this.CurrMonster = null;
    }
}

export { Game, player, monster, item, Goblin, Orc, Dragon, HealthPoton, AttackPotion, DefencePotion };