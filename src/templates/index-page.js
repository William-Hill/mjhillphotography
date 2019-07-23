import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, graphql } from "gatsby";
import Img from "gatsby-image";

import Layout from "../components/Layout";
import "bulma-carousel/dist/css/bulma-carousel.min.css";

// import bulmaCarousel from "bulma-carousel";

// Workaround for bug with bulmaCarousel with Netlify deployment; source: https://github.com/Wikiki/bulma-carousel/issues/76
const bulmaCarousel = (() => {
  if (typeof window !== "undefined") {
    return require("bulma-carousel");
  }
})();

class IndexPageTemplate extends Component {
  constructor(props) {
    super(props);
    console.log("props:", props);
    const photos = props.data.allFile.edges;
    console.log("photos:", photos);
    this.carouselRef = React.createRef();

    this.state = {
      photos_fluid: photos
    };
  }

  componentDidMount() {
    console.log("inside componentDidMount");
    console.log("carouselRef:", this.carouselRef);
    bulmaCarousel.attach(this.carouselRef.current, {
      slidesToScroll: 1,
      slidesToShow: 1,
      infinite: true,
      autoplay: true
    });
  }

  render() {
    return (
      <Layout>
        <div id="indexDiv">
          <section className="hero is-fullheight has-carousel">
            <div
              id="carousel-demo"
              className="hero-carousel"
              ref={this.carouselRef}
            >
              {this.state.photos_fluid.map((photo, i) => {
                return (
                  <div className={`item-${i}`}>
                    <Img fluid={photo.node.childImageSharp.fluid} />
                  </div>
                );
              })}
            </div>
            <div className="hero-head" />
            <div className="hero-body" />
            <div className="hero-foot" />
          </section>
        </div>
      </Layout>
    );
  }
}

export default IndexPageTemplate;

export const pageQuery = graphql`
  query IndexPageTemplate {
    allFile(filter: { sourceInstanceName: { eq: "carousel_pictures" } }) {
      edges {
        node {
          absolutePath
          extension
          size
          dir
          modifiedTime
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
              sizes
            }
          }
        }
      }
    }
  }
`;
