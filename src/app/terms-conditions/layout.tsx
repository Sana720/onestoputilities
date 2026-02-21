import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Conditions | Regulatory Framework',
    description: 'Comprehensive overview of our operational processes, user agreements, and risk disclosures at TraderG Wealth.',
};

export default function TermsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
