import admin from "../icons/card-features/admin.png";
import deadline from "../icons/card-features/deadline.png";
import management from "../icons/card-features/management.png";
import percent from "../icons/card-features/percent.png";
import total from "../icons/card-features/total.png";
import user from "../icons/card-features/user.png";
import start from "../icons/card-features/start.png";
import { StaticImageData } from "next/image";

type CardIcons = {
  admin: StaticImageData;
  deadline: StaticImageData;
  management: StaticImageData;
  percent: StaticImageData;
  total: StaticImageData;
  user: StaticImageData;
  start: StaticImageData;
};

const cardIcons: CardIcons = {
  admin,
  deadline,
  management,
  percent,
  total,
  user,
  start,
};

export default cardIcons;
