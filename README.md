# Randy.js

Randy is a utility module inspired by Python's standard module
"random".

All functions are based on a JavaScript implementation of
[WELL-1024a](http://en.wikipedia.org/wiki/Well_equidistributed_long-period_linear).

## Quick Examples

```javascript
var a = randy.randInt(100);
// a == 42
```

```javascript
var d = randy.shuffle(["J spades", "K hearts", "10 hearts"]);
// d == [ "K hearts", "J spades", "10 hearts" ]
```

```javascript
var c = randy.choice(["heads", "tails"]);
// c == "heads"
```

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

## Module Functions

<a name="randInt" />
### randInt ([min], max)

Returns a random integer i such that min <= i < max.

__Arguments__

* min - default=0. Returned integer will be min or greater.
* max - Returned integer will be less than max.

__Example__

```javascript
console.log("Rolling the dice:");
var d1 = randy.randInt(1, 7);
var d2 = randy.randInt(1, 7);
console.log(d1 + " + " + d2 + " = " + (d1 + d2));
if (d1 + d2 == 2)
    console.log("Snake eyes!");
```

---------------------------------------

<a name="choice" />
### choice (arr)

Returns a randomly chosen element from the array arr.

Throws an exception if arr is empty.

__Arguments__

* arr - Array of elements of any type.  Length > 0.
        Return value will be an element of arr.

__Example__

```javascript
var breakfast = random.choice(["whisky", "bacon", "panic"]);
console.log("Good morning!  Enjoy some " + breakfast + "!");

// Set direction vector for a ghost from Pac-Man.
ghost.currentDirection = random.choice([
    {x:0, y:-1}, {x:1, y:0}, {x:0, y:1}, {x:-1, y:0}
]);
```
    
---------------------------------------

<a name="shuffle" />
### shuffle (arr)

Returns a shuffled copy of arr.  Returned array contains the exact
same elements as arr, and equally many elements, but in a new order.

Uses the Fisher-Yates algorithm, aka the Knuth Shuffle.

__Arguments__

* arr - Array of elements of any type.

__Example__

```javascript
var runners = ["Andy", "Bob", "Clarence", "David"];
var startingOrder = randy.shuffle(runners);
```

---------------------------------------

<a name="shuffleInplace" />
### shuffleInplace (arr)

Shuffles the array arr.  A more memory-efficient version of shuffle.

Uses the Fisher-Yates algorithm, aka the Knuth Shuffle.

__Arguments__

* arr - Array of elements of any type.  Will be modified.

__Example__

```javascript
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
```

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

```javascript
// Raffle draw for 3 bottles of wine.  Cindy has bought 2 tickets.
var raffleTickets = ["Alice", "Beatrice", "Cindy", "Cindy", "Donna"];

var winners = randy.sample(raffleTickets, 3);

console.log("The winners are: " + winners.join(", "));
```

---------------------------------------

<a name="uniform" />
### uniform ([min], max)

Returns a floating point number n, such that min <= n < max.

__Arguments__

* min - Default=0.0.  Returned value will be equal to or larger than
        this.
* max - Returned value will be less than this.

__Example__

```javascript
// Torpedo guidance system.
var heading = randy.uniform(360.0);

// Random event repeating every 1-5 minutes.
function flashLightning () {
    flash();
    var delayNext = randy.uniform(60.0, 300.0);
    setTimeout(flashLightning, delayNext);
}
```

---------------------------------------

<a name="random" />
### random ()

Returns a floating point number n such that 0.0 <= n < 1.0.

Goes directly to the underlying PRNG.  By default this is the
Math.random() function.  Supplied for convenience.

__Example__

```javascript
var opacity = randy.random();
```

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

```javascript
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
```

---------------------------------------

## Notes

Due to floating point rounding, functions returning floating point
values may *extremely rarely* tangent the upper bound.

Random integers are calculated as a modulo of a random UINT32.  This
means lower numbers will be slightly more favoured than large numbers,
and imbalances will begin to be noticeable if you're asking for large
integers.  If this is a problem, you are advised to do your own
calculations on randy.randInt(), which returns a well-distributed
UINT32.

Maximum integer range is 4294967296.  Any calls requiring a larger
range than this, explicitly or implicitly, will not work at all.
