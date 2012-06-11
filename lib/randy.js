"use strict";

var exports = module.exports = initialize;

// Extend module.exports with default initialization.
var defaultRng = initialize();
for (var a in defaultRng)
    if (defaultRng.hasOwnProperty(a))
        exports[a] = defaultRng[a];

/* Parameter rng must be a PRNG returning a floating point integer n such
 * that 0.0 <= n < 1.0. */
function initialize (rng) {
    rng = rng || Math.random;

    // Used to protect against floating point rounding-up errors.
    function cap (value, max, step) {
        step = step || 1;
        if (value >= max)
            return max - step;
        return value;
    }

    /* Returns a random integer i, such that min <= i < max.
     *
     * If only one parameter is supplied, it is assumed to be max, and
     * min will be 0.
     *
     * If step is supplied, i is selected from the steps between min and
     * max.  More formally, we add the constraint that
     * (i - min) = k * step
     * where k is an integer. */
    function randInt (min, max, step) {
        if (typeof(max) == 'undefined') {
            max = min;
            min = 0;
        }
        if (typeof(step) == 'undefined')
            step = 1;
        var span = Math.ceil((max - min) / step);
        var result = min + Math.floor(rng() * span) * step;
        return cap(result, max, step);
    }

    /* Returns a random element from the array arr.  If arr is empty,
     * throws an exception. */
    function choice (arr) {
        if (!arr.length)
            throw "arr not an array of length > 0";
        var idx = Math.floor(rng() * arr.length);
        return arr[cap(idx, arr.length)];
    }

    /* Returns a shuffled copy of the array arr.  For algorithm details,
     * see shuffleInplace. */
    function shuffle (arr) {
        var arrCopy = arr.slice();
        shuffleInplace(arrCopy);
        return arrCopy;
    }

    /* Shuffle the array arr in place.  Uses the Fisher-Yates shuffle, aka
     * the Knuth shuffle.
     *
     * Note: If the total number of permutations (the factorial of
     * arr.length) is larger than the seed range of the random number
     * generator, it means that some permutations can never be generated.
     *
     * In practice, the V8 JavaScript engine has a 32 bit seed, meaning
     * you will never be able to generate all possible permutations for
     * arrays of length > 12.  2^32 < 13! */
    function shuffleInplace (arr) {
        var j, tmp;
        for (var i = arr.length - 1; i > 0; i--) {
            j = Math.floor(rng() * (i + 1));
            j = cap(j, i + 1);
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
            j = Math.floor(rng() * (i + 1));
            j = cap(j, i + 1);
            tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
        return arr.slice(ln - count);
    }

    /* Returns a floating point number f such that 0.0 <= f < 1.0 */
    function random () {
        return rng();
    }

    /* Returns a floating point number f such that min <= f < max. */
    function uniform (min, max) {
        return min + rng() * (max - min);
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
        var u = rng();
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
        'random'        : rng,
        'triangular'    : triangular
    };
}
