
import { NextResponse } from 'next/server';
import { DEFAULT_PARTNERS } from '@/lib/partner-service';

/**
 * Redirects user to partner site with Kamil's affiliate ID.
 * Implements "Last Click" priority by stripping competing params and forcing Kamil's ID.
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: partnerId } = await params;
    const partner = DEFAULT_PARTNERS.find(p => p.id === partnerId);

    if (!partner) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    const targetUrl = new URL(partner.affiliateBaseUrl);

    // 🛡️ SECURITY: Best practice for commission protection
    // 1. Clean potentially competing affiliate params from the target URL if they exist
    targetUrl.searchParams.delete(partner.affiliateParamName);
    targetUrl.searchParams.delete('aff');
    targetUrl.searchParams.delete('ref');

    // 2. Set Kamil's affiliate ID as the forced parameter
    targetUrl.searchParams.set(partner.affiliateParamName, partner.affiliateId);

    // 3. Optional: Add sub-id or tracking tag to know it came from Kamila English store
    targetUrl.searchParams.set('subid', 'kamila_english_site');

    console.info(`🚀 [Affiliate Redirect] User sent to ${partner.name} via ${targetUrl.toString()}`);

    // Performance: Simple transparent redirect
    const response = NextResponse.redirect(targetUrl.toString());

    // 4. Set a "Last Click" cookie if we wanted internal tracking
    response.cookies.set('last_affiliate_click', partnerId, { maxAge: 60 * 60 * 24 });

    return response;
}
