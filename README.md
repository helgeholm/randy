# Randy.js

Randy is a utility module inspired by Python's standard module
"random".

By default it bases all its functions on Math.random(), but this can
be overridden.

## Quick Examples

    > randy.randInt(100)
    42

    > randy.shuffle(["J spades", "K hearts", "10 hearts"]);
    [ "K hearts", "J spades", "10 hearts" ]

    > randy.choice("heads", "tails")
    "heads"

## Documentation

### Module Functions

* [randInt](#randInt)
* [choice](#choice)
* [shuffle](#shuffle)
* [shuffleInplace](#shuffleInplace)
* [sample](#sample)
* [uniform](#uniform)
* [random](#random)
* [triangular](#triangular)

### Module Initialization (optional)

Another PRNG than Math.random() can be supplied during initialization,
resulting in a version of the module where all the functions are based
on that PRNG instead.

The given PRNG must take no parameters and return a floating point number
in the range 0.0 inclusive to 1.0 exclusive.

    > var dilbertRng = function () { return 0.9; };
    > var randy = require("randy")(dilbertRng);
    > randy.random();
    0.9
    > randy.random();
    0.9
    > randy.random();
    0.9

## Module Functions

<a name="randInt" />
### randInt ([min], max)

Returns a random integer i such that min < i < max.

__Arguments__

* min - default=0. Returned integer will be min or greater.
* max - Returned integer will be less than max.

__Example__

    console.log("Rolling the dice:");
    var d1 = randy.randInt(1, 7);
    var d2 = randy.randInt(1, 7);
    console.log(d1 + " + " + d2 + " = " + (d1 + d2));
    if (d1 + d2 == 2)
        console.log("Snake eyes!");

---------------------------------------

<a name="choice" />
### choice (arr)

Returns a randomly chosen element from the array arr.

Throws an exception if arr is empty.

__Arguments__

* arr - Array of elements of any type.  Length > 0.
        Return value will be an element of arr.

__Example__

    var breakfast = random.choice(["whisky", "bacon", "panic"]);
    console.log("Good morning!  Enjoy some " + breakfast + "!");

    // Set direction vector for a ghost from Pac-Man.
    ghost.currentDirection = random.choice([
        {x:0, y:-1}, {x:1, y:0}, {x:0, y:1}, {x:-1, y:0}
    ]);
    
---------------------------------------

<a name="shuffle" />
### shuffle (arr)

Returns a shuffled copy of arr.  Returned array contains the exact
same elements as arr, and equally many elements, but in a new order.

Uses the Fisher-Yates algorithm, aka the Knuth Shuffle.

__Arguments__

* arr - Array of elements of any type.

__Example__

    var runners = ["Andy", "Bob", "Clarence", "David"];
    var startingOrder = randy.shuffle(runners);

---------------------------------------

<a name="shuffleInplace" />
### shuffleInplace (arr)

Shuffles the array arr.  A more memory-efficient version of shuffle.

Uses the Fisher-Yates algorithm, aka the Knuth Shuffle.

__Arguments__

* arr - Array of elements of any type.  Will be modified.

__Example__

    // Reorder elements at random until they happen to be sorted.
    def bogosort (arr) {
        while (true) {
            randy.shuffleInplace(arr);

            var sorted = true;
            for (var i=0; i<arr.length-1; i++)
                sorted = sorted && (arr[i] < arr[i+1]);
            if (sorted)
                return;
        }
    }

    // Create new draw deck from card discard pile.
    if (deck.length == 0) {
        deck = discardPile.splice(0);
        randy.shuffle(deck);
    }

---------------------------------------

<a name="sample" />
### sample (population, count)

Returns an array of length count, containing unique elements chosen
from the array population.  Like a raffle draw.

Mathematically equivalent to shuffle(population).slice(0, count), but
more efficient.  Catches fire if count > population.length.

__Arguments__

* population - Array of elements of any type.
* count - How many elements to pick from array population.

__Example__

    // Raffle draw for 3 bottles of wine.  Cindy has bought 2 tickets.
    var raffleTickets = ["Alice", "Beatrice", "Cindy", "Cindy", "Donna"];

    var winners = randy.sample(raffleTickets, 3);

    console.log("The winners are: " + winners.join(", "));

---------------------------------------

<a name="uniform" />
### uniform ([min], max)

Returns a floating point number n, such that min <= n < max.

__Arguments__

* min - Default=0.0.  Returned value will be equal to or larger than
        this.
* max - Returned value will be less than this.

__Example__

    // Torpedo guidance system.
    var heading = randy.uniform(360.0);

    // Random event repeating every 1-5 minutes.
    function flashLightning () {
        flash();
        var delayNext = randy.uniform(60.0, 300.0);
        setTimeout(flashLightning, delayNexy);
    }

---------------------------------------

<a name="random" />
### random ()

Returns a floating point number n such that 0.0 <= n < 1.0.

Goes directly to the underlying PRNG.  By default this is the
Math.random() function.  Supplied for convenience.

__Example__

    var opacity = randy.random();

---------------------------------------

<a name="triangular" />
### triangular ([min], [max], [mode])

The triangular distribution is typically used as a subjective
description of a population for which there is only limited sample
data, and especially in cases where the relationship between variables
is known but data is scarce (possibly because of the high cost of
collection). It is based on a knowledge of the minimum and maximum and
an "inspired guess" as to the modal value.

[Wikipedia article](http://en.wikipedia.org/wiki/Triangular_distribution)

__Arguments__

* min - Default=0.0.  Returned value will be equal to or larger than
        this.
* max - Default=1.0.  Returned value will be less than this.
* mode - Default is average of min and max.  Returned values are likely
         to be close to this value.

__Example__

    // Generate customer test data.  Customers are aged 18 to 40, but
    // most of them are in their twenties.  Their income is between
    // 40000-150000 Hyrulean Rupees per year, but typically around
    // 60000.
    for (i=0; i<1000; i++) {
        db.insertCustomer({
            name: "Bruce",
            birthYear: Math.floor( randy.triangular(1972, 1990, 1983) ),
            income: randy.triangular(40000, 150000, 60000)
        });
    }

---------------------------------------

## Future

Math.random() is implementation-dependent and frequently crappy.  Even
the V8 engine's decent PRNG is insufficient for many tasks as it has a
period of 2^32, making it mathematically impossible to generate all
permutations of a deck of cards larger than 12 cards.

I'm hoping to implement the Mersenne twister as default PRNG for this
module, as it has a period of 2^19937 − 1.  Also, working directly
with random bits makes the integer based random functions simpler.

## Notes

Due to floating point rounding, returned values may *extremely rarely*
tangent the upper bound.  The integer based random functions are
guarded against this, but there is no good way to do this for floating
point values.
