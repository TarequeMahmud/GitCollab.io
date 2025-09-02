import Image, { StaticImageData } from "next/image";
import React from "react";

interface CardFeaturesProps {
  info: string;
  icon: StaticImageData;
}

const CardFeatures: React.FC<CardFeaturesProps> = ({ info, icon }) => {
  return (
    <div className="w-full flex items-center">
      <Image className="h-8 w-8 mr-2" src={icon} alt="icon" />
      <p className="text-sm font-bold">{info}</p>
    </div>
  );
};

export default CardFeatures;
