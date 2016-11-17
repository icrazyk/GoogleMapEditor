var map;

function initMap() 
{
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });

  initDrawing(map);
}

function initDrawing(map)
{
  var drawingManagerOptions = {
    // drawingMode: google.maps.drawing.OverlayType.MARKER,     // Default draw tool    
    // drawingControl: false                                    // Hide control
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.MARKER,
        google.maps.drawing.OverlayType.POLYLINE,
        google.maps.drawing.OverlayType.POLYGON,
        google.maps.drawing.OverlayType.CIRCLE,
        google.maps.drawing.OverlayType.RECTANGLE
      ]
    },
    circleOptions: {
      fillColor: '#ffff00',
      fillOpacity: 0.3,
      strokeWeight: 2,
      clickable: false,
      editable: true,
    },
    markerOptions: {
      draggable: true,
      editable: true,
      title: 'test'
    }
  };

  var drawingManager = new google.maps.drawing.DrawingManager(drawingManagerOptions);
  drawingManager.setMap(map);

  var drawing = {
    config: drawingManagerOptions,
    manager: drawingManager
  }

  initDrawConfigPanel(drawing);
}

function initDrawConfigPanel(drawing)
{
  createControlPosition(drawing);
}

function createControlPosition(drawing)
{
  var controlPositionOptions = '';

  //
  // create
  //
  for(position in google.maps.ControlPosition)
  {
    controlPositionOptions += '<option value="' + position+ '">' + position+ '</option>';
  }

  var controlPositionSelect = $('<select>', {id: 'control-position'})
    .append(controlPositionOptions)
    .appendTo('#map-control');

  //
  // handlers
  //
  controlPositionSelect.change(function(){  
    
  });
}