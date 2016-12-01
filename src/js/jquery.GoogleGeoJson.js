(function($) 
{
  var tpl = 
  {
    wrap: '@@import wrap.html',
    drawing_item: '@@import drawing_item.html'
  };

  var methods =
  {
    init: function(config)
    {
      var self = this;
      
      $(this).append(tpl.wrap);

      var map = new google.maps.Map($(this).find('.ggj-map')[0], 
      {
        center: {lat: 54, lng: 35},
        zoom: 5
      });

      this.map = map;

      setDataLayerStyle();

      //
      // handlers
      //

      // brush

      $(this)
      .find('.ggj-brush')
      .click(function(e)
      {
        var instrumentName = $(e.target).data('instrument');

        if(instrumentName)
        {
          var activeClass = 'ggj-brush__btn_active';

          $(self)
            .find('.ggj-brush')
            .children()
            .removeClass(activeClass);

          $(e.target)
            .addClass(activeClass);
          
          switch(instrumentName)
          {
            case 'edit':
              setDataLayerStyle('editable');
              map.data.setDrawingMode(null);
              break;

            case 'view':
              setDataLayerStyle();
              map.data.setDrawingMode(null);
              break;

            default:
              setDataLayerStyle();
              map.data.setDrawingMode(instrumentName);
              break;
          }
        }
      });

      // drawings

      var drawings = $(this).find('.ggj-drawings');

      $(drawings)
      .click(function(e)
      {
        var listEvent = $(e.target).data('btn');
        if(listEvent)
        {
          var listItem = $(e.target).closest('.ggj-drawings__item');
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
        drawing.feature.setProperty('id', getRandomInt());

        // add to DOM

        var drawingItem = $(tpl.drawing_item)
          .data({'feature': drawing.feature})
          .attr({'data-feature-id': drawing.feature.getProperty('id')})
          .mouseover(function()
          {
            map.data.revertStyle();
            map.data.overrideStyle($(this).data('feature'), {strokeWeight: 8, animation: google.maps.Animation.BOUNCE});
          })
          .mouseout(function()
          {
            map.data.revertStyle();
          });

        $(drawingItem)
          .find('.ggj-dwcontent__title')
          .html(drawing.feature.getGeometry().getType());
        
        $(drawingItem).appendTo(drawings);
      });

      map.data.addListener('mouseover', function(event) {
        var id = event.feature.getProperty('id');
        $(drawings)
          .find('[data-feature-id="'+ id +'"]')
          .addClass('ggj-drawings__item_hover');
      });

      map.data.addListener('mouseout', function(event) {
        $(drawings)
          .children()
          .removeClass('ggj-drawings__item_hover');
      });

      // state

      $(this)
      .find('.ggj-dwstate')
      .click(function(e)
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
              if(confirm('Remove all drawings?'))
              {
                map.data.forEach(function(feature)
                {
                  map.data.remove(feature);
                });
                $(self).find('.ggj-drawings').html('');
              }
              break;
          }
        }
      });

      // ctrl trigger

      $(this)
      .find('.ggj-ctrl-trigger')
      .click(function()
      {
        $(self).toggleClass('ggj_control_hidden');
        google.maps.event.trigger(map, 'resize');
      });

      //
      // functions
      //

      function setDataLayerStyle(editable) 
      {
        map.data.setStyle(function(feature)
        {
          var prop = 
          {
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
      };
    },
    addGeoJson: function(geoJson)
    {
      return this.map.data.addGeoJson(geoJson);
    },
    loadGeoJson: function(geoJsonUrl)
    {
      return this.map.data.loadGeoJson(geoJsonUrl);
    },
    toGeoJson: function(handlerJson)
    {
      return this.map.data.toGeoJson(handlerJson);
    }
  }

  function getRandomInt()
  {
    var min = 0;
    var max = 99999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  //
  // jQuery interface
  //

  $.fn.GoogleGeoJson = function(method)
  {
    var args = arguments;

    return this.each(function()
    {
      if(methods[method])
      {
        return methods[method].apply(this, Array.prototype.slice.call(args, 1));
      }
      else if(typeof method === 'object' || ! method)
      {
        return methods.init.apply(this, args);
      }
      else
      {
        $.error('The method '+ method +' does not exist on jQuery.GoogleGeoJson');
      }
    });
  };
})(jQuery);
