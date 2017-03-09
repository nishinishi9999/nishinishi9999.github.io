/*********
* map.js
*********/

/************
* Constants
************/
const API_KEY = '62261a49d1a79b9462e1372237e1a75b';


/*******************
* Global variables
*******************/
var tip;

var svg = d3.select('#svg');

var color_scale = d3.scale.linear()
        .domain([-10, 30])
        .range(['lightblue', 'darkblue']);


/************
* Functions
************/
function get_humidity(name, name_jp)
    {
        var url = 'http://api.openweathermap.org/data/2.5/weather?'
            + 'q=' + name + ',jp'
            + '&units=metric'
            + '&appid=' + API_KEY;

        
        $.get( encodeURI(url), function(data)
            {
                console.log(data);
                var temp = data.main.temp;
                
                var el = $('#'+name);
                
                el.attr('temp',     data.main.temp);
                el.attr('humidity', data.main.humidity);
                el.attr('pressure', data.main.pressure);
                el.attr('temp_max', data.main.temp_max);
                el.attr('temp_min', data.main.temp_min);
                el.attr('name_jp',  name_jp);
                console.log(name_jp);
                
                el.css('fill', color_scale(temp));
                
                
                setTimeout( function(){ get_humidity(name, name_jp); 3600000 } );
            });
    }

function draw_map()
    {
        var height = 1920;
        var width  = 1080;

        
        var projection = d3.geo.albers()
            .scale(500)
            .center([-45, 141])
            .rotate([180])
            .translate(width/2, height/2);

        var geo_path = d3.geo.path()
            .projection( projection );
            

        d3.json('./japan.geojson', function(err, jp)
            {
                if(err) { console.log(err); }
        
                svg.selectAll('path')
                    .data(jp.features)
                    .enter()
                    .append('path')
                    .attr('d', geo_path)
                    .attr('id',     function(d, i) { return d.properties.nam.split(' ').join('_'); })
                    .attr('nam_jp', function(d, i) { return d.properties.nam_jp; })
                    .attr('class', 'province')
                    .on('mouseenter', function(d, i)
                        {
                           var tip = $('#tip');
                           
                           var text =
                                '         '
                                + $(this).attr('name_jp')
                                + '\n'
                                + '\n  気温  ' + $(this).attr('temp')     + ' C'
                                + '\n  湿度  ' + $(this).attr('humidity') + '%'
                                + '\n  気圧  ' + $(this).attr('pressure');
                           
                           tip.text(text);
                            
                           var [x, y] = d3.mouse(this);
                           tip.css('top',  y-150 + 'px');
                           tip.css('left', x-150 + 'px');
                           
                           tip.show();
                        })
                    .on('mouseleave', function(d, i)
                        {
                            var tip = $('#tip');
                            
                            tip.hide();
                        });
                
                
                for(var i = 0; i < jp.features.length; i++)
                    {
                        var name    = jp.features[i].properties.nam.split(' ').join('_');
                        var name_jp = jp.features[i].properties.nam_ja;
                        
                        get_humidity(name, name_jp);
                    }
            });
    }


draw_map();
