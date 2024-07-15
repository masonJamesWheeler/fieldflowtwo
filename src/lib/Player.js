// src/lib/Player.js
export class Player {
    constructor(x, y, isOffense = true, label = '') {
        this.x = x;
        this.y = y;
        this.isOffense = isOffense;
        this.label = label;
        this.radius = 15; // Adjust this value to change the size of the player
        this.route = null;

    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.isOffense ? 'blue' : 'red';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw label
        if (this.label) {
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.label, this.x, this.y);
        }
    }

    isPointInside(x, y) {
        const dx = this.x - x;
        const dy = this.y - y;
        return dx * dx + dy * dy <= this.radius * this.radius;
    }
}