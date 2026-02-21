import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Apply for Investment Allocation',
    description: 'Start your investment journey with TraderG Wealth. Apply for Intraday Trading, SIP, or Unlisted Shares through our secure portal.',
};

export default function ApplyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
