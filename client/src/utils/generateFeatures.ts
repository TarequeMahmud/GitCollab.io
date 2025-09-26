import cardIcons from "@/assets/data/cardFeatures";
import formatDate from "./formatDate";

const generateFeatures = (data: Project): Feature[] => {
  const admin = data.contributors.find((person) => person.role === "admin");

  const features: Feature[] = [
    {
      icon: cardIcons.admin,
      info: admin ? admin.username : "No Admin",
    },
    {
      icon: cardIcons.total,
      info: `${data.contributors.length} Collaborator/s`,
    },
    {
      icon: cardIcons.start,
      info: formatDate(data.created_at),
    },
    {
      icon: cardIcons.deadline,
      info: formatDate(data.deadline),
    },
    {
      icon: cardIcons.percent,
      info: "5/10 completed",
    },
    {
      icon: cardIcons.user,
      info: "Member",
    },
  ];

  return features;
};

export default generateFeatures;
