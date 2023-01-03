import type { Signal } from 'solid-js';
import type { Fighter, RoomState } from '../game/state';

let locked = false;

export const move = (fighter: Fighter) => {
	const {
		direction: [newDir],
		frame: [frame, setFrame],
		isMidair: [, setIsMidair],
		xpos: [x, setX],
		platform: [platform, setPlatform],
	} = fighter;
	const speed = 5;
	const moveDist = newDir() === 'left' ? -speed : speed;

	if (platform() && (x() > platform()!.right || x() < platform()!.left)) {
		setIsMidair(true);
		setPlatform(undefined);
	}
	//setDir(newDir);
	setX(x() + moveDist);
	if (!locked) {
		if (frame() === 'move2') setFrame('move1');
		else setFrame('move2');
		locked = true;
		setTimeout(() => (locked = false), 100);
	}
};

export const gravity = ([vSpeed, setVSpeed]: Signal<number>) => {
	setVSpeed(vSpeed() - 0.18);
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
		platform: [, setPlatform],
	} = fighter;
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
				console.log('kick');
			}
		});
	}

	//state.fighters.forEach((f) => {
	//if (f.index === fighter.index) {
	//return;
	//}
	//if (!f.isKicking[0]()) return;
	//if (f.direction[0]() === 'left' && f.xpos[0]() < x() + width) {
	//console.log(f);
	//console.log('kick detected');
	////if (f.ypos[0]() > y() - 50 && f.ypos[0]() < y() + 50) {
	////console.log('YOU GOT KICKED');
	////}
	//}
	//});
};
