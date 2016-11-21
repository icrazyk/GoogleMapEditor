var map;
var drawingManager;
var infoWindow;
var store;

// functions

function initMap() 
{
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });

  var markerPosition = new google.maps.LatLng(-34.397, 150.644);

  // marker.setMap(map);

  initDrawing(map);
}

function initDrawing()
{
  var drawingManagerOptions = 
  {
    drawingControlOptions: 
    {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: 
      [
        google.maps.drawing.OverlayType.MARKER,
        google.maps.drawing.OverlayType.POLYLINE,
        google.maps.drawing.OverlayType.POLYGON,
        google.maps.drawing.OverlayType.CIRCLE,
        google.maps.drawing.OverlayType.RECTANGLE
      ]
    },
    circleOptions: 
    {
      editable: true
    },
    markerOptions: 
    {
      draggable: true
    }
  };

  drawingManager = new google.maps.drawing.DrawingManager(drawingManagerOptions);

  drawingManager.setMap(map);

  // handlers

  google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) 
  {
    switch(event.type)
    {
      case google.maps.drawing.OverlayType.MARKER:
        var coordinates = event.overlay.getPosition().toJSON();
        var InfoWindowContent = prompt('Укажите текст подсказки', '');
        setInfoWindow(map, event.overlay, InfoWindowContent);
        break;
      case google.maps.drawing.OverlayType.POLYLINE:
        break;
      case google.maps.drawing.OverlayType.POLYGON:
        break;
      case google.maps.drawing.OverlayType.CIRCLE:
        break;
      case google.maps.drawing.OverlayType.RECTANGLE:
        break; 
    }
  });

  // functions

  function setInfoWindow(map, marker, content)
  {
    if(content)
    {
      google.maps.event.addListener(marker, 'click', function()
      {
        if(typeof infoWindow != 'undefined') infoWindow.close(); 
        infoWindow = new google.maps.InfoWindow({
          content: content,
          maxWidth: 200
        });
        infoWindow.open(map, marker);
      });
    }
  }
}
