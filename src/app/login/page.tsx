import { Suspense } from 'react';
import PageLayout from '@/components/PageLayout';
import LoginClient from './LoginClient';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <PageLayout>
      <Suspense fallback={<div className="text-gray-400 p-8">Loading…</div>}>
        <LoginClient />
      </Suspense>
    </PageLayout>
  );
}
