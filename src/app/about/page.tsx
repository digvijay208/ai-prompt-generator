import { ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-6 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_30px_rgba(0,210,255,0.4)] mb-6">
            <ShieldCheck size={32} className="text-black" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
            About Us
          </h1>
          <p className="text-sm md:text-base text-text-secondary max-w-2xl mx-auto">
            Welcome to AI Prompt Generator. Our mission is to empower creators and developers with hyper-premium, cinematic-quality AI prompts.
          </p>
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-[32px] space-y-8 animate-entrance">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Our Mission</h2>
            <p className="text-text-secondary leading-relaxed">
              We believe that crafting the perfect AI prompt is an art form. Our platform is designed to provide you with the tools and inspiration needed to generate stunning, precise, and high-quality outputs across various AI models.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Security & Trust</h2>
            <p className="text-text-secondary leading-relaxed">
              We take your privacy and security seriously. As a modern web application, we utilize industry-standard practices to ensure your data is protected. Our platform is built on reputable hosting services with HTTPS encryption enabled by default.
            </p>
          </section>
        </div>
      </div>
      
      {/* Background Decorative Blur */}
      <div className="fixed inset-0 bg-midnight-flow -z-10" />
    </main>
  );
}
