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



function response(data)
    {
        console.log(data);
        var stats = $( data.firstElementChild.innerHTML ).find('.streamstats');
        
        var html5_audio_player =
            '<audio controls preload="none" id="audio" oncontextmenu="return false;">'
          + '<source src="http://'+asdf()+'/stream?type=.mp3" type="audio/mp3">'
          + '</audio>';

        var html5_video_player =
            '<video>'
            '</video>';
        
        // map
        var stream_started = $(stats[0]).text();
        var stream_current = $(stats[1]).text();
        var stream_peak    = $(stats[2]).text();
        var stream_genre   = $(stats[3]).text();
        var stream_url     = $(stats[4]).text();
        var stream_name    = $(stats[5]).text();
        
        var uptime = get_hhmmss(new Date() - Date.parse(stream_started));
        
        
        if(1)
            {
                // Sound player
                $('#second_td').last().append(html5_audio_player);
                
                // <br>
                $('#second_td').last().append('<br><br>');
                
                // Download
                $('#second_td').last().append('Downoad: <a href="http://tinyurl.com/nanodesu-m3u">m3u</a>');
                
                // <td>
                $('tr').last().append('<td id="third_td">');
                
                // Metadata
                $('#third_td').last().append('Playing:    '+' <br>- '+ stream_name   +        '<br><br>');
                $('#third_td').last().append('Listening:'  + '<br>- '+ stream_current+ ' people<br><br>');
                $('#third_td').last().append('Peak:'       + '<br>- '+ stream_peak   + ' people<br><br>');
                $('#third_td').last().append('Uptime:'     + '<br>- '+ uptime        +        '<br><br>');
                $('#third_td').last().append('Url:'        + '<br>- '+ stream_url);
            }
        else
            {
                // Error message
                $('#second_td').last().append('Server status: Down');
            }
        
        /*
        - search cover
        - create text element with youtube if title contains - youtube
        */
    }
                
$.get('http://'+asdf()+':8001', response);
