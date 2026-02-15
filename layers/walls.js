const svg = document.getElementById('walls-layer');
let wallsData = [];
let wallsVisible = false;

fetch('data/architectural.json')
  .then(res => res.json())
  .then(data => {
    wallsData = data.walls;
    createWallElements();
    updateWalls();
  });

function createWallElements() {
  wallsData.forEach(wall => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("id", wall.id);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("stroke", "red");
    line.setAttribute("stroke-width", "4");

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.textContent = wall.label;
    text.setAttribute("fill", "red");
    text.setAttribute("font-size", "14");

    g.appendChild(line);
    g.appendChild(text);
    svg.appendChild(g);

    wall._el = { g, line, text };
  });
}

function updateWalls() {
  if (!window.appView) return;

  const yaw = window.appView.yaw();
  const pitch = window.appView.pitch();
  const fov = window.appView.fov();

  const width = window.innerWidth;
  const height = window.innerHeight;

  wallsData.forEach(wall => {
    const dyaw = wall.yaw - yaw;
    const dpitch = wall.pitch - pitch;

    // خارج مجال الرؤية
    if (Math.abs(dyaw) > fov || Math.abs(dpitch) > fov / 2) {
      wall._el.g.style.display = 'none';
      return;
    }

    wall._el.g.style.display = wallsVisible ? 'block' : 'none';

    const x = (0.5 + dyaw / fov) * width;
    const y = (0.5 - dpitch / fov) * height;

    wall._el.line.setAttribute('x1', x - 40);
    wall._el.line.setAttribute('y1', y);
    wall._el.line.setAttribute('x2', x + 40);
    wall._el.line.setAttribute('y2', y);

    wall._el.text.setAttribute('x', x - 40);
    wall._el.text.setAttribute('y', y - 10);
  });

  requestAnimationFrame(updateWalls);
}

function toggleWalls() {
  wallsVisible = !wallsVisible;
  svg.style.display = wallsVisible ? 'block' : 'none';
}