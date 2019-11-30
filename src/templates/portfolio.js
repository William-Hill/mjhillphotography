import React, { Component, useState, Fragment } from "react";
import Img from "gatsby-image";
import Layout from "../components/Layout";
import Carousel, { Modal, ModalGateway } from "react-images";
import { chunk, sum } from "lodash";
import { Box, Link } from "rebass";
import Masonry from "react-masonry-css";

const Gallery = ({ images, itemsPerRow: itemsPerRowByBreakpoints = [1] }) => {
  console.log("images in Gallery:", images);
  // Sum aspect ratios of images in the given row
  const aspectRatios = images.map(image => image.aspectRatio);

  // For each breakpoint, calculate the aspect ratio sum of each row's images
  const rowAspectRatioSumsByBreakpoints = itemsPerRowByBreakpoints.map(
    itemsPerRow =>
      // Split images into groups of the given size
      chunk(aspectRatios, itemsPerRow).map(rowAspectRatios =>
        // Sum aspect ratios of images in the given row
        sum(rowAspectRatios)
      )
  );

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);

  const closeModal = () => setModalIsOpen(false);
  const openModal = imageIndex => {
    setModalCurrentIndex(imageIndex);
    setModalIsOpen(true);
  };

  return (
    <Box>
      {images.map((image, i) => {
        return (
          <Link
            key={i}
            href={image.src}
            onClick={e => {
              e.preventDefault();
              openModal(i);
            }}
          >
            <Box
              as={Img}
              fluid={image}
              width={rowAspectRatioSumsByBreakpoints.map(
                (rowAspectRatioSums, j) => {
                  const rowIndex = Math.floor(i / itemsPerRowByBreakpoints[j]);
                  const rowAspectRatioSum = rowAspectRatioSums[rowIndex];

                  return `${(image.aspectRatio / rowAspectRatioSum) * 100}%`;
                }
              )}
              css={`
                display: inline-block;
                vertical-align: middle;
                transition: filter 0.3s;
                :hover {
                  filter: brightness(87.5%);
                }
              `}
            />
          </Link>
        );
      })}

      {ModalGateway && (
        <ModalGateway>
          {modalIsOpen && (
            <Modal onClose={closeModal}>
              <Carousel
                views={images.map(({ src }) => ({
                  source: src
                }))}
                currentIndex={modalCurrentIndex}
                components={{ FooterCount: () => null }}
              />
            </Modal>
          )}
        </ModalGateway>
      )}
    </Box>
  );
};

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
