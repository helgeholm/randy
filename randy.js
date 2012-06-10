"use strict";

exports.getRandBits = getRandBits;
exports.randInt = randInt;
exports.choice = choice;
exports.shuffle = shuffle;
exports.shuffleInplace = shuffleInplace;
exports.sample = sample;
exports.uniform = uniform;
exports.triangular = triangular;

var rng = Math.random;

/* Returns an integer with k random bits. */
function getRandBits (k) {
    return Math.floor(rng() * Math.pow(2, k));
}

/* Returns a random integer i, such that start <= i < stop.

   If only one parameter is supplied, it is assumed to be stop, and
   start will be 0.

   If step is supplied, i is selected from the steps between start and
   stop.  More formally, we add the constraint that
     (i - start) = k * step
   where k is an integer. */
function randInt (start, stop, step) {
    if (typeof(stop) == 'undefined') {
        stop = start;
        start = 0;
    }
    if (typeof(step) == 'undefined')
        step = 1;
    var span = Math.ceil((stop - start) / step);
    return start + Math.floor(rng() * span) * step;
}

/* Returns a random element from the array arr.  If arr is empty,
 * throws an exception. */
function choice (arr) {
    if (!arr.length)
        throw "arr not an array of length > 0";
    var idx = Math.floor(rng() * arr.length);
    return arr[idx];
}

/* Returns a shuffled copy of the array arr.  For algorithm details,
   see shuffleInplace. */
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
        tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
}

/* Returns an array of length count, containing unique elements chosen
 * from the array population.  Like a raffle draw.
 *
 * Mathematically equivalent to shuffle(population).slice(0, count),
 * but more efficient.  Throws an exception if count >
 * population.length. */
function sample (population, count) {
    var arr = population.slice();
    var j, tmp, ln = arr.length;
    for (var i = ln - 1; i > (ln - count - 1); i--) {
        j = Math.floor(rng() * (i + 1));
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
    if (typeof(max) == 'undefined')
        max = 1;
    if (typeof(mode) == 'undefined')
        mode = min + (max - min) / 2;
    var u = rng();
    if (u < (mode - min) / (max - min)) {
        return min + Math.sqrt(u * (max - min) * (mode - min));
    } else {
        return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
    }
}
