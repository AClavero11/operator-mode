import { NextRequest, NextResponse } from 'next/server';

// Lemon Squeezy product variants
const PRODUCTS = {
  pro: {
    variantId: process.env.LEMONSQUEEZY_PRO_VARIANT_ID || 'YOUR_PRO_VARIANT_ID',
    price: 79,
  },
  team: {
    variantId: process.env.LEMONSQUEEZY_TEAM_VARIANT_ID || 'YOUR_TEAM_VARIANT_ID',
    price: 199,
  },
};

export async function POST(request: NextRequest) {
  try {
    const { tier, email } = await request.json();

    if (!tier || !PRODUCTS[tier as keyof typeof PRODUCTS]) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    const product = PRODUCTS[tier as keyof typeof PRODUCTS];
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;

    if (!apiKey || apiKey === 'YOUR_API_KEY') {
      // Development mode - redirect to placeholder
      return NextResponse.json({
        checkoutUrl: `/checkout/demo?tier=${tier}&price=${product.price}`,
        demo: true,
      });
    }

    // Create Lemon Squeezy checkout
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email: email || undefined,
              custom: {
                tier,
              },
            },
            product_options: {
              redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://operator-mode.fly.dev'}/success`,
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: process.env.LEMONSQUEEZY_STORE_ID,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: product.variantId,
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Lemon Squeezy error:', error);
      return NextResponse.json({ error: 'Payment service error' }, { status: 500 });
    }

    const data = await response.json();
    const checkoutUrl = data.data.attributes.url;

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
