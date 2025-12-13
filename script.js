function downloadFromUrl(url, filename) {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || '';
    link.target = '_blank'; // Abre em nova aba se necessário
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

(function () {
    const carousel = document.getElementById('carousel-images');
    const images = Array.from(carousel.querySelectorAll('img'));
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const indicators = document.getElementById('carousel-indicators');
    let currentIndex = 1; // Começa em 1 por causa dos clones
    let interval;
    let isPaused = false;

    // Clona primeiro e último para loop infinito
    const firstClone = images[0].cloneNode(true);
    const lastClone = images[images.length - 1].cloneNode(true);
    carousel.appendChild(firstClone);
    carousel.insertBefore(lastClone, images[0]);
    const allImages = carousel.querySelectorAll('img');
    const total = images.length;

    // Ajusta largura do container
    carousel.style.width = `${allImages.length * 100}%`;
    allImages.forEach(img => img.style.width = `${100 / allImages.length}%`);

    // Indicadores
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('span');
        dot.style.width = dot.style.height = '12px';
        dot.style.borderRadius = '50%';
        dot.style.background = '#ccc';
        dot.style.display = 'inline-block';
        dot.style.cursor = 'pointer';
        dot.style.transition = 'background 0.3s';
        dot.addEventListener('click', () => goToSlide(i + 1));
        indicators.appendChild(dot);
    }

    function updateIndicators() {
        Array.from(indicators.children).forEach((dot, i) => {
            dot.style.background = (i === getRealIndex()) ? '#0074c8' : '#ccc';
        });
    }

    function getRealIndex() {
        // Ajusta índice para ignorar clones
        if (currentIndex === 0) return total - 1;
        if (currentIndex === total + 1) return 0;
        return currentIndex - 1;
    }

    function showImage(index, animate = true) {
        carousel.style.transition = animate ? 'transform 0.6s ease' : 'none';
        carousel.style.transform = `translateX(-${index * (100 / allImages.length)}%)`;
        updateIndicators();
    }

    function nextImage() {
        if (currentIndex >= total + 1) return;
        currentIndex++;
        showImage(currentIndex);
        if (currentIndex === total + 1) {
            setTimeout(() => {
                carousel.style.transition = 'none';
                currentIndex = 1;
                showImage(currentIndex, false);
            }, 600);
        }
    }

    function prevImage() {
        if (currentIndex <= 0) return;
        currentIndex--;
        showImage(currentIndex);
        if (currentIndex === 0) {
            setTimeout(() => {
                carousel.style.transition = 'none';
                currentIndex = total;
                showImage(currentIndex, false);
            }, 600);
        }
    }

    function goToSlide(index) {
        currentIndex = index;
        showImage(currentIndex);
    }

    function startAuto() {
        interval = setInterval(() => {
            if (!isPaused) nextImage();
        }, 3000);
    }

    function stopAuto() {
        clearInterval(interval);
    }

    // Eventos
    nextBtn.addEventListener('click', () => {
        nextImage();
    });
    prevBtn.addEventListener('click', () => {
        prevImage();
    });

    document.getElementById('carousel').addEventListener('mouseenter', () => {
        isPaused = true;
    });
    document.getElementById('carousel').addEventListener('mouseleave', () => {
        isPaused = false;
    });

    // Inicialização
    showImage(currentIndex, false);
    updateIndicators();
    startAuto();

    // Responsivo: ajusta ao redimensionar
    window.addEventListener('resize', () => {
        showImage(currentIndex, false);
    });
})();

// Clients Carousel
(function () {
    const carousel = document.getElementById('clients-carousel-images');
    // const prevBtn = document.getElementById('clients-carousel-prev');
    // const nextBtn = document.getElementById('clients-carousel-next');
    const dotsContainer = document.getElementById('clients-carousel-dots');
    let dots = [];

    let slides;
    let index = 2;
    let slideWidth = 0;
    let isAnimating = false;
    let autoSlide;

    function createDots(total) {
        dotsContainer.innerHTML = '';
        dots = [];

        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');

            dot.addEventListener('click', () => {
                stopAuto();
                index = i + 1;
                move();
                restartAuto();
            });

            dotsContainer.appendChild(dot);
            dots.push(dot);
        }
    }


    function setup() {
        const originalSlides = Array.from(carousel.children);

        const firstClone = originalSlides[0].cloneNode(true);
        const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);

        carousel.insertBefore(lastClone, originalSlides[0]);
        carousel.appendChild(firstClone);

        slides = Array.from(carousel.children);

        calculateWidth();
        move(false);
        updateClasses();
        createDots(slides.length - 2);
        updateDots();
    }

    function updateDots() {
        const realIndex = index - 1;

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === realIndex);
        });
    }

    function calculateWidth() {
        const slide = slides[0];
        const gap = parseInt(getComputedStyle(carousel).gap) || 0;
        slideWidth = slide.offsetWidth + gap;
    }

    function move(animate = true) {
        carousel.style.transition = animate
            ? 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            : 'none';

        const containerWidth = carousel.parentElement.offsetWidth;
        const offsetCenter = (containerWidth - slideWidth) / 2;

        carousel.style.transform = `
            translateX(${offsetCenter - index * slideWidth}px)
        `;
    }

    function updateClasses() {
        slides.forEach((img, i) => {
            img.className = '';

            const diff = Math.abs(i - index);

            if (diff === 0) img.classList.add('active');
            else if (diff === 1) img.classList.add('side');
            else img.classList.add('hidden');
        });
    }

    function next() {
        if (isAnimating) return;
        isAnimating = true;
        index++;
        move();
    }

    function prev() {
        if (isAnimating) return;
        isAnimating = true;
        index--;
        move();
    }

    carousel.addEventListener('transitionend', () => {
        isAnimating = false;

        if (index === slides.length - 1) {
            index = 1;
            move(false);
            requestAnimationFrame(() => {
                updateClasses();
                updateDots();
            });
            return;
        }

        if (index === 0) {
            index = slides.length - 2;
            move(false);
            requestAnimationFrame(() => {
                updateClasses();
                updateDots();
            });
            return;
        }

        updateClasses();
        updateDots();
    });


    // nextBtn.addEventListener('click', () => {
    //     stopAuto();
    //     next();
    //     restartAuto();
    // });

    // prevBtn.addEventListener('click', () => {
    //     stopAuto();
    //     prev();
    //     restartAuto();
    // });

    function startAuto() {
        autoSlide = setInterval(next, 4000);
    }

    function stopAuto() {
        clearInterval(autoSlide);
    }

    function restartAuto() {
        setTimeout(startAuto, 5000);
    }

    let startX = 0;

    carousel.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        stopAuto();
    }, { passive: true });

    carousel.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 60) diff > 0 ? next() : prev();
        restartAuto();
    }, { passive: true });

    window.addEventListener('resize', () => {
        calculateWidth();
        move(false);
    });

    setup();
    startAuto();
})();

// Funções utilitárias do site
function openSobreSidebar() {
    document.getElementById('sobreSidebar').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeSobreSidebar() {
    document.getElementById('sobreSidebar').style.display = 'none';
    document.body.style.overflow = '';
}

function encaminhaWpp(contato) {
    const numero = contato;
    const mensagem = 'Olá, gostaria de solicitar um serviço!';
    window.open(`https://wa.me/${numero}?text=${mensagem}`, '_blank');
}

// Navegação entre seções
function showSection(sectionName) {
    // Verifica se está na página de contato e quer ir para produtos, serviços ou home
    const currentSection = document.querySelector('.section.active');
    const isOnContactPage = currentSection && currentSection.id === 'contact';
    const isGoingToHomeProductsOrServices = ['home', 'produtos', 'servicos'].includes(sectionName);
    
    if (isOnContactPage && isGoingToHomeProductsOrServices) {
        // Redireciona para home primeiro
        redirectToHomeAndSection(sectionName);
        return;
    }
    
    // Se for produtos ou serviços, vai para home e depois para a seção
    if (sectionName === 'produtos' || sectionName === 'servicos') {
        // Vai para home primeiro
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById('home').classList.add('active');
        
        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Aguarda um pouco e vai para a seção específica
        setTimeout(() => {
            scrollToSection(sectionName);
        }, 500);
        return;
    }
    
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionName).classList.add('active');

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Função para redirecionar para home e depois para seção específica
function redirectToHomeAndSection(targetSection) {
    // Primeiro vai para home
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('home').classList.add('active');
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Se não for home, aguarda um pouco e vai para a seção específica
    if (targetSection !== 'home') {
        setTimeout(() => {
            scrollToSection(targetSection);
        }, 500); // Aguarda 500ms para a transição da home
    }
}


// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


// Menu responsivo
function handleMenuDisplay() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (window.innerWidth <= 830) {
        menuToggle.style.display = 'flex';
        navLinks.classList.remove('active');
    } else {
        menuToggle.style.display = 'none';
        navLinks.classList.remove('active');
        navLinks.style.display = 'flex';
    }
}
window.addEventListener('resize', handleMenuDisplay);
window.addEventListener('DOMContentLoaded', handleMenuDisplay);

document.getElementById('menuToggle').addEventListener('click', function () {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
});

// Fecha menu ao clicar em um link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 830) {
            document.getElementById('navLinks').classList.remove('active');
        }
    });
});

function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

(function () {
    // Serviços Carrossel
    const track = document.getElementById('servicesCarouselTrack');
    const cards = Array.from(track.children);
    const prevBtn = document.getElementById('servicesPrev');
    const nextBtn = document.getElementById('servicesNext');
    let current = 0;

    function getCardsPerView() {
        if (window.innerWidth <= 600) return 1;
        if (window.innerWidth <= 900) return 2;
        return 3;
    }

    function updateCarousel() {
        const cardsPerView = getCardsPerView();
        const cardWidth = cards[0].offsetWidth + parseInt(window.getComputedStyle(track).gap || 0);
        track.style.transform = `translateX(-${current * cardWidth}px)`;
        prevBtn.style.display = current === 0 ? 'none' : 'flex';
        nextBtn.style.display = current >= cards.length - cardsPerView ? 'none' : 'flex';
    }

    prevBtn.addEventListener('click', () => {
        const cardsPerView = getCardsPerView();
        if (current > 0) current--;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        const cardsPerView = getCardsPerView();
        if (current < cards.length - cardsPerView) current++;
        updateCarousel();
    });

    window.addEventListener('resize', () => {
        // Ajusta o carrossel ao redimensionar
        if (current > cards.length - getCardsPerView()) {
            current = Math.max(0, cards.length - getCardsPerView());
        }
        updateCarousel();
    });

    // Inicialização
    setTimeout(updateCarousel, 100); // Aguarda renderização

    // Opcional: swipe para mobile
    let startX = null;
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    track.addEventListener('touchend', (e) => {
        if (startX === null) return;
        let endX = e.changedTouches[0].clientX;
        if (endX - startX > 50) prevBtn.click();
        else if (startX - endX > 50) nextBtn.click();
        startX = null;
    });
})();
