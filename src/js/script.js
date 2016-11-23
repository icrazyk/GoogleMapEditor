var map;

// functions

function initMap() 
{
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 54, lng: 35},
    zoom: 5
  });

  initDataLayerStyles();
  initInstruments();
  initDrawingList();
  initMapControlTools();
}

function initInstruments()
{
  $('#instruments').click(function(e)
  {
    if(e.target.tagName == 'BUTTON')
    {
      setInstrument(e.target);
    }
  });

  function setInstrument(instrument)
  {
    var activeClass = 'drawings-instruments__btn_active';
    var instrumentName = $(instrument).data('instrument');
    $('#instruments')
      .children()
      .removeClass(activeClass);

    $(instrument)
      .addClass(activeClass);
    
    switch(instrumentName)
    {
      case 'edit':
        setEditStatus(true);
        map.data.setDrawingMode(null);
        break;

      case null:
        setEditStatus(false);
        map.data.setDrawingMode(instrumentName);    
        break;

      default:
        setEditStatus(false);
        map.data.setDrawingMode(instrumentName);
        break;
    }
  }

  function setEditStatus(status)
  {
    initDataLayerStyles(status)
  }
}

function initDrawingList()
{
  $('#drawings-list')
    .click(function(e)
    {
      var listEvent = $(e.target).data('btn');
      if(listEvent)
      {
        var listItem = $(e.target).closest('.drawings-list__item');
        var feature = listItem.data('feature');
        switch(listEvent)
        {
          case 'drawing-delete':
            map.data.remove(feature);
            listItem.remove();
            break;
        }
      }
    });

  map.data.addListener('addfeature', function(drawing)
  {
    $(
      '<li class="drawings-list__item">' +
        '<div class="drawing-info"><span class="drawing-info__title">'+ drawing.feature.getGeometry().getType() +'</span></div>' +
        '<div class="drawing-tools">' +
          '<button class="drawing-tools__btn" data-btn="drawing-delete">Delete</button>' +
        '</div>' +
      '</li>'
    )
    .data('feature', drawing.feature)
    .mouseover(function()
    {
      console.log('Навели');
    })
    .mouseout(function()
    {
      console.log('НЕ навели');
    })
    .appendTo('#drawings-list');
  });
}

function initMapControlTools()
{
  $('#drawings-state').click(function(e)
  {
    var state = $(e.target).data('btn');
    if(state)
    {
      switch(state)
      {
        case 'map-save':
          map.data.toGeoJson(function(geoJson)
          {
            console.log(geoJson);
          });
          break;

        case 'map-reset':
          if(confirm('Удалить все элементы?'))
          {
            map.data.forEach(function(feature)
            {
              map.data.remove(feature);
            });
            $('#drawings-list').html('');
          }
          break;
      }
    }
  });
}

function initDataLayerStyles(editable)
{
  map.data.setStyle(function(feature)
  {
    var prop = {
      fillColor: 'blue',
      strokeColor: 'blue'
    };
    if(editable)
    {
      prop.editable = true;
      prop.draggable = true;
    }
    return prop;
  });
}
