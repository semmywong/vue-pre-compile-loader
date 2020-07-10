# vue-pre-compile-loader

Webpack loader to pre-compile Vue 2.0 templates.

`npm install -D vue-pre-compile-loader`

### vue.config.js config

```javascript
  chainWebpack(config) {
      // other code....

    // add code
      const tsRule = config.module.rule("ts");
      tsRule
        .use("vue-pre-compile-loader")
        .loader("vue-pre-compile-loader")
        .end();
  }

```

### Usage

```javascript
import { Component, Vue } from 'vue-property-decorator';

@Component({
    template: require('./index.html'),
})
export default class extends Vue {}
```
