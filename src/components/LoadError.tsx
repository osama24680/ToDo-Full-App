import { AlertIcon } from "./ui/Icons";
import Button from "./ui/Button";

interface IProps {
  what: string;
}

/** Shown when a request fails — usually an expired or invalid session. */
const LoadError = ({ what }: IProps) => {
  const onLoginAgain = () => {
    localStorage.removeItem("loggedInUser");
    location.replace("/login");
  };

  return (
    <div className="surface flex flex-col items-center px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/15 text-rose-400 ring-1 ring-inset ring-rose-500/30">
        <AlertIcon width={24} height={24} />
      </span>
      <h2 className="mt-5 text-lg font-semibold text-white">Couldn't load {what}</h2>
      <p className="mt-1 max-w-sm text-sm text-slate-400">
        Your session may have expired, or the server is unreachable. Log in again to continue.
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="cancel" size="sm" onClick={() => location.reload()}>
          Retry
        </Button>
        <Button size="sm" onClick={onLoginAgain}>
          Log in again
        </Button>
      </div>
    </div>
  );
};

export default LoadError;
