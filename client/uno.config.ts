import {
	defineConfig,
	presetIcons,
	presetUno,
	transformerVariantGroup,
} from "unocss";
import { presetForms } from "@julr/unocss-preset-forms";

export default defineConfig({
	content: {
		filesystem: ["**/*.{html,js,ts,tsx}"],
	},
	presets: [presetUno({ dark: "media" }), presetIcons(), presetForms()],
	transformers: [transformerVariantGroup()],
});
