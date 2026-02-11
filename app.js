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
            const card = e.target.closest('.card');
            if (card) {
                card.classList.add('swiped-right');
                setTimeout(() => {
                    card.remove();
                    nextCard();
                }, 300);
            }
        }
    });
    
    return card;
}

function handleTouchStart(e) {
    e.preventDefault();
    const card = e.target.closest('.card');
    if (!card) return;
    isDragging = true;
    startX = e.touches[0].clientX;
    card.classList.add('swiping');
}

function handleTouchMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const card = e.target.closest('.card');
    if (!card) return;
    currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    const rotation = diff / 20;
    card.style.transform = `translateX(${diff}px) rotate(${rotation}deg)`;
}

function handleTouchEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    const card = e.target.closest('.card');
    if (!card) return;
    card.classList.remove('swiping');
    
    const diff = currentX - startX;
    
    if (Math.abs(diff) > 100) {
        if (diff > 0) {
            card.classList.add('swiped-right');
        } else {
            card.classList.add('swiped-left');
        }
        setTimeout(() => {
            card.remove();
            nextCard();
        }, 300);
    } else {
        card.style.transform = '';
    }
}

function handleMouseDown(e) {
    const card = e.target.closest('.card');
    if (!card) return;
    isDragging = true;
    startX = e.clientX;
    card.classList.add('swiping');
}

function handleMouseMove(e) {
    if (!isDragging) return;
    const card = e.target.closest('.card');
    if (!card) return;
    currentX = e.clientX;
    const diff = currentX - startX;
    const rotation = diff / 20;
    card.style.transform = `translateX(${diff}px) rotate(${rotation}deg)`;
}

function handleMouseEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    const card = e.target.closest('.card');
    if (!card) return;
    card.classList.remove('swiping');
    
    const diff = currentX - startX;
    
    if (Math.abs(diff) > 100) {
        if (diff > 0) {
            card.classList.add('swiped-right');
        } else {
            card.classList.add('swiped-left');
        }
        setTimeout(() => {
            card.remove();
            nextCard();
        }, 300);
    } else {
        card.style.transform = '';
    }
}

function nextCard() {
    currentIndex++;
    
    // Hide instructions after first swipe
    const instructions = document.querySelector('.instructions');
    if (instructions) {
        instructions.style.opacity = '0';
    }
    
    if (currentIndex >= shuffledQuotes.length) {
        currentIndex = 0;
        location.reload();
        return;
    }
    
    // Add next card if we have more quotes and less than 3 cards visible
    const cardStack = document.getElementById('cardStack');
    const visibleCards = cardStack.querySelectorAll('.card').length;
    
    if (visibleCards < 3 && currentIndex + visibleCards < shuffledQuotes.length) {
        const nextIndex = currentIndex + visibleCards;
        const card = createCard(shuffledQuotes[nextIndex], nextIndex);
        cardStack.insertBefore(card, cardStack.firstChild);
    }
    
    updateCounter();
}

function updateCounter() {
    document.getElementById('counter').textContent = `${currentIndex + 1} / ${shuffledQuotes.length}`;
}

function init() {
    const cardStack = document.getElementById('cardStack');
    
    for (let i = Math.min(3, shuffledQuotes.length) - 1; i >= 0; i--) {
        const card = createCard(shuffledQuotes[i], i);
        cardStack.appendChild(card);
    }
    
    updateCounter();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
