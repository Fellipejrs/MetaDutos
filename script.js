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

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const company = formData.get('company');
        const message = formData.get('message');

        // Create email content
        const emailContent = `
            Solicitação de Cotação - MetaDutos

            Nome: ${name}
            E-mail: ${email}
            Telefone: ${phone}
            Empresa: ${company || 'Não informado'}

            Descrição do Projeto:
            ${message}
        `.trim();

        // Create mailto link
        const mailtoLink = `mailto:contato@metadutos.com.br?subject=Solicitação de Cotação - ${name}&body=${encodeURIComponent(emailContent)}`;

        // Open email client
        window.location.href = mailtoLink;

        // Show success message
        alert('Sua solicitação será enviada por e-mail. Obrigado pelo contato!');

        // Reset form
        this.reset();
    });
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

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all service cards and gallery items
document.querySelectorAll('.service-card, .gallery-item, .stat').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add loading animation
window.addEventListener('load', function () {
    document.body.style.opacity = '1';
});

// Initialize page
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

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
        if (window.innerWidth <= 480) {
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