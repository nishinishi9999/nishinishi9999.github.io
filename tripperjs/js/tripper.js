// tripper.js
importScripts('DES.js', 'crypt3.js');


//---- Constants ---------------------------------------------------------------------------------------------------

const CHAR_N = 8;

const char_list =
    (
        'a b c d e f g h i j k l m n o p q r s t u v w x y z '
      + 'A B C E D F G H I J K L M N O P Q R S T U V W X Y Z '
      + '0 1 2 3 4 5 6 7 8 9'
    ).split(' ');
//     . / ! " $ % & ( ) = ? { } [ ]'.split(' ');
    
const table =
    {
        ':' : 'A',
        ';' : 'B',
        '<' : 'C',
        '=' : 'D',
        '>' : 'E',
        '?' : 'F',
        '@' : 'a',
        '[' : 'b',
        '\\': 'c',
        ']' : 'd',
        '^' : 'e',
        '_' : 'f',
        '`' : 'g'
    };

//---- Functions ---------------------------------------------------------------------------------------------------

function rand_pwd()
    {
        var pwd = '';
        
        for(let n = 0; n < CHAR_N; n++)
            {
                pwd += char_list[parseInt(Math.random()*char_list.length)];
            }

        return pwd;
    }

function get_salt(key)
    {
        var salt = (key+'H.').substr(1, 2);
        
        salt = salt.replace(/[^\.-z]/, '.');
        for(let n in table) { salt = salt.replace(n, table[n]) }
        
        return salt;
    }

function send_tps()
    {
        var time = (new Date().getTime() - this.start_time) / 1000;
        var tps  = this.trip_n / time;
        
        postMessage
            ({
                'type': 'tps',
                'id'  : self.id,
                'tps' : parseInt(tps)
            });
        
        setTimeout('send_tps()', 1000);
    }

function main()
    {
        var pwd  = rand_pwd(8);
        var salt = get_salt(pwd);
        var hash = crypt3(pwd, salt);        
        
        if(hash.match(this.target))
            {
                this.found++;
                this.postMessage
                    ({
                        'type'  : 'found',
                        'id'    : id,
                        'target': this.target,
                        'found' : this.found,
                        'pwd'   : pwd,
                        'trip'  : hash,
                    });

                console.log({'id': id, 'key': pwd, 'salt': salt, 'trip': hash, 'target': target});
            }
        
        
        this.trip_n++;
        setTimeout('main()');
    }


//---- Execution ---------------------------------------------------------------------------------------------------

this.onmessage = function(e)
    {
        if (e.data.type == 'init')
            {
                var target_regex = new RegExp(e.data.target, 'i');
                
                this.id         = e.data.id;
                this.target     = target_regex;
                this.timeout    = e.data.timeout;
                this.trip_n     = 0;
                this.found      = 0;
                this.start_time = new Date().getTime();
                
                this.main();
                this.send_tps();
            }
        else if(e.data.type == 'target')   { target  = e.data.target;  }
        else if(e.data.type == 'timeout')  { timeout = e.data.timeout; }
        else if(e.data.type == 'pause')    { /** stop timeout **/ }
        else if(e.data.type == 'continue') { main(); } ////
        else if(e.data.type == 'stop')     { /** stop worker and remove search element **/ }
        
        console.log(this.timeout);
    };
