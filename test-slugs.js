const productsData = require('./lib/data/products.json');
const { slugify } = require('./lib/slugify');

function getSlug(product) {
    const match = product.url.match(/\/product\/([^\/]+)\/?$/);
    return match ? match[1] : 'FALLBACK-' + (product.title ? product.title.substring(0, 20) : product.id);
}

const targetSlug = 'pakiet-wszystkich-scenariuszy-wrzesien-czerwiec';
const found = productsData.filter(p => {
    const s = getSlug(p);
    return s === targetSlug;
});

console.log('Target Slug:', targetSlug);
console.log('Found Count:', found.length);
if (found.length > 0) {
    console.log('Found Product ID:', found[0].id);
    console.log('Found Product Title:', found[0].title);
    console.log('Found Product URL:', found[0].url);
} else {
    console.log('No product matched this slug exactly.');
    // Check for partial matches or slugify result
    productsData.forEach(p => {
        if (p.title.includes('scenariuszy')) {
            console.log('Partial Match Title:', p.title);
            console.log('Generated Slug:', getSlug(p));
        }
    });
}
