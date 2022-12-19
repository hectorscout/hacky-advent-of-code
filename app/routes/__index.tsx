import { Link, Outlet, useLocation } from "@remix-run/react";

export default function Index() {
  const location = useLocation();
  const links = [
    {
      to: "/01",
      label: "Day 01 - Calorie Counting",
    },
    {
      to: "/07",
      label: "Day 07 - No Space On Device",
    },
    {
      to: "/08",
      label: "Day 08 - Treetop Tree House",
    },
    {
      to: "/09",
      label: "Day 09 - Rope Bridge",
    },
    {
      to: "/10",
      label: "Day 10 - Cathode-Ray Tube",
    },
    {
      to: "/11",
      label: "Day 11 - Monkey in the Middle",
    },
    {
      to: "/12",
      label: "Day 12 - Hill Climbing",
    },
    {
      to: "/13",
      label: "Day 13 - Distress Signal",
    },
    {
      to: "/14",
      label: "Day 14 - Regolith Reservoir",
    },
    {
      to: "/15",
      label: "Day 15 - Beacon Exclusion Zone",
    },
    {
      to: "/16",
      label: "Day 16 - Proboscidea Volcanium",
    },
    {
      to: "/17",
      label: "Day 17 - Pyroclastic Flow",
    },
    {
      to: "/18",
      label: "Day 18 - Boiling Boulders",
    },
  ];

  return (
    <main className="flex h-full overflow-hidden bg-white">
      <div className="w-100 flex h-full flex-col overflow-hidden bg-green-300 text-red-700">
        <h1 className="p-10 text-3xl">Advent of Code 2022</h1>
        <div className="overflow-auto">
          {links.map((link) => (
            <h2
              className={`py-5 px-10 text-2xl ${
                location.pathname === link.to ? "bg-green-600" : ""
              }`}
              key={link.to}
            >
              <Link to={link.to}>{link.label}</Link>
            </h2>
          ))}
        </div>
      </div>
      <Outlet />
    </main>
  );
}
