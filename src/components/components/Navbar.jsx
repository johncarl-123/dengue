import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { styles } from '../../styles';
import { navLinks } from '../../assets/constants';
import { menu, close } from '../../assets';
import logod from '../../assets/denge.png'; // Import your new logo

const Navbar = () => {
  const [active, setActive] = useState('');
  const [toggle, setToggle] = useState(false);

  return (
    <nav className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 bg-primary`}>
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          {/* Increased logo size with a larger scale */}
          <img
            src={logod}
            alt="logo"
            className="w-12 h-12 object-contain scale-150 -mt-3" // Increased size further with scale-150 and adjusted alignment
          />
          <p className="text-white text-[18px] font-bold cursor-pointer flex">
          </p>
        </Link>
        <ul className="list-none hidden sm:flex flex-row gap-10">
          {navLinks.map((link) => (
            <li
              key={link.id}
              className={`${
                active === link.title ? "text-white" : "text-secondary"
              } hover:text-white text-[18px] font-medium cursor-pointer`}
              onClick={() => setActive(link.title)}
            >
              <Link to={`/${link.id}`}>{link.title}</Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu toggle */}
        <div className="sm:hidden flex flex-1 justify-end items-center"> 
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="w-[28px] h-[28px] object-contain cursor-pointer ml-4" // Adjusted margin-left to move it more to the left
            onClick={() => setToggle(!toggle)}
          />
          <div className={`${!toggle ? "hidden" : "flex"} p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}>
            <ul className="list-none flex justify-end items-start flex-col gap-4">
              {navLinks.map((link) => (
                <li
                  key={link.id}
                  className={`${
                    active === link.title ? "text-white" : "text-secondary"
                  } font-medium cursor-pointer text-[16px]`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(link.title);
                  }}
                >
                  <Link to={`/${link.id}`}>{link.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
