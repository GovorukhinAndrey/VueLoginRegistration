module.exports = {
  css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        // @/ is an alias to src/
        data: `@import "@/sass/main.sass";`,
      },
    },
  },
};
