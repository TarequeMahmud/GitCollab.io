import cardIcons from "@datas/cardFeatures";
import formatDate from "./formatDate";
const generateFeatures = (data) => {
  const features = [
    {
      icon: cardIcons.admin,
      info: data.people.find((person) => person.role === "admin")?.name,
    },
    {
      icon: cardIcons.total,
      info: `${data.people.length} Colaborator\/s`,
    },
    {
      icon: cardIcons.start,
      info: formatDate(data.createdAt),
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
