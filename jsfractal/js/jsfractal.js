function isdefined(n)
    {
        return typeof n === "undefined" ? 0 : 1;
    }

function time()
    {
        return new Date().getTime();
    }

function random(limit)
    {
        return parseInt(Math.random()*1000)%limit;
    }

function antialiase(aargb)
    {
        for(let y = 0; y < size; y++) { for(let x = 0; x < size; x++) { for(let n in aargb[y][x])
            {
                var c = aargb[y][x][n];
                var counter = 1;
            
                if( isdefined(aargb[y][x-1]) ) { c += aargb[y][x-1][n]; counter++; }
                if( isdefined(aargb[y][x+1]) ) { c += aargb[y][x+1][n]; counter++; }
                if( isdefined(aargb[y-1]) )
                    {
                        if( isdefined(aargb[y-1][x])   ) { c += aargb[y-1][x][n];   counter++; }
                        if( isdefined(aargb[y-1][x-1]) ) { c += aargb[y-1][x-1][n]; counter++; }
                        if( isdefined(aargb[y-1][x+1]) ) { c += aargb[y-1][x+1][n]; counter++; }
                    }
                if(typeof aargb[y+1] !== "undefined")
                    {
                        if(isdefined( aargb[y+1][x])   ) { c += aargb[y+1][x][n];   counter++; }
                        if(isdefined( aargb[y+1][x-1]) ) { c += aargb[y+1][x-1][n]; counter++; }
                        if(isdefined( aargb[y+1][x+1]) ) { c += aargb[y+1][x+1][n]; counter++; }
                    }
                
                c = parseInt(c / counter);
                aargb[y][x][n] = c;
            }}}
        
        return aargb;
    }
    
function get_constant(x, y, i, fsize, xdeviation, ydeviation)
    {
        return new Complex(0, i).mul(y/fsize + ydeviation).add(x/fsize + xdeviation);
    }

function process_fractal(size, times, fsize, expn, set, z0, xdeviation, ydeviation, antialias)
    {
        var processtime = time();
        
        var decimal = 20 / size;
        var nrgb    = [];
        
        // Loop for every number in the plane
        for(let y = -10, yn = 0; y < 10; y += decimal, yn++)
            {
                nrgb.push([]);
                for(let x = -9.9999, xn = 0; x < 10; x += decimal, xn++)
                    {
                        var z = new Complex(z0, 0);
                        var c = get_constant(x, y, 1, fsize, xdeviation, ydeviation);
                        
                        var counter = 0;
                        for(let n = 0; z.re < set && z.re > -set && n < times; n++)
                            {
                                counter++;
                                
                                z = z.add( z.pow(expn).add(c) );
                            }
                        
                        nrgb[yn].push(counter);
                    }
            }
            
        
        // Process time
        var processtime = time() - processtime;
        
        // Draw fractal
        var drawtime = time();
        draw_fractal(nrgb, size, times, antialias);
        drawtime = time() - drawtime;
    
        // Print time
        console.log("Total time   : " + (processtime + drawtime) + "ms");
        console.log("Process time : " + processtime + "ms");
        console.log("Draw time    : " + drawtime    + "ms");
    }

function draw_fractal(rgb, size, times, antialias)
    {
        var canvas = $("#canvas")[0].getContext("2d");
        var data   = canvas.createImageData(size, size);
        
        var d4      = times/4;                  // times divided by 4
        var d3      = times/3;                  // times divided by 3
        var d2      = times/2;                  // times divided by 2
        var dtimes  = parseInt((255/times)*3);  // 255 divided by times, multiplied for 3 for more brightness
        var d2times = parseInt(dtimes/2);
        var d3times = parseInt(dtimes/3);
        
        var r = [0, 0, 0];
        var g = [0, 0, 0];
        var b = [0, 0, 0];
        
        /* Randomize
        r[0] = random(255); r[1] = random(255); r[2] = random(255);
        g[0] = random(255); g[1] = random(255); g[2] = random(255);
        b[0] = random(255); r[1] = random(255); b[2] = random(255);*/
        
        
        for(let y = 0, counter = 0; y < size; y++)
            {
                for(let x = 0; x < size; x++)
                    {
                        var c = rgb[y][x];
                
                        if     (c < d4)     { rgb[y][x] = [r[0]*c,     g[0]*c,   dtimes*c, 255]; }
                        else if(c < d3)     { rgb[y][x] = [r[1]*c,     dtimes*c, b[1]*c,   255]; }
                        else if(c != times) { rgb[y][x] = [dtimes*c,   g[2]*c,   b[2]*c,   255]; }
                        else                { rgb[y][x] = [0, 0, 0, 255]; }
                    }
            }
            
        if( antialias ) { rgb = antialiase(rgb) };
        
        var counter = 0;
        for(let y in rgb) { for(let x in rgb[y]) { for(let n in rgb[y][x]) {
            data.data[counter++] = rgb[y][x][n];
        }}}
        
        // Redimensionate canvas
        $("#canvas")[0].width  = size;
        $("#canvas")[0].height = size;
        $("#canvastd").css("padding-left", (180 - size / 8 + "px"));
        canvas.putImageData(data, 0, 0);
    }


/*---------------------------------------------------------------------------------------------------------------------
                                            Variable declaration
---------------------------------------------------------------------------------------------------------------------*/

//var START = time.time();

var size       = 400;     // Size of the image
var times      = 40;      // Number of iterations to try
var startx     = -10;     // Start value of x
var endx       = 10;      // End value of x
var fsize      = 5;       // Size of the fractal, the bigger it is, the smaller the fractal is
var expn       = 2;       // Exponent of x
var set        = 2;       // Start and end of the set
var z0         = -0.5;    // Initial z value
var threadn    = 2;       // Number of threads
var xdeviation = 0;       // Horizontal deviation
var ydeviation = 0;       // Vertical deviation
var antialias  = 0;

// Set default values
$("#size").val(size);
$("#times").val(times);
$("#fsize").val(fsize);
$("#expn").val(expn);
$("#set").val(set);
$("#z0").val(z0);
$("#threadn").val(threadn);

//var worker = new Worker(test("test.js"));


/*-----------------------------------------------------------------------------------------------------------------*/

// Prevent form from reloading the page
$("#size, #times, #fsize, #x, #expn, #set, #z0, #threadn").keypress
    (
        function(event)
            {
                if( event.which == 13 )
                    {
                        event.preventDefault();
                        
                        var size    = parseInt($("#size").val());
                        var times   = parseInt($("#times").val());
                        var fsize   = parseFloat($("#fsize").val());
                        var expn    = parseFloat($("#expn").val());
                        var set     = parseFloat($("#set").val());
                        var z0      = parseFloat($("#z0").val());
                        var threadn = parseInt($("#threadn").val());
                        var antialias = $("#aacheck")[0].checked;
                        
                        process_fractal(size, times, fsize, expn, set, z0, xdeviation, ydeviation, antialias);
                    }
            }
    );
