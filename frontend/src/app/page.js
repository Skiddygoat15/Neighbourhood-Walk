import Head from 'next/head';
import Link from 'next/link';

import { redirect } from 'next/navigation';

export default function Home() {
    redirect('/registration-login-coverpage');
    return null;
}
