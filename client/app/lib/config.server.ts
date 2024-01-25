import fs from "fs"

const config = {
  values: null as Record<string, any> | null,
  get(key: string) {
    if (!this.values) {
      const json = fs.readFileSync(`res/${process.env.SCHOOL}.json`, "utf-8")
      this.values = JSON.parse(json)
    }

    return query(this.values!, key)
  },
}

function query(record: Record<string, any>, key: string) {
  // return value from nested key like "a.b.c"
  const keys = key.split(".")
  let value = record
  for (const k of keys) {
    value = value[k]
  }

  return value
}

export { config }
