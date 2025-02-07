import styles from "./MainSection.module.scss";
import FeaturePage from "@pages/FeaturePage";
import SigninPage from "@pages/SigninPage";
import ProjectCardsPage from "@pages/ProjectCardsPage";
import ProjectFormPage from "@pages/ProjectFormPage";
import ProjectPage from "@pages/ProjectPage";
import Spinner from "@comp/Spinner";
import Dashboard from "@pages/Dashboard";
import TaskPage from "../pages/TaskPage";
import NotificationPage from "../pages/NotificationPage";
import ConversationPage from "../pages/ConversationPage";

const MainSection = ({
  spin = false,
  homepage,
  authPage = false,
  projectsCardPage = false,
  createProject = false,
  projectPage = false,
  taskPage = false,
  notificationPage = false,
  conversationPage = false,
}) => {
  return (
    <div
      className={`${styles.container} ${projectsCardPage && styles.project}`}
    >
      {authPage && <SigninPage />}
      {homepage === "feature" && <FeaturePage />}
      {homepage === "dashboard" && <Dashboard />}
      {spin && <Spinner />}
      {projectsCardPage && <ProjectCardsPage />}
      {projectPage && <ProjectPage />}
      {createProject && <ProjectFormPage />}
      {taskPage && <TaskPage />}
      {notificationPage && <NotificationPage />}
      {conversationPage && <ConversationPage />}
    </div>
  );
};

export default MainSection;
