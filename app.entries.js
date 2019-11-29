function defaultOption (obj) {
  return Object.assign({
    src: [
      "app.config.js",
      'app.url.js',

      "%app/main.js",
      "%app/app.js",
      "apps/_common/**/module.js",
      "%app/**/module.js",
      "apps/_common/**/!(module)*.js",
      "%app/**/!(module)*.js"
    ],
    tpl: ["apps/_common/**/*.tpl.html", "%app/**/*.tpl.html"],
    bundles: [
      "vendor",
      {
        chunk: "vendor.ui",
        output: "build",
        lazy: true
      }
    ],
    polyfill: [
      "node_modules/babel-polyfill/dist/polyfill.min.js"
      // 'node_modules/json3/lib/json3.min.js',
      // 'node_modules/es5-shim/es5-shim.min.js'
    ]
  }, obj);
}

module.exports = {
  'enterprise-bi': defaultOption(
    {
      index: '%app/index.html',
      copy: [
        {
          src: 'apps/enterprise-bi/_data/files/**',
          base: 'apps/enterprise-bi/_data'
        }
      ]
    }
  )
};
