import { createEffect, For, onMount } from 'solid-js';
import { registerKeys } from '../game/keybinds';
import { type FrameName, addFighter, getRoomState } from '../game/state';
import {
	groundDetection,
	gravity,
	move,
	kickDetection,
} from '../fighter/interactions';

const WIDTH = 64;
const DEBUG = false;

interface Props {
	name: string;
	room: typeof import('../rooms/test-room.json');
	frameList: Record<FrameName, string>;
	keybinds: Parameters<typeof registerKeys>[0];
}

export default function Fighter({ name, room, frameList, keybinds }: Props) {
	const fighter = addFighter(name, WIDTH);

	const {
		xpos: [x],
		ypos: [y, setY],
		direction: [dir],
		vSpeed: [vSpeed, setVSpeed],
		isMoving: [isMoving],
		isMidair: [isMidair],
		isKicking: [isKicking],
		frame: [frame],
	} = fighter;

	const executeFrame = () => {
		if (isMoving()) move(fighter);
		setY(y() + vSpeed());
		if (isMidair()) gravity([vSpeed, setVSpeed]);
		groundDetection(fighter, room, WIDTH);
		kickDetection(fighter, getRoomState());
	};

	setInterval(executeFrame, 10);

	onMount(() => {
		registerKeys(keybinds, fighter);
	});

	if (DEBUG) {
		createEffect(() => {
			console.log(name, 'kicking?', isKicking());
		});
		createEffect(() => {
			console.log(name, 'midair?', isMidair());
		});
		createEffect(() => {
			console.log(name, 'moving?', isMoving());
		});
		createEffect(() => {
			console.log('frame for', name, frame());
		});
	}

	const frameNames = Object.keys(frameList) as (keyof typeof frameList)[];

	return (
		<>
			<For each={frameNames}>
				{(frameName: keyof typeof frameList) => (
					<img
						class="absolute"
						style={{
							transform: `translate(${x()}px, -${y()}px) rotateY(${dir() === 'right' ? '0deg' : '180deg'
								})`,
							opacity: frame() === frameName ? '1' : '0',
						}}
						src={frameList[frameName]}
						alt=""
						width={WIDTH}
						height={WIDTH}
					/>
				)}
			</For>
		</>
	);
}
