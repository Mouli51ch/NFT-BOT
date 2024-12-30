'use client';

import { useAuth } from '@/app/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DisplayUser() {
  const { 
    connected,
    walletAddress,
    chainId,
    isTelegramValid,
    isRunningInTelegram,
    error,
    logIn,
    logOut,
    validateTelegram
  } = useAuth();

  if (!isRunningInTelegram) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-gray-800">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-500 mb-2">
              Invalid Access
            </h2>
            <p className="text-gray-400">
              Please open this app through Telegram
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isTelegramValid) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-gray-800">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-500 mb-2">
              Validation Failed
            </h2>
            <p className="text-gray-400">
              Please validate your Telegram session
            </p>
            <Button 
              onClick={validateTelegram}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Validate Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-gray-800">
        <CardContent className="p-6 text-center space-y-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Welcome to NFT Access Portal
          </h1>
          
          {error && (
            <div className="text-red-500 mb-4">
              Error: {error}
            </div>
          )}

          <div className="space-y-2 text-gray-400">
            <p>Chain ID: {chainId || 'Not Connected'}</p>
            <p>Wallet Status: {connected ? 'Connected' : 'Not Connected'}</p>
            {connected && walletAddress && (
              <p>Wallet Address: {walletAddress}</p>
            )}
          </div>
          
          <div className="pt-4">
            {!connected ? (
              <Button 
                onClick={logIn}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Connect OKX Wallet
              </Button>
            ) : (
              <Button 
                onClick={logOut}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Disconnect Wallet
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}