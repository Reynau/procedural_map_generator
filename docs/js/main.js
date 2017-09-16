let basicVoronoi = {
  voronoi: new Voronoi(),
  diagram: null,
  margin: 0,
  canvas: null,
  bbox: {xl:0, xr:800, yt:0, yb:600},
  points: [],

  init: function (n, margin) {
    if (margin === null || margin === undefined) margin = 0

    this.margin = margin
    this.canvas = document.getElementById('voronoiCanvas')
    this.generatePoints(n)
  },

  generatePoints: function (n) {
    let points = []

    let xmargin = this.canvas.width * this.margin
    let ymargin = this.canvas.height * this.margin
    let xo = xmargin
    let dx = this.canvas.width - xmargin*2
    let yo = ymargin
    let dy = this.canvas.height - ymargin*2

    for (let i = 0; i < n; ++i) {
      let x = self.Math.round((xo+self.Math.random()*dx))
      let y = self.Math.round((yo+self.Math.random()*dy))
      points.push({x: x, y: y});
    }

    this.compute(points)
  },

  compute: function (points) {
    this.points = points
    this.voronoi.recycle(this.diagram)
    this.diagram = this.voronoi.compute(points, this.bbox)
    this.render()
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