
const Footer = () => {
  return (
    <footer id="contact" className="bg-slate-950 border-t-4 border-slate-700 text-gray-100 py-12" style={{
      backgroundImage: `url('/lovable-uploads/f9412b09-9c9f-4feb-8023-f7ca22cdc58c.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="absolute inset-0 bg-slate-950/90"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-black bg-gradient-to-r from-slate-300 via-gray-100 to-slate-400 bg-clip-text text-transparent mb-4">
              🏆 ANCHOR FIT
            </h3>
            <p className="text-slate-300 mb-4 font-bold text-lg">
              ARROGANT LIFTER COLLECTION - Too elite for ordinary gymwear. 
              Built for champions who know they're superior.
            </p>
            <p className="text-slate-400 text-sm font-black">
              Based in Nigeria 🇳🇬 | Delivering Excellence Nationwide
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-black mb-4 text-slate-300">QUICK ACCESS</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-slate-400 hover:text-slate-200 transition-colors font-bold">Home</a></li>
              <li><a href="#products" className="text-slate-400 hover:text-slate-200 transition-colors font-bold">Products</a></li>
              <li><a href="#newly-released" className="text-slate-400 hover:text-slate-200 transition-colors font-bold">New Drops</a></li>
              <li><a href="#contact" className="text-slate-400 hover:text-slate-200 transition-colors font-bold">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-black mb-4 text-slate-300">REACH THE ELITE</h4>
            <div className="space-y-2 text-slate-400 font-bold">
              <p>📧 aftee.ng@gmail.com</p>
              <p>📱 +234 7062505070</p>
              <p>📍 Abuja, Nigeria</p>
              <div className="flex space-x-4 mt-4">
                <a 
                  href="https://www.instagram.com/anchorfittees.ng?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-200 transition-colors font-black"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-300 font-black text-lg">
            © 2024 Anchor Fit - Made with 💪 and ARROGANCE in Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
