document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            const open = nav.classList.toggle("open");
            toggle.setAttribute("aria-expanded", String(open));
            toggle.innerHTML = open
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
                toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }

    document.querySelectorAll("[data-carousel]").forEach(carousel => {
        const slides = [...carousel.querySelectorAll(".gallery-slide")];
        const dots = [...carousel.querySelectorAll(".gallery-dots span")];
        const prev = carousel.querySelector(".gallery-arrow.prev");
        const next = carousel.querySelector(".gallery-arrow.next");
        if (slides.length <= 1) return;

        let index = 0;
        let startX = null;

        const show = (nextIndex) => {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
            dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
        };

        prev?.addEventListener("click", () => show(index - 1));
        next?.addEventListener("click", () => show(index + 1));

        carousel.addEventListener("touchstart", e => {
            startX = e.touches[0].clientX;
        }, {passive: true});

        carousel.addEventListener("touchend", e => {
            if (startX === null) return;
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 45) show(index + (dx < 0 ? 1 : -1));
            startX = null;
        }, {passive: true});
    });
});
