

class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    isNear(point, thres=5) {
        return Math.hypot(this.x-point.x, this.y-point.y) < thres
    }

    distance(point) {
        return Math.hypot(point.x-this.x, point.y-this.y)
    }

    draw(ctx){
        console.log("hi")
        ctx.beginPath()
        ctx.fillStyle="red"
        ctx.arc(this.x, this.y, 10, 0, Math.PI*2)
        ctx.fill()
    }
}