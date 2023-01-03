import { createSignal, Signal } from 'solid-js';

export type Dir = 'left' | 'right';

export type FrameName = 'neutral' | 'move1' | 'move2' | 'kick';

export interface RoomState {
	fighters: Fighter[];
}
const roomState: RoomState = { fighters: [] };

export const getRoomState = () => roomState;

export interface Fighter {
	name: string;
	index: Symbol;
	isMoving: Signal<boolean>;
	isMidair: Signal<boolean>;
	isKicking: Signal<boolean>;
	direction: Signal<Dir>;
	frame: Signal<FrameName>;
	xpos: Signal<number>;
	ypos: Signal<number>;
	vSpeed: Signal<number>;
	platform: Signal<undefined | Record<Dir, number>>;
	width: number;
}

export const addFighter = (name: string, width: number): Fighter => {
	const kicking = createSignal(false);
	const fighter: Fighter = {
		name,
		index: Symbol(),
		isMoving: createSignal(false),
		isMidair: createSignal(false),
		isKicking: kicking,
		direction: createSignal<Dir>('right'),
		frame: createSignal<FrameName>('neutral', {
			equals: (o, n) => o === n || kicking[0](),
		}),
		xpos: createSignal(0),
		ypos: createSignal(0),
		vSpeed: createSignal(0),
		platform: createSignal<undefined | { left: number; right: number }>(),
		width,
	};
	roomState.fighters.push(fighter);
	return fighter;
};
