import type { Signal } from 'solid-js';
import type { Fighter, RoomState } from '../game/state';

let locked = false;

export const walk = (fighter: Fighter) => {
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
};

export const horizontalMotion = (fighter: Fighter) => {
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
};

export const gravity = ([vSpeed, setVSpeed]: Signal<number>) => {
	setVSpeed(vSpeed() - 0.35);
};

export const groundDetection = (
	fighter: Fighter,
	{ room, platforms }: typeof import('../rooms/test-room.json'),
	width: number
) => {
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
};

export const kickDetection = (fighter: Fighter, state: RoomState) => {
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
				((dir() === 'left' &&
					left < fRight &&
					left + FOOTWIDTH > fLeft) ||
					(dir() === 'right' &&
						right > fLeft &&
						right - FOOTWIDTH < fRight)) &&
				y() <= fy() + fHeight &&
				y() + FOOTHEIGHT >= fy()
			) {
				setHSpeed(dir() === 'left' ? -18 : 18);
			}
		});
	}
};
