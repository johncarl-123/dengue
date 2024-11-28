import aedes1 from "../company/aedes1.jpg"; 
import Aedes2 from "../company/Aedes2.jpg"; 
import stagnant from "../tech/stagnant.jpg"; 
import repellent from "../tech/repellent.jpg"; 
import fogging from "../tech/fogging.jpg"; 

import {
  mobile,
  backend,
  creator,
  web,
  carrent,
  jobit,
  tripguide,
  threejs,
} from '..'; // Ensure correct path

export const navLinks = [
  {
    id: "predict",
    title: "Predict",
  },
  {
    id: "heatmap",
    title: "Heat Map",
  },
];
  
  const services = [
    {
      title: "Accurate",
      icon: web,
    },
    {
      title: "Predictive Model",
      icon: mobile,
    },
    {
      title: "Give Recommendations",
      icon: backend,
    },
    {
      title: "Trusted",
      icon: creator,
    },
  ];
  
  
  
  const experiences = [
    {
      title: "Dengue Disease",
      icon: aedes1,
      iconBg: "#383E56",
      points: [
        "Dengue is a mosquito-borne viral infection common in warm, tropical climates. Infection is caused by any one of four closely related dengue viruses (serotypes). These can lead to a wide spectrum of symptoms, including some extremely mild (unnoticeable) to those that may require medical intervention and hospitalization. In severe cases, fatalities can occur. There is no treatment for the infection itself but the symptoms that a patient experiences can be managed",
        "Earlier this year, WHO listed dengue as a potential threat among ten diseases for 2019 and current outbreaks in many countries confirm this observation. Dengue epidemics tend to have seasonal patterns, with transmission often peaking during and after rainy seasons. There are several factors contributing to this increase and they include high mosquito population levels, susceptibility to circulating serotypes, favorable air temperatures, precipitation, and humidity, all of which affect the reproduction and feeding patterns of mosquito populations, as well as the dengue virus incubation period. Lack of proactive control interventions and staff are some of the other challenges.",
      ],
    },
    {
      title: "Dengue Symptoms",
      icon: Aedes2,
      iconBg: "#E6DEDD",
      points: [
        "Fever",
        "Allergy",
        "Colds",
        "Fever",
        "Chest Pain",
        "Vomiting",
        "Headache",
        "Cough",
        "Stomachache",
        "Sore Throat",
        "Nausea",
        "Back Pain",
        "Joint Pain",
        "Nosebleed",
        "Watery Stool",
        "Pre-Orbital Pain",
        "Body Malaise",
      ],
    },
    {
      title: "Aedes aegypti",
      company_name: "Yellow fever mosquito",
      icon: aedes1,
      iconBg: "#383E56",
      points: [
        "Aedes aegypti is responsible for the recent surge in the incidents of dengue, chikungunya, and yellow fever, and it has generated a lot of intrigue in finding effective and eco-friendly solutions to prevent the occurrence of mosquito bites and its related effects. ",
        "It is a day-biting mosquito, and often feeds on multiple hosts during a single gonotrophic cycle.",
        "Females preferentially lay eggs in man-made or artificial containers including water tanks, flower vases, pot plant bases, discarded tyres, buckets or other containers typically found around or inside the home.",
        "Aedes aegypti is dependent on climate to some extent, critical scrutiny must be applied to the oversimplified assumption that climate change will independently lead to an increased range for this species and a concomitant expansion of the risk of dengue infections around the world. ",
      ],
    },
    {
      title: "Aedes Albopictus",
      company_name: "Asian Tiger Mosquito",
      icon: Aedes2,
      iconBg: "#E6DEDD",
      points: [
        "Aedes albopictus is a forest species that has adapted to the urban environment. It prefers unpaved dirt and ground vegetation",
        "It is an artificial container species, breeding in water-holding containers, and can also breed in tree holes, plant axils such as those of lucky bamboo and bromeliads, and in any other cryptic site that can hold water around dwellings.",
        "It lays its eggs a few at a time in several containers contributing to their fast spread.",
        "It is an aggressive daytime biter that feeds on humans but can feed on many other mammals.",
      ],
    },
  ];
  
  const testimonials = [
    {
      testimonial:
        "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
      name: "Sara Lee",
      designation: "CFO",
      company: "Acme Co",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      testimonial:
        "I've never met a web developer who truly cares about their clients' success like Rick does.",
      name: "Chris Brown",
      designation: "COO",
      company: "DEF Corp",
      image: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
      testimonial:
        "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
      name: "Lisa Wang",
      designation: "CTO",
      company: "456 Enterprises",
      image: "https://randomuser.me/api/portraits/women/6.jpg",
    },
  ];
  
  const projects = [
    {
      name: "Search and destroy",
      description:[
        "Dengue mosquitoes breed on stagnant water.",
        "Any container that could hold water should always be drained or disposed of properly. Mosquitoes lay eggs in these containers, leading to the proliferation of mosquitoes.",
        "Always keep your surroundings clean. Regular cleaning of the environment prevents the accumulation of water in discarded items like tires, cans, or buckets, which are ideal breeding grounds for mosquitoes.",
      ],
        
      image: stagnant,
      
    },
    {
      name: "Self-protection",
      description:[
        "Always wear mosquito repellents, long-sleeved shirts, pants, or garments that could cover your skin. Using insect repellent reduces the likelihood of mosquito bites, especially during peak mosquito activity times.",
        "For your home, make sure all windows have screens and fix it if there are holes. Installing window screens is a simple and effective way to keep mosquitoes out of your living spaces.",
        "Use mosquito repellant coils or sprays. These products help to keep mosquitoes at bay, especially in areas where mosquitoes are prevalent or during outbreaks.",
        
        
      ],
      
      image: repellent,
      
    },
    {
      name: "Fogging",
      description:[
        "Fogging kills and repels mosquitoes. This should be done during outbreaks and during peak biting times, typically early morning or late evening when mosquitoes are most active.",
      "Fogging is an effective way to control the adult mosquito population. It works by releasing insecticides in the form of a mist, which mosquitoes inhale and are killed.",
      "While fogging is an effective method during an outbreak, it should be done by professionals to ensure it is used safely and effectively in the right areas.",
      "It is important to fog in areas where mosquitoes are known to breed, such as stagnant water sources, marshes, or places with dense vegetation.",
       
        
      ],
      
      image: fogging,
      
    },
  ];
  
  export { services, experiences, testimonials, projects };