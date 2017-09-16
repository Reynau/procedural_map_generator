let basicVoronoi = {
  voronoi: new Voronoi(),
  diagram: null,
  margin: 0,
  canvas: null,
  bbox: {xl:0, xr:800, yt:0, yb:600},
  points: [],
  timeoutDelay: 100,

  init: function (n, r) {
    this.canvas = document.getElementById('voronoiCanvas')
    this.generatePoints(n, r)
  },

  generatePoints: function (n, r) {
    let points = []

    let dx = this.canvas.width
    let dy = this.canvas.height

    for (let i = 0; i < n; ++i) {
      let x = self.Math.round((self.Math.random()*dx))
      let y = self.Math.round((self.Math.random()*dy))
      points.push({x: x, y: y});
    }

    this.compute(points)
    while (r--) {
      this.relaxPoints()
    }
  },

  compute: function (points) {
    this.points = points
    this.voronoi.recycle(this.diagram)
    this.diagram = this.voronoi.compute(points, this.bbox)
    this.render()
  },

  relaxPoints: function () {
    let cells = this.diagram.cells
    let iCell = cells.length

    let cell, cellCentroid
    let newPoints = []
    while (iCell--) {
      cell = cells[iCell]
      cellCentroid = this.cellCentroid(cell)
      newPoints.push(cellCentroid)
    }
    this.compute(newPoints)
  },

  cellCentroid: function(cell) {
    let x = 0
    let y = 0
    let halfedges = cell.halfedges
    let iHalfedge = halfedges.length
    let halfedge
    let v, p1, p2
    while (iHalfedge--) {
      halfedge = halfedges[iHalfedge];
      p1 = halfedge.getStartpoint();
      p2 = halfedge.getEndpoint();
      v = p1.x*p2.y - p2.x*p1.y;
      x += (p1.x+p2.x) * v;
      y += (p1.y+p2.y) * v;
    }
    v = this.cellArea(cell) * 6;
    return {x: x/v,y: y/v};
  },

  cellArea: function(cell) {
    let area = 0
    let halfedges = cell.halfedges
    let iHalfedge = halfedges.length
    let halfedge
    let p1, p2
    while (iHalfedge--) {
      halfedge = halfedges[iHalfedge]
      p1 = halfedge.getStartpoint()
      p2 = halfedge.getEndpoint()
      area += p1.x * p2.y
      area -= p1.y * p2.x
    }
    area /= 2
    return area
  },

  render: function () {
    let ctx = this.canvas.getContext('2d')

    this.renderBoundingBox(ctx)
    this.renderEdges(ctx, this.diagram.edges)
    this.renderPoints(ctx, this.points)
  },

  renderBoundingBox: function (ctx) {
    ctx.beginPath()
    ctx.rect(0, 0, this.canvas.width, this.canvas.height)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.strokeStyle = '#555'
    ctx.stroke()
  },

  renderEdges: function (ctx, edges) {
    ctx.beginPath()
    ctx.strokeStyle = "#000"
    let iEdge = edges.length
    let edge
    while (iEdge--) {
      edge = edges[iEdge]
      ctx.moveTo(edge.va.x, edge.va.y)
      ctx.lineTo(edge.vb.x, edge.vb.y)
    }
    ctx.stroke()
  },

  renderPoints: function (ctx, points) {
    ctx.beginPath()
    ctx.fillStyle = '#a22'
    let iPoint = points.length
    while (iPoint--) {
      ctx.fillRect(points[iPoint].x, points[iPoint].y, 2, 2)
    }
  }
}