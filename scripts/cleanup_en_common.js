const fs = require('fs');
const path = require('path');

const enCommonPath = 'c:/Users/kamil/.gemini/antigravity/scratch/educational-sales-site/public/locales/en/common.json';
const enCommon = JSON.parse(fs.readFileSync(enCommonPath, 'utf8'));

const fixes = {
    "checkout.acceptTermsError": "You must accept the terms and conditions",
    "checkout.successTitle": "Thank you for your order!",
    "checkout.successOrder": "Your order #{orderNumber} has been received.",
    "checkout.successEmail": "Order details have been sent to your email address.",
    "checkout.backToStore": "Back to store",
    "checkout.myCourses": "My courses",
    "checkout.backToCart": "Back to cart",
    "checkout.steps.cart": "Cart",
    "checkout.steps.payment": "Payment",
    "checkout.steps.access": "Access",
    "checkout.trust.secure": "Secure Payment",
    "checkout.trust.ssl": "SSL Encryption",
    "checkout.trust.instant": "Instant Access",
    "checkout.header": "Complete your order",
    "checkout.contactTitle": "Contact information",
    "checkout.firstName": "First Name *",
    "checkout.lastName": "Last Name *",
    "checkout.invoiceTitle": "Invoice",
    "checkout.wantInvoice": "I want to receive a VAT invoice",
    "checkout.nip": "VAT ID / Tax No. *",
    "checkout.lookup": "Fetch data",
    "checkout.lookupSuccess": "Company details fetched successfully!",
    "checkout.companyName": "Company Name *",
    "checkout.companyAddress": "Company Address",
    "checkout.addressPlaceholder": "Will be filled automatically",
    "checkout.paymentTitle": "Payment Method",
    "checkout.paymentMethods.card": "Credit Card",
    "checkout.paymentMethods.blik": "BLIK",
    "checkout.paymentMethods.blikSub": "Quick payment with BLIK code",
    "checkout.paymentMethods.transfer": "Bank Transfer",
    "checkout.paymentMethods.transferSub": "Traditional bank transfer",
    "checkout.summaryProducts": "Products",
    "checkout.summaryDiscount": "Discount ({code})",
    "checkout.summaryTotal": "Total",
    "checkout.terms": "I accept the store terms and privacy policy",
    "checkout.termsRequired": "Required for order processing",
    "checkout.processing": "Processing...",
    "checkout.pay": "Pay {total}",
    "checkout.instantAccessInfo": "Materials available in the panel immediately after payment",
    "checkout.socialProof": "Over 2,500 teachers have already joined",
    "checkout.toPayMobile": "To pay",
    "contact.form.placeholders.subject": "Product inquiry...",
    "contact.form.placeholders.message": "Describe how we can help...",
    "contact.aiChat.title": "AI Assistant",
    "contact.aiChat.status": "Online & Ready",
    "contact.aiChat.thinking": "Thinking...",
    "contact.aiChat.inputPlaceholder": "Ask a question...",
    "contact.aiChat.dataInputPlaceholder": "Enter name and email...",
    "contact.aiChat.welcome": "Hi! I am your smart assistant. Before we start, are you already our customer?",
    "contact.aiChat.options.yes": "Yes, I am a customer",
    "contact.aiChat.options.no": "No, not yet",
    "contact.aiChat.responses.clientYes": "Great! How can I help you today?",
    "contact.aiChat.responses.clientNo": "I see. I'd love to help you explore our materials. What is your name and email so I can send you some free samples?",
    "contact.aiChat.responses.dataSaved": "Thank you! I've saved your details. Now feel free to ask anything.",
    "contact.aiChat.responses.fallback": "I'm sorry, I don't quite understand. Could you rephrase it? You can ask about pricing, delivery, or teaching methods.",
    "contact.aiChat.knowledge.price": "Our PDF materials start at $29. Annual packages (Mega Pack) are currently on sale for $149.",
    "contact.aiChat.knowledge.delivery": "All materials are digital. You will receive a download link immediately after payment.",
    "contact.aiChat.knowledge.preschool": "We have a great 'English in Preschool' section. I especially recommend our 4 Seasons pack.",
    "contact.aiChat.knowledge.contact": "You can email us or call +1 234 567 890 (Mon-Fri 9:00-17:00).",
    "contact.aiChat.knowledge.invoice": "Yes, we issue VAT invoices. You can provide invoice details in the cart.",
    "contact.aiChat.knowledge.methods": "Kamila Łobko-Koziej promotes a play-based approach (TPR, communicative games). Check our blog to learn more!"
};

function deepSet(obj, path, value) {
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
}

for (const [path, value] of Object.entries(fixes)) {
    deepSet(enCommon, path, value);
}

fs.writeFileSync(enCommonPath, JSON.stringify(enCommon, null, 2));
console.log('en/common.json cleaned up.');
