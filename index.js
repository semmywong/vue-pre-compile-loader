const path = require('path');
const fs = require('fs');
const { compile } = require('vue-template-compiler');
const transpile = require('vue-template-es2015-compiler');

const componentRegexp = /@(Component)\(/;
const tmplRegexp = /template:\s?require\(..\/([\w-]+.html).\)/;

const toFunction = (code) => {
    code = transpile(`function render(){${code}}`);
    code = code.replace(/function render\(\)\{|\}$/g, '');
    return new Function(code);
};

const compileAsFunctions = (template) => {
    const { render, staticRenderFns, errors, tips } = compile(template);
    errors.forEach((item) => this.emitError(new Error(item)));
    tips.forEach((item) => this.emitWarning(new Error(item)));
    return {
        render: toFunction(render),
        staticRenderFns: staticRenderFns.map(toFunction),
    };
};

module.exports = function (input, map, meta) {
    tmplRegexp.lastIndex = 0;
    componentRegexp.lastIndex = 0;

    let matched;
    if (componentRegexp.test(input) && (matched = input.match(tmplRegexp))) {
        const src = this.context;
        const callback = this.async();

        fs.readFile(path.join(src, matched[1]), { encoding: 'utf-8' }, function (err, fileContent) {
            if (err) {
                throw err;
            }
            const compiledResult = compileAsFunctions.call(this, fileContent);
            const staticRenderFnString = `[${compiledResult.staticRenderFns.toString()}]`;
            const renderFnString = compiledResult.render.toString();
            input = input.replace(tmplRegexp, `render: ${renderFnString}, staticRenderFns: ${staticRenderFnString}`);
            callback(null, input, map);
        });
    } else {
        this.callback(null, input, map);
    }
};
