import React, { Component, useState, Fragment } from "react";
import PropTypes from "prop-types";
import { Link, graphql, StaticQuery } from "gatsby";
import PreviewCompatibleImage from "./PreviewCompatibleImage";

const GalleryIndex = ({ title, photos, url }) => {
  console.log("photos:", photos);
  console.log("title:", title);
  console.log("url:", url);
  return (
    <Fragment>
      <div className="column is-half thumbnail-column">
        <Link to={url}>
          <div
            className="thumbnail"
            style={{
              backgroundImage: `url(${photos.childImageSharp.fluid.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat"
            }}
          >
            <header className="thumbnail-header">{title}</header>
          </div>
        </Link>
      </div>
    </Fragment>
  );
};

export const galleryIndexQuery = graphql`
  query GalleryIndexQuery {
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
            }
          }
        }
      }
    }
  }
`;

export default GalleryIndex;
