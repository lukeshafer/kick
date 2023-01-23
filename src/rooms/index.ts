import type { JSX } from "solid-js/jsx-runtime";

export const testRoom = {
	room: {
		width: 1000,
		height: 500,
		background: 'lime',
	} satisfies CSSProperties,
	platforms: [
		{
			left: 100,
			width: 90,
			bottom: 150,
			height: 10,
			background: 'black',
		},
		{
			left: 800,
			width: 90,
			bottom: 150,
			height: 10,
			background: 'black',
		},
		{
			left: 400,
			width: 90,
			bottom: 8,
			height: 10,
			background: 'black',
		},
		{
			left: 500,
			width: 90,
			bottom: 54,
			height: 10,
			background: 'black',
		},
	]satisfies CSSProperties[],
} satisfies RoomData;

export interface RoomData {
	room: Room;
	platforms: Platform[];
}

interface Room {
	width: number;
	height: number;
	background: string;
}

interface Platform extends CSSProperties {
	left: number;
	width: number;
	bottom: number;
	height: number;
	background: string;
}

type CSSProperties = Partial<Record<keyof JSX.CSSProperties, string | number>>;
