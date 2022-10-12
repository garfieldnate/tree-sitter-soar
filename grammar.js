
// TODO: change grammar to match manual and CSoar (don't parse productions that crash or issue warnings)
// TODO: what to do about the note about id_test?
// TODO: try to make the output structure more intuitive (as per tree-sitter docs)

module.exports = grammar({
  name: 'Soar',

  // ignore whitespace and end-of-line comments
  extras: $ => [
    $._comment,
    /\s/,
  ],

  rules: {
    // This rule must be defined first!
    source_file: $ => repeat($._command),

    _comment: $ => /(?:;\s*)?#[^\r\n]*/,

    _command: $ => choice(
      $.production
      // TODO: other kinds of commands
    ),

    production: $ => seq(
      'sp',
      "{",
      $.beginning,
      $.LHS,
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

    ////////////
    // LHS
    ////////////


    LHS: $ => repeat1($.cond),

    cond: $ => choice($.positiveCond, $.negativeCond),
    negativeCond: $ => seq('-', $.positiveCond),
    positiveCond: $ => choice($.condsForOneId, $.conjunctiveCond),
    conjunctiveCond: $ => seq('{', repeat1($.cond), '}'),
    condsForOneId: $ => seq('(', optional($.condType), optional($.idTest), repeat($.attrValueTests), ')'),
    condType: $ => choice('state', 'impasse'),

    idTest: $ => $.test,
    test: $ => choice($.conjunctiveTest, $.simpleTest),

    attrValueTests: $ => seq(optional('-'), $.attrTest, repeat($.valueTest)),

    attrTest: $ => seq('^', $.test, repeat(seq('.', $.test))),

    valueTest: $ => prec.left(choice(seq(optional('+'), $.test), seq($.condsForOneId, optional('+')))),

    conjunctiveTest: $ => seq('{', repeat1($.simpleTest), '}'),

    simpleTest: $ => choice($.disjunctionTest, $.relationalTest, $.singleTest),

    // TODO: first token should be followed by whitespace (/<<(?=\s)/, but lookahead not allowed in tree-sitter);
    // don't have to worry about looking for whitespace after >>; if no space is there, the parser will think it's a string and fail.
    disjunctionTest: $ => seq('<<', repeat1($.constant), '>>'),

    // note that we made relation non-optional and added singleTest to simpleTest instead (seems clearer than the definition in the manual)
    relationalTest: $ => seq($.relation, $.singleTest),

    singleTest: $ => choice($.variable, $.constant),

    // TODO: use /<(?=\s)/ to ensure we don't match the beginning of a variable (lookaround illegal in tree-sitter)
    relation: $ => choice("<=>", "<>", "<=", ">=", ">", "<", "="),

    //////////////
    // RHS
    //////////////

    action: $ => choice($.funcCall, seq("(", $.variable, repeat1($.attrValueMake), ")")),

    funcCall: $ => seq("(", $.funcName, repeat($.rhsValue), ")"),

    funcName: $ => choice("+", "-", "*", "/", $.symConstant),

    rhsValue: $ => choice($.variable, $.constant, "(crlf)", $.funcCall),

    attrValueMake: $ => seq(seq($.attr, repeat(seq('.', $.variableOrSymConstant))), repeat1($.valueMake)),

    attr: $ => seq("^", $.variableOrSymConstant),

    variableOrSymConstant: $ => choice($.variable, $.symConstant),

    valueMake: $ => seq($.rhsValue, repeat($.preferenceSpecifier)),

    preferenceSpecifier: $ => choice(seq($.unaryOrBinaryPreference, $.rhsValue, optional(',')), seq($.unaryPreference, optional(','))),

    unaryPreference: $ => choice("+", "-", "!", "~", "@", $.unaryOrBinaryPreference),

    // TODO: originally used negative lookahead to prevent matching<xx> as two specifiers and a constant
    unaryOrBinaryPreference: $ => choice(">", "<", "=", "&"),

    ///////////////////////////////////////
    // Values used in both LHS and RHS
    ///////////////////////////////////////

    // TODO: original ends with (?<!>)> but lookaround is illegal in tree-sitter
    variable: $ => /<[A-Za-z0-9$%&*+/:=?_<>-]+>/,

    //TODO: note that in Soar, || is ignored and treated like<any>.
    quoted: $ => /\|(?:\\[|]|[^|])*\|/,

    constant: $ => choice($.symConstant, $.intConstant, $.floatConstant),
    symConstant: $ => choice($.string, $.quoted),
    intConstant: $ => /-?[0-9]+/,
    floatConstant: $ => choice($.normalFloat, $.scientificFloat),

    normalFloat: $ => /[-+]?[0-9]*\.[0-9]*[dDfF]?/,
    scientificFloat: $ => /[+-]?[0-9]\.[0-9]+[eE][-+]?[0-9]+[dDfF]?/,

    // TODO: do we need to port any of the rejection rules to fix ambiguous matches?
    // NOTE: in CSoar, || is ignored and treated as <any>
    string: $ => /[A-Za-z0-9$%&*+\/:=?_><-]+/,
  },

   conflicts: $=> [[$.preferenceSpecifier, $.unaryPreference]]
});
