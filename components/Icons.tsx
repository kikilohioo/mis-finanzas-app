import { transform } from "@babel/core";
import { AntDesign } from "@expo/vector-icons";

type IconProp = {
  size?: number;
  color?: string;
};

export const HomeIcon = (props: IconProp) => {
  return <AntDesign name="home" size={24} color="black" {...props} />;
};

export const DownloadIcon = (props: IconProp) => {
  return <AntDesign name="clouddownloado" size={24} color="black" {...props} />;
};
