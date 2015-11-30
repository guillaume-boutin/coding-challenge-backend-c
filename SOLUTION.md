# Solution to Busbud Coding Challenge

##  What it does

The API does the requirements of the challenge, thus passes the tests in `test/suggestions.js`. In addition to
that, I took the freedom to add a few more features, all of them being called with a parameter passed in the
url.

### Name match queries

For the name match query, there are 3 possible choices: `q` which is one of the required parameter in the
challenge, that is use to make name matches with cities, and I also added `begins` and `ends` which
specifies that the matches to be found must respectively begin, or end by the value passed.

`q`, `begins`, `ends` are mutually exclusive; You can pass either a parameter `q`, either a parameter
`begins`, either a parameter `ends`, but not two or three of them at the same time. Also, to limit the
number of results, the name match query must be at least 3 characters long.

### Longitude and latitude

These two were required in the challenge. Longitude must be a number in between -180 and 180,
latitude must be in between -90 and +90. And both, or none of those parameters must be passed
in the url.

### Distance queries

This is another feature I added to the challenge, the queries for distance can take two parameter,
`closer` and `farther`. `farther` filters the cities that have a distance greater or equal to the
value passed to it, and `closer` does the same with distances less or equal. For this query to work,
a `longitude` and a `latitude` value are requires in the url to be able to calculate a distance.

### Sorting queries

The last feature I added to the challenge. You can sort results either by score or by distance
with `sortscore` and `sortdistance`, and either ascending or descending with values `asc` or
`desc`. They are mutually exclusive; you can either sort by score,
or by name. In the case of `sortdistance`, there must be a `longitude` and a `latitude` passed
to get a distance to work with.

If there is no sorting specified, the results will be by default sorted by score descending, as
required in the challenge.


## How it works

Let's first run it with the same url as in the example of `README.md`

    GET /suggestions?q=Londo&latitude=43.70011&longitude=-79.4163

```
{
  "suggestions": [
    {
      "name": "London, ON, Canada",
      "latitude": "42.98339",
      "longitude": "-81.23304",
      "score": 0.83,
      "distance": 167
    },
    {
      "name": "London, OH, United-States",
      "latitude": "39.88645",
      "longitude": "-83.44825",
      "score": 0.79,
      "distance": 540
    },
    {
      "name": "London, KY, United-States",
      "latitude": "37.12898",
      "longitude": "-84.08326",
      "score": 0.74,
      "distance": 830
    },
    {
      "name": "New London, CT, United-States",
      "latitude": "41.35565",
      "longitude": "-72.09952",
      "score": 0.47,
      "distance": 653
    },
    {
      "name": "New London, WI, United-States",
      "latitude": "44.39276",
      "longitude": "-88.73983",
      "score": 0.46,
      "distance": 749
    },
    {
      "name": "Londontowne, MD, United-States",
      "latitude": "38.93345",
      "longitude": "-76.54941",
      "score": 0.43,
      "distance": 581
    },
    {
      "name": "Londonderry, NH, United-States",
      "latitude": "42.86509",
      "longitude": "-71.37395",
      "score": 0.42,
      "distance": 657
    }
  ]
}
```

There are actually more results than there are in the example in `README,md`. Since I don't know
how Busbud wrote this API, the only thing I can guess by comparing my results with the suggested
ones in the `README.md` is that their `q` parameter filters names that start with "Londo" while
my `q` filters all those having "londo" anywhere in them.

You might have noticed that I added a value `distance`, which is the distance in km between
the city found, and the coordinates in the query. This will only appear if there are `longitude`
and `latitude` in the query.

Let's now run another query with some of my features :

    GET /suggestions?begins=Londo&latitude=43.70011&longitude=-79.4163&farther=200&closer=700&sortdistance=asc

By reading this url, it should be quite easy to be understood as "Find cities that begins with 'Londo', around a
search-point of longitude 43.7011, latitude of -79.4163, that have a distance that is farther than 200km and closer
than 700km from search point, and sort them by distance ascending"

```
{
  "suggestions": [
    {
      "name": "London, OH, United-States",
      "latitude": "39.88645",
      "longitude": "-83.44825",
      "score": 0.8,
      "distance": 540
    },
    {
      "name": "Londontowne, MD, United-States",
      "latitude": "38.93345",
      "longitude": "-76.54941",
      "score": 0.43,
      "distance": 581
    },
    {
      "name": "Londonderry, NH, United-States",
      "latitude": "42.86509",
      "longitude": "-71.37395",
      "score": 0.43,
      "distance": 657
    }
  ]
}
```
As we can see, the results correspond to this query.

##  How did I do it

### Putting datas in a JSON file

My first idea to get the required data from `data/cities_canada-usa.tsv` was to got with regular expressions,
but it quickly became very complicated. When I realized the data where separated by tabs, all I had to do was
to make a `String.split('\n')` to separate every line in an array, and then a `String.split('\t')` to separate
every data in each line. Then for each line I put the data in an object with the names in the first row as
key values. This is all done with the file `tsvToJson.js` that had to be fired only once. The data I'm now
working with for the rest of the challenge are now stored in `data/cities_canada-usa.json`.

### Launching a GET request

When a GET request is sent, in `app.js` I first go through a whole bunch of conditions regarding the queries
of the request. If one fails (for instance, if I specify a `closer`, but didn't specify any longitude and latitude),
I send an error 400 with the appropriate error message. If they all pass, I launch a function `functions/search.js`
with `req.query` as a parameter.

Inside of `functions/search.js`, a function `filterNameDistance.js` will be launched to filter all the cities
according the the name and distance queries. Then a function `functions/admin1ToProvince.js` will convert, for
the case of Canadian cities, the admin1 code into the province abbreviation. Then a function `functions/calculateScore.js`
does what its name says, and finally the results are formated into the desired form to be outputted, and are then sorted
with `functions/sortResults.js`.

### Calculating score

To calculate the score, I calculate two factors, `nameFactor` and `areaFactor`, which are both in between 0 and
1, so the result `score = nameFactor*areaFactor` will also be.

For `nameFactor`, this is simply the ratio of the length of the name query, over the length of the name of the city
found. For instance if `q=Londo` and `Londontowne` is one of the cities found. `Londo` has a length of 5 characters
and `Londontowne` a length of 11 characters, so `nameFactor = 5/11 = 0.45`.

For the `areaFactor`, I calculate the area of a circle with the distance of the city as the radius, that I call
`searchArea`, and calculate the total area of Canada and USA combined, called `totalArea`. The area factor is then
calculated with `areaFactor = 1 - searchArea/totalArea`. The smaller the search area, the bigger the area factor. In
the event that the search area is bigger than the total area, (for instance with a distance between New-York City and
Vancouver BC) the area factor will simply be 0 to avoid negative results.

If there are no longitude and latitude to calculate a distance, the score will simply be `score = nameFactor`.

Since the search area to be calculated is running along the Earth's sphere rather than a plane surface, the formula for the
area is NOT `pi*r²`, but rather `A = pi*R²*(1-cos(s/R))`, where `R = 6371km` is the Earth's mean radius, ans `s` is the
distance of the city (acting as the radius of the search area). I'll spare you the maths of how I got to this formula, but I
thought it was worth mentioning.
