const restrictionText = `# Rhythia Restrictions

A restriction is a timeout from the community forced upon accounts that exhibit abnormal, suspicious, or rule-breaking behaviour.

When an account is restricted, it is unable to interact with the community until the restriction is lifted. Restricted players can still continue playing the game, downloading beatmaps and submitting scores, but their profile will be invisible to others.

There are following types of restrictions:
- **Silence**: The player is unable to chat in-game or on the website.
- **Restricted**: The player is unable to submit scores due.
- **Excluded**: The player is unable to perform any action related to online.

# ‎ 
## When are restrictions applied?

- Silence: When a player is reported for inappropriate behaviour in chat.
- Restricted: When a player is multi-accounting.
- Excluded: When a player is cheating.

# ‎ 
## How to get restrictions lifted?

If your account has been restricted, do not panic. Please follow these steps:

- Wait 24 hours. Some restrictions are the results of automated processes. As we check every new restriction daily, please wait 24 hours — if your restriction was erroneous, it will hopefully be lifted within that time.
- Contact our account support team. If your account remains restricted after that time, please send an email to support@rhythia.com from the email address attached to your account to ask for details on your restriction. Make sure you include your username, along with any details you can provide as to why you think you may have been restricted. The more you tell us, the easier it is for us to resolve the issue.

# ‎ 
## How long should I wait before appealing ?

- Silence: No cooldown.
- Restricted: 3 months.
- Excluded: 6 months.

# ‎ 
## Excluded

If you have been excluded, you will need to wait for the restriction to be lifted. If you believe the restriction was made in error, please contact our account support team.


**Email:** [support@rhythia.com](mailto:support@rhythia.com)`;
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
