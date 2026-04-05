class Player {
    constructor(MaxHP, health, attack, defence, gold) {
        this.MaxHP = MaxHP;
        this.health = health;
        this.attack = attack;
        this.defence = defence;
        this.gold = gold;
    }
}

class Monster {
    constructor(Monster_Name, Monster_Image, Monster_Health, Attack, Defence, goldReward) {
        this.Monster_Name = Monster_Name;
        this.Monster_Image = Monster_Image;
        this.Monster_Health = Monster_Health;
        this.Attack = Attack;
        this.Defence = Defence;
        this.goldReward = goldReward;
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
        super('Goblin', 'images/goblin.png', 30, 10, 5, 10);
    }
}

class Orc extends Monster {
    constructor() {
        super('Orc', 'images/orc.png', 50, 15, 10, 20);
    }
}

class Dragon extends Monster {
    constructor() {
        super('Dragon', 'images/dragon.png', 100, 20, 15, 50);
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
        this.player = new Player(100, 100, 10, 5, 50);
        this.monsters = [new Goblin(), new Orc(), new Dragon()];
        this.items = [new HealthPotion(), new AttackPotion(), new DefencePotion()];
        this.CurrMonster = null;
        this.monsterDefending = false;
        this.fightCount = 0;
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
    Fight(game);
});

dom.LoadBtn.addEventListener('click', () => {
    const savedGame = localStorage.getItem('rpgGame');
    if (savedGame) {
        game = JSON.parse(savedGame);
        game.fightCount = game.fightCount || 0;
        dom.fightCount.textContent = `Monsters Defeated: ${game.fightCount}`;
        dom.Message.textContent = 'Game Loaded!';
        dom.Player.style.display = 'grid';
        dom.Monster_Side.style.display = 'grid';
        dom.Start.style.display = 'none';
        dom.Combat.style.display = 'grid';
        Fight(game);
    } else {
        dom.Message.textContent = 'No saved game found!';
    }
});

dom.SaveBtn.addEventListener('click', () => {
    if (game) {
        game.fightCount = game.fightCount;
        localStorage.setItem('rpgGame', JSON.stringify(game));
        dom.Message.textContent = 'Game Saved!';
    } else {
        dom.Message.textContent = 'No game to save!';
    }
});

updatePlayerStats = (game) => {
    dom.MaxHP.textContent = `Max HP: ${game.player.MaxHP}`;
    dom.Health.textContent = `Health: ${game.player.health}`;
    dom.Attack.textContent = `Attack: ${game.player.attack}`;
    dom.Defence.textContent = `Defence: ${game.player.defence}`;
    dom.Gold.textContent = `Gold: ${game.player.gold}`;
}

spawnStartMonster = (game) => {
    game.CurrMonster = game.monsters[0];
    dom.Monster_Name.textContent = game.CurrMonster.Monster_Name;
    dom.Monster_Image.src = game.CurrMonster.Monster_Image;
    dom.Monster_Health.textContent = `Health: ${game.CurrMonster.Monster_Health}`;
}

spawnMonster = (game) => {
    game.monsterDefending = false;
    const nextMonster = Math.random() < 0.5 ? new Goblin() : new Orc();

    game.CurrMonster = nextMonster;
    dom.Monster_Name.textContent = game.CurrMonster.Monster_Name;
    dom.Monster_Image.src = game.CurrMonster.Monster_Image;
    dom.Monster_Health.textContent = `Health: ${game.CurrMonster.Monster_Health}`;
}

spawnBoss = (game) => {
    game.monsterDefending = false;
    game.monsters[2] = new Dragon();
    game.CurrMonster = game.monsters[2];
    dom.Monster_Name.textContent = game.CurrMonster.Monster_Name;
    dom.Monster_Image.src = game.CurrMonster.Monster_Image;
    dom.Monster_Health.textContent = `Health: ${game.CurrMonster.Monster_Health}`;
}

Shop = (game) => {
    updatePlayerStats(game);
    dom.Combat.style.display = 'none';
    dom.Monster_Side.style.display = 'none';
    dom.Message.textContent = 'A shop has appeared!';
    dom.Shop.style.display = 'grid';
    // spawn items to buy
}

dom.HealUPBtn.addEventListener('click', () => {
    if (!game) return;

    if (game.player.gold >= 10) {
        game.player.gold -= 10;
        game.player.MaxHP += 20;
        game.player.health = Math.min(game.player.MaxHP, game.player.health + 20);
        updatePlayerStats(game);
        dom.Message.textContent = 'You bought a Health Potion!';
    } else {
        dom.Message.textContent = 'Not enough gold!';
    }
});

dom.UpgradeBtn.addEventListener('click', () => {
    if (!game) return;

    if (game.player.gold >= 30) {
        game.player.gold -= 30;
        game.player.defence += 5;
        game.player.attack += 5;
        updatePlayerStats(game);
        dom.Message.textContent = 'You Upgraded your stats!';
    } else {
        dom.Message.textContent = 'Not enough gold!';
    }
});

dom.ExitShopBtn.addEventListener('click', () => {
    dom.Shop.style.display = 'none';
    dom.Combat.style.display = 'grid';
    dom.Monster_Side.style.display = 'grid';
    dom.Message.textContent = 'You left the shop!';
});

MonsterTurn = (game, playerDefending = false) => {
    if (!game || !game.CurrMonster || game.CurrMonster.Monster_Health <= 0) return;

    const monsterAction = Math.floor(Math.random() * 2); // 0 = attack, 1 = defend

    if (monsterAction === 0) {
        let damageToPlayer;

        if (playerDefending) {
            damageToPlayer = Math.max(0, game.CurrMonster.Attack - (game.player.defence + 3));
            dom.Message.textContent = `${game.CurrMonster.Monster_Name} attacks, but you defend!`;
        } else {
            damageToPlayer = Math.max(1, game.CurrMonster.Attack - game.player.defence);
            dom.Message.textContent = `${game.CurrMonster.Monster_Name} attacks!`;
        }

        game.player.health -= damageToPlayer;
        updatePlayerStats(game);

        if (game.player.health <= 0) {
            game.player.health = 0;
            updatePlayerStats(game);
            dom.Message.textContent = 'You died! Game Over!';
            dom.Combat.style.display = 'none';
            dom.Monster_Side.style.display = 'none';
        }

    } else {
        game.monsterDefending = true;
        dom.Message.textContent = `${game.CurrMonster.Monster_Name} is defending!`;
    }
}

Fight = (game) => {
    if (!game.CurrMonster) {
        spawnStartMonster(game);
    } else {
        dom.Monster_Name.textContent = game.CurrMonster.Monster_Name;
        dom.Monster_Image.src = game.CurrMonster.Monster_Image;
        dom.Monster_Health.textContent = `Health: ${game.CurrMonster.Monster_Health}`;
    }
    dom.fightCount.textContent = `Monsters Defeated: ${game.fightCount}`;
    updatePlayerStats(game);

}

dom.AttackBtn.addEventListener('click', () => {
    if (!game || !game.CurrMonster) return;

    let damageToMonster;
    if (game.monsterDefending) {
        damageToMonster = Math.max(0, game.player.attack - (game.CurrMonster.Defence + 3));
        game.monsterDefending = false;
        dom.Message.textContent = `You attack, but the ${game.CurrMonster.Monster_Name} is defending!`;
    } else {
        damageToMonster = Math.max(1, game.player.attack - game.CurrMonster.Defence);
        dom.Message.textContent = `You attack the ${game.CurrMonster.Monster_Name}!`;
    }
    game.CurrMonster.Monster_Health -= damageToMonster;
    dom.Message.textContent = `You attack the ${game.CurrMonster.Monster_Name}!`;
    dom.Monster_Health.textContent = `Health: ${game.CurrMonster.Monster_Health}`;

    if (game.CurrMonster.Monster_Health <= 0) {
        dom.Message.textContent = `You defeated the ${game.CurrMonster.Monster_Name}!`;
        game.player.gold += game.CurrMonster.goldReward;
        game.fightCount = game.fightCount || 0;
        game.fightCount++;
        dom.fightCount.textContent = `Monsters Defeated: ${game.fightCount}`;
        updatePlayerStats(game);
        if (game.fightCount % 2 === 0) {
            Shop(game);
        }
        if (game.fightCount % 3 === 0) {
            spawnBoss(game);
        } else {
            spawnMonster(game);
        }
        return;
    }

    MonsterTurn(game);
});


dom.DefendBtn.addEventListener('click', () => {
    if (!game || !game.CurrMonster) return;

    dom.Message.textContent = 'You defend!';
    MonsterTurn(game, true);
});
