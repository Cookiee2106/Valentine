document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    startHeartRain();
    initLoveCounter();
    initDrawingEffect();

    // Auto-play music interaction fix (User must interact first usually, but we try)
    document.body.addEventListener('click', () => {
        const audio = document.getElementById('bg-music');
        if (audio.paused && !isMusicPlaying) {
            toggleMusic();
        }
    }, { once: true });
});

// --- Music Control ---
let isMusicPlaying = false;
let isTogglingMusic = false; // Prevent rapid toggles

function toggleMusic() {
    const audio = document.getElementById('bg-music');
    const icon = document.getElementById('music-icon');

    if (isTogglingMusic) return; // Ignore clicks if already processing
    isTogglingMusic = true;

    if (isMusicPlaying) {
        audio.pause();
        icon.innerText = "🔇";
        isMusicPlaying = false;
        isTogglingMusic = false;
    } else {
        audio.play().then(() => {
            icon.innerText = "🎵";
            isMusicPlaying = true;
            isTogglingMusic = false;
        }).catch(e => {
            console.log("Audio play failed:", e);
            isTogglingMusic = false; // Reset to allow retry

            // Only alert if it's NOT an "interrupted" error (which is harmless double click)
            if (e.name !== 'AbortError' && e.message.indexOf('interrupted') === -1) {
                alert("Không thể phát nhạc: " + e.message + ". Hãy thử chạm vào màn hình lần nữa!");
            }
        });
    }
}

// --- Particles Background ---
function initParticles() {
    const container = document.getElementById('particle-container');
    for (let i = 0; i < 50; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 5 + 2 + 'px';
    p.style.width = size;
    p.style.height = size;
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = Math.random() * 100 + 'vh';
    p.style.animationDuration = Math.random() * 10 + 5 + 's';
    p.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(p);
}

// --- Heart Rain Effect (Continuous) ---
function createHeart() {
    const container = document.getElementById('particle-container');
    const h = document.createElement('div');
    h.innerHTML = '❤️';
    h.className = 'heart-particle';

    // Randomize starting position (horizontal)
    h.style.left = Math.random() * 100 + 'vw';

    // Start from bottom
    h.style.top = '105vh';

    // Randomize size
    const size = Math.random() * 20 + 20 + 'px';
    h.style.fontSize = size;

    // Randomize speed
    const duration = Math.random() * 5 + 4;
    h.style.animation = `floatUp ${duration}s linear infinite`;

    container.appendChild(h);

    // Remove after animation to prevent DOM overflow
    setTimeout(() => h.remove(), duration * 1000);
}

function startHeartRain() {
    setInterval(createHeart, 200); // Trigger every 200ms
}

// --- Interactive Heart Burst ---
document.addEventListener('click', (e) => {
    // Don't burst if clicking buttons
    if (e.target.tagName === 'BUTTON' || e.target.closest('.music-btn')) return;

    const burst = document.createElement('div');
    burst.style.position = 'fixed';
    burst.style.left = e.clientX + 'px';
    burst.style.top = e.clientY + 'px';
    burst.style.pointerEvents = 'none';
    burst.style.zIndex = '999';
    document.body.appendChild(burst);

    for (let i = 0; i < 8; i++) {
        const heart = document.createElement('div');
        heart.innerText = '💖';
        heart.style.position = 'absolute';
        heart.style.fontSize = '20px';
        heart.style.transform = `translate(-50%, -50%)`;
        heart.animate([
            { transform: 'translate(0,0) scale(1)', opacity: 1 },
            { transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0)`, opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out',
            fill: 'forwards'
        });
        burst.appendChild(heart);
    }
    setTimeout(() => burst.remove(), 800);
});

// --- Screen Transitions ---
function toS2() {
    // Try to play music if not already playing
    if (!isMusicPlaying) toggleMusic();

    document.getElementById('s1').classList.remove('active');
    setTimeout(() => {
        document.getElementById('s1').style.display = 'none';
        document.getElementById('s2').style.display = 'flex';
        setTimeout(() => document.getElementById('s2').classList.add('active'), 50);
    }, 600);
}


function nextPage(num) {
    document.getElementById('p' + num).classList.add('exit');

    // Logic for specific pages
    if (num === 2) {
        // Start Typewriter
        setTimeout(startTypewriter, 500);
    }

    if (num === 3) {
        // Heart rain is global now, no special trigger needed here
    }

    if (num === 4) {
        const btn = document.getElementById('btn-final');
        btn.style.display = 'block';
        setTimeout(() => btn.style.opacity = '1', 100);
    }
}

// --- Bubble Effect ---
// --- Previous Bubble/Heart Effect Logic Removed as it's now Global ---

// --- Typewriter Effect ---
const loveLetter = "Giữa cả một cánh đồng hoa, người anh thấy đẹp nhất vẫn là em. Cảm ơn em đã đến bên anh!";
function startTypewriter() {
    const el = document.getElementById('typewriter-text');
    if (!el || el.innerHTML.length > 0) return; // Prevent re-type

    el.innerHTML = "";
    let i = 0;
    const speed = 50;

    function type() {
        if (i < loveLetter.length) {
            el.innerHTML += loveLetter.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}


function toS3() {
    document.getElementById('s2').classList.remove('active');
    setTimeout(() => {
        document.getElementById('s2').style.display = 'none';
        document.getElementById('s3').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('s3').classList.add('active');
            init3D();
            init3D();
            triggerLanterns();
        }, 50);
    }, 600);
}

// --- 3D Carousel ---
function init3D() {
    const ospin = document.getElementById('spin-container');
    const aImg = ospin.getElementsByTagName('img');
    const radius = 220; // Radius size

    for (let i = 0; i < aImg.length; i++) {
        aImg[i].style.transform = `rotateY(${i * (360 / aImg.length)}deg) translateZ(${radius}px)`;
        aImg[i].style.transition = "transform 1s " + (aImg.length - i) / 4 + "s";
    }

    let tX = 0;
    const dragContainer = document.getElementById('drag-container');

    // Auto spin
    setInterval(() => {
        tX -= 0.5; // Spin direction
        dragContainer.style.transform = `rotateX(-10deg) rotateY(${tX}deg)`;
    }, 30);
}

// --- Sky Lantern Effect (Replaces Confetti) ---
// --- Sky Lantern Effect (Replaces Confetti) ---
function triggerLanterns() {
    // Spawn lanterns continuously
    setInterval(() => {
        const l = document.createElement('div');
        l.className = 'lantern';
        l.style.left = Math.random() * 100 + 'vw';

        // Random sway
        const duration = Math.random() * 5 + 10; // 10-15s float time
        l.style.animationDuration = duration + 's';

        document.body.appendChild(l);
        setTimeout(() => l.remove(), duration * 1000);
    }, 800);
}

// --- Love Counter ---
function initLoveCounter() {
    // START DATE: Change this date to your anniversary (YYYY-MM-DD)
    const startDate = new Date('2024-10-18');

    const counter = document.getElementById('love-counter');

    setInterval(() => {
        const now = new Date();
        const diff = now - startDate;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        counter.innerHTML = `Together: ${days} days <br> <span style="font-size: 0.8rem">${hours}h ${minutes}m ${seconds}s</span>`;
    }, 1000);
}

// --- Lock Screen Logic ---
function addDigit(digit) {
    const input = document.getElementById('passcode-input');
    const errorMsg = document.getElementById('error-msg');

    // Clear error if present
    if (errorMsg.style.opacity === '1') {
        errorMsg.style.opacity = '0';
        input.value = '';
    }

    if (input.value.length < 4) {
        input.value += digit;
    }

    // Auto-check
    if (input.value.length === 4) {
        setTimeout(checkPasscode, 300);
    }
}

function clearInput() {
    document.getElementById('passcode-input').value = '';
}

function checkPasscode() {
    const input = document.getElementById('passcode-input');
    const lockScreen = document.getElementById('lock-screen');
    const errorMsg = document.getElementById('error-msg');

    // Passcode: 1810
    if (input.value === '1810') {
        lockScreen.style.opacity = '0';
        lockScreen.style.visibility = 'hidden';

        // Try to play music if not already playing
        const audio = document.getElementById('bg-music');
        if (audio.paused && !isMusicPlaying) {
            toggleMusic();
        }
    } else {
        input.classList.add('shake');
        errorMsg.style.opacity = '1';
        setTimeout(() => {
            input.classList.remove('shake');
            input.value = ''; // Auto clear
        }, 500);
    }
}

// --- Heart Drawing Effect ---
function initDrawingEffect() {
    const colors = ['#ff0055', '#ffbd00', '#ffffff', '#ff99c8'];

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove);

    function handleMove(e) {
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;

        // Rate limit creation (simple)
        if (Math.random() > 0.2) return;

        const p = document.createElement('div');
        p.className = 'draw-particle';
        p.innerText = '✨'; // Sparkle
        p.style.position = 'fixed';
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        p.style.color = colors[Math.floor(Math.random() * colors.length)];
        p.style.fontSize = Math.random() * 10 + 10 + 'px';
        p.style.pointerEvents = 'none';
        p.style.zIndex = '9999';
        p.style.transition = 'all 1s ease-out';

        document.body.appendChild(p);

        setTimeout(() => p.remove(), 1000);
    }
}

// --- Universe Effect ---
function toS4() {
    document.getElementById('s3').classList.remove('active');
    setTimeout(() => {
        document.getElementById('s3').style.display = 'none';
        document.getElementById('s4').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('s4').classList.add('active');
            initUniverse();
        }, 50);
    }, 600);
}

function initUniverse() {
    const canvas = document.getElementById('universe-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    let textCoordinates = [];

    // Create text coordinates
    function createText() {
        ctx.fillStyle = 'white';
        // Responsive font size
        const fontSize = Math.min(window.innerWidth / 5, 100);
        ctx.font = 'bold ' + fontSize + 'px Quicksand';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText('Tài ❤️ Thảo', canvas.width / 2, canvas.height / 2);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Scan for pixels
        for (let y = 0; y < canvas.height; y += 4) { // density
            for (let x = 0; x < canvas.width; x += 4) {
                if (imageData.data[(y * 4 * imageData.width) + (x * 4) + 3] > 128) {
                    textCoordinates.push({ x: x, y: y });
                }
            }
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear text
    }

    createText();

    // Particle Class
    class Particle {
        constructor(x, y) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.targetX = x;
            this.targetY = y;
            this.size = Math.random() * 2 + 1;

            // Lantern Palette (Warm & Glowing)
            const palette = ['#ff9966', '#ff5e62', '#ffcc00', '#ffffff'];
            this.color = palette[Math.floor(Math.random() * palette.length)];

            this.speed = 0.05; // ease factor
        }

        update() {
            let dx = this.targetX - this.x;
            let dy = this.targetY - this.y;
            this.x += dx * this.speed;
            this.y += dy * this.speed;

            // Interaction
            // (Optional interaction logic can go here)
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    // Initialize particles
    // Add extra background stars
    for (let i = 0; i < 500; i++) {
        textCoordinates.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        });
    }

    // shuffle
    textCoordinates.sort(() => Math.random() - 0.5);

    textCoordinates.forEach(pos => {
        particles.push(new Particle(pos.x, pos.y));
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Simple reload or re-calc logic could go here
    });
}

// --- Cinema Effect ---
// --- Cinema Effect ---
function toS5() {
    // Stop Typewriter if running (optional but good practice)

    // Transition from S2 (Book) to S5 (Cinema)
    document.getElementById('s2').classList.remove('active');
    setTimeout(() => {
        document.getElementById('s2').style.display = 'none';
        document.getElementById('s5').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('s5').classList.add('active');
            initCinema();
        }, 50);
    }, 600);
}

function toS3_fromS5() {
    document.getElementById('s5').classList.remove('active');
    setTimeout(() => {
        document.getElementById('s5').style.display = 'none';
        document.getElementById('s3').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('s3').classList.add('active');
            init3D();
            triggerLanterns();
        }, 50);
    }, 600);
}

function initCinema() {
    // Open curtains after a delay
    setTimeout(() => {
        document.getElementById('s5').classList.add('open-curtain');
    }, 1000);

    // Slideshow
    const images = [
        'assets/bs_13.jpg',
        'https://picsum.photos/800/600?random=20',
        'https://picsum.photos/800/600?random=21',
        'https://picsum.photos/800/600?random=22',
        'https://picsum.photos/800/600?random=23'
    ];
    let idx = 0;
    const imgEl = document.getElementById('cinema-img');

    // Initial image is static, start changing after first interval
    const interval = setInterval(() => {
        // Fade out
        imgEl.style.opacity = '0';
        setTimeout(() => {
            idx++;

            // Check if we reached the end
            if (idx >= images.length) {
                clearInterval(interval);
                // Transition to next scene
                toS3_fromS5();
                return;
            }

            imgEl.src = images[idx];
            // Fade in
            imgEl.style.opacity = '1';
        }, 500);
    }, 4000); // Change every 4s
}