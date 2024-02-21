import parse from "html-react-parser";

interface Props {
	content: string;
}

function Content({ content }: Props) {
	if (!content) return null;

	return <article className="article">{parse(content)}</article>;
}

export { Content };
