class Player {
    constructor(health, attack, defence, gold) {
        this.health = health;
        this.attack = attack;
        this.defence = defence;
        this.gold = gold;
    }
}

class Monster {
    constructor(Monster_Name, Monster_Image, Monster_Health, Attack, Defence) {
        this.Monster_Name = Monster_Name;
        this.Monster_Image = Monster_Image;
        this.Monster_Health = Monster_Health;
        this.Attack = Attack;
        this.Defence = Defence;
    }
}

class Item {
    constructor(name, effect) {
        this.name = name;
        this.effect = effect;
    }
}

class Goblin extends Monster {
    constructor() {
        super('Goblin', 'images/goblin.png', 30, 10, 5);
    }
}

class Orc extends Monster {
    constructor() {
        super('Orc', 'images/orc.png', 50, 15, 10);
    }
}

class Dragon extends Monster {
    constructor() {
        super('Dragon', 'images/dragon.png', 100, 20, 15);
    }
}

class HealthPotion extends Item {
    constructor() {
        super('Health Potion', 'Restores 20 health');
    }
}

class AttackPotion extends Item {
    constructor() {
        super('Attack Potion', 'Increases attack by 5 for next combat');
    }
}

class DefencePotion extends Item {
    constructor() {
        super('Defence Potion', 'Increases defence by 5 for next combat');
    }
}

class Game {
    constructor() {
        this.player = new Player(100, 10, 5, 0);
        this.monsters = [new Goblin(), new Orc(), new Dragon()];
        this.items = [new HealthPotion(), new AttackPotion(), new DefencePotion()];
        this.CurrMonster = null;
    }
}
let game = null;

dom.NewBtn.addEventListener('click', () => {
    game = new Game();
    dom.Message.textContent = 'New Game Started!';
    dom.Player.style.display = 'grid';
    dom.Monster_Side.style.display = 'grid';
    dom.Start.style.display = 'none';
    dom.Combat.style.display = 'grid';
    updatePlayerStats(game);
    spawnMonster(game);
});

updatePlayerStats = (game) => {
    dom.Health.textContent = `Health: ${game.player.health}`;
    dom.Attack.textContent = `Attack: ${game.player.attack}`;
    dom.Defence.textContent = `Defence: ${game.player.defence}`;
    dom.Gold.textContent = `Gold: ${game.player.gold}`;
}

spawnMonster = (game) => {
    game.CurrMonster = game.monsters[0];
    dom.Monster_Name.textContent = game.CurrMonster.Monster_Name;
    dom.Monster_Image.src = game.CurrMonster.Monster_Image;
    dom.Monster_Health.textContent = `Health: ${game.CurrMonster.Monster_Health}`;
}

spawnBoss = (game) => {
    game.CurrMonster = game.monsters[2];
    dom.Monster_Name.textContent = game.CurrMonster.Monster_Name;
    dom.Monster_Image.src = game.CurrMonster.Monster_Image;
    dom.Monster_Health.textContent = `Health: ${game.CurrMonster.Monster_Health}`;
}

dom.AttackBtn.addEventListener('click', () => {
    const damageToMonster = Math.max(0, game.player.attack - game.CurrMonster.Defence);
    game.CurrMonster.Monster_Health -= damageToMonster;
    dom.Message.textContent = 'Fight!';
    dom.Monster_Health.textContent = `Health: ${game.CurrMonster.Monster_Health}`;
    if (game.CurrMonster.Monster_Health <= 0) {
        dom.Message.textContent = `You defeated the ${game.CurrMonster.Monster_Name}!`;
        game.player.gold += 20;
        updatePlayerStats(game);
        spawnMonster(game);
    } else if (game.CurrMonster.Monster_Health > 0){
        const damageToPlayer = Math.max(0, game.CurrMonster.Attack - game.player.defence);
        game.player.health -= damageToPlayer;
        updatePlayerStats(game);
    }
});