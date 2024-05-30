import lodashGet from "lodash.get";
import fs from "node:fs";
import type { Paths } from "type-fest";

export interface Values {
	id: string;
	name: string;
	shortName: string;
	semester: Semester;
	examination: Examination;
	emailExtensions: string[];
}

export interface Semester {
	number: number;
	start: string;
	end: string;
}

export interface Examination {
	start: string;
	end: string;
}

const values = {
	initialized: false,
	values: {} as Values,
	get(key: Paths<Values>) {
		if (!this.initialized) {
			const json = fs.readFileSync(`res/${process.env.SCHOOL}.json`, "utf-8");
			this.values = JSON.parse(json);

			this.initialized = true;
		}

		return lodashGet(this.values, key);
	},
	meta() {
		return {
			id: this.get("id"),
			shortName: this.get("shortName"),
		};
	},
};

export { values };
