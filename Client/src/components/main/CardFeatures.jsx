const CardFeatures = ({ info, icon, styles }) => {
  return (
    <div className={styles.holder}>
      <img className={styles.icon} src={icon} alt="a" />
      <p className={styles.title}>{info}</p>
    </div>
  );
};

export default CardFeatures;
