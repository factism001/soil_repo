var drawControl = new L.Control.Draw({
  draw: {
   polygon: {
     shapeOptions: {
       color: 'purple'
     },
   },
   polyline: {
     shapeOptions: {
       color: 'red'
     },
   },
   rect: {
     shapeOptions: {
       color: 'green'
     },
   },
   circle: {
     shapeOptions: {
       color: 'steelblue'
     },
   },
  },
  edit: {
    featureGroup: drawnItems
  }
});
map.addControl(drawControl);

map.on('draw:created', function (e) {
        var type = e.layerType,
                layer = e.layer;
        drawnItems.addLayer(layer);
});
