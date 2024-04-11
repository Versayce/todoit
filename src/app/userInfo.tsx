'use client';

import { signOut, useSession } from 'next-auth/react';
import { useAppSelector } from '@/lib/store';
import { fetchAllProjects } from '@/lib/features/project/projectThunks';
import { useAppDispatch } from '@/lib/hooks';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const User = () => {
	const { data: session } = useSession();
	const projects = useAppSelector((state) => state.project.allProjects);
	const dispatch = useAppDispatch();
	const router = useRouter();

	useEffect(() => {
		if (session?.user) {
			dispatch(fetchAllProjects(session?.user.id));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session?.user]);

	return (
		<div className="flex flex-col items-center justify-center gap-2">
			{session && (
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					onClick={() => signOut()}
				>
					Sign Out
				</button>
			)}
			{!session && (
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					onClick={() => {
						router.push('/signin');
					}}
				>
					Sign In
				</button>
			)}
			<h1 className="text-2xl font-bold mt-10">session:</h1>
			<pre className="text-sm">
				{JSON.stringify(session?.user, null, '    ')}
			</pre>

			<h1 className="text-2xl font-bold mt-10">all projects:</h1>
			<pre className="text-sm">
				{JSON.stringify(projects, null, '    ')}
			</pre>

		</div>
	);
};
