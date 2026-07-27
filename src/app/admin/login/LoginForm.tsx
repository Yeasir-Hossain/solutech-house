'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { login, type LoginState } from '../actions';
import { COMPANY } from '@/lib/site';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="sh-btn sh-btn--primary" disabled={pending}>
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  );
}

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(login, {});

  return (
    <div className="sh-login">
      <div className="sh-login__card">
        <div className="sh-admin__brand" style={{ marginBottom: 18 }}>
          {COMPANY.logo.first}
          <span>{COMPANY.logo.second}</span>
        </div>
        <h1>Submissions</h1>
        <p className="sh-admin__sub">Sign in to view valuation enquiries.</p>

        {state.error ? (
          <p className="sh-error" role="alert">
            {state.error}
          </p>
        ) : null}

        <form action={formAction}>
          <input type="hidden" name="next" value={next} />
          <label className="sh-field">
            <span>Username</span>
            <input
              type="text"
              name="username"
              autoComplete="username"
              required
              autoFocus
              autoCapitalize="none"
              spellCheck={false}
            />
          </label>
          <label className="sh-field">
            <span>Password</span>
            <input type="password" name="password" autoComplete="current-password" required />
          </label>
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
