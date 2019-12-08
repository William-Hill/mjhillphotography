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
    console.log("props:", props);
    const data = props.data;
    let pageInfo = data.allPageInfo;
    let imageInfo = data.allImageInfo;
    // const photos = data.markdownRemark.frontmatter.imagepaths;
    const photos = imageInfo.edges.filter(
      x => x.node.relativeDirectory === pageInfo.frontmatter.directory
    );
    console.log("photos:", photos);
    // let portraitAlbums = new Set();
    // let [portraitAlbums, eventAlbums] = getPhotoAlbums(photos);
    // let portraitCoverPhotos = getCoverPhotos(photos);

    // console.log("portraitCoverPhotos:", portraitCoverPhotos);

    // console.log("portraitAlbums:", portraitAlbums);
    this.state = {
      photos_fluid: photos,
      title: pageInfo.frontmatter.title,
      description: pageInfo.frontmatter.description
      // portraitAlbums: portraitAlbums,
      // eventAlbums: Array.from(eventAlbums),
      // coverPhotos: portraitCoverPhotos
    };
    console.log("this.state:", this.state);
  }

  render() {
    return (
      <Layout>
        <div className="content has-text-centered">
          <h2>{this.state.title}</h2>
          <p>{this.state.description}</p>
        </div>
        <div className="columns">
          <div className="column">
            <Gallery
              itemsPerRow={[2, 3]} // This will be changed to `[2, 3]` later
              images={this.state.photos_fluid.map(({ node }) => ({
                ...node.childImageSharp.fluid
              }))}
            />
          </div>
        </div>
      </Layout>
    );
  }
}

export default GalleryComposition;

export const pageQuery = graphql`
  query PortfolioQueryByID($id: String!) {
    allPageInfo: markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        description
        tags
        directory
      }
    }
    allImageInfo: allFile(filter: { sourceInstanceName: { eq: "portfolio" } }) {
      edges {
        node {
          absolutePath
          relativePath
          relativeDirectory
          extension
          base
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

// export const portfolioPageQuery = graphql`
//   query PortfolioQuery {
//     allFile(filter: { sourceInstanceName: { eq: "portfolio" } }) {
//       edges {
//         node {
//           absolutePath
//           extension
//           size
//           dir
//           modifiedTime
//           childImageSharp {
//             fluid {
//               ...GatsbyImageSharpFluid
//               sizes
//             }
//           }
//         }
//       }
//     }
//   }
// `;
