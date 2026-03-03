const fs = require('fs');
const path = require('path');

const enCommonPath = 'c:/Users/kamil/.gemini/antigravity/scratch/educational-sales-site/public/locales/en/common.json';
let content = fs.readFileSync(enCommonPath, 'utf8');

// Broad search and replace for common Polish terms that keep appearing
const broadFixes = {
    "Telefon (opcjonalnie)": "Phone (optional)",
    "Twoje zamówienie": "Your order",
    "Razem": "Total",
    "Po płatności materiały dostępne od razu w panelu": "Materials available immediately after payment",
    "+2,500 nauczycieli już kupiło": "+2,500 teachers already joined",
    "Do zapłaty": "To pay",
    "Zadaj pytanie...": "Ask a question...",
    "Wpisz imię i e-mail...": "Enter name and email...",
    "Tak, jestem klientem": "Yes, I am a customer",
    "Nie, jeszcze nie": "No, not yet",
    "Świetnie! W czym mogę Ci dzisiaj pomóc?": "Great! How can I help you today?",
    "Rozumiem. Chętnie Ci pomogę poznać nasze materiały. Jak masz na imię i na jaki e-mail mogę przesłać Ci darmowe próbki naszych materiałów?": "I see. I'd love to help you explore our materials. What is your name and email so I can send you some free samples?",
    "Dziękuję! Zapisałem Twoje dane. Teraz śmiało pytaj o co chcesz.": "Thank you! I saved your details. Now feel free to ask anything.",
    "Zalogowano pomyślnie! Przekierowywanie...": "Successfully logged in! Redirecting...",
    "Nieprawidłowy email lub hasło.": "Invalid email or password.",
    "Wystąpił błąd logowania. Spróbuj ponownie.": "A login error occurred. Please try again.",
    "Email jest wymagany": "Email is required",
    "Nieprawidłowy format email": "Invalid email format",
    "Hasło jest wymagane": "Password is required",
    "Hasło musi mieć min. 4 znaki": "Password must be at least 4 characters",
    "ukończył/a kurs": "has completed the course",
    "Data ukończenia:": "Completion Date:",
    "Kod weryfikacyjny:": "Verification Code:",
    "Pobierz PDF": "Download PDF",
    "Udostępnij": "Share",
    "Wróć do panelu": "Back to dashboard",
    "Zmień styl certyfikatu": "Change certificate style",
    "Certyfikat zweryfikowany": "Certificate Verified",
    "Ten certyfikat został wydany przez naszą platformę.": "This certificate was issued by our platform.",
    "Certyfikat nie znaleziony": "Certificate not found",
    "Link skopiowany do schowka!": "Link copied to clipboard!"
};

for (const [pl, en] of Object.entries(broadFixes)) {
    const regex = new RegExp(pl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    content = content.replace(regex, en);
}

fs.writeFileSync(enCommonPath, content);
console.log('Final broad cleanup of en/common.json complete.');
