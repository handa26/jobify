import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

import './globals.css';

const manrope = Manrope({
	subsets: ['latin'],
	weight: ['400', '500', '700'],
	variable: '--font-manrope', // Defines the CSS variable for Tailwind
	display: 'swap', // Prevents layout shifts
});

export const metadata: Metadata = {
	title: 'Jobify',
	description: 'Manage & tracking your countless job applications',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
	return (
		<html
			lang="en"
			className={`${manrope.variable} h-full antialiased`}
			suppressHydrationWarning
		>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
