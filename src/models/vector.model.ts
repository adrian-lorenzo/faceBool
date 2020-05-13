export class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(vector: Vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    static div(vector: Vector, cte: number): Vector {
        return new Vector(vector.x / cte, vector.y / cte);
    }

    mult(cte: number) {
        this.x *= cte;
        this.y *= cte;
    }

    subtract(vector: Vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    toString() {
        return "[" + this.x + "," + this.y + "]"
    }


}