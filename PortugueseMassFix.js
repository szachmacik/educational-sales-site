const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'product-translations-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

const ptTranslations = {
    "special-lesson-vol-2": { title: "Lição Especial Vol. 2", description: "Materiais prontos para uma aula de inglês fascinante e criativa." },
    "pakiet-materialow-na-4-pory-roku": { title: "Pacote de Materiais - 4 Estações", description: "Um conjunto abrangente de materiais didáticos para todas as estações do ano." },
    "pakiet-stories-ebooki-audio-na-4-pory-roku": { title: "Pacote Stories: E-books e Áudio das 4 Estações", description: "Histórias envolventes com áudio para cada estação do ano." },
    "stories-na-zime-ebook-audio": { title: "Histórias de Inverno (E-book + Áudio)", description: "Contos de inverno com áudio gravado por falantes nativos." },
    "stories-na-wiosne-ebook-audio": { title: "Histórias de Primavera (E-book + Áudio)", description: "Contos de primavera com áudio gravado por falantes nativos." },
    "stories-na-lato-ebook-audio": { title: "Histórias de Verão (E-book + Áudio)", description: "Contos de verão com áudio gravado por falantes nativos." },
    "stories-na-jesien-ebook-audio": { title: "Histórias de Outono (E-book + Áudio)", description: "Contos de outono com áudio gravado por falantes nativos." },
    "the-uk-ireland-materialy-kulturowe-pakiet": { title: "Pacote Cultural: Reino Unido e Irlanda", description: "Materiais sobre a cultura e tradições dos países de língua inglesa." },
    "interaktywne-quizy-kulturowe": { title: "Quizzes Culturais Interativos", description: "Quizzes sobre a cultura e história dos países anglófonos." },
    "wales-lekcja-kulturowa": { title: "Canto Cultural: País de Gales", description: "Lição temática sobre as tradições e símbolos de Gales." },
    "ireland-lekcja-kulturowa-kopia": { title: "Canto Cultural: Irlanda", description: "Lição temática sobre as tradições e símbolos da Irlanda." },
    "england-lekcja-kulturowa": { title: "Canto Cultural: Inglaterra", description: "Lição temática sobre as tradições e símbolos da Inglaterra." },
    "scotland-materialy-kulturowe": { title: "Canto Cultural: Escócia", description: "Lição temática sobre as tradições e símbolos da Escócia." },
    "kulturowa-lekcja-pokazowa-london-tour": { title: "Canto Cultural: Londres Tour", description: "Uma jornada interativa pela capital da Grã-Bretanha." },
    "pumpking-day": { title: "Dia da Abóbora", description: "Materiais e jogos criativos para celebrar o Pumpkin Day." },
    "guy-fawkes-day-bonfire-night": { title: "Noite da Fogueira (Bonfire Night)", description: "Lição histórica sobre a tradição britânica de Guy Fawkes." },
    "dzien-jezykow": { title: "Dia das Línguas", description: "Celebração da diversidade linguística com atividades escolares." },
    "dzien-zwierzat": { title: "Dia dos Animais", description: "Atividades temáticas sobre o mundo animal para aulas de inglês." },
    "easter": { title: "Especial de Páscoa", description: "Um conjunto completo de materiais para aulas temáticas de Páscoa." },
    "dzien-australii": { title: "Dia da Austrália", description: "Descubra a cultura australiana com materiais interativos." },
    "pakiet-scenariuszy-luty-marzec-kwiecien-maj-czerwiec": { title: "Pacote de Planos de Aula (Fevereiro-Junho)", description: "Planos de aula completos para o segundo semestre letivo." },
    "pakiet-scenariuszy-wrzesien-styczen": { title: "Pacote de Planos de Aula (Setembro-Janeiro)", description: "Planos de aula completos para o primeiro semestre letivo." },
    "pakiet-stories-e-booki-na-4-pory-roku": { title: "Pacote Stories: E-books das 4 Estações", description: "Histórias ilustradas para todas as estações do ano." },
    "angielski-w-zlobku-autumn-pack": { title: "Inglês na Creche: Pacote de Outono", description: "Materiais sensoriais e musicais adaptados para bebês." },
    "angielski-przez-teatr-dla-zerowki-i-klas-1-3": { title: "Inglês através do Teatro (Níveis 0-3)", description: "Peças teatrais e atividades dramáticas para crianças." },
    "merry-christmas-pack": { title: "Merry Christmas Pack", description: "O maior conjunto de materiais de Natal para as suas aulas." },
    "przedszkole-pakiet-materialow-na-jesien": { title: "Educação Infantil: Pacote de Outono", description: "Materiais lúdicos para o início do ano letivo." },
    "przedszkole-pakiet-materialow-na-zime": { title: "Educação Infantil: Pacote de Inverno", description: "Atividades de Natal e inverno para crianças." },
    "przedszkole-pakiet-materialow-na-wszystkie-na-wiosne": { title: "Educação Infantil: Pacote de Primavera", description: "Materiais temáticos sobre a natureza e a Páscoa." },
    "przedszkole-zestaw-materialow-na-lato": { title: "Educação Infantil: Pacote de Verão", description: "Jogos e atividades para o final do ano letivo." },
    "speakbook-my-fairy-tale-character-day": { title: "Speakbook: Dia do Personagem de Conto de Fadas", description: "Lapbook interativo para falar sobre personagens favoritos." },
    "speakbook-my-winter": { title: "Speakbook: Meu Inverno", description: "Atividades criativas sobre a estação fria." },
    "speakbook-my-christmas": { title: "Speakbook: Meu Natal", description: "Um guia interativo para celebrar o Natal." },
    "speakbook-my-grandparents": { title: "Speakbook: Meus Avós", description: "Atividades para o Dia dos Avós." },
    "speakbook-my-pizza-day": { title: "Speakbook: Dia da Pizza", description: "Aprenda sobre comida de forma divertida." },
    "speakbook-my-australia-day": { title: "Speakbook: Dia da Austrália", description: "Explore a cultura australiana." },
    "speakbook-all-about-me": { title: "Speakbook: Tudo Sobre Mim", description: "Atividades de introdução e autoconhecimento." },
    "speakbook-my-day-of-european-languages": { title: "Speakbook: Dia das Línguas Europeias", description: "Celebre a diversidade linguística." },
    "speakbook-my-autumn": { title: "Speakbook: Meu Outono", description: "Atividades sobre a estação das folhas secas." },
    "speakbook-my-pumpkin-day": { title: "Speakbook: Dia da Abóbora", description: "Diversão e aprendizado no dia temático." },
    "day-of-languages-dekoracja-i-gra": { title: "Dia das Línguas: Decoração e Jogo", description: "Tudo o que você precisa para celebrar o Dia das Línguas." },
    "christmas-fun": { title: "Diversão de Natal", description: "Jogos e atividades festivas." },
    "pizza-day": { title: "Dia da Pizza", description: "Lição deliciosa sobre o tema de comida." },
    "grandparents-day-playscript": { title: "Peça: Dia dos Avós", description: "Roteiro de teatro para celebrar os avós." },
    "stories-na-jesien": { title: "Histórias de Outono", description: "Contos temáticos para o outono." },
    "stories-na-zime-ebook": { title: "Histórias de Inverno (E-book)", description: "Versão digital dos contos de inverno." },
    "stories-na-wiosne-ebook": { title: "Histórias de Primavera (E-book)", description: "Versão digital dos contos de primavera." },
    "stories-na-lato-ebook": { title: "Histórias de Verão (E-book)", description: "Versão digital dos contos de verão." },
    "classroom-language": { title: "Linguagem de Sala de Aula", description: "Expressões úteis para alunos e professores." },
    "project-stories-colours-of-the-forest": { title: "Cores da Floresta", description: "Uma história sobre a natureza e cores." },
    "mothers-day": { title: "Dia das Mães", description: "Atividades para celebrar as mães." },
    "childrens-day": { title: "Dia das Crianças", description: "Celebração especial para os pequenos." },
    "oceans-day": { title: "Dia dos Oceanos", description: "Conscientização ambiental e vida marinha." },
    "flashcards-stories-zimia": { title: "Flashcards: Histórias de Inverno", description: "Cartões ilustrados para os contos de inverno." },
    "flashcards-project-stories-jesien": { title: "Flashcards: Histórias de Outono", description: "Cartões ilustrados para os contos de outono." },
    "culture-posters": { title: "Pôsteres Culturais", description: "Decoração educativa sobre países anglófonos." },
    "napisy-do-dekoracji-sali": { title: "Letreiros para Decoração", description: "Nomes e frases para decorar sua sala de aula." },
    "spring-summer-english-learning-challenge": { title: "Desafio de Inglês Primavera-Verão", description: "Atividades para manter o inglês ativo no calor." },
    "stories-na-zime-audio-2": { title: "Áudio: Histórias de Inverno", description: "Gravações profissionais dos contos de inverno." },
    "stories-na-lato-audio": { title: "Áudio: Histórias de Verão", description: "Gravações profissionais dos contos de verão." },
    "stories-na-jesien-audio": { title: "Áudio: Histórias de Outono", description: "Gravações profissionais dos contos de outono." },
    "holiday-photos-warm-up": { title: "Aquecimento: Fotos de Férias", description: "Atividade de fala baseada em fotos." },
    "winter-i-spy": { title: "Winter I Spy", description: "Jogo visual temático de inverno." },
    "dzien-kropki-dot-day": { title: "Dia do Ponto (Dot Day)", description: "Atividades para estimular a criatividade." },
    "plany-zajec-wrzesien": { title: "Planos de Aula: Setembro", description: "Planos de aula completos para o mês de setembro." },
    "plany-zajec-wrzesien-kopia": { title: "Planos de Aula: Outubro", description: "Planos de aula completos para o mês de outubro." },
    "plany-zajec-listopad": { title: "Planos de Aula: Novembro", description: "Planos de aula completos para o mês de novembro." },
    "plany-zajec-grudzien": { title: "Planos de Aula: Dezembro", description: "Planos de aula completos para o mês de dezembro." },
    "plany-zajec-styczen": { title: "Planos de Aula: Janeiro", description: "Planos de aula completos para o mês de janeiro." },
    "plany-zajec-luty": { title: "Planos de Aula: Fevereiro", description: "Planos de aula completos para o mês de fevereiro." },
    "plany-zajec-marzec": { title: "Planos de Aula: Março", description: "Planos de aula completos para o mês de março." },
    "plany-zajec-kwiecien": { title: "Planos de Aula: Abril", description: "Planos de aula completos para o mês de abril." },
    "plany-zajec-maj": { title: "Planos de Aula: Maio", description: "Planos de aula completos para o mês de maio." },
    "plany-zajec-czerwiec": { title: "Planos de Aula: Junho", description: "Planos de aula completos para o mês de junho." }
};

Object.keys(ptTranslations).forEach(id => {
    const pt = ptTranslations[id];
    const ptEntry = `        pt: { title: "${pt.title}", description: "${pt.description}" },`;

    // Safer replacement: find the end of the product block and insert before it
    // A product block ends with }, followed by another product ID or the end of the object.
    const regex = new RegExp(`("${id}":\\s*{[^}]*(?!pt:)[^}]*)(\\s*})`, 'g');
    if (content.match(regex)) {
        content = content.replace(regex, `$1\n${ptEntry}$2`);
        console.log(`Added PT for ${id}`);
    }
});

fs.writeFileSync(filePath, content, 'utf8');
