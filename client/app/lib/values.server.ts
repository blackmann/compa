import fs from "fs";

type JsonObject = { [key: string]: JsonValue };

type JsonValue = null | boolean | number | string | JsonValue[] | JsonObject;

const values = {
	values: null as Record<string, JsonValue> | null,
	get(key: string) {
		if (!this.values) {
			const json = fs.readFileSync(`res/${process.env.SCHOOL}.json`, "utf-8");
			this.values = JSON.parse(json);
		}

		return query(this.values!, key);
	},
	meta() {
		return {
			shortName: this.get("shortName"),
		};
	},
};

function query(record: Record<string, JsonValue>, key: string): JsonValue {
	// return value from nested key like "a.b.c"
	const keys = key.split(".");
	let value: JsonValue = record;
	for (const k of keys) {
		value = value[k];

		if (typeof value !== "object") {
			break;
		}
	}

	return value;
}

export { values };
