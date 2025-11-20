import GithubIcon from '@/components/icons/github-icon';
import GoogleIcon from '@/components/icons/google-icon';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';

export default function SocialButtons() {
  const [processing, setProcessing] = useState({
    google: false,
    github: false,
  });

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="bg-border h-px w-full"></div>
        </div>
        или
        <div className="flex-1">
          <div className="bg-border h-px w-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={processing.google || processing.github}
          onClick={() => {
            setProcessing({ ...processing, google: true });
            window.location.href = route('auth.google.redirect');
          }}
        >
          <GoogleIcon className="size-4" />
          Google
          {processing.google && <Spinner />}
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={processing.github || processing.google}
          onClick={() => {
            setProcessing({ ...processing, github: true });
            window.location.href = route('auth.github.redirect');
          }}
        >
          <GithubIcon className="size-4" />
          Github
          {processing.github && <Spinner />}
        </Button>
      </div>
    </>
  );
}
