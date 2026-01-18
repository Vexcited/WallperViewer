import { defineConfig } from "vite";

import icons from "unplugin-icons/vite";
import solid from "vite-plugin-solid";
import pages from "vite-plugin-pages";
import unocss from "unocss/vite";

export default defineConfig({
  plugins: [icons({ compiler: "solid" }), unocss(), pages(), solid()],
});
