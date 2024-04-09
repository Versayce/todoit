import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/options';
import { User } from './userInfo';

export default async function Home() {
	const session = await getServerSession(authOptions);

	return (
		<main className="flex flex-col items-center justify-center gap-10">
			<h1 className='text-2xl font-bold mt-10'>Server Data</h1>
			<pre>{JSON.stringify(session, null, '    ')}</pre>
			<User />
		</main>
	) as JSX.Element;
}
