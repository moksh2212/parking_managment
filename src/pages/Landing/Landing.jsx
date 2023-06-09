import { useForm } from "react-hook-form";
import { motion } from "framer-motion"
import styles from "./landing.module.scss";

const PARKING_SIZE = 20;

export const Landing = ({ triggerTransition, setParkingSlotsCount }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = (data) => {
    const parkingSize = Number(data.parkingSize);
    if (parkingSize && typeof parkingSize === "number") {
      setParkingSlotsCount(parkingSize);
    }
    triggerTransition();
  };

  return (
  
    
    <div className={`flex ${styles.landing}`}>
      
      <section>
        <h1>Parking Managment System</h1>
      </section>
      <section>
      <motion.div
  whileHover={{ scale: 1.2, rotate: 90 }}
  whileTap={{
    scale: 0.8,
    rotate: -90,
    borderRadius: "100%"
  }}
>
      <img className={styles.c} src="../../../assets/Untitled design (1).png" alt="Car" /> </motion.div>
        <header className={styles.title}>
          How many parking slots you need?
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            placeholder={`Enter your desired size here (1-${PARKING_SIZE})`}
            type="number"
            {...register("parkingSize", {
              required: true,
              maxLength: 2,
              min: 1,
              max: PARKING_SIZE,
            })}
          />

          {errors.parkingSize && (
            <p className={styles.errorMessage}>
              Parking slots count should be between 1 and {PARKING_SIZE}{" "}
              (including).
            </p>
          )}
          <input type="submit" className={styles.submitBtn} />
        </form>
      </section>
    </div>
  );
};
