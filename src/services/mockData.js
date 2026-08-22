/**
 * Comprehensive Knowledge Base & Initial Data for HireNova
 * Includes real-world job postings, bridging projects, skill taxonomies, and sample resumes.
 */

export const INITIAL_JOBS = [
  {
    id: 'job-1',
    title: 'Cloud Infrastructure Engineer',
    company: 'Nimbus Scale Systems',
    location: 'San Francisco, CA (Hybrid)',
    workType: 'Hybrid',
    experienceLevel: 'Mid-Senior (3-5 Years)',
    salary: '$135,000 - $165,000',
    postedDate: '2 days ago',
    source: 'LinkedIn Jobs',
    sourceUrl: 'https://www.linkedin.com/jobs/view/cloud-infrastructure-engineer',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux', 'CI/CD'],
    preferredSkills: ['Python', 'Go', 'Prometheus', 'Grafana', 'Ansible', 'Security'],
    softSkills: ['Problem Solving', 'Communication', 'Incident Management'],
    educationRequirement: "Bachelor's in Computer Science, IT, or equivalent practical experience",
    experienceRequirement: '3+ years deploying and managing production cloud infrastructure on AWS/GCP.',
    description: `We are looking for a Cloud Infrastructure Engineer to design, scale, and automate our cloud platform.
    
Key Responsibilities:
- Build and maintain multi-region AWS cloud infrastructure using Terraform Infrastructure as Code (IaC).
- Architect and operate production Kubernetes (EKS) clusters with zero-downtime deployments.
- Implement automated CI/CD deployment pipelines using GitHub Actions and ArgoCD.
- Monitor system reliability, latency, and performance using Prometheus and Grafana.
- Collaborate with engineering teams to optimize containerized microservices and ensure robust security practices.`
  },
  {
    id: 'job-2',
    title: 'Full Stack React & Node Developer',
    company: 'NovaStack Technologies',
    location: 'Remote (US & Global)',
    workType: 'Remote',
    experienceLevel: 'Mid-Level (2-4 Years)',
    salary: '$110,000 - $140,000',
    postedDate: '1 day ago',
    source: 'Indeed Tech',
    sourceUrl: 'https://www.indeed.com/viewjob?jk=full-stack-react-developer',
    requiredSkills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'REST API'],
    preferredSkills: ['Next.js', 'TailwindCSS', 'Redis', 'Docker', 'GraphQL', 'Jest'],
    softSkills: ['Team Collaboration', 'Agile/Scrum', 'Code Reviewing'],
    educationRequirement: "Bachelor's degree or equivalent technical boot camp / portfolio experience",
    experienceRequirement: '2+ years building responsive frontend applications and scalable backend REST APIs.',
    description: `NovaStack is hiring a Full Stack Developer to build our next-generation customer intelligence platform.
    
Key Responsibilities:
- Develop modern, accessible, responsive user interfaces using React, TypeScript, and modern CSS.
- Design and implement scalable backend RESTful microservices with Node.js and Express.
- Manage relational database schemas and optimize query performance in PostgreSQL.
- Integrate authentication, third-party APIs, and payment systems securely.
- Write unit and integration tests using Jest and React Testing Library to ensure high reliability.`
  },
  {
    id: 'job-3',
    title: 'AI / Machine Learning Engineer',
    company: 'Cortex Labs AI',
    location: 'New York, NY (On-site)',
    workType: 'Onsite',
    experienceLevel: 'Entry-Mid (1-3 Years)',
    salary: '$125,000 - $155,000',
    postedDate: '3 days ago',
    source: 'Greenhouse Careers',
    sourceUrl: 'https://boards.greenhouse.io/cortexlabs/jobs/ai-ml-engineer',
    requiredSkills: ['Python', 'Machine Learning', 'PyTorch', 'TensorFlow', 'Pandas', 'NumPy', 'Scikit-learn'],
    preferredSkills: ['FastAPI', 'Docker', 'HuggingFace', 'LangChain', 'MLflow', 'AWS SageMaker'],
    softSkills: ['Analytical Thinking', 'Research Ability', 'Presentation Skills'],
    educationRequirement: "Bachelor's or Master's in Data Science, Computer Science, or Mathematics",
    experienceRequirement: '1-3 years experience training, evaluating, and fine-tuning ML/NLP models.',
    description: `Join Cortex Labs AI to develop state-of-the-art predictive and generative AI applications.
    
Key Responsibilities:
- Build and fine-tune machine learning and deep learning models using Python and PyTorch.
- Clean, preprocess, and analyze large-scale structured and unstructured datasets using Pandas and NumPy.
- Deploy ML models as performant real-time inference APIs using FastAPI and Docker.
- Implement evaluation pipelines, prompt engineering workflows, and vector search integrations.
- Collaborate with product managers to bring predictive intelligence into live user experiences.`
  },
  {
    id: 'job-4',
    title: 'DevOps & Site Reliability Engineer (SRE)',
    company: 'Apex Cloud Systems',
    location: 'Austin, TX (Hybrid)',
    workType: 'Hybrid',
    experienceLevel: 'Mid-Senior (3-6 Years)',
    salary: '$130,000 - $160,000',
    postedDate: 'Just now',
    source: 'Lever Jobs',
    sourceUrl: 'https://jobs.lever.co/apexcloud/devops-sre',
    requiredSkills: ['Linux', 'Kubernetes', 'Docker', 'CI/CD', 'Git', 'Bash', 'AWS'],
    preferredSkills: ['Terraform', 'Python', 'Datadog', 'Helm', 'Networking', 'Vault'],
    softSkills: ['Root Cause Analysis', 'On-call Leadership', 'Documentation'],
    educationRequirement: "BS in Computer Science, Information Systems, or equivalent experience",
    experienceRequirement: '3+ years in DevOps, CI/CD automation, or SRE environments.',
    description: `Apex Cloud Systems is seeking a DevOps / SRE to champion infrastructure automation, deployment velocity, and high system availability.
    
Key Responsibilities:
- Maintain 99.99% uptime across Kubernetes clusters and distributed cloud infrastructure.
- Automate multi-stage CI/CD pipelines with automated security testing and rollback triggers.
- Manage observability stacks (logs, metrics, traces) and conduct blameless post-mortems.
- Implement infrastructure security best practices, secret management, and network policies.`
  },
  {
    id: 'job-5',
    title: 'Frontend Engineer (Design Systems)',
    company: 'PixelCraft Studio',
    location: 'Remote',
    workType: 'Remote',
    experienceLevel: 'Mid-Level (2-4 Years)',
    salary: '$105,000 - $130,000',
    postedDate: '4 days ago',
    source: 'Wellfound / AngelList',
    sourceUrl: 'https://wellfound.com/jobs/frontend-engineer-design-systems',
    requiredSkills: ['React', 'TypeScript', 'HTML5', 'CSS3', 'TailwindCSS', 'Figma'],
    preferredSkills: ['Storybook', 'Next.js', 'Web Accessibility (a11y)', 'Cypress', 'Vite'],
    softSkills: ['Attention to Detail', 'UX Empathy', 'Creative Problem Solving'],
    educationRequirement: "Degree in Design/CS or proven frontend design system portfolio",
    experienceRequirement: '2+ years building polished, accessible web components and design libraries.',
    description: `PixelCraft is looking for a Frontend Engineer passionate about pixel-perfect interfaces and modern design systems.
    
Key Responsibilities:
- Build modular, accessible, and high-performance UI components in React and TypeScript.
- Bridge the gap between Figma design prototypes and production frontend code.
- Optimize frontend web performance, core web vitals, and mobile responsiveness.
- Collaborate closely with designers and product engineers to maintain cohesive branding.`
  },
  {
    id: 'job-6',
    title: 'Data Analyst / BI Specialist',
    company: 'Vanguard Data Insights',
    location: 'Chicago, IL (Hybrid)',
    workType: 'Hybrid',
    experienceLevel: 'Entry-Mid (1-3 Years)',
    salary: '$85,000 - $110,000',
    postedDate: '5 days ago',
    source: 'LinkedIn Jobs',
    sourceUrl: 'https://www.linkedin.com/jobs/view/data-analyst-bi-specialist',
    requiredSkills: ['SQL', 'Python', 'Tableau', 'Power BI', 'Data Analysis', 'Excel'],
    preferredSkills: ['PostgreSQL', 'Snowflake', 'dbt', 'Pandas', 'Statistics'],
    softSkills: ['Data Storytelling', 'Stakeholder Communication', 'Business Acumen'],
    educationRequirement: "Bachelor's degree in Analytics, Economics, Mathematics, CS, or Business",
    experienceRequirement: '1+ years writing complex SQL queries and delivering executive dashboards.',
    description: `Vanguard Data Insights is looking for a Data Analyst to transform complex business data into clear, actionable executive dashboards.
    
Key Responsibilities:
- Write optimized SQL queries across relational data warehouses to extract key business metrics.
- Build interactive, real-time KPI dashboards in Tableau and Power BI.
- Perform exploratory data analysis using Python and Pandas to uncover growth opportunities.
- Present data-driven recommendations to cross-functional stakeholders.`
  }
];

export const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    title: 'Cloud-Native Distributed File Storage System',
    targetRoles: ['Cloud Infrastructure Engineer', 'DevOps & Site Reliability Engineer (SRE)'],
    difficulty: 'Advanced',
    technologies: ['AWS S3', 'Docker', 'Kubernetes', 'Terraform', 'Node.js', 'Prometheus'],
    skillsGained: ['Terraform IaC', 'Kubernetes Cluster Ops', 'Object Storage', 'Containerization', 'CI/CD Pipelines'],
    shortDescription: 'Architect a highly available multi-region file storage service deployed on AWS EKS with Terraform automation.',
    relevanceReason: 'Directly proves production AWS, Docker, Kubernetes, and Terraform capabilities sought after in Cloud Engineer JDs.',
    architectureOutline: 'Client Uploads → API Gateway → Dockerized Auth/Upload Microservice → AWS S3 + Metadata in PostgreSQL → Prometheus Telemetry',
    stepGuide: [
      '1. Write Terraform scripts to provision AWS VPC, EKS cluster, and secure S3 buckets.',
      '2. Build a microservice with multipart chunking and presigned URL generation.',
      '3. Package with Docker and write Kubernetes deployment manifests with Horizontal Pod Autoscalers.',
      '4. Set up GitHub Actions CI/CD to build, test, and deploy upon git push.',
      '5. Add Prometheus metrics endpoint and visualize throughput in Grafana.'
    ]
  },
  {
    id: 'proj-2',
    title: 'Enterprise Microservices E-Commerce API',
    targetRoles: ['Full Stack React & Node Developer', 'Backend Engineer'],
    difficulty: 'Intermediate',
    technologies: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'Jest'],
    skillsGained: ['REST API Design', 'PostgreSQL Schema Modeling', 'Redis Caching', 'JWT Auth', 'Automated Testing'],
    shortDescription: 'Build a secure, rate-limited backend API with JWT authentication, Redis caching, and PostgreSQL database migrations.',
    relevanceReason: 'Demonstrates deep backend architecture, data persistence, and caching skills needed for full-stack and backend roles.',
    architectureOutline: 'Express App → JWT Authentication Middleware → Redis Cache Layer → PostgreSQL ORM Layer with Connection Pooling',
    stepGuide: [
      '1. Design relational schemas with Prisma/TypeORM for Users, Products, and Orders.',
      '2. Implement JWT authentication with refresh tokens and bcrypt password hashing.',
      '3. Add Redis caching layer for product catalogs to decrease query latency by 80%.',
      '4. Containerize application and database using Docker Compose.',
      '5. Write integration tests with Jest and Supertest achieving >85% code coverage.'
    ]
  },
  {
    id: 'proj-3',
    title: 'AI Resume Keyword Optimizer & Skill Gap Parser',
    targetRoles: ['AI / Machine Learning Engineer', 'Full Stack React & Node Developer'],
    difficulty: 'Intermediate',
    technologies: ['Python', 'FastAPI', 'Scikit-learn', 'React', 'Docker'],
    skillsGained: ['NLP TF-IDF', 'Cosine Similarity', 'FastAPI Microservice', 'React UI', 'Model Deployment'],
    shortDescription: 'Develop an NLP-driven resume analyzer calculating TF-IDF cosine similarity against job descriptions with real-time UI.',
    relevanceReason: 'Bridges NLP/ML algorithm implementation with practical web API engineering.',
    architectureOutline: 'React Frontend → FastAPI Backend → NLP Tokenizer & TF-IDF Vectorizer → Cosine Similarity Match Engine',
    stepGuide: [
      '1. Build text processing pipeline with regex cleaning, stopword filtering, and tokenization.',
      '2. Calculate TF-IDF term frequency vectors and cosine similarity matrix.',
      '3. Wrap NLP engine in a clean asynchronous FastAPI endpoint.',
      '4. Create an interactive React frontend with visual match breakdown meters.',
      '5. Deploy using Docker onto Render or AWS ECS.'
    ]
  },
  {
    id: 'proj-4',
    title: 'Automated CI/CD GitOps Pipeline with ArgoCD',
    targetRoles: ['DevOps & Site Reliability Engineer (SRE)', 'Cloud Infrastructure Engineer'],
    difficulty: 'Advanced',
    technologies: ['GitHub Actions', 'Docker', 'Kubernetes', 'ArgoCD', 'Helm', 'Linux'],
    skillsGained: ['GitOps Workflows', 'Helm Chart Packaging', 'CI/CD Automation', 'Zero-Downtime Rollouts'],
    shortDescription: 'Create an end-to-end GitOps deployment pipeline that automatically packages, lints, and synchronizes container apps.',
    relevanceReason: 'Proves practical mastery of modern automated deployment workflows and Kubernetes application lifecycles.',
    architectureOutline: 'Code Push → GitHub Actions Build & Scan → Docker Hub Registry → ArgoCD Controller → Kubernetes Production Cluster',
    stepGuide: [
      '1. Create multi-environment Kubernetes manifests structured with Helm charts.',
      '2. Configure GitHub Actions workflow for linting, security scanning (Trivy), and Docker image pushing.',
      '3. Set up ArgoCD in a local Minikube or cloud cluster to track the git repository.',
      '4. Implement automated blue-green or canary release strategies.',
      '5. Test automated self-healing when cluster state drifts from Git.'
    ]
  },
  {
    id: 'proj-5',
    title: 'Interactive Executive BI Sales & Customer Dashboard',
    targetRoles: ['Data Analyst / BI Specialist'],
    difficulty: 'Beginner',
    technologies: ['SQL', 'PostgreSQL', 'Python', 'Pandas', 'Tableau', 'Power BI'],
    skillsGained: ['Complex SQL Queries', 'Cohort Analysis', 'Data Cleaning with Pandas', 'Interactive Dashboarding'],
    shortDescription: 'Build an executive-ready analytics dashboard tracking customer retention cohorts, revenue churn, and regional sales.',
    relevanceReason: 'Demonstrates SQL data modeling, exploratory data analysis, and compelling visual data storytelling.',
    architectureOutline: 'Raw E-Commerce CSVs → Python Data Cleansing & ETL → PostgreSQL Analytics Warehouse → Tableau / Power BI Dashboard',
    stepGuide: [
      '1. Ingest raw transactional data and perform missing-value handling with Python Pandas.',
      '2. Write advanced SQL queries with Window Functions (RANK, LAG, LEAD, CTEs) for cohort analysis.',
      '3. Model fact and dimension star-schema tables in PostgreSQL.',
      '4. Design interactive Tableau/Power BI dashboards with drill-downs and dynamic filters.',
      '5. Publish dashboard summary report with key business recommendations.'
    ]
  },
  {
    id: 'proj-6',
    title: 'Accessible Component Library & Design System in React',
    targetRoles: ['Frontend Engineer (Design Systems)', 'Full Stack React & Node Developer'],
    difficulty: 'Intermediate',
    technologies: ['React', 'TypeScript', 'TailwindCSS', 'Storybook', 'Jest'],
    skillsGained: ['Design System Architecture', 'WCAG 2.1 Accessibility', 'Storybook Documentation', 'TypeScript Types'],
    shortDescription: 'Create a reusable, accessible, theme-ready component library featuring buttons, modals, dropdowns, and inputs.',
    relevanceReason: 'Shows frontend craftsmanship, strict TypeScript typing, accessibility compliance, and design-to-code skills.',
    architectureOutline: 'React UI Component Code → Storybook Interactive Docs → Automated Accessibility (Axe) Tests → NPM Package Bundle',
    stepGuide: [
      '1. Configure TypeScript + Vite monorepo with Storybook for isolated component development.',
      '2. Build core primitives: Button, Modal, Tooltip, Input, Select, and Badge with ARIA attributes.',
      '3. Add keyboard navigation and screen reader support satisfying WCAG 2.1 AA.',
      '4. Implement light/dark theme CSS variables and tokens.',
      '5. Publish Storybook documentation online with live interactive component playground.'
    ]
  }
];

export const SKILL_TAXONOMY = {
  'Cloud & DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux', 'Bash', 'Ansible', 'Prometheus', 'Grafana', 'Git', 'GitHub', 'GitLab', 'DevOps', 'Microservices', 'Helm', 'ArgoCD'],
  'Frontend Development': ['React', 'Next.js', 'JavaScript', 'TypeScript', 'HTML', 'HTML5', 'CSS', 'CSS3', 'TailwindCSS', 'Bootstrap', 'Vue', 'Angular', 'Redux', 'Figma', 'UI/UX', 'Jest', 'Cypress', 'Vite'],
  'Backend & Databases': ['Node.js', 'Express', 'Python', 'Java', 'Spring Boot', 'Django', 'Flask', 'FastAPI', 'C#', '.NET', 'Go', 'PHP', 'Ruby', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API', 'Prisma'],
  'Data Science & AI': ['Machine Learning', 'Deep Learning', 'AI', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy', 'Data Analysis', 'Tableau', 'Power BI', 'Hadoop', 'Spark', 'NLP', 'Computer Vision'],
  'Core Competencies & Soft Skills': ['System Design', 'Agile', 'Scrum', 'Jira', 'Problem Solving', 'Communication', 'Teamwork', 'Leadership', 'Project Management', 'Code Reviewing', 'Unit Testing']
};

export const SAMPLE_RESUMES = {
  cloudEngineer: {
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    title: 'Cloud Infrastructure & DevOps Engineer',
    summary: 'Proactive Cloud Engineer with 3+ years of experience automating AWS cloud infrastructure, containerized deployments with Docker, and maintaining high availability Linux systems. Passionate about IaC and CI/CD pipelines.',
    skills: ['AWS', 'Docker', 'Linux', 'CI/CD', 'Git', 'Python', 'Bash', 'REST API', 'MySQL', 'Agile', 'Problem Solving'],
    experience: [
      {
        title: 'Cloud Systems Specialist',
        company: 'Skyline Cloud Services',
        location: 'San Francisco, CA',
        startDate: '2023',
        endDate: 'Present',
        description: 'Managed AWS infrastructure across 15+ microservices. Configured Docker container images and streamlined CI/CD deployment pipelines using GitHub Actions, reducing deployment cycle times by 40%.'
      },
      {
        title: 'Junior DevOps Engineer',
        company: 'DataFlow Inc',
        location: 'San Jose, CA',
        startDate: '2021',
        endDate: '2023',
        description: 'Maintained production Linux servers, automated daily bash backup routines, and assisted in cloud migration projects on AWS EC2 and S3.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'California State University',
        location: 'San Jose, CA',
        year: '2021',
        gpa: '3.8/4.0'
      }
    ],
    projects: [
      {
        name: 'Automated Multi-Region Cloud Backup',
        technologies: 'AWS S3, Python, Bash, GitHub Actions',
        description: 'Engineered a serverless backup system that replicates operational logs and database snapshots to secondary AWS regions.'
      },
      {
        name: 'Dockerized Microservices Playground',
        technologies: 'Docker, Node.js, Express, MySQL',
        description: 'Created containerized multi-tier web application with automated health checks and compose orchestration.'
      }
    ],
    certifications: ['AWS Certified Solutions Architect – Associate (2023)', 'HashiCorp Terraform Associate (In Progress)'],
    languages: ['English (Fluent)', 'Spanish (Conversational)'],
    achievements: ['Reduced monthly AWS cloud compute expenditure by 22% through automated instance rightsizing.']
  },
  fullStackDev: {
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    phone: '+1 (555) 876-5432',
    location: 'Seattle, WA',
    title: 'Full Stack React & Node.js Developer',
    summary: 'Full Stack Software Engineer with 2.5 years of experience building modern web applications with React, TypeScript, Node.js, and PostgreSQL. Experienced in responsive UI/UX and REST API engineering.',
    skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'HTML5', 'CSS3', 'TailwindCSS', 'Git', 'REST API', 'Jest'],
    experience: [
      {
        title: 'Full Stack Web Developer',
        company: 'Veloce Digital',
        location: 'Seattle, WA',
        startDate: '2022',
        endDate: 'Present',
        description: 'Built interactive customer-facing portals in React and TypeScript. Developed backend REST APIs with Express and PostgreSQL, improving query response latency by 35%.'
      }
    ],
    education: [
      {
        degree: 'B.S. in Software Engineering',
        institution: 'University of Washington',
        location: 'Seattle, WA',
        year: '2022',
        gpa: '3.7/4.0'
      }
    ],
    projects: [
      {
        name: 'Real-Time Team Collaboration Canvas',
        technologies: 'React, Node.js, Socket.io, PostgreSQL',
        description: 'Built real-time collaborative workspace supporting live cursor synchronization and instant markdown notes.'
      }
    ],
    certifications: ['Meta Certified Front-End Developer', 'PostgreSQL Certified Associate'],
    languages: ['English (Native)', 'Mandarin (Fluent)'],
    achievements: ['Led redesign of company core onboarding flow resulting in 18% increase in activation.']
  }
};
