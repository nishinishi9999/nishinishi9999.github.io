// tripper.js


//---- Constants ---------------------------------------------------------------------------------------------------

const RAND_CHAR_N  = 8;

var char_list =
    (
        'a b c d e f g h i j k l m n o p q r s t u v w x y z '
      + 'A B C E D F G H I J K L M N O P Q R S T U V W X Y Z '
      + '0 1 2 3 4 5 6 7 8 9'
    ).split(' ');
//     . / ! " $ % & ( ) = ? { } [ ]'.split(' ');
    
var salt_table =
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

//---- DES.js ------------------------------------------------------------------------------------------------------


/*********************
* Global variables
*********************/

var initial_table = //-1
    [
        57, 49, 41, 33, 25, 17,  9, 1,
        59, 51, 43, 35, 27, 19, 11, 3,
        61, 53, 45, 37, 29, 21, 13, 5,
        63, 55, 47, 39, 31, 23, 15, 7,
        56, 48, 40, 32, 24, 16,  8, 0,
        58, 50, 42, 34, 26, 18, 10, 2,
        60, 52, 44, 36, 28, 20, 12, 4,
        62, 54, 46, 38, 30, 22, 14, 6
    ];

var final_table = //-1
    [
        39, 7, 47, 15, 55, 23, 63, 31,
        38, 6, 46, 14, 54, 22, 62, 30,
        37, 5, 45, 13, 53, 21, 61, 29,
        36, 4, 44, 12, 52, 20, 60, 28,
        35, 3, 43, 11, 51, 19, 59, 27,
        34, 2, 42, 10, 50, 18, 58, 26,
        33, 1, 41,  9, 49, 17, 57, 25,
        32, 0, 40,  8, 48, 16, 56, 24
    ];


var expansion_table = //-1
    [
         31,  0,  1,  2,  3,  4,
          3,  4,  5,  6,  7,  8,
          7,  8,  9, 10, 11, 12,
         11, 12, 13, 14, 15, 16,
         15, 16, 17, 18, 19, 20,
         19, 20, 21, 22, 23, 24,
         23, 24, 25, 26, 27, 28,
         27, 28, 29, 30, 31,  0
    ];

var parity_drop_table = //-1
    [
        56, 48, 40, 32, 24, 16,  8,  0,
        57, 49, 41, 33, 25, 17,  9,  1,
        58, 50, 42, 34, 26, 18, 10,  2,
        59, 51, 43, 35, 62, 54, 46, 38,
        30, 22, 14,  6, 61, 53, 45, 37,
        29, 21, 13,  5, 60, 52, 44, 36,
        28, 20, 12,  4, 27, 19, 11,  3
    ];

var compression_table = //-1
    [
        13, 16, 10, 23,  0,  4,  2, 27,
        14,  5, 20,  9, 22, 18, 11,  3,
        25,  7, 15,  6, 26, 19, 12,  1,
        40, 51, 30, 36, 46, 54, 29, 39,
        50, 44, 32, 47, 43, 48, 38, 55,
        33, 52, 45, 41, 49, 35, 28, 31
    ];

var straight_table = //-1
    [
        15,  6, 19, 20, 28, 11, 27, 16,
         0, 14, 22, 25,  4, 17, 30,  9,
         1,  7, 23, 13, 31, 26,  2,  8,
        18, 12, 29,  5, 21, 10,  3, 24
    ];

var s_box_table =
    [
        /**** s-box 0 ****/
        [
            [14,  4, 13,  1,  2, 15, 11,  8,  3, 10,  6, 12,  5,  9,  0,  7],
            [ 0, 15,  7,  4, 14,  2, 13,  1, 10,  6, 12, 11,  9,  5,  3,  8],
            [ 4,  1, 14,  8, 13,  6,  2, 11, 15, 12,  9,  7,  3, 10,  5,  0],
            [15, 12,  8,  2,  4,  9,  1,  7,  5, 11,  3, 14, 10,  0,  6, 13]
        ],
        
        /**** s-box 1 *****/
        [
            [15,  1,  8, 14,  6, 11,  3,  4,  9,  7,  2, 13, 12,  0,  5, 10],
            [ 3, 13,  4,  7, 15,  2,  8, 14, 12,  0,  1, 10,  6,  9, 11,  5],
            [ 0, 14,  7, 11, 10,  4, 13,  1,  5,  8, 12,  6,  9,  3,  2, 15],
            [13,  8, 10,  1,  3, 15,  4,  2, 11,  6,  7, 12,  0,  5, 14,  9]
        ],

        /**** s-box 2 ****/
        [
            [10,  0,  9, 14,  6,  3, 15,  5,  1, 13, 12,  7, 11,  4,  2,  8],
            [13,  7,  0,  9,  3,  4,  6, 10,  2,  8,  5, 14, 12, 11, 15,  1],
            [13,  6,  4,  9,  8, 15,  3,  0, 11,  1,  2, 12,  5, 10, 14,  7],
            [ 1, 10, 13,  0,  6,  9,  8,  7,  4, 15, 14,  3, 11,  5,  2, 12]
        ],
        
        /**** s-box 3 ****/
        [
            [ 7, 13, 14,  3,  0,  6,  9, 10,  1,  2,  8,  5, 11, 12,  4, 15],
            [13,  8, 11,  5,  6, 15,  0,  3,  4,  7,  2, 12,  1, 10, 14,  9],
            [10,  6,  9,  0, 12, 11,  7, 13, 15,  1,  3, 14,  5,  2,  8,  4],
            [ 3, 15,  0,  6, 10,  1, 13,  8,  9,  4,  5, 11, 12,  7,  2, 14]
        ],
        
        /**** s-box 4 ****/
        [
            [ 2, 12,  4,  1,  7, 10, 11,  6,  8,  5,  3, 15, 13,  0, 14,  9],
            [14, 11,  2, 12,  4,  7, 13,  1,  5,  0, 15, 10,  3,  9,  8,  6],
            [ 4,  2,  1, 11, 10, 13,  7,  8, 15,  9, 12,  5,  6,  3,  0, 14],
            [11,  8, 12,  7,  1, 14,  2, 13,  6, 15,  0,  9, 10,  4,  5,  3]
        ],
        
        /**** s-box 5 ****/
        [
            [12,  1, 10, 15,  9,  2,  6,  8,  0, 13,  3,  4, 14,  7,  5, 11],
            [10, 15,  4,  2,  7, 12,  9,  5,  6,  1, 13, 14,  0, 11,  3,  8],
            [ 9, 14, 15,  5,  2,  8, 12,  3,  7,  0,  4, 10,  1, 13, 11,  6],
            [ 4,  3,  2, 12,  9,  5, 15, 10, 11, 14,  1,  7,  6,  0,  8, 13]
        ],
        
        /**** s-box 6 ****/
        [
            [ 4, 11,  2, 14, 15,  0,  8, 13,  3, 12,  9,  7,  5, 10,  6,  1],
            [13,  0, 11,  7,  4,  9,  1, 10, 14,  3,  5, 12,  2, 15,  8,  6],
            [ 1,  4, 11, 13, 12,  3,  7, 14, 10, 15,  6,  8,  0,  5,  9,  2],
            [ 6, 11, 13,  8,  1,  4, 10,  7,  9,  5,  0, 15, 14,  2,  3, 12]
        ],
        
        /**** s-box 7 ****/
        [
            [13,  2,  8,  4,  6, 15, 11,  1, 10,  9,  3, 14,  5,  0, 12,  7],
            [ 1, 15, 13,  8, 10,  3,  7,  4, 12,  5,  6, 11,  0, 14,  9,  2],
            [ 7, 11,  4,  1,  9, 12, 14,  2,  0,  6, 10, 13, 15,  3,  5,  8],
            [ 2,  1, 14,  7,  4, 10,  8, 13, 15, 12,  9,  0,  3,  5,  6, 11]
        ]
    ];

var shift_table  = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
var shift_offset = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];


//---- Functions ---------------------------------------------------------------------------------------------------

var K = new Array(16);
for(var n = 0; n < 16; n++) { K[n] = new Array(48).fill(0); }

var parity_drop = new Array(56).fill(0);

/************************************************************************************
* Description : gen_round_keys(): Generate 16 48-bit round keys from one 64-bit key
* Takes       : key (arrayref) - 48 bit binary array
* Returns     : nothing
* Sets global : K[0-15]
* Notes       : Nothing
* TODO        : Nothing
************************************************************************************/
function gen_round_keys(key)
    {
        var n, m;
        var value;
        var offset;

        
        /***********************************************************************
        * Apply parity drop permutation and separate into left and right parts
        ***********************************************************************/
        for(n = 0; n < 56; n++) { parity_drop[n] = key[parity_drop_table[n]]; }
        
        
        /**********************
        * Generate round keys
        **********************/
        for(n = 0; n < 16; n++)
            {
                /****************************************************
                * Circular left shift (1, 2, 9, 16: 1; rest: 2)
                *
                * As it is very costly to shift arrays physically,
                * a logical left shift is done in it place, with an
                * offset representing the 0 index of the left and
                * right arrays.
                ****************************************************/
                offset = shift_offset[n] ;
                
                /********************************
                * Apply compression permutation
                ********************************/
                for(m = 0; m < 48; m++)
                    {
                        value = compression_table[m];
                        
                        K[n][m] = value < 28 ?
                            parity_drop[(offset + value)%28] :
                            parity_drop[(offset + value%28)%28 + 28];
                    }
            }
    }


var initial  = new Array(64).fill(0);
var L        = new Array(32).fill(0);
var R        = new Array(32).fill(0);
var des_R    = new Array(48).fill(0);
var S_output = new Array(32).fill(0);

/***************************************************************************
* Description : cipher() - Encrypt and decrypt data with the DES algorithm
* Takes       : data (arrayref) - 64 bit binary array containing input
* Returns     : Nothing
* Sets global : data (arrayref) - The same array as the input
* Notes       : Nothing
* TODO        : Nothing
***************************************************************************/
function cipher(data)
    {
        var n, m;
        var k;
        
        var des;
        var temp;
        
        var value;
        var pos, row, col, dec;
        
        
        /*******************************************************************
        * Apply initial permutation and separate into left and right parts
        *******************************************************************/
        for(n = 0; n < 32; n++) { L[n]    = data[initial_table[n]]; }
        for(; n < 64; n++)      { R[n-32] = data[initial_table[n]]; }
        
        
        /*********************
        * Round 0 through 16
        *********************/
        for(n = 0; n < 16; n++)
            {
                k = K[n];
                
                /*******************************************************************
                * Apply expansion permutation and apply xor with k
                *
                * shortcut for:
                * for(n = 0; n < 48; n++) { des_R[n]  = R[expansion_table[n]-1]; }
                * for(n = 0; n < 48; n++) { des_R[n] ^= k[n]; }
                *
                ********************************************************************/
                for(m = 0; m < 48; m++)
                    {
                        des_R[m] = k[m] ^ R[expansion_table[m]];
                    }
        
        
                /***************************
                * Apply S-Box permutations
                ***************************/
                for(m = 0; m < 8; m++)
                    {
                        /************************************************
                        * Convert from binary to decimal every six bits
                        ************************************************/
                        pos = m*6;
                        
                        row = (des_R[pos+5] << 0)
                            + (des_R[pos]   << 1);
                        
                        col = (des_R[pos+4] << 0)
                            + (des_R[pos+3] << 1)
                            + (des_R[pos+2] << 2)
                            + (des_R[pos+1] << 3);
                
                
                        /*******************************
                        * Get decimal value from s-box
                        *******************************/
                        dec = s_box_table[m][row][col];
                
                
                        /*********************
                        * Convert dec to bin
                        *********************/
                        pos = m*4;
                
                        S_output[pos]   = (dec >> 3) & 1;
                        S_output[pos+1] = (dec >> 2) & 1;
                        S_output[pos+2] = (dec >> 1) & 1;
                        S_output[pos+3] = (dec >> 0) & 1;
                    }
        
        
                /********************************************************
                * Apply straight permutation and apply xor to L with it
                *
                * shortcut for:
                * des = S_output[straight_table[n]-1];
                * for(n = 0; n < 32; n++) { L[n] ^= des[n]; }
                *
                ********************************************************/
                for(m = 0; m < 32; m++)
                    {
                        L[m] ^= S_output[straight_table[m]];
                    }
                
                
                /****************************************************
                * Swap L and R (skip last round to allow reversing)
                *****************************************************/
                if(n != 15)
                    {
                        temp = L;
                        L    = R;
                        R    = temp;
                    }
            }

        
        /*********************************************
        * Apply final permutation to data and return
        *********************************************/
        for(n = 0; n < 64; n++)
            {
                value = final_table[n];
                data[n] = value < 32 ? L[value] : R[value-32];
            }
    }

//---- crypt3.js ---------------------------------------------------------------------------------------------------

const char_code_z   = 90;
const char_code_9   = 57;
const char_code_dot = 46;
function perturb_expansion(salt)
    {
        var n, m;
        var a, b;
        var c;
        var row;
        
        for(n = 0; n < 2; n++)
            {
                c = salt[n].charCodeAt();

                if(c > char_code_z) { c -= 6; }
                if(c > char_code_9) { c -= 7; }
                c   -= char_code_dot;
                
                row = 6*n;
                for(m = 0; m < 6; m++)
                    {
                        /********************************************
                        * Right shift through the first 6 bits of c
                        * and perturb the expansion_table if it's 1
                        ********************************************/
                        if((c >> m) & 01)
                            {
                                a = row + m;
                                b = row + m + 24;
                                
                                [expansion_table[a], expansion_table[b]] =
                                [expansion_table[b], expansion_table[a]];
                            }
                    }
            }
    }

var data    = new Array(64);
var pwd_bin = new Array(64);
function crypt3(pwd, salt)
    {
        var digest = '';
        var n, m;
        var c;
        var row;
        var pad;
        
        
        /*********************************************************
        * Set the two first characters of the digest to the salt
        *********************************************************/
        digest = salt;
        
        
        //// Pad strings
        
        
        /******************************************
        * Use salt to perturb the expansion table
        ******************************************/
        perturb_expansion(salt);
        
        
        /******************************
        * Convert pwd to binary array
        ******************************/
        for(n = 0; n < 8; n++)
            {
                c = pwd[n].charCodeAt();
                
                row = n*8;
                pad = c < 64 ? 2 : 1;
                        
                for(m = 0; m < 8-pad; m++) { pwd_bin[row + m] = ( c >> (7-pad-m) ) & 1; }
            }
            
        
        /**********************
        * Generate round keys
        **********************/
        gen_round_keys(pwd_bin);
        
        
        /***********************
        * Call cipher 25 times
        ***********************/
        data.fill(0);
        for(n = 0; n < 25; n++) { cipher(data); }
        
        
        /****************************************************
        * Return expansion table to normal (might be buggy)
        ****************************************************/
        perturb_expansion(salt);
        
        
        /****************
        * Format digest
        ****************/
        for(n = 0; n < 11; n++)
            {
                row = 6*n;
                c   = 0;
                
                for(m = 0; m < 6; m++)
                    {
                        c <<= 1;
                        c |= data[row + m];
                    }

                c   += char_code_dot;
                if(c > char_code_9) { c += 7; }
                if(c > char_code_z) { c += 6; }

                digest += String.fromCharCode(c);
            }

        //digest[13] = "\0";
        //if(digest[1] == "\0") { digest[1] = digest[0]; }
        
        
        return digest;
    }


//---- tripper.js --------------------------------------------------------------------------------------------------

var char_list_len = char_list.length;
function rand_pwd()
    {
        var pwd = '';
        
        for(var n = 0; n < RAND_CHAR_N; n++)
            {
                pwd += char_list[parseInt(Math.random()*char_list_len)];
            }

        return pwd;
    }

function get_salt(key)
    {
        var salt = (key+'H.').substr(1, 2);
        
        //salt = salt.replace(/[^\.-z]/, '.');
        //for(var n = 0; n < 13; n++) { salt = salt.replace(n, salt_table[n]) }
        
        return salt;
    }

function send_tps()
    {
        var time = (new Date().getTime() - this.start_time) / 1000;
        var tps  = this.trip_n / time;
        
        postMessage
            ({
                'type': 'tps',
                'id'  : this.id,
                'tps' : parseInt(tps)
            });
    }

var pwd, salt, hash;
function main()
    {
        for(var n = 0; n < 2000; n++)
            {
                pwd  = rand_pwd(8);
                salt = get_salt(pwd);
                hash = crypt3(pwd, salt);
        
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
                                'trip_n': this.trip_n
                            });

                        console.log({'id': id, 'key': pwd, 'salt': salt, 'trip': hash, 'target': target});
                    }
        
        
                this.trip_n++;
                
                if(this.trip_n%100000 == 0) { console.log(this.trip_n); }
            }
        
        send_tps();
        setTimeout(main);
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
            }
        else if(e.data.type == 'target')   { target  = e.data.target;  }
        else if(e.data.type == 'timeout')  { timeout = e.data.timeout; }
        else if(e.data.type == 'pause')    { /** stop timeout **/ }
        else if(e.data.type == 'continue') { main(); } ////
        else if(e.data.type == 'stop')     { /** stop worker and remove search element **/ }
    };


//for(var n = 0; n < 100000; n++) { crypt3('abcdefgh', 'ab'); }
//console.log(crypt3('abcdefgh', 'ab'));