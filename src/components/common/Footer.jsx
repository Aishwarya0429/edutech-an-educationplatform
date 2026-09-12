import React from "react";
import { FooterLink2 } from "../../data/footer-links";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];

const Footer = () => {
  return (
    <footer className="bg-richblack-800 border-t border-richblack-700">
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-between w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto py-14">
        {/* Left Columns */}
        <div className="border-b w-full flex flex-col lg:flex-row pb-5 border-richblack-700 lg:border-b-0 lg:border-r lg:pr-5 justify-between gap-6">
          {/* Column 1: Brand & Social */}
          <div className="flex flex-col gap-3 min-w-[150px]">
            <img src={Logo} alt="StudyNotion" className="object-contain w-36" />
            <h2 className="text-richblack-50 font-semibold text-[16px]">Company</h2>
            <div className="flex flex-col gap-2">
              {["About", "Careers", "Affiliates"].map((ele, i) => (
                <Link
                  key={i}
                  to={`/${ele.toLowerCase()}`}
                  className="text-[14px] hover:text-richblack-50 transition-colors"
                >
                  {ele}
                </Link>
              ))}
            </div>
            <div className="flex gap-3 text-lg mt-2 text-richblack-300">
              <FaFacebook className="hover:text-richblack-50 transition-colors cursor-pointer" />
              <FaGoogle className="hover:text-richblack-50 transition-colors cursor-pointer" />
              <FaTwitter className="hover:text-richblack-50 transition-colors cursor-pointer" />
              <FaYoutube className="hover:text-richblack-50 transition-colors cursor-pointer" />
            </div>
          </div>

          {/* Column 2: Resources & Support */}
          <div className="flex flex-col gap-2 min-w-[150px]">
            <h2 className="text-richblack-50 font-semibold text-[16px]">Resources</h2>
            <div className="flex flex-col gap-2 mt-1">
              {Resources.map((ele, index) => (
                <Link
                  key={index}
                  to={`/${ele.split(" ").join("-").toLowerCase()}`}
                  className="text-[14px] hover:text-richblack-50 transition-colors"
                >
                  {ele}
                </Link>
              ))}
            </div>
            <h2 className="text-richblack-50 font-semibold text-[16px] mt-4">Support</h2>
            <Link to="/contact" className="text-[14px] hover:text-richblack-50 transition-colors">
              Help Center
            </Link>
          </div>

          {/* Column 3: Plans & Community */}
          <div className="flex flex-col gap-2 min-w-[150px]">
            <h2 className="text-richblack-50 font-semibold text-[16px]">Plans</h2>
            <div className="flex flex-col gap-2 mt-1">
              {Plans.map((ele, index) => (
                <Link
                  key={index}
                  to={`/${ele.split(" ").join("-").toLowerCase()}`}
                  className="text-[14px] hover:text-richblack-50 transition-colors"
                >
                  {ele}
                </Link>
              ))}
            </div>
            <h2 className="text-richblack-50 font-semibold text-[16px] mt-4">Community</h2>
            <div className="flex flex-col gap-2 mt-1">
              {Community.map((ele, index) => (
                <Link
                  key={index}
                  to={`/${ele.split(" ").join("-").toLowerCase()}`}
                  className="text-[14px] hover:text-richblack-50 transition-colors"
                >
                  {ele}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Columns (FooterLink2 Data) */}
        <div className="w-full flex flex-col sm:flex-row justify-between gap-6 pl-0 lg:pl-5">
          {FooterLink2.map((ele, i) => (
            <div key={i} className="flex flex-col gap-2 min-w-[130px]">
              <h2 className="text-richblack-50 font-semibold text-[16px]">{ele.title}</h2>
              <div className="flex flex-col gap-2 mt-1">
                {ele.links.map((link, index) => (
                  <Link
                    key={index}
                    to={link.link}
                    className="text-[14px] hover:text-richblack-50 transition-colors"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Subfooter */}
      <div className="border-t border-richblack-700 py-6 text-center text-sm text-richblack-400">
        <div className="w-11/12 max-w-maxContent mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-4">
            {BottomFooter.map((ele, i) => (
              <span key={i} className="hover:text-richblack-50 cursor-pointer transition-colors">
                {ele}
              </span>
            ))}
          </div>
          <p>© {new Date().getFullYear()} StudyNotion. Made with ❤️ for learners everywhere.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
