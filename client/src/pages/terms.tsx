import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketingHeader />
      <main className="flex-1 pt-16">
        <div className="container mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-terms-title">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: February 2026</p>

          <div className="prose prose-sm max-w-none space-y-6">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using TLDTerminal, you agree to be bound by these Terms of Service.
                If you do not agree to these terms, you may not use the service. We reserve the right
                to update these terms at any time, and continued use constitutes acceptance of changes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                TLDTerminal is a domain investing research tool that provides daily drop feeds,
                domain scoring, watchlists, saved searches, AI-powered domain generation, and
                portfolio tracking. The service is provided "as is" and domain data is for
                informational purposes only.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">3. Account Registration</h2>
              <p className="text-muted-foreground leading-relaxed">
                You must create an account to use TLDTerminal. You are responsible for maintaining
                the security of your account credentials. You agree to provide accurate information
                and to notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">4. Subscription Plans</h2>
              <p className="text-muted-foreground leading-relaxed">
                TLDTerminal offers a free Starter plan and a paid Pro plan at $79 per month.
                Pro subscriptions are billed monthly and renew automatically. You may cancel
                your subscription at any time, and access will continue through the end of
                the current billing period.
              </p>
            </section>

            <section className="space-y-3" id="refunds">
              <h2 className="text-xl font-semibold text-foreground">5. Refund Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We offer a 7-day free trial for Pro subscriptions. If you cancel during the trial
                period, you will not be charged. After the trial, subscription payments are
                non-refundable except in cases of service unavailability exceeding 48 continuous
                hours. Refund requests should be directed to our support team within 14 days
                of the charge.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">6. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree not to use TLDTerminal for any unlawful purpose; attempt to reverse
                engineer, scrape, or redistribute data from the service; interfere with or
                disrupt the service or its infrastructure; or impersonate any person or entity.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">7. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content, features, and functionality of TLDTerminal are owned by us and
                are protected by copyright, trademark, and other intellectual property laws.
                Domain data displayed in the service is sourced from public registries and
                is provided for informational purposes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">8. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                TLDTerminal is provided on an "as is" and "as available" basis. We make no
                warranties regarding the accuracy of domain scores, availability predictions,
                or investment recommendations. Domain investing involves risk, and you are solely
                responsible for your purchasing decisions.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">9. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, TLDTerminal shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages resulting from
                your use of or inability to use the service, including but not limited to losses
                from domain purchases made based on information provided by the service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">10. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may suspend or terminate your account at any time for violation of these terms.
                You may delete your account at any time through your account settings. Upon
                termination, your right to use the service will immediately cease.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">11. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                Questions about these Terms of Service should be directed to{" "}
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
