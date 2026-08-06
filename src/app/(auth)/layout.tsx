import { CampusWatermark } from '@/components/marketing/campus-watermark';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-[#0055A2]/5 via-background to-[#E5A823]/5">
      <CampusWatermark />
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
