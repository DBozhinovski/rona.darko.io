import styled from 'styled-components';
import tw from 'tailwind.macro'

export const PostWrapper = styled.div`
  ${tw`mt-12 flex flex-col px-5`};
  max-width: 75ch;

  h1 {
    ${tw`text-center my-10`};
  }

  h2 {
    ${tw`my-8`}
  }

  p {
    ${tw`my-5`}
  }

  ul {
    ${tw`list-outside list-disc`}

    li {
      ${tw`ml-12`}
    }
  }
`;