const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'public', 'locales');

const translations = {
    en: {
        seo: {
            title: "Educational Materials for English Teachers | Kamila Łobko-Koziej",
            description: "Creative teaching materials, lesson plans, year-round projects, and ready-made packages for English teachers."
        },
        hero: {
            badge: "Materials for Teachers",
            title: "Teach English with Passion and Ease",
            subtitle: "Creative teaching materials that will transform your lessons. Save time on preparation and inspire your students every day.",
            cta_main: "Browse materials",
            cta_secondary: "About the author"
        },
        contact: {
            title: "Get in Touch",
            subtitle: "Got a question about materials? Need support in choosing a package? Write to us or talk to our AI assistant. We are here for you!",
            aiBadge: "We usually respond in 2 hours",
            trustBadge: "Over 5000 satisfied teachers",
            emailTitle: "Write an email",
            emailDesc: "Our inbox is open 24/7 for you.",
            phoneTitle: "Call us",
            phoneDesc: "Mon-Fri from 9:00 to 17:00 we are on the phone.",
            formTitle: "Contact Form",
            addressTitle: "Headquarters",
            addressValue: "Warsaw, Educational St 123",
            aiHelp: "Need a quick answer?",
            aiHelpDesc: "Our smart assistant knows the answers to most common questions. Ask about products, teaching methods, or material availability.",
            aiHelpMobile: "AI Assistant is available in the bottom corner of the screen.",
            form: {
                name: "Name & Surname",
                email: "E-mail",
                subject: "Subject",
                message: "Your message",
                messagePlaceholder: "How can we help you?",
                sending: "Sending...",
                send: "Send Message",
                success: "Message sent!",
                successDesc: "Thank you for contacting us. We will respond as soon as possible."
            }
        },
        login: {
            title: "Welcome back!",
            desc: "Enter your email to enter the student zone.",
            student: "Student",
            teacher: "Teacher",
            email: "Email",
            emailTeacher: "Work Email",
            password: "Password",
            loggingIn: "Logging in...",
            success: "Logged in!",
            submit: "Log In",
            successMessage: "Successfully logged in! Redirecting...",
            errorDefault: "Invalid email or password.",
            errorSystem: "A login error occurred. Please try again.",
            emailRequired: "Email is required",
            emailInvalid: "Invalid email format",
            passwordRequired: "Password is required",
            passwordMin: "Password must be at least 4 characters"
        },
        checkout: {
            nipNotFound: "Company not found",
            nipSearchError: "Error during search. Please try again."
        },
        quickSale: {
            title: "QUICK PAYMENT",
            demoProduct: {
                title: "Example Premium E-book",
                excerpt: "This is a demonstration product. In the full version, data would be fetched from the database."
            },
            page: {
                guarantee: "30-day satisfaction guarantee",
                totalLabel: "Total to pay:",
                email_label: "Your e-mail",
                email_placeholder: "address@email.com",
                payment_method: "Payment method",
                payment_card: "Card",
                blik_code: "BLIK code",
                terms: "I accept the store terms",
                pay_btn: "I buy and pay",
                secure_checkout: "SSL encrypted connection"
            },
            optimization: {
                timer: {
                    text: "Your offer expires in:"
                },
                social_proof: {
                    viewing: "{count} people are viewing this offer"
                },
                savings: "You save"
            },
            bump: {
                yes_btn: "YES, add to my order",
                price_prefix: "only",
                description: "One-time offer! Add a set of ready-to-use worksheets (PDF)."
            }
        },
        verify: {
            title: "Certificate Verification",
            subtitle: "Enter the certificate verification code to confirm its authenticity.",
            placeholder: "XXXX-XXXX-XXXX",
            success: {
                title: "Certificate Verified",
                desc: "This certificate is authentic and was issued by our platform.",
                user: "Participant",
                course: "Course",
                date: "Completion Date",
                code: "Code",
                view: "View Certificate"
            },
            error: {
                title: "Certificate Not Found",
                desc: "We did not find a certificate with the given code. Please check if the code is correct."
            }
        },
        errors: {
            404: {
                title: "404",
                message: "Page not found.",
                back: "Return to home page"
            }
        },
        blog: {
            title: "Blog",
            subtitle: "Articles, tips, and inspiration for English teachers. Learn how to teach more effectively and with more passion.",
            empty: "No blog posts found.",
            readMore: "Read more",
            backToBlog: "Back to blog",
            share: "Share:",
            notFound: "Not found"
        },
        common: {
            loading: "Loading..."
        },
        certificates: {
            title: "Certificate of Completion",
            subtitle: "This is to certify that",
            completedCourse: "has completed the course",
            completionDate: "Completion Date:",
            verificationCode: "Verification Code:",
            downloadPdf: "Download PDF",
            share: "Share",
            backToDashboard: "Back to dashboard",
            styleTitle: "Change certificate style",
            verifiedTitle: "Certificate Verified",
            verifiedDesc: "This certificate was issued by our platform.",
            notFound: "Certificate not found",
            copySuccess: "Link copied to clipboard!"
        }
    }
};

const langs = Object.keys(translations);

langs.forEach(lang => {
    const filePath = path.join(localesDir, lang, 'common.json');
    if (!fs.existsSync(filePath)) return;

    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Merge all sections from translations
        Object.keys(translations[lang]).forEach(section => {
            data[section] = translations[lang][section];
        });

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`[${lang}] Updated common.json`);
    } catch (e) {
        console.error(`[${lang}] Error: ${e.message}`);
    }
});
