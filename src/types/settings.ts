export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface SiteSettings {
  name: string;
  role: string;
  location: string;
  email: string;
  calLink: string;
  avatarUrl: string;
  resumeUrl: string;
  headline: string;
  subheadline: string;
  socials: SocialLink[];
}

export const DEFAULT_SETTINGS: SiteSettings = {
  name: "Muhammad Mudassar Bhatti",
  role: "AI Systems & Automation Developer",
  location: "Pakistan",
  email: "mudasarbhatti191@gmail.com",
  calLink: "mudasar-bhatti",
  avatarUrl: "/profile.jpg",
  resumeUrl: "/resume.pdf",
  headline: "I build AI systems that do real work for your business.",
  subheadline:
    "Tools that read documents, watch video, check your code, and flag problems automatically, so your team spends time on decisions instead of repetitive checking.",
  socials: [
    {
      id: "linkedin",
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/mudasarbhatti/",
    },
    {
      id: "github",
      platform: "GitHub",
      url: "https://github.com/bhatticoder",
    },
    {
      id: "twitter",
      platform: "Twitter/X",
      url: "https://x.com/mudasar__1",
    },
    {
      id: "medium",
      platform: "Medium",
      url: "https://medium.com/@mudasarbhatti784",
    },
    {
      id: "reddit",
      platform: "Reddit",
      url: "https://www.reddit.com/user/AnteaterCultural5966/",
    },
    {
      id: "instagram",
      platform: "Instagram",
      url: "https://www.instagram.com/tita_nbyte",
    },
  ],
};
