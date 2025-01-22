const CardFeatures = ({ info, icon }) => {
  return (
    <div className="feature-holder">
      <img height={50} width={50} src={icon} alt="a" />
      <p>{info}</p>
    </div>
  );
};

export default CardFeatures;
