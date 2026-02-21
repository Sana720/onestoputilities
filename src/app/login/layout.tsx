import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login | Client & Admin Dashboard',
    description: 'Sign in to your TraderG Wealth account to track your investment portfolio, dividends, and investment agreements.',
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
