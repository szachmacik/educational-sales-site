const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/kamil/.gemini/antigravity/scratch/educational-sales-site/lib/translations.ts';
let content = fs.readFileSync(filePath, 'utf8');

const additionalNamespaces = "\n        socialProof: {\n            header: \"Facebook Community\",\n            sub: \"Stay up to date with news and join the discussion!\",\n            cta: \"See our profile full of inspiration\"\n        },\n        cart: {\n            empty: \"Your cart is empty\",\n            emptySub: \"Add products to continue shopping\",\n            browse: \"Browse products\",\n            reserved: \"Your cart is reserved for:\",\n            header: \"Cart ({count})\",\n            remove: \"Remove\",\n            specialOffer: \"SPECIAL OFFER\",\n            orderBump: \"Add email template pack (+29 zł)\",\n            orderBumpDesc: \"20 ready-to-use templates for parent communication. Save 70%!\",\n            summary: \"Summary\",\n            couponPlaceholder: \"Discount code\",\n            apply: \"Apply\",\n            couponHeader: \"Coupon:\",\n            products: \"Products\",\n            discount: \"Discount\",\n            total: \"Total\",\n            checkout: \"Proceed to checkout\",\n            secure: \"Secure payment\"\n        },\n        checkout: {\n            acceptTermsError: \"You must accept the terms and conditions\",\n            successTitle: \"Thank you for your order!\",\n            successOrder: \"Your order no. {orderNumber} has been received.\",\n            successEmail: \"We have sent the order details to the provided email address.\",\n            backToStore: \"Back to store\",\n            myCourses: \"My courses\",\n            backToCart: \"Back to cart\",\n            steps: { cart: \"Cart\", payment: \"Payment\", access: \"Access\" },\n            trust: { secure: \"Secure payment\", ssl: \"SSL Encryption\", instant: \"Instant access\" },\n            header: \"Complete your order\",\n            contactTitle: \"Contact information\",\n            email: \"Email *\",\n            firstName: \"First name *\",\n            lastName: \"Last name *\",\n            phone: \"Phone (optional)\",\n            invoiceTitle: \"Invoice\",\n            wantInvoice: \"I want to receive a VAT invoice\",\n            nip: \"Tax ID (NIP) *\",\n            nipError: \"Enter a correct 10-digit Tax ID\",\n            lookup: \"Fetch data\",\n            lookupSuccess: \"Company data fetched!\",\n            companyName: \"Company name *\",\n            companyAddress: \"Company address\",\n            addressPlaceholder: \"Will be filled automatically\",\n            paymentTitle: \"Payment method\",\n            paymentMethods: {\n                card: \"Payment card\",\n                cardSub: \"Visa, Mastercard, American Express\",\n                blik: \"BLIK\",\n                blikSub: \"Fast BLIK code payment\",\n                transfer: \"Bank transfer\",\n                transferSub: \"Traditional bank transfer\"\n            },\n            yourOrder: \"Your order\",\n            summaryProducts: \"Products\",\n            summaryDiscount: \"Discount ({code})\",\n            summaryTotal: \"Total\",\n            terms: \"I accept the store terms and conditions and privacy policy\",\n            termsRequired: \"Required to complete the order\",\n            processing: \"Processing...\",\n            pay: \"Pay {total} zł\",\n            instantAccessInfo: \"After payment, materials are available immediately in the panel\",\n            socialProof: \"+2,500 teachers have already bought\",\n            toPayMobile: \"To pay\"\n        },";

const languagesToUpdate = ['de', 'es', 'fr', 'it', 'cs', 'sk', 'ro', 'hu', 'pt', 'lt', 'lv', 'et', 'hr', 'sr', 'sl', 'bg', 'el'];

languagesToUpdate.forEach(lang => {
    const langKey = "    " + lang + ": {";
    const startIndex = content.indexOf(langKey);
    if (startIndex === -1) {
        console.log("Could not find start for " + lang);
        return;
    }

    const footerStart = content.indexOf("footer: {", startIndex);
    if (footerStart === -1) {
        console.log("Could not find footer for " + lang);
        return;
    }

    // Find the end of footer object
    let openBraces = 0;
    let footerEndIndex = -1;
    const searchContent = content.substring(footerStart);
    for (let i = 0; i < searchContent.length; i++) {
        if (searchContent[i] === '{') openBraces++;
        if (searchContent[i] === '}') {
            openBraces--;
            if (openBraces === 0) {
                footerEndIndex = footerStart + i;
                break;
            }
        }
    }

    if (footerEndIndex !== -1) {
        const nextClosingBrace = content.indexOf('}', footerEndIndex + 1);
        if (nextClosingBrace !== -1) {
            content = content.substring(0, nextClosingBrace) + additionalNamespaces + content.substring(nextClosingBrace);
        }
    }
});

fs.writeFileSync(filePath, content);
console.log('Successfully updated all languages.');
