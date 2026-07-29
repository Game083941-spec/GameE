# ESportHub - Tournament Management Platform

ESportHub is a comprehensive web application built for managing esports tournaments, team registrations, and payments. It provides organizations with the tools they need to host events, collect player data, and manage revenue efficiently.

## 🚀 Key Features

*   **Custom Form Builder:** Create dynamic registration forms for tournaments with custom fields (IGN, Discord, Email, Phone, etc.).
*   **Payment Integration:** Seamlessly integrated with **Razorpay** to collect tournament entry fees securely via a native popup checkout.
*   **Automated Webhooks:** Robust Razorpay webhook integration to ensure payments and registrations are recorded even if the user closes the browser early.
*   **Team Management:** Automatically extracts and manages team information from form submissions, allowing organizations to view and organize participants.
*   **Permanent Analytics Data:** Features an `analytics_teams` and `analytics_payments` system to ensure crucial registration and financial data is never lost, even if the original forms are deleted.
*   **Role-Based Access Control:** Advanced roles including Super Admins, Organization Admins, Moderators, and Viewers.
*   **Modern UI:** Built with Tailwind CSS and shadcn/ui for a premium, dark-themed gaming aesthetic.

## 🛠️ Tech Stack

*   **Frontend:** Next.js (App Router), React, Tailwind CSS, shadcn/ui, Lucide Icons.
*   **Backend:** Next.js Server Actions.
*   **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Authentication).
*   **Payments:** Razorpay API.

## ⚙️ Environment Setup

To run this project locally, you will need to set up your `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Admin Configuration
SUPER_ADMIN_EMAIL=your_super_admin_email
```

## 📦 Installation & Running Locally

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema Notes

This project relies heavily on **Supabase Postgres Triggers** to automatically sync data. 
*   When a `submission` is created, it syncs to `analytics_users`.
*   When a `payment` is created, it syncs to `analytics_payments`.
*   The `analytics_teams` table retains permanent records of all team registrations independent of the forms table.

## 🚀 Deployment

The project is optimized for deployment on **Vercel**. Ensure all environment variables are correctly mapped in the Vercel project settings, specifically `NEXT_PUBLIC_RAZORPAY_KEY_ID` which is required for the client-side checkout modal.
