module.exports = {
  siteMetadata: {
    title: `'Rona`,
    description: `Is that you 'Rona?`,
    author: `@dbozhinovski`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages/`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `greater-gatsby`,
        short_name: `greater-gatsby`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/android-chrome-512x512.png`, // This path is relative to the root of the site.
        cache_busting_mode: 'none',
      },
    },
    {
      resolve: 'gatsby-source-remote-file',
      options: {
        url: 'https://opendata.ecdc.europa.eu/covid19/casedistribution/json/',
        name: 'ecdcStats'
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        defaultLayouts: {
          pages: require.resolve("./src/templates/post.tsx"),
        },
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        workboxConfig: {
          globPatterns: ['**/*'],
        }
      }
    },
    `gatsby-plugin-typescript`,
    `gatsby-plugin-postcss`,
  ],
}
