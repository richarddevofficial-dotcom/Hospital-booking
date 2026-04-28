export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">CarePlus</h3>
            <p className="text-gray-400">
              Providing quality healthcare services with compassion and
              excellence since 2000.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="hover:text-white transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#doctors"
                  className="hover:text-white transition-colors"
                >
                  Doctors
                </a>
              </li>
              <li>
                <a
                  href="#appointment"
                  className="hover:text-white transition-colors"
                >
                  Book Appointment
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-2">
              <li>📍 123 Medical Drive, Healthcare City</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>📧 info@careplusmedical.com</li>
              <li>🕒 Mon-Fri: 8:00 AM - 8:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} CarePlus Medical Center. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
