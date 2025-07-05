const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/lovable-uploads/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50 z-10"></div>
      
      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge with text pulse animation */}
          <div className="inline-block bg-black/60 text-white px-6 py-2.5 rounded-full text-sm font-black border border-white/20 cursor-default">
            <span className="animate-pulse-text">
              🔥 ARROGANT LIFTER COLLECTION - FIRST DROP LIVE
            </span>
          </div>
          
          {/* Main heading */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight">
                ANCHOR FIT
              </span>
            </h1>
            
            {/* Tagline */}
            <div className="text-2xl md:text-3xl text-white font-bold">
              BE ARROGANT. BE SUPERIOR. <span className="ml-1">💪</span>
            </div>
          </div>
          
          {/* Description text */}
          <div className="space-y-6 max-w-3xl mx-auto">
            <p className="text-xl text-white font-medium leading-relaxed">
              First Drop is now live. Grab your oversize pump covers from our{" "}
              <span className="font-bold text-white">
                Arrogant Lifter Collection!
              </span>
            </p>
            
            <p className="text-lg text-gray-300 font-medium italic">
              For Gymrats who know they're better than everyone else
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <a 
              href="#products" 
              className="group relative bg-black/80 hover:bg-black text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 min-w-[200px]"
            >
              VIEW TEES
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </a>
            
            <a 
              href="#newly-released" 
              className="group relative bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 border border-white/30 hover:border-white/50 min-w-[200px]"
            >
              <span>⚡</span>
              NEW DROPS
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Custom animation for text pulsing */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse-text {
            0%, 100% { color: #ffffff; }
            50% { color: #d1d5db; }
          }
          .animate-pulse-text {
            animation: pulse-text 2s infinite;
          }
        `
      }} />
    </section>
  );
};

export default Hero;
