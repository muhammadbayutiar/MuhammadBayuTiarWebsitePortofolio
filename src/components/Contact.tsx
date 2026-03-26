'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion, useMotionValue } from 'framer-motion';
import { Mail, Github, Linkedin } from 'lucide-react';
import { useMobileDetect } from '@/hooks/useMobileDetect';

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMobileDetect();
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Mobile-optimized parallax - use static MotionValue on mobile
  const yRaw = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const staticY = useMotionValue(0);
  const activeY = isMobile ? staticY : yRaw;

  const smoothY = useSpring(activeY, { 
    stiffness: prefersReducedMotion ? 400 : (isMobile ? 500 : 300),
    damping: prefersReducedMotion ? 60 : (isMobile ? 70 : 30),
    mass: 0.1
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    honeypot: '', // Hidden field for bot detection
  });

  // Error states
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Ripple effect handler (desktop only)
  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) return;
    
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
  };

  // Validate individual fields
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) {
          return 'Name is required';
        }
        if (value.trim().length < 2) {
          return 'Name must be at least 2 characters';
        }
        return '';
        
      case 'email':
        if (!value.trim()) {
          return 'Email is required';
        }
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Invalid email format';
        }
        // Check for common disposable domains
        const disposableDomains = [
          'mailinator.com', 'tempmail.com', 'guerrillamail.com',
          '10minutemail.com', 'throwaway.email', 'temp-mail.org'
        ];
        const domain = value.split('@')[1]?.toLowerCase();
        if (disposableDomains.includes(domain)) {
          return 'Disposable email addresses are not allowed';
        }
        return '';
        
      case 'message':
        if (!value.trim()) {
          return 'Message is required';
        }
        if (value.trim().length < 10) {
          return 'Message must be at least 10 characters';
        }
        return '';
        
      default:
        return '';
    }
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      message: validateField('message', formData.message),
    };
    
    setErrors(newErrors);
    
    // Return true if no errors
    return !Object.values(newErrors).some(error => error !== '');
  };

  // Form input handler with real-time validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear submit status when user edits
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' });
    }
  };

  // Blur handler for field-level validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Clear previous status
    setSubmitStatus({ type: null, message: '' });
    
    // Validate form
    if (!validateForm()) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fix the errors before submitting'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          honeypot: formData.honeypot,
        }),
      });

      let data: { success?: boolean; error?: string } | null = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.ok && data?.success) {
        // Success
        setSubmitStatus({
          type: 'success',
          message: 'Message sent successfully! I\'ll get back to you soon.'
        });
        
        // Clear form
        setFormData({ name: '', email: '', message: '', honeypot: '' });
        setErrors({ name: '', email: '', message: '' });
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus({ type: null, message: '' });
        }, 5000);
        
      } else {
        // API returned error
        setSubmitStatus({
          type: 'error',
          message: data?.error || 'Failed to send message. Please try again.'
        });
      }
      
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Error message component
  const ErrorMessage = ({ id, message }: { id: string; message: string }) => {
    if (!message) return null;
    
    return (
      <motion.p
        id={id}
        role="alert"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="text-red-400 text-xs mt-1 flex items-center gap-1"
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {message}
      </motion.p>
    );
  };

  // Toast notification for submit status
  const Toast = () => {
    if (!submitStatus.type) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`fixed top-6 right-6 z-50 max-w-md p-4 rounded-xl shadow-2xl backdrop-blur-lg border ${
          submitStatus.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}
      >
        <div className="flex items-start gap-3">
          {submitStatus.type === 'success' ? (
            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          <div className="flex-1">
            <p className="font-semibold text-sm">
              {submitStatus.type === 'success' ? 'Success!' : 'Error'}
            </p>
            <p className="text-sm mt-1 opacity-90">{submitStatus.message}</p>
          </div>
          <button
            onClick={() => setSubmitStatus({ type: null, message: '' })}
            className="text-current opacity-60 hover:opacity-100 transition-opacity"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* Toast Notification */}
      <Toast />
      
      <div className="w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
      <section 
        ref={sectionRef} 
        id="contact" 
        className="min-h-screen md:h-screen flex items-center justify-center py-12 md:py-0"
        style={{
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        <motion.div 
          style={isMobile ? {} : { y: smoothY }} 
          className="max-w-6xl mx-auto px-6 w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* Left Column - Contact Info */}
            <motion.div
              className="space-y-4 max-w-md"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.h2
                className="text-2xl font-black mb-2 bg-linear-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                Let&apos;s Work Together
              </motion.h2>
              <motion.p
                className="text-base text-slate-400 leading-relaxed mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                Open for opportunities in AI, Computer Vision, and Full Stack Development.
              </motion.p>
              <div className="space-y-3">
                <motion.a 
                  href="mailto:muhammadbayutiar@gmail.com" 
                  className="flex items-center gap-4 p-4 border border-white/6 rounded-xl hover:border-cyan-500/30 transition-all duration-300 group relative"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={isMobile ? {} : { 
                    scale: 1.02, 
                    y: -4,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl shadow-lg shadow-cyan-500/20" />
                  <div className="w-11 h-11 bg-linear-to-br from-cyan-500/20 to-cyan-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 shrink-0 transition-all duration-300 shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50">
                    <Mail className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                  </div>
                  <div className="relative z-10">
                    <p className="font-semibold text-white text-sm">Email</p>
                    <p className="text-slate-400 text-xs">muhammadbayutiar@gmail.com</p>
                  </div>
                </motion.a>
                <motion.a 
                  href="https://github.com/muhammadbayutiar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border border-white/6 rounded-xl hover:border-white/20 transition-all duration-300 group relative"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={isMobile ? {} : { 
                    scale: 1.02, 
                    y: -4,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl shadow-lg shadow-white/10" />
                  <div className="w-11 h-11 bg-linear-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 shrink-0 transition-all duration-300 shadow-lg shadow-white/20 group-hover:shadow-white/40">
                    <Github className="w-5 h-5 text-white transition-colors" />
                  </div>
                  <div className="relative z-10">
                    <p className="font-semibold text-white text-sm">GitHub</p>
                    <p className="text-slate-400 text-xs">muhammadbayutiar</p>
                  </div>
                </motion.a>
                <motion.a 
                  href="https://www.linkedin.com/in/muhammad-bayu-tiar-a7889027b" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border border-white/6 rounded-xl hover:border-blue-500/30 transition-all duration-300 group relative"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={isMobile ? {} : { 
                    scale: 1.02, 
                    y: -4,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl shadow-lg shadow-blue-500/20" />
                  <div className="w-11 h-11 bg-linear-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 shrink-0 transition-all duration-300 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50">
                    <Linkedin className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  </div>
                  <div className="relative z-10">
                    <p className="font-semibold text-white text-sm">LinkedIn</p>
                    <p className="text-slate-400 text-xs">muhammad-bayu-tiar</p>
                  </div>
                </motion.a>
              </div>
            </motion.div>

            {/* Right Column - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
              style={isMobile ? { transform: 'none' } : {}}
            >
              <div className="relative bg-white/6 backdrop-blur-md border border-white/8 rounded-2xl p-6">
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none" />
                <h3 className="text-xl font-black mb-4 text-white relative z-10">Send a Message</h3>
                <form className="space-y-3 relative z-10" onSubmit={handleSubmit}>
                  {/* Honeypot field - hidden from users, visible to bots */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={handleInputChange}
                    style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />
                  <div className="relative z-20">
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Your Name"
                      maxLength={100}
                      disabled={isSubmitting}
                      className={`w-full p-3 bg-transparent border rounded-xl text-white placeholder-slate-500 hover:border-white/20 focus:outline-none focus:ring-2 md:focus:scale-[1.01] transition-all duration-300 focus:placeholder-slate-600 focus:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-20 ${
                        errors.name 
                          ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-400/20 focus:shadow-red-500/10' 
                          : 'border-white/8 focus:border-cyan-500/50 focus:ring-cyan-400/20 focus:shadow-cyan-500/10'
                      }`}
                      style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    <ErrorMessage id="name-error" message={errors.name} />
                  </div>
                  <div className="relative z-20">
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="your@email.com"
                      maxLength={254}
                      disabled={isSubmitting}
                      className={`w-full p-3 bg-transparent border rounded-xl text-white placeholder-slate-500 hover:border-white/20 focus:outline-none focus:ring-2 md:focus:scale-[1.01] transition-all duration-300 focus:placeholder-slate-600 focus:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-20 ${
                        errors.email 
                          ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-400/20 focus:shadow-red-500/10' 
                          : 'border-white/8 focus:border-cyan-500/50 focus:ring-cyan-400/20 focus:shadow-cyan-500/10'
                      }`}
                      style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    <ErrorMessage id="email-error" message={errors.email} />
                  </div>
                  <div className="relative z-20">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      rows={4}
                      placeholder="Tell me about your project..."
                      maxLength={1000}
                      disabled={isSubmitting}
                      className={`w-full p-3 bg-transparent border rounded-xl text-white placeholder-slate-500 hover:border-white/20 focus:outline-none focus:ring-2 md:focus:scale-[1.01] transition-all duration-300 resize-none focus:placeholder-slate-600 focus:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-20 ${
                        errors.message 
                          ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-400/20 focus:shadow-red-500/10' 
                          : 'border-white/8 focus:border-cyan-500/50 focus:ring-cyan-400/20 focus:shadow-cyan-500/10'
                      }`}
                      style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "message-error" : undefined}
                    />
                    <ErrorMessage id="message-error" message={errors.message} />
                    {/* Character counter for message */}
                    <p className="text-xs text-slate-500 mt-1 text-right">
                      {formData.message.length} / 10 characters minimum
                    </p>
                  </div>
                  <motion.button 
                    type="submit"
                    onClick={handleRipple}
                    disabled={isSubmitting}
                    className={`w-full p-4 bg-linear-to-r from-cyan-500 to-emerald-500 text-white font-black rounded-xl text-base shadow-lg transition-all duration-300 overflow-hidden group relative z-20 ${
                      isSubmitting 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:from-cyan-400 hover:to-emerald-400 hover:shadow-cyan-500/50 hover:-translate-y-0.5'
                    }`}
                    whileHover={isMobile || isSubmitting ? {} : { scale: 1.02 }}
                    whileTap={isSubmitting ? {} : { scale: 0.98 }}
                    style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}
                  >
                    {/* Gradient shift on hover */}
                    <div className="absolute inset-0 bg-linear-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    {/* Loading spinner */}
                    {isSubmitting && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Ripple effects */}
                    {ripples.map((ripple) => (
                      <span
                        key={ripple.id}
                        className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
                        style={{
                          left: ripple.x,
                          top: ripple.y,
                          width: 0,
                          height: 0,
                          transform: 'translate(-50%, -50%)',
                        }}
                      />
                    ))}
                    
                    <span className={`relative z-10 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                      Send Message
                    </span>
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
