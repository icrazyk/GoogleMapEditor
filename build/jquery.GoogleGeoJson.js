(function($)
{
  var tpl = 
  {
    wrap: '<div class="ggj"><div class="ggj-map"></div><div class="ggj-control"><div class="ggj-control__content"><div class="ggj-widgets"><div class="ggj-widgets__item"><div class="ggj-widget"><h3 class="ggj-widget__head">Tools</h3><div class="ggj-widget__content"><div class="ggj-brush"><button class="ggj-brush__btn ggj-brush__btn_active" data-instrument="view">View</button> <button class="ggj-brush__btn" data-instrument="edit">Edit</button> <button class="ggj-brush__btn" data-instrument="Point">Point</button> <button class="ggj-brush__btn" data-instrument="LineString">Polyline</button> <button class="ggj-brush__btn" data-instrument="Polygon">Polygon</button></div></div></div></div><div class="ggj-widgets__item"><div class="ggj-widget"><h3 class="ggj-widget__head">Drawings</h3><div class="ggj-widget__content"><ol class="ggj-drawings"></ol></div></div></div><div class="ggj-widgets__item"><div class="ggj-widget"><h3 class="ggj-widget__head">Map</h3><div class="ggj-widget__content"><div class="ggj-dwstate"><button class="ggj-dwstate__btn" data-btn="map-save">Save</button> <button class="ggj-dwstate__btn" data-btn="map-reset">Reset</button></div></div></div></div></div></div><div class="ggj-control__trigger"><div class="ggj-ctrl-trigger"><span class="ggj-ctrl-trigger__show">&#60;&#60;&#60; Show</span><div class="ggj-ctrl-trigger__hide">&#62;&#62;&#62; Hide</div></div></div></div></div>',
    drawing_item: '<li class="ggj-drawings__item"><div class="ggj-drawing"><div class="ggj-drawing__content"><div class="ggj-dwcontent"><div class="ggj-dwcontent__title"></div></div></div><div class="ggj-drawing__editor"><form class="ggj-dweditor"><div class="ggj-dweditor__prop"><p class="ggj-dweditor-prop"><label for="name" class="ggj-dweditor-prop__label">Name</label><br><input type="text" name="name"></p><p class="ggj-dweditor-prop"><label for="stroke" class="ggj-dweditor-prop__label">Stroke</label><br><input type="number" name="stroke"></p><p class="ggj-dweditor-prop"><label for="stroke-color" class="ggj-dweditor-prop__label">Stroke color</label><br><input type="color" name="stroke-color"></p></div><div class="ggj-dweditor__tool"><p class="ggj-dweditor-tool"><button class="ggj-dweditor-tool__btn" name="save">Save</button> <button class="ggj-dweditor-tool__btn" name="cancel">Cancel</button></p></div></form></div><div class="ggj-drawing__tool"><div class="ggj-dwtool"><button class="ggj-dwtool__btn" data-btn="drawing-delete">Delete</button> <button class="ggj-dwtool__btn" data-btn="drawing-rename">Rename</button></div></div></div></li>'
  };

  var methods =
  {
    init: function(options)
    {

      var settings = $.extend( {
        center : {lat: 54, lng: 35},
        zoom : 6
      }, options);
      
      return this.each(function()
      {
        var self = this,
            $this = $(this),
            data = $this.data('ggj');
        
        if(!data)
        {
          $ggj = $(tpl.wrap);

          $this.append($ggj);

          var map = new google.maps.Map($(this).find('.ggj-map')[0], settings);

          setDataLayerStyle();

          //
          // handlers
          //

          // brush

          $this.find('.ggj-brush').on('click.ggj', function(e)
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

          var drawings = $this.find('.ggj-drawings');

          $(drawings).on('click.ggj', function(e)
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
                case 'drawing-rename':
                  var name = prompt('Write new name', feature.getProperty('name'));
                  feature.setProperty('name', name);
                  listItem.find('.ggj-dwcontent__title').text(name);
                  break;
                case 'drawing-edit':
                  var name = prompt('Write new name', feature.getProperty('name'));
                  feature.setProperty('name', name);
                  listItem.find('.ggj-dwcontent__title').text(name);
                  break;
              }
            }
          });

          map.data.addListener('addfeature', function(drawing)
          {
            drawing.feature.setProperty('id', getRandomInt());
            drawing.feature.setProperty('name', drawing.feature.getGeometry().getType());

            // create, add handlers

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
            
            // add title

            $(drawingItem)
              .find('.ggj-dwcontent__title')
              .html(drawing.feature.getGeometry().getType());
            
            // add to dom

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

          $(this).find('.ggj-dwstate').on('click.ggj', function(e)
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

          $(this).find('.ggj-ctrl-trigger').on('click.ggj',function()
          {
            $(self).toggleClass('ggj_control_hidden');
            google.maps.event.trigger(map, 'resize');
          });
          
          // set jQuery object data

          $(this).data('ggj', {
              target : $this,
              map : map, // google map object
              ggj : $ggj // ggj jQuery object
          });
        }

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
      });
    },
    addGeoJson: function(geoJson)
    {
      return this.each(function()
      {
        var $this = $(this),
            data = $this.data('ggj'),
            map = data.map;
            
            map.data.addGeoJson(geoJson);
      });
    },
    loadGeoJson: function(geoJsonUrl)
    {
      return this.each(function()
      {
        var $this = $(this),
            data = $this.data('ggj'),
            map = data.map;
            
            map.data.loadGeoJson(geoJsonUrl);
      });
    },
    toGeoJson: function(handlerJson)
    {
      return this.each(function()
      {
        var $this = $(this),
            data = $this.data('ggj'),
            map = data.map;
            
            map.data.toGeoJson(handlerJson);
      });
    },
    destroy : function() 
    {
      return this.each(function()
      {
        var $this = $(this),
            data = $this.data('ggj');

        $(window).off('.ggj'); // remove events
        data.ggj.remove(); // remove markup
        $this.removeData('ggj'); // remove data storage
      })
    }
  }

  //
  // jQuery interface
  //

  $.fn.GoogleGeoJson = function(method)
  {
    if(methods[method])
    {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else if(typeof method === 'object' || ! method)
    {
      return methods.init.apply(this, arguments);
    }
    else
    {
      $.error('The method '+ method +' does not exist on jQuery.GoogleGeoJson');
    }
  };

  function getRandomInt()
  {
    var min = 0;
    var max = 99999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
})(jQuery);
