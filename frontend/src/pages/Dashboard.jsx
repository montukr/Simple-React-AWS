import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

/** 
 * Each item: { title, desc, docs, videoShort, videoLong }
 * desc = 2–3 line real explanation
 * videoShort = quick 5–12 min
 * videoLong  = deep dive 40–90+ min
 */
const sections = [
  {
    id: "getting-started",
    icon: "🌤️",
    title: "Getting Started",
    items: [
      {
        title: "Cloud Computing Basics (IaaS / PaaS / SaaS)",
        desc:
          "Understand the shared model: providers deliver compute, storage, and platforms over the internet. IaaS offers raw building blocks (VMs, networks), PaaS manages runtime, and SaaS ships complete apps.",
        docs: "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html",
        videoShort: "https://www.youtube.com/watch?v=MXx8pK5iS3Q", // Fireship cloud in 100s style alt
        videoLong: "https://www.youtube.com/watch?v=3hLmDS179YE", // FCC cloud overview
      },
      {
        title: "AWS Global Infrastructure: Regions & AZs",
        desc:
          "AWS spans Regions (geographic) and Availability Zones (isolated data centers) to achieve low latency and high availability. Architect across AZs to tolerate failures.",
        docs: "https://aws.amazon.com/about-aws/global-infrastructure/",
        videoShort: "https://www.youtube.com/watch?v=rQGQdB5a6bE",
        videoLong: "https://www.youtube.com/watch?v=O3xwKJdG1D8",
      },
      {
        title: "Identity & Access Management (IAM) + MFA",
        desc:
          "Use IAM users/roles/policies to grant least-privilege access. Prefer roles over long-lived keys. Enforce MFA, rotate credentials, and use policy conditions.",
        docs: "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html",
        videoShort: "https://www.youtube.com/watch?v=ulprqHHWlng", // Nana IAM
        videoLong: "https://www.youtube.com/watch?v=tQp_2rkZ9fY",
      },
      {
        title: "AWS CLI & SDK",
        desc:
          "Automate and script AWS using the CLI and SDKs. Configure profiles, use least-privilege credentials, and prefer roles on EC2/Lambda for temporary creds.",
        docs: "https://docs.aws.amazon.com/cli/latest/userguide/",
        videoShort: "https://www.youtube.com/watch?v=KngM5bfpttA",
        videoLong: "https://www.youtube.com/watch?v=7xngnjfIlK4",
      },
    ],
  },

  {
    id: "compute",
    icon: "⚙️",
    title: "Compute",
    items: [
      {
        title: "Amazon EC2 (instances, AMIs, key pairs)",
        desc:
          "On-demand virtual machines. Choose instance family (general, compute, memory, GPU), AMI, storage, and networking. Scale with Auto Scaling and balance with ALB/NLB.",
        docs: "https://docs.aws.amazon.com/ec2/",
        videoShort: "https://www.youtube.com/watch?v=Uu2U4Nf1G1k",
        videoLong: "https://www.youtube.com/watch?v=lZMkgOMYYIg", // FCC EC2 full
      },
      {
        title: "Load Balancing (ALB/NLB) & Auto Scaling",
        desc:
          "Distribute traffic across healthy targets and scale instances to meet demand. ALB for HTTP/HTTPS (Layer 7), NLB for ultra-high performance TCP/UDP.",
        docs: "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-elastic-load-balancing.html",
        videoShort: "https://www.youtube.com/watch?v=3vQ2_F7hG4E",
        videoLong: "https://www.youtube.com/watch?v=2K8s9VKP6Dk",
      },
      {
        title: "AWS Lambda (serverless)",
        desc:
          "Run code without managing servers. Billed per requests and execution time. Integrates with API Gateway, S3, EventBridge, DynamoDB streams, and more.",
        docs: "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html",
        videoShort: "https://www.youtube.com/watch?v=eOBq__h4OJ4",
        videoLong: "https://www.youtube.com/watch?v=37jXT2yZ9Rw",
      },
      {
        title: "Elastic Beanstalk (managed app deploy)",
        desc:
          "Deploy web apps with managed EC2, scaling, load balancing, and health monitoring. Good for quick starts; you can eject to raw AWS services later.",
        docs: "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html",
        videoShort: "https://www.youtube.com/watch?v=R3cF3GO6H8k",
        videoLong: "https://www.youtube.com/watch?v=8vZqfU0b2UY",
      },
      {
        title: "Containers: ECS / Fargate / EKS",
        desc:
          "Orchestrate containers with ECS or EKS. Fargate runs containers without servers. EKS is managed Kubernetes for portable workloads.",
        docs: "https://docs.aws.amazon.com/whitepapers/latest/overview-deployment-options/containers.html",
        videoShort: "https://www.youtube.com/watch?v=1oXqF2P8y0w",
        videoLong: "https://www.youtube.com/watch?v=OFeoR4H1N6g",
      },
    ],
  },

  {
    id: "storage",
    icon: "💾",
    title: "Storage",
    items: [
      {
        title: "Amazon S3 (buckets, versioning, lifecycle)",
        desc:
          "Highly durable object storage (11 9s). Use versioning, lifecycle rules, and replication. Great for static assets, backups, data lakes, and websites.",
        docs: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html",
        videoShort: "https://www.youtube.com/watch?v=77lMCiiMilo",
        videoLong: "https://www.youtube.com/watch?v=KXj5z7B3R9A",
      },
      {
        title: "EBS vs EFS vs FSx",
        desc:
          "Choose EBS for block storage attached to EC2, EFS for shared POSIX file storage, and FSx for high-performance managed file systems (Windows/Lustre/OpenZFS).",
        docs: "https://docs.aws.amazon.com/whitepapers/latest/storage-options/object-block-file-storage.html",
        videoShort: "https://www.youtube.com/watch?v=QhPqA8-YdGg",
        videoLong: "https://www.youtube.com/watch?v=7GOsm4rB2L8",
      },
      {
        title: "S3 Static Website + CloudFront CDN",
        desc:
          "Host static websites on S3 and accelerate globally with CloudFront. Add HTTPS via ACM (cert) on CloudFront. Use OAC for private S3 origins.",
        docs: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html",
        videoShort: "https://www.youtube.com/watch?v=tbKRRQ-0F1o",
        videoLong: "https://www.youtube.com/watch?v=PxG0L7C05H0",
      },
    ],
  },

  {
    id: "databases",
    icon: "🗄️",
    title: "Databases",
    items: [
      {
        title: "Amazon RDS (MySQL/Postgres), Backups & Multi-AZ",
        desc:
          "Managed relational databases with automated backups, patching, and Multi-AZ high availability. Scale reads with replicas; use parameter groups for tuning.",
        docs: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html",
        videoShort: "https://www.youtube.com/watch?v=NQ9B4qM8jPU",
        videoLong: "https://www.youtube.com/watch?v=qfyynHBFOsM",
      },
      {
        title: "Aurora vs RDS",
        desc:
          "Aurora is a cloud-native engine with distributed storage for high performance and fast failover. Use when you need higher throughput and lower failover times.",
        docs: "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html",
        videoShort: "https://www.youtube.com/watch?v=_0b1JYBf8KQ",
        videoLong: "https://www.youtube.com/watch?v=8aGhZQkoFbQ",
      },
      {
        title: "DynamoDB (NoSQL) + DAX",
        desc:
          "Serverless key-value database with single-digit ms latency at scale. Design with access patterns, use GSI/LSI, on-demand or provisioned capacity, and DAX caching.",
        docs: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html",
        videoShort: "https://www.youtube.com/watch?v=HaEPXoXVf2k",
        videoLong: "https://www.youtube.com/watch?v=U7j4wS1d5Vw",
      },
      {
        title: "ElastiCache (Redis/Memcached)",
        desc:
          "In-memory caching to offload reads and speed up apps. Redis for rich data types and persistence; Memcached for simple key/value ephemeral caches.",
        docs: "https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html",
        videoShort: "https://www.youtube.com/watch?v=1xW8QxZ3b0M",
        videoLong: "https://www.youtube.com/watch?v=Yb1lZkNnW2U",
      },
    ],
  },

  {
    id: "networking",
    icon: "🌐",
    title: "Networking",
    items: [
      {
        title: "Amazon VPC (subnets, routes, NAT, IGW)",
        desc:
          "Isolated networking for your workloads. Public subnets for internet-facing resources; private subnets for internal services. Use NAT for egress and route tables for traffic flow.",
        docs: "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html",
        videoShort: "https://www.youtube.com/watch?v=g2JOHLHhZ3w",
        videoLong: "https://www.youtube.com/watch?v=5twN8Zx4p0s",
      },
      {
        title: "Security Groups vs NACLs",
        desc:
          "Security Groups are stateful instance-level firewalls; NACLs are stateless subnet-level filters. Start with SGs; add NACLs for broad deny/allow nets.",
        docs: "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html",
        videoShort: "https://www.youtube.com/watch?v=c4Q9H1m6H8k",
        videoLong: "https://www.youtube.com/watch?v=E4a7D0Z0m8w",
      },
      {
        title: "Route 53 & CloudFront",
        desc:
          "Route 53 provides global DNS with latency/geoproximity routing. CloudFront is a CDN that caches and protects content. Combine with S3 or ALB for performance.",
        docs: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html",
        videoShort: "https://www.youtube.com/watch?v=0UqfVq0t7SM",
        videoLong: "https://www.youtube.com/watch?v=2f7QfUuFjzQ",
      },
      {
        title: "API Gateway (REST/HTTP/WebSocket)",
        desc:
          "Fully managed front door for serverless or microservices. Add auth with Cognito or Lambda authorizers; integrate with Lambda or HTTP backends.",
        docs: "https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html",
        videoShort: "https://www.youtube.com/watch?v=H3zZ6qZp6hU",
        videoLong: "https://www.youtube.com/watch?v=CwL7X1Z5z1w",
      },
    ],
  },

  {
    id: "security",
    icon: "🔒",
    title: "Security & Compliance",
    items: [
      {
        title: "Shared Responsibility Model",
        desc:
          "AWS secures the cloud; you secure what you run in the cloud. Configure IAM, networks, OS hardening, and app security; AWS handles the physical and managed layers.",
        docs: "https://aws.amazon.com/compliance/shared-responsibility-model/",
        videoShort: "https://www.youtube.com/watch?v=vl2Zg5Y6E1o",
        videoLong: "https://www.youtube.com/watch?v=FZ1wCqQnTqA",
      },
      {
        title: "KMS & Envelope Encryption",
        desc:
          "Manage encryption keys centrally. Use envelope encryption (data keys encrypted by CMKs). Control key access with key policies and grants.",
        docs: "https://docs.aws.amazon.com/kms/latest/developerguide/overview.html",
        videoShort: "https://www.youtube.com/watch?v=Jk8f9pJv8uw",
        videoLong: "https://www.youtube.com/watch?v=2U9bG6p6o8E",
      },
      {
        title: "Secrets Manager vs Parameter Store",
        desc:
          "Store secrets and configs centrally. Secrets Manager rotates credentials; Parameter Store is great for app configs, both integrate with IAM for fine-grained access.",
        docs: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html",
        videoShort: "https://www.youtube.com/watch?v=1r9qW8C0C0M",
        videoLong: "https://www.youtube.com/watch?v=1k6Xo3G1VQY",
      },
      {
        title: "GuardDuty, Inspector, WAF & Shield",
        desc:
          "Detect threats, scan for vulnerabilities, and protect apps. Use WAF for layer-7 rules and Shield for DDoS mitigation on CloudFront/ALB.",
        docs: "https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html",
        videoShort: "https://www.youtube.com/watch?v=2C3X-9n4w7I",
        videoLong: "https://www.youtube.com/watch?v=tBo3aNnLxQQ",
      },
    ],
  },

  {
    id: "devops",
    icon: "🛠️",
    title: "DevOps & IaC",
    items: [
      {
        title: "CloudFormation (stacks, drift, change sets)",
        desc:
          "Model AWS resources as code for repeatable environments. Use change sets to preview diffs and drift detection to spot out-of-band changes.",
        docs: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html",
        videoShort: "https://www.youtube.com/watch?v=3sz3Jb8QHfU",
        videoLong: "https://www.youtube.com/watch?v=FYvQn0MNiKs",
      },
      {
        title: "CDK (TypeScript/Python IaC)",
        desc:
          "Define infrastructure in real languages with high-level constructs. Synthesize to CloudFormation templates and deploy through pipelines.",
        docs: "https://docs.aws.amazon.com/cdk/latest/guide/home.html",
        videoShort: "https://www.youtube.com/watch?v=ZWCvNFUN-sU",
        videoLong: "https://www.youtube.com/watch?v=2Wb1VQx7GoU",
      },
      {
        title: "CodeCommit / CodeBuild / CodeDeploy / CodePipeline",
        desc:
          "Full CI/CD on AWS. Build artifacts, run tests, deploy to EC2/Lambda/ECS. Combine with GitHub or CodeCommit as source.",
        docs: "https://aws.amazon.com/devops/continuous-delivery/",
        videoShort: "https://www.youtube.com/watch?v=4wY8bmfQdX0",
        videoLong: "https://www.youtube.com/watch?v=1cTT0U3V7bU",
      },
      {
        title: "CloudWatch & EventBridge",
        desc:
          "Central monitoring with metrics/logs/alarms/dashboards. EventBridge routes events between services to build decoupled systems.",
        docs: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html",
        videoShort: "https://www.youtube.com/watch?v=GTvL6MCMs6I",
        videoLong: "https://www.youtube.com/watch?v=hX7pI2bZr5E",
      },
    ],
  },

  {
    id: "ai-ml",
    icon: "🧠",
    title: "AI/ML Services",
    items: [
      {
        title: "SageMaker (training, inference, MLOps)",
        desc:
          "End-to-end ML platform: notebooks, training jobs, model registry, and real-time/batch endpoints. Integrate with S3, ECR, and pipelines.",
        docs: "https://docs.aws.amazon.com/sagemaker/latest/dg/whatis.html",
        videoShort: "https://www.youtube.com/watch?v=YkZx2drYyJw",
        videoLong: "https://www.youtube.com/watch?v=2yQ0xO0jVg8",
      },
      {
        title: "Rekognition / Comprehend / Textract",
        desc:
          "Pretrained APIs for vision, NLP, and OCR. Ideal for quick wins: content moderation, entity extraction, document parsing.",
        docs: "https://docs.aws.amazon.com/rekognition/latest/dg/what-is.html",
        videoShort: "https://www.youtube.com/watch?v=7C4V2Y2Q9tY",
        videoLong: "https://www.youtube.com/watch?v=CiZ9lEi5w9o",
      },
      {
        title: "Amazon Bedrock (foundation models)",
        desc:
          "Access leading FMs (Anthropic, Amazon, Meta, etc.) via managed APIs. Add guardrails, RAG, and evals for production GenAI apps.",
        docs: "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html",
        videoShort: "https://www.youtube.com/watch?v=r9hZQvNLXy4",
        videoLong: "https://www.youtube.com/watch?v=d1oJ6m0vTnU",
      },
    ],
  },

  {
    id: "cost",
    icon: "💰",
    title: "Cost Optimization",
    items: [
      {
        title: "Billing, Cost Explorer & Budgets",
        desc:
          "Track spend, set budget alerts, and analyze cost drivers. Use tags and Cost Allocation to see who/what is spending.",
        docs: "https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-explorer-what-is.html",
        videoShort: "https://www.youtube.com/watch?v=JfSmX0QyRtw",
        videoLong: "https://www.youtube.com/watch?v=N9cIoGJY1qU",
      },
      {
        title: "Rightsizing & Storage Lifecycle",
        desc:
          "Match instance size to real utilization and move cold data to lower-cost S3 classes (IA, Glacier). Monitor with CloudWatch.",
        docs: "https://docs.aws.amazon.com/whitepapers/latest/cost-optimization-lens/welcome.html",
        videoShort: "https://www.youtube.com/watch?v=6B1uwt9q7rM",
        videoLong: "https://www.youtube.com/watch?v=1Wj3w_2H2VU",
      },
      {
        title: "RI & Savings Plans Strategies",
        desc:
          "Commit to 1–3 years of compute to save 30–70%. Mix upfront/no-upfront and diversify by family/region for flexibility.",
        docs: "https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html",
        videoShort: "https://www.youtube.com/watch?v=h5U4_Hqiz7Q",
        videoLong: "https://www.youtube.com/watch?v=BRfWl8oHrNE",
      },
    ],
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeId, setActiveId] = useState(sections[0].id);
  const [theme, setTheme] = useState("light");
  const expanded = useRef(new Set()); // expanded items
  const overlayRef = useRef(null);
  const sideRef = useRef(null);

  // Require auth (user in localStorage)
  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) navigate("/");
  }, [navigate]);

  // Theme (manual toggle, persisted)
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const initial = saved || "light";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  // Active section highlight while scrolling
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top?.target?.id) setActiveId(top.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75] }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Sidebar outside click & ESC close (mobile)
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape" && window.innerWidth < 900) setSidebarOpen(false);
    };
    const onClickOutside = (e) => {
      if (window.innerWidth >= 900) return;
      const side = sideRef.current;
      const overlay = overlayRef.current;
      if (!side) return;
      if (overlay && e.target === overlay) setSidebarOpen(false);
      else if (!side.contains(e.target)) setSidebarOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    document.addEventListener("click", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.removeEventListener("click", onClickOutside);
    };
  }, []);

  // Auto-expand first item of every section (elegant preview)
  useEffect(() => {
    sections.forEach((s) => expanded.current.add(`${s.id}::0`));
    force();
  }, []);
  const [, setTick] = useState(0);
  const force = () => setTick((v) => v + 1);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.innerWidth < 900) setSidebarOpen(false); // close drawer on mobile
  };

  const toggleItem = (key) => {
    const set = expanded.current;
    if (set.has(key)) set.delete(key);
    else set.add(key);
    force();
  };

  // Render
  return (
    <div className="dash grid">
      {/* Overlay for mobile drawer */}
      <div
        ref={overlayRef}
        className={`overlay ${sidebarOpen ? "show" : ""}`}
        aria-hidden={!sidebarOpen}
      />

      {/* Sidebar */}
      <aside
        ref={sideRef}
        className={`side ${sidebarOpen ? "open" : ""}`}
        aria-label="Sidebar navigation"
      >
        <div className="side-head">
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
            <span className="brand">AWS Learning</span>
          <button
            className="theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

        <nav className="side-nav">
          {sections.map((s) => (
            <button
              key={s.id}
              className={`nav-link ${activeId === s.id ? "active" : ""}`}
              onClick={() => scrollTo(s.id)}
            >
              <span className="nav-ic">{s.icon}</span>
              <span className="nav-txt">{s.title}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="main">
        <div className="hero">
          <button
            className="menu-btn mobile-only"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <div>
            <h2 className="hero-title">Your AWS Roadmap</h2>
            <p className="muted">
              Clean, focused, and up to date — expand any item to open official docs or a tutorial.
            </p>
          </div>
        </div>

        <div className="content">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="section">
              <h3 className="section-title">
                <span className="section-ic">{s.icon}</span>
                {s.title}
              </h3>

              <ul className="exp-list">
                {s.items.map((it, idx) => {
                  const key = `${s.id}::${idx}`;
                  const open = expanded.current.has(key);
                  return (
                    <li key={key} className={`exp-item ${open ? "open" : ""}`}>
                      <button
                        className="exp-toggle"
                        onClick={() => toggleItem(key)}
                        aria-expanded={open}
                        aria-controls={`panel-${key}`}
                        title="Show resources"
                      >
                        <span className="chev">{open ? "▾" : "▸"}</span>
                        <span className="exp-text">{it.title}</span>
                      </button>

                      <div
                        id={`panel-${key}`}
                        className="exp-panel"
                        style={{ display: open ? "block" : "none" }}
                      >
                        <p className="exp-desc">{it.desc}</p>
                        <div className="links">
                          <a href={it.docs} className="link" target="_blank" rel="noreferrer">
                            🔗 Official Docs
                          </a>
                          <a href={it.videoShort} className="link" target="_blank" rel="noreferrer">
                            🎥 Quick Video
                          </a>
                          <a href={it.videoLong} className="link" target="_blank" rel="noreferrer">
                            📺 Deep Dive
                          </a>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
