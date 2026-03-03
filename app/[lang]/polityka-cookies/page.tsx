
export const dynamic = 'force-dynamic';
import PolitykaPrywatnosciPage from "../polityka-prywatnosci/page";

// The cookies policy shares the exact same document structure as the privacy policy.
// It is split under the LEGAL_DOCUMENTS['cookies'] object. We reuse the page component.
export default function PolitykaCookiesPage() {
    return <PolitykaPrywatnosciPage />;
}
