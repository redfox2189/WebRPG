class Player {
    constructor(MaxHP, health, attack, defence, gold) {
        this.MaxHP = MaxHP;
        this.health = health;
        this.attack = attack;
        this.defence = defence;
        this.gold = gold;
        this.items = [];
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
        this.player = new Player(100, 100, 15, 5, 50);
        this.monsters = [new Goblin(), new Orc(), new Dragon()];
        this.shopItems = [new HealthPotion(), new AttackPotion(), new DefencePotion()];
        this.CurrMonster = null;
        this.monsterDefending = false;
        this.fightCount = 0;
        this.pendingNextMonster = false;
        this.Encouter = Math.floor(Math.random() * 3);
    }
}

let game = null;

dom.NewBtn.addEventListener('click', () => {
    game = new Game();
    showGameUI();
    dom.Message.textContent = 'New Game Started!';
    Fight(game);
});

dom.LoadBtn.addEventListener('click', () => {
    const savedGame = localStorage.getItem('rpgGame');

    if (savedGame) {
        game = JSON.parse(savedGame);
        game.fightCount = game.fightCount || 0;
        game.monsterDefending = game.monsterDefending || false;
        game.pendingNextMonster = game.pendingNextMonster || false;

        showGameUI();
        dom.Message.textContent = 'Game Loaded!';
        Fight(game);
    } else {
        dom.Message.textContent = 'No saved game found!';
    }
});

dom.SaveBtn.addEventListener('click', () => {
    if (!game) {
        dom.Message.textContent = 'No game to save!';
        return;
    }

    localStorage.setItem('rpgGame', JSON.stringify(game));
    dom.Message.textContent = 'Game Saved!';
});

function showGameUI() {
    dom.Player.style.display = 'grid';
    dom.Monster_Side.style.display = 'grid';
    dom.Start.style.display = 'none';
    dom.Combat.style.display = 'grid';
    dom.Shop.style.display = 'none';
}

function showShopUI() {
    dom.Combat.style.display = 'none';
    dom.Monster_Side.style.display = 'none';
    dom.Shop.style.display = 'grid';
}

function showCombatUI() {
    dom.Shop.style.display = 'none';
    dom.Bag.style.display = 'none';
    dom.Bag_Buttons.style.display = 'none';
    dom.Combat.style.display = 'grid';
    dom.Monster_Side.style.display = 'grid';
}

function showBagUI() {
    dom.Combat.style.display = 'none';
    dom.Monster_Side.style.display = 'none';
    dom.Bag.style.display = 'grid';
    dom.Bag_Buttons.style.display = 'grid';
    dom.Bag_List.innerHTML = '';

    if (!game.player.items || game.player.items.length === 0) {
        const emptyText = document.createElement('div');
        emptyText.textContent = 'Your bag is empty.';
        dom.Bag_List.appendChild(emptyText);
        return;
    }

    game.player.items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.textContent = `${item.name} - ${item.effect}`;
        itemElement.dataset.index = index;
        dom.Bag_List.appendChild(itemElement);
    });
}

function updatePlayerStats(game) {
    dom.MaxHP.textContent = `Max HP: ${game.player.MaxHP}`;
    dom.Health.textContent = `Health: ${game.player.health}`;
    dom.Attack.textContent = `Attack: ${game.player.attack}`;
    dom.Defence.textContent = `Defence: ${game.player.defence}`;
    dom.Gold.textContent = `Gold: ${game.player.gold}`;
    dom.fightCount.textContent = `Monsters Defeated: ${game.fightCount}`;
}

function updateMonsterUI(game) {
    if (!game.CurrMonster) return;

    dom.Monster_Name.textContent = game.CurrMonster.Monster_Name;
    dom.Monster_Image.src = game.CurrMonster.Monster_Image;
    dom.Monster_Health.textContent = `Health: ${Math.max(0, game.CurrMonster.Monster_Health)}`;
}

function spawnStartMonster(game) {
    game.monsterDefending = false;
    game.CurrMonster = new Goblin();
    updateMonsterUI(game);
}

function spawnMonster(game) {
    game.monsterDefending = false;
    game.CurrMonster = Math.random() < 0.5 ? new Goblin() : new Orc();
    updateMonsterUI(game);
}

function spawnBoss(game) {
    game.monsterDefending = false;
    game.CurrMonster = new Dragon();
    updateMonsterUI(game);
}

function spawnNextMonster(game) {
    if (game.fightCount > 0 && game.fightCount % 3 === 0) {
        spawnBoss(game);
    } else {
        spawnMonster(game);
    }
}

function Fight(game) {
    if (!game.CurrMonster) {
        spawnStartMonster(game);
    } else {
        updateMonsterUI(game);
    }

    updatePlayerStats(game);
}

function Shop(game) {
    updatePlayerStats(game);
    showShopUI();
    dom.Message.textContent = 'A shop has appeared!';
}

function playerDeath(game) {
    game.player.health = 0;
    updatePlayerStats(game);

    dom.Message.textContent = 'You died! Game Over!';
    dom.Combat.style.display = 'none';
    dom.Monster_Side.style.display = 'none';
}

function MonsterTurn(game, playerDefending = false) {
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

        if (game.player.health <= 0) {
            playerDeath(game);
            return;
        }

        updatePlayerStats(game);
    } else {
        game.monsterDefending = true;
        dom.Message.textContent = `${game.CurrMonster.Monster_Name} is defending!`;
    }
}

function defeatMonster(game) {
    dom.Message.textContent = `You defeated the ${game.CurrMonster.Monster_Name}!`;
    game.player.gold += game.CurrMonster.goldReward;
    game.fightCount++;
    updatePlayerStats(game);
    game.encounter = Math.floor(Math.random() * 5); // 0 to 4

    if (game.encounter === 0) {
        game.pendingNextMonster = true;
        Shop(game);
        return;
    } else if (game.encounter === 1) {
        dom.Message.textContent = ' You found an Inn!';
        game.player.health = game.player.MaxHP;
        updatePlayerStats(game);
    } else if (game.encounter === 2) {
        dom.Message.textContent = ' Another monster appears!';
        spawnNextMonster(game);
        return;
    }
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
    updateMonsterUI(game);

    if (game.CurrMonster.Monster_Health <= 0) {
        defeatMonster(game);
        return;
    }

    MonsterTurn(game);
});

dom.DefendBtn.addEventListener('click', () => {
    if (!game || !game.CurrMonster) return;

    dom.Message.textContent = 'You defend!';
    MonsterTurn(game, true);
});

dom.BagBtn.addEventListener('click', () => {
    if (!game) return;

    showBagUI();
    dom.Message.textContent = 'You opened your bag!';
});

dom.ExitBagBtn.addEventListener('click', () => {
    if (!game) return;

    showCombatUI();
    dom.Message.textContent = 'You closed your bag!';
    if (game.pendingNextMonster) {
        spawnNextMonster(game);
        game.pendingNextMonster = false;
    }
});

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
        game.player.attack += 5;
        game.player.defence += 5;
        updatePlayerStats(game);
        dom.Message.textContent = 'You upgraded your stats!';
    } else {
        dom.Message.textContent = 'Not enough gold!';
    }
});

dom.ExitShopBtn.addEventListener('click', () => {
    if (!game) return;

    showCombatUI();
    dom.Message.textContent = 'You left the shop!';

    if (game.pendingNextMonster) {
        spawnNextMonster(game);
        game.pendingNextMonster = false;
    }

    updateMonsterUI(game);
    updatePlayerStats(game);
});