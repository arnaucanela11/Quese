import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
// import postcss from "rollup-plugin-postcss";
import image from "@rollup/plugin-image";
import json from "@rollup/plugin-json";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import copy from 'rollup-plugin-copy';
import css from "rollup-plugin-import-css";


export default {
  input: "src/main.js",
  output: {
    file: "dist/main.js",
    name: "quese-test",
    exports: "default",
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
    css(),
    image(),
    json(),
    builtins(), // Agregar el complemento aquí
    globals(), // Agregar el complemento aquí
    copy({
      targets: [{ src: 'src/worker.js', dest: 'dist' }], // Copia worker.js desde src a dist
      verbose: true, // Opcional: muestra detalles en la consola
    }),
  ],
  external: ["react", "react-dom", "@xenova/transformers"],
  treeshake: {
    moduleSideEffects: false,
  } // Especifica las dependencias externas
};
