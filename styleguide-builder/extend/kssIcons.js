module.exports = function (Twig) {
  'use strict';

  Twig.extend(function (Twig) {

    // example of extending a tag type that would
    // restrict content to the specified "level"
    Twig.exports.extendTag({
      // unique name for tag type
      type: 'kssIcons',
      // regex for matching tag
      regex: /^kssIcons\s+(.+)$/,

      // what type of tags can follow this one.
      next: ['endkssIcons'], // match the type of the end tag
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
        var regex = /^(\S+)\s*:\s*(\S+)?$/gm;
        var chunk;

        while ((chunk = regex.exec(doc)) !== null) {
          var innerContext = Twig.ChildContext(context);
          innerContext.icon = {};
          innerContext.icon.name = chunk[1];
          innerContext.icon.character = chunk[2];

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
        type: 'endkssIcons',
        regex: /^endkssIcons$/,
        next: [ ],
        open: false
    });
  });
};
