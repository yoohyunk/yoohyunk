// NavBar.jsx
"use client";
import { useEffect, useState } from "react";
import { Link, Events, scrollSpy } from "react-scroll";

const NAV_ITEMS = ["home", "about", "services", "contact"];

export default function NavBar() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    // react-scroll 이벤트 리스너 등록
    Events.scrollEvent.register("begin", () => {});
    Events.scrollEvent.register("end", () => {});

    // 섹션 변경될 때 active 업데이트
    scrollSpy.update();
    Events.scrollEvent.register("active", (name) => {
      setActive(name);
    });

    return () => {
      Events.scrollEvent.remove("begin");
      Events.scrollEvent.remove("end");
      Events.scrollEvent.remove("active");
    };
  }, []);

  return (
    <nav className="fixed top-0 w-full bg-white shadow z-50">
      <ul className="flex justify-center space-x-8 py-4">
        {NAV_ITEMS.map((name) => (
          <li key={name}>
            <Link
              to={name}
              spy={true}
              smooth={true}
              offset={-64} // 네브바 높이만큼 오프셋
              duration={500}
              onSetActive={() => setActive(name)}
              className={`cursor-pointer hover:opacity-80 ${
                active === name
                  ? "text-blue-600 font-bold underline"
                  : "text-gray-700"
              }`}
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
