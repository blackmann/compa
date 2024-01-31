import {
	defineConfig,
	presetWind,
	transformerVariantGroup,
	transformerDirectives,
} from "unocss";

export default defineConfig({
	presets: [presetWind({ dark: "media" })],
	transformers: [transformerDirectives(), transformerVariantGroup()],
});
