import React, { useState } from "react";
import { data } from "../restApi.json";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouteLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
// import './navbar.css'; // Ensure to import your CSS file

const Navbar = () => {
  const [show, setShow] = useState(false);

  return (
    <nav>
      <div className="logo">FOODERS</div>
      <div className={show ? "navLinks showmenu" : "navLinks"}>
        <div className="links">
          {data[0].navbarLinks.map((element) => (
            <ScrollLink
              to={element.link}
              spy={true}
              smooth={true}
              duration={500}
              key={element.id}
            >
              {element.title}
            </ScrollLink>
          ))}
        </div>
        <div>
          <RouteLink to="/orderonline">
            <button className="menuBtn">
              ORDER ONLINE
            </button>
          </RouteLink>
          <RouteLink to="/menu">
            <button className="menuBtn">
              OUR MENU
            </button>
          </RouteLink>
        </div>
      </div>
      <div className="hamburger" onClick={() => setShow(!show)}>
        <GiHamburgerMenu />
      </div>
    </nav>
  );
};

export default Navbar;
