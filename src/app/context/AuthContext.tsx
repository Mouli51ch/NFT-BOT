'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { OKXUniversalConnectUI, THEME } from '@okxconnect/ui';

interface AuthContextType {
  connected: boolean;
  walletAddress: string | null;
  chainId: string | null;
  isTelegramValid: boolean;
  isRunningInTelegram: boolean; // Add this line
  error: string | null;
  logIn: () => Promise<void>;
  logOut: () => Promise<void>;
  validateTelegram: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<OKXUniversalConnectUI | null>(null);
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isTelegramValid, setIsTelegramValid] = useState(false);
  const [isRunningInTelegram, setIsRunningInTelegram] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initClient = useCallback(async () => {
    try {
      const uiClient = await OKXUniversalConnectUI.init({
        dappMetaData: {
          name: 'NFT Access Portal',
          icon: 'https://example.com/icon.png',
        },
        actionsConfiguration: {
          returnStrategy: 'none',
          modals: 'all',
        },
        uiPreferences: {
          theme: THEME.LIGHT,
        },
      });
      setClient(uiClient);
    } catch (error) {
      setError('Failed to initialize OKX UI');
      console.error('Failed to initialize OKX UI:', error);
    }
  }, []);

  useEffect(() => {
    initClient();
    checkTelegramEnvironment();
  }, [initClient]);

  const checkTelegramEnvironment = () => {
    const isTelegram = !!window.Telegram?.WebApp;
    setIsRunningInTelegram(isTelegram);
  };

  const logIn = async () => {
    if (!client) {
      setError('OKX UI client is not initialized');
      return;
    }
    try {
      const session = await client.openModal({
        namespaces: {
          eip155: {
            chains: ['eip155:747'],
            defaultChain: '747',
          },
        },
      });

      if (!session || !session.namespaces.eip155) {
        setError('Failed to establish a valid session');
        return;
      }

      const address = session.namespaces.eip155.accounts[0]?.split(':')[2];
      const rawChainId = session.namespaces.eip155.chains[0];
      const chain = rawChainId?.split(':')[1] || null;

      setWalletAddress(address);
      setChainId(chain);
      setConnected(true);
      setError(null);
    } catch (error) {
      setError('Failed to connect wallet');
      console.error('Failed to connect wallet:', error);
    }
  };

  const logOut = async () => {
    if (!client) {
      setError('OKX UI client is not initialized');
      return;
    }
    try {
      await client.disconnect();
      setWalletAddress(null);
      setChainId(null);
      setConnected(false);
      setError(null);
    } catch (error) {
      setError('Failed to disconnect wallet');
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const validateTelegram = async () => {
    if (!isRunningInTelegram) {
      console.log('Not running inside Telegram WebApp, skipping validation');
      return;
    }

    try {
      const webAppData = window.Telegram?.WebApp?.initDataUnsafe;
      
      if (!webAppData) {
        throw new Error('Telegram WebApp data is not available');
      }

      // Here you would typically send this data to your backend for validation
      // For this example, we'll just set it as valid
      setIsTelegramValid(true);
    } catch (error) {
      setError('Failed to validate Telegram session');
      console.error('Error validating Telegram:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        connected,
        walletAddress,
        chainId,
        isTelegramValid,
        isRunningInTelegram,
        error,
        logIn,
        logOut,
        validateTelegram,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

