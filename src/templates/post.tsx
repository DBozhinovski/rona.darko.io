import React from 'react'
import { MDXProvider } from '@mdx-js/react';
import styled from 'styled-components';
// import tw from 'tailwind.macro'

import { Link } from "gatsby";

import Layout from '../components/layout'
import SEO from '../components/seo'

const PostContainer = styled.div`
`;

const shortcodes = { Link }

export default ({ children, pageContext }) => {
  return (
    <Layout>
      <SEO title={pageContext.frontmatter.SEO} />
        <MDXProvider components={shortcodes}>
          <PostContainer>
          {children}
          </PostContainer>
        </MDXProvider>
    </Layout>
  );
}
