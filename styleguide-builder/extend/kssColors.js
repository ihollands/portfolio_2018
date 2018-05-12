module.exports = function (Twig) {
  'use strict';

  Twig.extend(function (Twig) {

    // example of extending a tag type that would
    // restrict content to the specified "level"
    Twig.exports.extendTag({
      // unique name for tag type
      type: 'kssColors',
      // regex for matching tag
      regex: /^kssColors\s+(.+)$/,

      // what type of tags can follow this one.
      next: ['endkssColors'], // match the type of the end tag
      open: true,
      compile: function (token) {
        var expression = token.match[1];

        // turn the string expression into tokens.
        token.stack = Twig.expression.compile.apply(this, [{
          type:  Twig.expression.type.expression,
          value: expression
        }]).stack;

        delete token.match; // cleanup
        return token;
      },
      parse: function (token, context, chain) {
        var doc = Twig.expression.parse.apply(this, [token.stack, context]);
        var output = [];
        var regex = /([^:]*)\s*:\s*(#\S+)\s*-\s*([^\n]*)?$/gm;
        var chunk;

        while ((chunk = regex.exec(doc)) !== null) {
          var innerContext = Twig.ChildContext(context);
          innerContext.color = {};
          innerContext.color.sass = chunk[1];
          innerContext.color.hex = chunk[2];
          innerContext.color.name = chunk[3];

          output.push(Twig.parse.apply(this, [token.output, innerContext]));

          Twig.merge(context, innerContext, true);
        }

        return {
          chain: chain,
          output: Twig.output.apply(this, [output])
        };
      }
    });

    // a matching end tag type
    Twig.exports.extendTag({
        type: 'endkssColors',
        regex: /^endkssColors$/,
        next: [ ],
        open: false
    });
  });
};
