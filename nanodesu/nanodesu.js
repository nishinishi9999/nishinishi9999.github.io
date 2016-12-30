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
                
                $('#third_td').prepend('<img src="'+images[0]+'"></img><br><br>');
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
                $('#second_td').append('Downoad: <a href="http://tinyurl.com/nanodesu-m3u">m3u</a>');
                
                // <td>
                $('tr').append('<td id="third_td">');
            }
    }

function update_metadata(match, stream_name, stream_current, stream_peak, uptime)
    {
        // Erase
        $('#third_td').html('');
                        
        var name_node    = 'Playing:'   + '<br>- ' + (match ? match[1] : stream_name)+ '<br><br>';
        var current_node = 'Listening:' + '<br>- ' + stream_current                  + ' people<br><br>';
        var peak_node    = 'Peak:'      + '<br>- ' + stream_peak                     + ' people<br><br>';
        var uptime_node  = 'Uptime:'    + '<br>- ' + uptime                          +  '<br><br>';
        
        // Name and url
        $('#third_td').append(name_node);
        
        if(match) { $('#third_td').append('Url:' + '<br>- '+ match[2] + '<br><br>'); }
                
        $('#third_td').append(current_node);    // Listening
        $('#third_td').append(peak_node);       // Peak
        $('#third_td').append(uptime_node);     // Uptime
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
                        var stream_url     = $(stats[4]).text();
                        var stream_name    = $(stats[5]).text();
        
                        var uptime = get_hhmmss(new Date() - Date.parse(stream_started));
                
                        // Get title url
                        var match = [];
                        var url_regex = /(.+) - url: (.+)/;
                
                        match = url_regex.exec(stream_name);
        
                        // Second td -- Main data
                        if($('#audio').length == 0) { append_main(); }
                
                        if(stream_name != previous_name)
                            {
                                // Third td - Metadata
                                update_metadata
                                    (
                                        match,
                                        stream_name,
                                        stream_current,
                                        stream_peak,
                                        uptime
                                    );
                
                                // Search cover
                                search_google((match ? match[1] : stream_name)+' cover');
                            }
                        
                        previous_name = stream_name;
                    }
            });

        window.setTimeout(get_metadata, 60000);
    }
                

var previous_name = '';

get_metadata();
