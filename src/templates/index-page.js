import React, { Component } from "react";
import { graphql } from "gatsby";
import Img from "gatsby-image";
import GalleryIndex from "../components/GalleryIndex";

import Layout from "../components/Layout";
import "bulma-carousel/dist/css/bulma-carousel.min.css";

const IndexPage = ({ data }) => {
  console.log("data:", data);
  let galleries = data.allMarkdownRemark.edges;
  console.log("galleries:", galleries);
  return (
    <Layout>
      <div className="columns is-multiline">
        {galleries.map((gallery, i) => {
          console.log("gallery:", gallery);
          return (
            <GalleryIndex
              title={gallery.node.frontmatter.title}
              photos={gallery.node.frontmatter.featuredimage}
              url={gallery.node.fields.slug}
              key={gallery.node.frontmatter.title}
            />
          );
        })}
      </div>
    </Layout>
  );
};

export default IndexPage;

export const pageQuery = graphql`
  query IndexPage {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { templateKey: { eq: "portfolio" } } }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "MMMM DD, YYYY")
            featuredpost
            featuredimage {
              id
              childImageSharp {
                fluid(maxWidth: 1500, quality: 100) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`;
