import { NavLink } from "@remix-run/react"
import clsx from "clsx"

const links = [
  {
    title: "Timetable",
    href: "/timetable",
  },
  {
    title: "Discussions",
    href: "/discussions",
  },
]

function Navbar() {
  return (
    <header className="py-2 container mx-auto border-b border-zinc-300 dark:border-neutral-700 mb-5">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="flex gap-4 items-center">
            <div>
              <img src="/sym.svg" width={40} className="inline" alt="Compa" />
              {/* <span className="text-sm capitalize bg-lime-600 text-white rounded-md px-2 font-medium rounded-bl-0">
                KNUST
              </span> */}
            </div>

            <nav>
              <ul className="flex gap-2">
                {links.map((link) => (
                  <NavLink
                    to={link.href}
                    key={link.href}
                    className={({ isActive }) =>
                      clsx(
                        "px-2 py-1 hover:bg-zinc-200 dark:hover:bg-neutral-800 rounded-lg font-medium",
                        { "!bg-blue-600 !text-white": isActive }
                      )
                    }
                  >
                    {link.title}
                  </NavLink>
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
