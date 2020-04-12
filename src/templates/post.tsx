import React from 'react'
import { MDXProvider } from '@mdx-js/react';
import styled from 'styled-components';
import tw from 'tailwind.macro'

import Layout from '../components/layout'
import SEO from '../components/seo'

const PostContainer = styled.div`
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

export default ({ children, pageContext }) => {
  return (
    <Layout>
      <SEO title={pageContext.frontmatter.SEO} />
      <PostContainer>
        <MDXProvider>{children}</MDXProvider>
      </PostContainer>
    </Layout>
  );
}
