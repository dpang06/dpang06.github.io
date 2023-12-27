export interface Point {
    x: number;
    y: number;
}

export enum Player {
    A = 1,
    B = -1,
}
export function flipPlayer(player: Player) { return player * -1; }

export enum Stone {
    BLACK = 1,
    WHITE = -1,
}
export function flipStone(stone: Stone) { return stone * -1; }