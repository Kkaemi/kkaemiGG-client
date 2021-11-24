import path from "path";

module.exports = {
  transpileDependencies: ["vuetify"],

  configureWebpack: {
    resolve: {
      alias: { "@": path.join(__dirname, "src/") },
    },
  },
};
