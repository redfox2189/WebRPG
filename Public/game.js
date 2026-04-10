class Player {
    constructor(MaxHP, health, attack, defence, gold) {
        this.MaxHP = MaxHP;
        this.health = health;
        this.attack = attack;
        this.defence = defence;
        this.gold = gold;
        this.items = [];
        this.attackBuff = 0;
        this.defenceBuff = 0;
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
    constructor(name, effect, cost, quantity = 1) {
        this.name = name;
        this.effect = effect;
        this.cost = cost;
        this.quantity = quantity;
    }
}

class HealthPotion extends Item {
    constructor() {
        super('Health Potion', 'Restores 20 health', 10);
    }
}

class AttackPotion extends Item {
    constructor() {
        super('Attack Potion', 'Increases attack by 5 for next combat', 30);
    }
}

class DefencePotion extends Item {
    constructor() {
        super('Defence Potion', 'Increases defence by 5 for next combat', 30);
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

class Game {
    constructor() {
        this.player = new Player(100, 100, 15, 5, 50);
        this.shopItems = [new HealthPotion(), new AttackPotion(), new DefencePotion()];
        this.CurrMonster = null;
        this.monsterDefending = false;
        this.fightCount = 0;
        this.pendingNextMonster = false;
        this.encounter = Math.floor(Math.random() * 5);
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
    fetch('/load')
        .then(response => response.json())
        .then(savedGame => {
            if (savedGame) {
                game = new Game();
                Object.assign(game, savedGame);
                showGameUI();
                dom.Message.textContent = 'Game Loaded!';
                Fight(game);
            }
        });
});

dom.SaveBtn.addEventListener('click', () => {
    fetch('/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(game)
    });
});

function showGameUI() {
    dom.Player.style.display = 'grid';
    dom.Monster_Side.style.display = 'grid';
    dom.Start.style.display = 'none';
    dom.Combat.style.display = 'grid';
    dom.Shop.style.display = 'none';
    dom.Bag.style.display = 'none';
    dom.Bag_Buttons.style.display = 'none';
}

function showShopUI() {
    dom.Combat.style.display = 'none';
    dom.Monster_Side.style.display = 'none';
    dom.Shop.style.display = 'grid';

    dom.HealUPBtn.style.display = 'inline-block';
    dom.UpgradeBtn.style.display = 'inline-block';
}

function showCombatUI() {
    dom.Shop.style.display = 'none';
    dom.Bag.style.display = 'none';
    dom.Bag_Buttons.style.display = 'none';
    dom.Combat.style.display = 'grid';
    dom.Monster_Side.style.display = 'grid';
}

function showBagUI() {
    if (!dom.Bag || !dom.Bag_List || !dom.Bag_Buttons) {
        console.error('Bag UI elements are missing.');
        return;
    }

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
        itemElement.textContent = `${item.name} x${item.quantity} - ${item.effect}`;
        itemElement.dataset.index = index;
        dom.Bag_List.appendChild(itemElement);
    });
}

function updatePlayerStats(game) {
    dom.MaxHP.textContent = `Max HP: ${game.player.MaxHP}`;
    dom.Health.textContent = `Health: ${game.player.health}`;
    dom.Attack.textContent = `Attack: ${game.player.attack + game.player.attackBuff}`;
    dom.Defence.textContent = `Defence: ${game.player.defence + game.player.defenceBuff}`;
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

function difficultyScaleMonster(monster, fightCount) {
    const scaleFactor = 1 + fightCount * 0.1;
    monster.Monster_Health = Math.round(monster.Monster_Health * scaleFactor);
    monster.Attack = Math.round(monster.Attack * scaleFactor);
    monster.Defence = Math.round(monster.Defence * scaleFactor);
    monster.goldReward = Math.round(monster.goldReward * scaleFactor);
}

function spawnMonster(game) {
    game.monsterDefending = false;
    game.CurrMonster = Math.random() < 0.5 ? new Goblin() : new Orc();
    difficultyScaleMonster(game.CurrMonster, game.fightCount);
    updateMonsterUI(game);
}

function spawnBoss(game) {
    game.monsterDefending = false;
    game.CurrMonster = new Dragon();
    difficultyScaleMonster(game.CurrMonster, game.fightCount);
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

function Inn(game) {
    updatePlayerStats(game);
    showShopUI();

    dom.HealUPBtn.style.display = 'none';
    dom.UpgradeBtn.style.display = 'none';

    dom.Message.textContent = 'You found an Inn! Restoring your health...';
    game.player.health = game.player.MaxHP;
    updatePlayerStats(game);
}

function playerDeath(game) {
    game.player.health = 0;
    updatePlayerStats(game);

    dom.Message.textContent = 'You died! Game Over!';
    dom.Combat.style.display = 'none';
    dom.Monster_Side.style.display = 'none';
    dom.Start.style.display = 'grid';
}

function MonsterTurn(game, playerDefending = false) {
    if (!game || !game.CurrMonster || game.CurrMonster.Monster_Health <= 0) return;

    const monsterAction = Math.floor(Math.random() * 2);

    if (monsterAction === 0) {
        let damageToPlayer;

        const totalDefence = game.player.defence + game.player.defenceBuff;

        if (playerDefending) {
            damageToPlayer = Math.max(0, game.CurrMonster.Attack - (totalDefence + 3));
            dom.Message.textContent = `${game.CurrMonster.Monster_Name} attacks, but you defend!`;
        } else {
            damageToPlayer = Math.max(1, game.CurrMonster.Attack - totalDefence);
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

    game.encounter = Math.floor(Math.random() * 5);

    if (game.encounter === 0 || game.encounter === 3) {
        game.pendingNextMonster = true;
        Shop(game);
        return;
    } else if (game.encounter === 1 || game.encounter === 4) {
        Inn(game);
        game.pendingNextMonster = true;
        return;
    } else if (game.encounter === 2) {
        dom.Message.textContent += ' Another monster appears!';
        spawnNextMonster(game);
        return;
    }
}

function addItemToInventory(itemToAdd) {
    const existingItem = game.player.items.find(item => item.name === itemToAdd.name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        game.player.items.push({ ...itemToAdd });
    }
}

function useItem(index) {
    const item = game.player.items[index];
    if (!item) return;

    if (item.name === 'Health Potion') {
        game.player.health = Math.min(game.player.MaxHP, game.player.health + 20);
        dom.Message.textContent = 'You used a Health Potion!';
    } else if (item.name === 'Attack Potion') {
        game.player.attackBuff += 5;
        dom.Message.textContent = 'You used an Attack Potion!';
    } else if (item.name === 'Defence Potion') {
        game.player.defenceBuff += 5;
        dom.Message.textContent = 'You used a Defence Potion!';
    }

    item.quantity--;

    if (item.quantity <= 0) {
        game.player.items.splice(index, 1);
    }

    updatePlayerStats(game);
    showBagUI();
}

dom.AttackBtn.addEventListener('click', () => {
    if (!game || !game.CurrMonster) return;

    let damageToMonster;
    const totalAttack = game.player.attack + game.player.attackBuff;

    if (game.monsterDefending) {
        damageToMonster = Math.max(0, totalAttack - (game.CurrMonster.Defence + 3));
        game.monsterDefending = false;
        dom.Message.textContent = `You attack, but the ${game.CurrMonster.Monster_Name} is defending!`;
    } else {
        damageToMonster = Math.max(1, totalAttack - game.CurrMonster.Defence);
        dom.Message.textContent = `You attack the ${game.CurrMonster.Monster_Name}!`;
    }

    game.CurrMonster.Monster_Health -= damageToMonster;
    updateMonsterUI(game);

    game.player.attackBuff = 0;
    game.player.defenceBuff = 0;
    updatePlayerStats(game);

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
    if (game.player.gold >= 50) {
        game.player.gold -= 50;
        game.player.MaxHP += 30;
        game.player.health = game.player.MaxHP;
        updatePlayerStats(game);
        dom.Message.textContent = 'You bought a Max HP upgrade!';
    } else {
        dom.Message.textContent = 'Not enough gold!';
    }
});

dom.UpgradeBtn.addEventListener('click', () => {
    if (!game) return;
    let ranPostion = Math.floor(Math.random() * 3);
    const potion = ranPostion === 0 ? new AttackPotion() : ranPostion === 1 ? new DefencePotion() : new HealthPotion();

    if (game.player.gold >= potion.cost) {
        game.player.gold -= potion.cost;
        addItemToInventory(potion);
        updatePlayerStats(game);
        dom.Message.textContent = 'You bought a Potion for battle!';
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