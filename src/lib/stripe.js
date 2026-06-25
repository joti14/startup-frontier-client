import 'server-only'

export const getStripe = async () => {
  const Stripe = (await import('stripe')).default;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};
