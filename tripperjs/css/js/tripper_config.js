/**** Global variables ****/

var default_to = 10;
var tps        = {};
var pool       = {};



/**** Functions ****/

function add_search_table(target, id)
    {
        var table =
              '<br><br>'
            + '<center><table class="search_table search_table_'+id+'">'
            + '    <tr class="search_tr">'
            + '        <th class="search_th">Target</th>'
            + '        <th class="search_th">Found</th>'
            + '        <th class="search_th pwd_cell">Pwd</th>'
            + '        <th class="search_th trip_cell">Trip</th>'
            + '        <th class="search_th">Timeout</th>'
            + '        <th class="search_th pause_cell">Pause</th>'
            + '        <th class="search_th remove_cell">Remove</th>'
            + '    </tr>'
            + '    <tr class="search_tr">'
            + '        <td class="search_td"><text id="target_'            +id+'">'+target+'</text></td>'
            + '        <td class="search_td"><text id="found_'             +id+'">0</text></td>'
            + '        <td class="search_td pwd_cell"><text id="pwd_'      +id+'">0</text></td>'
            + '        <td class="search_td trip_cell"><text id="trip_'    +id+'">0</text></td>'
            + '        <td class="search_td">'
            + '            <input type="text" value="10" class="timeout_input" id="to_'          +id+'"></text>'
            + '        </td>'
            + '        <td class="search_td pause_cell"><text id="pause_'  +id+'">0</text></td>'
            + '        <td class="search_td remove_cell"><text id="remove_'+id+'">0</text></td>'
            + '    </tr>'
            + '</table></center>';

        $('body').append(table);
        
        $('.timeout_input').keypress( function(e)
            {
                if(e.which == 13)
                    {
                        e.preventDefault();

                        var timeout = e.target.value;
                        if(timeout == 0) { return; } ////
                        
                        var id = e.target.id.substr(3);
                    
                        pool[id].postMessage
                            ({
                                'type'   : 'timeout',
                                'timeout': timeout
                            });
                    }
            });
    }


function init_worker(target, id)
    {                        
        var worker = new Worker('js/tripper.js');
        worker.onmessage = on_worker_msg;
        pool[id] = worker;
                    
        worker.postMessage
            ({
                'type'   : 'init',
                'id'     : id,
                'target' : target,
                'timeout': default_to
            });
    }

function on_worker_msg(e)
    {
        var id = e.data.id;
        
        if(e.data.type == 'found')
            {
                $('#target_'+id)[0].textContent = e.data.target;
                $('#found_'+id)[0].textContent  = e.data.found;
                $('#pwd_'+id)[0].textContent    = e.data.pwd;
                $('#trip_'+id)[0].textContent   = e.data.trip;
              //$('#tps_n')[0].textContent      = e.data.tps;
            }
        else if(e.data.type == 'tps')
            {
                tps[e.data.id] = e.data.tps;
                
                var tps_n = 0;
                for(let n in tps) { tps_n += tps[n]; }
                
                $('#tps_n')[0].textContent = tps_n+' trips/s';
            }
    }

/**** Execute ****/

/*********************
* Initialize worker
*********************/            
window.onload = function()
{
    /***********************************
    * Set text elements default value
    ***********************************/
    $('#target').val('Enter search here');
    
    
    /******************************************
    * Set text input worker message handlers
    ******************************************/
    $('#target').keypress( function(e)
        {
            if(e.which == 13)
                {
                    e.preventDefault();
        
                    var target = $('#target').val();
                    var id     = Object.keys(pool).length;
                    
                    init_worker(target, id);
                    
                    add_search_table(target, id);
                    
                    $('#search_n')[0].textContent = id+1;
                }
        });
}