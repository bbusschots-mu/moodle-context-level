# moodle-context-level
A JavaScript class representing the context levels in Moodle's permissions system.

## Installation & Importation

### NodeJS

Install with:

```
npm install --save '@maynoothuniversity/moodle-context-level'
```

Import with:

```
const MoodleContextLevel = require('@maynoothuniversity/moodle-context-level');
```

### Browser

Import into page with:

```
<!-- Import MoodleContextLevel from CDN -->
<script src="https://rawcdn.githack.com/bbusschots-mu/moodle-context-level/1aa70e57d14ed7fba107721de9df2dc30806329a/dist/index.js"></script>
```

## Basic Example

```
// Example assumes module has been imported as MoodleContextLevel

// factory method — 3 ways to create a course context
const cxt1 = MoodleContextLevel.parse('CONTEXT_COURSE'); // by name
const cxt2 = MoodleContextLevel.parse('course'); // by base name or alias
const cxt3 = MoodleContextLevel.parse(50); // by number

// static factory getters - 3 ways to create a category context
const catCxt1 = MoodleContextLevel.CONTEXT_COURSECAT; // by name
const catCxt2 = MoodleContextLevel.coursecat; // by base name
const catCxt3 = MoodleContextLevel.category; // by alias

// properties
console.log(catCxt1.name); // CONTEXT_COURSECAT
console.log(catCxt1.baseName); // courseCat
console.log(catCxt1.aliases); // ['category', 'courseCategory']
console.log(catCxt1.number); // 40

// all existing context names as they appear in the Moodle source code
console.log(MoodleContextLevel.names);
  // [
  //   'CONTEXT_SYSTEM',
  //   'CONTEXT_USER',
  //   'CONTEXT_COURSECAT',
  //   'CONTEXT_COURSE',
  //   'CONTEXT_MODULE',
  //   'CONTEXT_BLOCK'
  // ]
  
// all names understood by the module
console.log(MoodleContextLevel.allNames);
  // [
  //   'CONTEXT_BLOCK',     'CONTEXT_COURSE',
  //   'CONTEXT_COURSECAT', 'CONTEXT_MODULE',
  //   'CONTEXT_SYSTEM',    'CONTEXT_USER',
  //   'block',             'category',
  //   'course',            'courseCategory',
  //   'coursecat',         'module',
  //   'system',            'user'
  // ]
```

## API Documentation

The documentation for the public API can be access at
[https://bbusschots-mu.github.io/moodle-context-level/](https://bbusschots-mu.github.io/moodle-context-level/).

## Development

To contribute to the module, clone it from GitHub and then in the folder
execute the following:

```
npm install
```

The single source file is `./src/index.html`.

Once changes have been made the two distribution files can be generated with:

```
npm run build
```

The public API documentation can be updated with:

```
npm run docs
```

The generated documentation will be at `./docs/index.html`.

The public API documentation does not include private variables. Full developer
documentation can be generated with:

```
npm run docs-dev
```

The generated develoer documentation will be at `./docs-dev/index.html`.

The QUnit test suite is defined in `./test/tests.js`.

The tests can be execute in-browser **after the code has been built** at
`./test/index.html`, or from the CLI with:

```
npm run test
```