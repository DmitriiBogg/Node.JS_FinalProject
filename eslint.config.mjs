import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  {
    files: ["**/*.js"],
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
    },
    plugins: {
      prettier: prettierPlugin,
    },
  },
];
