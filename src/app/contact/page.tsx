import { Mail, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-6 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_30px_rgba(0,210,255,0.4)] mb-6">
            <Mail size={32} className="text-black" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
            Contact Us
          </h1>
          <p className="text-sm md:text-base text-text-secondary max-w-2xl mx-auto">
            Have questions or need support? We're here to help. Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 animate-entrance">
          <div className="glass-panel p-8 rounded-[32px] space-y-8">
            <h2 className="text-2xl font-bold text-white">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-glass-border flex items-center justify-center text-primary">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Email Support</p>
                  <p className="text-white font-medium">support@aipromptgenerator.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-glass-border flex items-center justify-center text-primary">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Office</p>
                  <p className="text-white font-medium">Global / Remote</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[32px]">
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Your Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-glass-border rounded-xl py-3 px-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-white placeholder-text-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full bg-white/5 border border-glass-border rounded-xl py-3 px-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-white placeholder-text-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  rows={4}
                  placeholder="How can we help you?"
                  className="w-full bg-white/5 border border-glass-border rounded-xl py-3 px-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-white placeholder-text-secondary/50 resize-none"
                />
              </div>
              <button 
                type="button"
                className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-black font-black rounded-xl shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
              >
                Send Message
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Background Decorative Blur */}
      <div className="fixed inset-0 bg-midnight-flow -z-10" />
    </main>
  );
}
