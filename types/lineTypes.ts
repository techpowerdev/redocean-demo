export type FlexMessage = {
  type: "bubble" | "carousel";
  body?: FlexBox;
  footer?: FlexBox;
  styles?: {
    footer?: {
      separator?: boolean;
    };
  };
  contents?: FlexBubble[]; // ใช้กรณีเป็น carousel
};

export type FlexBubble = {
  type: "bubble";
  body?: FlexBox;
  footer?: FlexBox;
  styles?: {
    footer?: {
      separator?: boolean;
    };
  };
};

export type FlexBox = {
  type: "box";
  layout: "vertical" | "horizontal" | "baseline";
  contents: FlexContent[];
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  justifyContent?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems?: "flex-start" | "center" | "flex-end";
};

export type FlexContent =
  | FlexText
  | FlexImage
  | FlexButton
  | FlexSeparator
  | FlexBox;

export type FlexText = {
  type: "text";
  text: string;
  weight?: "bold" | "regular";
  color?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end";
  wrap?: boolean;
  flex?: number;
};

export type FlexImage = {
  type: "image";
  url: string;
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  aspectRatio?: string;
  aspectMode?: "cover" | "fit";
};

export type FlexButton = {
  type: "button";
  action: FlexAction;
  style?: "primary" | "secondary" | "link";
  color?: string;
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
};

export type FlexSeparator = {
  type: "separator";
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
};

export type FlexAction =
  | {
      type: "uri";
      label: string;
      uri: string;
    }
  | {
      type: "postback";
      label: string;
      data: string;
    }
  | {
      type: "message";
      label: string;
      text: string;
    };

export type SendMessageToLineParams = {
  userId: string;
  message?: string;
  flexMessage?: FlexMessage;
};
