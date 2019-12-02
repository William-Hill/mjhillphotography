/*eslint no-continue: "error"*/
import React, { Component, useState, Fragment } from "react";
import Layout from "../components/Layout";
import Gallery from "../components/Gallery";

function getCoverPhotos(photos) {
  let coverPhotos = {};
  photos.forEach(photo => {
    let photoDir = photo.node.dir;
    var album = photoDir.substr(photoDir.lastIndexOf("/") + 1);
    if (
      !coverPhotos.hasOwnProperty(album) &&
      photoDir.includes("portraits") &&
      photo.node.childImageSharp.fluid.aspectRatio == 1.5
    ) {
      coverPhotos[album] = [photo.node.childImageSharp];
    }
  });
  return coverPhotos;
}

function getPhotoAlbums(photos) {
  let portraits = {};
  let events = {};
  photos.forEach(photo => {
    let photoDir = photo.node.dir;
    var album = photoDir.substr(photoDir.lastIndexOf("/") + 1);
    if (photoDir.includes("portraits")) {
      // portraitAlbums.add(album);
      if (portraits.hasOwnProperty(album)) {
        portraits[album].push(photo.node.childImageSharp);
      } else {
        portraits[album] = [photo.node.childImageSharp];
      }
    } else {
      events.add(album);
    }
  });

  return [portraits, events];
}

class GalleryComposition extends Component {
  constructor(props) {
    super(props);
    const data = props.data;
    const photos = data.allFile.edges;
    console.log("photos:", photos);
    // let portraitAlbums = new Set();
    let [portraitAlbums, eventAlbums] = getPhotoAlbums(photos);
    let portraitCoverPhotos = getCoverPhotos(photos);

    console.log("portraitCoverPhotos:", portraitCoverPhotos);

    console.log("portraitAlbums:", portraitAlbums);
    this.state = {
      photos_fluid: photos,
      portraitAlbums: portraitAlbums,
      eventAlbums: Array.from(eventAlbums),
      coverPhotos: portraitCoverPhotos
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
              <div className="columns is-multiline">
                {Object.keys(this.state.coverPhotos).map((coverPhoto, i) => {
                  console.log(
                    "coverPhoto:",
                    this.state.coverPhotos[coverPhoto]
                  );
                  return (
                    <Fragment>
                      <div className="column is-one-third thumbnail-column">
                        <div
                          className="thumbnail"
                          style={{
                            backgroundImage: `url(${
                              this.state.coverPhotos[coverPhoto][0].fluid.src
                            })`,
                            backgroundSize: "cover",
                            backgroundPosition: "center center",
                            backgroundRepeat: "no-repeat"
                          }}
                        >
                          <header class="thumbnail-header">Placeholder</header>
                        </div>
                      </div>
                    </Fragment>
                  );
                })}
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
