import type { Fighter } from './state';

interface Action {
	up?: () => void;
	down?: () => void;
}

type ActionName = 'LEFT' | 'RIGHT' | 'JUMP' | 'KICK';

type KeyActions = Record<ActionName, Action>;

export const registerKeys = (
	keys: Record<string, ActionName>,
	fighter: Fighter
) => {
	const [, setIsMoving] = fighter.isMoving;
	const [, setDir] = fighter.direction;
	const [, setFrame] = fighter.frame;
	const [, setVSpeed] = fighter.vSpeed;
	const [, setHTargetSpeed] = fighter.hTargetSpeed;
	const [isMidair, setIsMidair] = fighter.isMidair;
	const [isKicking, setIsKicking] = fighter.isKicking;

	const keyActions: KeyActions = {
		RIGHT: {
			up: () => {
				setIsMoving(false);
				setHTargetSpeed(0);
				setFrame('neutral');
			},
			down: () => {
				setDir('right');
				setIsMoving(true);
			},
		},
		LEFT: {
			up: () => {
				setIsMoving(false);
				setHTargetSpeed(0);
				setFrame('neutral');
			},
			down: () => {
				setDir('left');
				setIsMoving(true);
			},
		},
		KICK: {
			down: () => {
				if (!isKicking()) {
					setFrame('kick');
					setIsKicking(true);
					setTimeout(() => {
						setIsKicking(false);
						setFrame('neutral');
					}, 500);
				}
			},
		},
		JUMP: {
			down: () => {
				if (!isMidair()) {
					setIsMidair(true);
					setVSpeed(10);
				}
			},
		},
	};

	window.addEventListener('keydown', (e) => {
		const actionName = keys[e.key.toUpperCase()];
		if (!actionName) return;

		const key = keyActions[actionName];
		if (key?.down) key.down();
	});

	window.addEventListener('keyup', (e) => {
		const actionName = keys[e.key.toUpperCase()];
		if (!actionName) return;

		const key = keyActions[actionName];
		if (key?.up) key.up();
	});
};
