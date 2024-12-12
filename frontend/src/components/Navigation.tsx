import { IoHomeOutline } from "react-icons/io5";
import { RiCalendarLine, RiMentalHealthLine } from "react-icons/ri";

import { Link, useLocation } from "react-router-dom";

export function Navigation() {
  const location = useLocation();

  const locationMap = [
    {
      path: "/",
      icon: IoHomeOutline,
      label: "Home",
      current: location.pathname === "/",
    },
    {
      path: "/patients",
      icon: RiMentalHealthLine,
      label: "Pacientes",
      current: location.pathname === "/patients",
    },
    {
      path: "/schedules",
      icon: RiCalendarLine,
      label: "Agendamentos",
      current: location.pathname === "/schedules",
    },
  ];
  return (
    <ul className="flex flex-col gap-4 pt-20 w-full">
      {locationMap.map(({ path, icon: Icon, label, current }) => (
        <li className="w-full hover:font-medium cursor-pointer">
          <Link
            key={path}
            to={path}
            className={`w-full flex gap-2 text-lg items-center lg:px-10 ${
              current
                ? "text-custom-primary-light dark:text-custom-primary-dark font-medium"
                : "text-custom-primary-light/90 dark:text-custom-primary-dark/90"
            }`}
          >
            <Icon className="text-xl" />
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
