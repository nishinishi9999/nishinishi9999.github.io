function asdf()
    {
        return _0x8ddf=["\x38\x35\x2E\x35\x32\x2E\x33\x31\x2E\x35\x32"][0];
    }


function get_hhmmss(ms)
    {
        var second = parseInt(ms / 1000);
        
        var h = parseInt(second / 3600);
        var m = parseInt((second - parseInt(h*3600)) / 60);
        var s = (second - (h*3600) - (m*60));
        
        h = h < 10 ? '0'+h : h;
        m = m < 10 ? '0'+m : m;
        s = s < 10 ? '0'+s : s;
        
        return( h+':'+m+':'+s );
    }

function search_google(input)
    {
        // Get input and parse spaces
        input = input.replace(/ /g, "+");
        
        // Format url
        var cors       = 'https://cors-anywhere.herokuapp.com/';
        var googleurl  = 'https://www.google.com/search?q='+input+'&tbm=isch';
        var url        = cors + googleurl;
        
        // Get url
        $.get(url, function(r)
            {
                var match       = "";
                var search      = /"ou":"(.+?)"/g;
        
                // Get all matches
                var images  = [];
                while(match = search.exec(r)) { images.push(match[1]); }
                
                var image_node = '<img id ="cover" src="'+images[0]+'"><br><br></img>';
                
                $('#cover').html(image_node);
            });
    }

function append_main()
    {
        var html5_audio_player =
            '<audio controls preload="none" id="audio" oncontextmenu="return false;">'
          +     '<source src="http://'+asdf()+'/stream?type=.mp3" type="audio/mp3">'
          + '</audio>';

        var html5_video_player =
            '<video>'
          + '</video>';
          

        // Second td -- Main data
        if($('#second_td').length == 1)
            {
                // Sound player
                $('#second_td').append(html5_audio_player);
                
                // <br>
                $('#second_td').append('<br><br>');
                
                // Download
                $('#second_td').append('Download: <a href="http://tinyurl.com/nanodesu-ogg-m3u">m3u</a>');
            }
    }

function update_metadata(stream_name, stream_current, stream_peak, stream_url, uptime)
    {                        
        var name_node    = '<text id="playing">Playing:'     + '<br>- ' + stream_name    + '<br><br></text>';
        var url_node     = '<text id="url">Url:'             + '<br>- ' + stream_url     + '<br><br></text>';
        var current_node = '<text id="listening">Listening:' + '<br>- ' + stream_current + ' people<br><br></text>';
        var peak_node    = '<text id="peak">Peak:'           + '<br>- ' + stream_peak    + ' people<br><br></text>';
        var uptime_node  = '<text id="uptime">Uptime:'       + '<br>- ' + uptime         + '<br><br></text>';
        
        
        if(stream_name != prev_name) { $('#playing').html(name_node); }
        
        if(stream_url == '')
            {
                $('#url').hide();
            }
        else if(stream_url != prev_url)
            {
                $('#url').show();
                $('#url').html(url_node);
            }
        
        if(stream_current != prev_current) { $('#current').html(current_node); }
        if(stream_peak    != prev_peak   ) { $('#peak').html(peak_node);       }
        
        $('#uptime').html(uptime_node);
    }

function get_metadata(data)
    {
        $.get('http://'+asdf()+':8001', function(data)
            {
                var stats = $( data.firstElementChild.innerHTML ).find('.streamstats');
                if(stats) ////
                    {
                        var stream_started = $(stats[0]).text();
                        var stream_current = $(stats[1]).text();
                        var stream_peak    = $(stats[2]).text();
                        var stream_genre   = $(stats[3]).text();
                        //var stream_url     = $(stats[4]).text();
                        var stream_name    = $(stats[5]).text();
        
                        var uptime = get_hhmmss(new Date() - Date.parse(stream_started));
                
                        
                        // Get title url
                        var match = [];
                        var url_regex = /(.+) - url: (.+)/;
                
                        match = url_regex.exec(stream_name);
                        
                        
                        stream_name = match ? match[1] : stream_name;
                        stream_url  = match ? match[2] : '';
        
                        // Second td -- Main data
                        if($('#audio').length == 0) { append_main(); }
                
                        // Third td - Metadata
                        update_metadata
                            (
                                stream_name,
                                stream_current,
                                stream_peak,
                                stream_url,
                                uptime
                            );
                
                        // Search cover
                        if(stream_name != prev_name) { search_google((match ? match[1] : stream_name)+' cover'); }
                        
                        prev_name    = stream_name;
                        prev_current = stream_current;
                        prev_peak    = stream_peak;
                        prev_url     = stream_url;
                    }
            });

        window.setTimeout(get_metadata, 30000);
    }
                

var prev_name    = '';
var prev_current = '';
var prev_peak    = '';
var prev_url     = '';

get_metadata();
