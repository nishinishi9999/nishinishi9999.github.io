/***********
* map.js
***********/

/************
* Constants
************/
const API_KEY = 'a81aedebf38b8d08c11610d2129efa2b';


/*******************
* Global variables
*******************/
var tip;

var svg = d3.select('#svg');

var color_scale = d3.scale.linear()
        .domain([-3, 20])
        .range(['blue', 'red']);
        

/************
* Functions
************/
function get_data(name, name_jp)
    {
        var url = 'http://api.openweathermap.org/data/2.5/weather?'
            + 'q=' + name + ',jp'
            + '&units=metric'
            + '&appid=' + API_KEY;

        
        $.get( encodeURI(url), function(data)
            {
                var el = $('#'+name);
                
                el.attr('temp',     data.main.temp);
                el.attr('humidity', data.main.humidity);
                el.attr('pressure', data.main.pressure);
                el.attr('temp_max', data.main.temp_max);
                el.attr('temp_min', data.main.temp_min);
                el.attr('name_jp',  name_jp);
                
                el.css('fill', color_scale(data.main.temp));
            });
    }

function draw_map()
    {
        var height = 800;
        var width  = 800;

        
        var projection = d3.geo.albers()
            .scale(2000)
            .center([-45, 141])
            .rotate([180]);

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
                        
                        repeat(name, name_jp, i);
                        console.log(i, name);
                    }
            });
    }

function repeat(name, name_jp, i)
    {
        setTimeout( function() { get_data(name, name_jp) }, i*100);
        setTimeout( function() { repeat(name, name_jp, i); }, 3600000 );
    }


/************
* Execution
************/

draw_map();
