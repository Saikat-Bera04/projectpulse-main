import { Logo } from '@/components/icons';

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12 -mx-4 md:-mx-6 px-4 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Logo className="mb-4 h-8 w-auto text-white" />
            <p className="text-white/70 mb-4 max-w-md">
              Empowering students to collaborate, innovate, and succeed with
              AI-driven tools.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2 text-white/70">
              <li>
                <a
                  href="/team-match"
                  className="hover:text-white transition-colors"
                >
                  AI Teammate Matching
                </a>
              </li>
              <li>
                <a
                  href="/project/1"
                  className="hover:text-white transition-colors"
                >
                  Project Workspace
                </a>
              </li>
              <li>
                <a
                  href="/analytics"
                  className="hover:text-white transition-colors"
                >
                  Analytics
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-white/70">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50">
          <p>&copy; 2024 ProjectPulse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
