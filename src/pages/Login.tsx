import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '../utils/firebase';
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginProps {
    onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            onLoginSuccess();
        } catch (err: any) {
            let errorMessage = 'An error occurred. Please try again.';
            switch (err.code) {
                case 'auth/invalid-email': errorMessage = 'Invalid email address.'; break;
                case 'auth/user-disabled': errorMessage = 'This account has been disabled.'; break;
                case 'auth/user-not-found': errorMessage = 'No account found with this email.'; break;
                case 'auth/wrong-password': errorMessage = 'Invalid email or password.'; break;
                case 'auth/invalid-credential': errorMessage = 'Invalid email or password.'; break;
                case 'auth/email-already-in-use': errorMessage = 'An account with this email already exists.'; break;
                case 'auth/weak-password': errorMessage = 'Password should be at least 6 characters.'; break;
                case 'auth/network-request-failed': errorMessage = 'Network error. Please check your connection.'; break;
                case 'auth/too-many-requests': errorMessage = 'Too many attempts. Please try again later.'; break;
                default: errorMessage = err.message || 'Authentication failed.';
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        try {
            if (Capacitor.isNativePlatform()) {
                const result = await FirebaseAuthentication.signInWithGoogle();
                if (result.credential?.idToken) {
                    const credential = GoogleAuthProvider.credential(result.credential.idToken);
                    await signInWithCredential(auth, credential);
                }
                onLoginSuccess();
            } else {
                await signInWithPopup(auth, googleProvider);
                onLoginSuccess();
            }
        } catch (err: any) {
            console.error("Google sign-in error:", err);
            let errorMessage = `Google sign-in failed: ${err.code} - ${err.message}`;
            if (err.code === 'auth/account-exists-with-different-credential') {
                errorMessage = 'An account with this email already exists with a different login method. Please sign in with email/password.';
            } else if (err.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Sign-in popup was closed before completion.';
            } else if (err.code === 'auth/cancelled-popup-request') {
                return;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-4 py-8 sm:py-12 overflow-hidden relative selection:bg-brand-accent-soft"
            style={{
                paddingTop: 'calc(1rem + env(safe-area-inset-top))',
                paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))'
            }}
        >
            {/* Premium Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="hidden md:block absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-accent/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="hidden md:block absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-text-secondary/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-brand-surface p-1 mb-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-brand-accent/5" />
                        <img src="/favicon.png" alt="Smart Share Logo" className="w-full h-full object-contain rounded-2xl relative z-10" />
                    </motion.div>
                    <h1 className="text-3xl sm:text-4xl font-black text-brand-text-primary mb-2 tracking-tight">Smart Share</h1>
                    <p className="text-brand-text-secondary font-medium tracking-wide">Digital Identity Platform</p>
                </div>

                {/* Login Form Container */}
                <motion.div
                    layout
                    className="bg-brand-surface/70 border border-brand-border rounded-[24px] p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isSignUp ? 'signup' : 'login'}
                            initial={{ opacity: 0, x: isSignUp ? 30 : -30, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, x: isSignUp ? -30 : 30, filter: 'blur(4px)' }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-brand-text-primary mb-1">
                                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                                </h2>
                                <p className="text-sm text-brand-text-muted">
                                    {isSignUp ? 'Join thousands of professionals sharing smart' : 'Please enter your credentials to continue'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    autoComplete="email"
                                />
                                <Input
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    autoComplete={isSignUp ? "new-password" : "current-password"}
                                />

                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="bg-brand-status-danger/10 border border-brand-status-danger/20 rounded-xl p-4 text-brand-status-danger text-sm flex items-start gap-3"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-status-danger mt-1.5 shrink-0" />
                                            <span>{error}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full flex items-center justify-center gap-2 py-3.5 shadow-lg shadow-brand-accent/20"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-brand-text-primary/30 border-t-brand-text-primary rounded-full animate-spin" />
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        <>
                                            {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                                            <span>{isSignUp ? 'Create My Account' : 'Sign In to Dashboard'}</span>
                                        </>
                                    )}
                                </Button>
                            </form>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-brand-border"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-4 bg-brand-surface text-brand-text-muted font-bold uppercase tracking-widest rounded-full border border-brand-border py-1">
                                        OR CONTINUE WITH
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="secondary"
                                onClick={handleGoogleSignIn}
                                className="w-full flex items-center justify-center gap-3 py-4 shadow-xl"
                                disabled={loading}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                                </svg>
                                <span className="font-bold">Sign in with Google</span>
                            </Button>

                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => {
                                        setIsSignUp(!isSignUp);
                                        setError('');
                                    }}
                                    className="group text-sm font-medium text-brand-text-secondary hover:text-brand-text-primary transition-all flex items-center justify-center gap-2 mx-auto"
                                >
                                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one for free"}
                                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                        →
                                    </motion.span>
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Security Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center justify-center gap-2 mt-10 text-brand-text-muted"
                >
                    <ShieldCheck size={16} className="text-brand-status-success/50" />
                    <span className="text-xs font-semibold uppercase tracking-widest">End-to-End Secure</span>
                </motion.div>
            </motion.div>
        </div>
    );
}
