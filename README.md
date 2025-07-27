# Suman Samanta - Personal Portfolio

This is a dynamic and interactive personal portfolio website showcasing skills, projects, education, and experience. Built with modern web technologies, it features engaging animations and a responsive design to provide an optimal viewing experience across various devices.

## ✨ Features

  * **Interactive Hero Section:** Engaging introduction with custom animations and magnetic cursor effects.
  * **About Me:** Detailed section about professional background and contact information.
  * **Education Showcase:** Highlights academic journey and achievements.
  * **Skills & Technologies:** Categorized display of technical proficiencies with visual progress indicators.
  * **Experience Overview:** Details professional training and relevant work experience.
  * **Dynamic Projects Section:** Showcases diverse projects with descriptions, technologies used, and live links, featuring 3D tilt card effects on hover.
  * **Responsive Design:** Adapts seamlessly to desktop, tablet, and mobile screens.
  * **Themable UI:** Supports light and dark modes (managed by `next-themes`).
  * **Optimized Performance:** Utilizes Next.js features for efficient rendering and asset loading.
  * **Physics-Based Animations:** Subtle floating particles and geometric shape animations for an enhanced visual experience.

## 🚀 Technologies Used

  * **Framework:** Next.js
  * **UI Library:** React.js
  * **Language:** TypeScript
  * **Styling:** Tailwind CSS
  * **Animations:** Framer Motion
  * **UI Components:** Radix UI (via Shadcn UI components)
  * **Icons:** Lucide React
  * **Deployment (Implied):** Vercel (common for Next.js projects, indicated by `.vercel` in `.gitignore`)

## 🛠️ Setup and Running Locally

Follow these steps to get a local copy of the project up and running on your machine.

### Prerequisites

  * Node.js (version 18.18.0 or higher, as per `package.json` engines and Next.js requirements)
  * npm or Yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/sumansamanta1746/MyPortfolio.git
    cd MyPortfolio/My-portfolio
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Development Server

To run the application in development mode:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser to see the result.

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

### Starting the Production Server

To start the built application in production mode:

```bash
npm run start
# or
yarn start
```

## 📂 Project Structure

```
My-portfolio/
├── app/
│   ├── globals.css           # Global CSS styles and Tailwind imports
│   ├── layout.tsx            # Root layout for the Next.js application
│   └── page.tsx              # Main portfolio page content and components
├── components/
│   ├── ui/                   # Reusable UI components (e.g., button, card, dialog, etc.)
│   └── theme-provider.tsx    # Theme provider for light/dark mode
├── hooks/                    # Custom React hooks (e.g., use-mobile, use-toast)
├── lib/
│   └── utils.ts              # Utility functions (e.g., `cn` for Tailwind class merging)
├── public/                   # Static assets (images, logos, etc.)
├── .gitignore                # Files and directories to be ignored by Git
├── next.config.mjs           # Next.js configuration
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Dependency tree lock file
├── postcss.config.mjs        # PostCSS configuration for Tailwind CSS
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## 👤 Author

**Suman Samanta**

  * **Email:** sumansamanta1746@gmail.com
  * **GitHub:** [https://github.com/sumansamanta1746](https://github.com/sumansamanta1746)
  * **LinkedIn:** [https://www.linkedin.com/in/sumansamanta-85a778327](https://www.linkedin.com/in/sumansamanta-85a778327)
