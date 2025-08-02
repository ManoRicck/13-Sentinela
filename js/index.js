document.addEventListener("DOMContentLoaded", () => {
// Verifique se o usuário prefere movimento reduzido
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

//elementos DOM
  const timeDisplay = document.getElementById("time-display");
  const uptimeDisplay = document.getElementById("uptime-display");
  const logContent = document.getElementById("log-content");
  const toggleGridBtn = document.getElementById("toggle-grid");
  const resetSystemBtn = document.getElementById("reset-system");
  const triggerGlitchBtn = document.getElementById("trigger-glitch");
  const toggleFilterBtn = document.getElementById("toggle-filter");
  const cameraFeeds = document.querySelectorAll(".camera-feed");
  const cameraGrid = document.querySelector(".camera-grid");
  const videoElements = document.querySelectorAll(".camera-video");
  const scanLines = document.querySelectorAll(".scan-line");

  const videoSources = [
    "./video/cam1.mp4", 
    "./video/cam2.mp4",
    "./video/cam3.mp4",
    "./video/cam4.mp4",
    "./video/cam5.mp4",
    "./video/cam6.mp4",
    "./video/cam7.mp4",
    "./video/cam8.mp4",
  ];

  let uptimeSeconds = 0;
  
  function updateUptime() {
    uptimeSeconds++;
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    
    uptimeDisplay.textContent = 
      `${hours.toString().padStart(2, '0')}:` +
      `${minutes.toString().padStart(2, '0')}:` +
      `${seconds.toString().padStart(2, '0')}`;
  }

  updateUptime();
  const uptimeInterval = setInterval(updateUptime, 1000);
  
  // No botão de reset, adicione para resetar o uptime também:
  resetSystemBtn.addEventListener("click", () => {
    // [Seu código existente de reset...]
    
    // Resetar o contador de uptime
    clearInterval(uptimeInterval);
    uptimeSeconds = 0;
    updateUptime();
    uptimeInterval = setInterval(updateUptime, 1000);
    
    // [Restante do seu código de reset...]
  });

// Estado de exibição atual e estado do filtro
  let gridState = "four-per-row"; // 'quatro por linha', 'dois por linha', 'coluna única'
  let isColorMode = true;

// Inicializar e configurar feeds de câmera
  function initializeSystem() {
//Definir hora atual
    updateTime();
    setInterval(updateTime, 1000);

// Randomizar velocidades de linha de varredura
    randomizeScanLines();

// Carregar vídeos - usar o mesmo vídeo para vários feeds se menos de 6 estiverem disponíveis
    videoElements.forEach((video, index) => {
    // Use o módulo para percorrer os vídeos disponíveis se houver menos de 6
      const sourceIndex = index % videoSources.length;
      video.src = videoSources[sourceIndex];
      video.load();

      // Reproduza o vídeo quando estiver pronto - exceto para câmeras offline
      video.addEventListener("canplaythrough", () => {
        // Crie estilos de câmeras offline de forma diferente, mas reproduza todos os vídeos
  if (video.id === "video3" || video.id === "video5") {
    video.style.opacity = 0.5; // Faça o vídeo parecer mais escuro
    
    // Adicione mais ruído estático às câmeras offline
    const feed = video.closest(".camera-feed");
    const noiseOverlay = feed.querySelector(".noise-overlay");
    noiseOverlay.style.opacity = 0.15; // Mais estático
  }
  
  // Reproduz todos os vídeos
  video.play().catch((error) => {
    console.error("Video playback error:", error);
    logEvent("ERROR: Camera feed " + (index + 1) + " playback failed");
  });
      });
    });

    // Definir vídeos para o modo colorido por padrão
    videoElements.forEach((video) => {
      video.classList.add("color-mode");
    });

    // Define o texto do botão para corresponder ao estado inicial
    toggleFilterBtn.textContent = "BW MODE";

    // Inicializar efeitos de falha
    if (!prefersReducedMotion) {
      setupGlitchEffects();
    } else {
      setupReducedMotionEffects();
    }

    // Inicialização do log
    logEvent("SISTEMA DE SEGURANÇA INICIALIZADO");
    logEvent("CARREGANDO FEEDS DA CÂMERA...");

    // Simular problemas do sistema
    setTimeout(() => {
      logEvent("AVISO: TENTATIVAS DE ACESSO NÃO AUTORIZADO DETECTADAS");
      setTimeout(() => {
        logEvent("INTEGRIDADE DO SISTEMA: 68%");
        setTimeout(() => {
          logEvent("APLICANDO PROTOCOLOS DE EMERGÊNCIA...");
          setTimeout(() => {
            logEvent("CAMADA DE CRIPTOGRAFIA COMPROMETIDA");
          }, 3000);
        }, 2000);
      }, 1500);
    }, 1000);
  }

  // Randomizar velocidades e densidades de linhas de varredura
  function randomizeScanLines() {
    scanLines.forEach((scanLine) => {
      // Duração de animação aleatória entre 4 e 12 segundos
      const duration = 4 + Math.random() * 8;
      scanLine.style.animationDuration = `${duration}s`;

      // Densidade de linha aleatória
      const density = 2 + Math.random() * 6;
      scanLine.style.backgroundSize = `100% ${density}px`;

      // atraso aleatório
      scanLine.style.animationDelay = `-${Math.random() * 10}s`;
    });
  }

  //Atualiza a exibição do tempo
  function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
  }

  // Registrar eventos no terminal
  function logEvent(message) {
    const timestamp = timeDisplay.textContent;
    logContent.innerHTML =
      `> [${timestamp}] ${message}<br>` + logContent.innerHTML;
    logContent.scrollTop = 0;
  }

  // Configurar efeitos de falha para câmeras
  function setupGlitchEffects() {
    cameraFeeds.forEach((feed, index) => {
      const glitchOverlay = feed.querySelector(".glitch-overlay");
      const colorDistortion = feed.querySelector(".color-distortion");
      const video = feed.querySelector(".camera-video");

      // Aciona uma falha imediata na inicialização
      setTimeout(() => {
        applyRandomGlitch(feed, video, glitchOverlay, colorDistortion);
      }, Math.random() * 1000); // Atraso aleatório no primeiro segundo

      // Intervalos de falhas aleatórias para cada câmera - mais frequentes agora
      const minInterval = 2000 + index * 500;
      const maxInterval = 8000 + index * 1000;

      function scheduleNextGlitch() {
        const nextGlitchDelay =
          Math.random() * (maxInterval - minInterval) + minInterval;

        setTimeout(() => {
          if (Math.random() < 0.85) {
            // 85% de chance de uma falha - mais provável
            applyRandomGlitch(feed, video, glitchOverlay, colorDistortion);
          }
          scheduleNextGlitch();
        }, nextGlitchDelay);
      }

      scheduleNextGlitch();
    });
  }

  // Aplique um efeito de falha aleatória a uma câmera
  function applyRandomGlitch(feed, video, glitchOverlay, colorDistortion) {
    // Use glitches mais intensos e modernos no estilo neon
    const glitchDuration = Math.random() * 1000 + 300;

    // Escolha aleatoriamente de 1 a 3 efeitos para aplicar simultaneamente
    const numEffects = Math.floor(Math.random() * 3) + 1;
    const possibleEffects = [
      "slice",
      "rgb-split",
      "pixel",
      "flicker",
      "neon",
      "distort",
      "invert",
      "vhs",
      "matrix",
      "xray"
    ];
    const selectedEffects = [];

    // Selecione efeitos únicos aleatórios // Selecione efeitos únicos aleatórios
    while (selectedEffects.length < numEffects) {
      const effect =
        possibleEffects[Math.floor(Math.random() * possibleEffects.length)];
      if (!selectedEffects.includes(effect)) {
        selectedEffects.push(effect);
      }
    }

    // Aplicar cada efeito selecionado
    selectedEffects.forEach((effect) => {
      switch (effect) {
        case "slice":
          // Crie um efeito de corte/rasgo horizontal com destaques neon
          const sliceCount = Math.floor(Math.random() * 5) + 1;

          for (let i = 0; i < sliceCount; i++) {
            const sliceHeight = Math.random() * 30 + 5; // 5-35px slice
            const yPos = Math.random() * 80; // Posicione-se em qualquer lugar entre os 80% melhores

            // Cria o elemento slice
            const slice = document.createElement("div");
            slice.style.position = "absolute";
            slice.style.left = "0";
            slice.style.right = "0";
            slice.style.top = `${yPos}%`;
            slice.style.height = `${sliceHeight}px`;
            slice.style.backgroundColor = "transparent";
            slice.style.overflow = "hidden";
            slice.style.zIndex = "5";

            // Cria um clone do vídeo dentro do slice, mas deslocado
            const offsetX = Math.random() * 20 - 10;
            const offsetY = Math.random() * 10 - 5;
            slice.style.transform = `translateX(${offsetX}px)`;

            // Adicione uma borda neon para um efeito dramático
            const neonColor = ["#0ff", "#f0f", "#ff0", "#0f0"][
              Math.floor(Math.random() * 4)
            ];
            slice.style.boxShadow = `0 0 5px ${neonColor}, inset 0 0 5px ${neonColor}`;

            feed.querySelector(".camera-content").appendChild(slice);

            setTimeout(() => {
              slice.remove();
            }, glitchDuration - 50);
          }
          break;

        case "rgb-split":
          // Separação extrema de canais de cores RGB com movimento
          const rgbAmount = Math.random() * 20 + 10; // 10-30px split

          // Crie sombras RGB dramáticas com animação
          video.style.boxShadow = `
            ${rgbAmount}px 0 0 rgba(255, 0, 0, 0.8), 
            ${-rgbAmount}px 0 0 rgba(0, 255, 255, 0.8), 
            0 ${rgbAmount / 2}px 0 rgba(0, 255, 0, 0.8)
          `;

          // Animar a divisão RGB
          video.style.animation = `rgb-shift ${glitchDuration / 1000}s linear`;

          setTimeout(() => {
            video.style.boxShadow = "none";
            video.style.animation = "";
          }, glitchDuration);
          break;

        case "pixel":
          // Efeito de pixelização/mosaico com bordas neon
          video.style.filter = `blur(1px) contrast(1.5)`;

          // Adicione uma sobreposição de pixelização
          const pixelOverlay = document.createElement("div");
          pixelOverlay.style.position = "absolute";
          pixelOverlay.style.top = "0";
          pixelOverlay.style.left = "0";
          pixelOverlay.style.right = "0";
          pixelOverlay.style.bottom = "0";
          pixelOverlay.style.backgroundImage =
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 6px)";
          pixelOverlay.style.backgroundSize = "6px 6px";
          pixelOverlay.style.zIndex = "4";
          pixelOverlay.style.mixBlendMode = "overlay";

          feed.querySelector(".camera-content").appendChild(pixelOverlay);

          setTimeout(() => {
            video.style.filter = "";
            pixelOverlay.remove();
          }, glitchDuration);
          break;

        case "flicker":
          // Efeito estroboscópico/cintilante rápido com mudanças de cor
          const flickerCount = Math.floor(Math.random() * 10) + 5; // 5-15 piscadas
          const flickerColors = [
            "rgba(255,0,255,0.5)",
            "rgba(0,255,255,0.5)",
            "rgba(255,255,0,0.5)",
            "rgba(0,0,0,0.7)"
          ];

          for (let i = 0; i < flickerCount; i++) {
            setTimeout(() => {
              // Cintilação aleatória de opacidade
              feed.style.opacity = Math.random() * 0.6 + 0.4;

              // Jitter de posição aleatória
              const jitterX = Math.random() * 10 - 5;
              const jitterY = Math.random() * 10 - 5;
              video.style.transform = `translate(${jitterX}px, ${jitterY}px)`;

              // Sobreposição de cores aleatórias
              if (Math.random() < 0.5) {
                colorDistortion.style.backgroundColor =
                  flickerColors[
                    Math.floor(Math.random() * flickerColors.length)
                  ];
                colorDistortion.style.opacity = 0.7;
              } else {
                colorDistortion.style.opacity = 0;
              }

              // Último piscar, reinicie tudo
              if (i === flickerCount - 1) {
                feed.style.opacity = 1;
                video.style.transform = "none";
                colorDistortion.style.opacity = 0;
              }
            }, (glitchDuration / flickerCount) * i);
          }
          break;

        case "neon":
          // Brilho neon/efeito de borda com supersaturação
          video.style.filter = `saturate(300%) brightness(1.2) contrast(1.5)`;

          //Adiciona borda neon
          feed.querySelector(".camera-content").style.boxShadow = `
            inset 0 0 20px rgba(0, 255, 255, 0.8),
            0 0 10px rgba(255, 0, 255, 0.8)
          `;

          // Adicione uma animação de pulso sutil
          feed.querySelector(".camera-content").style.animation =
            "neon-pulse 0.5s alternate infinite";

          setTimeout(() => {
            video.style.filter = "";
            feed.querySelector(".camera-content").style.boxShadow = "";
            feed.querySelector(".camera-content").style.animation = "";
          }, glitchDuration);
          break;

        case "distort":
          // Deformação/distorção extrema
          const skewX = Math.random() * 40 - 20;
          const skewY = Math.random() * 40 - 20;
          const rotate = Math.random() * 10 - 5;
          const scale = 0.8 + Math.random() * 0.4;

          video.style.transform = `skew(${skewX}deg, ${skewY}deg) rotate(${rotate}deg) scale(${scale})`;

          // Adicionar efeito pulsante
          setTimeout(() => {
            video.style.transform = `skew(${-skewX / 2}deg, ${
              -skewY / 2
            }deg) rotate(${-rotate}deg) scale(${2 - scale})`;

            setTimeout(() => {
              video.style.transform = "none";
            }, glitchDuration / 3);
          }, glitchDuration / 3);
          break;

        case "invert":
          // Inversão de cores com flashing
          video.style.filter = `invert(100%) hue-rotate(180deg)`;

          setTimeout(() => {
            video.style.filter = "";

            // Breve flash
            setTimeout(() => {
              video.style.filter = `invert(100%) hue-rotate(90deg)`;

              setTimeout(() => {
                video.style.filter = "";
              }, 100);
            }, 200);
          }, glitchDuration - 300);
          break;

        case "vhs":
          // Problemas de rastreamento de VHS com linhas de digitalização
          const scanLine = feed.querySelector(".scan-line");
          scanLine.style.opacity = 0.8;
          scanLine.style.backgroundSize = "100% 4px";

          // Adicionar linhas de rastreamento horizontais
          for (let i = 0; i < 3; i++) {
            const trackingLine = document.createElement("div");
            trackingLine.style.position = "absolute";
            trackingLine.style.left = "0";
            trackingLine.style.right = "0";
            trackingLine.style.height = "2px";
            trackingLine.style.top = `${Math.random() * 100}%`;
            trackingLine.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
            trackingLine.style.zIndex = "5";
            trackingLine.style.boxShadow = "0 0 5px rgba(0, 255, 255, 0.8)";

            feed.querySelector(".camera-content").appendChild(trackingLine);

            // Animar a linha de rastreamento
            setTimeout(() => {
              trackingLine.style.transform = `translateY(${
                Math.random() * 50 - 25
              }px)`;
              setTimeout(() => {
                trackingLine.remove();
              }, 300);
            }, Math.random() * 300);
          }

          //Deslocamento horizontal
          video.style.transform = `translateX(${Math.random() * 30 - 15}px)`;

          setTimeout(() => {
            scanLine.style.opacity = "";
            scanLine.style.backgroundSize = "";
            video.style.transform = "none";
          }, glitchDuration);
          break;

        case "matrix":
          // Efeito de chuva digital estilo Matrix
          const matrixOverlay = document.createElement("div");
          matrixOverlay.style.position = "absolute";
          matrixOverlay.style.top = "0";
          matrixOverlay.style.left = "0";
          matrixOverlay.style.right = "0";
          matrixOverlay.style.bottom = "0";
          matrixOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
          matrixOverlay.style.zIndex = "4";
          matrixOverlay.style.color = "#0f0";
          matrixOverlay.style.fontSize = "10px";
          matrixOverlay.style.overflow = "hidden";
          matrixOverlay.style.mixBlendMode = "screen";

          // Gerar caracteres de matriz aleatórios
          let matrixHtml = "";
          for (let i = 0; i < 20; i++) {
            const chars =
              "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデド";
            const randomChars = Array.from(
              { length: 20 },
              () => chars[Math.floor(Math.random() * chars.length)]
            ).join("");
            matrixHtml += `<div style="opacity:${
              Math.random() * 0.7 + 0.3
            }">${randomChars}</div>`;
          }
          matrixOverlay.innerHTML = matrixHtml;

          feed.querySelector(".camera-content").appendChild(matrixOverlay);

          // Adicionar filtro de falha digital
          video.style.filter = "brightness(1.2) contrast(1.5) saturate(0.7)";

          setTimeout(() => {
            matrixOverlay.remove();
            video.style.filter = "";
          }, glitchDuration);
          break;

        case "xray":
          // Raio X/efeito negativo com detecção de bordas dramática
          video.style.filter =
            "invert(85%) contrast(2) brightness(1.5) saturate(0.2)";

          //Adiciona efeito de varredura
          const scanOverlay = document.createElement("div");
          scanOverlay.style.position = "absolute";
          scanOverlay.style.top = "0";
          scanOverlay.style.left = "0";
          scanOverlay.style.right = "0";
          scanOverlay.style.bottom = "0";
          scanOverlay.style.background =
            "linear-gradient(transparent, rgba(0, 255, 255, 0.2), transparent)";
          scanOverlay.style.backgroundSize = "100% 100%";
          scanOverlay.style.animation = "scan-move 1s linear infinite";
          scanOverlay.style.zIndex = "4";
          scanOverlay.style.mixBlendMode = "exclusion";

          feed.querySelector(".camera-content").appendChild(scanOverlay);

          setTimeout(() => {
            video.style.filter = "";
            scanOverlay.remove();
          }, glitchDuration);
          break;
      }
    });

    // Falha na câmera de registro com mensagens de erro dramáticas
    if (Math.random() < 0.6) {
      const cameraId = feed.querySelector(".camera-id").textContent;
      const glitchMessages = [
        "CORRUPÇÃO DA REALIDADE",
        "DESESTABILIZAÇÃO DE FEED",
        "INTERFERÊNCIA DIMENSIONAL",
        "ERRO DE BIT QUÂNTICO",
        "FALHA DE REDE NEURAL",
        "ANOMALIA TEMPORAL",
        "VIOLAÇÃO DE SISTEMA",
        "CONEXÃO FRAGMENTADA",
        "ERRO DE EXTRAÇÃO DE DADOS",
        "VIOLAÇÃO DE PROTOCOLO"
      ];
      const glitchMessage =
        glitchMessages[Math.floor(Math.random() * glitchMessages.length)];
      logEvent(`${glitchMessage}: ${cameraId}`);
    }
  }

  // Configurar efeitos alternativos de movimento reduzido
  function setupReducedMotionEffects() {
    cameraFeeds.forEach((feed) => {
      const noiseOverlay = feed.querySelector(".noise-overlay");
      noiseOverlay.style.opacity = 0.02;

      // Adicione indicadores visuais sutis em vez de animações
      feed.querySelector(".camera-content").style.border =
        "1px solid rgba(33, 150, 243, 0.3)";
    });
  }

  // Alternar tela cheia para uma câmera quando clicado
  cameraFeeds.forEach((feed) => {
    feed.addEventListener("click", () => {
      // Se já estiver em tela cheia, reverter
      if (feed.classList.contains("fullscreen")) {
        feed.classList.remove("fullscreen");
        document.body.style.overflow = "auto";
      } else {
        // Remover tela cheia de qualquer outro feed
        document.querySelectorAll(".camera-feed.fullscreen").forEach((f) => {
          f.classList.remove("fullscreen");
        });

        // Tornar este feed em tela cheia
        feed.classList.add("fullscreen");
        document.body.style.overflow = "hidden";

        // Registra a ação
        const cameraId = feed.querySelector(".camera-id").textContent;
        logEvent(`EXPANDED VIEW: ${cameraId}`);
      }
    });
  });

  // Alternar layout da grade
  toggleGridBtn.addEventListener("click", () => {
  switch (gridState) {
    case "four-per-row":
      cameraGrid.classList.remove("four-per-row");
      cameraGrid.classList.add("two-per-row");
      gridState = "two-per-row";
      toggleGridBtn.textContent = "2x GRID";
      logEvent("SWITCHED TO 2x4 GRID VIEW");
      break;
    case "two-per-row":
      cameraGrid.classList.remove("two-per-row");
      cameraGrid.classList.add("single-column");
      gridState = "single-column";
      toggleGridBtn.textContent = "1x GRID";
      logEvent("SWITCHED TO SINGLE COLUMN VIEW");
      break;
    case "single-column":
      cameraGrid.classList.remove("single-column");
      cameraGrid.classList.add("four-per-row");
      gridState = "four-per-row";
      toggleGridBtn.textContent = "4x GRID";
      logEvent("SWITCHED TO 4x2 GRID VIEW");
      break;
  }
});
  // Alternar filtro de cor / P&B
  toggleFilterBtn.addEventListener("click", () => {
    isColorMode = !isColorMode;

    videoElements.forEach((video) => {
      if (isColorMode) {
        video.classList.add("color-mode");
        toggleFilterBtn.textContent = "BW MODE";
      } else {
        video.classList.remove("color-mode");
        toggleFilterBtn.textContent = "COLOR MODE";
      }
    });

    logEvent(`SWITCHED TO ${isColorMode ? "COLOR" : "MONOCHROME"} MODE`);
  });

  //Botão de reinicialização do sistema
  resetSystemBtn.addEventListener("click", () => {
    document.querySelector(".status-alert").textContent = "REBOOTING";
    logEvent("SYSTEM RESET INITIATED");

    // Aplicar efeito de reinicialização visual
    document.querySelectorAll(".camera-content").forEach((content) => {
      content.style.opacity = 0.2;
    });

    // Simular reinicialização do sistema
    setTimeout(() => {
      logEvent("CLEARING MEMORY BUFFER...");
      setTimeout(() => {
        logEvent("RESTARTING CAMERA MODULES...");
        setTimeout(() => {
          // Restaurar feeds de câmera
          document.querySelectorAll(".camera-content").forEach((content) => {
            content.style.opacity = 1;
          });

          //Redefinir vídeos
          videoElements.forEach((video) => {
            video.currentTime = 0;
            video.play().catch((e) => console.error("Video restart error:", e));
          });

          // Randomizar linhas de varredura novamente
          randomizeScanLines();

          //Atualiza o status do sistema
          document.querySelector(".status-alert").textContent = "ONLINE";
          logEvent("SYSTEM SUCCESSFULLY REBOOTED");

          // Aciona algumas falhas aleatórias para simular instabilidade do sistema após a reinicialização
          setTimeout(() => {
            if (!prefersReducedMotion) {
              cameraFeeds.forEach((feed) => {
                const glitchOverlay = feed.querySelector(".glitch-overlay");
                const colorDistortion = feed.querySelector(".color-distortion");
                const video = feed.querySelector(".camera-video");

                setTimeout(() => {
                  applyRandomGlitch(
                    feed,
                    video,
                    glitchOverlay,
                    colorDistortion
                  );
                }, Math.random() * 2000);
              });
            }
          }, 1000);
        }, 1500);
      }, 1000);
    }, 1000);
  });

  // Botão de forçar falha
  triggerGlitchBtn.addEventListener("click", () => {
    logEvent("WARNING: MANUAL INTERFERENCE DETECTED");

    if (prefersReducedMotion) {
      // Feedback alternativo para movimento reduzido
      document.querySelectorAll(".camera-content").forEach((content) => {
        content.style.borderColor = "var(--error-color)";
        setTimeout(() => {
          content.style.borderColor = "rgba(33, 150, 243, 0.3)";
        }, 2000);
      });
      return;
    }

    

    // Aplicar falhas simultâneas a todas as câmeras
    cameraFeeds.forEach((feed) => {
      const glitchOverlay = feed.querySelector(".glitch-overlay");
      const colorDistortion = feed.querySelector(".color-distortion");
      const video = feed.querySelector(".camera-video");

      // Cria uma falha mais grave para este gatilho manual
      // Deslocamento horizontal e vertical aleatório
      video.style.transform = `translate(${Math.random() * 10 - 5}px, ${
        Math.random() * 10 - 5
      }px)`;

      // Divisão de canal de cores
      video.style.boxShadow = `${
        Math.random() * 8 - 4
      }px 0 0 rgba(255,0,0,0.5), ${
        Math.random() * -8 + 4
      }px 0 0 rgba(0,255,255,0.5)`;

      // Aumenta a estática
      feed.querySelector(".noise-overlay").style.opacity = 0.3;

      // Adicionar matiz de cor
      colorDistortion.style.opacity = 0.4;
      colorDistortion.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
      colorDistortion.style.mixBlendMode = "hard-light";

      // Redefinir após um pequeno atraso
      setTimeout(() => {
        video.style.transform = "none";
        video.style.boxShadow = "none";
        feed.querySelector(".noise-overlay").style.opacity = 0.03;
        colorDistortion.style.opacity = 0;

        // Às vezes, adicione uma falha secundária
        if (Math.random() < 0.5) {
          setTimeout(() => {
            applyRandomGlitch(feed, video, glitchOverlay, colorDistortion);
          }, Math.random() * 1000 + 500);
        }
      }, 800);
    });

    // Adicionar resposta do sistema à falha manual
    setTimeout(() => {
      logEvent("SYSTEM ATTEMPTING TO STABILIZE SIGNAL...");
    }, 1200);
  });

  // Manipule a tecla escape para sair da tela cheia
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const fullscreenCamera = document.querySelector(
        ".camera-feed.fullscreen"
      );
      if (fullscreenCamera) {
        fullscreenCamera.classList.remove("fullscreen");
        document.body.style.overflow = "auto";
      }
    }
  });

  // Inicializa o sistema
  initializeSystem();
});
