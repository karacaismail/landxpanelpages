import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUi } from '@/store/ui';
import { useAuth } from '@/store/auth';

export function GlobalShortcuts() {
  const ui = useUi();
  const auth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    let gPressed = false;
    let gTimer: ReturnType<typeof setTimeout> | null = null;

    function clearG() { gPressed = false; if (gTimer) clearTimeout(gTimer); }

    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement;
      const inField = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || (t as HTMLElement).isContentEditable);

      // Cmd/Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        ui.togglePalette();
        return;
      }
      // Cmd/Ctrl+B
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        ui.toggleSidebar();
        return;
      }
      // Cmd/Ctrl+J
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        if (auth.role !== 'guest') ui.toggleAssistant();
        return;
      }
      // Esc
      if (e.key === 'Escape') {
        if (ui.paletteOpen) ui.setPalette(false);
        else if (ui.assistantOpen) ui.setAssistant(false);
        else if (ui.notifOpen) ui.setNotif(false);
        else if (ui.mobileNavOpen) ui.setMobileNav(false);
        return;
      }
      if (inField) return;

      // "/" search focus → open palette
      if (e.key === '/') { e.preventDefault(); ui.setPalette(true); return; }

      // "?" help
      if (e.key === '?') { e.preventDefault(); navigate('/help'); return; }

      // "g <key>" combo
      if (e.key === 'g' && !gPressed) {
        gPressed = true;
        gTimer = setTimeout(clearG, 1200);
        return;
      }
      if (gPressed) {
        const k = e.key.toLowerCase();
        if (k === 'd') navigate('/listings');
        else if (k === 'h') navigate('/');
        else if (k === 'm' && auth.role !== 'guest') navigate('/account/messages');
        else if (k === 'f' && auth.role !== 'guest') navigate('/account/favorites');
        else if (k === 's' && auth.role === 'admin') navigate('/admin/settings');
        else if (k === 'a' && auth.role === 'admin') navigate('/admin/approvals');
        else if (k === 'u' && auth.role === 'admin') navigate('/admin/users');
        else if (k === 'r' && auth.role === 'admin') navigate('/admin/rules');
        else if (k === 'i' && (auth.role === 'seller' || auth.role === 'admin')) navigate('/seller/listings');
        else if (k === 'n' && auth.role !== 'guest') navigate('/notifications');
        clearG();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ui, auth, navigate]);
  return null;
}
