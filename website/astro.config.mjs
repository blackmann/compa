import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";

// https://astro.build/config
export default defineConfig({
	site: "https://compa.so",
	integrations: [UnoCSS({ injectReset: true })],
});
