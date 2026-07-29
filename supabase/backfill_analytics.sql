-- Backfill existing submissions into analytics_users
INSERT INTO public.analytics_users (original_form_id, responses, created_at)
SELECT form_id, responses, created_at 
FROM public.submissions;

-- Backfill existing payments into analytics_payments
INSERT INTO public.analytics_payments (
    original_submission_id, 
    razorpay_order_id, 
    razorpay_payment_id, 
    amount, 
    currency, 
    status, 
    created_at
)
SELECT 
    submission_id, 
    razorpay_order_id, 
    razorpay_payment_id, 
    amount, 
    currency, 
    status, 
    created_at 
FROM public.payments;
