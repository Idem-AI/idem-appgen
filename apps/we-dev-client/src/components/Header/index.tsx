import { ProjectTitle } from "./ProjectTitle";
import { HeaderActions } from "./HeaderActions";

function Header() {
  return (
    <header className="min-h-12 flex items-center px-4 h-12 glass border-b">
      <div className="flex-1">
        <ProjectTitle />
      </div>
      <img className="w-20 h-auto" src="public/assets/icons/logo_white.png" alt="logo" />

      <h1 className="mt-3 ml-1 opacity-90 text-[18px] font-bold">APPGEN</h1>
      
      <div className="flex-1 flex justify-end">
        <HeaderActions />
      </div>
    </header>
  );
}

export default Header;
