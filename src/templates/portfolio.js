import React, { Component, useState, Fragment } from "react";
import Layout from "../components/Layout";
import Gallery from "../components/Gallery";

class GalleryComposition extends Component {
  constructor(props) {
    super(props);
    const data = props.data;
    const photos = data.allFile.edges;
    console.log("photos:", photos);
    // let portraitAlbums = new Set();
    let portraitAlbums = {};
    let eventAlbums = new Set();
    photos.forEach(photo => {
      let photoDir = photo.node.dir;
      var album = photoDir.substr(photoDir.lastIndexOf("/") + 1);
      if (photoDir.includes("portraits")) {
        // portraitAlbums.add(album);
        if (portraitAlbums.hasOwnProperty(album)) {
          portraitAlbums[album].push(photo.node.childImageSharp);
        } else {
          portraitAlbums[album] = [photo.node.childImageSharp];
        }
      } else {
        eventAlbums.add(album);
      }
    });
    console.log("portraitAlbums:", portraitAlbums);
    this.state = {
      photos_fluid: photos,
      portraitAlbums: portraitAlbums,
      eventAlbums: Array.from(eventAlbums)
    };
  }

  render() {
    return (
      <Layout>
        <div className="columns">
          <aside className="column is-2 is-narrow-mobile is-fullheight section is-hidden-mobile portfolio-menu">
            <p className="menu-label">Portraits</p>
            <ul className="menu-list">
              {Object.keys(this.state.portraitAlbums).map((album, i) => {
                console.log("album:", album);
                return (
                  <li key={`${album}_${i}`}>
                    <a>{album}</a>
                  </li>
                );
              })}
            </ul>
            <p className="menu-label">Events</p>
            <ul className="menu-list">
              {this.state.eventAlbums.map((album, i) => {
                console.log("album:", album);
                return (
                  <li>
                    <a>{album}</a>
                  </li>
                );
              })}
            </ul>
          </aside>
          <div className="column">
            <Gallery
              itemsPerRow={[2, 3]} // This will be changed to `[2, 3]` later
              images={this.state.photos_fluid.map(({ node }) => ({
                ...node.childImageSharp.fluid
              }))}
            />
            <Fragment>
              <div class="card">
                <div class="card-image">
                  <figure class="image is-4by3">
                    <img
                      src="https://bulma.io/images/placeholders/1280x960.png"
                      alt="Placeholder image"
                    />
                  </figure>
                </div>
              </div>
            </Fragment>
          </div>
        </div>
      </Layout>
    );
  }
}

export default GalleryComposition;

export const portfolioPageQuery = graphql`
  query PortfolioQuery {
    allFile(filter: { sourceInstanceName: { eq: "portfolio" } }) {
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
