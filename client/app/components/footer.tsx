import { SymOutline } from "./sym-outline";

const env = process.env.NODE_ENV;
let COMPA_URL = "https://compa.so";
if (env === "development") {
    COMPA_URL = `http://localhost:${process.env.PORT}`;
}

const GITHUB_URL = "https://github.com/blackmann/compa";

const projectLinks = [
    {
        name: "About",
        href: `${COMPA_URL}/about`,
    },
    {
        name: "Report an issue",
        href: `${GITHUB_URL}/issues`,
    },
    {
        name: "Contribute",
        href: `${COMPA_URL}/contribute`,
    },
    {
        name: "Roadmap",
        href: `${COMPA_URL}/roadmap`,
    },
    {
        name: "Data & Privacy Policy",
        href: `${COMPA_URL}/data-privacy-policy`,
    },
];

function Footer() {
    return (
        <footer className="container mx-auto py-6 lg:rounded-xl mt-6 bg-zinc-100 dark:bg-neutral-800 lg:mb-4 lg:rounded-xl max-lg:rounded-t-lg max-md:rounded-t-0">
            <div className="mb-2">
                <SymOutline className="size-12" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="col-span-2 lg:col-span-1">
                    <div className="font-bold">COMPA</div>

                    <div className="text-secondary mb-2">
                        An open initiative to promote collaboration and
                        knowledge sharing among students of higher education.
                    </div>

                    <div className="flex gap-4">
                        <a
                            className="inline-flex items-center rounded-lg gap-2 px-2 py-1 bg-zinc-200 dark:bg-neutral-700 dark:bg-opacity-50 font-medium"
                            href={GITHUB_URL}
                        >
                            <div className="i-lucide-github"></div>
                            Source code
                        </a>

                        <div className="flex gap-2 items-center text-secondary">
                            <div className="size-2 rounded-full bg-green-500"></div>
                            All systems green
                        </div>
                    </div>
                </div>

                <div className="lg:col-start-3 col-span-1">
                    <header className="font-bold">Project</header>

                    <ul className="text-secondary">
                        {projectLinks.map((link) => (
                            <li key={link.href}>
                                <a className="hover:underline" href={link.href}>
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
}

export { Footer };
