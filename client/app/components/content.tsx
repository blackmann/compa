import parse from "html-react-parser";
import React from "react";
import renderContent from "~/lib/render-content";

interface Props {
	content: string;
	limit?: boolean;
}

function Content({ content, limit }: Props) {
	return (
		<div className="post-content">
			{renderContent(content, limit ? 2 : undefined).map((c, i) => (
				<React.Fragment key={i}>{parse(c)}</React.Fragment>
			))}
		</div>
	);
}

export { Content };
