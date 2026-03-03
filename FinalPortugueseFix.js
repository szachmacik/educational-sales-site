const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'product-translations-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Simple map for common Portuguese translations to be used by the script
const ptTranslationsMap = {
    "plany-zajec-wrzesien": { title: "Planos de Aula: Setembro", description: "PLANOS DE AULA PARA TODO O MÊS DE SETEMBRO correlacionados com o conjunto de OUTONO." },
    "plany-zajec-wrzesien-kopia": { title: "Planos de Aula: Outubro", description: "PLANOS DE AULA PARA TODO O MÊS DE OUTUBRO correlacionados com o conjunto de OUTONO." },
    "plany-zajec-listopad": { title: "Planos de Aula: Novembro", description: "PLANOS DE AULA PARA TODO O MÊS DE NOVEMBRO correlacionados com o conjunto de OUTONO." },
    "plany-zajec-grudzien": { title: "Planos de Aula: Dezembro", description: "PLANOS DE AULA PARA TODO O MÊS DE DEZEMBRO correlacionados com o conjunto de INVERNO." },
    "plany-zajec-styczen": { title: "Planos de Aula: Janeiro", description: "PLANOS DE AULA PARA TODO O MÊS DE JANEIRO correlacionados com o conjunto de INVERNO." },
    "plany-zajec-luty": { title: "Planos de Aula: Fevereiro", description: "PLANOS DE AULA PARA TODO O MÊS DE FEVEREIRO correlacionados com o conjunto de INVERNO." },
    "plany-zajec-marzec": { title: "Planos de Aula: Março", description: "PLANOS DE AULA PARA TODO O MÊS DE MARÇO correlacionados com o conjunto de PRIMAVERA." },
    "plany-zajec-kwiecien": { title: "Planos de Aula: Abril", description: "PLANOS DE AULA PARA TODO O MÊS DE ABRIL correlacionados com o conjunto de PRIMAVERA." },
    "plany-zajec-maj": { title: "Planos de Aula: Maio", description: "PLANOS DE AULA PARA TODO O MÊS DE MAIO correlacionados com o conjunto de PRIMAVERA." },
    "plany-zajec-czerwiec": { title: "Planos de Aula: Junho", description: "PLANOS DE AULA PARA TODO O MÊS DE JUNHO correlacionados com o conjunto de VERÃO." },
    "special-lesson-vol-2": { title: "Lição Especial: Vol 2", description: "Materiais prontos para uma lição de inglês fascinante e criativa." },
    "pakiet-materialow-na-4-pory-roku": { title: "Pacote de Materiais: 4 Estações", description: "Um conjunto abrangente de materiais didáticos para todas as estações do ano." },
    "pakiet-stories-ebooki-audio-na-4-pory-roku": { title: "Pacote Stories: 4 Estações (E-book + Audio)", description: "Histórias envolventes para crianças em formato e-book e áudio." },
    "stories-na-zime-ebook-audio": { title: "Histórias de Inverno (E-book + Audio)", description: "Contos de inverno com materiais de áudio para aulas de inglês." },
    "stories-na-wiosne-ebook-audio": { title: "Histórias de Primavera (E-book + Audio)", description: "Contos de primavera com materiais de áudio para aulas de inglês." },
    "stories-na-lato-ebook-audio": { title: "Histórias de Verão (E-book + Audio)", description: "Contos de verão com materiais de áudio para aulas de inglês." },
    "stories-na-jesien-ebook-audio": { title: "Histórias de Outono (E-book + Audio)", description: "Contos de outono com materiais de áudio para aulas de inglês." },
    "the-uk-ireland-materialy-kulturowe-pakiet": { title: "Pacote Cultural: Reino Unido e Irlanda", description: "Materiais sobre a cultura e tradições britânicas e irlandesas." },
    "interaktywne-quizy-kulturowe": { title: "Quizzes Culturais Interativos", description: "Quizzes interativos sobre a cultura dos países de língua inglesa." },
    "wales-lekcja-kulturowa": { title: "Canto Cultural: País de Gales", description: "Lição temática sobre as tradições e símbolos do País de Gales." },
    "ireland-lekcja-kulturowa-kopia": { title: "Canto Cultural: Irlanda", description: "Lição temática sobre as tradições e símbolos da Irlanda." },
    "england-lekcja-kulturowa": { title: "Canto Cultural: Inglaterra", description: "Lição temática sobre as tradições e símbolos da Inglaterra." },
    "scotland-materialy-kulturowe": { title: "Canto Cultural: Escócia", description: "Lição temática sobre as tradições e símbolos da Escócia." },
    "kulturowa-lekcja-pokazowa-london-tour": { title: "London Tour: Lição de Demonstração", description: "Uma lição interativa sobre a capital da Grã-Bretanha." },
    "pumpking-day": { title: "Pumpkin Day: Materiais", description: "Planos de aula e materiais criativos para o Dia da Abóbora." },
    "guy-fawkes-day-bonfire-night": { title: "Guy Fawkes Day: Noite da Fogueira", description: "Lição histórica e cultural sobre a tradição britânica." },
    "dzien-jezykow": { title: "Dia das Línguas Europeias", description: "Materiais para celebrar a diversidade linguística na escola." },
    "dzien-zwierzat": { title: "Dia dos Animais", description: "Atividades e materiais temáticos sobre o mundo animal." },
    "easter": { title: "Materiais de Páscoa: Mega Pack", description: "Um enorme conjunto de materiais para as lições de Páscoa." },
    "dzien-australii": { title: "Dia da Austrália", description: "Descubra a cultura e a vida selvagem da Austrália com estes materiais." },
    "merry-christmas-pack": { title: "Merry Christmas Pack", description: "O maior conjunto de materiais de Natal para as suas aulas." },
    "przedszkole-pakiet-materialow-na-jesien": { title: "Jardim de Infância: Pacote de Outono", description: "Materiais perfeitamente adaptados para as crianças mais novas." }
};

function addPtTranslations() {
    let lines = content.split('\n');
    let newContent = "";
    let i = 0;

    while (i < lines.length) {
        let line = lines[i];
        newContent += line + '\n';

        // Find product keys
        let match = line.match(/"([^"]+)":\s*{/);
        if (match) {
            let productId = match[1];
            // Check if pt already exists in this block
            let j = i + 1;
            let hasPt = false;
            let endOfBlock = false;
            let bracketCount = 1;

            while (j < lines.length && bracketCount > 0) {
                if (lines[j].includes('pt:')) hasPt = true;
                if (lines[j].includes('{')) bracketCount += (lines[j].match(/{/g) || []).length;
                if (lines[j].includes('}')) bracketCount -= (lines[j].match(/}/g) || []).length;
                if (bracketCount === 0) break;
                j++;
            }

            if (!hasPt && ptTranslationsMap[productId]) {
                // Insert pt translation before the closing bracket of the product object
                // But wait, it's easier to find the end of the block and insert before it
                // Actually j is at the closing bracket of the product object
                let insertionPos = newContent.lastIndexOf('\n'); // Go back to start of line j

                // We need to rebuild from the start... this is complex.
            }
        }
        i++;
    }
}

// Instead of complex logic, I'll use a safer regex replacement for known missing PT ones
// This is less risky than parsing.

Object.keys(ptTranslationsMap).forEach(id => {
    const pt = ptTranslationsMap[id];
    const ptString = `        pt: { title: "${pt.title}", description: "${pt.description}" },\n    }`;

    // Look for the end of the product object for this specific ID
    // Match ID, any content, then the closing brace of the main object, ensuring no PT exists
    const regex = new RegExp(`("${id}":\\s*{[^}]*(?!pt:)[^}]*)(\n\\s*})`, 'g');
    if (content.match(regex)) {
        content = content.replace(regex, `$1\n${ptString}`);
        console.log(`Added PT for ${id}`);
    }
});

fs.writeFileSync(filePath, content, 'utf8');
