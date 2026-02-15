const viewerElement = document.getElementById('viewer');
const viewer = new Marzipano.Viewer(viewerElement);

const source = Marzipano.ImageUrlSource.fromString(
  "../img/panoramas/room.jpg"
);

const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);
const limiter = Marzipano.RectilinearView.limit.traditional(
  1024,
  120 * Math.PI / 180
);

const view = new Marzipano.RectilinearView(null, limiter);

const scene = viewer.createScene({
  source,
  geometry,
  view
});

scene.switchTo();

/* إتاحة الكاميرا لبقية النظام */
window.appView = view;

/* ===============================
   LOAD ELECTRICAL DATA
   =============================== */

fetch('data/architectural.json')
  .then(res => res.json())
  .then(data => {
    const svg = document.getElementById('electrical-layer');
    if (!svg || !data.electrical) return;

    data.electrical.forEach(line => {
      const path = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      );
      path.setAttribute('d', line.path);
      path.setAttribute('class', 'electrical-path');
      svg.appendChild(path);
    });
  });
