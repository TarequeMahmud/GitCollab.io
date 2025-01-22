import cardIcons from "@datas/cardFeatures";
const formatDate = (deadline) => {
  const date = new Date(deadline);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};
const generateFeatures = (data) => {
  const features = [
    {
      icon: cardIcons.admin,
      info: data.people.find((person) => person.role === "Admin")?.name,
    },
    {
      icon: cardIcons.total,
      info: `${data.people.length} total people`,
    },
    {
      icon: cardIcons.deadline,
      info: `Deadline: ${formatDate(data.deadline)}`,
    },
    {
      icon: cardIcons.percentage,
      info: "5/10 tasks completed",
    },
    {
      icon: cardIcons.user,
      info: "Member",
    },
    {
      icon: cardIcons.start,
      info: `Created at ${formatDate(data.createdAt)}`,
    },
  ];
  return features;
};

export default generateFeatures;
