import { Link } from "wouter";
import { Terminal } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-muted/30 py-12 px-4" data-testid="marketing-footer">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-primary rounded">
                <Terminal className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">TLDTerminal</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your daily terminal for domain deals. Find, score, and track dropping domains.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-3 text-sm">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing">
                  <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer" data-testid="footer-link-pricing">
                    Pricing
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/#pro-features">
                  <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer" data-testid="footer-link-pro-features">
                    Pro Features
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-3 text-sm">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer" data-testid="footer-link-about">
                    About
                  </span>
                </Link>
              </li>
              <li>
                <a href="mailto:support@tldterminal.com" className="text-sm text-muted-foreground hover:text-foreground" data-testid="footer-link-support">
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-3 text-sm">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy">
                  <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer" data-testid="footer-link-privacy">
                    Privacy Policy
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer" data-testid="footer-link-terms">
                    Terms of Service
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/terms#refunds">
                  <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer" data-testid="footer-link-refund">
                    Refund Policy
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} TLDTerminal. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy">
              <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">Privacy</span>
            </Link>
            <Link href="/terms">
              <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">Terms</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
