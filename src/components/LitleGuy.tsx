import { createSignal, For, onMount } from 'solid-js';

type Dir = 'left' | 'right';

export default function LitleGuy() {
	const [imgPos, setImgPos] = createSignal(0);
	const [moveFrame, setMoveFrame] =
		createSignal<keyof typeof frames>('neutral');
	const [dir, setDir] = createSignal<Dir>('right');
	let locked = false;
	let moving = false;

	const executeFrame = () => {
		if (moving) move(dir());
	};

	setInterval(executeFrame, 10);

	const frames = {
		neutral: '/pixil-f0.png',
		move1: '/pixil-f1.png',
		move2: '/pixil-f2.png',
		kick: '/pixil-f3.png',
	};

	const move = (dir: Dir) => {
		const moveDist = dir === 'left' ? -10 : 10;
		setDir(dir);
		setImgPos(imgPos() + moveDist);
		if (!locked) {
			if (moveFrame() === 'move2') setMoveFrame('move1');
			else setMoveFrame('move2');
			locked = true;
			setTimeout(() => (locked = false), 100);
		}
	};

	const registerKeys = (
		keys: Record<string, { up: () => void; down: () => void }>
	) => {
		window.addEventListener('keydown', (e) => keys[e.key]?.down());
		window.addEventListener('keyup', (e) => keys[e.key]?.up());
	};

	onMount(() => {
		registerKeys({
			ArrowRight: {
				up: () => {
					moving = false;
				},
				down: () => {
					setDir('right');
					moving = true;
				},
			},
			ArrowLeft: {
				up: () => {
					moving = false;
				},
				down: () => {
					setDir('left');
					moving = true;
				},
			},
		});
	});

	return (
		<>
			<For each={Object.keys(frames)}>
				{(frame) => (
					<img
						class="absolute"
						style={{
							transform: `translateX(${imgPos()}px) rotateY(${
								dir() === 'right' ? '0deg' : '180deg'
							})`,
							visibility: moveFrame() === frame ? 'visible' : 'hidden',
						}}
						src={frames[moveFrame()]}
						alt=""
						width={128}
						height={128}
					/>
				)}
			</For>
		</>
	);
}
