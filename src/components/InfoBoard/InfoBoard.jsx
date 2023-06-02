import styles from "./info-board.module.scss";

export const InfoBoard = ({ availableSlotsCount,getSlotCount }) => {
  const x=getSlotCount-availableSlotsCount;
  return (
    <div className={styles.infoBoard}>
      <h3><h3>LIVE</h3> Parking Count</h3>
      <div>
      <span className={styles.t}> Total slots</span>
      <span className={styles.a}> Available slots</span>
      <span className={styles.p}> Parked slots</span>
        </div>
        <div>
      <span className={styles.s1}> {getSlotCount}</span>
      <span className={styles.s2}>{availableSlotsCount}</span>
      <span className={styles.s3}>{x}</span>
        </div>
     
    </div>
  );
};
