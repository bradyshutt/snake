module: {
   loaders: [
      loader: "babel-loader",

      include: [path.resolve(__dirname, "src")],

      query: {
         plugins: ['transform-runtime'],
         presets: ['es2015','stage-0']
      }
   ]
}
