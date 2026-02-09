import { Menu } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import './HeaderControls.css';

export default function HeaderControls() {
    const { isSidebarOpen, toggleSidebar } = useApp();

    return (
        <div className={`header-controls-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
            <button
                className="control-btn sidebar-toggle"
                onClick={toggleSidebar}
                aria-label="Toggle Navigation"
            >
                <Menu size={20} />
            </button>
        </div>
    );
}
