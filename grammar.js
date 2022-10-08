module.exports = grammar({
  name: 'SOAR',

  rules: {
    source_file: $ => repeat($._command),

    _command: $ => choice(
      $.production
      // TODO: other kinds of commands
    ),

    production: $ => seq(
      'sp',
      "{",
      $.beginning,
      repeat1($.condition),
      "-->",
      repeat($.action),
      "}"
    ),

    beginning: $ => seq(
      $.prod_name,
      optional($.documentation),
      repeat($.flag)
    ),

    prod_name: $ => /[\dA-Za-z][\dA-Za-z$%&*=><?_/@:-]*/,
    documentation: $ => seq('"', /(?:\\["]|[^"])*/, '"'),
    flag: $ => seq(':', choice('o-support', 'i-support', 'chunk', 'default', 'interrupt', 'template')),

    // TODO: "(" <commit> condType(?) idTest(?) attrValueTests(s?) ")"
    condition: $ => seq('(', ')'),
    action: $ => 'TODO',


    // TODO: use /<(?=\s)/ to ensure we don't match the beginning of a variable (lookaround illegal in tree-sitter)
    relation: $ => choice("<=>", "<>", "<=", ">=", ">", "<", "="),

    // TODO: original ends with (?<!>)> but lookaround is illegal in tree-sitter
    variable: $ => /<[A-Za-z0-9$%&*+/:=?_<>-]+>/,

    //TODO: note that in Soar, || is ignored and treated like<any>.
    quoted: $ => /\|(?:\\[|]|[^|])*\|/,

    intConstant: $ => /-?[0-9]+/,

    floatConstant: $ => choice($.normalFloat, $.scientificFloat),
    normalFloat: $ => /[-+]?[0-9]*\.[0-9]*[dDfF]?/,
    scientificFloat: $ => /[+-]?[0-9]\.[0-9]+[eE][-+]?[0-9]+[dDfF]?/
  }
});
