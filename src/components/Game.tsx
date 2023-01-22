import type { RoomData } from '../rooms';
import { characters, type CharacterKey } from '../characters';
import { For } from 'solid-js';
import Fighter from '../fighter';

type NumToString<T> = {
	[key in keyof T]: T[key] extends number ? string : T[key];
};

function numberToPx<T extends Record<string, any>>(orig: T): NumToString<T> {
	const keys: (keyof T)[] = Object.keys(orig);
	const entries = keys.map((key): [key: keyof T, value: string | T[keyof T]] => {
		const value = typeof orig[key] === 'number' ? `${orig[key]}px` : orig[key];
		return [key, value];
	});
	return Object.fromEntries(entries) as NumToString<T>;
}

interface Props {
	characterList: CharacterKey[];
	room: RoomData;
}

const KEYBINDS = [
	{ J: 'LEFT', L: 'RIGHT', I: 'JUMP', K: 'KICK' },
	{ S: 'LEFT', F: 'RIGHT', E: 'JUMP', D: 'KICK' },
] as const;

export default function Game({ characterList, room: roomData }: Props) {
	const { room, platforms } = roomData;
	const styledRoom = numberToPx(room);

	return (
		<div class="flex relative items-end" style={styledRoom}>
			{platforms.map((platform) => (
				<div
					class="absolute"
					style={{
						left: `${platform.left}px`,
						bottom: `${platform.bottom}px`,
						height: `${platform.height}px`,
						width: `${platform.width}px`,
						background: platform.background || 'black',
					}}
				/>
			))}
			<For each={characterList}>
				{(key, index) => {
					const { name, frameList } = characters[key];
					return (
						<Fighter
							name={name}
							room={{ room, bounds: room, platforms }}
							frameList={frameList}
							keybinds={KEYBINDS[index() % KEYBINDS.length]!}
						/>
					);
				}}
			</For>
		</div>
	);
}
