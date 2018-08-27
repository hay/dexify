# Hay's dev cheatsheet
So, how do i...

## Index
* [Web development](#web-development)
* [(S)CSS](#scss)
* [Javascript](#Javascript)
    * [Promises](#promises)
    * [async / await](#asyncawait)
    * [Lodash](#lodash)
* [PHP](#PHP)
* [Git](#git)
* [Python](#python)
    * [Dicts and lists](#dicts-and-lists)
    * [Strings](#strings)
    * [Dates and times](#dates-and-times)
    * [Files](#files)
    * [Logging](#logging)
    * [Classes](#classes)
    * [Errors and exceptions](#errors-and-exceptions)
    * [XML](#xml)
    * [Other stuff](#other-stuff)
* [Command-line generic](#command-line-for-nix-likes)
* [Command-line Linux](#comand-line-linux)
* [Command-line Mac OS X](#command-line-mac-os-x-specific)
* [Chrome](#chrome)
* [Spreadsheets (Google Sheets, Excel, etc)](#spreadsheets)

## Web development

### Fixing Internet Explorer 11 bugs

#### Add a class if the browser is Internet Explorer 11 or lower

    if ('ActiveXObject' in window) {
        document.documentElement.className = 'is-ie';
    }

#### Fixing childen of a flexbox container exceeding their parent width

Just add `width: 100%` to the elements, or if you're really lazy:

    .container > * {
        width: 100%;
    }
    
## SCSS

### Getting both value and index from a SASS list
    
    $colors: red, blue, yellow, green;
    @for $index from 1 through length($colors) {
        li:nth-child(#{length($colors)}n + #{$index}):before {
            background-image: url('../img/bullet-#{nth($colors, $index)}.svg');
        }
    }

## Javascript

### Is there a quicker way to assign a default value if the result is undefined?
Instead of this:

    const bar = foo.bar ? foo.bar : 'bar';
   
Or this:
   
    let bar;

    if (foo.bar) {
      bar = foo.bar;
    } else {
      bar = 'bar';
    }

Try this

    const bar = foo.bar || 'bar';

### Promises

    // Transforming jQuery's $.get to a Promise
    function get(url) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                method : "GET",
                url : url,
                success : function(data) {
                    resolve(data);
                },
                error : function() {
                    reject('Something went wrong');
                }
            }
        });
    }

    get('http://example.com').then(function(data) {
        console.log(data);
    });
    
### async/await

    const URL = 'https://api.github.com/gists/a09e180c6064906b5271';

    async function getGist() {
        try {
            const res = await fetch(URL);
            const data = await res.json();
            return data;
        } catch (err) {
            console.log(err);
        }
    }

    getGist().then(gist => console.log(gist.description));

### Lodash
#### Transform an array with objects to an object with keys and values

    _.mapValues(_.keyBy(data, 'key'), 'value');

Transform this:

    [
        { key : 'foo', value : 'bar'},
        { key : 'baz', value : 'qux'}
    ]

Into this:

    {
        'foo' : 'bar',
        'baz' : 'qux'
    }

## PHP
### Get the path of the current script

    echo __FILE__;

### Get the directory of the current script

    echo realpath(dirname(__FILE__));

### Fix those pesky PDO `SQLSTATE[HY000] [2002] No such file or directory` errors

* Try using `127.0.0.1` instead of `localhost` for DB host
* Add a utf-8 charset

## Git
### Check in an empty directory

Create a `.gitignore` with this content:

    # Ignore everything in this directory
    *
    # Except this file
    !.gitignore

### Add something to your last commit
Use `git add` just as you would for a normal commit. Then:

    git commit --ammend

### Edit last commit message

    git commit --amend -m "New commit message"

### Resolve all merge conflicts by overwriting with all local or remote files ([source](https://rtcamp.com/tutorials/git/git-resolve-merge-conflicts/))

To use local files

    grep -lr '<<<<<<<' . | xargs git checkout --ours

To use remote files

    grep -lr '<<<<<<<' . | xargs git checkout --theirs

### Remove local (untracked) files from a current branch

    git clean -f

Directories as well

    git clean -fd
    
`.gitignore` files as well

    git clean -fdx

### Remove an already pushed tag in a Github / remote repo

    git tag -d yourtag
    git push origin :refs/tags/yourtag

### Undo the last commit

    git reset --hard HEAD^

If you don't care about the changes, or

    git reset --soft HEAD^

If you do.

If you've already pushed, try this:

    git revert HEAD

## Python

### Dicts and lists
#### Iterate over keys *and* values in a dict

    obj = { "key" : val }

    # Python 2
    for key, val in obj.iteritems():
        print key, val

    # Python 3
    for key, val in obj.items():
        print(key, val)

#### Extend / merge a dict with more values

    a = { "foo" : 1 }
    a.update({ "bar" : 2 })

    print(a) # { "foo" : 1, "bar" : 2 }

#### Get the first item in a dict

    a = { "a" : {}, "b" : {} }
    a.itervalues().next()

#### Remove a key from a dict

    my_dict.pop("key", None)

#### Get a default value for a dict if the key does not exist

    a = { "foo" : "foo" }
    a["foo"] // "foo"
    a.get("bar", "bar") // "bar"
    a["bar"] // KeyError: "bar"

#### Get the index number when looping over a list (array)

    l = [1,2,3]
    for index, val in enumerate(l):
        print(index, val) # "0, 1", "1, 2", "2, 3"

#### Sort a list by a user defined function

    a = [ { "foo" : "bar" }, {"foo" : "baz"} ]

    a.sort(key = lambda i:i["foo"])

Or

    a = sorted(a, key = lambda i:i["foo"])

#### Sort a list with dicts by a key in the dicts?

    a = [ { "name" : "Bert" }, { "name" : "Ernie" }

    from operator import itemgetter
    b = sorted(a, key = itemgetter("name") )

#### Sort a list with lists on one of the items?

    a = [ ["foo", 3], ["foo", 1], ["foo", 2] ]
    a.sort(key = lambda i:i[1]) // [ ["foo", 1], ["foo", 2], ["foo", 3] ]

#### Get the key of a dict where the value is the largest

    a = { "foo" : 10, "bar" : 20, "baz" : 5 }
    max(a, key = (lambda k:a[k])) # 'bar'

#### Count the number of times an item appears in a list?

    from collections import Counter

    l = ["foo", "bar", "foo", "baz"]
    print(Counter(l))

    # Prints:
    # {'foo': 2, 'baz': 1, 'bar': 1}

#### Flatten a list with nested lists?

The ugly way

    sum(l, [])

The slighty more Pythonic (and faster) way

    [item for sublist in l for item in sublist]
    
And the fastest way

    from itertools import chain
    list(chain.from_iterable(l))

#### Get the unique values in a list

Convert to a set, then to a list again

    list(set(l))

#### Remove falsy values from a list

Python 2

    values = filter(None, [1, None, 3])

Python 3

    values = list(filter(None, [1, None, 3]))
    
#### Split a list in evenly sized chunks

    lst = list(range(0, 180))
    
    chunks = [ lst[i:i + 50] for i in range(0, len(lst), 50) ]
    
Or if you want a function:

    def batch(iterable, n = 1):
        for i in range(0, len(iterable), n):
            yield iterable[i:i + n]    
   
#### Filter a list using comprehensions

    l = [5, 3, 7, 24, 2, 22]

    l = [ x for x in l if x > 10 ] # l == [24, 22]


#### Dict comprehensions

    d = {k:v for k,v in dct.iteritems() } # Python 2
    d = {k:v for k,v in dct.items() } # Python 3

### Strings

#### Format a string

Either

    "Ham, %s and %s" % ("eggs", "spam")

Or

    "Ham, {food1} and {food2}".format(food1 = "eggs", food2 = "spam")

Or (since Python 3.6)

    food1 = "eggs"
    food2 = "spam"
    f"Ham, {food1} and {food2}"

#### Pad a number with zeroes
If the number is already a string

    number.zfill(3)

#### URL encode a string

Python 2
    urllib.quote_plus("Lots of weird charachters:ª•¶•ª¶™•ª¢∆")

Python 3
    urllib.parse.quote_plus("Lots of weird charachters:ª•¶•ª¶™•ª¢∆")

#### Check if any string in a list appears in another string

    target = "a lovely string"
    strings = ("nice", "kind", "lovely")

    if any(s in target for s in strings):
        print(s) # 'lovely'

#### Regular expressions

    import re

    REGEX = re.compile("…[^…]*…")

    # Replace all occurences
    text = REGEX.sub(" ", text)
    
    # Get all matches
    matches = REGEX.findall(text)
    
    # Split by regex
    parts = REGEX.split(text)


### Dates and times

#### Get the current time as a ISO8601-formatted string

    import datetime
    datetime.datetime.now().isoformat("T")

### Files

#### Get the directory of the current executing file

    import os
    PATH = os.path.dirname(os.path.realpath(__file__))

In reverse

    a.sort(key = lambda i:i[1], reverse = True) // [ ["foo", 3], ["foo", 2], ["foo", 1] ]

#### Check if a file exists?

    import os.path
    os.path.isfile( filename )

### Get a filename without extension

    import os
    os.path.basename(filename)[0]
   
To also remove the path to the filename

    os.path.splitext(os.path.basename(filename))[0]

### Logging

    import logging
    logger = logging.getLogger(__name__)

    logger.critical("Log with critical level")
    logger.error("Log with error level")
    logger.warning("Log with warning level")
    logger.info("Log with info level")
    logger.debug("Log with debug level")

    logging.basicConfig(level=logging.DEBUG) # Set default level to DEBUG

### Classes

    class ClassName:

        foo = "Unknown"

        def __init__(self, foo):
            self.foo = foo

        def bar(self):
            print(self.foo)

### Errors and Exceptions

    def test():
        raise Exception("Something happened")

    try:
        test()
    except Exception as e:
        print(e.message)
    else:
        # Do something else

Note that you can re-raise an exception

    try:
        test()
    except Exception as e:
        raise e

### XML

To parse XML use [xmltodict](https://pypi.python.org/pypi/xmltodict), to make it behave like a dict.

    import xmltodict

    doc = xmltodict.parse("""
    <record id="123">
        <key>foo</key>
    </record>
    """)

    print(doc["record"]["@id"]) # '123'
    print(doc["record"]["key"]) # foo

To write back XML you can use xmltodict's `unparse`

    print(xmltodict.unparse(doc, pretty = True)) # <record id="123">....


Or use `lxml.etree.tostring()`

    from lxml import etree
    print(etree.tostring(doc))

### Other stuff

### Simplify a complex loop?

Use a generator. Instead of

    for point in points:
        for x in point:
            if x > 5:
                plot(x)

Do

    def iterpoints():
        for point in points:
            for x in points:
                if x > 5:
                    yield x

    for x in iterpoints():
        plot(x)

### Increment an integer? foo++ doesn't work. ([source](http://stackoverflow.com/questions/1485841/behaviour-of-increment-and-decrement-operators-in-python))

    foo += 1

Or

    foo = foo + 1

#### Break into debugger from the code itself

    import pdb;pdb.set_trace()

#### Encode URLs?

    from urllib import quote_plus as encode
    encode('Something with spaces and ••ª¶ª•¶∆˙˚∆ charachters')

#### Transform a CSV file using dicts

    import csv

    # Get the fieldnames first
    infile = open("in.csv", "r")
    reader = csv.DictReader(infile)
    fieldnames = reader.next().keys()
    infile.close()

    # Now open the in and outfile
    infile = open("in.csv", "r")
    outfile = open("out.csv", "w")
    reader = csv.DictReader(infile)
    writer = csv.DictWriter(outfile, fieldnames = fieldnames)

    # Print the field names in the first row
    writer.writerow(
        dict(
            (fn, fn) for fn in fieldnames
        )
    )

    for row in reader:
        # Do something with the values

        # And then write it
        writer.writerow(row)

    infile.close()
    outfile.close()

#### How do i remove the mysterious "ValueError: View function did not return a response" with WSGI?
Check if there's no `print` statements in your code.

#### Parsing HTML using BeautifulSoup

    from bs4 import BeautifulSoup

    soup = BeautifulSoup(html, 'html5lib')
    videos = soup.select(".video")

    for v in videos:
        stats = v.select(".stats")[0].get_text()

        return {
            "stats" : stats,
            "url" : v.get("href", None),
            "title" : v.select("h1")[0].get_text(),
        }
        
#### Download a file over HTTP

    import urllib.request
    urllib.request.urlretrieve('http://www.example.com/songs/mp3.mp3', 'mp3.mp3')

## Command line (for *nix-likes)
* See [this](http://linoxide.com/guide/linux-command-shelf.html) excellent resource.

### Login with SSH to an unreachable server via another server
    Host          internal.hostname.tld
    User          user
    HostName      internal.hostname.tld
    ProxyCommand  ssh user@external.hostname.tld nc %h %p 2> /dev/null

### Weird rsync errors
Errors like this could be anything:

    rsync error: error in rsync protocol data stream

But make sure your SSH keys have proper permissions

    chmod -R 700 ~/.ssh

### Convert a batch of image files
Use `mogrify`to convert a bunch of `JPG` files to fit within a 1500x1500 frame (take longest side), and set quality to 60%

    mogrify -resize 1500x1500 -quality 60 *.jpg

Same thing, but crop the images as well so they fit in the 1500x1500 frame, cropped from the center of the image.

    mogrify -resize 1500x1500^ -crop 1500x1500+0+0 -gravity center *.jpg
    
### Convert pages from a multi-page PDF to separate JPG files (3000px longest side), trimming excess whitespace

    convert -resize 3000x doc.pdf -trim image-%d.jpg

### Sequentially rename a bunch of files
Use the `rename` command to sequentially number a bunch of `JPG` files to 01.jpg, 02.jpg, etc.

    rename -N 01 's/.*/$N.jpg/' *

### Video converting
Basic use of `ffmpeg`

    ffmpeg -i source.extension dest.extension

Resize to 600px wide

    ffmpeg -i in.mov -vf scale=600:-1 out.mp4

Crop a video with landscape aspect-ratio to a square from the center

    ffmpeg -i in.mov -filter:v "crop=in_h:in_h:((in_w/2)-(in_h/2)):0" out.mp4

Framerate to 24fps

    ffmpeg -i in.mov -r 24 out.mp4

Bitrate to 2mb/s

    ffmpeg -i in.mov -b:v 2000k out.mp4

Grab a frame from 1 second into the video and convert to jpg (note that .png also works)

    ffmpeg -i in.mov -ss 00:00:01 -vframes 1 out.jpg
    
Make sure it works in Quicktime
  
    ffmpeg -i in.mov -pix_fmt yuv420p out.mp4

Convert from a movie to a series of JPG's (note that `-q:v 2` is only needed for JPG)

    ffmpeg -i clip.mp4 -q:v 2 "frames/%04d.jpg"

Convert a bunch of images to a movie clip

    ffmpeg -r 24.89 -f image2 -s 1280x720 -i "frames/%04d.jpg" -vcodec libx264 -crf 25 -pix_fmt yuv420p movie.mp4

### Download movies from YouTube and other video services
Use the brilliant [`youtube-dl`](https://github.com/rg3/youtube-dl).

    youtube-dl -f mp4 https://www.youtube.com/watch?v=bMj3Pc5I078

Directly convert a movie at an URL to mp3

    youtube-dl -x --audio-format mp3 https://www.youtube.com/watch?v=bMj3Pc5I078

### Batch run a command on all files in a directory

    for f in *.ext; do command $f; done

## Comand line (Linux)
### Fix those stupid `bash: warning: setlocale: LC_ALL: cannot change locale (en_US.UTF-8)` warnings

    $ vim /etc/locale.gen

Uncomment the en_US.UTF-8 line

    $ locale-gen

If you're still getting errors, add these two lines to your `bashrc` or `bash_profile` on the machine you're connecting *from*:

    # Setting for the new UTF-8 terminal support in Lion
    export LC_CTYPE=en_US.UTF-8
    export LC_ALL=en_US.UTF-8
    
### Add user to group

    usermod -aG group user

## Command line (Mac OS X specific)
### Pipe outputs to the clipboard

    ls | pbcopy

### Find stuff on the command line using spotlight

    mdfind

## Chrome
### Remove URLS from autocomplete

Highlight the item using keyboard arrows and press Shift and Delete keys.

## Spreadsheets
### Use a formula on the output of a condition

    =AVERAGE(FILTER(A2:A25, A2:A25>0))

### Select a complete row or column in a formula

    =AVERAGE(B:B)

### Count the number of cells

    =COUNTA(B:B)

### Only count cells that meet a certain condition

    =COUNTIF(B:B, "Yes")

### Get the data from a cell with more than one condition (use shift-ctrl-enter to activate formula, note the ampersands)

    =INDEX(C:C,MATCH(B2&"value",A:A&B:B,0))
    
### (Excel only): convert seconds to a hh:mm:ss notation
Divide the number of seconds by 86400 (number of seconds in a day) --> format cell --> custom --> enter 'hh:mm:ss'