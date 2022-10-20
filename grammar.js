
// TODO: change grammar to match manual and CSoar (don't parse productions that crash or issue warnings)
// TODO: what to do about the note about id_test?
// TODO: try to make the output structure more intuitive (as per tree-sitter docs)
// TODO: make << and >> keywords to resolve some TODOs (and reject some productions that issue warnings in CSoar)
// TODO: do the same for +, etc.; make sure + can't be a string.
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
      $.production,
      $._smem,
      // TODO: other kinds of commands
    ),

    /////////////////
    // smem command//
    /////////////////

    _smem: $ => seq('smem', '--add', '{', repeat1($.smemAdd), '}'),

    smemAdd: $ => seq("(",
      field("id", choice($.lti, $.variable)),
      field("attrValues", repeat1($.smemAttrValues)),
      ")"),

    lti: $ => seq('@', $.intConstant),
    smemAttrValues: $ => seq(
      '^',
      field("attr_name", $._constant),
      field("attr_vals", repeat1(choice($._singleTest, $.lti)))
      ),

    ////////////////
    // sp command //
    ////////////////

    production: $ => seq(
      'sp',
      "{",
      $._beginning,
      field("LHS", repeat1($._cond)),
      "-->",
      field("RHS", repeat($._action)),
      "}"
    ),

    _beginning: $ => seq(
      field("name", $.prod_name),
      field("doc", optional($.documentation)),
      field("flags", repeat($.flag))
    ),

    prod_name: $ => /[\dA-Za-z][\dA-Za-z$%&*=><?_/@:-]*/,
    documentation: $ => seq('"', /(?:\\["]|[^"])*/, '"'),
    flag: $ => seq(':', choice('o-support', 'i-support', 'chunk', 'default', 'interrupt', 'template')),

    ////////////
    // LHS
    ////////////

    _cond: $ => choice($._positiveCond, $.negativeCond),
    negativeCond: $ => seq('-', $._positiveCond),
    _positiveCond: $ => choice($.condsForOneId, $.conjunctiveCond),
    conjunctiveCond: $ => seq(
      '{',
      field("conds", repeat1($._cond)),
      '}'),
    condsForOneId: $ => seq(
      '(',
      field("type", optional($.condType)),
      field("id_test", optional($.idTest)),
      field("att_value_tests", repeat($.attrValueTests)),
      ')'),
    condType: $ => choice('state', 'impasse'),

    // manual grammar notes that only a <variable> may be used in the <singleTest> child here;
    // we'll ignore the distinction for simplicity here
    idTest: $ => $._test,

    _test: $ => choice($.conjunctiveTest, $._simpleTest),

    attrValueTests: $ => seq(
      optional('-'),
      '^',
      field("name_test", seq($._test, repeat(seq('.', $._test)))),
      field("val_test", repeat($.valueTest))),

    valueTest: $ => prec.left(choice(seq($._test, optional('+')), seq($.condsForOneId, optional('+')))),

    conjunctiveTest: $ => seq('{', field("tests", repeat1($._simpleTest)), '}'),

    _simpleTest: $ => choice($.disjunctionTest, $.relationalTest, $._singleTest),

    // TODO: first token should be followed by whitespace (/<<(?=\s)/, but lookahead not allowed in tree-sitter);
    // don't have to worry about looking for whitespace after >>; if no space is there, the parser will think it's a string and fail.
    disjunctionTest: $ => seq('<<', field("vals", repeat1($._constant)), '>>'),

    relationalTest: $ => seq(field("relation", $.relation), field("test", $._singleTest)),

    _singleTest: $ => choice($.variable, $._constant),

    // TODO: use /<(?=\s)/ to ensure we don't match the beginning of a variable (lookaround illegal in tree-sitter)
    relation: $ => choice("<=>", "<>", "<=", ">=", ">", "<", "="),

    //////////////
    // RHS
    //////////////

    _action: $ => choice($.funcCall, $.variableMutation),

    funcCall: $ => seq("(", field("name", $.funcName), field("args", repeat($._rhsValue)), ")"),
    funcName: $ => choice("+", "-", "*", "/", $._symConstant),

    variableMutation: $ => seq("(", $.variable, repeat1($.attrValueMake), ")"),

    _rhsValue: $ => choice($.variable, $._constant, $.crlf, $.funcCall),

    crlf: $ => "(crlf)",

    // TODO: manual says this should be `'^' <variable_or_sym_constant> ('.' <variable_or_sym_constant>)* <value_make>+`,
    // but the parser actually does `'^' <rhs_value>('.' <rhs_value>)* <value_make>+`
    // grammar comments in CPP code omit the '.' sections
    attrValueMake: $ => seq("^", field("name", $._rhsValue, repeat(seq('.', $._rhsValue))), field("val", repeat1($.valueMake))),

    valueMake: $ => seq(field("value", $._rhsValue), field("pref", repeat($._preferenceSpecifier))),

    // TODO: originally used negative lookahead to prevent matching<xx> as two specifiers and a _constant
    _preferenceSpecifier: $ => choice($.binaryPreference, $.unaryPreference),

    binaryPreference: $ => seq(
      // TODO: originally used negative lookahead to prevent matching<xx> as two specifiers and a _constant
      field("pref", choice(">", "<", "=", "&")),
      field("val", $._rhsValue),
      optional(',')),

    unaryPreference: $ => seq(
      field("pref", choice("+", "-", "!", "~", "@", ">", "<", "=", "&")),
      optional(',')),

    /////////////
    // lexemes //
    /////////////

    // TODO: original ends with (?<!>)> but lookaround is illegal in tree-sitter
    variable: $ => /<[A-Za-z0-9$%&*+/:=?_<>-]+>/,


    _constant: $ => choice($._symConstant, $.intConstant, $.floatConstant),

    _symConstant: $ => choice($.string, $.quoted),
    //TODO: note that in Soar, || is ignored and treated like <any>.
    quoted: $ => /\|(?:\\[|]|[^|])*\|/,
    // TODO: do we need to port any of the rejection rules to fix ambiguous matches?
    // NOTE: in CSoar, || is ignored and treated as <any>
    string: $ => /[A-Za-z0-9$%&*+\/:=?_><-]+/,

    intConstant: $ => /-?[0-9]+/,
    floatConstant: $ => choice($._normalFloat, $._scientificFloat),

    _normalFloat: $ => /[-+]?[0-9]*\.[0-9]*[dDfF]?/,
    _scientificFloat: $ => /[+-]?[0-9]\.[0-9]+[eE][-+]?[0-9]+[dDfF]?/,

  },

  conflicts: $ => [[$.unaryPreference, $.binaryPreference]]
});
