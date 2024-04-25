function createTagsQuery(tagsParam: Record<string, any> = {}) {
  const tags = Object.entries(tagsParam).flatMap(
		([id, selection]) => {
			if (Array.isArray(selection)) {
				return selection.map((s) => ({
					tags: { contains: `${id}:${selection}` },
				}));
			}

			return { tags: { contains: `${id}:${selection}` } };
		},
	);

	const tagsFilter = tags.length ? tags : [];

  return tagsFilter
}

export { createTagsQuery };
