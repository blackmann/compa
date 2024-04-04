import { findAndReplace } from "mdast-util-find-and-replace";
import type { Plugin } from "unified";
import type { PhrasingContent } from 'mdast'

const userGroup = "[\\da-z][-\\da-z_]{0,38}";
const mentionRegex = new RegExp(`(?:^|\\s)@(${userGroup})`, "gi");

// Adapted from https://github.com/FinnRG/remark-mentions/blob/main/lib/index.js
function replaceMention(value: string, username: string) {
	const whitespace: PhrasingContent[] = [];

	// Separate leading white space
	if (value.indexOf("@") > 0) {
		whitespace.push({
			type: "text",
			value: value.substring(0, value.indexOf("@")),
		});
	}

	return [
		...whitespace,
		{
			type: "link",
			url: `/p/${username}`,
			children: [{ type: "text", value: value.trim() }],
		},
	];
}

export default function linkifyMentions(): ReturnType<Plugin> {
	return (tree, _file) => {
		findAndReplace(tree, [[mentionRegex, replaceMention]]);
	};
}
