import React, { useState } from "react";
import Carousel, { Modal, ModalGateway } from "react-images";
import { chunk, sum } from "lodash";
import { Box, Link } from "rebass";
import Img from "gatsby-image";
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

export default Gallery;
