'use client'

import React, { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export type SignInErrorTypes =
  | "Signin"
  | "OAuthSignin"
  | "OAuthCallback"
  | "OAuthCreateAccount"
  | "EmailCreateAccount"
  | "Callback"
  | "OAuthAccountNotLinked"
  | "EmailSignin"
  | "CredentialsSignin"
  | "SessionRequired"
  | "default";

const errors: Record<SignInErrorTypes, string> = {
    Signin: "Try signing in with a different account.",
    OAuthSignin: "Try signing in with a different account.",
    OAuthCallback: "Try signing in with the same account you used originally.",
    OAuthCreateAccount: "Try signing in with a different account.",
    EmailCreateAccount: "Try signing in with a different account.",
    Callback: "Try signing in with a different account.",
    OAuthAccountNotLinked: "To confirm your identity, sign in with the same account you used originally.",
    EmailSignin: "The e-mail could not be sent.",
    CredentialsSignin: "Sign in failed. Check the details you provided are correct.",
    SessionRequired: "Please sign in to access this page.",
    default: "Unable to sign in.",
};

const SignInPage = (): React.ReactNode => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const searchParams = useSearchParams();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const res = await signIn('credentials', { 
            email, 
            password, 
            redirect: false
        });
        if (!res?.error) {
            window.location.href = '/';
        } else {
            setError(res.error);
        }
    };

    const githubSignIn = async () => {
        signIn('github', { redirect: true, callbackUrl: '/' })
    };

    const googleSignIn = async () => {
        signIn('google', { redirect: true, callbackUrl: '/' })
    };

    useEffect(() => {
        if (searchParams.has('error')) {
            if (typeof searchParams.get('error') === 'string') {
                const errorType = searchParams.get('error') as SignInErrorTypes;
                setError(errors[errorType]);
            } else {
                const errorType = searchParams.getAll('error') as SignInErrorTypes[];
                setError(errors[errorType[0]]);
            }
        }
    }, [searchParams]);

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-200">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email:
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password:
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    {error ? 
                        <p className="flex flex-col items-center w-full h-3 text-red-600">{error}</p> 
                        : <p className="flex flex-col items-center w-full h-3"></p>
                    }
                </div>
                <div className="flex items-center justify-center">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Sign In
                    </button>
                </div>
            </form>
            <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-3 rounded focus:outline-none focus:shadow-outline" 
                onClick={githubSignIn}
            >
                Sign In with GitHub
            </button>
            <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-3 rounded focus:outline-none focus:shadow-outline" 
                onClick={googleSignIn}
            >
                Sign In with Google
            </button>
        </div>
    );
};

export default SignInPage;
