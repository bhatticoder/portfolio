export interface SiteSocials {
  linkedin: string;
  twitter: string;
  github: string;
  reddit: string;
  medium: string;
  instagram: string;
}

export interface SiteSettings {
  name: string;
  role: string;
  location: string;
  email: string;
  calLink: string;
  avatarUrl: string;
  headline: string;
  subheadline: string;
  socials: SiteSocials;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  name: "Muhammad Mudassar Bhatti",
  role: "AI Systems & Automation Developer",
  location: "Pakistan",
  email: "mudasarbhatti191@gmail.com",
  calLink: "mudasar-bhatti",
  avatarUrl: "/profile.jpg",
  headline: "I build AI systems that do real work for your business.",
  subheadline:
    "Tools that read documents, watch video, check your code, and flag problems automatically, so your team spends time on decisions instead of repetitive checking.",
  socials: {
    linkedin: "https://www.linkedin.com/in/mudasarbhatti/",
    twitter: "https://x.com/mudasar__1",
    github: "https://github.com/bhatticoder",
    reddit: "https://www.reddit.com/user/AnteaterCultural5966/",
    medium: "https://medium.com/@mudasarbhatti784",
    instagram: "https://www.instagram.com/tita_nbyte",
  },
};

