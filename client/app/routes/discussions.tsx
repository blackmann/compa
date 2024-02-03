import { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/button";
import { PostItem } from "~/components/post-item";
import { values } from "~/lib/values.server";

export const loader = async () => {
	return { school: values.meta() };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [{ title: `Discussions | ${data?.school.shortName} | compa` }];
};

export default function Discussions() {
	return (
		<div className="container mx-auto min-h-[60vh]">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
				<div className="col-span-1"> </div>

				<div className="col-span-1 lg:col-span-2">
					<div className="mb-4">
						<textarea
							className="w-full rounded-lg bg-zinc-100 border-zinc-200 p-2"
							placeholder="What have you got to share?"
						/>

						<div className="flex justify-between">
							<div>
								<Button variant="neutral"><div className="i-lucide-file-symlink opacity-50" /> Add files</Button>
							</div>
							<div>
								<Button>Start Discussion</Button>
							</div>
						</div>
						<p className="text-sm text-secondary">Maximum 4 files. Images and documents only.</p>
					</div>

					<PostItem />
					<PostItem />
				</div>

				<div className="cols-span-1">
					<div> </div>
				</div>
			</div>
		</div>
	);
}
