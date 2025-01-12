// utils
import { twMerge } from 'tailwind-merge';

// types
import type React from 'react';

export const ActionButton = (props: React.ComponentProps<'button'>) => {
	return (
		<button
			{...props}
			className={twMerge(
				'rounded-full border border-action bg-action px-5 text-white hover:border-action-darkened hover:bg-action-darkened focus-visible:outline-0',
				props.className,
			)}
		>
			{props.children}
		</button>
	);
};

ActionButton.displayName = 'ActionButton';
