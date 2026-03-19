import { ForgotPassword } from '@clerk/nextjs';

export default function LupaPasswordPage() {
  return (
    <div className="w-full max-w-md">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-heading font-bold text-2xl text-[#1E3A8A] mb-1">
          Lupa Password?
        </h1>
        <p className="text-slate-500 text-sm font-sans">
          Masukkan email kamu — kami kirimkan link reset password
        </p>
      </div>

      {/* Clerk ForgotPassword form */}
      <ForgotPassword
        routing="hash"
        appearance={{
          elements: {
            rootBox:               'w-full',
            card:                  'shadow-sm border border-[#BFDBFE] rounded-2xl w-full',
            headerTitle:           'hidden',
            headerSubtitle:        'hidden',
            formButtonPrimary:     'bg-[#1D4ED8] hover:bg-[#1E40AF] font-sans font-semibold',
            footerActionLink:      'text-[#1D4ED8] hover:underline font-semibold',
            formFieldInput:        'border-[#BFDBFE] focus:border-[#1D4ED8] font-sans text-sm rounded-xl',
            formFieldLabel:        'text-[#1E3A8A] font-semibold text-xs font-sans',
          },
        }}
      />

      <p className="text-center text-sm text-slate-400 font-sans mt-4">
        Ingat password?{' '}
        <a href="/masuk" className="text-[#1D4ED8] font-semibold hover:underline">
          Kembali masuk
        </a>
      </p>
    </div>
  );
}
