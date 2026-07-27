# ESportHub

ESportHub is a modern, full-stack platform designed specifically for managing Esports tournaments and gaming events. It provides organizers with a powerful dashboard to create custom registration forms, manage teams, track payments securely via Razorpay, and automatically send customized email notifications to players.

## 🚀 Key Features

*   **Multi-Tenant Architecture:** Create and manage multiple organizations securely under one account.
*   **Dynamic Form Builder:** A drag-and-drop form builder allowing organizers to create custom registration forms with text, email, number, BGMI UID, and secure Payment fields.
*   **Integrated Payments (Razorpay):** Secure checkout for tournament entry fees, supporting UPI, Cards, Netbanking, and Wallets. Forms seamlessly convert into paid gateways.
*   **Automated Team Management:** Upon successful payment or free registration, submissions are automatically parsed and inserted directly into a unified Teams dashboard.
*   **Custom Email Notifications (Resend):** Automatically send professional HTML email receipts and registration confirmations to players the moment they register. Organizers can also blast custom notifications to all registered teams.
*   **Real-time Dashboard:** A responsive, dark-mode first dashboard to view submissions, track revenue, and manage members.
*   **Secure by Default:** Built with Supabase Row Level Security (RLS) to ensure organizations can only see and edit their own data.

## 🛠️ Technology Stack

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, GoTrue, Row Level Security)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [shadcn/ui](https://ui.shadcn.com/) & [Lucide Icons](https://lucide.dev/)
*   **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (Used in the Form Builder)
*   **Payments:** [Razorpay Checkout](https://razorpay.com/)
*   **Emails:** [Resend](https://resend.com/)

## 📁 File Structure

The project follows a standard Next.js App Router structure with dedicated modules for server actions and core logic.

```text
├── src/
│   ├── actions/               # Next.js Server Actions (Backend Logic)
│   │   ├── admin.ts           # Super Admin logic
│   │   ├── auth.ts            # Supabase Authentication actions
│   │   ├── email.ts           # Resend email triggering logic
│   │   ├── forms.ts           # Form creation & updating logic
│   │   ├── organizations.ts   # Multi-tenant org logic
│   │   ├── payment.ts         # Razorpay order creation & verification
│   │   ├── submissions.ts     # Form submission handling
│   │   └── teams.ts           # Teams parsing & caching logic
│   │
│   ├── app/                   # Next.js App Router Pages
│   │   ├── (auth)/            # Login & Signup pages
│   │   ├── dashboard/         # Core Dashboard Layout & Pages
│   │   │   └── [orgSlug]/     # Dynamic Organization Routes (Forms, Teams, Billing)
│   │   ├── f/                 # Public facing dynamic forms (/f/[formId])
│   │   ├── onboarding/        # Organization setup flow
│   │   ├── globals.css        # Global CSS & Tailwind Directives
│   │   └── layout.tsx         # Root Layout
│   │
│   ├── components/            # React UI Components
│   │   ├── builder/           # The drag-and-drop Form Builder components
│   │   ├── forms/             # Public form renderer
│   │   ├── notifications/     # Bulk email notification UI
│   │   ├── teams/             # Teams manager data tables
│   │   └── ui/                # Reusable shadcn/ui components (Buttons, Inputs, etc.)
│   │
│   ├── lib/                   # Utility Functions & Integrations
│   │   ├── store/             # Zustand state stores
│   │   ├── supabase/          # Supabase client initializers (Client, Server, Admin)
│   │   ├── templates/         # HTML Email Templates for Resend
│   │   └── utils.ts           # Tailwind cn() utility
│   │
│   └── middleware.ts          # Edge middleware for route protection
│
├── supabase/
│   └── schema.sql             # Full PostgreSQL Database Schema & RLS Policies
│
├── .env.local                 # Environment Variables (Not committed)
└── package.json               # Project Dependencies
```

## ⚙️ Local Setup

1.  **Clone the repository**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:** Create a `.env.local` file with the following keys:
    ```env
    # Supabase (Database & Auth)
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

    # Razorpay (Payments)
    NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_test_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret

    # Resend (Emails)
    RESEND_API_KEY=your_resend_api_key

    # App Config
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    SUPER_ADMIN_EMAIL=your_email@example.com
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔒 Security Notes

- This project heavily utilizes **Row Level Security (RLS)** in Supabase. Anonymous users can securely submit to the `submissions` table, but reading and managing data requires authentication and explicit organizational membership.
- Payment verification is strictly handled on the backend via Server Actions using the `SUPABASE_SERVICE_ROLE_KEY` to securely bypass RLS and finalize payment statuses.
