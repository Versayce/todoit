'use client';

import { useSession } from 'next-auth/react';
import { useAppSelector } from '@/lib/store';

export const User = () => {
	const { data: session } = useSession();
	const projectId = useAppSelector((state) => state.project.value.id);

	return <pre>{JSON.stringify(session)}</pre>;
};
