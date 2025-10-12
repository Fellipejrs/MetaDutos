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
