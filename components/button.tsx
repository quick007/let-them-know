import type { ReactNode } from "react";

export default function Button(props: {
  color: "cyan" | "light-cyan";
  use: "primary" | "secondary" | "tertiary";
  className?: string;
  onClick?: () => void;
  children: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset"
  
}) {
  let color: string = "";
  switch (props.color) {
    case "cyan":
      color =
        "bg-cyan-600 hover:bg-cyan-700 text-gray-50 hover:text-gray-100 disabled:bg-cyan-700 disabled:text-gray-300";
break;
        case "light-cyan":
      color =
        " text-gray-700/80 hover:bg-cyan-700/10 hover:text-gray-700 disabled:bg-cyan-700 disabled:text-gray-300 ring ring-cyan-700/50";
        break;
  }
  
  let use: string = "";
  switch (props.use) {
    case "primary":
      use = "px-7 py-2";
      break;
    case "secondary":
      use = " px-4 py-1.5";
      break;

    case "tertiary":
      use = "text-sm px-3 py-1";
      break;
  }
  return (
    <button
      className={`${use} ${props.className} ${color} rounded-md font-medium transition focus:outline-none`}
      onClick={props.onClick}
      disabled={props.disabled || false}
      type={props.type}
    >
      {props.children}
    </button>
  );
}
