let currentIndex = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const shuffledQuotes = shuffleArray(quotes);

function createCard(quote, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.zIndex = quotes.length - index;
    
    card.innerHTML = `
        <div class="quote">"${quote.text}"</div>
        <div class="author">— ${quote.author}</div>
    `;
    
    // Touch events
    card.addEventListener('touchstart', handleTouchStart, { passive: false });
    card.addEventListener('touchmove', handleTouchMove, { passive: false });
    card.addEventListener('touchend', handleTouchEnd);
    
    // Mouse events
    card.addEventListener('mousedown', handleMouseDown);
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseup', handleMouseEnd);
    card.addEventListener('mouseleave', handleMouseEnd);
    
    // Click for simple advance
    card.addEventListener('click', (e) => {
        if (!isDragging) {
            nextCard();
        }
    });
    
    return card;
}

function handleTouchStart(e) {
    e.preventDefault();
    isDragging = true;
    startX = e.touches[0].clientX;
    e.target.classList.add('swiping');
}

function handleTouchMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    const rotation = diff / 20;
    e.target.style.transform = `translateX(${diff}px) rotate(${rotation}deg)`;
}

function handleTouchEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    e.target.classList.remove('swiping');
    
    const diff = currentX - startX;
    
    if (Math.abs(diff) > 100) {
        // Swiped far enough
        if (diff > 0) {
            e.target.classList.add('swiped-right');
        } else {
            e.target.classList.add('swiped-left');
        }
        setTimeout(() => {
            e.target.remove();
            nextCard();
        }, 300);
    } else {
        // Snap back
        e.target.style.transform = '';
    }
}

function handleMouseDown(e) {
    isDragging = true;
    startX = e.clientX;
    e.target.classList.add('swiping');
}

function handleMouseMove(e) {
    if (!isDragging) return;
    currentX = e.clientX;
    const diff = currentX - startX;
    const rotation = diff / 20;
    e.target.style.transform = `translateX(${diff}px) rotate(${rotation}deg)`;
}

function handleMouseEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    e.target.classList.remove('swiping');
    
    const diff = currentX - startX;
    
    if (Math.abs(diff) > 100) {
        if (diff > 0) {
            e.target.classList.add('swiped-right');
        } else {
            e.target.classList.add('swiped-left');
        }
        setTimeout(() => {
            e.target.remove();
            nextCard();
        }, 300);
    } else {
        e.target.style.transform = '';
    }
}

function nextCard() {
    currentIndex++;
    if (currentIndex >= shuffledQuotes.length) {
        currentIndex = 0;
        // Reshuffle and reload
        location.reload();
    }
    updateCounter();
}

function updateCounter() {
    document.getElementById('counter').textContent = `${currentIndex + 1} / ${shuffledQuotes.length}`;
}

function init() {
    const cardStack = document.getElementById('cardStack');
    
    // Create cards in reverse order (so first card is on top)
    for (let i = Math.min(3, shuffledQuotes.length) - 1; i >= 0; i--) {
        const card = createCard(shuffledQuotes[i], i);
        cardStack.appendChild(card);
    }
    
    updateCounter();
}

init();
