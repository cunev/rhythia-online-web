const restrictionText = `# Privacy Notice

## Information We Collect
When processing your donation, we collect necessary personal information including:
- Your name
- Email address
- Billing information
- Transaction details
- IP address and basic device information

## How We Use Your Information
- To process your donation
- To provide supporter benefits
- To communicate about your subscription
- To maintain accurate financial records
- To prevent fraudulent transactions
- To comply with legal obligations

## Data Security
We implement appropriate security measures to protect your personal information. Your payment details are processed through secure third-party payment processors who comply with PCI DSS standards.

## Data Retention
We retain your information for as long as necessary to:
- Maintain your active subscription
- Comply with legal obligations
- Resolve disputes
- Prevent fraud

## Your Rights
You have the right to:
- Access your personal information
- Request correction of inaccurate data
- Request deletion of your data (where applicable)
- Withdraw consent for future processing
- Receive your data in a portable format

Contact us at [support email] to exercise these rights.

# Refund Policy

## Monthly Donations
- Monthly donations are recurring payments that support our ongoing operations
- You can cancel your monthly donation at any time through your account settings or by contacting support
- Cancellation will stop future payments but will not refund previous donations
- Your supporter benefits will remain active until the end of your paid period

## Refund Eligibility
Refunds may be issued in the following circumstances:
- Technical errors resulting in duplicate charges
- Unauthorized transactions
- Service unavailability preventing benefit delivery
- Other exceptional circumstances (evaluated case-by-case)

## Requesting a Refund
To request a refund:
1. Contact our support team within 30 days of the transaction
2. Provide your transaction ID and reason for the refund
3. We will review your request and respond within 5 business days

## Processing Time
- Approved refunds will be processed within 5-10 business days
- The actual receipt of funds may vary depending on your payment method and financial institution

## Contact Information
For questions about donations, refunds, or privacy:
Email: dmitricunev@gmail.com
Response Time: Within 2 business days

We reserve the right to modify these policies at any time. Users will be notified of significant changes.`;
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function RenderCopy() {
  return (
    <Markdown
      className={
        "prose prose-sm dark:prose-invert prose-neutral dark min-w-full prose-h1:mb-0 prose-h2:my-0 prose-h3:my-0 prose-h4:my-0 prose-li:my-0 prose-ol:m-0 prose-ul:m-0 overflow-hidden relative"
      }
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
    >
      {restrictionText}
    </Markdown>
  );
}
