const fs = require('fs');
const path = require('path');

// This is a simplified mock of an AI translation function.
// In a real scenario, this would call a translation API.
// Since I am an AI, I will generate the translation script 
// that I can then run to apply the translations I generate.
// But wait, I can just write the data directly in a loop here.

const tsFile = 'lib/product-translations-data.ts';
let content = fs.readFileSync(tsFile, 'utf8');

// I will focus on Portuguese (pt) first as it was the most missing.
// For the sake of this autonomous task, I will use the English titles/descriptions 
// as placeholders where I don't have the PT translation immediately, 
// OR I will generate the PT translations now.

const missingPtProducts = [
    "stories-na-lato-ebook", "classroom-language", "project-stories-colours-of-the-forest",
    "mothers-day", "childrens-day", "oceans-day", "flashcards-stories-zimia",
    "flashcards-project-stories-jesien", "culture-posters", "napisy-do-dekoracji-sali",
    "spring-summer-english-learning-challenge", "stories-na-zime-audio-2",
    "stories-na-lato-audio", "stories-na-jesien-audio", "holiday-photos-warm-up",
    "winter-i-spy", "dzien-kropki-dot-day"
];

// Translations for PT (Portuguese)
const ptTranslations = {
    "stories-na-lato-ebook": { title: "Stories de Verão Ebook", description: "Ebook interativo com histórias de verão para crianças." },
    "classroom-language": { title: "Linguagem de Sala de Aula", description: "Cartazes e cartões com frases essenciais para a sala de aula de inglês." },
    "project-stories-colours-of-the-forest": { title: "Cores da Floresta", description: "Projeto de histórias focado em cores e elementos da natureza." },
    "mothers-day": { title: "Dia da Mãe", description: "Materiais e atividades especiais para o Dia da Mãe." },
    "childrens-day": { title: "Dia da Criança", description: "Pacote de celebração com jogos e atividades para o Dia da Criança." },
    "oceans-day": { title: "Dia dos Oceanos", description: "Materiais educativos sobre a vida marinha e conservação dos oceanos." },
    "flashcards-stories-zimia": { title: "Flashcards de Histórias de Inverno", description: "Conjunto de cartões ilustrados para acompanhar as histórias de inverno." },
    "flashcards-project-stories-jesien": { title: "Flashcards de Histórias de Outono", description: "Conjunto de cartões ilustrados para o projeto de outono." },
    "culture-posters": { title: "Cartazes Culturais", description: "Cartazes informativos sobre a cultura de países de língua inglesa." },
    "napisy-do-dekoracji-sali": { title: "Decorações para Sala de Aula", description: "Letreiros e elementos decorativos para criar um ambiente de imersão em inglês." },
    "spring-summer-english-learning-challenge": { title: "Desafio de Inglês Primavera-Verão", description: "Calendário de atividades e desafios para aprender inglês durante as férias." },
    "stories-na-zime-audio-2": { title: "Histórias de Inverno Áudio Vol. 2", description: "Gravações de áudio profissionais de histórias temáticas de inverno." },
    "stories-na-lato-audio": { title: "Histórias de Verão Áudio", description: "Coleção de áudios com histórias divertidas de verão." },
    "stories-na-jesien-audio": { title: "Histórias de Outono Áudio", description: "Áudios imersivos para acompanhar as aulas de outono." },
    "holiday-photos-warm-up": { title: "Aquecimento com Fotos de Férias", description: "Atividade interativa para começar as aulas falando sobre as férias." },
    "winter-i-spy": { title: "Eu Vejo no Inverno", description: "Jogo visual temático de inverno para desenvolver vocabulário." },
    "dzien-kropki-dot-day": { title: "Dia do Ponto", description: "Atividades criativas e materiais para celebrar o Dia do Ponto." }
};

// Apply PT translations
const lines = content.split(/\r?\n/);
let outputLines = [];
let currentProduct = null;

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const productMatch = line.match(/^\s*"([^"]+)": \{/);
    if (productMatch) {
        currentProduct = productMatch[1];
    }

    if (currentProduct && ptTranslations[currentProduct] && (line.trim() === '},' || line.trim() === '}')) {
        // Check if pt already exists just before the closing brace
        let hasPt = false;
        for (let j = outputLines.length - 1; j >= 0 && !outputLines[j].includes('": {'); j--) {
            if (outputLines[j].trim().startsWith('pt:')) {
                hasPt = true;
                break;
            }
        }

        if (!hasPt) {
            const { title, description } = ptTranslations[currentProduct];
            // Ensure previous line has a comma
            if (outputLines.length > 0) {
                let lastIdx = outputLines.length - 1;
                if (outputLines[lastIdx].trim().endsWith('}') && !outputLines[lastIdx].trim().endsWith('},')) {
                    outputLines[lastIdx] = outputLines[lastIdx].trimEnd().replace(/}$/, '},');
                }
            }
            outputLines.push(`        pt: { title: "${title}", description: "${description}" },`);
        }
        currentProduct = null;
    }
    outputLines.push(line);
}

fs.writeFileSync(tsFile, outputLines.join('\n'));
console.log("Successfully applied Portuguese translations.");
