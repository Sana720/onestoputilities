import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Svg, Path, Line, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#000',
    },
    headerWrapper: {
        border: '1pt solid #000',
        padding: 10,
        marginBottom: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    companyName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerInfo: {
        fontSize: 8,
        lineHeight: 1.4,
    },
    logoContainer: {
        width: 100,
        alignItems: 'flex-end',
    },
    logo: {
        fontSize: 24,
        fontWeight: 'extrabold',
        color: '#1B8A9F',
    },
    headerBottom: {
        flexDirection: 'row',
        fontSize: 8,
        borderTop: '1pt solid #000',
        paddingTop: 5,
        marginTop: 5,
    },
    headerCol: {
        width: '33%',
    },
    mainTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        textDecoration: 'underline',
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    subTitleBox: {
        border: '1pt solid #000',
        alignSelf: 'center',
        padding: '2 20',
        marginBottom: 20,
    },
    subTitle: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    contentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    salutation: {
        marginBottom: 15,
    },
    paragraph: {
        marginBottom: 10,
        lineHeight: 1.4,
        textAlign: 'justify',
    },
    table: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#000',
        marginVertical: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    tableCell: {
        padding: 5,
        borderRightWidth: 1,
        borderRightColor: '#000',
        flex: 1,
    },
    tableCellHeader: {
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold',
    },
    bold: {
        fontWeight: 'bold',
    },
    signatureSection: {
        flexDirection: 'row',
        marginTop: 30,
        borderWidth: 1,
        borderColor: '#000',
    },
    signatureBox: {
        flex: 1,
        height: 80,
        padding: 5,
        borderRightWidth: 1,
        borderRightColor: '#000',
    },
    sectionHeading: {
        fontSize: 11,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 8,
        textDecoration: 'underline',
    },
    pageBreak: {
        marginTop: 20,
    },
});

interface Props {
    data: any;
}

const Header = () => (
    <View style={styles.headerWrapper}>
        <View style={styles.headerTop}>
            <View>
                <Text style={styles.companyName}>SHREEG EXPERT WEALTH ADVISORY LIMITED</Text>
                <Text style={styles.headerInfo}>Reg. Office : Shop No. 353, Third Floor, Progressive Point Near</Text>
                <Text style={styles.headerInfo}>Fruit Market Lalpur Dhamtari Road Raipur CT 492001 IN</Text>
                <Text style={styles.headerInfo}>Corp.Office : 11WS2 Mani Casadona, Action Area 2 Rajarhat</Text>
                <Text style={styles.headerInfo}>Newtown Kolkata(W.B) CIN: U74140CT2016PLC002054</Text>
            </View>
            <View style={styles.logoContainer}>
                <Image src="/shreeg_logo.png" style={{ width: 80, height: 40 }} />
            </View>
        </View>
        <View style={styles.headerBottom}>
            <View style={styles.headerCol}><Text>website : www.tradergwealth.com</Text></View>
            <View style={styles.headerCol}><Text>Email: gauravd113@gmail.com</Text></View>
            <View style={styles.headerCol}><Text>Contact: 91-7044520894</Text></View>
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
        // Simple placeholder for words, ideally use a library but keeping it basic for now
        return `${formatCurrency(amount)} RUPEES ONLY`.toUpperCase();
    };

    return (
        <Document>
            {/* PAGE 1: APPLICATION FORM */}
            <Page size="A4" style={styles.page}>
                <Header />
                <Text style={styles.mainTitle}>APPLICATION FORM FOR Preference bond BOND SHARES OF Rs. 100/- EACH AT PAR</Text>
                <View style={styles.subTitleBox}><Text style={styles.subTitle}>PRIVATE AND CONFIDENTIAL</Text></View>

                <View style={styles.contentRow}>
                    <View>
                        <Text>To,</Text>
                        <Text style={styles.bold}>The Board of Directors,</Text>
                        <Text>SHREEG EXPERT WEALTH ADVISORY LIMITED</Text>
                        <Text>Reg. Office : Shop No. 353, Third Floor, Progressive Point Near</Text>
                        <Text>Fruit Market Lalpur Dhamtari Road Raipur CT 492001 IN</Text>
                    </View>
                    <View style={{ textAlign: 'right' }}>
                        <Text style={styles.bold}>Sr. No:SGPS71/{data.id.slice(0, 8).toUpperCase()}/{new Date().getFullYear()}-{new Date().getFullYear() + 1}</Text>
                        <Text>Date: {formatDate(new Date().toISOString())}</Text>
                    </View>
                </View>

                <Text style={styles.salutation}>Dear Sir,</Text>
                <Text style={styles.paragraph}>
                    I <Text style={styles.bold}>{data.full_name?.toUpperCase()}</Text> hereby apply for the allotment of <Text style={styles.bold}>{formatCurrency(data.number_of_shares)} Preference bond Shares</Text> as detailed below. The application money is remitted herewith, with a face value of <Text style={styles.bold}>Rs. 100/- per share.</Text>
                </Text>
                <Text style={styles.paragraph}>
                    I agree to accept the shares applied for, or such number as may be allotted, subject to the terms of the Memorandum and Articles of Association, the terms and conditions of the application form, and the letter of allotment of the Company, all of which are acceptable to us.
                </Text>
                <Text style={styles.paragraph}>
                    I acknowledge that the Board of Directors has the absolute discretion to accept or reject this application, in whole or in part, without providing any reasons for such rejection.
                </Text>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, { flex: 2 }]}><Text>Number of Shares applied for (in figure)</Text><Text style={styles.bold}>{data.number_of_shares}</Text></View>
                        <View style={[styles.tableCell, { flex: 3 }]}><Text style={styles.bold}>{numberInWords(data.number_of_shares).replace(' RUPEES ONLY', '')}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, { flex: 2 }]}><Text>Amount paid @ Rs 100/- per share :</Text><Text style={styles.bold}>Rs.: {formatCurrency(data.investment_amount)}</Text></View>
                        <View style={[styles.tableCell, { flex: 2 }]}><Text>Drawn on : {data.bank_details?.bankName}</Text><Text style={styles.bold}>{numberInWords(data.investment_amount)}</Text></View>
                        <View style={[styles.tableCell, { flex: 1 }]}><Text>Date</Text><Text style={styles.bold}>{formatDate(data.payment_date)}</Text></View>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCell}><Text>PAN NO.</Text><Text style={styles.bold}>{data.pan_number || 'N/A'}</Text></View>
                        <View style={styles.tableCell}><Text>Issuing Authority</Text><Text style={styles.bold}>Income Tax Department</Text></View>
                    </View>
                </View>

                <Text style={[styles.bold, { fontSize: 8, marginBottom: 5 }]}>BANK DETAILS MANDATORY FOR PAYMENT OF DIVIDEND AND REFUND ORDER</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCell}><Text>BANK NAME</Text><Text style={styles.bold}>{data.bank_details?.bankName}</Text></View>
                        <View style={styles.tableCell}><Text>BRANCH</Text><Text style={styles.bold}>{data.bank_details?.branch}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCell}><Text>SAVING/CURRENT A/C NO. : {data.bank_details?.accountNumber}</Text></View>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, { flex: 2 }]}><Text>Name in full</Text><Text style={styles.bold}>{data.full_name}</Text></View>
                        <View style={styles.tableCell}><Text>Age</Text><Text style={styles.bold}>{data.age}</Text></View>
                        <View style={styles.tableCell}><Text>Status</Text><Text style={styles.bold}>{data.marital_status || 'N/A'}</Text></View>
                        <View style={styles.tableCell}><Text>DOB</Text><Text style={styles.bold}>{formatDate(data.dob)}</Text></View>
                        <View style={[styles.tableCell, { flex: 2 }]}><Text>Father's Name</Text><Text style={styles.bold}>{data.father_name}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCell}><Text>Full Address :</Text><Text style={styles.bold}>{data.permanent_address}</Text></View>
                    </View>
                </View>

                <View style={styles.signatureSection}>
                    <View style={styles.signatureBox}><Text>Specimen Signature - First Holder</Text></View>
                    <View style={styles.signatureBox}><Text>Specimen Signature - Second Holder (Nominee)</Text></View>
                </View>
            </Page>

            {/* PAGE 2: AGREEMENT START */}
            <Page size="A4" style={styles.page}>
                <Header />
                <Text style={styles.mainTitle}>PREFERENCE BOND SHAREHOLDING AGREEMENT</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                    <Text>Sr. No:SGPS71/{data.id.slice(0, 8).toUpperCase()}/{new Date().getFullYear()}-{new Date().getFullYear() + 1}</Text>
                </View>
                <Text style={styles.paragraph}>
                    THIS AGREEMENT made this <Text style={styles.bold}>{new Date().getDate()}TH day of {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</Text> Place : <Text style={styles.bold}>Kolkata</Text>
                </Text>
                <Text style={[styles.bold, { textAlign: 'center', marginVertical: 10 }]}>BETWEEN</Text>
                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>{data.full_name?.toUpperCase()}</Text> an Investor/proposed Loan Provider, residing at <Text style={styles.bold}>{data.permanent_address?.toUpperCase()}</Text> (hereinafter referred to as "Shareholding Applicant") of the First Part.
                </Text>
                <Text style={[styles.bold, { textAlign: 'center', marginVertical: 5 }]}>And</Text>
                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>SHREEG EXPERT WEALTH ADVISORY LTD</Text> a Company incorporated under the Companies Act, 2013 having its office Mani Casadona, 11WS2, 6th Floor Suit Number 9 Action Area IIF, Opposite EcoSpace, Kolkata - 700156, herein represented by its Directors (hereinafter referred to as "a company") of the Second Part;
                </Text>
                <Text style={styles.bold}>WHEREAS:</Text>
                <Text style={styles.paragraph}>(A) {data.full_name} desires to become a Preference bond Shareholder and invest in the Company SHREEG EXPERT WEALTH ADVISORY LTD for long-term Preference bond equity growth.</Text>
                <Text style={styles.paragraph}>(C) The Company has agreed to join in the execution of this Agreement to be aware of the rights and obligations of {data.full_name} as a party hereto and ensure compliance with the same.</Text>
                <Text style={styles.bold}>NOW IT IS HEREBY AGREED BY AND BETWEEN THE PARTIES HERETO AS FOLLOWS:</Text>
                <Text style={styles.sectionHeading}>1. Preference bond Shareholder</Text>
                <Text style={styles.paragraph}>
                    As a Preference bond Bond shareholder, <Text style={styles.bold}>{data.full_name}</Text> would have a preferred claim on the company's assets and dividends over common shareholders. However, Preference bond shareholders typically do not have voting rights in the company unless otherwise specified.
                </Text>
                <Text style={styles.sectionHeading}>2. Long-Term Equity Growth</Text>
                <Text style={styles.paragraph}>
                    This refers to the expectation that the value of the investment will increase over time, potentially offering capital appreciation along with dividends. Investing for long-term growth means <Text style={styles.bold}>{data.full_name}</Text> is looking at a sustained period, potentially years or decades, for her investment to grow.
                </Text>
                <Text style={styles.sectionHeading}>3. Investment:</Text>
                <Text style={styles.paragraph}>
                    (a) <Text style={styles.bold}>{data.full_name}</Text> intends to invest a capital amount of Rs. {formatCurrency(data.investment_amount)}/- ({numberInWords(data.investment_amount)}) in the Company, an existing company limited by shares under the Companies Act, 2013.
                </Text>
            </Page>

            {/* PAGE 3: TRANSACTIONAL DETAILS */}
            <Page size="A4" style={styles.page}>
                <Header />
                <Text style={styles.bold}>Transactional Details of Received Capital in Company Bank Accounts:</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCell}><Text>Chq./Ref.No.</Text></View>
                        <View style={styles.tableCell}><Text>Value Date</Text></View>
                        <View style={styles.tableCell}><Text>Deposit Amt.</Text></View>
                        <View style={styles.tableCell}><Text>In Words</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCell}><Text style={styles.bold}>{data.payment_reference}</Text></View>
                        <View style={styles.tableCell}><Text style={styles.bold}>{formatDate(data.payment_date)}</Text></View>
                        <View style={styles.tableCell}><Text style={styles.bold}>{formatCurrency(data.investment_amount)}.00</Text></View>
                        <View style={styles.tableCell}><Text style={styles.bold}>{numberInWords(data.investment_amount)}</Text></View>
                    </View>
                </View>

                <Text style={styles.sectionHeading}>4. Bank Account Details:</Text>
                <Text>Account number :- {data.bank_details?.accountNumber}</Text>
                <Text>Bank Name     :- {data.bank_details?.bankName}</Text>
                <Text>Account Type   :- {data.bank_details?.accountType || 'Savings'}</Text>
                <Text>IFSC Code      :- {data.bank_details?.ifscCode}</Text>

                <Text style={styles.sectionHeading}>5. Number of Shares Applied For:</Text>
                <Text>Number of Preference bond Shares: {data.number_of_shares} ({numberInWords(data.number_of_shares).replace(' RUPEES ONLY', '')})</Text>

                <Text style={styles.sectionHeading}>6. Branch Office and Business:</Text>
                <Text style={styles.paragraph}>(b) The branch office of the Company shall be situated at Mani Casadona, 11WS2, 6th Floor Suite Number 9, Action Area IIF, Opposite EcoSpace, Kolkata - 700156.</Text>
                <Text style={styles.paragraph}>(c) The Company shall engage in the business of Investment advisory & Investment in holding securities, companies, bonds, either by itself or through other agencies or company industries.</Text>

                <Text style={styles.sectionHeading}>7. Rights of Shareholders:</Text>
                <Text style={styles.paragraph}>(a) {data.full_name} is entitled to participate in the valuations and growth but can not vote as a member of the Company.</Text>
                <Text style={styles.paragraph}>(b) The Company shall issue all Preference bond shares to the provided CDSL demat account ({data.demat_account || 'To be provided'}).</Text>

                <Text style={styles.sectionHeading}>8. Dividend:</Text>
                <Text style={styles.paragraph}>(a) {data.full_name} is entitled to receive a monthly dividend, which is declared by the company from time to time, with a rate of {data.dividend_rate}% per annum.</Text>
            </Page>

            {/* PAGE 4: NOMINEE & EXIT */}
            <Page size="A4" style={styles.page}>
                <Header />
                <Text style={styles.sectionHeading}>10. Nominee</Text>
                <Text style={styles.paragraph}>
                    A nominee is someone who is designated to act on behalf of the shareholder. <Text style={styles.bold}>{data.full_name}</Text> is naming <Text style={styles.bold}>{data.nominee?.name}</Text> as the nominee. In the event {data.full_name} is unable to manage her investment, <Text style={styles.bold}>{data.nominee?.name}</Text> Would be the person who can claim the shares.
                </Text>

                <Text style={styles.sectionHeading}>11. Buyback, Lock-in & Maturity Valuation</Text>
                <Text style={styles.paragraph}>(a) Lock-in Period : The Preference Bond Shares allotted under this Agreement shall be subject to a minimum lock-in period of three (3) years from the date of investment.</Text>
                <Text style={styles.paragraph}>(b) Restriction on Transfer : The Shareholder shall not transfer, sell, or otherwise dispose of the Preference Bond Shares before completion of the said three-year lock-in period.</Text>
                <Text style={styles.paragraph}>(c) Buyback Option : After completion of the lock-in period of three (3) years, the Company may, at its discretion, offer a buyback of the Preference Bond Shares.</Text>

                <Text style={styles.sectionHeading}>12. Further Issue of Shares:</Text>
                <Text style={styles.paragraph}>(a) If the Company intends to issue further Preference bond shares, the Issued shares shall be offered to the Shareholders first.</Text>

                <Text style={{ marginTop: 20, fontWeight: 'bold' }}>IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date first above written.</Text>
            </Page>

            {/* PAGE 5: SIGNATURES */}
            <Page size="A4" style={styles.page}>
                <Header />
                <View style={[styles.table, { height: 100 }]}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCell}><Text>Shareholding Applicant</Text><Text style={styles.bold}>{data.full_name}</Text></View>
                        <View style={styles.tableCell}><Text>For (Director)</Text><Text style={styles.bold}>SHREEG EXPERT WEALTH ADVISORY LTD</Text></View>
                    </View>
                </View>

                <View style={[styles.table, { height: 100, marginTop: 20 }]}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCell}><Text>Name of Witness</Text></View>
                        <View style={styles.tableCell}><Text>Name of Founder</Text><Text style={styles.bold}>Shri.Gaurav Dewangan</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCell}><Text>Address : </Text></View>
                        <View style={styles.tableCell}><Text>Address : Mani Casadona, 11WS2, 6th Floor Suite Number 9, Action Area IIF, Opposite EcoSpace, Kolkata - 700156</Text></View>
                    </View>
                </View>
            </Page>

            {/* PAGE 6: ACKNOWLEDGMENT */}
            <Page size="A4" style={styles.page}>
                <Header />
                <Text style={styles.mainTitle}>Company Acknowledgment:</Text>
                <Text style={styles.paragraph}>
                    The company must acknowledge the receipt of the investment and issue a share allotment letter for the Preference bond shares, clearly detailing the number of shares issued, dividend rate, and any other relevant terms based on the investment agreement.
                </Text>
                <Text style={styles.bold}>Investment Details:</Text>
                <View style={{ marginLeft: 20, marginVertical: 10 }}>
                    <Text>• Investor Name: {data.full_name}</Text>
                    <Text>• Investment Amount: Rs. {formatCurrency(data.investment_amount)}/-</Text>
                    <Text>• Type of Shares: Preference bond Shares</Text>
                    <Text>• Nominee: {data.nominee?.name}</Text>
                    <Text>• Purpose of Investment: Long-term growth</Text>
                </View>

                <Text style={styles.bold}>Next Steps:</Text>
                <View style={{ marginLeft: 20, marginVertical: 10 }}>
                    <Text>1. Share Issuance: Upon confirmation, company will issue shares to CDSL demat account.</Text>
                    <Text>2. Nominee Registration: Nominee will be officially registered in company records.</Text>
                    <Text>3. Company Records: Shareholder register will be updated.</Text>
                </View>

                <View style={{ marginTop: 50 }}>
                    <Text>Company:</Text>
                    <Text>(Authorized Signature) _______________________________________</Text>
                    <Text>Gaurav Dewangan(Founder)</Text>
                    <Text style={styles.bold}>SHREEG EXPERT WEALTH ADVISORY LTD</Text>
                </View>
            </Page>
        </Document>
    );
};

