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
    constructor(name, health, attack, defence, gold) {
        this.name = name;
        this.health = health;
        this.attack = attack;
        this.defence = defence;
        this.gold = gold;
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
