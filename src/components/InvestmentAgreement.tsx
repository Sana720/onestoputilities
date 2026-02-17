import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Svg, Path, Line, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontFamily: 'Helvetica',
        fontSize: 9,
        color: '#000',
    },
    headerWrapper: {
        paddingBottom: 2,
        marginBottom: 6,
        borderBottom: '0.5pt solid #000',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    companyName: {
        fontSize: 14,
        fontWeight: 'extrabold',
    },
    headerInfo: {
        fontSize: 8,
        lineHeight: 1.3,
    },
    logoContainer: {
        width: 80,
        alignItems: 'flex-end',
    },
    mainTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 6,
        textTransform: 'uppercase',
    },
    subTitleBox: {
        border: '0.5pt solid #000',
        alignSelf: 'center',
        padding: '2 12',
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 9,
        fontWeight: 'bold',
    },
    contentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    salutation: {
        marginTop: 6,
        marginBottom: 4,
        fontWeight: 'bold',
    },
    paragraph: {
        marginBottom: 2,
        lineHeight: 1.2,
        textAlign: 'justify',
    },
    table: {
        width: '100%',
        borderWidth: 0.5,
        borderColor: '#000',
        marginVertical: 4,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#000',
    },
    tableCell: {
        padding: 3,
        borderRightWidth: 0.5,
        borderRightColor: '#000',
        flex: 1,
    },
    bold: {
        fontWeight: 'bold',
    },
    highlightRow: {
        backgroundColor: '#fef3c7',
    },
    sectionHeading: {
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 6,
        marginBottom: 2,
    },
    signatureSection: {
        flexDirection: 'row',
        marginTop: 10,
    },
    signatureBox: {
        flex: 1,
        border: '0.5pt solid #000',
        padding: 4,
        minHeight: 50,
    },
    declarationText: {
        padding: 2,
    },
    bankDetailsHeader: {
        fontSize: 8,
        fontWeight: 'bold',
        marginBottom: 2,
        marginTop: 6,
    }
});

interface Props {
    data: any;
}

const HeaderSnippet = () => (
    <View style={styles.headerWrapper}>
        <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
                <Text style={styles.companyName}>SHREEG EXPERT WEALTH ADVISORY LIMITED</Text>
                <Text style={styles.headerInfo}><Text style={styles.bold}>Corp.Office : </Text>11WS2 Mani Casadona, Action Area 2 Rajarhat Newtown Kolkata(W.B)</Text>
                <Text style={styles.headerInfo}><Text style={styles.bold}>CIN : </Text>U74140CT2016PLC002054</Text>
                <Text style={styles.headerInfo}><Text style={styles.bold}>website : </Text>www.tradergwealth.com</Text>
                <Text style={styles.headerInfo}><Text style={styles.bold}>Email: </Text>gauravd113@gmail.com</Text>
                <Text style={styles.headerInfo}><Text style={styles.bold}>Contact: </Text>91-7044520894</Text>
            </View>
            <View style={styles.logoContainer}>
                <Image src="/shreeg_logo.png" style={{ width: 80, height: 40 }} />
            </View>
        </View>
    </View>
);

export const InvestmentAgreement = ({ data }: Props) => {
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const numberInWords = (amount: number) => {
        return `${formatCurrency(amount)} RUPEES ONLY`.toUpperCase();
    };

    const generateSerialNumber = () => {
        const dobDate = data.dob ? new Date(data.dob) : new Date();
        const birthDayMonth = `${String(dobDate.getDate()).padStart(2, '0')}${String(dobDate.getMonth() + 1).padStart(2, '0')}`;

        const initials = data.full_name
            ? data.full_name
                .split(' ')
                .filter((part: string) => part.length > 0)
                .map((part: string) => part[0])
                .join('')
                .toUpperCase()
            : 'XX';

        const paymentDate = data.payment_date ? new Date(data.payment_date) : new Date();
        const paymentDayMonth = `${String(paymentDate.getDate()).padStart(2, '0')}${String(paymentDate.getMonth() + 1).padStart(2, '0')}`;

        const currentYear = String(new Date().getFullYear()).slice(-2);

        return `SGPS/${birthDayMonth}/${initials}/${paymentDayMonth}/${currentYear}`;
    };

    return (
        <Document>
            {/* PAGE 1: APPLICATION FORM */}
            <Page size="A4" style={styles.page}>
                <HeaderSnippet />
                <Text style={styles.mainTitle}>
                    {['Intraday Trading', 'Short-Term SIP', 'Long-Term Holding'].includes(data.product_name)
                        ? 'APPLICATION FORM FOR TRADE MANAGEMENT'
                        : 'APPLICATION FORM FOR Preference bond BOND SHARES OF Rs. 100/- EACH AT PAR'}
                </Text>
                <View style={styles.subTitleBox}><Text style={styles.subTitle}>PRIVATE AND CONFIDENTIAL</Text></View>
                <View style={styles.contentRow}>
                    <View>
                        <Text>To,</Text>
                        <Text style={styles.bold}>The Board of Directors,</Text>
                        <Text>SHREEG EXPERT WEALTH ADVISORY LIMITED</Text>
                        <View style={{ marginTop: 2 }}>
                            <Text style={styles.headerInfo}>Reg. Office : Shop No. 353, Third Floor, Progressive Point Near Fruit Market Lalpur Dhamtari Road Raipur CT 492001 IN</Text>
                        </View>
                        <View style={{ marginTop: 1 }}>
                            <Text style={styles.headerInfo}>Corp.Office :11WS2 Mani Casadona, Action Area 2 Rajarhat Newtown Kolkata(W.B)</Text>
                        </View>
                    </View>
                    <View style={{ textAlign: 'right' }}>
                        <Text style={styles.bold}>Sr. No:{generateSerialNumber()}</Text>
                        <Text>Date: {formatDate(data.payment_date || new Date().toISOString())}</Text>
                    </View>
                </View>
                <Text style={styles.salutation}>Dear Sir,</Text>
                <Text style={styles.paragraph}>
                    I <Text style={styles.bold}>{data.full_name?.toUpperCase()}</Text> hereby apply for the {['Intraday Trading', 'Short-Term SIP', 'Long-Term Holding'].includes(data.product_name) ? 'Trade Management' : 'allotment of ' + formatCurrency(data.number_of_shares) + ' Preference bond Shares'} as detailed below. The {['Intraday Trading', 'Short-Term SIP', 'Long-Term Holding'].includes(data.product_name) ? 'Trade Capital' : 'application money'} is remitted herewith, {['Intraday Trading', 'Short-Term SIP', 'Long-Term Holding'].includes(data.product_name) ? '' : 'with a face value of Ps. 100/- per share.'}
                </Text>
                <Text style={styles.paragraph}>
                    I agree to accept the shares applied for, or such number as may be allotted, subject to the terms of the Memorandum and Articles of Association, the terms and conditions of the application form, and the letter of allotment of the Company, all of which are acceptable to us.
                </Text>
                <Text style={styles.paragraph}>
                    I undertake to sign all necessary documents and take any other actions required to enable me to be registered as the holder of the Preference bond Shares that may be allotted to me/us. I/We authorize the Company to place my name on the Register of Members as the holder of the shares allotted and to register my address as provided below.
                </Text>
                <Text style={styles.paragraph}>
                    I further authorize the Company, in case I/we are allotted fewer Preference bond Shares than applied for, to refund the excess application money to me.
                </Text>
                <Text style={styles.paragraph}>
                    I acknowledge that the Board of Directors has the absolute discretion to accept or reject this application, in whole or in part, without providing any reasons for such rejection.
                </Text>
                <Text style={styles.paragraph}>
                    I am an Indian national resident in India and I am not applying for the Preference bond Shares as a nominee of any person resident outside India or foreign national.
                </Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, { flex: 2 }]}>
                            <Text>
                                {data.product_name === 'Intraday Trading' ? 'Trade Management fees @1% Monthly' :
                                    data.product_name === 'Short-Term SIP' ? 'Trade Management fees @1% Quarterly' :
                                        data.product_name === 'Long-Term Holding' ? 'Trade Management fees @1% Yearly' :
                                            'Number of Shares applied for (in figure)'}
                            </Text>
                            <Text style={styles.bold}>{data.number_of_shares}</Text>
                        </View>
                        <View style={[styles.tableCell, { flex: 3 }]}><Text style={styles.bold}>{numberInWords(data.number_of_shares).replace(' RUPEES ONLY', '')}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, { flex: 4 }]}>
                            <Text>
                                {['Intraday Trading', 'Short-Term SIP', 'Long-Term Holding'].includes(data.product_name)
                                    ? `Trade Capital paid towards Management via : ${data.payment_reference}`
                                    : `Amount paid towards application & Allotment money @ Rs 100/- per share by Cheques : ${data.payment_reference}`}
                            </Text>
                            <Text style={styles.bold}>Rs.: {formatCurrency(data.investment_amount)}</Text>
                        </View>
                        <View style={[styles.tableCell, { flex: 3 }]}>
                            <Text>Drawn on (Name of the Bank & Branch) Form</Text>
                            <View style={{ padding: 2 }}><Text style={styles.bold}>{data.bank_details?.bankName}</Text></View>
                        </View>
                        <View style={[styles.tableCell, { flex: 2 }]}><Text>Date</Text><Text style={[styles.bold, { marginTop: 15 }]}>{formatDate(data.payment_date)}</Text></View>
                    </View>
                </View>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCell}><Text>PAN/PASSPORT No.</Text><Text style={styles.bold}>{data.pan_number || 'N/A'}</Text></View>
                        <View style={styles.tableCell}><Text>Issuing Authority</Text><Text style={styles.bold}>Income Tax Department</Text></View>
                    </View>
                </View>
                <Text style={styles.bankDetailsHeader}>BANK DETAILS MANDATORY FOR PAYMENT OF DIVIDEND AND REFUND ORDER</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCell}><Text>BANK NAME</Text><Text style={styles.bold}>{data.bank_details?.bankName}</Text></View>
                        <View style={styles.tableCell}><Text>BRANCH</Text><Text style={styles.bold}>{data.bank_details?.branch}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCell}><Text>SAVING/CURRENT A/C NO. : {data.bank_details?.accountNumber}</Text></View>
                    </View>
                </View>
            </Page>

            {/* PAGE 2: PERSONAL DETAILS & AGREEMENT START */}
            <Page size="A4" style={styles.page}>
                <HeaderSnippet />
                <View style={styles.table}>
                    <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]}>
                        <View style={[styles.tableCell, { flex: 2 }]}><Text style={styles.bold}>{data.full_name?.toUpperCase()}</Text></View>
                        <View style={styles.tableCell}><Text style={styles.bold}>{data.age}</Text></View>
                        <View style={styles.tableCell}><Text style={styles.bold}>{data.marital_status || 'Married'}</Text></View>
                        <View style={styles.tableCell}><Text style={styles.bold}>{formatDate(data.dob)}</Text></View>
                        <View style={[styles.tableCell, { flex: 2 }]}><Text style={styles.bold}>{data.father_name?.toUpperCase()}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, { borderRightWidth: 0 }]}><Text>Full Address :</Text></View>
                        <View style={[styles.tableCell, { flex: 5 }]}><Text style={styles.bold}>{data.permanent_address?.toUpperCase()}</Text></View>
                    </View>
                </View>
                <View style={styles.signatureSection}>
                    <View style={[styles.signatureBox, { borderRightWidth: 0 }]}>
                        <Text>Specimen Signature - First Holder</Text>
                        {data.client_signature_url && (
                            <Image src={data.client_signature_url} style={{ height: 40, width: 'auto', marginTop: 5, alignSelf: 'center' }} />
                        )}
                    </View>
                    <View style={styles.signatureBox}>
                        <Text>Specimen Signature - Second Holder (Nominee)</Text>
                    </View>
                </View>
                <Text style={[styles.mainTitle, { marginTop: 10 }]}>
                    {['Intraday Trading', 'Short-Term SIP', 'Long-Term Holding'].includes(data.product_name)
                        ? 'TRADE MANAGEMENT AGREEMENT'
                        : 'PREFERENCE BOND SHAREHOLDING AGREEMENT'}
                </Text>
                <Text style={{ textAlign: 'center', marginBottom: 8 }}>Sr. No:{generateSerialNumber()}</Text>
                <Text style={styles.paragraph}>
                    THIS AGREEMENT made this <Text style={styles.bold}>{new Date().getDate()}TH day of {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</Text> Place : <Text style={styles.bold}>Kolkata</Text>
                </Text>
                <Text style={[styles.bold, { textAlign: 'center', marginVertical: 8 }]}>BETWEEN</Text>
                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>{data.full_name?.toUpperCase()}</Text> an Investor/proposed Loan Provider, residing at <Text style={styles.bold}>{data.permanent_address?.toUpperCase()}</Text> (hereinafter referred to as <Text style={styles.bold}>“Shareholding Applicant''</Text>) <Text style={styles.bold}>(which expression shall, unless repugnant to the context or meaning hereof, mean and include his heirs, executors, administrators and assigns) of the First Part.</Text>
                </Text>
                <Text style={[styles.bold, { textAlign: 'center', marginVertical: 8 }]}>And</Text>
                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>SHREEG EXPERT WEALTH ADVISORY LTD</Text> a Company incorporated under the Companies Act, 2013 having its office Mani Casadona, 11WS2, 6th Floor Suit Number 9 Action Area IIF, Opposite EcoSpace, Kolkata - 700156, herein represented by its Directors (hereinafter referred to as <Text style={styles.bold}>“a company”</Text>) <Text style={styles.bold}>which expression shall, unless repugnant to the context or meaning hereof, include its successors and assigns) of the Second Part;</Text>
                </Text>
                <Text style={[styles.bold, { marginTop: 10 }]}>WHEREAS:</Text>
                <Text style={styles.paragraph}>
                    (A) {data.full_name} desires to become a {['Intraday Trading', 'Short-Term SIP', 'Long-Term Holding'].includes(data.product_name) ? 'Trading Client' : 'Preference bond Shareholder'} and {['Intraday Trading', 'Short-Term SIP', 'Long-Term Holding'].includes(data.product_name) ? 'avail Trade Management services from' : 'invest in'} the Company SHREEG EXPERT WEALTH ADVISORY LTD.
                </Text>
                <Text style={styles.paragraph}>(C) The Company has agreed to join in the execution of this Agreement to be aware of the rights and obligations of {data.full_name} as a party hereto and ensure compliance with the same.</Text>
            </Page>

            {/* PAGE 3: PERFORMANCE BOND SHAREHOLDER TERMS */}
            <Page size="A4" style={styles.page}>
                <HeaderSnippet />
                <Text style={[styles.paragraph, { marginTop: 6 }]}>(D) The parties desire to record the terms and conditions of their Agreement in writing.</Text>
                <Text style={[styles.bold, { marginTop: 8, marginBottom: 8 }]}>NOW IT IS HEREBY AGREED BY AND BETWEEN THE PARTIES HERETO AS FOLLOWS:</Text>
                <Text style={styles.sectionHeading}>1. Preference bond Shareholder</Text>
                <Text style={styles.paragraph}>
                    As a Preference bond Bond shareholder, <Text style={styles.bold}>{data.full_name}</Text> would have a preferred claim on the company's assets and dividends over common shareholders. However, Preference bond shareholders typically do not have voting rights in the company unless otherwise specified. <Text style={styles.bold}>The key benefit is that, in the event of profit distribution, Preference bond shareholders receive dividends before common shareholders, and these dividends are often at a fixed rate.</Text>
                </Text>
                <Text style={styles.sectionHeading}>2. Long-Term Equity Growth</Text>
                <Text style={styles.paragraph}>
                    This refers to the expectation that the value of the investment (in this case, the shares in the company) will increase over time, potentially offering capital appreciation along with dividends. Investing for long-term growth means <Text style={styles.bold}>{data.full_name}</Text> is looking at a sustained period, potentially years or decades, for her investment to grow.
                </Text>
                <Text style={styles.sectionHeading}>3. Investment:</Text>
                <Text style={styles.paragraph}>
                    (a) <Text style={styles.bold}>{data.full_name}</Text> intends to invest a capital amount of Rs. {formatCurrency(data.investment_amount)}/- ({numberInWords(data.investment_amount)}) in the Company, an existing company limited by shares under the Companies Act, 2013.
                </Text>
                <View style={{ marginTop: 4 }}>
                    <Text style={styles.bold}>Transactional Details of Received Capital in Company Bank Accounts:</Text>
                    <Text style={[styles.headerInfo, { marginBottom: 5 }]}>The following is a breakdown of the capital received in the company's bank accounts according to the respective dates:</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]}>
                            <View style={styles.tableCell}><Text style={styles.bold}>Chq./Ref.No.</Text></View>
                            <View style={styles.tableCell}><Text style={styles.bold}>Value Date</Text></View>
                            <View style={styles.tableCell}><Text style={styles.bold}>Deposit Amt.</Text></View>
                            <View style={styles.tableCell}><Text style={styles.bold}>In Words</Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCell}><Text>{data.payment_reference}</Text></View>
                            <View style={styles.tableCell}><Text>{formatDate(data.payment_date)}</Text></View>
                            <View style={styles.tableCell}><Text>{formatCurrency(data.investment_amount)}.00</Text></View>
                            <View style={styles.tableCell}><Text>{numberInWords(data.investment_amount).replace(' RUPEES ONLY', '')}</Text></View>
                        </View>
                    </View>
                </View>
                <Text style={styles.sectionHeading}>4. Bank Account Details:</Text>
                <View style={{ marginLeft: 15, padding: 5 }}>
                    <Text style={styles.paragraph}>Account number :- {data.bank_details?.accountNumber}</Text>
                    <Text style={styles.paragraph}>Bank Name       :- {data.bank_details?.bankName?.toUpperCase()}</Text>
                    <Text style={styles.paragraph}>Account Type    :- {data.bank_details?.accountType || 'Savings'}</Text>
                    <Text style={styles.paragraph}>IFSC Code       :- {data.bank_details?.ifscCode}</Text>
                </View>
                <Text style={styles.sectionHeading}>
                    {['Intraday Trading', 'Short-Term SIP', 'Long-Term Holding'].includes(data.product_name)
                        ? '5. Trade Management Fee Details:'
                        : '5. Number of Shares Applied For:'}
                </Text>
                <Text style={[styles.paragraph, { marginLeft: 15 }]}>
                    {data.product_name === 'Intraday Trading' ? 'Trade Management fees @1% Monthly: ' :
                        data.product_name === 'Short-Term SIP' ? 'Trade Management fees @1% Quarterly: ' :
                            data.product_name === 'Long-Term Holding' ? 'Trade Management fees @1% Yearly: ' :
                                'Number of Preference bond Shares: '}
                    {data.number_of_shares} ({numberInWords(data.number_of_shares).replace(' RUPEES ONLY', '')})
                </Text>
            </Page>

            {/* PAGE 4: SECTIONS 6-10 */}
            <Page size="A4" style={styles.page}>
                <HeaderSnippet />
                <Text style={styles.sectionHeading}>6. Branch Office and Business:</Text>
                <Text style={styles.paragraph}>(b) The branch office of the Company shall be situated at Mani Casadona, 11WS2, 6th Floor Suite Number 9, Action Area IIF, Opposite EcoSpace, Kolkata - 700156, <Text style={styles.bold}>or at such other places as may be mutually agreed upon in writing.</Text></Text>
                <Text style={styles.paragraph}>(c) The Company shall engage in the business of Investment advisory & Investment in holding securities ,companies , bonds, either by itself or through other agencies or company industries, <Text style={styles.bold}>and may carry on any other business as decided by the Board of Directors.</Text></Text>
                <Text style={styles.paragraph}>(d) The paid-up capital value currently is Rs. 40,00,000/- with authorized share capital of Rs. 1,00,00,000/- consisting of 10,00,000 equity shares of Rs. 10/- each.</Text>
                <Text style={styles.sectionHeading}>7. Rights of Shareholders:</Text>
                <Text style={styles.paragraph}>(a) {data.full_name} is entitled to participate in the valuations and growth but can not vote as a member of the Company <Text style={styles.bold}>with respect to the shares held during voting times once the allotment processes are completed by the company.</Text></Text>
                <Text style={styles.paragraph}>(b) The Company shall issue all Preference bond shares to the provided CDSL demat account. <Text style={styles.bold}>These shares will be credited to the demat account one month after the agreement process with the company.</Text></Text>
                <Text style={styles.sectionHeading}>8. Dividend:</Text>
                <Text style={styles.paragraph}>(a) {data.full_name} is entitled to receive a monthly dividend, which is declared by the company from time to time, with a rate of {data.dividend_rate}% per annum, <Text style={styles.bold}>after the deduction of Tax Deducted at Source (TDS), which can be claimed by the shareholder.</Text></Text>
                <Text style={styles.paragraph}>(b) The rate of change in the dividend or any bonus announcement will be determined based on the company's earnings during periods of liquidity or maturity, after a period of five years.</Text>
                <Text style={styles.sectionHeading}>9. Share Transfer/Sell:</Text>
                <Text style={styles.paragraph}>(a) {data.full_name} can transfer or otherwise dispose of any or all of her shares (referred to as the "Seller"). Other shareholders or investors (referred to as the "Offerees") have the right to purchase the shares.</Text>
                <Text style={styles.paragraph}>(b) The Seller shall notify the Offerees in writing about her intention to sell shares. This notice shall be given through mail or registered letter and a copy to the company.</Text>
                <Text style={styles.sectionHeading}>10. Nominee</Text>
                <Text style={styles.paragraph}>
                    A nominee is someone who is designated to act on behalf of the shareholder. If {data.full_name} is naming <Text style={styles.bold}>{data.nominee?.name}</Text> as the nominee, this would mean that, in the event he is unable to manage her investment, <Text style={styles.bold}>{data.nominee?.name}</Text> Would be the person who can claim the shares and manage them according to the terms of the investment.
                </Text>
            </Page>

            {/* PAGE 5: SECTIONS 11-12 & OVERRIDE */}
            <Page size="A4" style={styles.page}>
                <HeaderSnippet />
                <Text style={styles.sectionHeading}>11. Buyback, Lock-in & Maturity Valuation</Text>
                <Text style={styles.paragraph}>a) Lock-in Period : The Preference Bond Shares allotted under this Agreement shall be subject to a minimum lock-in period of three (3) years from the date on which the investment amount is credited to the Company’s bank account and the Preference Bond Shares are credited to the Shareholder’s demat account.</Text>
                <Text style={styles.paragraph}>b) Restriction on Transfer / Sale : The Shareholder shall not transfer, sell, pledge, or otherwise dispose of the Preference Bond Shares, whether partially or fully, before completion of the said three-year lock-in period, except with the prior written consent of the Company and subject to applicable laws.</Text>
                <Text style={styles.paragraph}>c) Buyback Option by the Company : After completion of the lock-in period of three (3) years, the Company may, at its discretion, offer a buyback of the Preference Bond Shares at allotted bond values, subject to:</Text>
                <View style={{ marginLeft: 20, marginBottom: 10 }}>
                    <Text style={styles.paragraph}><Text style={styles.bold}>•</Text> Availability of distributable profits and liquidity.</Text>
                    <Text style={styles.paragraph}><Text style={styles.bold}>•</Text> Approval of the Board of Directors</Text>
                    <Text style={styles.paragraph}><Text style={styles.bold}>•</Text> Compliance with the provisions of the Companies Act, 2013 and applicable rules.</Text>
                </View>
                <Text style={styles.paragraph}>d) .Maturity & Valuation Basis : The buyback value or transfer value of the Preference Bond Shares shall be determined based on the prevailing value of the Preference Bond as reflected in the Shareholder’s demat account at the time of buyback or transfer, taking into consideration:</Text>
                <View style={{ marginLeft: 20, marginBottom: 10 }}>
                    <Text style={styles.paragraph}><Text style={styles.bold}>•</Text> The Company’s financial performance</Text>
                    <Text style={styles.paragraph}><Text style={styles.bold}>•</Text> Declared dividends already paid</Text>
                    <Text style={styles.paragraph}><Text style={styles.bold}>•</Text> Net asset value and internal valuation metrics approved by the Board</Text>
                </View>
                <Text style={styles.paragraph}>e) No Assured Exit Before Lock-in : The Shareholder acknowledges and agrees that no assured exit, buyback, or transfer shall be available prior to the completion of the lock-in period, and the investment is made with a medium- to long-term horizon.</Text>
                <Text style={styles.sectionHeading}>12. Further Issue of Shares:</Text>
                <Text style={styles.paragraph}>(a) If the Company intends to issue further Preference bond shares, the Issued shares shall be offered to the Shareholders at a price and upon terms determined by the Board of Directors. The Company shall provide written notice to each existing Shareholder about the offer details.</Text>
                <Text style={styles.paragraph}>(b) Shareholders interested in purchasing the Issued shares may apply by depositing the required amount with the company.</Text>
                <Text style={styles.paragraph}>(c) Any unsubscribed Issued Shares may be offered to third parties at the price and terms decided by the board, in line with the provisions of the Companies Act, 2013.</Text>
                <Text style={styles.sectionHeading}>13. Companies Act, 2013 Override:</Text>
                <Text style={styles.paragraph}>
                    If any provision of this Agreement conflicts with the Companies Act, 2013 or any amendments therein, the Companies Act, 2013 will prevail.
                </Text>
                <Text style={[styles.bold, { marginTop: 8 }]}>IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date first above written.</Text>
            </Page>

            {/* PAGE 6: FINAL SIGNATURES */}
            <Page size="A4" style={styles.page}>
                <HeaderSnippet />
                <View style={styles.table}>
                    <View style={[styles.tableRow, { minHeight: 100 }]}>
                        <View style={styles.tableCell}>
                            <Text>Name of Witness</Text>
                        </View>
                        <View style={styles.tableCell}>
                            <Text>Name of Founder</Text>
                            <Text style={styles.bold}>Shri.Gaurav Dewangan</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCell}>
                            <Text>Address :</Text>
                            <Text style={styles.bold}>{data.permanent_address}</Text>
                        </View>
                        <View style={styles.tableCell}>
                            <Text>Address :</Text>
                            <Text style={styles.bold}>Mani Casadona, 11WS2, 6th Floor Suite Number 9, Action Area IIF, Opposite EcoSpace, Kolkata - 700156</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.table, { marginTop: 8 }]}>
                    <View style={[styles.tableRow, { minHeight: 80 }]}>
                        <View style={styles.tableCell}>
                            <Text>Shareholding Applicant</Text>
                            <Text style={styles.bold}>{data.full_name?.toUpperCase()}</Text>
                            {data.client_signature_url && (
                                <Image src={data.client_signature_url} style={{ height: 40, width: 'auto', marginTop: 10 }} />
                            )}
                        </View>
                        <View style={styles.tableCell}>
                            <Text>For (Director)</Text>
                            <Text style={styles.bold}>SHREEG EXPERT WEALTH ADVISORY LTD</Text>
                            {data.admin_signature_url && (
                                <Image src={data.admin_signature_url} style={{ height: 40, width: 'auto', marginTop: 10 }} />
                            )}
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 40, borderTopWidth: 0.5, paddingTop: 10 }}>
                    <Text style={{ textAlign: 'center', fontSize: 8, color: '#666' }}>Computer generated document. Digitally approved by SHREEG EXPERT WEALTH ADVISORY LTD.</Text>
                </View>
            </Page>
        </Document>
    );
};
