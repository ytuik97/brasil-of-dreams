// sidebar.js - Script modular para sidebar lateral
class Sidebar {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
        this.sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
        this.sidebarShowBtn = document.getElementById('sidebarShowBtn');
        this.sidebarOverlay = document.getElementById('sidebarOverlay');
        this.body = document.body;
        
        this.isCollapsed = false;
        this.isHidden = false;
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }

    init() {
        this.setupCollapseButton();
        this.setupToggleButton();
        this.setupShowButton();
        this.setupOverlay();
        this.setupResize();
        this.highlightCurrentPage();
        this.addTooltips();
        
        // Mobile: começa escondida
        if (this.isMobile) {
            this.sidebar.classList.remove('mobile-open');
        }
    }

    // Botão de colapsar (comprimir sidebar)
    setupCollapseButton() {
        if (this.sidebarCollapseBtn) {
            this.sidebarCollapseBtn.addEventListener('click', () => {
                this.toggleCollapse();
            });
        }
    }

    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        
        if (this.isCollapsed) {
            this.sidebar.classList.add('collapsed');
            this.body.classList.add('sidebar-collapsed');
            this.sidebarCollapseBtn.innerHTML = '☰';
            this.sidebarCollapseBtn.title = 'Expandir Menu';
        } else {
            this.sidebar.classList.remove('collapsed');
            this.body.classList.remove('sidebar-collapsed');
            this.sidebarCollapseBtn.innerHTML = '☰';
            this.sidebarCollapseBtn.title = 'Comprimir Menu';
        }
        
        this.saveState();
    }

    // Botão de esconder (esconder sidebar completamente)
    setupToggleButton() {
        if (this.sidebarToggleBtn) {
            this.sidebarToggleBtn.addEventListener('click', () => {
                this.toggleHide();
            });
        }
    }

    toggleHide() {
        this.isHidden = !this.isHidden;
        
        if (this.isHidden) {
            this.sidebar.classList.add('hidden');
            this.body.classList.add('sidebar-hidden');
        } else {
            this.sidebar.classList.remove('hidden');
            this.body.classList.remove('sidebar-hidden');
        }
        
        this.saveState();
    }

    // Botão de mostrar (quando está escondida)
    setupShowButton() {
        if (this.sidebarShowBtn) {
            this.sidebarShowBtn.addEventListener('click', () => {
                if (this.isMobile) {
                    this.openMobile();
                } else {
                    this.toggleHide();
                }
            });
        }
    }

    // Mobile: abrir sidebar
    openMobile() {
        this.sidebar.classList.add('mobile-open');
        this.sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Mobile: fechar sidebar
    closeMobile() {
        this.sidebar.classList.remove('mobile-open');
        this.sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Overlay para fechar em mobile
    setupOverlay() {
        if (this.sidebarOverlay) {
            this.sidebarOverlay.addEventListener('click', () => {
                this.closeMobile();
            });
        }
    }

    // Detectar resize da janela
    setupResize() {
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            
            // Mudou de desktop para mobile ou vice-versa
            if (wasMobile !== this.isMobile) {
                if (this.isMobile) {
                    this.closeMobile();
                    this.sidebar.classList.remove('collapsed', 'hidden');
                    this.body.classList.remove('sidebar-collapsed', 'sidebar-hidden');
                } else {
                    this.loadState();
                }
            }
        });
    }

    // Destacar página atual
    highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const menuLinks = document.querySelectorAll('.sidebar-menu a');
        
        menuLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Adicionar tooltips nos links quando collapsed
    addTooltips() {
        const menuLinks = document.querySelectorAll('.sidebar-menu a');
        menuLinks.forEach(link => {
            const text = link.querySelector('.sidebar-menu-text');
            if (text) {
                link.setAttribute('data-tooltip', text.textContent.trim());
            }
        });
    }

    // Salvar estado no localStorage
    saveState() {
        if (!this.isMobile) {
            localStorage.setItem('sidebarCollapsed', this.isCollapsed);
            localStorage.setItem('sidebarHidden', this.isHidden);
        }
    }

    // Carregar estado do localStorage
    loadState() {
        if (!this.isMobile) {
            const collapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            const hidden = localStorage.getItem('sidebarHidden') === 'true';
            
            if (collapsed) {
                this.isCollapsed = false;
                this.toggleCollapse();
            }
            
            if (hidden) {
                this.isHidden = false;
                this.toggleHide();
            }
        }
    }
}

// Inicializar automaticamente
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = new Sidebar();
    
    // Fechar mobile ao clicar em link
    const menuLinks = document.querySelectorAll('.sidebar-menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.closeMobile();
            }
        });
    });
});