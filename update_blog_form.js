const fs = require('fs');
const path = require('path');

const plPath = "C:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site\\public\\locales\\pl\\admin.json";
const enPath = "C:\\Users\\kamil\\.gemini\\antigravity\\scratch\\educational-sales-site\\public\\locales\\en\\admin.json";

function updateLocale(filePath, formTranslations) {
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (!data.blog) data.blog = {};
        data.blog.form = formTranslations;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Successfully updated ${path.basename(filePath)}`);
    } catch (error) {
        console.error(`Error updating ${filePath}:`, error);
        process.exit(1);
    }
}

const plForm = {
    "createTitle": "Nowy wpis",
    "createSubtitle": "Utwórz nowy wpis blogowy",
    "editTitle": "Edytuj wpis",
    "editSubtitle": "Edytuj istniejący wpis blogowy",
    "titlePlaceholder": "Tytuł wpisu...",
    "contentTitle": "Treść",
    "contentPlaceholder": "Zacznij pisać treść wpisu...",
    "excerptTitle": "Zajawka",
    "excerptPlaceholder": "Krótki opis wyświetlany na liście wpisów...",
    "statusTitle": "Status",
    "categoryTitle": "Kategoria",
    "categoryPlaceholder": "Wybierz kategorię",
    "tagsTitle": "Tagi",
    "tagsPlaceholder": "tag1, tag2, tag3",
    "imageTitle": "Obrazek wyróżniający",
    "imagePlaceholder": "https://kamila.shor.dev/image.jpg",
    "seoTitle": "SEO",
    "metaTitleLabel": "Meta Title",
    "metaTitlePlaceholder": "Tytuł dla wyszukiwarek",
    "metaDescLabel": "Meta Description",
    "metaDescPlaceholder": "Opis dla wyszukiwarek",
    "charCount": "{count}/{max} znaków",
    "seoPreview": "Podgląd w Google",
    "generate": "Generuj",
    "save": "Zapisz",
    "saveChanges": "Zapisz zmiany",
    "saving": "Zapisywanie...",
    "delete": "Usuń",
    "notFound": "Wpis nie znaleziony",
    "backToList": "Wróć do listy",
    "titleRequired": "Najpierw wprowadź tytuł"
};

const enForm = {
    "createTitle": "New Post",
    "createSubtitle": "Create a new blog post",
    "editTitle": "Edit Post",
    "editSubtitle": "Edit existing blog post",
    "titlePlaceholder": "Post title...",
    "contentTitle": "Content",
    "contentPlaceholder": "Start writing post content...",
    "excerptTitle": "Excerpt",
    "excerptPlaceholder": "Short description displayed on post list...",
    "statusTitle": "Status",
    "categoryTitle": "Category",
    "categoryPlaceholder": "Select category",
    "tagsTitle": "Tags",
    "tagsPlaceholder": "tag1, tag2, tag3",
    "imageTitle": "Featured Image",
    "imagePlaceholder": "https://kamila.shor.dev/image.jpg",
    "seoTitle": "SEO",
    "metaTitleLabel": "Meta Title",
    "metaTitlePlaceholder": "Search engine title",
    "metaDescLabel": "Meta Description",
    "metaDescPlaceholder": "Search engine description",
    "charCount": "{count}/{max} characters",
    "seoPreview": "Google Preview",
    "generate": "Generate",
    "save": "Save",
    "saveChanges": "Save Changes",
    "saving": "Saving...",
    "delete": "Delete",
    "notFound": "Post not found",
    "backToList": "Back to list",
    "titleRequired": "Please enter a title first"
};

updateLocale(plPath, plForm);
updateLocale(enPath, enForm);
