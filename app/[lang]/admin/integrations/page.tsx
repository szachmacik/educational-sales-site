
import { redirect } from "next/navigation";

export default async function IntegrationsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    redirect(`/${lang}/admin/settings?tab=channels`);
}
