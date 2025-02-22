export const siteConfig = {
    name: "LexInvictus",
    description: "Empowering law students with expert guidance and resources",
    contact: {
      email: "contact@lexinvictus.com",
      phone: "+91 1234567890",
      address: "New Delhi, India",
    },
    social: {
      facebook: "https://facebook.com/lexinvictus",
      twitter: "https://twitter.com/lexinvictus",
      linkedin: "https://linkedin.com/company/lexinvictus",
      instagram: "https://instagram.com/lexinvictus",
    },
    termsEffectiveDate: "February 16, 2026",
    
    mentors: [
    {
      name: "Ranjeet Saw",
      role: "Legal Expert & Mentor",
      photo: "/mentors/ranjeet-saw.jpg",
      description: "Expert legal mentor with over 10 years of experience in corporate law and legal education.",
      website: "https://topmate.io/ranjeet_saw",
      }
    ],
    communityLinks: {
      network: "https://facebook.com/lexinvictus",
      discussions: "https://twitter.com/lexinvictus",
      resources: "https://linkedin.com/company/lexinvictus",
      mentorship: "https://instagram.com/lexinvictus",
    }
  }
  
export type SiteConfig = typeof siteConfig
  