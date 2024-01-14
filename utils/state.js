class State {
  constructor(name, points = []) {
    this.points = points;
    this.center = undefined;
    this.name = name;
  }

  set_name(name) {
    this.name = name;
  }

  findCenter(points) {
    var x = 0;
    var y = 0;
    for (var point of points) {
      x += point.x;
      y += point.y;
    }
    x = Math.floor(x / points.length);
    y = Math.floor(y / points.length);
    return new Point(x, y);
  }

  draw(ctx, current = false) {
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (var i = 1; i < this.points.length; i++) {
      const point = this.points[i];
      ctx.lineTo(point.x, point.y);
    }
    
    ctx.closePath();
    if (current) {
      ctx.fillStyle = "rgba(255, 255, 255)";
      ctx.fill();
    } else {
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.stroke();
    }
    
    // ctx.beginPath();
    // ctx.arc(this.center.x, this.center.y, 5, 0, Math.PI * 2);
    // ctx.fill();
  }

  add_point(point) {
    if (this.points.find((p) => p.isNear(point))) return false;
    this.points.push(point);
    return true;
  }
}
