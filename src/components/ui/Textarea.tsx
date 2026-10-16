import { TextareaHTMLAttributes } from "react";

interface IProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = ({ ...rest }: IProps) => {
  return (
    <textarea
      className="w-full resize-none rounded-xl border border-white/10 bg-ink-850/80 px-4 py-3 text-sm leading-relaxed text-white placeholder:text-slate-500 outline-none transition focus:border-violet/60 focus:ring-4 focus:ring-violet/15"
      rows={5}
      {...rest}
    />
  );
};

export default Textarea;
