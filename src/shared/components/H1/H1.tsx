// utils
import { twMerge } from 'tailwind-merge';

// types
import type React from 'react';

export const H1 = (props: React.ComponentProps<'h1'>) => {
	return <h1 {...props} className={twMerge('text-4xl', props.className)} />;
};

H1.displayName = 'H1';
