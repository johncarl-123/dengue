import React from "react";
import { motion } from "framer-motion";
import { styles } from "../../styles";
import { ComputersCanvas } from "./canvas";

const Hero = () => {
  return (
    <section className={`relative w-full h-screen mx-auto flex pb-20 lg:pb-32`}>
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
            FOR DENGUE DISEASE:<br />
            <span className="text-[#915EFF]">
              <span className="text-5xl sm:text-4xl">
                ANTICIPATING PATIENT <br />
                OUTCOMES COMMON THROUGH <br />
                SYMPTOMS ASSESSMENT
              </span>
            </span>
          </h1>
          <p
            className={`${styles.heroSubText} mt-2 text-white-100 text-sm sm:text-base`}
          >
            Guiding patients to better health, <br className="sm:block hidden" />
            and helping to determine dengue diseases.
          </p>
        </div>
      </div>

      {/* Align the ComputersCanvas with larger viewing area */}
      <div
        className="absolute inset-y-0 right-0 w-2/3 h-[90%] flex justify-end items-center z-0"
        style={{ transform: "translateX(-1%) translateY(-10%)" }}
      >
        <ComputersCanvas />
      </div>

      {/* Scroll indicator at the bottom */}
      <div className="absolute xs:bottom-5 bottom-32 w-full flex justify-center items-center z-10">
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
