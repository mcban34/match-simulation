import { useState, useEffect, useRef } from 'react';

const MatchSimulation = ({ homeTeam, awayTeam, onSimulationEnd, isOpen, onClose }) => {
    const canvasRef = useRef(null);
    const [scores, setScores] = useState({ home: 0, away: 0 });
    const [isSimulating, setIsSimulating] = useState(true);
    const [currentMinute, setCurrentMinute] = useState(1);
    const animationRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);

    // Ses referansları
    const bgMusicRef = useRef(new Audio('/sounds/background-music.mp3'));
    const goalSoundRef = useRef(new Audio('/sounds/goal.mp3'));
    const collisionSoundRef = useRef(new Audio('/sounds/donk.mp3'));

    useEffect(() => {
        // Arkaplan müziği için %40 ses seviyesi
        bgMusicRef.current.volume = 0.03;
        // Gol sesi için %60 ses seviyesi (biraz daha belirgin olsun)
        goalSoundRef.current.volume = 0.03;

        collisionSoundRef.current.volume = 0.08;

    }, []);

    // Dakika güncelleme efekti
    useEffect(() => {
        if (!isSimulating) return;

        const minuteInterval = setInterval(() => {
            setCurrentMinute(prev => {
                if (prev >= 90) {
                    clearInterval(minuteInterval);
                    setIsSimulating(false);
                    return 90;
                }
                return prev + 3; // Her saniye 3 dakika ilerlesin (30 saniyede 90 dakika için)
            });
        }, 1000);

        return () => clearInterval(minuteInterval);
    }, [isSimulating]);

    // Ses durumu değiştiğinde
    useEffect(() => {
        if (isMuted) {
            bgMusicRef.current.pause();
        } else if (isSimulating) {
            bgMusicRef.current.play().catch(e => console.log('Ses oynatma hatası:', e));
        }
    }, [isMuted, isSimulating]);

    // Parçacık sistemi için ref
    const particles = useRef([]);

    // Oyun state'i
    const state = useRef({
        goalRotation: Math.random() * Math.PI * 2,
        homeLogo: { x: 0, y: 0, dx: 0, dy: 0, rotation: 0, image: null },
        awayLogo: { x: 0, y: 0, dx: 0, dy: 0, rotation: 0, image: null },
        radius: 0,
        centerX: 0,
        centerY: 0,
        goalEffect: { active: false, timer: 0, x: 0, y: 0 }
    });

    // Parçacık oluşturma fonksiyonu
    const createParticles = (x, y, count, type) => {
        for (let i = 0; i < count; i++) {
            const speed = type === 'goal' ? 8 : 4;
            const lifetime = type === 'goal' ? 60 : 30;
            particles.current.push({
                x,
                y,
                dx: (Math.random() - 0.5) * speed,
                dy: (Math.random() - 0.5) * speed,
                radius: Math.random() * 3 + 1,
                lifetime,
                maxLifetime: lifetime,
                type,
                color: type === 'goal' ?
                    `hsl(${Math.random() * 60 + 30}, 100%, 50%)` :
                    '#ffffff'
            });
        }
    };

    // Parçacıkları çizme
    const drawParticles = (ctx) => {
        particles.current = particles.current.filter(particle => {
            particle.lifetime--;
            if (particle.lifetime <= 0) return false;

            particle.x += particle.dx;
            particle.y += particle.dy;

            const alpha = particle.lifetime / particle.maxLifetime;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.type === 'goal' ?
                particle.color :
                `rgba(255, 255, 255, ${alpha})`;
            ctx.fill();

            return true;
        });
    };

    // Gol efekti çizimi
    const drawGoalEffect = (ctx) => {
        if (state.current.goalEffect.active) {
            const { x, y, timer } = state.current.goalEffect;
            const radius = (60 - timer) * 3;
            const alpha = timer / 60;

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`;
            ctx.lineWidth = 3;
            ctx.stroke();

            state.current.goalEffect.timer--;
            if (state.current.goalEffect.timer <= 0) {
                state.current.goalEffect.active = false;
            }
        }
    };

    // Gol kalesini çizme
    const drawGoal = (ctx) => {
        const { centerX, centerY, radius, goalRotation } = state.current;
        const goalWidth = 60;
        const goalHeight = 45;
        const postWidth = 5;
        const goalDepth = 20; // Kaleye derinlik ekledik

        // Kale pozisyonunu hesapla
        const x = centerX + Math.cos(goalRotation) * radius;
        const y = centerY + Math.sin(goalRotation) * radius;

        // Glow efekti
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(255, 255, 255, 0.5)";

        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(goalRotation + Math.PI / 2); // 90 derece sağa döndürdük

        // Ön çerçeve
        // Sol direk
        ctx.fillRect(-goalWidth / 2, -goalHeight / 2, postWidth, goalHeight);
        ctx.strokeRect(-goalWidth / 2, -goalHeight / 2, postWidth, goalHeight);

        // Sağ direk
        ctx.fillRect(goalWidth / 2 - postWidth, -goalHeight / 2, postWidth, goalHeight);
        ctx.strokeRect(goalWidth / 2 - postWidth, -goalHeight / 2, postWidth, goalHeight);

        // Üst direk
        ctx.fillRect(-goalWidth / 2, -goalHeight / 2, goalWidth, postWidth);
        ctx.strokeRect(-goalWidth / 2, -goalHeight / 2, goalWidth, postWidth);

        // Derinlik direkleri (yan duvarlar)
        ctx.beginPath();
        ctx.moveTo(-goalWidth / 2, -goalHeight / 2);
        ctx.lineTo(-goalWidth / 2 + goalDepth, -goalHeight / 2 - goalDepth);
        ctx.lineTo(-goalWidth / 2 + goalDepth, goalHeight / 2 - goalDepth);
        ctx.lineTo(-goalWidth / 2, goalHeight / 2);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(goalWidth / 2, -goalHeight / 2);
        ctx.lineTo(goalWidth / 2 - goalDepth, -goalHeight / 2 - goalDepth);
        ctx.lineTo(goalWidth / 2 - goalDepth, goalHeight / 2 - goalDepth);
        ctx.lineTo(goalWidth / 2, goalHeight / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Üst derinlik direkleri
        ctx.beginPath();
        ctx.moveTo(-goalWidth / 2, -goalHeight / 2);
        ctx.lineTo(-goalWidth / 2 + goalDepth, -goalHeight / 2 - goalDepth);
        ctx.lineTo(goalWidth / 2 - goalDepth, -goalHeight / 2 - goalDepth);
        ctx.lineTo(goalWidth / 2, -goalHeight / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Kale ağı
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 0.5;

        // Ön yüzey dikey ağ çizgileri
        for (let i = 1; i < 7; i++) {
            const x = -goalWidth / 2 + (goalWidth / 7) * i;
            ctx.moveTo(x, -goalHeight / 2);
            ctx.lineTo(x, goalHeight / 2);
        }

        // Ön yüzey yatay ağ çizgileri
        for (let i = 1; i < 5; i++) {
            const y = -goalHeight / 2 + (goalHeight / 5) * i;
            ctx.moveTo(-goalWidth / 2, y);
            ctx.lineTo(goalWidth / 2, y);
        }

        // Derinlik ağ çizgileri
        for (let i = 0; i <= goalDepth; i += 5) {
            // Sol duvar
            ctx.moveTo(-goalWidth / 2 + i, -goalHeight / 2);
            ctx.lineTo(-goalWidth / 2 + i, goalHeight / 2);

            // Sağ duvar
            ctx.moveTo(goalWidth / 2 - i, -goalHeight / 2);
            ctx.lineTo(goalWidth / 2 - i, goalHeight / 2);

            // Üst duvar
            ctx.moveTo(-goalWidth / 2, -goalHeight / 2 + i);
            ctx.lineTo(goalWidth / 2, -goalHeight / 2 + i);
        }

        ctx.stroke();
        ctx.restore();

        // Shadow'u resetle
        ctx.shadowBlur = 0;
    };

    // Logo güncelleme ve çizim
    const updateAndDrawLogo = (ctx, logo, team) => {
        const { centerX, centerY, radius } = state.current;

        // Pozisyon güncelleme
        logo.x += logo.dx;
        logo.y += logo.dy;

        // Saha sınırı kontrolü
        const distance = Math.sqrt((logo.x - centerX) ** 2 + (logo.y - centerY) ** 2);
        if (distance + 25 > radius) {
            const angle = Math.atan2(logo.y - centerY, logo.x - centerX);
            logo.dx = -Math.cos(angle) * Math.abs(logo.dx) * (Math.random() * 1.5 + 0.5);
            logo.dy = -Math.sin(angle) * Math.abs(logo.dy) * (Math.random() * 1.5 + 0.5);
            createParticles(logo.x, logo.y, 10, 'collision');
        }

        // Logolar arası çarpışma kontrolü
        const otherLogo = team === "home" ? state.current.awayLogo : state.current.homeLogo;
        const collisionDistance = Math.sqrt((logo.x - otherLogo.x) ** 2 + (logo.y - otherLogo.y) ** 2);

        if (collisionDistance < 50) {
            const angle = Math.atan2(logo.y - otherLogo.y, logo.x - otherLogo.x);
            logo.dx = Math.cos(angle) * (Math.random() * 3 + 3);
            logo.dy = Math.sin(angle) * (Math.random() * 3 + 3);
            createParticles(
                (logo.x + otherLogo.x) / 2,
                (logo.y + otherLogo.y) / 2,
                15,
                'collision'
            );
            if (!isMuted) {
                collisionSoundRef.current.currentTime = 0;
                collisionSoundRef.current.play().catch(e => console.log('Çarpışma sesi hatası:', e));
            }
        }

        // Hız limitleri
        const maxSpeed = 10;
        const minSpeed = 2;

        // Minimum hız kontrolü
        if (Math.abs(logo.dx) < minSpeed) logo.dx = Math.sign(logo.dx) * minSpeed;
        if (Math.abs(logo.dy) < minSpeed) logo.dy = Math.sign(logo.dy) * minSpeed;

        // Maximum hız kontrolü
        if (Math.abs(logo.dx) > maxSpeed) logo.dx = Math.sign(logo.dx) * maxSpeed;
        if (Math.abs(logo.dy) > maxSpeed) logo.dy = Math.sign(logo.dy) * maxSpeed;

        // Logo çizimi
        ctx.save();
        ctx.translate(logo.x, logo.y);
        logo.rotation += (logo.dx * logo.dy) / 1000; // Hareket bazlı rotasyon
        ctx.rotate(logo.rotation);
        ctx.drawImage(logo.image, -25, -25, 50, 50);
        ctx.restore();
    };

    // Gol kontrolü
    const checkGoal = () => {
        const { centerX, centerY, radius, goalRotation, homeLogo, awayLogo } = state.current;
        const goalX = centerX + Math.cos(goalRotation) * radius;
        const goalY = centerY + Math.sin(goalRotation) * radius;
        const goalRadius = 20;

        const checkDistance = (logo) => {
            const distance = Math.sqrt((logo.x - goalX) ** 2 + (logo.y - goalY) ** 2);
            return distance < goalRadius + 25;
        };

        if (checkDistance(homeLogo)) {
            setScores(prev => ({ ...prev, home: prev.home + 1 }));
            if (!isMuted) {
                goalSoundRef.current.currentTime = 0;
                goalSoundRef.current.play().catch(e => console.log('Gol sesi hatası:', e));
            }
            state.current.goalEffect = { active: true, timer: 60, x: goalX, y: goalY };
            createParticles(goalX, goalY, 30, 'goal');

            // Logo pozisyonunu resetle
            homeLogo.x = centerX - 50 + Math.random() * 100;
            homeLogo.y = centerY - 50 + Math.random() * 100;
            homeLogo.dx = (Math.random() * 5 + 3) * (Math.random() < 0.5 ? 1 : -1);
            homeLogo.dy = (Math.random() * 5 + 3) * (Math.random() < 0.5 ? 1 : -1);
        }

        if (checkDistance(awayLogo)) {
            setScores(prev => ({ ...prev, away: prev.away + 1 }));
            if (!isMuted) {
                goalSoundRef.current.currentTime = 0;
                goalSoundRef.current.play().catch(e => console.log('Gol sesi hatası:', e));
            }
            state.current.goalEffect = { active: true, timer: 60, x: goalX, y: goalY };
            createParticles(goalX, goalY, 30, 'goal');

            // Logo pozisyonunu resetle
            awayLogo.x = centerX + 50 + Math.random() * 100;
            awayLogo.y = centerY - 50 + Math.random() * 100;
            awayLogo.dx = (Math.random() * 5 + 3) * (Math.random() < 0.5 ? 1 : -1);
            awayLogo.dy = (Math.random() * 5 + 3) * (Math.random() < 0.5 ? 1 : -1);
        }
    };

    // Ana animasyon fonksiyonu
    const startAnimation = (ctx) => {
        const animate = () => {
            if (!isSimulating) return;

            const { centerX, centerY, radius } = state.current;

            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            // Saha zemini
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, '#1a472a');
            gradient.addColorStop(1, '#0d2614');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();

            // Saha çizgisi
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = '#4CAF50';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Dış çizgi glow efekti
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(76, 175, 80, 0.3)';
            ctx.lineWidth = 8;
            ctx.stroke();

            // Diğer elemanları çiz
            drawGoal(ctx);
            updateAndDrawLogo(ctx, state.current.homeLogo, "home");
            updateAndDrawLogo(ctx, state.current.awayLogo, "away");
            checkGoal();
            drawParticles(ctx);
            drawGoalEffect(ctx);

            // Gol pozisyonunu güncelle
            state.current.goalRotation += 0.02;

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();
    };

    // Component mount/unmount yönetimi
    useEffect(() => {
        if (!isOpen) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;

        // Canvas boyutlarını ve başlangıç pozisyonlarını ayarla
        state.current.radius = Math.min(width, height) * 0.4;
        state.current.centerX = width / 2;
        state.current.centerY = height / 2;

        // Logo objelerini ayarla
        state.current.homeLogo = {
            x: state.current.centerX - 50,
            y: state.current.centerY,
            dx: 2,
            dy: 2,
            rotation: 0,
            image: new Image(),
        };

        state.current.awayLogo = {
            x: state.current.centerX + 50,
            y: state.current.centerY,
            dx: -2,
            dy: -2,
            rotation: 0,
            image: new Image(),
        };

        // Logo yüklenme kontrolü
        let loadedImages = 0;
        const initGame = () => {
            startAnimation(ctx);
            if (!isMuted) {
                bgMusicRef.current.play().catch(e => console.log('Ses oynatma hatası:', e));
            }
        };

        state.current.homeLogo.image.onload = () => {
            loadedImages++;
            if (loadedImages === 2) initGame();
        };

        state.current.awayLogo.image.onload = () => {
            loadedImages++;
            if (loadedImages === 2) initGame();
        };

        state.current.homeLogo.image.src = homeTeam.logo;
        state.current.awayLogo.image.src = awayTeam.logo;

        const timer = setTimeout(() => {
            setIsSimulating(false);
            if (!isMuted) {
                bgMusicRef.current.pause();
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        }, 30000);

        return () => {
            clearTimeout(timer);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            bgMusicRef.current.pause();
            bgMusicRef.current.currentTime = 0;
        };
    }, [isOpen, isMuted]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-900 rounded-xl p-6 max-w-2xl w-full border border-slate-800 shadow-2xl">
                <div className="flex justify-between items-center mb-1 lg:mb-6">
                    <h2 className="text-sm lg:text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">Maç Simülasyonu</h2>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="text-slate-400 hover:text-slate-200 transition-colors text-2xl"
                        >
                            {isMuted ? '🔇' : '🔊'}
                        </button>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-200 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="relative">
                    {isSimulating ? (
                        <>
                            <canvas
                                ref={canvasRef}
                                width={600}
                                height={600}
                                className="w-full border border-slate-700 rounded-xl bg-slate-950 shadow-xl"
                            />
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm text-slate-100 px-6 py-2 lg:py-3 rounded-full flex items-center gap-6 border border-slate-700 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 p-1 flex items-center justify-center">
                                        <img src={homeTeam.logo} alt={homeTeam.name} className="w-5 h-5 lg:w-6 lg:h-6" />
                                    </div>
                                    {/* <span className="font-medium">{homeTeam.name}</span> */}
                                </div>
                                <div className="text-xs lg:text-3xl font-bold flex text-slate-100 px-2">
                                    <span>
                                        {scores.home}
                                    </span> {" "} {"-"}  {" "}
                                    <span>
                                        {scores.away}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* <span className="font-medium">{awayTeam.name}</span> */}
                                    <div className="w-8 h-8 rounded-full bg-slate-800 p-1 flex items-center justify-center">
                                        <img src={awayTeam.logo} alt={awayTeam.name} className="w-5 h-5 lg:w-6 lg:h-6" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm text-slate-100 px-4 py-2 rounded-full border border-slate-700 shadow-lg">
                                <span className="font-bold">{currentMinute}'</span>
                            </div>
                        </>
                    ) : (
                        <div className="h-[600px] border border-slate-700 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center text-slate-100 shadow-xl">
                            <h2 className="text-lg lg:text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">Maç Sona Erdi!</h2>
                            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center border border-slate-800 shadow-lg">
                                <div className="flex items-center justify-center gap-12 mb-8">
                                    <div className="text-center">
                                        <div className="w-20 h-20 rounded-full bg-slate-800 p-2 flex items-center justify-center mb-3 border border-slate-700">
                                            <img src={homeTeam.logo} alt={homeTeam.name} className="w-10 h-10 lg:w-14 lg:h-14" />
                                        </div>
                                    </div>
                                    <div className="text-md lg:text-7xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
                                        {scores.home} - {scores.away}
                                    </div>
                                    <div className="text-center">
                                        <div className="w-20 h-20 rounded-full bg-slate-800 p-2 flex items-center justify-center mb-3 border border-slate-700">
                                            <img src={awayTeam.logo} alt={awayTeam.name} className="w-10 h-10 lg:w-14 lg:h-14" />
                                        </div>
                                    </div>
                                </div>

                                {scores.home !== scores.away && (
                                    <div className="text-lg lg:text-2xl font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 text-transparent bg-clip-text">
                                        {scores.home > scores.away ? homeTeam.name : awayTeam.name} Kazandı!
                                    </div>
                                )}
                                {scores.home === scores.away && (
                                    <div className="text-2xl font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 text-transparent bg-clip-text">
                                        Berabere!
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchSimulation;