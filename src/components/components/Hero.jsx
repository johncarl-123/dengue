import React from "react";
import { motion } from "framer-motion";
import { styles } from "../../styles";
import { ComputersCanvas } from "./canvas";

const Hero = () => {
  return (
    <section className="relative w-full h-screen mx-auto pb-20 lg:pb-32 overflow-hidden">
      {/* Content area (Text) */}
      <div
        className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5 z-10`}
      >
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-[#915EFF]" />
          <div className="w-1 sm:h-80 h-40 violet-gradient" />
        </div>

        {/* Align content to the left */}
        <div className="flex flex-col items-start">
          <h1 className={`${styles.heroHeadText}`}>
            PREDICTIVE MODELING <br />
            FOR DENGUE DISEASE:
          </h1>
          <h2
            className="text-[#915EFF] text-2xl sm:text-3xl lg:text-4xl leading-snug"
          >
            ANTICIPATING PATIENT <br />
            OUTCOMES COMMON THROUGH <br />
            SYMPTOMS ASSESSMENT
          </h2>
          <br />
          <p
            className={`${styles.heroSubText} mt-2 text-white-100 text-sm sm:text-base`}
          >
            Guiding patients to better health, <br className="sm:block hidden" />
            and helping to determine dengue diseases.
          </p>
        </div>
      </div>

      {/* Align the ComputersCanvas */}
      <div
        className="absolute inset-y-0 right-0 w-[90%] sm:w-[75%] lg:w-[60%] h-[50%] sm:h-[70%] lg:h-[90%] flex justify-center lg:justify-end items-center z-0"
        style={{ transform: "translateX(10%)" }}
      >
        <ComputersCanvas />
      </div>

      <div className="absolute xs:bottom-5 bottom-20 w-full flex justify-center items-center z-10">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>

    </section>
  );
};

export default Hero;
