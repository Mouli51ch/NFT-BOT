'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Wallet, Key, Shield, ChevronRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '../app/context/AuthContext';
import { toast } from 'react-hot-toast';
import DisplayUser from './ui/DisplayUser';
import Link from 'next/link';
import NFTMinter from './NFTMinter';

const Web3Auth = () => {
  const { isRunningInTelegram, isTelegramValid, connected, walletAddress, chainId, logIn, logOut, validateTelegram, error } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isRunningInTelegram) {
      validateTelegram();
    }
  }, [isRunningInTelegram, validateTelegram]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await logIn();
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Failed to connect:', error);
      toast.error('Failed to connect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await logOut();
      toast.success('Wallet disconnected successfully!');
    } catch (error) {
      console.error('Failed to disconnect:', error);
      toast.error('Failed to disconnect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (isRunningInTelegram && !isTelegramValid) {
      return (
        <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-gray-800">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-xl font-bold text-yellow-500 mb-2">Authentication Failed</h2>
            <p className="text-gray-400">Unable to validate Telegram session. Please try again later.</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-gray-800">
        <CardContent className="p-6">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                NFT Access Portal
              </h2>
              <p className="text-gray-400 text-sm">
                Connect your OKX wallet & verify NFT ownership
              </p>
              {isRunningInTelegram && (
                <p className="text-green-400 text-sm flex items-center justify-center">
                  <Shield className="mr-2 h-4 w-4" />
                  Telegram session validated
                </p>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={connected ? 'connected' : 'disconnected'}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {!connected ? (
                  <div className="space-y-4">
                    <Button
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                      onClick={handleConnect}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Wallet className="mr-2 h-4 w-4" />
                      )}
                      Connect OKX Wallet
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <p className="text-purple-400 text-sm flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        Wallet Connected: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                      </p>
                      {chainId && (
                        <p className="text-purple-400 text-sm mt-2 flex items-center">
                          <ChevronRight className="mr-2 h-4 w-4" />
                          Chain ID: {chainId}
                        </p>
                      )}
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                      onClick={handleDisconnect}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Key className="mr-2 h-4 w-4" />
                      )}
                      Disconnect Wallet
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <NFTMinter />
            <DisplayUser />
            <Link href="/user-profile" className="w-full">
              <Button
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all duration-300 mt-4"
              >
                View User Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
      <div className="fixed inset-0 opacity-50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {renderContent()}
    </div>
  );
};

export default Web3Auth;

