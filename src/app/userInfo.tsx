'use client';

import { useSession } from 'next-auth/react';
import { useAppSelector } from '@/lib/store';
import { fetchAllProjects } from '@/lib/features/project/projectThunks';
import { useAppDispatch } from '@/lib/hooks';
import { useEffect } from 'react';

export const User = () => {
	const { data: session } = useSession();
	const projects = useAppSelector((state) => state.project.allProjects);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (session?.user) {
			dispatch(fetchAllProjects(session?.user.id));
		}
	}, [session?.user.id]);

	console.log(projects)

	return (
		<div>
			<h1>session:</h1>
			<pre>{session?.user.id}</pre>
			<h1>all projects:</h1>
			<pre>{JSON.stringify(projects)}</pre>
		</div>
	);
};
