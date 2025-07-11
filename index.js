document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation & UI Logic ---

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Handle mobile menu close if open
            const navLinks = document.querySelector('.nav-links');
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Add a class to header on scroll for sticky effect/shadow
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Canvas Background Animation Logic ---

    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const numParticles = 80; // Number of particles
    const particleColor = 'rgba(0, 123, 255, 0.5)'; // Blue with some transparency
    const lineColor = 'rgba(0, 123, 255, 0.1)'; // Very transparent blue for lines
    const maxLineDistance = 120; // Max distance for particles to connect

    // Function to set canvas dimensions
    function setCanvasDimensions() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Particle Class
    class Particle {
        constructor(x, y, radius, dx, dy) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.dx = dx; // velocity x
            this.dy = dy; // velocity y
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = particleColor;
            ctx.fill();
        }

        update() {
            // Bounce off walls
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.dx = -this.dx;
            }
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.dy = -this.dy;
            }

            this.x += this.dx;
            this.y += this.dy;

            this.draw();
        }
    }

    // Initialize particles
    function initParticles() {
        particles = []; // Clear existing particles
        for (let i = 0; i < numParticles; i++) {
            const radius = Math.random() * 2 + 1; // Radius between 1 and 3
            const x = Math.random() * (canvas.width - radius * 2) + radius;
            const y = Math.random() * (canvas.height - radius * 2) + radius;
            const dx = (Math.random() - 0.5) * 0.5; // Small random velocity
            const dy = (Math.random() - 0.5) * 0.5;
            particles.push(new Particle(x, y, radius, dx, dy));
        }
    }

    // Connect particles with lines
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];

                // Calculate distance between particles
                const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

                if (distance < maxLineDistance) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    // Fade lines based on distance
                    ctx.strokeStyle = `rgba(0, 123, 255, ${1 - (distance / maxLineDistance) * 0.8})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate); // Loop animation
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        connectParticles(); // Draw lines first

        for (let i = 0; i < particles.length; i++) {
            particles[i].update(); // Update and draw each particle
        }
    }

    // Event Listeners
    window.addEventListener('resize', () => {
        setCanvasDimensions();
        initParticles(); // Re-initialize particles on resize for better distribution
    });

    // Initial setup
    setCanvasDimensions();
    initParticles();
    animate(); // Start the animation
});