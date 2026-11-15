// Databáze popisků pro jednotlivé houpačky (Zde si můžeš upravit texty podle libosti!)
const productDescriptions = {
    "Aura Sand": "Designové křeslo Aura Sand přináší do vašeho prostoru teplé, zemité tóny pouštního písku. Je utkáno z nejjemnější organické bavlny, která se perfektně přizpůsobí křivkám těla. Ideální kousek pro skandinávsky laděné interiéry a prosvětlené zimní zahrady, kde vytvoří oázu klidu pro každodenní ranní kávu nebo čtení knih.",
    "Aura Moss": "Odstín Aura Moss oslavuje hluboké tóny lesního mechu a divoké přírody. Tkanina vyniká vysokou gramáží a specifickou texturou příjemnou na dotek. Tato varianta perfektně doplní místnosti s živými rostlinami, dřevěným masivem a minimalistickým nábytkem. Navrženo pro dokonalé splynutí s okolní zahradou.",
    "Aura Earth": "Aura Earth s sebou nese stabilitu a klidnou sílu přírodní hnědé hlíny. Robustní ruční prošití zajišťuje dlouhou životnost i při intenzivním používání. Skvěle se hodí na kryté terasy, balkony nebo do rustikálních obývacích pokojů vedle krbových kamen.",
    "Aura Sky": "Svěží a vzdušný model Aura Sky v barvě letního nebe opticky odlehčí a projasní jakýkoliv prostor. Je velmi oblíbený do moderních dětských pokojů nebo k bazénům díky svému pozitivnímu, relaxačnímu působení.",
    "Aura Stone": "Elegantní šedá klasika Aura Stone je vrcholem nadčasového urbanistického minimalismu. Neutrální tón dává plně vyniknout struktuře dubové rozpěrné tyče. Skvělá volba do industriálních loftů nebo moderních novostaveb.",
    "Aura Night": "Exkluzivní hluboký antracitový odstín Aura Night vyzařuje eleganci a styl. Speciálně upravená vlákna odrážejí světlo tak, že látka působí velmi luxusním dojmem. Skvěle maskuje drobné nečistoty a stane se dominantou interiéru."
};

function navigateTo(pageId) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => section.classList.remove('active'));
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => link.classList.remove('active'));
    const activeSection = document.getElementById('page-' + pageId);
    if(activeSection) activeSection.classList.add('active');
    const activeLink = document.getElementById('nav-' + pageId);
    if(activeLink) activeLink.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

    
// Funkce pro otevření celostránkového detailu produktu
function openProductModal(cardElement) {
    const fullTitle = cardElement.querySelector('h3').innerText; // Např. "Aura Sand (Béžová)"
    const price = cardElement.querySelector('.product-price').innerText;
    
    // Získání čistého názvu pro vyhledání v databázi popisků (vytáhne text před závorkou)
    const shortTitle = fullTitle.split('(')[0].trim(); 
    
    // Načtení popisku z naší databáze (pokud neexistuje, dá univerzální text)
    const descriptionText = productDescriptions[shortTitle] || `Luxusní závěsná houpačka řady ${fullTitle}. Ručně vyrobená s maximálním důrazem na detail a ergonomii sezení. Skvělý společník pro vaše chvíle odpočinku.`;

    // Podpora získání fotky z img i z pozadí (pro exteriér)
    const imgNode = cardElement.querySelector('.product-image-bg img');
    const imgSrc = imgNode ? imgNode.src : window.getComputedStyle(cardElement.querySelector('.product-image-bg')).backgroundImage.slice(5, -2);
    
    // Určení kategorie podle nadpisu gridu
    const isExterior = cardElement.closest('.products-grid').previousElementSibling.innerText.includes('Exteriér');
    const categoryText = isExterior ? "Kolekce Exteriér" : "Kolekce Interiér";
    const materialText = isExterior ? "Zátěžová hydrofobní látka (Cordura)" : "100% Organická bavlna (GOTS)";

    // Vložení dat do celostránkového zobrazení
    document.getElementById('modal-title').innerText = fullTitle;
    document.getElementById('modal-price').innerText = price;
    document.getElementById('modal-image').src = imgSrc;
    document.getElementById('modal-category').innerText = categoryText;
    document.getElementById('modal-material').innerText = materialText;
    document.getElementById('modal-description').innerText = descriptionText;

    

    // Automaticky rozsvítí správné barevné kolečko podle toho, na jakou kartu se kliklo
    setupActiveColorDot(imgSrc);

    // Plynulé zobrazení celostránkového režimu
    document.getElementById('product-modal').classList.add('open');
    document.body.style.overflow = 'hidden'; // Zamezí skrolování původního webu na pozadí
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('open');
    document.body.style.overflow = 'auto'; // Vrátí původnímu webu možnost skrolovat
}

// Automatické navázání prokliků na všechny karty
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('buy-button')) return;
            openProductModal(card);
        });
    });
});

// Interaktivní přepínání barev uvnitř celostránkového detailu
document.addEventListener("DOMContentLoaded", () => {
    const colorDots = document.querySelectorAll('#modal-color-dots .color-dot');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');

    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            // 1. Aktivuje vizuálně kliknuté kolečko
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');

            // 2. Vytáhne nová data z kolečka
            const newImgSrc = dot.getAttribute('data-img');
            const newColorName = dot.getAttribute('data-color');

            // 3. Efekt plynulého prolnutí při změně fotky
            modalImage.style.opacity = '0.3';
            modalImage.style.transition = 'opacity 0.2s ease';

            setTimeout(() => {
                // Vymění zdroj obrázku a texty
                modalImage.src = newImgSrc;
                
                // Dynamicky upraví název v hlavní textu (např. Aura Sand (Zelená))
                const currentTitleBase = modalTitle.innerText.split('(')[0].trim();
                modalTitle.innerText = `${currentTitleBase} (${newColorName})`;
                
                modalImage.style.opacity = '1';
            }, 200);
        });
    });
});

// Malé vylepšení: Při otevření okna automaticky aktivuje správné barevné kolečko podle karty
function setupActiveColorDot(currentImgSrc) {
    const dots = document.querySelectorAll('#modal-color-dots .color-dot');
    dots.forEach(dot => {
        dot.classList.remove('active');
        // Pokud se fotka kolečka shoduje s fotkou z karty, označí ho jako aktivní
        if(currentImgSrc.includes(dot.getAttribute('data-img'))) {
            dot.classList.add('active');
        }
    });
}

// Uprav začátek tvé stávající funkce openProductModal, aby volala setupActiveColorDot:
// Stačí dovnitř openProductModal na úplný konec před otevírací třídu přidat:
// setupActiveColorDot(imgSrc);

// ==========================================================================
// ODESLÁNÍ PŘEDOBJEDNÁVKY NA ÚNOR PŘES FORMSPREE
// ==========================================================================
const ORDER_FORM_URL = 'https://formspree.io';

function isValidAddress(address) {
    if (address.length < 8) return false;
    if (!/\d/.test(address)) return false;
    if (!/[a-zA-ZÀ-ž]{3,}/.test(address)) return false;
    if (/(.)\1{3,}/i.test(address)) return false;
    const letters = address.toLowerCase().replace(/[^a-zà-ž]/g, '');
    if (new Set(letters).size < 4) return false;
    if (!/[aeiouyáéěíóúůý]/i.test(letters)) return false;
    return true;
}

function isValidPhone(phone) {
    const digits = phone.replace(/[\s\-\/()]/g, '');
    return /^(\+|00)?\d{9,12}$/.test(digits);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

async function submitPreorder(event) {
    event.preventDefault(); // Zabrání obnovení stránky

    const form = event.target;
    const productName = document.getElementById('modal-title')?.innerText || 'Neznámý produkt';
    const productPrice = document.getElementById('modal-price')?.innerText || '';

    // Bezpečné načtení hodnot (funguje podle ID i podle typu políčka)
    const name = (document.getElementById('preorder-name') || form.querySelector('input[type="text"]'))?.value.trim() || '';
    const email = (document.getElementById('preorder-email') || form.querySelector('input[type="email"]'))?.value.trim() || '';
    const phone = (document.getElementById('preorder-phone') || form.querySelector('input[type="tel"]'))?.value.trim() || '';
    const address = (document.getElementById('preorder-address') || form.querySelectorAll('input[type="text"]')[1])?.value.trim() || '';

    if (!name || !phone || !address || !email) {
        alert('Vyplňte prosím všechny údaje (jméno, e-mail, telefon i adresu).');
        return;
    }

    if (!isValidAddress(address)) {
        alert('Zadejte prosím skutečnou doručovací adresu, např. „Hlavní 12, 284 01 Kutná Hora“.');
        return;
    }

    if (!isValidPhone(phone)) {
        alert('Zadejte prosím platné telefonní číslo, např. 608 123 456.');
        return;
    }

    if (!isValidEmail(email)) {
        alert('E-mail nemá správný tvar. Zadejte ho prosím ve tvaru jan.novak@email.cz.');
        return;
    }

    const formData = new FormData();
    formData.append('_subject', `Předobjednávka na únor: ${productName} (${name})`);
    formData.append('Produkt', productName);
    formData.append('Cena', productPrice);
    formData.append('Jmeno', name);
    formData.append('Email', email);
    formData.append('_replyto', email);
    formData.append('Telefon', phone);
    formData.append('Adresa', address);

    const btn = document.getElementById('preorder-submit-btn') || form.querySelector('button[type="submit"]');
    if (btn) {
        btn.disabled = true;
        btn.innerText = 'Odesílám předobjednávku…';
    }

    try {
        const response = await fetch(ORDER_FORM_URL, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Chyba serveru ' + response.status);
        }

        alert('Děkujeme za předobjednávku na únor! Brzy se vám ozveme s potvrzením.');
        form.reset();
        if (typeof closeProductModal === 'function') closeProductModal();
    } catch (err) {
        console.error(err);
        alert('Chyba při odesílání: ' + err.message);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerText = 'Předobjednat na únor';
        }
    }
}


// ==========================================================================
// NAVÁZÁNÍ PROKLIKŮ NA KARTY PRODUKTŮ A FORMULÁŘE
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Prokliky na všechny karty produktů
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        card.style.cursor = 'pointer';
        
        // Kliknutí na celou plochu karty
        card.addEventListener('click', (e) => {
            if (e.target.closest('.buy-button')) return; // Nechá obsloužit tlačítko níže
            openProductModal(card);
        });

        // Kliknutí přímo na tlačítko uvnitř karty
        const infoBtn = card.querySelector('.buy-button');
        if (infoBtn) {
            infoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openProductModal(card);
            });
        }
    });

    // 2. Spolehlivé napojení formuláře předobjednávky (hledá podle ID i třídy)
    const preorderForm = document.getElementById('preorder-form') || document.querySelector('.preorder-form');
    if (preorderForm) {
        preorderForm.addEventListener('submit', (e) => {
            if (typeof submitPreorder === 'function') {
                submitPreorder(e);
            }
        });
    }

    // 3. Automatické promazání kontaktního formuláře po odeslání
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            setTimeout(() => contactForm.reset(), 500);
        });
    }
});

// ==========================================================================
// ŘAZENÍ PRODUKTŮ PODLE CENY
// ==========================================================================
function sortProducts(selectElement) {
    const order = selectElement.value;
    if (order === 'default') return;
    
    const bar = selectElement.closest('.filter-sort-bar');
    if (!bar) return;

    // Najde nejbližší mřížku produktů pod lištou
    let grid = bar.nextElementSibling;
    while (grid && !grid.classList.contains('products-grid')) {
        grid = grid.nextElementSibling;
    }
    if (!grid) return;
    
    const cards = Array.from(grid.querySelectorAll('.product-card'));
    cards.sort((a, b) => {
        const priceA = parseInt(a.getAttribute('data-price')) || 0;
        const priceB = parseInt(b.getAttribute('data-price')) || 0;
        return order === 'asc' ? priceA - priceB : priceB - priceA;
    });
    
    cards.forEach(card => grid.appendChild(card));
}
