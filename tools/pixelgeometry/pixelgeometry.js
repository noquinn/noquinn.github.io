var c = document.getElementById("plane");
var ctx = c.getContext("2d");
ctx.font = "12px Verdana";

var shapeSelector = document.getElementById('shapeSelector');

var blocks;
var saveName;

function renderBackground() {
  ctx.lineWidth = 90 / gridSize;
  var tilesDrawn = 0;
  axesrc = [gridSize / 2, gridSize / 2 - 1, (gridSize - 1) / 2];
  for (row = 0; row < gridSize; row ++) {
    boxY = (c.width / gridSize) * (-gridSize * 0.5 + row + 0.5);
    for (column = 0; column < gridSize; column ++) {
      boxX = (c.width / gridSize) * (-gridSize * 0.5 + column + 0.5);
      if (axesrc.includes(row) || axesrc.includes(column)) {
        ctx.fillStyle = "#ebebff";
      } else {
        ctx.fillStyle = "#d7d7e0";
      }
      drawTileCoords(boxX, boxY, c.width / gridSize * .75);
      tilesDrawn ++;
    }
  }
}

function drawTileBlock(x, y) { // int coords
  if (gridSize % 2 == 0) {
    // block positions adjusted according to grid size
    // odd and even dimension grid have different centers
    x += 0.5 * -x / Math.abs(x);
    y += 0.5 * -y / Math.abs(y);
  }
  if (blocks.includes(x + ", " + y) || isNaN(x) || isNaN(y)) { // don't render duplicate blocks
  } else {
    blocks.push(x + ", " + y);
    ctx.fillStyle = "#02012b";
    drawTileCoords(x * (c.width / gridSize), y * (c.width / gridSize), c.width / gridSize * 0.75);
  }
}

function drawTileCoords(x, y, size) {
  ctx.fillRect(tx(x) - size / 2, ty(y) - size / 2, size, size);
}

function blockLine(x1, y1, x2, y2, steps) {
  xstep = (x2 - x1) / steps;
  ystep = (y2 - y1) / steps;
  for (count = 0; count < steps; count ++) {
    drawTileBlock(Math.round(x1 + count * xstep), Math.round(y1 + count * ystep));
  }
}

function renderUpdate() {
  blocks = [];
  drawClear();

  if (shapeSelector.value == "archimedian") {
    gridSize = archimedian.diameter.value + 4;
    renderBackground();
    archimedian.render(archimedian.loops.value, archimedian.diameter.value, archimedian.rot.value);
  }

  if (shapeSelector.value == "hypocycloid") {
    gridSize = hypocycloid.diameter.value + 4;
    renderBackground();
    hypocycloid.render(hypocycloid.cusps.value, hypocycloid.diameter.value, hypocycloid.rot.value);
  }

  if (shapeSelector.value == "hypercycloid") {
    gridSize = hypercycloid.diameter.value + 4;
    renderBackground();
    hypercycloid.render(hypercycloid.cusps.value, hypercycloid.diameter.value, hypercycloid.rot.value);
  }

  if (shapeSelector.value == "polygon") {
    gridSize = polygon.diameter.value + 4;
    renderBackground();
    polygon.render(polygon.sides.value, polygon.diameter.value / 2, polygon.rot.value, 0);
  }

  if(shapeSelector.value == "reuleaux") {
    gridSize = reuleaux.diameter.value + 4;
    renderBackground();
    reuleaux.render(reuleaux.sides.value, reuleaux.diameter.value / 2, reuleaux.rot.value);
  }

  if (shapeSelector.value == "superellipse") {
    if (superellipse.width.value > superellipse.height.value) {
      gridSize = superellipse.width.value + 4;
    } else {
      gridSize = superellipse.height.value + 4;
    }
    renderBackground();
    superellipse.render(superellipse.width.value / 2, superellipse.height.value / 2, superellipse.exponent.value, .1);
  }
  
  ctx.fillStyle = "#000000";
  if (document.getElementById("blockCountToggle").checked) {
    ctx.fillText("BLOCK COUNT: " + blocks.length, c.width - 130, 15);
  }
}

function drawClear() {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, c.width, c.height);
}

var archimedian = {
  loops: {
    value: 5,
    slider: document.getElementById("archimedianLoopsSlider"),
    disp: document.getElementById("archimedianLoopsDisp")
  },
  diameter: {
    value: 50,
    slider: document.getElementById("archimedianDiameterSlider"),
    disp: document.getElementById("archimedianDiameterDisp")
  },
  rot: {
    value: 0,
    slider: document.getElementById("archimedianRotSlider"),
    disp: document.getElementById("archimedianRotDisp")
  },
  render: function(loops, diameter, rot) {
    var a = diameter / 4 / loops / Math.PI;
    var r = rot * Math.PI / 180;
    for(t = 0; t < loops * 2 * Math.PI; t += .02) {
      drawTileBlock(Math.round(a * t * Math.cos(t + r)), Math.round(a * t * Math.sin(t + r)));
    }
    saveName = "ArchimedianSpiral-L" + loops + "-D" + diameter + "-R" + rot;
  }
};

var hypercycloid = {
  cusps: {
    value: 5,
    slider: document.getElementById("hypercycloidCuspsSlider"),
    disp: document.getElementById("hypercycloidCuspsDisp")
  },
  diameter: {
    value: 50,
    slider: document.getElementById("hypercycloidDiameterSlider"),
    disp: document.getElementById("hypercycloidDiameterDisp")
  },
  rot: {
    value: 0,
    slider: document.getElementById("hypercycloidRotSlider"),
    disp: document.getElementById("hypercycloidRotDisp")
  },
  render: function(cusps, diameter, rot) {
    var br = diameter / 2; // big radius
    var sr = br / (cusps + 2); // small radius
    for (t = 0; t < 360; t += .5) {
      drawTileBlock(Math.round((br - sr) * cos(t + rot) + sr * cos((br - sr) / sr * t)), Math.round((br - sr) * sin(t + rot) + sr * sin((br - sr) / sr * t)));
    }
    saveName = "Hypercycloid-C" + cusps + "-D" + diameter + "-R" + rot;
  }
};

var hypocycloid = {
  cusps: {
    value: 5,
    slider: document.getElementById("hypocycloidCuspsSlider"),
    disp: document.getElementById("hypocycloidCuspsDisp")
  },
  diameter: {
    value: 50,
    slider: document.getElementById("hypocycloidDiameterSlider"),
    disp: document.getElementById("hypocycloidDiameterDisp")
  },
  rot: {
    value: 0,
    slider: document.getElementById("hypocycloidRotSlider"),
    disp: document.getElementById("hypocycloidRotDisp")
  },
  render: function(cusps, diameter, rot) {
    var br = diameter / 2; // big radius
    var sr = br / cusps; // small radius
    for (t = 0; t < 360; t += .5) {
      drawTileBlock(Math.round((br - sr) * cos(t + rot) + sr * cos((br - sr) / sr * t)), Math.round((br - sr) * sin(t + rot) - sr * sin((br - sr) / sr * t)));
    }
    saveName = "Hypocycloid-C" + cusps + "-D" + diameter + "-R" + rot;
  }
};

var polygon = {
  sides: {
    value: 5,
    slider: document.getElementById("polygonSidesSlider"),
    disp: document.getElementById("polygonSidesDisp")
  },
  diameter: {
    value: 50,
    slider: document.getElementById("polygonDiameterSlider"),
    disp: document.getElementById("polygonDiameterDisp")
  },
  rot: {
    value: 0,
    slider: document.getElementById("polygonRotSlider"),
    disp: document.getElementById("polygonRotDisp")
  },
  render: function(sides, rad, rot) {
    var points = [];
    for (i = 0; i < sides + 1; i ++) {
      xpoint = rad * cos(i * 360 / sides + rot);
      ypoint = rad * sin(i * 360 / sides + rot);
      points.push(xpoint, ypoint);
    }
    for (i = 0; i < points.length; i ++) {
      blockLine(points[2 * i], points[2 * i + 1], points[2 * i + 2], points[2 * i + 3], 120);
    }
    saveName = "RegularPolygon-S" + sides + "-R" + rad + "-R" + rot;
  }
};

var reuleaux = {
  sides: {
    value: 3,
    slider: document.getElementById("reuleauxSidesSlider"),
    disp: document.getElementById("reuleauxSidesDisp")
  },
  diameter: {
    value: 50,
    slider: document.getElementById("reuleauxDiameterSlider"),
    disp: document.getElementById("reuleauxDiameterDisp")
  },
  rot: {
    value: 90,
    slider: document.getElementById("reuleauxRotSlider"),
    disp: document.getElementById("reuleauxRotDisp")
  },
  render: function(sides, rad, rot) {
    var points = [];
    for (i = 0; i < sides + 1; i ++) {
      xpoint = rad * cos(i * 360 / sides + rot);
      ypoint = rad * sin(i * 360 / sides + rot);
      points.push(xpoint, ypoint);
    }
    var rrad = dist(points[0], points[1], points[Math.round(sides/2) * 2], points[Math.round(sides/2) * 2 + 1]);
    var arc = 180/sides; // arc length
    for (i = 0; i < points.length / 2 - 1; i++) {
      var start = atan(points[2*opp(i)+1] - points[2*i+1], points[2*opp(i)] - points[2*i]);
      for(var c = start - arc; c < start; c += .2) {
        drawTileBlock(Math.round(points[i*2] + rrad * cos(c)), Math.round(points[i*2+1] + rrad * sin(c)));
      }
    }
    function opp(i) { // gets value of point opposite to input
      var diff = Math.round(sides / 2);
      return (i + diff) % sides;
    }
    saveName = "ReuleauxPolygon-S" + sides + "-R" + rad + "-R" + rot;
  }
};

var superellipse = {
  exponent: {
    value: 5,
    slider: document.getElementById("superellipseExponentSlider"),
    disp: document.getElementById("superellipseExponentDisp")
  },
  width: {
    value: 50,
    slider: document.getElementById("superellipseWidthSlider"),
    disp: document.getElementById("superellipseWidthDisp"),
  },
  height: {
    value: 50,
    slider: document.getElementById("superellipseHeightSlider"),
    disp: document.getElementById("superellipseHeightDisp")
  },
  render: function(w, h, e, s) { // w: width, h: height, e: exponent, s: steps
    for (t = 90; t > 0; t -= s) {
      drawTileBlock(Math.round(-w * cos(t) ** (2 / e)), Math.round(h * sin(t) ** (2 / e)));
      drawTileBlock(Math.round(w * cos(t) ** (2 / e)), Math.round(-h * sin(t) ** (2 / e)));
    }
    for (t = 0; t < 90; t += s) {
      drawTileBlock(Math.round(w * cos(t) ** (2 / e)), Math.round(h * sin(t) ** (2 / e)));
      drawTileBlock(Math.round(-w * cos(t) ** (2 / e)), Math.round(-h * sin(t) ** (2 / e)));
    }
    // then connect the curves
    blockLine(Math.round(w * cos(89) ** (2 / e)), Math.round(h * sin(89) ** (2 / e)), Math.round(-w * cos(89) ** (2 / e)), Math.round(h * sin(89) ** (2 / e)), 100);
    blockLine(Math.round(-w * cos(1) ** (2 / e)), Math.round(h * sin(1) ** (2 / e)), Math.round(-w * cos(1) ** (2 / e)), Math.round(-h * sin(1) ** (2 / e)), 100);
    blockLine(Math.round(-w * cos(89) ** (2 / e)), Math.round(-h * sin(89) ** (2 / e)), Math.round(w * cos(89) ** (2 / e)), Math.round(-h * sin(89) ** (2 / e)), 100);
    blockLine(Math.round(w * cos(1) ** (2 / e)), Math.round(-h * sin(1) ** (2 / e)), Math.round(w * cos(1) ** (2 / e)), Math.round(h * sin(1) ** (2 / e)), 100);

    saveName = "Superellipse-W" + w + "-H" + h + "-E" + e;
  }
};

function inc(thing, x) {
  thing.value += x;
  if (thing.value > thing.slider.max) {
    thing.value = Number(thing.slider.max);
  } else if (thing.value < thing.slider.min) {
    thing.value = Number(thing.slider.min);
  } else {
    thing.slider.value = thing.value;
    thing.disp.innerHTML = thing.value;
    renderUpdate();
  }
  if (thing == polygon.rot || thing == reuleaux.rot || thing == archimedian.rot || thing == hypocycloid.rot) {
    snapToggle.checked = false;
    thing.disp.innerHTML = thing.value + "&#176;";
  }
  if (thing == polygon.sides || thing == hypocycloid.cusps) {
    if (snapToggle.checked) {
      updateSnapValues();
      forceSnap();
    }
  }
  if(thing == superellipse.exponent || thing == archimedian.loops) {
    thing.disp.innerHTML = roundToTwo(thing.value);
  }
}

renderUpdate();
updateSnapValues();

var snapValues;
var snapShape;
function updateSnapValues() {
  snapValues = [];
  if (shapeSelector.value == "polygon") {
    snapShape = polygon;
  }
  if (shapeSelector.value == "reuleaux") {
    snapShape = reuleaux;
  }
  if (shapeSelector.value == "hypocycloid") {
    snapShape = hypocycloid;
  }
  if (snapShape == polygon || snapShape == reuleaux) {
    for (i = 0; i < snapShape.sides.value * 4; i++) {
      snapValues.push(roundToTwo(i * 360 / (snapShape.sides.value * 4)));
    }
  }
  if (snapShape == hypocycloid) {
    for (i = 0; i < snapShape.cusps.value * 4; i++) {
      snapValues.push(roundToTwo(i * 360 / (snapShape.cusps.value * 4)));
    }
  }
  if (snapShape == hypercycloid) {
    for (i = 0; i < (snapShape.cusps.value + 2) * 4; i++) {
      snapValues.push(roundToTwo(i * 360 / ((snapShape.cusps.value + 2) * 4)));
    }
  }
}

function forceSnap() {
  snapShape.rot.value = getClosest(snapValues, snapShape.rot.slider.value);
  snapShape.rot.disp.innerHTML = snapShape.rot.value + "&#176;";
  snapShape.rot.slider.value = snapShape.rot.value;
}

function newTab() {
  var d = c.toDataURL("image/png");
  var w = window.open('about:blank', saveName);
  w.document.write("<img src='"+ d + "' width='600' height='600' />");
}

function download() {
  var link = document.createElement('a');
  if (document.getElementById('blockCountToggle').checked) {
    link.download = saveName + 'B' + '.png';
  } else {
    link.download = saveName + '.png';
  }
  link.href = c.toDataURL()
  link.click();
}

var snapToggle = document.getElementById('snapToggle');

var allControls = [
  document.getElementById('archimedianControls'),
  document.getElementById('hypercycloidControls'),
  document.getElementById('hypocycloidControls'),
  document.getElementById('polygonControls'),
  document.getElementById('reuleauxControls'),
  document.getElementById('superellipseControls'),
  document.getElementById('snap')
];

shapeSelector.onclick = function() {
  for (i = 0; i < allControls.length; i ++) {
    allControls[i].style.display = "none";
  }
  if (this.value == "archimedian") {
    document.getElementById('archimedianControls').style.display = "block";
  }
  if (this.value == "hypocycloid") {
    document.getElementById('hypocycloidControls').style.display = "block";
    document.getElementById('snap').style.display = "block";
  }
  if (this.value == "hypercycloid") {
    document.getElementById('hypercycloidControls').style.display = "block";
    document.getElementById('snap').style.display = "block";
  }
  if (this.value == "polygon") {
    document.getElementById('polygonControls').style.display = "block";
    document.getElementById('snap').style.display = "block";
  }
  if (this.value == "reuleaux") {
    document.getElementById('reuleauxControls').style.display = "block";
    document.getElementById('snap').style.display = "block";
  }
  if (this.value == "superellipse") {
    document.getElementById('superellipseControls').style.display = "block";
  }
  updateSnapValues();
  renderUpdate();
}

snapToggle.onclick = function() {
  if (this.checked) {
    updateSnapValues();
  }
};

document.getElementById("blockCountToggle").onclick = function() {
  renderUpdate();
}

// archimedian sliders -------------------------
archimedian.rot.slider.oninput = function() {
  archimedian.rot.disp.innerHTML = this.value + "&#176;";
  archimedian.rot.value = Number(this.value);
  renderUpdate();
}
archimedian.loops.slider.oninput = function() {
  archimedian.loops.value = Number(this.value);
  archimedian.loops.disp.innerHTML = this.value;
  renderUpdate();
}
archimedian.diameter.slider.oninput = function() {
  archimedian.diameter.disp.innerHTML = this.value;
  archimedian.diameter.value = Number(this.value);
  renderUpdate();
}
// ---------------------------------------------

// hypocycloid sliders -------------------------
hypocycloid.rot.slider.oninput = function() {
  if(snapToggle.checked == false) {
    hypocycloid.rot.disp.innerHTML = this.value + "&#176;";
    hypocycloid.rot.value = Number(this.value);
  } else {
    hypocycloid.rot.value = getClosest(snapValues, this.value);
    hypocycloid.rot.disp.innerHTML = hypocycloid.rot.value + "&#176;";
  }
  renderUpdate();
}
hypocycloid.cusps.slider.oninput = function() {
  hypocycloid.cusps.value = Number(this.value);
  hypocycloid.cusps.disp.innerHTML = this.value;
  if (snapToggle.checked) {
    updateSnapValues();
    forceSnap();
  }
  renderUpdate();
}
hypocycloid.diameter.slider.oninput = function() {
  hypocycloid.diameter.disp.innerHTML = this.value;
  hypocycloid.diameter.value = Number(this.value);
  renderUpdate();
}
// ---------------------------------------------

// hypercycloid sliders -------------------------
hypercycloid.rot.slider.oninput = function() {
  if(snapToggle.checked == false) {
    hypercycloid.rot.disp.innerHTML = this.value + "&#176;";
    hypercycloid.rot.value = Number(this.value);
  } else {
    hypercycloid.rot.value = getClosest(snapValues, this.value);
    hypercycloid.rot.disp.innerHTML = hypercycloid.rot.value + "&#176;";
  }
  renderUpdate();
}
hypercycloid.cusps.slider.oninput = function() {
  hypercycloid.cusps.value = Number(this.value);
  hypercycloid.cusps.disp.innerHTML = this.value;
  if (snapToggle.checked) {
    updateSnapValues();
    forceSnap();
  }
  renderUpdate();
}
hypercycloid.diameter.slider.oninput = function() {
  hypercycloid.diameter.disp.innerHTML = this.value;
  hypercycloid.diameter.value = Number(this.value);
  renderUpdate();
}
// ---------------------------------------------

// polygon sliders -----------------------------
polygon.rot.slider.oninput = function() {
  if (snapToggle.checked == false) {
    polygon.rot.disp.innerHTML = this.value + "&#176;";
    polygon.rot.value = Number(this.value);
  } else {
    polygon.rot.value = getClosest(snapValues, this.value);
    polygon.rot.disp.innerHTML = polygon.rot.value + "&#176;";
  }
  renderUpdate();
}
polygon.sides.slider.oninput = function() {
  polygon.sides.value = Number(this.value);
  polygon.sides.disp.innerHTML = this.value;
  if (snapToggle.checked) {
    updateSnapValues();
    forceSnap();
  }
  renderUpdate();
}
polygon.diameter.slider.oninput = function() {
  polygon.diameter.disp.innerHTML = this.value;
  polygon.diameter.value = Number(this.value);
  renderUpdate();
}
// --------------------------------------------

// reuleaux sliders ---------------------------
reuleaux.rot.slider.oninput = function() {
  if (snapToggle.checked == false) {
    reuleaux.rot.disp.innerHTML = this.value + "&#176;";
    reuleaux.rot.value = Number(this.value);
  } else {
    reuleaux.rot.value = getClosest(snapValues, this.value);
    reuleaux.rot.disp.innerHTML = reuleaux.rot.value + "&#176;";
  }
  renderUpdate();
}
reuleaux.sides.slider.oninput = function() {
  reuleaux.sides.value = Number(this.value);
  reuleaux.sides.disp.innerHTML = this.value;
  if (snapToggle.checked) {
    updateSnapValues();
    forceSnap();
  }
  renderUpdate();
}
reuleaux.diameter.slider.oninput = function() {
  reuleaux.diameter.disp.innerHTML = this.value;
  reuleaux.diameter.value = Number(this.value);
  renderUpdate();
}
// --------------------------------------------

// superellipse sliders -----------------------
superellipse.exponent.slider.oninput = function() {
  superellipse.exponent.disp.innerHTML = this.value;
  superellipse.exponent.value = Number(this.value);
  renderUpdate();
}
superellipse.width.slider.oninput = function() {
  superellipse.width.disp.innerHTML = this.value;
  superellipse.width.value = Number(this.value);
  renderUpdate();
}
superellipse.height.slider.oninput = function() {
  superellipse.height.disp.innerHTML = this.value;
  superellipse.height.value = Number(this.value);
  renderUpdate();
}
// -------------------------------------------

function getClosest(arr, val) {
	return arr.reduce(function (prev, curr) {
    return (Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev);
  });
}

function dist(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function atan(a, b) {
  return Math.atan2(a, b) * 180 / Math.PI;
}

function sin(degrees) {
  return Math.sin(degrees * Math.PI / 180);
}

function cos(degrees) {
  return Math.cos(degrees * Math.PI / 180);
}

function roundToTwo(x) {
  return Math.round((x + Number.EPSILON) * 100) / 100;
}

// translate to centered origin
function tx(x) {
  return x + c.width / 2;
}
function ty(y) {
  return c.height / 2 - y;
}
