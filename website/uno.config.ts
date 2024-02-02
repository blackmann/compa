import {
  defineConfig,
  presetWind,
  presetIcons,
  transformerVariantGroup,
  transformerDirectives
} from 'unocss'

export default defineConfig({
  presets: [presetWind({ dark: 'media' }), presetIcons()],
  transformers: [transformerDirectives(), transformerVariantGroup()]
})
