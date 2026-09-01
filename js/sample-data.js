/* ==========================================================================
   SAMPLE DATA PRESETS FOR INSTANT ONE-CLICK DEMOS
   ========================================================================== */

const sampleProfiles = {
  softwareEngineer: {
    personal: {
      fullName: "Alex Rivera",
      jobTitle: "Senior Full Stack & Cloud Architect",
      email: "alex.rivera.dev@gmail.com",
      phone: "+1 (555) 382-9104",
      location: "San Francisco, CA",
      website: "https://alexrivera.dev",
      linkedin: "linkedin.com/in/alexrivera-tech",
      github: "github.com/alexrivera-dev",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      summary: "Results-driven Full Stack Engineer with 7+ years of experience architecting distributed microservices and scalable cloud applications. Spearheaded high-throughput infrastructure processing 10M+ daily requests with 99.99% uptime. Passionate about AI integration, performance tuning, and developer tooling."
    },
    experience: [
      {
        id: "exp-1",
        role: "Lead Software Engineer",
        company: "Apex Cloud Solutions",
        location: "San Francisco, CA",
        startDate: "2022-03",
        endDate: "Present",
        current: true,
        bullets: [
          "Architected and deployed a multi-region Kubernetes platform serving 12M+ monthly active users, reducing cloud compute costs by 34%.",
          "Led a high-performing engineering squad of 8 engineers across front-end, back-end, and DevOps through agile sprints.",
          "Integrated generative AI features into the core analytics dashboard, boosting user engagement metrics by 48%."
        ]
      },
      {
        id: "exp-2",
        role: "Senior Full Stack Engineer",
        company: "Nexus Innovations Inc.",
        location: "Austin, TX",
        startDate: "2019-06",
        endDate: "2022-02",
        current: false,
        bullets: [
          "Designed resilient RESTful and GraphQL APIs in Node.js and Go, reducing API latency from 240ms to 45ms.",
          "Migrated legacy monolithic UI to Next.js and TypeScript, accelerating page load speed (LCP) by 62%.",
          "Established automated CI/CD deployment pipelines using GitHub Actions, cutting release cycles from weekly to twice daily."
        ]
      },
      {
        id: "exp-3",
        role: "Software Developer",
        company: "Vanguard Tech Labs",
        location: "Seattle, WA",
        startDate: "2017-08",
        endDate: "2019-05",
        current: false,
        bullets: [
          "Engineered real-time data streaming microservices using Apache Kafka and Redis Pub/Sub.",
          "Implemented comprehensive automated test suites (Jest, Cypress) elevating code coverage to 94%."
        ]
      }
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.S. in Computer Science",
        school: "University of California, Berkeley",
        location: "Berkeley, CA",
        gradYear: "2017",
        details: "Graduated with Magna Cum Laude (GPA: 3.89/4.0). Specialization in Distributed Systems & AI."
      }
    ],
    skills: {
      technical: ["TypeScript", "JavaScript", "React / Next.js", "Node.js", "Go", "Python", "GraphQL", "PostgreSQL", "MongoDB", "Redis"],
      soft: ["Engineering Leadership", "System Architecture", "Cross-Functional Collaboration", "Mentorship", "Agile/Scrum"],
      tools: ["Docker", "Kubernetes", "AWS (ECS, Lambda, S3)", "Terraform", "Git", "GitHub Actions", "Kafka"]
    },
    projects: [
      {
        id: "proj-1",
        title: "OmniAI - Real-time Multi-Agent IDE",
        description: "An intelligent browser-based coding workspace integrating LLMs, live code execution sandbox, and automated git workflows.",
        techStack: ["Next.js", "TypeScript", "WebSockets", "Docker", "TailwindCSS"],
        liveLink: "https://omniai-demo.dev",
        githubLink: "https://github.com/alexrivera-dev/omniai"
      },
      {
        id: "proj-2",
        title: "KubeScale - Intelligent Autoscaling Engine",
        description: "Lightweight custom Kubernetes operator for predictive load balancing and dynamic cluster cost optimization.",
        techStack: ["Go", "Kubernetes API", "Prometheus", "Grafana"],
        liveLink: "https://kubescale.io",
        githubLink: "https://github.com/alexrivera-dev/kubescale"
      },
      {
        id: "proj-3",
        title: "FastCache - In-Memory Key-Value Store",
        description: "Zero-allocation, lock-free LRU in-memory caching engine capable of 1.2M ops/sec with sub-millisecond latency.",
        techStack: ["Rust", "C++", "gRPC"],
        liveLink: "",
        githubLink: "https://github.com/alexrivera-dev/fastcache"
      }
    ],
    certifications: [
      {
        id: "cert-1",
        name: "AWS Certified Solutions Architect – Professional",
        issuer: "Amazon Web Services",
        year: "2023",
        link: "https://aws.amazon.com/verification"
      },
      {
        id: "cert-2",
        name: "Certified Kubernetes Administrator (CKA)",
        issuer: "Cloud Native Computing Foundation",
        year: "2022",
        link: "https://cncf.io/cka"
      }
    ],
    settings: {
      template: "template-modern-tech",
      accentColor: "#4f46e5",
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }
  },

  productDesigner: {
    personal: {
      fullName: "Sophia Lin",
      jobTitle: "Lead UI/UX & Product Designer",
      email: "sophia.lin.design@gmail.com",
      phone: "+1 (555) 749-2041",
      location: "New York, NY",
      website: "https://sophialin.design",
      linkedin: "linkedin.com/in/sophialin-ux",
      github: "github.com/sophialin-design",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      summary: "Human-centric Product Designer with 6+ years creating intuitive, beautiful, and accessible enterprise and consumer digital experiences. Proven track record turning complex workflows into delightful user journeys, driving a 42% increase in user retention."
    },
    experience: [
      {
        id: "exp-1",
        role: "Lead Product Designer",
        company: "Starlight Digital",
        location: "New York, NY",
        startDate: "2021-04",
        endDate: "Present",
        current: true,
        bullets: [
          "Redesigned the multi-platform design system used by 60+ engineers and 15 designers, increasing design sprint velocity by 40%.",
          "Conducted 120+ user research sessions and usability studies, synthesizing qualitative insights into prioritized product roadmaps.",
          "Partnered closely with executive leadership and VP of Product to deliver mobile app 2.0 with a 4.9-star App Store rating."
        ]
      },
      {
        id: "exp-2",
        role: "Senior UX/UI Designer",
        company: "Pulse Fintech",
        location: "Boston, MA",
        startDate: "2018-09",
        endDate: "2021-03",
        current: false,
        bullets: [
          "Designed end-to-end checkout and payment flow reducing user checkout drop-off rate by 28%.",
          "Created interactive high-fidelity micro-interaction prototypes in Figma and Principle for user validation."
        ]
      }
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.Des in Interaction & Industrial Design",
        school: "Rhode Island School of Design (RISD)",
        location: "Providence, RI",
        gradYear: "2018",
        details: "Dean's Honors List. President of Design Innovation Society."
      }
    ],
    skills: {
      technical: ["Design Systems", "Figma", "Framer", "Prototyping", "User Research", "Wireframing", "Interaction Design", "HTML/CSS/JS"],
      soft: ["Storytelling", "Design Thinking", "Stakeholder Management", "User Empathy", "Workshops Facilitation"],
      tools: ["Figma", "Framer", "Principle", "Adobe Creative Suite", "Maze", "Miro", "Notion", "Linear"]
    },
    projects: [
      {
        id: "proj-1",
        title: "Aura - Mindful Health & Wellness App",
        description: "End-to-end mobile design for mental wellbeing with customized biometric micro-routines and soothing glassmorphic aesthetic.",
        techStack: ["Figma", "Framer", "Design System", "Mobile UI"],
        liveLink: "https://framer.com/aura-preview",
        githubLink: ""
      },
      {
        id: "proj-2",
        title: "Flow - Enterprise Design System",
        description: "Unified token-based design system featuring 140+ accessible accessible WCAG 2.1 AA components and guidelines.",
        techStack: ["Figma Tokens", "Storybook", "React", "Zeroheight"],
        liveLink: "https://flow-design-system.io",
        githubLink: ""
      }
    ],
    certifications: [
      {
        id: "cert-1",
        name: "Nielsen Norman Group (NN/g) UX Master Certified",
        issuer: "Nielsen Norman Group",
        year: "2022",
        link: "https://nngroup.com"
      }
    ],
    settings: {
      template: "template-executive",
      accentColor: "#db2777",
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }
  }
};
