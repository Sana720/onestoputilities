# SHREEG Investment Portal

A full-fledged web application for managing preference bond shareholding investments for SHREEG Expert Wealth Advisory Limited.

## Features

### Client Portal
- **Investment Application**: Multi-step form for submitting investment applications
- **Portfolio Dashboard**: View investment details, dividends, and lock-in periods
- **Dividend Tracking**: Monitor received and pending dividends
- **Agreement Access**: Download investment agreements
- **Secure Authentication**: Email and password-based login with Supabase Auth

### Admin Dashboard
- **Investment Management**: View and manage all client investments
- **Dividend Administration**: Add and track dividends for each investment
- **Status Updates**: Update investment status (pending, approved, active, matured, bought back)
- **Dividend Rate Management**: Set and update dividend rates for investments
- **Client Overview**: View total investments, clients, and dividend payments
- **Search & Filter**: Find investments by client name, email, or status

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works great!)

### Installation

1. **Clone the repository**
   ```bash
   cd investment-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   Follow the detailed guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   
   Quick steps:
   - Create a Supabase project at https://supabase.com
   - Copy your project URL and API keys
   - Run the SQL schema from `supabase-schema.sql`
   - Create an admin user in Supabase Auth

4. **Configure environment variables**
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### For Clients

1. **Apply for Investment**
   - Visit the homepage and click "Apply Now"
   - Complete the 4-step application form:
     - Personal Details
     - Nominee Details
     - Bank Details
     - Investment Details
   - Submit the application
   - Receive login credentials (email + last 6 digits of phone number)

2. **Access Dashboard**
   - Login with your email and temporary password
   - View your investment portfolio
   - Track dividends
   - Download agreements

### For Administrators

1. **Login**
   - Use admin credentials to access the admin dashboard
   - Default: `admin@shreeg.com` (set up in Supabase)

2. **Manage Investments**
   - View all client investments
   - Update dividend rates
   - Change investment status
   - Add dividends to investments
   - Search and filter investments

## Project Structure

```
investment-portal/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── auth/               # Authentication endpoints
│   │   │   ├── investments/        # Investment endpoints
│   │   │   └── admin/              # Admin endpoints
│   │   ├── admin/                  # Admin dashboard
│   │   ├── client/                 # Client dashboard
│   │   ├── apply/                  # Investment application
│   │   ├── login/                  # Login page
│   │   └── application-success/    # Success page
│   └── lib/
│       └── supabase.ts             # Supabase client configuration
├── supabase-schema.sql             # Database schema
├── SUPABASE_SETUP.md               # Detailed setup guide
└── public/                         # Static assets
```

## Database Schema

### Users Table
- id (UUID, primary key)
- email (unique)
- role (admin | client)
- name
- created_at, updated_at

### Investments Table
- id (UUID, primary key)
- user_id (foreign key to users)
- Personal Details (name, DOB, gender, occupation, address, contact, email)
- Nominee Details (JSONB: name, relation, DOB, address)
- Bank Details (JSONB: account number, bank name, branch, IFSC, MICR)
- Investment Details (amount, shares, payment info)
- Agreement Details (lock-in period, dividend rate)
- Status (pending, approved, active, matured, bought_back)
- Dividends (JSONB array of dividend records)
- created_at, updated_at

## Key Features Explained

### Investment Application Flow
1. Client fills multi-step form with validation
2. System auto-calculates age from DOB
3. System auto-calculates shares from investment amount (₹100 per share)
4. Creates user account with Supabase Auth
5. Creates investment record with 3-year lock-in period
6. Sends confirmation with login credentials

### Admin Capabilities
- View all investments in a searchable table
- Update dividend rates for individual investments
- Change investment status
- Add dividend payments
- Filter by status
- Search by client name or email

### Security Features
- Supabase Auth for authentication
- Row Level Security (RLS) policies
- Role-based access control (admin/client)
- Protected API routes
- Secure password storage

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel automatically works with Next.js and Supabase.

### Environment Variables for Production
Make sure to set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Company details (optional)

## Cost Breakdown

### Supabase (Database + Auth)
- **Free Tier**: Perfect for starting (500MB database, unlimited auth)
- **Pro Tier**: $25/month when you scale (8GB database, 250GB bandwidth)

### Vercel (Hosting)
- **Hobby**: Free for personal projects
- **Pro**: $20/month for production use

**Total**: $0-45/month depending on scale

## Support

For issues or questions, contact: info@shreeg.com

## License

Proprietary - SHREEG Expert Wealth Advisory Limited

---

**Built with ❤️ for SHREEG Expert Wealth Advisory Limited**
