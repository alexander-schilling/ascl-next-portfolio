import type { SiteContent } from "@/types/portfolio";

export const siteContent: SiteContent = {
  brand: "AS",
  brandLogoUrl: "",
  navLinks: [
    { label: "Story", href: "#about" },
    { label: "Career", href: "#experience" },
    { label: "Passions", href: "#passions" },
    { label: "Contact", href: "#contact" },
  ],
  resumeUrl: "#",
  resumeLabel: "Resume",
  languageSwitcher: {
    enLabel: "EN",
    esLabel: "ES",
  },
  hero: {
    badge: "The Human Behind the Code",
    title: "Crafting Systems,",
    highlightedTitle: "Capturing Moments.",
    subtitle:
      "The journey of a Data Engineer obsessed with structural precision and the organic beauty of life beyond the screen.",
    primaryCta: { label: "Explore My Story", href: "#about" },
    secondaryCta: { label: "See My Work", href: "#experience" },
    backgroundImageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC72iL6LCan6mduWJYoNSfnzYT2BEx5R4_bgZGgkKYFRN1fLFzNUbnnzPYH07AFiluh3JrdLi5kHqAKSWtgQxIkUjKU6_TcFJScObmi-NjlX8lf-smJeDcSF9di4RZpJCV7Dwyvr8NgzWtrGXSqEyLtDpW8Jv9D62bKu4uhW22oKyLOvuNx3okLv49mGOqi9PvpFAaqaJVhM5CuyYNTA84sx-MPc1XlYPXFiX8pRY18j3IybSIhOGLzJxSQ1CD1N-1WMkfAtOAzBQ",
  },
  about: {
    heading: "Hello, I'm Alexander.",
    paragraphs: [
      "I'm a 28-year-old explorer of both digital and physical landscapes. My passion for development didn't start in a boardroom; it started in my childhood bedroom, dismantling software and rebuilding it to see how the gears turned.",
      "Today, I serve as a Data Engineering Tech Lead, where I architect the complex pipelines that power global financial transactions. But code is only half the narrative.",
      "When I'm not optimizing Spark jobs, you'll find me behind a viewfinder capturing the mood of a rainy city street, or deep in the mechanics of community-driven gaming environments. I believe the best engineers are those who find inspiration in the world outside their terminal.",
    ],
    statusTitle: "Status",
    statusLabel: "Building at Scale",
    portraitUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB2b25O9g8AkrqBdMdgP-nApyXkAKh7ydfj4NdHPa9PFeAVw7TFU0qT4JmMa-mJFcpICFP_hNNgA84oUReQ7WBVfhNFe9v4YF_x_2Ueza4cEh3fejC5z9t9j5KoZeGKNvXRpLCJ_GRGn85FBCGgC273FMEA9tP-TCcykBWZONL0pkQnqpTcfNX6CNUDd720NZsqIUq5feSq6f4kAQITy-8bBxl0F3jpj6LFd744c7ZwIyf9ZiztxUXeEtRgHNBeCRcyc-7LY3ETVA",
    features: [
      { title: "Curiosity", description: "Lifelong learner since 1996.", iconKey: "curiosity" },
      { title: "Leadership", description: "Guiding teams, growing talent.", iconKey: "leadership" },
    ],
  },
  experienceSection: {
    eyebrow: "The Professional Journey",
    title: "Career",
    highlightedTitle: "Architecture",
    description:
      "A decade of translating complex business requirements into high-performance technical systems. Engineering for scale, leading for impact.",
  },
  experienceShowMoreLabel: "View Prior Milestones",
  experience: [
    {
      period: "2021 - PRESENT",
      role: "Principal Data Engineer & Tech Lead",
      company: "Visa/Mastercard Ecosystem",
      modality: "Hybrid",
      highlights: [
        {
          text: "Spearheaded the migration of legacy pipelines to a distributed Spark ecosystem, reducing processing latency by 65%.",
          iconKey: "insights",
        },
        {
          text: "Mentored a cross-functional team of 12 engineers and implemented CI/CD practices that increased deployment frequency by 4x.",
          iconKey: "groups",
        },
        {
          text: "Architected a real-time fraud detection engine processing 1.2M events/sec with 99.99% uptime.",
          iconKey: "architecture",
        },
      ],
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDFV90Dklr22YcFNsJ4xD5jWEDToeKXrr9NZK16OAmS_W15fkwtyAAy8vAvevEwOrAS04rgh1RRXHnbpwb90Gt52DPt-b68AyPHzgWjWmdDPLLLXePP7VNgEQut-U6rE3Fm3--otRZNcB9fE2XNL8aUkDEMF2o7ZCeGNyH3M5Qe8X-sLqe-a-NRqp1kmAax6pysRNdD2_BBCT5w1id9H7n2ZwggX3YMALRtbwRgyLd-AC0ayacjourht803_DtwZvwzt6wI89BTuw",
    },
    {
      period: "2018 - 2021",
      role: "Senior Full-Stack Engineer",
      company: "FinTech Startup",
      modality: "Remote",
      highlights: [
        {
          text: "Developed and launched 15+ high-traffic web applications using React, Node.js, and AWS for Fortune 500 clients.",
          iconKey: "rocket_launch",
        },
        {
          text: "Built a cross-platform mobile app that reached 500k+ downloads in its first quarter.",
          iconKey: "smartphone",
        },
        {
          text: "Optimized frontend performance and maintained 98+ Lighthouse scores.",
          iconKey: "bolt",
        },
      ],
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC0UMPtm22PGoEQpuf31VpS0JXSO1mt7JW6AU6xC4rt8fCFQBEzC-DxlAu4szcMXJP4u3k78eQIAQt17_9Qpsr3L0gFQPvtMkGG9gkJyKHAoXzAKHDnKvpmpLmbHw5pzSCxvMxwbvkF_v8kTxlgXEA2bcJH7v54JIzJ1F8F8grKPTZE3T4gKDDh3yRTbzcR5dvq9SiDTf_wQjiUOwt5Nb3L79biEuK9iJ5Bng68QQJrQxlgFMJiePYekX3wLsNdpAjQhjHWgR1QhQ",
    },
    {
      period: "2015 - 2018",
      role: "Data Engineer",
      company: "Global Banking Group",
      modality: "On-site",
      highlights: [
        { text: "Managed ETL pipelines for global reporting systems.", iconKey: "architecture" },
        { text: "Optimized SQL queries for complex regulatory audits, improving report generation time by 400%.", iconKey: "bolt" },
      ],
    },
    {
      period: "2013 - 2015",
      role: "Junior Web Developer",
      company: "Creative Agency",
      highlights: [
        { text: "Crafted responsive interfaces and managed database migrations for e-commerce clients.", iconKey: "rocket_launch" },
      ],
      hidden: true,
    },
  ],
  passions: {
    heading: "Photography",
    iconKey: "camera",
    description:
      "My lens is how I process the world. I specialize in urban landscapes and street photography, finding geometry in the chaos of the city.",
    instagramUrl: "https://instagram.com",
    instagramHandle: "@schilling_lens",
    viewPostLabel: "View post",
    gallery: [
      {
        title: "Urban Geometry",
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBq9B5gFBXGTK93_T_KQMlvXihtvl0CxlrzUEZFrZm7cobA2CbxWPez6YXvVOKhHIjx9X4eHkxZvGai-thzK1bGIj1K4pX5pXZ8OPJ9LF3nCDlHfX3guGpkP99bpL_fz_k42U82Jkq-c09OWsai1nuuWWfBNPNQpv62NAmon8OvySmD7fnx6SFa6iXApSXVh3XHt8GiBB2mlaIqk1pXXHGcHq87xH0KhjGe68FTX1B7B5RWxRom9IpoUKCxyNfer7O0rpXIzgGJTg",
        featured: true,
      },
      {
        title: "Abstract Still",
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuC1mMimUtjn8ptIZ5njeOT2RjZOP42SC3BcqYtYoIRxVOU3RkoTDSweTNlHQX1pl-HGE3U1b37ZYtFmdl9F_U7mUyfJ8IpPXnreq-0Ff9zOxhNQZPbJov6LabNUj7YWK1gAfDshkQpSIcYx6scxuC_-mEeAW3uyfLJ7bRCWXPUKPrbCEJjtTFrzX0d-6vxI35bJz2HAnxWFvTAmHm3zENS9k9gOh_KrTrCXQtza4dqvKedUnrSBUXMgeWeoWQVQsBbAoqofF2yMoA",
      },
      {
        title: "Panoramic Mood",
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBxXuc1n9FcqHjIaEReyRItNF8gAr2ary6EGlOGbYDUVtr409NmHyLB6QjD4EuiwlpI6_tNk3FwPQxY7OSJ0o4amaoK-tCnyR1Qhuv_I9DVR1z5zQv4907Ix95ZHy15bXtCmxNFDmY2ULvy3EcCWAhj7IHEiRsd6CIOsbwakxD6JiP9CT6VCZIlQyvHTaMtR3vRJ_6msK_E9lp3ymeIZXRfsaDz-ujMjNSF_5Y_r9hb-laVkIJEY_T3vAdbWwj2gS-pppqJYnygpA",
      },
    ],
  },
  gaming: {
    heading: "GTA 5 Roleplay",
    iconKey: "joystick",
    description:
      "For the past 7 years, I've been the lead architect behind a high-concurrency Roleplay environment. This project involves deep systems programming, community management, and economic infrastructure design for thousands of players.",
    stats: [
      { label: "Infrastructure", value: "Custom LUA framework & Linux clusters" },
      { label: "Scale", value: "10,000+ registered members" },
    ],
    links: [
      { label: "Discord", href: "#" },
      { label: "Website", href: "#" },
      { label: "Instagram", href: "#" },
    ],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAlpilNcjoBkC8YFfPfSSTgQJRG439glK3Hek81ArW1UUupAUlr8nIHJQ6YjYR-79dg8z6AD-cpEPyh0dDPmTSt-kOtxehJoFSfTL1wvx3RsZUssVsh8s6wikgLqMLYbCM3qgx3oFpklotkqk4xp_AJncKb8YhQkOk8av4S_5_hQIGqhhogCdbL7pbTIX0hhMsQofi8BQfRtQe0jyG6OIgTUSkU8CT7n0AKvdLjstMJVM7sstuixslhH-tUC5QQNVxh-6rnrHQG6A",
  },
  contact: {
    heading: "Let's connect on",
    highlighted: "a human level.",
    description:
      "Whether it's discussing high-throughput pipelines, sharing photography tips, or just talking about the future of gaming, let's start a conversation.",
    ctas: [
      { label: "Email", href: "mailto:contacto@alexanderschilling.cl" },
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
    ],
    details: [
      { label: "Base", value: "New York, NY" },
      { label: "Currently Reading", value: "System Design Interview Vol. 2" },
    ],
  },
  seo: {
    title: "Alexander | Data Engineering Portfolio",
    description: "Alexander's portfolio: Data Engineering Tech Lead, distributed systems architecture, and personal projects.",
    openGraphDescription: "Systems at scale, technical leadership, and creativity beyond the terminal.",
    siteName: "Alexander Portfolio",
  },
  manifest: {
    name: "Alexander | Data Engineering Portfolio",
    shortName: "Alexander",
    description: "Personal portfolio for a Data Engineering Tech Lead focused on distributed systems, leadership, and creative work.",
  },
  footerBrand: "AS",
  footerNote: "Alexander • Built with Passion and Precision.",
  footerLinks: [
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "GitHub", href: "#" },
  ],
};

