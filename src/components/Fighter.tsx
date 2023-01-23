import { createEffect, For, onMount, type Signal } from 'solid-js';
import { registerKeys } from '../game/keybinds';
import {
	type FrameName,
	type RoomState,
	type Fighter as FighterType,
	addFighter,
	getRoomState,
} from '../game/state';

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
		if (isMoving()) walk(fighter);
		setY(y() + vSpeed());
		if (isMidair()) gravity([vSpeed, setVSpeed]);
		horizontalMotion(fighter);

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
							transform: `translate(${x()}px, -${y()}px) rotateY(${
								dir() === 'right' ? '0deg' : '180deg'
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

// HELPERS
let locked = false;

function walk(fighter: FighterType) {
	const {
		direction: [newDir],
		frame: [frame, setFrame],
		hTargetSpeed: [, setHTargetSpeed],
	} = fighter;

	setHTargetSpeed(newDir() === 'right' ? 5 : -5);

	if (!locked) {
		if (frame() === 'move2') setFrame('move1');
		else setFrame('move2');
		locked = true;
		setTimeout(() => (locked = false), 100);
	}
}

function horizontalMotion(fighter: FighterType) {
	const ACCEL = 0.8;
	const {
		xpos: [x, setX],
		hSpeed: [hSpeed, setHSpeed],
		hTargetSpeed: [hTargetSpeed],
	} = fighter;
	if (hSpeed() < hTargetSpeed()) {
		setHSpeed(Math.min(hSpeed() + ACCEL, hTargetSpeed()));
	} else if (hSpeed() > hTargetSpeed()) {
		setHSpeed(Math.max(hSpeed() - ACCEL, hTargetSpeed()));
	}
	setX(x() + hSpeed());
}

function gravity([vSpeed, setVSpeed]: Signal<number>) {
	setVSpeed(vSpeed() - 0.35);
}

function groundDetection(
	fighter: FighterType,
	{ room, platforms }: typeof import('../rooms/test-room.json'),
	width: number
) {
	const {
		xpos: [x, setX],
		ypos: [y, setY],
		vSpeed: [vSpeed, setVSpeed],
		isMidair: [, setIsMidair],
		platform: [platform, setPlatform],
	} = fighter;
	if (platform() && (x() > platform()!.right || x() < platform()!.left)) {
		setIsMidair(true);
		setPlatform(undefined);
	}
	if (x() > room.width - width) setX(room.width - width);
	if (x() < 0) setX(0);
	if (y() > room.height - width) {
		setVSpeed(0);
		setY(room.height - width);
	}
	if (y() < 0) {
		setIsMidair(false);
		setVSpeed(0);
		setY(0);
	}

	platforms.forEach((p) => {
		if (vSpeed() < -1) {
			if (
				y() > p.bottom &&
				y() <= p.bottom + p.height &&
				x() + width > p.left &&
				x() < p.left + p.width
			) {
				setVSpeed(0);
				setIsMidair(false);
				setPlatform({ left: p.left - width, right: p.left + p.width });
			}
		}
	});
}

function kickDetection(fighter: FighterType, state: RoomState) {
	const {
		xpos: [x],
		ypos: [y],
		direction: [dir],
		isKicking: [isKicking],
		width,
		name,
	} = fighter;
	const FOOTHEIGHT = 20,
		FOOTWIDTH = 32;

	if (isKicking()) {
		const left = x();
		const right = left + width;
		state.fighters.forEach((f) => {
			if (f.name === name) return;
			const {
				xpos: [fx],
				ypos: [fy],
				hSpeed: [, setHSpeed],
				width: fwidth,
			} = f;
			const fLeft = fx();
			const fRight = fLeft + fwidth;
			const fHeight = fwidth;
			if (
				((dir() === 'left' && left < fRight && left + FOOTWIDTH > fLeft) ||
					(dir() === 'right' && right > fLeft && right - FOOTWIDTH < fRight)) &&
				y() <= fy() + fHeight &&
				y() + FOOTHEIGHT >= fy()
			) {
				setHSpeed(dir() === 'left' ? -18 : 18);
			}
		});
	}
}
