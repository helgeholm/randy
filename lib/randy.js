"use strict";

var randy = (function () {
    function well1024 (entropy) {
        var m1 = 3, m2 = 24, m3 = 10;
        var state = [ 0, 0, 0, 0, 0, 0, 0, 0,
                      0, 0, 0, 0, 0, 0, 0, 0,
                      0, 0, 0, 0, 0, 0, 0, 0,
                      0, 0, 0, 0, 0, 0, 0, 0 ];
        var state_i = 0;
        var z0, z1, z2;
        function maToPos (t, v) { return v ^ (v >>> t); }
        function maToNeg (t, v) { return v ^ (v << -t); }
        
        function init (entropy) {
            for (var i = 0; i < state.length; i++)
                state[i] = ~(Math.random() * 4294967296);
            var s_i = 0;
            for (var i = 0; i < entropy.length; i++) {
                state[s_i] = (state[s_i] + Math.floor(entropy[i])) & 0xffffffff;
                s_i = (s_i + 1) & 0x1f;
            }
        }
        
        function getUInt32 () {
            z0 = state[(state_i + 31) & 0x1f];
            z1 = state[state_i] ^ maToPos(8, state[(state_i + m1) & 0x1f]);
            z2 = maToNeg(-19, state[(state_i + m2) & 0x1f]) ^ maToNeg(-14, state[(state_i + m3) & 0x1f]);
            state[state_i] = z1 ^ z2;
            state[(state_i + 31) & 0x1f] = maToNeg(-11, z0) ^ maToNeg(-7, z1) ^ maToNeg(-13, z2);
            state_i = (state_i + 31) & 0x1f;
            return state[state_i] + 0x80000000;
        }
    
        init(entropy);
        return getUInt32;
    }

    // initialize
    if (typeof module !== "undefined") {
        // NodeJs mode
        var os = require("os");
        var mu = process.memoryUsage();
        var la = os.loadavg();
        var entropy = [
            (new Date()).getTime(),
            process.pid,
            Math.floor(process.uptime() * 16777216),
            mu.rss,
            mu.heapTotal,
            mu.heapUsed,
            Math.floor(os.uptime() * 16777216),
            Math.floor(la[0] * 4294967296),
            Math.floor(la[1] * 4294967296),
            Math.floor(la[2] * 4294967296),
            os.totalmem(),
            os.freemem()
        ];
        var getUInt32 = well1024(entropy);
        module.exports = initialize(getUInt32);
    } else {
        // Browser mode
        var entropy = [
            (new Date()).getTime(),
            window.history.length,
            window.outerHeight,
            window.outerWidth,
            window.screenX,
            window.screenY,
            window.screen.availWidth,
            window.screen.availHeight,
            window.screen.height,
            window.screen.width
        ];
        var getUInt32 = well1024(entropy);
        return initialize(getUInt32);
    }

    /* Parameter getUInt32 must be a PRNG returning a random unsigned
     * 32-bit integer. */
    function initialize (getUInt32) {
        /* Returns a random integer i, such that min <= i < max.
         *
         * If only one parameter is supplied, it is assumed to be max, and
         * min will be 0.
         *
         * If no parameters are supplied, min is assumed to be 0, and
         * max is assumed to be 2^53.  I.e. bounded by largest
         * possible integer value.
         *
         * If step is supplied, i is selected from the steps between min and
         * max.  More formally, we add the constraint that
         * (i - min) = k * step
         * where k is an integer. */
        function randInt (min, max, step) {
            if (typeof(min) == 'undefined') {
                return _randInt();
            }
            if (typeof(max) == 'undefined') {
                max = min;
                min = 0;
            }
            if (typeof(step) == 'undefined') {
                // Simple calculation
                return min + _randInt(max - min);
            } else {
                var span = Math.ceil((max - min) / step);
                var result = min + _randInt(span) * step;
                return result;
            }
        }

        /* Use 53-bit precision.  If max is not specified, assume 2^53. */
        function _randInt (max) {
            var r = getUInt32() + (getUInt32() >>> 11) * 0x100000000;
            if (typeof max === 'undefined')
                return r;
            return r % max;
        }

        /* Returns a random element from the array arr.  If arr is empty,
         * throws an exception. */
        function choice (arr) {
            if (!arr.length)
                throw "arr not an array of length > 0";
            var idx = _randInt(arr.length);
            return arr[idx];
        }

        /* Returns a shuffled copy of the array arr.  For algorithm details,
         * see shuffleInplace. */
        function shuffle (arr) {
            var arrCopy = arr.slice();
            shuffleInplace(arrCopy);
            return arrCopy;
        }

        /* Shuffle the array arr in place.  Uses the Fisher-Yates shuffle, aka
         * the Knuth shuffle. */
        function shuffleInplace (arr) {
            var j, tmp;
            for (var i = arr.length - 1; i > 0; i--) {
                j = _randInt(i + 1);
                tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
            }
        }

        /* Returns an array of length count, containing unique elements chosen
         * from the array population.  Like a raffle draw.
         *
         * Mathematically equivalent to shuffle(population).slice(0,
         * count), but more efficient.  Catches fire if count >
         * population.length. */
        function sample (population, count) {
            var arr = population.slice();
            var j, tmp, ln = arr.length;
            for (var i = ln - 1; i > (ln - count - 1); i--) {
                j = randInt(i + 1);
                tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
            }
            return arr.slice(ln - count);
        }

        /* Returns a floating point number f such that 0.0 <= f < 1.0 */
        function random () {
            return _randInt() / 0x20000000000000;
        }

        /* Returns a floating point number f such that min <= f < max. */
        function uniform (min, max) {
            return min + (random() * (max - min));
        }

        /* The triangular distribution is typically used as a subjective
         * description of a population for which there is only limited sample
         * data, and especially in cases where the relationship between
         * variables is known but data is scarce (possibly because of the high
         * cost of collection). It is based on a knowledge of the minimum and
         * maximum and an "inspired guess" as to the modal value.
         *
         * http://en.wikipedia.org/wiki/Triangular_distribution */
        function triangular (min, max, mode) {
            if (typeof(min) == 'undefined')
                min = 0;
            if (typeof(max) == 'undefined') {
                min = 0;
                max = min;
            }
            if (typeof(mode) == 'undefined')
                mode = min + (max - min) / 2;
            var u = random();
            if (u < (mode - min) / (max - min)) {
                return min + Math.sqrt(u * (max - min) * (mode - min));
            } else {
                return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
            }
        }

        return {
            'randInt'       : randInt,
            'choice'        : choice,
            'shuffle'       : shuffle,
            'shuffleInplace': shuffleInplace,
            'sample'        : sample,
            'uniform'       : uniform,
            'random'        : random,
            'triangular'    : triangular
        };
    }
})();
