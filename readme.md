# Soar tree-sitter grammar

[tree-sitter](https://tree-sitter.github.io/) is a parser generator tool and an incremental parsing library. It can build a concrete syntax tree for a source file and efficiently update the syntax tree as the source file is edited.

[Soar](https://github.com/SoarGroup/Soar) (or [JSoar](https://github.com/soartech/jsoar)) is a production rule system for artificial intelligence. This repository contains a tree-sitter grammar for Soar.

## Building and Testing

The app is built in the usual manner for tree-sitter grammars (see their [docs](https://tree-sitter.github.io/tree-sitter/creating-parsers
)).

You must first have `node` and a C++ compiler installed.

To install dependencies, run:

    npm install

To generate the parser (required after editing grammar.js), run:

    npm run generate

To run the tests, run:

    npm test

If you want to update all of the tests with the output of the current grammar, run:

    npm test -- -u

To parse a Soar source file into s-expressions, run:

    npm run parse <filename>

More commands are available from tree-sitter. See the help for more details:

    npm run tree-sitter -- --help

### Tests from CSoar

The tests in `tests/corpus/18-csoar-test-agents` were copied from the [CSoar](https://github.com/SoarGroup/Soar) test suite. If CSoar unit tests are updated and you would like to re-generate this test file, run the following from the root of the CSoar repository::

```bash
for filename in UnitTests/SoarTestAgents/**/*.soar; do
DIRNAME=`dirname $filename`
mkdir -p "testcorpus/$DIRNAME"
OUTFILE="testcorpus/$filename.txt"
echo "==========================
$filename
==========================
" > "$OUTFILE"
cat "$filename" >> "$OUTFILE"
echo "
-----------------
"  >> "$OUTFILE"
done
```

You can then replace the contents of `tests/corpus/18-csoar-test-agents/` in this repo with the new output in `testcorpus`. Then re-generate the syntax trees with `npm test -- -u`. You should observe changes in the output trees, paying special attention to any `ERROR` or `MISSING` strings indicating issues with parsing the input.
