export interface Point {
    x: number;
    y: number;
}

export interface Direction {
    name: string;
    x: number;
    y: number;
    next: Set<Direction> | null;
}

export const UP: Direction = { name: "up", x: 0, y: -1, next: null };
export const DOWN: Direction = { name: "down", x: 0, y: 1, next: null };
export const LEFT: Direction = { name: "left", x: -1, y: 0, next: null };
export const RIGHT: Direction = { name: "right", x: 1, y: 0, next: null };

// state transition (matrix)
UP.next = new Set([LEFT, RIGHT]);
DOWN.next = new Set([LEFT, RIGHT]);
LEFT.next = new Set([UP, DOWN]);
RIGHT.next = new Set([UP, DOWN]);
