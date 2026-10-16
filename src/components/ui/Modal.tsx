import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";
interface IProps {
  isOpen: boolean;
  closeModal: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  /** optional icon shown above the title */
  icon?: ReactNode;
}
export default function Modal({ isOpen, closeModal, children, title, description, icon }: IProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-ink-950/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-ink-800 p-6 text-left shadow-2xl">
                {/* signature gradient hairline */}
                <span className="absolute inset-x-0 top-0 h-px bg-brand" />
                {icon && <div className="mb-4">{icon}</div>}
                <Dialog.Title as="h3" className="text-lg font-semibold text-white">
                  {title}
                </Dialog.Title>
                {description && <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{description}</p>}
                <div className="mt-5">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
