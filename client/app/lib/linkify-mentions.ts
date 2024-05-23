import type { Node } from "mdast";
import { findAndReplace } from "mdast-util-find-and-replace";
import type { Plugin } from "unified";

const userGroup = "[\\da-z][-\\da-z_]{0,38}";
const mentionRegex = new RegExp(`(?:^|\\s)@(${userGroup})`, "gi");

// Adapted from https://github.com/FinnRG/remark-mentions/blob/main/lib/index.js
function replaceMention(value: string, username: string) {
	const whitespace: Node[] = [];

	// Separate leading white space
	if (value.indexOf("@") > 0) {
		whitespace.push({
			type: "text",
			value: value.substring(0, value.indexOf("@")),
		});
	}

	const children: Node[] = [{ type: "text", value: value.trim() }];

	if (username === "notgr") {
		children.push({
			type: "element",
			tagName: "span",
			properties: {
				className: "i-lucide-crown text-amber-500 inline-block",
			},
		});
	}

	return [
		...whitespace,
		{
			type: "element",
			tagName: "a", // use a div with id = user+username and add hover listeners to show a popup on tap or hover
			properties: {
				href: `/p/${username}`,
				className:
					"!no-underline inline-flex items-center gap-1 font-medium !text-green-600 dark:text-green-500 bg-green-700 bg-opacity-10 rounded-lg px-1",
			},
			children,
		},
	];
}

export default function linkifyMentions(): ReturnType<Plugin> {
	return (tree) => {
		findAndReplace(tree, [[mentionRegex, replaceMention]]);
	};
}
