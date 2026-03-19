import { SignIn } from '@clerk/nextjs';

export default function MasukPage() {
  return (
    <div className="w-full max-w-md">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-heading font-bold text-2xl text-[#1E3A8A] mb-1">
          Masuk ke HOLANU
        </h1>
        <p className="text-slate-500 text-sm font-sans">
          Belum punya akun?{' '}
          <a href="/daftar" className="text-[#1D4ED8] font-semibold hover:underline">
            Daftar gratis
          </a>
        </p>
      </div>

      {/* Clerk SignIn form */}
      <SignIn
        routing="hash"
        appearance={{
          elements: {
            rootBox:                  'w-full',
            card:                     'shadow-sm border border-[#BFDBFE] rounded-2xl w-full',
            headerTitle:              'hidden',
            headerSubtitle:           'hidden',
            socialButtonsBlockButton: 'border border-[#BFDBFE] hover:bg-[#EFF6FF] font-sans text-sm',
            formButtonPrimary:        'bg-[#1D4ED8] hover:bg-[#1E40AF] font-sans font-semibold',
            footerActionLink:         'text-[#1D4ED8] hover:underline font-semibold',
            formFieldInput:           'border-[#BFDBFE] focus:border-[#1D4ED8] font-sans text-sm rounded-xl',
            formFieldLabel:           'text-[#1E3A8A] font-semibold text-xs font-sans',
            identityPreviewEditButton:'text-[#1D4ED8]',
            formResendCodeLink:       'text-[#1D4ED8]',
          },
        }}
      />
    </div>
  );
}
