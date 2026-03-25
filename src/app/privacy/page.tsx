import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-6 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_30px_rgba(0,210,255,0.4)] mb-6">
            <ShieldCheck size={32} className="text-black" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
            Privacy Policy
          </h1>
          <p className="text-sm md:text-base text-text-secondary max-w-2xl mx-auto">
            Last updated: March 2026
          </p>
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-[32px] space-y-8 animate-entrance prose prose-invert max-w-none">
          <p className="text-text-secondary">
            Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Information We Collect</h3>
          <p className="text-text-secondary">
            When you register for an account, we may collect your email address, name, and password. We do not collect unnecessary personal data.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">2. How We Use Your Information</h3>
          <p className="text-text-secondary">
            We use your information exclusively to provide and maintain our services, manage your account, and improve user experience. We do not sell your personal data to third parties.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">3. Data Security</h3>
          <p className="text-text-secondary">
            We implement standard security measures to protect your personal information. Your passwords are encrypted, and all communication with our servers occurs over secure HTTPS connections.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">4. Cookies and Tracking</h3>
          <p className="text-text-secondary">
            We may use local storage and cookies to maintain your session and preferences. By using our site, you consent to this standard web functionality.
          </p>
          
          <h3 className="text-xl font-bold text-white mt-8 mb-4">5. Contact Us</h3>
          <p className="text-text-secondary">
            If you have questions about this Privacy Policy, please contact us through our Contact page.
          </p>
        </div>
      </div>
      
      {/* Background Decorative Blur */}
      <div className="fixed inset-0 bg-midnight-flow -z-10" />
    </main>
  );
}
