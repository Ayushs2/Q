// // document.addEventListener('DOMContentLoaded', () => {
// //     const body = document.body;
// //     const sidebar = document.querySelector('.sidebar');
// //     const burger = document.getElementById('sidebar-toggle');
// //     const uploadSection = document.getElementById('admin-upload');
// //     const logoutBtn = document.getElementById('logout-btn');
// //     const authLink = document.getElementById('auth-link');
// //     const themeBtn = document.getElementById('theme-toggle-btn');
// //     const path = location.pathname.split('/').pop() || 'index.html';

// //     // ===== Dark mode
// //     if (localStorage.getItem('theme') === 'dark') body.classList.add('dark-mode');
// //     themeBtn?.addEventListener('click', () => {
// //         body.classList.toggle('dark-mode');
// //         localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
// //     });

// //     // ===== Sidebar mobile toggle
// //     burger?.addEventListener('click', () => {
// //         sidebar?.classList.toggle('open');
// //     });

// //     // ===== Active nav link
// //     document.querySelectorAll('.nav a').forEach(a => {
// //         const href = a.getAttribute('href');
// //         if (href === path) a.classList.add('active');
// //     });

// //     // ===== Auth / Logout
// //     if (localStorage.getItem('token')) {
// //         authLink.style.display = 'none';
// //         logoutBtn.style.display = 'flex';
// //     } else {
// //         authLink.style.display = 'flex';
// //         logoutBtn.style.display = 'none';
// //     }

// //     logoutBtn?.addEventListener('click', (e) => {
// //         e.preventDefault();
// //         localStorage.removeItem('token');
// //         localStorage.removeItem('userId');
// //         localStorage.removeItem('isAdmin');
// //         location.href = 'auth.html';
// //     });
    
// //     // ===== Admin-only upload section
// //     const isAdmin = localStorage.getItem('isAdmin');
// //     if (uploadSection) {
// //         if (isAdmin === 'true') {
// //             uploadSection.style.display = 'block';
// //         } else {
// //             uploadSection.style.display = 'none';
// //         }
// //     }
// // });

// // document.addEventListener('DOMContentLoaded', () => {
// //     const body = document.body;
// //     const sidebar = document.querySelector('.sidebar');
// //     const burger = document.getElementById('sidebar-toggle');
// //     const uploadSection = document.getElementById('admin-upload');
// //     const logoutBtn = document.getElementById('logout-btn');
// //     const authLink = document.getElementById('auth-link');
// //     const themeBtn = document.getElementById('theme-toggle-btn');
// //     const content = document.querySelector('.content');
// //     const path = location.pathname.split('/').pop() || 'index.html';

// //     // ===== Dark mode
// //     if (localStorage.getItem('theme') === 'dark') body.classList.add('dark-mode');
// //     themeBtn?.addEventListener('click', () => {
// //         body.classList.toggle('dark-mode');
// //         localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
// //     });

// //     // ===== Sidebar persistent toggle
// //     const sidebarState = localStorage.getItem('sidebarState'); // 'shown' or 'hidden'

// //     // Apply saved state on load
// //     if (sidebarState === 'hidden') {
// //         sidebar?.classList.add('hidden');
// //         content?.classList.add('sidebar-hidden');
// //     } else {
// //         sidebar?.classList.remove('hidden');
// //         content?.classList.remove('sidebar-hidden');
// //     }

// //     // Hamburger click: toggle sidebar
// //     burger?.addEventListener('click', () => {
// //         sidebar?.classList.toggle('hidden');
// //         content?.classList.toggle('sidebar-hidden');

// //         // Save state
// //         if (sidebar?.classList.contains('hidden')) {
// //             localStorage.setItem('sidebarState', 'hidden');
// //         } else {
// //             localStorage.setItem('sidebarState', 'shown');
// //         }
// //     });

// //     // Sync sidebar across tabs
// //     window.addEventListener('storage', (event) => {
// //         if (event.key === 'sidebarState') {
// //             if (event.newValue === 'hidden') {
// //                 sidebar?.classList.add('hidden');
// //                 content?.classList.add('sidebar-hidden');
// //             } else {
// //                 sidebar?.classList.remove('hidden');
// //                 content?.classList.remove('sidebar-hidden');
// //             }
// //         }
// //     });

// //     // ===== Active nav link
// //     document.querySelectorAll('.nav a').forEach(a => {
// //         const href = a.getAttribute('href');
// //         if (href === path) a.classList.add('active');
// //     });

// //     // ===== Auth / Logout
// //     if (localStorage.getItem('token')) {
// //         authLink.style.display = 'none';
// //         logoutBtn.style.display = 'flex';
// //     } else {
// //         authLink.style.display = 'flex';
// //         logoutBtn.style.display = 'none';
// //     }

// //     logoutBtn?.addEventListener('click', (e) => {
// //         e.preventDefault();
// //         localStorage.removeItem('token');
// //         localStorage.removeItem('userId');
// //         localStorage.removeItem('isAdmin');
// //         location.href = 'auth.html';
// //     });
    
// //     // ===== Admin-only upload section
// //     const isAdmin = localStorage.getItem('isAdmin');
// //     if (uploadSection) {
// //         if (isAdmin === 'true') {
// //             uploadSection.style.display = 'block';
// //         } else {
// //             uploadSection.style.display = 'none';
// //         }
// //     }
// // });



// // document.addEventListener('DOMContentLoaded', () => {
// //     const body = document.body;
// //     const sidebar = document.querySelector('.sidebar');
// //     const burger = document.getElementById('sidebar-toggle');
// //     const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
// //     const hamburger = document.querySelector('.hamburger');
// //     const uploadSection = document.getElementById('admin-upload');
// //     const logoutBtn = document.getElementById('logout-btn');
// //     const authLink = document.getElementById('auth-link');
// //     const themeBtn = document.getElementById('theme-toggle-btn');
// //     const content = document.querySelector('.content');
// //     const path = location.pathname.split('/').pop() || 'index.html';

// //     // Create sidebar overlay for mobile
// //     let sidebarOverlay = document.querySelector('.sidebar-overlay');
// //     if (!sidebarOverlay) {
// //         sidebarOverlay = document.createElement('div');
// //         sidebarOverlay.className = 'sidebar-overlay';
// //         document.body.appendChild(sidebarOverlay);
// //     }

// //     // ===== Dark mode
// //     if (localStorage.getItem('theme') === 'dark') body.classList.add('dark-mode');
// //     themeBtn?.addEventListener('click', () => {
// //         body.classList.toggle('dark-mode');
// //         localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
// //     });

// //     // ===== Sidebar functions
// //     function openSidebar() {
// //         sidebar?.classList.add('active');
// //         sidebarOverlay?.classList.add('active');
// //         hamburger?.classList.add('active');
// //         mobileMenuBtn?.classList.add('active');
// //         content?.classList.add('sidebar-open');
// //     }

// //     function closeSidebar() {
// //         sidebar?.classList.remove('active');
// //         sidebarOverlay?.classList.remove('active');
// //         hamburger?.classList.remove('active');
// //         mobileMenuBtn?.classList.remove('active');
// //         content?.classList.remove('sidebar-open');
// //     }

// //     function toggleSidebar() {
// //         if (sidebar?.classList.contains('active')) {
// //             closeSidebar();
// //         } else {
// //             openSidebar();
// //         }
// //     }

// //     // ===== Desktop sidebar persistent toggle (for larger screens)
// //     const sidebarState = localStorage.getItem('sidebarState'); // 'shown' or 'hidden'

// //     // Check if we're on mobile
// //     function isMobile() {
// //         return window.innerWidth <= 860;
// //     }

// //     // Apply saved state on load (only for desktop)
// //     if (!isMobile()) {
// //         if (sidebarState === 'hidden') {
// //             sidebar?.classList.add('hidden');
// //             content?.classList.add('sidebar-hidden');
// //         } else {
// //             sidebar?.classList.remove('hidden');
// //             content?.classList.remove('sidebar-hidden');
// //         }
// //     }

// //     // Desktop hamburger/burger click: toggle sidebar persistence
// //     burger?.addEventListener('click', () => {
// //         if (isMobile()) {
// //             toggleSidebar();
// //         } else {
// //             // Desktop behavior - toggle visibility permanently
// //             sidebar?.classList.toggle('hidden');
// //             content?.classList.toggle('sidebar-hidden');

// //             // Save state for desktop
// //             if (sidebar?.classList.contains('hidden')) {
// //                 localStorage.setItem('sidebarState', 'hidden');
// //             } else {
// //                 localStorage.setItem('sidebarState', 'shown');
// //             }
// //         }
// //     });

// //     // Mobile menu button click: toggle sidebar temporarily
// //     mobileMenuBtn?.addEventListener('click', toggleSidebar);
// //     hamburger?.addEventListener('click', () => {
// //         if (isMobile()) {
// //             toggleSidebar();
// //         }
// //     });

// //     // Close sidebar when clicking overlay (mobile only)
// //     sidebarOverlay?.addEventListener('click', closeSidebar);

// //     // Handle window resize
// //     window.addEventListener('resize', () => {
// //         if (!isMobile()) {
// //             // Desktop mode - remove mobile classes and apply saved state
// //             closeSidebar();
// //             if (sidebarState === 'hidden') {
// //                 sidebar?.classList.add('hidden');
// //                 content?.classList.add('sidebar-hidden');
// //             } else {
// //                 sidebar?.classList.remove('hidden');
// //                 content?.classList.remove('sidebar-hidden');
// //             }
// //         } else {
// //             // Mobile mode - remove desktop classes
// //             sidebar?.classList.remove('hidden');
// //             content?.classList.remove('sidebar-hidden');
// //         }
// //     });

// //     // Sync sidebar across tabs (desktop only)
// //     window.addEventListener('storage', (event) => {
// //         if (event.key === 'sidebarState' && !isMobile()) {
// //             if (event.newValue === 'hidden') {
// //                 sidebar?.classList.add('hidden');
// //                 content?.classList.add('sidebar-hidden');
// //             } else {
// //                 sidebar?.classList.remove('hidden');
// //                 content?.classList.remove('sidebar-hidden');
// //             }
// //         }
// //     });

// //     // Close mobile sidebar when clicking navigation links
// //     document.querySelectorAll('.nav a').forEach(navLink => {
// //         navLink.addEventListener('click', () => {
// //             if (isMobile()) {
// //                 closeSidebar();
// //             }
// //         });
// //     });

// //     // Close mobile sidebar on escape key
// //     document.addEventListener('keydown', (e) => {
// //         if (e.key === 'Escape' && isMobile() && sidebar?.classList.contains('active')) {
// //             closeSidebar();
// //         }
// //     });

// //     // ===== Active nav link
// //     document.querySelectorAll('.nav a').forEach(a => {
// //         const href = a.getAttribute('href');
// //         if (href === path) a.classList.add('active');
// //     });

// //     // ===== Auth / Logout
// //     if (localStorage.getItem('token')) {
// //         if (authLink) authLink.style.display = 'none';
// //         if (logoutBtn) logoutBtn.style.display = 'flex';
// //     } else {
// //         if (authLink) authLink.style.display = 'flex';
// //         if (logoutBtn) logoutBtn.style.display = 'none';
// //     }

// //     logoutBtn?.addEventListener('click', (e) => {
// //         e.preventDefault();
// //         localStorage.removeItem('token');
// //         localStorage.removeItem('userId');
// //         localStorage.removeItem('isAdmin');
// //         location.href = 'auth.html';
// //     });
    
// //     // ===== Admin-only upload section
// //     const isAdmin = localStorage.getItem('isAdmin');
// //     if (uploadSection) {
// //         if (isAdmin === 'true') {
// //             uploadSection.style.display = 'block';
// //         } else {
// //             uploadSection.style.display = 'none';
// //         }
// //     }

// //     // ===== Prevent body scroll when mobile sidebar is open
// //     function updateBodyScroll() {
// //         if (isMobile() && sidebar?.classList.contains('active')) {
// //             document.body.style.overflow = 'hidden';
// //         } else {
// //             document.body.style.overflow = '';
// //         }
// //     }

// //     // Update body scroll on sidebar toggle
// //     const observer = new MutationObserver(() => {
// //         updateBodyScroll();
// //     });

// //     if (sidebar) {
// //         observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
// //     }
// // });

// // shared.js - Common functionality across all pages with fixed theme toggle

// document.addEventListener('DOMContentLoaded', () => {
//     const body = document.body;
//     const sidebar = document.querySelector('.sidebar');
//     const burger = document.getElementById('sidebar-toggle');
//     const uploadSection = document.getElementById('admin-upload');
//     const createMcqLink = document.getElementById('create-mcq-link');
//     const logoutBtn = document.getElementById('logout-btn');
//     const authLink = document.getElementById('auth-link');
//     const themeBtn = document.getElementById('theme-toggle-btn');
//     const content = document.querySelector('.content');
//     const path = location.pathname.split('/').pop() || 'index.html';

//     // ===== Dark mode initialization and toggle
//     function initializeTheme() {
//         const savedTheme = localStorage.getItem('theme');
//         const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
//         // Apply saved theme or system preference
//         if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
//             body.classList.add('dark-mode');
//             if (themeBtn) {
//                 const icon = themeBtn.querySelector('i');
//                 if (icon) {
//                     icon.className = 'fa-solid fa-sun';
//                 }
//             }
//         } else {
//             body.classList.remove('dark-mode');
//             if (themeBtn) {
//                 const icon = themeBtn.querySelector('i');
//                 if (icon) {
//                     icon.className = 'fa-solid fa-moon';
//                 }
//             }
//         }
//     }

//     function toggleTheme() {
//         const isDarkMode = body.classList.toggle('dark-mode');
//         localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        
//         // Update theme button icon
//         if (themeBtn) {
//             const icon = themeBtn.querySelector('i');
//             if (icon) {
//                 icon.className = isDarkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
//             }
//         }
        
//         // Trigger a custom event for other components that might need to know about theme changes
//         window.dispatchEvent(new CustomEvent('themeChanged', { 
//             detail: { isDarkMode } 
//         }));
//     }

//     // Initialize theme on page load
//     initializeTheme();
    
//     // Theme toggle event listener
//     themeBtn?.addEventListener('click', toggleTheme);

//     // Listen for system theme changes
//     window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
//         // Only auto-switch if no manual preference is saved
//         if (!localStorage.getItem('theme')) {
//             if (e.matches) {
//                 body.classList.add('dark-mode');
//             } else {
//                 body.classList.remove('dark-mode');
//             }
//         }
//     });

//     // ===== Sidebar toggle for mobile
//     function createSidebarOverlay() {
//         let overlay = document.querySelector('.sidebar-overlay');
//         if (!overlay) {
//             overlay = document.createElement('div');
//             overlay.className = 'sidebar-overlay';
//             overlay.addEventListener('click', closeSidebar);
//             document.body.appendChild(overlay);
//         }
//         overlay.classList.add('active');
//     }

//     function removeSidebarOverlay() {
//         const overlay = document.querySelector('.sidebar-overlay');
//         if (overlay) {
//             overlay.classList.remove('active');
//             setTimeout(() => overlay.remove(), 300); // Wait for animation
//         }
//     }

//     function openSidebar() {
//         sidebar?.classList.add('active');
//         createSidebarOverlay();
//         body.style.overflow = 'hidden'; // Prevent background scroll
//     }

//     function closeSidebar() {
//         sidebar?.classList.remove('active');
//         removeSidebarOverlay();
//         body.style.overflow = ''; // Restore scroll
//     }

//     // Mobile sidebar toggle
//     burger?.addEventListener('click', () => {
//         if (sidebar?.classList.contains('active')) {
//             closeSidebar();
//         } else {
//             openSidebar();
//         }
//     });

//     // Close sidebar on mobile when clicking navigation links
//     document.querySelectorAll('.nav a').forEach(navLink => {
//         navLink.addEventListener('click', () => {
//             if (window.innerWidth <= 860) {
//                 closeSidebar();
//             }
//         });
//     });

//     // Close sidebar on escape key
//     document.addEventListener('keydown', (e) => {
//         if (e.key === 'Escape' && window.innerWidth <= 860 && sidebar?.classList.contains('active')) {
//             closeSidebar();
//         }
//     });

//     // Handle window resize
//     function handleResize() {
//         if (window.innerWidth > 860) {
//             // Desktop mode - clean up mobile states
//             closeSidebar();
//         }
//     }

//     window.addEventListener('resize', handleResize);

//     // ===== Active nav link
//     document.querySelectorAll('.nav a').forEach(a => {
//         a.classList.remove('active'); // Remove existing active classes
//         const href = a.getAttribute('href');
//         if (href === path) {
//             a.classList.add('active');
//         }
//     });

//     // ===== Auth state management
//    function updateAuthState() {
//     const token = localStorage.getItem('token');
//     const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
//     // Get admin panel link (for landing page navigation)
//     const adminPanelLink = document.querySelector('a[href="admin-panel.html"]');
    
//     if (token) {
//         // User is logged in
//         if (authLink) authLink.style.display = 'none';
//         if (logoutBtn) logoutBtn.style.display = 'flex';
        
//         // Show admin features if user is admin
//         if (isAdmin) {
//             if (uploadSection) uploadSection.style.display = 'block';
//             if (createMcqLink) createMcqLink.style.display = 'flex';
//             // Show Admin Panel link in navigation
//             if (adminPanelLink) adminPanelLink.style.display = 'inline-block';
//         } else {
//             if (uploadSection) uploadSection.style.display = 'none';
//             if (createMcqLink) createMcqLink.style.display = 'none';
//             // Hide Admin Panel link for non-admin users
//             if (adminPanelLink) adminPanelLink.style.display = 'none';
//         }
//     } else {
//         // User is not logged in
//         if (authLink) authLink.style.display = 'flex';
//         if (logoutBtn) logoutBtn.style.display = 'none';
//         if (uploadSection) uploadSection.style.display = 'none';
//         if (createMcqLink) createMcqLink.style.display = 'none';
//         // Hide Admin Panel link for logged out users
//         if (adminPanelLink) adminPanelLink.style.display = 'none';
//     }
// }

//     // Initialize auth state
//     updateAuthState();

//     // Listen for auth state changes across tabs
//     window.addEventListener('storage', (e) => {
//         if (['token', 'isAdmin'].includes(e.key)) {
//             updateAuthState();
//         }
//         if (e.key === 'theme') {
//             initializeTheme();
//         }
//     });

//     // ===== Logout functionality
//     logoutBtn?.addEventListener('click', (e) => {
//         e.preventDefault();
        
//         // Confirm logout
//         if (confirm('Are you sure you want to logout?')) {
//             // Clear all auth data
//             localStorage.removeItem('token');
//             localStorage.removeItem('userId');
//             localStorage.removeItem('isAdmin');
            
//             // Redirect to auth page
//             window.location.href = 'auth.html';
//         }
//     });

//     // ===== Utility functions for other scripts
//     window.MCQHub = window.MCQHub || {};
//     window.MCQHub.theme = {
//         toggle: toggleTheme,
//         isDark: () => body.classList.contains('dark-mode'),
//         setTheme: (theme) => {
//             if (theme === 'dark') {
//                 body.classList.add('dark-mode');
//             } else {
//                 body.classList.remove('dark-mode');
//             }
//             localStorage.setItem('theme', theme);
//             initializeTheme();
//         }
//     };
    
//     window.MCQHub.sidebar = {
//         open: openSidebar,
//         close: closeSidebar,
//         toggle: () => {
//             if (sidebar?.classList.contains('active')) {
//                 closeSidebar();
//             } else {
//                 openSidebar();
//             }
//         }
//     };
// });

// shared.js - Common functionality across all pages with fixed sidebar toggle

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    const burger = document.getElementById('sidebar-toggle') || 
                  document.querySelector('.hamburger') || 
                  document.querySelector('.mobile-menu-btn') ||
                  document.querySelector('[data-toggle="sidebar"]');
    const content = document.querySelector('.content');
    const themeBtn = document.getElementById('theme-toggle-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const authLink = document.getElementById('auth-link');
    const uploadSection = document.getElementById('admin-upload');
    const createMcqLink = document.getElementById('create-mcq-link');
    const path = location.pathname.split('/').pop() || 'index.html';

    // ===== Dark mode setup
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
        body.classList.toggle('dark-mode', isDark);
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            if (icon) icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    }
    function toggleTheme() {
        const isDark = body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            if (icon) icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    }
    initializeTheme();
    themeBtn?.addEventListener('click', toggleTheme);

    // ===== Sidebar expand/collapse
    function toggleSidebar() {
        if (!sidebar || !content) return;
        sidebar.classList.toggle('collapsed');
        content.classList.toggle('expanded');

        // Change icon if inside toggle button
        const icon = burger?.querySelector('i');
        if (icon) {
            if (sidebar.classList.contains('collapsed')) {
                icon.classList.replace('fa-bars', 'fa-chevron-right');
            } else {
                icon.classList.replace('fa-chevron-right', 'fa-bars');
            }
        }
    }
    burger?.addEventListener('click', (e) => {
        e.preventDefault();
        toggleSidebar();
    });

    // ===== Active nav link
    document.querySelectorAll('.nav a').forEach(a => {
        a.classList.remove('active');
        const href = a.getAttribute('href');
        if (href === path) a.classList.add('active');
    });

    // ===== Auth state management
    function updateAuthState() {
        const token = localStorage.getItem('token');
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        const adminPanelLink = document.querySelector('a[href="admin-panel.html"]');

        if (token) {
            authLink && (authLink.style.display = 'none');
            logoutBtn && (logoutBtn.style.display = 'flex');
            if (isAdmin) {
                uploadSection && (uploadSection.style.display = 'block');
                createMcqLink && (createMcqLink.style.display = 'flex');
                adminPanelLink && (adminPanelLink.style.display = 'inline-block');
            } else {
                uploadSection && (uploadSection.style.display = 'none');
                createMcqLink && (createMcqLink.style.display = 'none');
                adminPanelLink && (adminPanelLink.style.display = 'none');
            }
        } else {
            authLink && (authLink.style.display = 'flex');
            logoutBtn && (logoutBtn.style.display = 'none');
            uploadSection && (uploadSection.style.display = 'none');
            createMcqLink && (createMcqLink.style.display = 'none');
            adminPanelLink && (adminPanelLink.style.display = 'none');
        }
    }
    updateAuthState();
    window.addEventListener('storage', (e) => {
        if (['token', 'isAdmin'].includes(e.key)) updateAuthState();
        if (e.key === 'theme') initializeTheme();
    });

    // ===== Logout
    logoutBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('isAdmin');
            window.location.href = 'auth.html';
        }
    });

    // ===== Expose utilities
    window.MCQHub = window.MCQHub || {};
    window.MCQHub.theme = { toggle: toggleTheme, isDark: () => body.classList.contains('dark-mode') };
    window.MCQHub.sidebar = { toggle: toggleSidebar };
});

function updateUserDisplay() {
    const fullName = localStorage.getItem('fullName');
    const userDisplayElements = document.querySelectorAll('.user-name');
    
    userDisplayElements.forEach(element => {
        element.textContent = fullName || 'User';
    });
}