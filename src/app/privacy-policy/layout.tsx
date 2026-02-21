import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Data Security Protocol',
    description: 'Our commitment to protecting your digital footprint and financial data integrity. Learn how TraderG Wealth manages and secures your information.',
};

export default function PrivacyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
