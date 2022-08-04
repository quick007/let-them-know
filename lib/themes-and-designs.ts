const bGradient: Design = {
  name: "Blurry Gradient",
  path: "/blurry-gradient.svg",
	id: 0
};

export const types: Theme[] = [
  {
    name: "Graduation",
    iconPath: "/cap.svg",
    id: 0,
    designs: [bGradient],
  },
];

export interface Theme {
  name: string;
  id: number;
  iconPath?: string;
  designs: Design[];
}

export interface Design {
  name: string;
	id: number
  path: string;
}
