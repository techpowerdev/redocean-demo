import React from "react";

type Props = {
  params: { id: string };
};

export default function page({ params }: Props) {
  return <div>{params.id}</div>;
}
