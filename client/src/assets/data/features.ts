import projectManagement from "../icons/features/project-management.png";
import realTime from "../icons/features/real-time.png";
import taskTracking from "../icons/features/task-tracking.png";
import roleAccess from "../icons/features/access-control.png";
import { StaticImageData } from "next/image";

type Feature = {
  title: string;
  description: string;
  icon: StaticImageData;
};

const features: Feature[] = [
  {
    title: "Easy Project Management",
    description:
      "Create and manage projects effortlessly, assign roles, and set deadlines with a user-friendly interface.",
    icon: projectManagement,
  },
  {
    title: "Real-Time Collaboration",
    description:
      "Stay connected with your team through real-time task updates, notifications, and comments.",
    icon: realTime,
  },
  {
    title: "Streamlined Task Tracking",
    description:
      "Track your progress with intuitive dashboards and task management tools.",
    icon: taskTracking,
  },
  {
    title: "Role-Based Access",
    description:
      "Ensure smooth workflows with clearly defined roles: Admins, Managers, and Members.",
    icon: roleAccess,
  },
];

export default features;
