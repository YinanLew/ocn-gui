import React from "react";
import { useLanguage } from "../utils/languageContext";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { FaLanguage } from "react-icons/fa";

const LanguageSwitcher: React.FC = () => {
  const { setLanguage } = useLanguage();
  const handleChangeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className="bg-transparent hover:bg-transparent border-none"
          size="sm"
          endContent={<FaLanguage size={45} />}
        ></Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="en" onClick={() => handleChangeLanguage("en")}>
          English
        </DropdownItem>
        <DropdownItem key="cn" onClick={() => handleChangeLanguage("cn")}>
          中文
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default LanguageSwitcher;
