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
    const images = Array.from(carousel.querySelectorAll('img'));
    const prevBtn = document.getElementById('clients-carousel-prev');
    const nextBtn = document.getElementById('clients-carousel-next');
    
    let currentIndex = 0;
    let isAnimating = false;
    let autoSlideInterval;
    const TOTAL_IMAGES = 3; // Número fixo de imagens
    
    // Configuração inicial do carrossel
    function initCarousel() {
        const carouselContainer = carousel.parentElement;
        
        // Duplica imagens para criar efeito de loop infinito
        // Adiciona clones no início
        images.forEach((img, index) => {
            const clone = img.cloneNode(true);
            carousel.insertBefore(clone, carousel.firstChild);
        });
        
        // Adiciona clones no final
        images.forEach((img, index) => {
            const clone = img.cloneNode(true);
            carousel.appendChild(clone);
        });
        
        // Adiciona mais clones para fluidez (opcional)
        images.forEach((img, index) => {
            const clone = img.cloneNode(true);
            carousel.appendChild(clone);
        });
        
        // Configura índice inicial no "meio" do array de clones
        const allImages = carousel.querySelectorAll('img');
        currentIndex = TOTAL_IMAGES; // Começa após os clones iniciais
        
        // Aplica estilos iniciais
        updateImageStyles();
        updateCarouselPosition(false);
        
        return allImages.length;
    }
    
    // Atualiza a posição do carrossel
    function updateCarouselPosition(animate = true) {
        if (isAnimating) return;
        
        isAnimating = animate;
        
        const allImages = carousel.querySelectorAll('img');
        const imageWidth = 100 / 3; // 3 imagens visíveis
        const translateX = -currentIndex * imageWidth;
        
        carousel.style.transition = animate ? 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
        carousel.style.transform = `translateX(${translateX}%)`;
        
        // Atualiza estilos das imagens
        updateImageStyles();
        
        if (animate) {
            setTimeout(() => {
                isAnimating = false;
                checkAndResetPosition();
            }, 800);
        }
    }
    
    // Atualiza classes de estilo das imagens
    function updateImageStyles() {
        const allImages = carousel.querySelectorAll('img');
        const centerIndex = currentIndex + 1; // Ajuste para imagem central
        
        allImages.forEach((img, index) => {
            // Remove todas as classes
            img.classList.remove('active', 'side', 'hidden');
            
            // Calcula a distância relativa
            const distance = Math.abs(index - centerIndex);
            
            if (distance === 0) {
                img.classList.add('active'); // Imagem central
            } else if (distance === 1) {
                img.classList.add('side'); // Imagens laterais mais próximas
                img.style.opacity = '0.6';
            } else if (distance === 2) {
                img.classList.add('side'); // Imagens laterais mais distantes
                img.style.opacity = '0.3';
            } else {
                img.classList.add('hidden'); // Imagens muito distantes
                img.style.opacity = '0.1';
            }
        });
    }
    
    // Verifica e reseta a posição para loop infinito
    function checkAndResetPosition() {
        const allImages = carousel.querySelectorAll('img');
        const totalWithClones = allImages.length;
        const buffer = TOTAL_IMAGES * 2; // Margem de segurança
        
        // Se chegou perto do final
        if (currentIndex >= totalWithClones - buffer) {
            setTimeout(() => {
                carousel.style.transition = 'none';
                // Volta para uma posição mais central
                currentIndex = TOTAL_IMAGES + 3;
                updateCarouselPosition(false);
            }, 50);
        }
        // Se chegou perto do início
        else if (currentIndex <= buffer) {
            setTimeout(() => {
                carousel.style.transition = 'none';
                // Vai para uma posição perto do final
                currentIndex = totalWithClones - buffer - 3;
                updateCarouselPosition(false);
            }, 50);
        }
    }
    
    // Navegação
    function nextSlide() {
        if (isAnimating) return;
        currentIndex++;
        updateCarouselPosition();
    }
    
    function prevSlide() {
        if (isAnimating) return;
        currentIndex--;
        updateCarouselPosition();
    }
    
    // Auto-slide infinito
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, 4000); // Move a cada 4 segundos
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Event Listeners para botões
    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        setTimeout(startAutoSlide, 6000); // Retoma após 6 segundos
    });
    
    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        setTimeout(startAutoSlide, 6000); // Retoma após 6 segundos
    });
    
    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        }
    });
    
    // Navegação por swipe (mobile)
    let touchStartX = 0;
    let isSwiping = false;
    let swipeDistance = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        isSwiping = true;
        swipeDistance = 0;
        stopAutoSlide();
    }, { passive: true });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        
        const touchX = e.touches[0].clientX;
        const diff = touchStartX - touchX;
        swipeDistance = Math.abs(diff);
        
        // Efeito visual de arrasto
        if (swipeDistance > 10) {
            const imageWidth = 100 / 3;
            const gapPercentage = 40 / (carousel.parentElement.offsetWidth / 100);
            const dragOffset = diff / (carousel.parentElement.offsetWidth / 100) / (imageWidth + gapPercentage);
            const translateX = -(currentIndex + dragOffset) * (imageWidth + gapPercentage);
            
            carousel.style.transition = 'none';
            carousel.style.transform = `translateX(${translateX}%)`;
            
            // Efeito visual nas imagens durante o swipe
            const allImages = carousel.querySelectorAll('img');
            allImages.forEach(img => {
                const currentOpacity = parseFloat(window.getComputedStyle(img).opacity);
                img.style.opacity = Math.max(0.1, currentOpacity * 0.8);
            });
        }
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        const swipeThreshold = 60; // Limite maior para 3 imagens
        
        // Restaura opacidade normal
        updateImageStyles();
        
        if (swipeDistance > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        } else {
            // Se não houve swipe suficiente, volta para posição atual
            updateCarouselPosition(true);
        }
        
        isSwiping = false;
        setTimeout(startAutoSlide, 3000);
    }, { passive: true });
    
    // Pausa auto-slide ao passar mouse
    const carouselContainer = carousel.parentElement;
    carouselContainer.addEventListener('mouseenter', stopAutoSlide);
    carouselContainer.addEventListener('mouseleave', startAutoSlide);
    
    // Inicialização
    initCarousel();
    startAutoSlide();
    
    // Responsividade
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCarouselPosition(false);
        }, 300);
    });
    
    // Função para debug (opcional)
    function logCarouselState() {
        const allImages = carousel.querySelectorAll('img');
        console.log(`Total de imagens (com clones): ${allImages.length}`);
        console.log(`Índice atual: ${currentIndex}`);
        console.log(`Animando: ${isAnimating}`);
    }
    
    // Expor funções para debug no console (opcional)
    window.carouselDebug = {
        next: nextSlide,
        prev: prevSlide,
        state: logCarouselState,
        stop: stopAutoSlide,
        start: startAutoSlide
    };
    
    console.log('Carrossel infinito com 3 imagens inicializado!');
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
