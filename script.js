
/**
 * =====================================================
 * ENEL SUSTAINABILITY REPORTS - SCRIPT PRINCIPALE
 * =====================================================
 * 
 * Questo script gestisce tutte le funzionalità interattive del sito web
 * dei report di sostenibilità Enel, inclusi:
 * - Download dei report PDF
 * - Gestione del video aziendale
 * - Pop-up di benvenuto
 * - Navigazione smooth scroll
 * - Feedback utente e notifiche
 * - Accessibilità e interazioni da tastiera
 * 
 * Autore: Michele Bruno
 * Progetto: Project Work 3.7 - Innovazione web per la rendicontazione sostenibile
 * Anno Accademico: 2025/2026
 */

// =====================================================
// GESTIONE DOWNLOAD DEI REPORT PDF
// =====================================================

/**
 * Funzione principale per gestire il download dei report PDF
 * Gestisce il feedback visivo all'utente e la validazione degli input
 * 
 * @param {string} filename - Il nome del file PDF da scaricare
 * @param {Event} event - L'evento click del pulsante
 */
function downloadReport(filename, event) {
  // Validazione rigorosa dell'input filename
  if (!filename || typeof filename !== 'string' || filename.trim() === '') {
    console.error('Nome file non valido:', filename);
    mostraMessaggioErrore('Errore nel download: file non trovato');
    return;
  }

  // Ottiene il riferimento al pulsante che ha attivato il download
  const button = event?.currentTarget || event?.target;
  if (!button || !button.tagName) {
    console.error('Pulsante non trovato o non valido');
    mostraMessaggioErrore('Errore: impossibile avviare il download');
    return;
  }

  // Salva lo stato originale del pulsante per il ripristino successivo
  const statoOriginale = {
    testo: button.textContent,
    disabilitato: button.disabled,
    classi: button.className
  };

  try {
    // Aggiorna l'interfaccia utente durante il processo di download
    aggiornaStatoPulsante(button, {
      testo: "Download in corso...",
      disabilitato: true,
      icona: "fas fa-spinner fa-spin"
    });

    // Crea un elemento link temporaneo per eseguire il download
    const link = document.createElement('a');
    link.href = filename;
    link.download = filename;
    link.style.display = 'none'; // Nasconde il link dall'interfaccia

    // Aggiunge attributi per l'accessibilità
    link.setAttribute('aria-label', `Download in corso: ${filename}`);

    // Esegue il download del file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Log per debug e monitoraggio
    console.log(`Download avviato per: ${filename}`);

    // Ripristina lo stato del pulsante dopo un delay appropriato
    setTimeout(() => {
      ripristinaStatoPulsante(button, statoOriginale);
      mostraMessaggioSuccesso('Download completato!');
    }, 2000);

  } catch (errore) {
    // Gestione degli errori durante il download
    console.error('Errore durante il download:', errore);
    mostraMessaggioErrore('Errore durante il download. Riprova più tardi.');
    
    // Ripristina immediatamente il pulsante in caso di errore
    ripristinaStatoPulsante(button, statoOriginale);
  }
}

/**
 * Aggiorna lo stato visivo del pulsante durante il download
 * Modifica testo, icona e attributi per fornire feedback all'utente
 * 
 * @param {HTMLElement} pulsante - L'elemento pulsante da aggiornare
 * @param {Object} nuovoStato - Il nuovo stato del pulsante
 */
function aggiornaStatoPulsante(pulsante, nuovoStato) {
  if (!pulsante) return;

  // Aggiorna il testo del pulsante
  pulsante.textContent = nuovoStato.testo;
  pulsante.disabled = nuovoStato.disabilitato;

  // Aggiorna l'icona se specificata
  if (nuovoStato.icona) {
    const icona = pulsante.querySelector('i');
    if (icona) {
      icona.className = nuovoStato.icona;
    }
  }

  // Aggiorna gli attributi ARIA per l'accessibilità
  pulsante.setAttribute('aria-busy', 'true');
  pulsante.setAttribute('aria-label', 'Download in corso, attendere...');
}

/**
 * Ripristina lo stato originale del pulsante dopo il download
 * 
 * @param {HTMLElement} pulsante - L'elemento pulsante da ripristinare
 * @param {Object} statoOriginale - Lo stato originale da ripristinare
 */
function ripristinaStatoPulsante(pulsante, statoOriginale) {
  if (!pulsante) return;

  // Ripristina tutti gli attributi originali
  pulsante.textContent = statoOriginale.testo;
  pulsante.disabled = statoOriginale.disabilitato;
  pulsante.className = statoOriginale.classi;

  // Rimuove gli attributi ARIA temporanei
  pulsante.removeAttribute('aria-busy');
  pulsante.removeAttribute('aria-label');
}

// =====================================================
// GESTIONE VIDEO PRINCIPALE
// =====================================================

/**
 * Inizializza il video principale con configurazione ottimizzata
 * Configura eventi, sottotitoli e ottimizzazioni per l'accessibilità
 */
function inizializzaVideo() {
  const video = document.getElementById('mainVideo');

  if (!video) {
    console.warn('Video principale non trovato nel DOM');
    return;
  }

  // Configurazione degli event listener per il video
  video.addEventListener('loadeddata', gestisciCaricamentoVideo);
  video.addEventListener('error', gestisciErroreVideo);
  video.addEventListener('loadstart', () => {
    console.log('Caricamento video iniziato');
  });

  // Inizializza i sottotitoli quando i metadati sono caricati
  video.addEventListener('loadedmetadata', inizializzaSottotitoli);

  // Migliora l'accessibilità del video
  video.setAttribute('aria-label', 'Video aziendale: Il nostro impegno per l\'elettrificazione');
}

/**
 * Inizializza e configura i sottotitoli del video
 * Gestisce le tracce di sottotitoli e configura gli event listener
 */
function inizializzaSottotitoli() {
  const video = document.getElementById('mainVideo');

  if (!video) {
    console.warn('Video non trovato per inizializzazione sottotitoli');
    return;
  }

  const tracks = video.textTracks;

  if (tracks && tracks.length > 0) {
    try {
      const track = tracks[0];

      // Abilita la visualizzazione dei sottotitoli
      track.mode = 'showing';

      // Monitora i cambiamenti delle caption per analytics e debug
      track.addEventListener('cuechange', () => {
        const activeCues = track.activeCues;
        if (activeCues && activeCues.length > 0) {
          console.log('Sottotitoli: nuova caption visualizzata');
        }
      });

      console.log('Sottotitoli inizializzati e abilitati con successo');
    } catch (error) {
      console.error('Errore nell\'inizializzazione dei sottotitoli:', error);
      // Fallback graceful: il video funziona comunque senza sottotitoli
    }
  } else {
    console.warn('Nessuna traccia sottotitoli trovata nel video');
  }
}

/**
 * Gestisce il completamento del caricamento del video
 * Verifica che il video sia stato caricato correttamente
 */
function gestisciCaricamentoVideo() {
  const video = document.getElementById('mainVideo');

  if (video) {
    console.log('Video caricato correttamente e pronto per la riproduzione');
  } else {
    console.warn('Elemento video non trovato dopo il caricamento');
  }
}

/**
 * Gestisce gli errori di caricamento del video
 * Mostra un messaggio di errore appropriato all'utente
 * 
 * @param {Event} evento - L'evento di errore del video
 */
function gestisciErroreVideo(evento) {
  console.error('Errore durante il caricamento del video:', evento);
  mostraMessaggioErrore('Impossibile caricare il video. Verifica la connessione internet.');
}

// =====================================================
// SISTEMA DI NOTIFICHE UTENTE
// =====================================================

/**
 * Mostra un messaggio di successo temporaneo
 * 
 * @param {string} messaggio - Il messaggio di successo da mostrare
 */
function mostraMessaggioSuccesso(messaggio) {
  mostraNotifica(messaggio, 'success');
}

/**
 * Mostra un messaggio di errore temporaneo
 * 
 * @param {string} messaggio - Il messaggio di errore da mostrare
 */
function mostraMessaggioErrore(messaggio) {
  mostraNotifica(messaggio, 'error');
}

/**
 * Sistema unificato per la creazione e visualizzazione delle notifiche
 * Crea notifiche temporanee con animazioni e auto-rimozione
 * 
 * @param {string} messaggio - Il testo del messaggio
 * @param {string} tipo - Il tipo di notifica ('success', 'error', 'info')
 */
function mostraNotifica(messaggio, tipo = 'info') {
  // Rimuove eventuali notifiche esistenti per evitare sovrapposizioni
  const notificheEsistenti = document.querySelectorAll('.notifica-temporanea');
  notificheEsistenti.forEach(notifica => notifica.remove());

  // Crea l'elemento notifica
  const notifica = document.createElement('div');
  notifica.className = `notifica-temporanea notifica-${tipo}`;
  notifica.textContent = messaggio;
  notifica.setAttribute('role', 'alert');
  notifica.setAttribute('aria-live', 'polite');

  // Applica gli stili inline per la notifica
  Object.assign(notifica.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '500',
    zIndex: '1000',
    backgroundColor: tipo === 'success' ? '#00a033' : '#e74c3c',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transform: 'translateX(100%)', // Inizia fuori schermo
    transition: 'transform 0.3s ease'
  });

  // Aggiunge la notifica al DOM
  document.body.appendChild(notifica);

  // Animazione di entrata (slide-in da destra)
  setTimeout(() => {
    notifica.style.transform = 'translateX(0)';
  }, 10);

  // Rimozione automatica dopo 3 secondi con animazione di uscita
  setTimeout(() => {
    notifica.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notifica.parentNode) {
        notifica.remove();
      }
    }, 300);
  }, 3000);
}

// =====================================================
// GESTIONE POP-UP DI BENVENUTO
// =====================================================

/**
 * Mostra il pop-up di benvenuto all'apertura della pagina
 * Configura l'accessibilità e previene lo scroll della pagina
 */
function showWelcomePopup() {
  const popup = document.getElementById('welcomePopup');

  if (!popup) {
    console.warn('Pop-up di benvenuto non trovato nel DOM');
    return;
  }

  // Salva l'elemento con focus prima di aprire il popup
  window.focusedElementBeforePopup = document.activeElement;

  // Mostra il pop-up con la classe CSS appropriata
  popup.classList.add('show');

  // Previene lo scroll della pagina quando il pop-up è aperto
  document.body.style.overflow = 'hidden';

  // Imposta il focus sul titolo del pop-up per VoiceOver
  setTimeout(() => {
    const title = popup.querySelector('#popup-title');
    if (title) {
      title.focus();
      title.setAttribute('tabindex', '0');
    }
  }, 300);

  // Aggiunge la gestione dei tasti per l'accessibilità
  popup.addEventListener('keydown', handlePopupKeydown);

  console.log('Pop-up di benvenuto mostrato con successo');
}

/**
 * Chiude il pop-up di benvenuto e ripristina la normale navigazione
 */
function closeWelcomePopup() {
  const popup = document.getElementById('welcomePopup');

  if (!popup) {
    console.warn('Pop-up di benvenuto non trovato nel DOM');
    return;
  }

  // Nasconde il pop-up rimuovendo la classe CSS
  popup.classList.remove('show');

  // Ripristina lo scroll normale della pagina
  document.body.style.overflow = '';

  // Ripristina il focus all'elemento precedente o al logo
  setTimeout(() => {
    if (window.focusedElementBeforePopup) {
      window.focusedElementBeforePopup.focus();
      window.focusedElementBeforePopup = null;
    } else {
      // Focalizza il logo come punto di partenza sicuro
      const logo = document.querySelector('.logo');
      if (logo) {
        logo.focus();
        logo.setAttribute('tabindex', '0');
      }
    }
  }, 100);

  // Rimuove l'event listener per ottimizzare le performance
  popup.removeEventListener('keydown', handlePopupKeydown);

  console.log('Pop-up di benvenuto chiuso con successo');
}

/**
 * Gestisce la navigazione da tastiera all'interno del pop-up
 * Implementa trap focus e chiusura con Escape per l'accessibilità
 * 
 * @param {KeyboardEvent} evento - L'evento tastiera
 */
function handlePopupKeydown(evento) {
  // Chiude il pop-up con il tasto Escape
  if (evento.key === 'Escape') {
    evento.preventDefault();
    closeWelcomePopup();
    return;
  }

  // Implementa trap focus con il tasto Tab
  if (evento.key === 'Tab') {
    const popup = document.getElementById('welcomePopup');
    const focusableElements = popup.querySelectorAll(
      'h2[tabindex], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    // Filtro per rimuovere elementi nascosti o disabilitati
    const visibleFocusableElements = Array.from(focusableElements).filter(element => {
      return element.offsetParent !== null && !element.disabled && !element.hasAttribute('hidden');
    });

    if (visibleFocusableElements.length === 0) return;

    const firstElement = visibleFocusableElements[0];
    const lastElement = visibleFocusableElements[visibleFocusableElements.length - 1];

    // Navigazione ciclica in avanti
    if (!evento.shiftKey && document.activeElement === lastElement) {
      evento.preventDefault();
      firstElement.focus();
    } 
    // Navigazione ciclica all'indietro
    else if (evento.shiftKey && document.activeElement === firstElement) {
      evento.preventDefault();
      lastElement.focus();
    }
  }

  // Attiva elemento con Spazio o Invio
  if (evento.key === ' ' || evento.key === 'Enter') {
    const activeElement = document.activeElement;
    if (activeElement && activeElement.tagName === 'BUTTON') {
      evento.preventDefault();
      activeElement.click();
    }
  }
}

// =====================================================
// NAVIGAZIONE SMOOTH SCROLL
// =====================================================

/**
 * Inizializza il sistema di navigazione smooth scroll
 * Configura i link di navigazione con scroll fluido e offset personalizzati
 */
function inizializzaNavigazione() {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', function(evento) {
      evento.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // Calcola l'offset per compensare header e menu fissi
        const headerHeight = document.querySelector('header').offsetHeight || 60;
        const navHeight = document.querySelector('.section-nav').offsetHeight || 80;

        // Offset specifici per ogni sezione
        let offset;
        if (targetId === '#unified-reports') {
          // Offset maggiore per puntare ai report specifici
          offset = headerHeight + navHeight + 150;
        } else if (targetId === '#reports-section') {
          // Offset per la sezione report generale
          offset = headerHeight + navHeight + 50;
        } else {
          // Offset normale per altre sezioni
          offset = headerHeight + navHeight + 20;
        }

        // Calcola la posizione finale di scroll
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

        // Esegue lo scroll fluido verso la destinazione
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Aggiorna il menu per evidenziare il link attivo
        aggiornaMenuAttivo(this);

        // Effetto di evidenziazione per la sezione report
        const linkText = this.querySelector('.nav-text').textContent;
        if (targetId === '#reports-section' && linkText === 'Report') {
          setTimeout(() => {
            const unifiedCard = document.querySelector('.unified-reports-card');
            if (unifiedCard) {
              unifiedCard.style.animation = 'reportCardHighlight 2s ease-out';
              setTimeout(() => {
                unifiedCard.style.animation = '';
              }, 2000);
            }
          }, 300);
        }

        console.log(`Navigazione verso: ${targetId} (${linkText})`);
      }
    });
  });
}

/**
 * Aggiorna il menu di navigazione evidenziando il link attivo
 * 
 * @param {HTMLElement} linkAttivo - Il link che è stato cliccato
 */
function aggiornaMenuAttivo(linkAttivo) {
  // Rimuove la classe active da tutti i link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => link.classList.remove('active'));

  // Aggiunge la classe active al link corrente
  linkAttivo.classList.add('active');
}

/**
 * Gestisce l'evidenziazione automatica del menu basata sullo scroll
 * Usa Intersection Observer per detectare quale sezione è attualmente visibile
 */
function gestisciHighlightSezioni() {
  const sezioni = document.querySelectorAll('#reports-section, #info-section, #video-section');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sezioni.length === 0) return;

  // Configura l'Intersection Observer per monitorare le sezioni visibili
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sezioneId = entry.target.id;
        const linkCorrispondente = document.querySelector(`a[href="#${sezioneId}"]`);

        if (linkCorrispondente) {
          // Aggiorna l'evidenziazione del menu
          navLinks.forEach(link => link.classList.remove('active'));
          linkCorrispondente.classList.add('active');
        }
      }
    });
  }, {
    root: null,
    rootMargin: '-100px 0px -60% 0px', // Attiva quando la sezione è ben visibile
    threshold: 0.3
  });

  // Osserva tutte le sezioni principali
  sezioni.forEach(sezione => observer.observe(sezione));
}

// =====================================================
// MIGLIORAMENTI ACCESSIBILITÀ
// =====================================================

/**
 * Aggiunge gestione avanzata della navigazione da tastiera
 * Migliora l'accessibilità per utenti che navigano con la tastiera
 */
function aggiungiGestioneTastiera() {
  // Gestione tastiera per card report
  const reportCards = document.querySelectorAll('.report-item');
  reportCards.forEach(card => {
    card.addEventListener('keydown', (evento) => {
      if (evento.key === 'Enter' || evento.key === ' ') {
        evento.preventDefault();
        const pulsante = card.querySelector('button');
        if (pulsante && !pulsante.disabled) {
          pulsante.click();
        }
      }
    });
  });

  // Gestione tastiera per card informative
  const infoCards = document.querySelectorAll('.info-card');
  infoCards.forEach(card => {
    card.addEventListener('keydown', (evento) => {
      if (evento.key === 'Enter' || evento.key === ' ') {
        evento.preventDefault();
        // Fornisce feedback vocale per screen reader
        const title = card.querySelector('h3');
        if (title) {
          announceToScreenReader(`Selezionato: ${title.textContent}`);
        }
      }
    });
  });

  // Gestione tastiera per menu di navigazione
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('keydown', (evento) => {
      if (evento.key === 'Enter' || evento.key === ' ') {
        evento.preventDefault();
        link.click();
      }
    });
  });
}

/**
 * Annuncia contenuto agli screen reader (versione semplificata per VoiceOver)
 * @param {string} messaggio - Il messaggio da annunciare
 */
function announceToScreenReader(messaggio) {
  // Versione semplificata che non interferisce con VoiceOver
  console.log('Screen reader announcement:', messaggio);
}

// =====================================================
// GESTIONE ERRORI E PERFORMANCE
// =====================================================

/**
 * Gestisce il ridimensionamento della finestra con debouncing
 * Ottimizza le performance evitando troppe chiamate durante il resize
 */
let timeoutResize;
function gestisciResize() {
  // Cancella il timeout precedente per implementare il debouncing
  clearTimeout(timeoutResize);

  // Esegue la logica di ridimensionamento solo dopo 250ms di inattività
  timeoutResize = setTimeout(() => {
    console.log('Finestra ridimensionata, ricontrollando layout...');

    // Verifica e aggiorna il layout del video se necessario
    const video = document.getElementById('mainVideo');
    if (video) {
      console.log('Layout video aggiornato per nuove dimensioni schermo');
    }
  }, 250);
}

/**
 * Gestisce errori JavaScript globali non catturati
 * Fornisce logging dettagliato per il debugging
 * 
 * @param {ErrorEvent} evento - L'evento di errore
 */
function gestisciErroreGlobale(evento) {
  console.error('Errore JavaScript non gestito:', {
    messaggio: evento.message,
    file: evento.filename,
    linea: evento.lineno,
    colonna: evento.colno,
    stack: evento.error?.stack
  });
  
  // Mostra un messaggio discreto all'utente solo per errori critici
  if (evento.message && evento.message.includes('critical')) {
    mostraNotifica('Si è verificato un errore. La pagina potrebbe non funzionare correttamente.', 'error');
  }
}

// =====================================================
// INIZIALIZZAZIONE PRINCIPALE
// =====================================================

/**
 * Funzione di inizializzazione principale del sito
 * Configura tutti i componenti e le funzionalità quando il DOM è pronto
 */
function inizializzaSito() {
  console.log('Inizializzazione script principale...');

  try {
    // Inizializza tutti i moduli principali
    inizializzaVideo();
    aggiungiGestioneTastiera();
    inizializzaNavigazione();
    gestisciHighlightSezioni();

    // Configura il pop-up di benvenuto - mostra sempre al caricamento
    const popup = document.getElementById('welcomePopup');
    if (popup) {
      // Mostra il pop-up dopo un breve ritardo per permettere il caricamento
      setTimeout(() => {
        showWelcomePopup();
      }, 500);
    }

    // Indica che JavaScript è abilitato per il CSS
    document.body.classList.add('js-enabled');

    console.log('Script inizializzato con successo');

  } catch (errore) {
    console.error('Errore durante l\'inizializzazione:', errore);
    // Fallback graceful per mantenere il sito funzionante
    mostraNotifica('Alcune funzionalità potrebbero non essere disponibili.', 'error');
  }
}

// =====================================================
// EVENT LISTENERS GLOBALI
// =====================================================

// Inizializza il sito quando il DOM è completamente caricato
document.addEventListener('DOMContentLoaded', inizializzaSito);

// Gestisce gli errori JavaScript globali
window.addEventListener('error', gestisciErroreGlobale);

// Gestisce il ridimensionamento della finestra con ottimizzazione
window.addEventListener('resize', gestisciResize);

// =====================================================
// FINE SCRIPT PRINCIPALE
// =====================================================
