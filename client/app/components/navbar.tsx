import { NavLink } from "@remix-run/react"
import clsx from "clsx"

const links = [
  {
    title: "Discussions",
    href: "/discussions",
  },
  {
    title: "Timetable",
    href: "/timetable",
  },
]

function Navbar() {
  return (
    <header className="py-2 container mx-auto bg-zinc-100 dark:bg-neutral-800 lg:rounded-xl lg:mt-2 mb-5 max-lg:rounded-b-lg max-md:rounded-b-0">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="flex gap-4 items-center">
            <a className="block shrink-0" href="/">
              <img src="/sym.svg" width={32} className="inline" alt="Compa" />
            </a>

            <nav>
              <ul className="flex gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <NavLink
                      to={link.href}
                      className={({ isActive }) =>
                        clsx(
                          "px-2 py-1 hover:bg-zinc-200 dark:hover:bg-neutral-800 rounded-lg font-medium dark:text-white",
                          { "!bg-blue-600 !text-white dark:!text-black": isActive }
                        )
                      }
                    >
                      {link.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

export { Navbar }
