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

// ...existing code...