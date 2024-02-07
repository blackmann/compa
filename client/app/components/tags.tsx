const tags = ["L100", "BSc. Computer Science", "Logic + Set Theory"];

function Tags() {
	return (
		<ul className="flex text-secondary font-medium">
			{tags.map((tag, index) => (
				<li
					key={index}
					className="bg-zinc-100 [&:not(:last-child)]:border-e px-2 text-sm inline-flex items-center gap-1 first:rounded-s-lg last:rounded-e-lg"
				>
					{tag}
				</li>
			))}
		</ul>
	);
}

export { Tags };
