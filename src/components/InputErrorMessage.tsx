import { AlertIcon } from "./ui/Icons";

interface IProps {
  msg: string;
}
const InputErrorMessage = ({ msg }: IProps) => {
  return msg ? (
    <span className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-400">
      <AlertIcon width={13} height={13} />
      {msg}
    </span>
  ) : null;
};

export default InputErrorMessage;
