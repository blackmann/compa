import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Anchor } from "~/components/anchor";
import { FileInput } from "~/components/file-input";
import { Input } from "~/components/input";
import { NonImageThumb } from "~/components/non-image-thumb";
import { Tags } from "~/components/tags";
import { TagsFilter } from "~/components/tags-filter";
import { values } from "~/lib/values.server";

export const loader = async () => {
	return { school: values.meta() };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `Library | ${data?.school.shortName} | compa` },
		{
			name: "description",
			content:
				"Find resources for your programme, course, level or anything about the school.",
		},
	];
};

export default function Library() {
	return (
		<div className="h-[60vh] container mx-auto">
			<div className="grid grid-cols-1 md:grid-cols-5">
				<div className="col-span-1 md:col-span-3 md:col-start-2">
					<div className="flex">
						<div className="flex-1">
							<h1 className="font-bold text-xl">Library</h1>
							<p className="text-xs mb-2 ">
								<span className="bg-zinc-100 font-medium px-2 rounded-lg text-secondary">
									620 files in repository
								</span>
							</p>
						</div>

						<div>
							<FileInput className="!bg-blue-600 text-white">
								<div className="i-lucide-plus opacity-60" /> Add files
							</FileInput>
						</div>
					</div>

					<Input placeholder="Search for file" />

					<div className="mt-2">
						<TagsFilter label="Filter resources" path="/library" />
					</div>

					<div className="text-secondary mb-2">Showing most recent uploads</div>

					<div>
						<ul>
							<li>
								<Link
									className="grid grid-cols-4 hover:bg-zinc-100 gap-2 p-2 rounded-lg"
									to="/library/1"
								>
									<div className="flex gap-2 col-span-3">
										<div>
											<NonImageThumb contentType="image/png" />
										</div>

										<div>
											<header className="font-medium">Functions II.pdf</header>

											<div>
												<Tags
													post={{
														tags: '["level:L100","course:Math 101: Calculus I"]',
													}}
												/>
											</div>

											<div>
												<span className="text-secondary inline-flex text-xs items-center gap-1 font-mono">
													<div className="i-lucide-arrow-up" /> @notgr 13 Apr
													2024, 10.30pm
												</span>
											</div>
										</div>
									</div>

									<div className="col-span-1 text-end flex justify-end">
										<div className="font-medium bg-zinc-100 rounded-lg px-1 text-center self-start text-sm">
											14.2kb
										</div>
									</div>
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
