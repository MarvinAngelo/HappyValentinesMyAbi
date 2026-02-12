document.addEventListener('DOMContentLoaded', () => {
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    const successMessage = document.getElementById('successMessage');
    const title = document.querySelector('.title');
    const gifContainer = document.querySelector('.gif-container');
    const buttonsContainer = document.querySelector('.buttons');
    const musicControlContainer = document.getElementById('musicControlContainer');
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const musicIcon = musicToggle.querySelector('i');

    // Music Control
    let isPlaying = false;

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicIcon.classList.remove('fa-volume-up');
            musicIcon.classList.add('fa-volume-mute');
        } else {
            bgMusic.play().catch(error => {
                console.log("Audio play failed:", error);
                alert("Please interact with the page first to play music!");
            });
            musicIcon.classList.remove('fa-volume-mute');
            musicIcon.classList.add('fa-volume-up');
        }
        isPlaying = !isPlaying;
    });

    // No Button Evasion
    const moveButton = () => {
        // Move button to body if it's not already there
        // This is crucial because the parent container has a transform animation
        // which creates a new stacking context, causing position: fixed to be relative
        // to the parent instead of the viewport.
        if (noBtn.parentNode !== document.body) {
            document.body.appendChild(noBtn);
        }

        // Add some padding so it doesn't touch the absolute edges
        const padding = 20;
        
        // Calculate available space
        const maxX = window.innerWidth - noBtn.offsetWidth - padding;
        const maxY = window.innerHeight - noBtn.offsetHeight - padding;

        // Ensure we have positive values
        const x = Math.max(padding, Math.random() * maxX);
        const y = Math.max(padding, Math.random() * maxY);
        
        // Random rotation for fun
        const rotation = (Math.random() * 20) - 10; // -10 to 10 degrees

        noBtn.style.position = 'fixed';
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;
        noBtn.style.transform = `rotate(${rotation}deg)`;
        
        // Ensure it's on top of other elements but below modals/music
        noBtn.style.zIndex = '50';
    };

    // Memory Lane Logic
    const memoryLaneBtn = document.getElementById('memoryLaneBtn');
    const memoryLane = document.getElementById('memoryLane');
    const timelineContainer = document.querySelector('.timeline-container');
    const restartBtn = document.getElementById('restartBtn');

    // Folder Configuration (Based on your provided folder structure)
    const folderConfig = {
        museum_date: 11,
        movie_date_weapons: 5,
        gelo_birthday_date: 4,
        moa_date: 7,
        halloween: 2,
        everydate: 4,
        monumento_date: 6
    };

    // Helper to create photo grid
    const createPhotoGrid = (folders) => {
        const grid = document.createElement('div');
        grid.className = 'photo-grid memory-section';
        
        folders.forEach(folderInfo => {
            const folderName = folderInfo.name;
            const count = folderConfig[folderName] || 0;
            
            for (let i = 1; i <= count; i++) {
                const img = document.createElement('img');
                img.src = `public/${folderName}/${i}.jpg`;
                img.className = 'memory-photo';
                img.alt = `Memory from ${folderName}`;
                img.loading = 'lazy'; // Lazy load for performance
                
                // Add error handling in case image doesn't exist
                img.onerror = function() {
                    this.style.display = 'none';
                };
                
                grid.appendChild(img);
            }
        });
        
        return grid;
    };

    // Helper to create text section
    const createTextSection = (text) => {
        const div = document.createElement('div');
        div.className = 'memory-text memory-section';
        div.textContent = text;
        return div;
    };

    // Build Timeline
    const buildTimeline = () => {
        timelineContainer.innerHTML = ''; // Clear existing

        // 1. FIRST → public\museum_date
        timelineContainer.appendChild(createTextSection("Here's our photo on our first date and the first time that I saw the most prettiest girl on earth inside the Gallery 8"));
        timelineContainer.appendChild(createPhotoGrid([{name: 'museum_date'}]));

        // 2. SECOND → Combine: public\movie_date_weapons + public\gelo_birthday_date
        timelineContainer.appendChild(createTextSection("and even if it's a movie date"));
        timelineContainer.appendChild(createPhotoGrid([{name: 'movie_date_weapons'}, {name: 'gelo_birthday_date'}]));

        // 3. THIRD → public\moa_date
        timelineContainer.appendChild(createTextSection("or a simple date"));
        timelineContainer.appendChild(createPhotoGrid([{name: 'moa_date'}]));

        // 4. After public\moa_date images, show text
        timelineContainer.appendChild(createTextSection("Even through occasions"));

        // 5. FOURTH → public\halloween
        timelineContainer.appendChild(createPhotoGrid([{name: 'halloween'}]));

        // 6. After public\halloween images, show text
        timelineContainer.appendChild(createTextSection("Or just a normal day"));

        // 7. FIFTH → public\everydate + public\monumento_date
        timelineContainer.appendChild(createPhotoGrid([{name: 'everydate'}, {name: 'monumento_date'}]));

        // 8. After everydate images, show text
        timelineContainer.appendChild(createTextSection("Everything is a special day when you're with me bae, I love you my Abi"));

        // 9. LAST: Show the image: public/mainphoto.jpg
        const mainPhotoDiv = document.createElement('div');
        mainPhotoDiv.className = 'photo-grid memory-section';
        const mainImg = document.createElement('img');
        mainImg.src = 'public/mainphoto.jpg';
        mainImg.className = 'memory-photo';
        mainImg.style.maxWidth = '500px'; // Make main photo slightly larger
        mainPhotoDiv.appendChild(mainImg);
        timelineContainer.appendChild(mainPhotoDiv);
    };

    // Common Success Function
    const handleSuccess = () => {
        // Hide initial content
        title.style.display = 'none';
        gifContainer.style.display = 'none';
        buttonsContainer.style.display = 'none';

        // Also hide the No button if it was moved to body
        if (noBtn.parentNode === document.body) {
            noBtn.style.display = 'none';
        }

        // Show success message
        successMessage.classList.remove('hidden');
        
        // Show Memory Lane Button
        memoryLaneBtn.classList.remove('hidden');
        
        // Trigger Heart Explosion
        createHeartExplosion();
        
        // Start continuous background hearts if not already enough
        setInterval(createFloatingHeart, 300);
    };

    // Auto Scroll Logic
    let autoScrollInterval;
    const startAutoScroll = () => {
        const scrollSpeed = 1; // Pixels per tick
        const scrollDelay = 20; // Milliseconds
        
        // Stop any existing scroll
        if (autoScrollInterval) clearInterval(autoScrollInterval);

        autoScrollInterval = setInterval(() => {
            // Check if we reached the bottom
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
                clearInterval(autoScrollInterval);
                return;
            }
            
            window.scrollBy(0, scrollSpeed);
            
            // Trigger fade in animations
            checkVisibility();
        }, scrollDelay);
    };

    // Visibility Check for Fade In
    const checkVisibility = () => {
        const sections = document.querySelectorAll('.memory-section');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // If section is roughly in viewport (with some buffer)
            if (rect.top < window.innerHeight * 0.85) {
                section.classList.add('visible');
            }
        });
    };

    // Handle Scroll for Visibility (Manual Scroll)
    window.addEventListener('scroll', checkVisibility);

    // Start Memory Lane
    memoryLaneBtn.addEventListener('click', () => {
        // Hide success message
        successMessage.classList.add('hidden');
        
        // Show Memory Lane
        memoryLane.classList.remove('hidden');
        
        // Build the content
        buildTimeline();
        
        // Reveal Music Control and Start Music
        musicControlContainer.classList.remove('hidden');
        bgMusic.currentTime = 0; // Start from beginning
        bgMusic.play().then(() => {
            isPlaying = true;
            musicIcon.classList.remove('fa-volume-mute');
            musicIcon.classList.add('fa-volume-up');
        }).catch((error) => {
            console.log("Auto-play failed:", error);
            // If auto-play fails, the button is now visible for them to click
        });

        // Start Auto Scroll after a brief pause
        setTimeout(() => {
            startAutoScroll();
        }, 1000);
    });

    // Restart Function
    restartBtn.addEventListener('click', () => {
        // Stop auto scroll
        if (autoScrollInterval) clearInterval(autoScrollInterval);
        
        // Stop Music and Hide Control
        bgMusic.pause();
        bgMusic.currentTime = 0;
        isPlaying = false;
        musicIcon.classList.remove('fa-volume-up');
        musicIcon.classList.add('fa-volume-mute');
        musicControlContainer.classList.add('hidden');
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Reset Views
        memoryLane.classList.add('hidden');
        successMessage.classList.add('hidden');
        
        // Show initial content
        title.style.display = 'block';
        gifContainer.style.display = 'block';
        buttonsContainer.style.display = 'flex';
        
        // Reset No Button
        noBtn.style.display = 'block';
        noBtn.innerText = 'No 💔';
        noBtn.classList.remove('yes-btn');
        noBtn.classList.add('no-btn');
        noBtn.classList.remove('running');
        noBtn.style.position = 'relative';
        noBtn.style.left = 'auto';
        noBtn.style.top = 'auto';
        noBtn.style.transform = 'none';
        
        // Move No Button back to container if it was moved to body
        if (noBtn.parentNode === document.body) {
            buttonsContainer.appendChild(noBtn);
        }
        
        noClickCount = 0;
    });

    // Event Listeners for No Button
    let noClickCount = 0;

    // Only move on click, not hover
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Add running class to fix width issues on mobile
        noBtn.classList.add('running');
        
        noClickCount++;

        if (noClickCount === 1) {
            noBtn.innerText = 'Sure?';
            moveButton();
        } else if (noClickCount === 2) {
            noBtn.innerText = 'Pls?';
            moveButton();
        } else if (noClickCount === 3) {
            // Transform to Yes
            noBtn.innerText = 'Yes 💖';
            noBtn.classList.remove('no-btn');
            noBtn.classList.add('yes-btn');
            
            // Optional: Move one last time or stay put?
            // Let's stay put but reset rotation so it looks clean
            noBtn.style.transform = 'rotate(0deg)';
        } else {
            // 4th click or more -> Treat as Yes
            handleSuccess();
        }
    });

    // Yes Button Celebration
    yesBtn.addEventListener('click', handleSuccess);

    // Floating Hearts Background
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 2 + 's';
        heart.style.opacity = Math.random();
        
        // Use scale for sizing to maintain heart shape proportions
        const scale = Math.random() * 0.5 + 0.5; // Scale between 0.5 and 1
        heart.style.setProperty('--scale', scale);
        
        document.getElementById('floatingHearts').appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 5000);
    }

    // Initial background hearts
    setInterval(createFloatingHeart, 500);

    // Heart Explosion Effect
    function createHeartExplosion() {
        for (let i = 0; i < 50; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '❤';
            heart.style.position = 'fixed';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.fontSize = Math.random() * 20 + 20 + 'px';
            heart.style.color = `hsl(${Math.random() * 60 + 330}, 100%, 50%)`; // Pinks and Reds
            heart.style.pointerEvents = 'none';
            heart.style.transform = `translate(-50%, -50%)`;
            heart.style.transition = 'all 1s ease-out';
            heart.style.zIndex = '1000';
            
            document.body.appendChild(heart);

            // Animate
            requestAnimationFrame(() => {
                const angle = Math.random() * Math.PI * 2;
                const velocity = Math.random() * 300 + 100;
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity;
                
                heart.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`;
                heart.style.opacity = '0';
            });

            setTimeout(() => {
                heart.remove();
            }, 1000);
        }
    }
});
