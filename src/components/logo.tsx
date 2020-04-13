import React from "react";
import styled from "styled-components";
import tw from "tailwind.macro";
import Emblem from "../images/android-chrome-192x192.png";

const Text = styled.h1`
  ${tw`inline-block text-gray-900 tracking-tight select-none mb-4 pt-6`};
  font-size: 4rem;
  line-height: 2.9rem;
`;

const Subtitle = styled.p`
  ${tw`block mt-2 p-0 text-gray-600 max-w-md text-center text-base leading-tight`}
`;

const LogoStyle = styled.div`
  ${tw`flex flex-col items-center justify-start my-2`};
`;

const Img = styled.img`
  ${tw`rounded-full border-solid border-4 border-gray-400`};
`;

const Logo: React.FunctionComponent = () => {
  return (
    <LogoStyle>
      <Img src={Emblem} className="w-48" />
      <Text>'Rona</Text>
      <Subtitle>
        Current COVID-19 world wide status, gathered from ECDC, WHO and Wikipedia
        (once per day)
      </Subtitle>
    </LogoStyle>
  );
};

export default Logo;
