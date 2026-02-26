import React from 'react';
import { useApp } from '../../contexts/AppContext';
import Sidebar from './Sidebar';
import HeaderControls from './HeaderControls';
import ThemeToggle from '../Controls/ThemeToggle';
import './Layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
    const { isSidebarOpen, currentOffice } = useApp();

    const titles: Record<string, string> = {
        morning: 'Morning Prayer',
        midday: 'Midday Prayer',
        evening: 'Evening Prayer',
        compline: 'Compline',
        lectionary: 'Lectionary'
    };

    const isMounted = React.useRef(false);

    React.useEffect(() => {
        document.title = titles[currentOffice] || 'DearlyBeloved';

        // Skip scroll on initial mount (allow browser restoration)
        // Only scroll when office changes interactions
        if (isMounted.current) {
            window.scrollTo(0, 0);
        } else {
            isMounted.current = true;
        }
    }, [currentOffice]);

    return (
        <>
            <Sidebar />
            <HeaderControls />
            <ThemeToggle />

            <div className={`layout-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="app-container">
                    <header>
                        <h1>DearlyBeloved</h1>
                        <p className="subtitle">The Daily Office</p>
                        <h2 className="office-title-display">{titles[currentOffice]}</h2>
                    </header>

                    <main>
                        {children}
                    </main>

                    <footer>
                        <p>
                            Based on 1662 BCP with 1549 Lectionary | App designed by{' '}
                            <a href="https://github.com/euxaristia" target="_blank" rel="noopener noreferrer">@euxaristia</a>
                            <br />
                            Made in 🇨🇦 with ❤️ for 🇬🇧 🇺🇸 & 🌎
                        </p>
                    </footer>
                </div>
            </div>
        </>
    );
}
