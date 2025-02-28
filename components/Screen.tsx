import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

type ScrrenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Screen({ children, style }: ScrrenProps) {
  return <View style={[{ flex: 1, paddingTop: 10 }, style]}>{children}</View>;
}
