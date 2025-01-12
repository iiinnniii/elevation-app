// utils
import { twMerge } from 'tailwind-merge';

// types
import type React from 'react';

export const Input = (props: React.ComponentProps<'input'>) => {
	return (
		<input
			{...props}
			className={twMerge(
				'rounded-full border-[1px] border-solid border-gray-200 px-2 focus:outline-none dark:border-gray-700 dark:bg-gray-800',
				props.className,
			)}
		/>
	);
};

Input.displayName = 'Input';
