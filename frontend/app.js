mport gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;

        const headerHeight = 90;
        const y =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;

        window.scrollTo({ top: y, behavior: "smooth" });
    });
});


const heroTL = gsap.timeline();

heroTL
    .from(".hero-title", {
        y: 120,
        opacity: 0,
        skewY: 3,
        duration: 1.5,
        ease: "power4.out"
    })
    .from(".hero-subtitle", {
        y: 30,
        opacity: 0,
        duration: 1
    }, "-=1")
    .from(".shape-item", {
        y: 300,
        scale: 0.5,
        duration: 1.2,
        stagger: 0.08,
        ease: "back.out(1.5)"
    }, "-=1.2");


gsap.utils.toArray(".overlap-card").forEach(card => {
    gsap.from(card, {
        y: 100,
        opacity: 0,
        scrollTrigger: {
            trigger: card,
            start: "top 90%",
            end: "top 20%",
            scrub: 1
        }
    });
});


const wrapper = document.querySelector(".projects-section-wrapper");
const track = document.querySelector(".projects-horizontal-track");

if (wrapper && track) {
    const getScrollAmount = () =>
        -(track.scrollWidth - window.innerWidth);

    const scrollTween = gsap.to(track, {
        x: getScrollAmount,
        ease: "none"
    });

    ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: () => `+=${track.scrollWidth}`,
        pin: true,
        scrub: 1,
        animation: scrollTween,
        invalidateOnRefresh: true,
        anticipatePin: 1
    });
}


document.querySelectorAll(".marquee-container").forEach(container => {
    const content = container.querySelector(".marquee-content");
    if (!content) return;

    container.addEventListener("mouseenter", () => {
        content.style.animationPlayState = "paused";
    });
    container.addEventListener("mouseleave", () => {
        content.style.animationPlayState = "running";
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatMessages = document.getElementById('chat-messages');
    const modeBtns = document.querySelectorAll('.mode-btn');
    
    let currentMode = "general";
    const API_URL = "http://localhost:8000/rag/chat"; 

  
    const toggleChat = () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            chatInput.focus();
        }
    };

    chatToggleBtn.addEventListener('click', toggleChat);
    chatCloseBtn.addEventListener('click', toggleChat);

   
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
           
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            
            currentMode = btn.getAttribute('data-mode');
            
           
            addMessage(`Switched to ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} mode.`, 'bot');
        });
    });

   
    const sendMessage = async () => {
        const query = chatInput.value.trim();
        if (!query) return;

        
        chatInput.value = '';

        
        addMessage(query, 'user');

        
        showTypingIndicator();

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: query,
                    mode: currentMode
                })
            });

            const data = await response.json();
            
            
            removeTypingIndicator();

            if (response.ok) {
                addMessage(data.response, 'bot', data.sources);
            } else {
                addMessage("Sorry, I encountered an error. Please try again.", 'bot');
                console.error('API Error:', data);
            }

        } catch (error) {
            removeTypingIndicator();
            addMessage("Network error. Is the backend server running?", 'bot');
            console.error('Fetch Error:', error);
        }
    };

   
    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

   
    function addMessage(text, sender, sources = []) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        
      
        contentDiv.innerHTML = text.replace(/\n/g, '<br>');
        
        messageDiv.appendChild(contentDiv);

        
        if (sender === 'bot' && sources && sources.length > 0) {
            const sourcesDiv = document.createElement('div');
            sourcesDiv.classList.add('message-sources');
            sourcesDiv.innerHTML = "<strong>Sources:</strong> ";
            
            sources.forEach(source => {
                const tag = document.createElement('span');
                tag.classList.add('source-tag');
                tag.textContent = source;
                sourcesDiv.appendChild(tag);
            });
            
            messageDiv.appendChild(sourcesDiv);
        }

        chatMessages.appendChild(messageDiv);
        
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    
    let typingIndicatorDiv = null;

    function showTypingIndicator() {
        if (typingIndicatorDiv) return;

        typingIndicatorDiv = document.createElement('div');
        typingIndicatorDiv.classList.add('typing-indicator');
        typingIndicatorDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatMessages.appendChild(typingIndicatorDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        if (typingIndicatorDiv) {
            typingIndicatorDiv.remove();
            typingIndicatorDiv = null;
        }
    }
});

