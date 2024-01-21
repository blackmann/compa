import { defineConfig, presetIcons, presetUno } from "unocss"

export default defineConfig({
  content: {
    filesystem: ["**/*.{html,js,ts,tsx}"],
  },
  presets: [presetUno({ dark: "media" }), presetIcons()],
})
