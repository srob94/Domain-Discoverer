import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketingHeader />
      <main className="flex-1 pt-16">
        <div className="container mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-privacy-title">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: February 2026</p>

          <div className="prose prose-sm max-w-none space-y-6">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                When you create an account on TLDTerminal, we collect your name, email address, and profile information
                provided through your authentication provider. We also collect usage data such as domains you watch,
                searches you perform, and features you access.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use the information we collect to provide, maintain, and improve TLDTerminal services; send you
                notifications about domain drops, search matches, and account activity; process your subscription
                and manage your account; and communicate with you about updates, offers, and support.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">3. Data Storage and Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your data is stored securely using industry-standard encryption and security practices.
                We use PostgreSQL databases with encrypted connections and never store payment information
                directly — all payment processing is handled by our third-party payment provider.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">4. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use essential cookies to maintain your session and authentication state.
                We do not use third-party advertising trackers. Analytics data is collected
                in aggregate to improve the service and is not sold to third parties.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">5. Data Sharing</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties.
                We may share anonymized, aggregate data for analytical purposes. We may
                disclose information when required by law or to protect our rights and safety.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">6. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                You may access, update, or delete your personal information at any time through your
                account settings. You may request a copy of all data we hold about you. You may
                opt out of non-essential communications at any time.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">7. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your account data for as long as your account is active. If you delete
                your account, we will remove your personal data within 30 days, except where
                we are required by law to retain it.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">8. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any
                material changes by posting the new policy on this page and updating the
                "Last updated" date.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">9. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:support@tldterminal.com" className="text-primary hover:underline">
                  support@tldterminal.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
