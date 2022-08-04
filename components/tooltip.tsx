import type { ReactNode } from "react";

export default function Tooltip(props: {
  text: string;
  children?: ReactNode;
  className?: string;
}) {
  if (props.children) {
    return (
      <div className={"relative " + props.className}>
        <div className="peer ">{props.children}</div>
        <div className="invisible absolute -bottom-9 right-0 left-0 mx-auto w-max max-w-sm -translate-y-1 scale-0 rounded-lg bg-gray-400/20 px-2 py-0.5 text-sm font-medium text-gray-800 ring-1 ring-gray-800/20 backdrop-blur transition duration-75 ease-in-out peer-hover:visible peer-hover:translate-y-0 peer-hover:scale-100">
          {props.text}
        </div>
      </div>
    );
  } else {
    return null;
  }
}
