export interface Character {
	name: string;
	frameList: {
		neutral: string;
		move1: string;
		move2: string;
		kick: string;
	};
}

export type CharacterKey = keyof typeof characters;

export const characters = {
	Kicko: {
		name: 'Kicko',
		frameList: {
			neutral: '/pixil-f0.png',
			move1: '/pixil-f1.png',
			move2: '/pixil-f2.png',
			kick: '/pixil-f3.png',
		},
	},
	TonyOnion: {
		name: 'Tony Onion',
		frameList: {
			neutral: '/tonyonion-f0.png',
			move1: '/tonyonion-f1.png',
			move2: '/tonyonion-f2.png',
			kick: '/tonyonion-f3.png',
		},
	},
} satisfies Record<string, Character>;
