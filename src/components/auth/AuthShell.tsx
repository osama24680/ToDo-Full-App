import { ReactNode } from "react";
import { BoltIcon, CheckIcon, LogoMark, ShieldIcon, SparkIcon } from "../ui/Icons";

interface IProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

const features = [
  { Icon: BoltIcon, text: "Instant sync with a Strapi 5 REST API" },
  { Icon: ShieldIcon, text: "JWT authentication & protected routes" },
  { Icon: SparkIcon, text: "Smart caching with TanStack Query" },
];

const previewTodos = [
  { title: "Ship the new landing page", done: true },
  { title: "Review pull request #42", done: true },
  { title: "Plan next sprint", done: false },
];

/** Split-screen frame shared by the login and register pages. */
const AuthShell = ({ title, subtitle, children, footer }: IProps) => {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* ---------- Brand panel ---------- */}
      <aside className="bg-grid relative hidden overflow-hidden border-r border-white/[0.06] bg-ink-950 p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-aqua/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-violet/25 blur-[120px]" />

        <div className="relative flex items-center gap-3">
          <LogoMark />
          <span className="text-xl font-bold tracking-tight text-white">Taskflow</span>
        </div>

        <div className="relative space-y-10">
          <div>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white">
              Organize your work,
              <br />
              <span className="text-brand">one task at a time.</span>
            </h2>
            <p className="mt-4 max-w-md text-slate-400">
              A fast, focused todo app — create, edit, and track everything that matters in one clean space.
            </p>
          </div>

          {/* floating preview of the app */}
          <div className="surface w-full max-w-sm animate-float p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Today</span>
              <span className="rounded-full bg-aqua/10 px-2.5 py-0.5 text-xs font-semibold text-aqua">2 / 3 done</span>
            </div>
            <ul className="space-y-2.5">
              {previewTodos.map((t) => (
                <li key={t.title} className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-3 py-2.5">
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-md ${
                      t.done ? "bg-brand text-ink-900" : "ring-1 ring-inset ring-white/20"
                    }`}
                  >
                    {t.done && <CheckIcon width={12} height={12} strokeWidth={3.5} />}
                  </span>
                  <span className={`text-sm ${t.done ? "text-slate-500 line-through" : "text-slate-200"}`}>
                    {t.title}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
              <div className="h-full w-2/3 rounded-full bg-brand" />
            </div>
          </div>

          <ul className="space-y-3">
            {features.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-aqua ring-1 ring-inset ring-white/10">
                  <Icon width={16} height={16} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-slate-600">© {new Date().getFullYear()} Taskflow · Built by Osama Megahed</p>
      </aside>

      {/* ---------- Form panel ---------- */}
      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <LogoMark className="h-8 w-8" />
            <span className="text-lg font-bold text-white">Taskflow</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
          <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 text-center text-sm text-slate-400">{footer}</div>
        </div>
      </section>
    </div>
  );
};

export default AuthShell;
