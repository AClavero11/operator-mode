import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Verify webhook signature from Lemon Squeezy
function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) return false;

  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('x-signature') || '';

    // In production, verify signature
    if (process.env.NODE_ENV === 'production') {
      if (!verifySignature(payload, signature)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const data = JSON.parse(payload);
    const eventName = data.meta?.event_name;

    console.log('Webhook received:', eventName);

    switch (eventName) {
      case 'order_created':
        // Payment successful
        const customData = data.meta?.custom_data || {};
        const tier = customData.tier;
        const email = data.data?.attributes?.user_email;

        console.log(`Order created: ${tier} tier for ${email}`);

        // Here you would:
        // 1. Store the order in your database
        // 2. Send confirmation email
        // 3. Grant access to premium features

        break;

      case 'subscription_created':
        // Subscription started (if using subscriptions)
        console.log('Subscription created:', data.data?.id);
        break;

      case 'subscription_cancelled':
        // Subscription cancelled
        console.log('Subscription cancelled:', data.data?.id);
        break;

      default:
        console.log('Unhandled event:', eventName);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
