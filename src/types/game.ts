export type moneyValues = {
    // Coins
    bronzes: number; // Bronze coins
    silvers: number; // Silver coins (50 bronzes = 1 silver)
    gold: number; // Gold coins (150 silvers = 1 gold)

    // Diamonds
    shards: number; // Shards
    fragments: number; // Fragments (10 shards = 1 fragment)
    stones: number; // Stones (30 fragments = 1 stone)
    masterworks: number; // Masterworks (5 stones = 1 masterwork)
}