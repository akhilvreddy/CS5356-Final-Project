import { Suspense } from 'react';
import PageLayout from '@/components/PageLayout';
import SignupClient from './SignupClient';

export const dynamic = 'force-dynamic';

export default function SignupPage() {
  return (
    <PageLayout>
      <Suspense fallback={<div className="text-gray-400 p-8">Loading…</div>}>
        <SignupClient />
      </Suspense>
    </PageLayout>
  );
}