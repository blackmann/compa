import { presetForms } from "@julr/unocss-preset-forms";
import {
	defineConfig,
	presetIcons,
	presetUno,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss";

export default defineConfig({
	content: {
		filesystem: ["**/*.{html,js,ts,tsx}"],
	},
	presets: [presetUno({ dark: "media" }), presetIcons(), presetForms()],
	transformers: [transformerDirectives(), transformerVariantGroup()],
});
