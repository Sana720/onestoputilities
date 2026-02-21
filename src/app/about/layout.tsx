import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us | Our Legacy & Vision',
    description: 'Learn about TraderG Wealth\'s 15-year legacy of market dominance, our regulatory compliance, and our mission to redefine wealth creation.',
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
