import { FieldValues, useForm, useFormContext } from "react-hook-form";
import { LargeSelect } from "./large-select";
import { useAsyncFetcher } from "~/lib/use-async-fetcher";
import React from "react";
import { useNavigate, useParams } from "@remix-run/react";
import { Input } from "./input";

interface Props {
	programmes: { name: string; slug: string }[];
}

function TimetableFilter({ programmes }: Props) {
	const params = useParams();

	const [programmeSelectOpen, setProgrammeSelectOpen] = React.useState(false);
	const fetcher = useAsyncFetcher();
	const { watch, register, setValue } = useForm({
		defaultValues: {
			programme: params.programme,
			level: params.level,
			sem: params.sem,
			year: params.year,
		},
	});

	const navigate = useNavigate();

	const programme = watch("programme");
	const level = watch("level");
	const sem = watch("sem");
	const year = watch("year");

	const selected = React.useMemo(
		() => programmes.find(({ slug }) => slug === programme),
		[programmes],
	);

	const programmeOptions = programmes.map(({ name, slug }) => ({
		label: name,
		value: slug,
	}));

	async function handleAdd(data: FieldValues) {
		await fetcher.submit(JSON.stringify(data), {
			encType: "application/json",
			action: "/programmes",
			method: "POST",
		});
	}

	React.useEffect(() => {
		if (!programme || !level || !sem || !year) return;

		const day = params.day ?? "1";
		const to = `/timetable/${year}/${programme}/${level}/${sem}/${day}`;

		if (location.pathname.startsWith(to)) return;

		navigate(to);
	}, [programme, level, sem, year]);

	return (
		<div className="max-lg:block flex gap-2">
			<div className="flex-1 max-lg:mb-2">
				<LargeSelect
					label="Programme"
					newForm={<NewForm />}
					onAdd={handleAdd}
					open={programmeSelectOpen}
					onToggle={(open) => setProgrammeSelectOpen(open)}
					options={programmeOptions}
					onSelect={(value) => {
						setValue("programme", value as string);
						setProgrammeSelectOpen(false);
					}}
				>
					{selected?.name ?? "Select a programme"}
				</LargeSelect>
			</div>

			<div className="flex gap-2">
				<select
					className="bg-zinc-200 dark:bg-neutral-800 px-2 py-1 pe-6 rounded-lg font-medium flex-1"
					{...register("year")}
				>
					<option value="2023-2024">2023/2024</option>
				</select>

				<select
					className="bg-zinc-200 dark:bg-neutral-800 px-2 py-1 pe-6 rounded-lg font-medium flex-1"
					{...register("level", { required: true })}
				>
					<option value="100">L100</option>
					<option value="200">L200</option>
					<option value="300">L300</option>
					<option value="400">L400</option>
					<option value="500">L500</option>
					<option value="600">L600</option>
				</select>

				<select
					className="bg-zinc-200 dark:bg-neutral-800 px-2 py-1 pe-6 rounded-lg font-medium flex-1"
					{...register("sem", { required: true })}
				>
					<option value="1">Sem 1</option>
					<option value="2">Sem 2</option>
				</select>
			</div>
		</div>
	);
}

function NewForm() {
	const { register } = useFormContext();

	return (
		<div className="flex-1">
			<div className="p-2">
				<label>
					Programme
					<Input type="text" {...register("name", { required: true })} />
					<small className="text-secondary">
						Example. BSc. Aerospace Engineering, MSc. Mathematics
					</small>
				</label>
			</div>
		</div>
	);
}

export { TimetableFilter };
