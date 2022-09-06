import { useEffect } from 'react';
import { ConnectButton } from '@web3uikit/web3';

export default function ConnectButtonNav() {


    useEffect(() => {
        const buttonDivs = document.querySelectorAll('[data-testid="test-connect-button-wrap"]');
        buttonDivs.forEach(btnDiv => {
            const button = btnDiv.firstChild;
            const span = button.firstChild;
            button.style.background = '#CDECFF';
            span.style.color = '#202020';

            if (btnDiv.parentElement.id === 'navConnectWallet') {
                span.style.fontSize = '0.875rem';
            } else if (btnDiv.parentElement.id === 'collectionConnectWallet') {
                btnDiv.style.display = 'flex';
                btnDiv.style.justifyContent = 'center';
                button.style.border = '1px solid #202020';
                button.style.padding = 'max(calc(0.8vh + 0.8vw),1rem)';
                button.style.height = 'auto';
                span.style.fontSize = 'max(calc(0.8vh + 0.8vw),0.8rem)';
            }
        });
    }, []);

    return (
        <ConnectButton moralisAuth={false} />
    );
};
