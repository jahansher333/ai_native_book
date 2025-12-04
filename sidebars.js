/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Main book sidebar
  bookSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Module 1: ROS 2 Nervous System',
      link: {
        type: 'doc',
        id: 'module-1/index',
      },
      items: [
        'module-1/ros2-fundamentals',
        'module-1/urdf-basics',
        'module-1/nodes-services',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Digital Twin',
      link: {
        type: 'doc',
        id: 'module-2/index',
      },
      items: [
        'module-2/gazebo-simulation',
        'module-2/unity-integration',
        'module-2/sensors-modeling',
        'module-2/environment-building',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: Isaac AI',
      link: {
        type: 'doc',
        id: 'module-3/index',
      },
      items: [
        'module-3/isaac-sim',
        'module-3/isaac-ros',
        'module-3/perception',
        'module-3/navigation',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: VLA & Capstone',
      link: {
        type: 'doc',
        id: 'module-4/index',
      },
      items: [
        'module-4/vla-overview',
        'module-4/llm-integration',
        'module-4/voice-commands',
        'module-4/slam',
        'module-4/manipulation',
        'module-4/capstone-project',
      ],
    },
    {
      type: 'doc',
      id: 'roadmap',
      label: 'Course Roadmap',
    },
    {
      type: 'category',
      label: 'Appendix',
      link: {
        type: 'doc',
        id: 'appendix/index',
      },
      items: [
        'appendix/hardware-requirements',
        'appendix/workstation-specs',
        'appendix/edge-device-kit',
        'appendix/robot-lab-options',
        'appendix/lab-architecture',
      ],
    },
    {
      type: 'doc',
      id: 'glossary',
      label: 'Glossary',
    },
  ],
};

module.exports = sidebars;
