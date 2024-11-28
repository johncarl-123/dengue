import React from "react";
import { Tilt } from "react-tilt"; // Assuming Tilt is a named export
import { motion } from "framer-motion";

import { styles } from "../../styles";
import { SectionWrapper } from "../../hoc";
import { projects } from "../../assets/constants";
import { fadeIn, textVariant } from "../../utils/motion";

const ProjectCard = ({ index, name, description, image }) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full"
      >
        <div className="relative w-full h-[230px]">
          <img
            src={image}
            alt="project_image"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        <div className="mt-5">
          <h3 className="text-white font-bold text-[24px]">{name}</h3>
          {/* Render description as a list if it's an array */}
          {Array.isArray(description) ? (
            <ul className="list-disc list-inside mt-2 text-secondary text-[14px] space-y-1">
              {description.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-secondary text-[14px]">{description}</p>
          )}
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} `}>
          How can dengue fever be prevented?
        </p>
        <h2 className={`${styles.sectionHeadText}`}>Dengue Prevention</h2>
      </motion.div>

      <div className="w-full flex">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]"
        >
          Dengue prevention is crucial to protect individuals and communities
          from the severe health and economic impacts of the disease. By
          reducing the risk of infection through proactive measures, we can
          prevent outbreaks, minimize the burden on healthcare systems, and
          safeguard lives. Prevention efforts also contribute to maintaining
          productivity, especially in affected regions, by reducing
          illness-related absences and long-term complications. Ultimately,
          investing in dengue prevention is vital for promoting public health,
          improving quality of life, and ensuring sustainable development in
          vulnerable areas. These are some ways to prevent Dengue Disease:
        </motion.p>
      </div>

      <div className="mt-20 flex flex-wrap gap-7">
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "");
