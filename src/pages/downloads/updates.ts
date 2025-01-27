export interface UpdateLog {
  date: string;
  author: string;
  authorId: number;
  version: string;
  content: string;
  link: string;
}

export const updates: UpdateLog[] = [
  {
    author: "cunev",
    authorId: 0,
    date: "Jan 29th, 2025",
    version: "Testing Version 2",
    content: `

As Rhythia's playerbase grows, Testing Version 2 focuses on improving compatibility and quality of life.

**What are the new features:**
- In-game map browser

**Compatibility:**
- Few major bugs were addressed related to game start.

**Mapping:**
- Reduced number of approvals from 1 to 0, meaning only two nominations are required.
- Map uploading was restricted based on mapper name.

**Very important notice:**
If this version doesn't work, please revert to previous version and report the bug in our Discord server.

Your client won't auto-update, you will need to download a separate client during testing - once it's stable everyone will get the update.
`,
    link: "https://github.com/cunev/rhythia-online-release/releases/download/testing-client/rhythia-online.zip",
  },
  {
    author: "cunev",
    authorId: 0,
    date: "Jan 3rd, 2025",
    version: "Testing Version 1",
    content: `Hello, everyone

Rhythia's new online features are open to public.
The download button will be enabled **gradually during a 5 day period** for all registered players on the site to prevent high traffic.

**What will be the new features:**
- Score submitting with Leaderboards
- Multiplayer with up to 8 players with mod syncing
- New In-Game GUI related to online features: chat, RP calculator and many more.

**Other cool updates:**
- Online map preview, you don't need to record showcases anymore
- Leaderboards by countries
- Leaderboards separation by playstyle (spin players)
- Moderation tools, the website is now fully moderated by @mod

**Very important notice:**
This is still a testing phase, some things are expected to break due to high traffic or unknown scenarios. If so, please don't panic and just report the bug.
And because it's still testing, things can take time to get fixed.

Your client won't auto-update, you will need to download a separate client during testing - once it's stable everyone will get the update.
Special thanks to all testers, devs, and admins for suggestions and help during these 3 months of development.

**Important:**
- Any form of cheating will be punished
- If you have issues with update screen, please try using a VPN.
- If you have issues downloading the files due to browser, you might need to add the client to [Defender Allowlist](https://support.microsoft.com/en-us/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26).
- Any other issues with the new client should be reported in #bug-reports, but any logs are sensitive, and must be sent only to staff in private.

**Next steps for online:**
- Tournaments and clans
- Public/private lobby list and support for any/unsubmitted maps
- Ranked multiplayer lobbies
- Better stability and much much more

**Merry Christmas and Happy Holidays everyone!**`,
    link: "https://github.com/cunev/rhythia-online-release/releases/download/development/rhythia-online.zip",
  },
];
