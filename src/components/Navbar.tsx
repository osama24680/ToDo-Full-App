import { NavLink, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { HomeIcon, ListIcon, LogoMark, LogoutIcon } from "./ui/Icons";

const links = [
  { to: "/", label: "My todos", Icon: HomeIcon, end: true },
  { to: "/todos", label: "All todos", Icon: ListIcon, end: false },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const username: string = userData?.user?.username ?? "You";

  const onLogout = () => {
    localStorage.removeItem(storageKey);
    toast.success("Logged out — see you soon!");
    setTimeout(() => {
      location.replace(pathname);
    }, 1500);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink-900/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2.5">
          <LogoMark className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight text-white">Taskflow</span>
        </NavLink>

        <ul className="flex items-center gap-1 rounded-xl bg-white/[0.04] p-1 ring-1 ring-inset ring-white/[0.06]">
          {links.map(({ to, label, Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    isActive ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white"
                  }`
                }
              >
                <Icon width={16} height={16} />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-xl px-2 py-1 md:flex">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-sm font-bold uppercase text-ink-900">
              {username.charAt(0)}
            </span>
            <span className="max-w-[120px] truncate text-sm font-medium text-slate-300">{username}</span>
          </span>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 ring-1 ring-inset ring-white/10 transition hover:bg-rose-500/10 hover:text-rose-300 hover:ring-rose-500/30"
          >
            <LogoutIcon width={16} height={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
