/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,jsx}',
		'./components/**/*.{js,jsx}',
		'./app/**/*.{js,jsx}',
		'./src/**/*.{js,jsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			// Colours derived from the HANS AMONN AG logo navy #1F497D (hue 213°).
			colors: {
				// Neutrals tinted towards the logo hue, so greys sit with the navy instead of against it.
				// 400 stays dark enough for small text (WCAG AA 4.5:1 on white and on the light surface).
				gray: {
					50:  '#F6F8FA',
					100: '#EDF0F3',
					200: '#DFE3E8',
					300: '#C7CED6',
					400: '#5E6875',
					500: '#56606C',
					600: '#454E5A',
					700: '#343C47',
					800: '#222A35',
					900: '#141B25',
				},
				blue: {
					50:  '#F2F6FA',
					100: '#E6ECF5',
					200: '#C9D7E8',
					300: '#9CB5D3',
					400: '#628ABC',
					500: '#38669F',
					600: '#1F497D', // ← logo navy (primary action colour)
					700: '#173963',
					800: '#122944',
					900: '#0D1B2B',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			fontFamily: {
				sans: ['"Source Sans 3 Variable"', '"Source Sans 3"', '"Segoe UI"', 'system-ui', '-apple-system', 'sans-serif'],
				display: ['"Source Sans 3 Variable"', '"Source Sans 3"', '"Segoe UI"', 'system-ui', 'sans-serif'],
				// Plan labels, measurements and codes: the monospaced member of the same family
				mono: ['"Source Code Pro Variable"', '"Source Code Pro"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
			},
			letterSpacing: {
				'hairline': '0.14em',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
