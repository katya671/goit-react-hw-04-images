import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import ImageGalleryItem from './ImageGalleryItem/ImageGalleryItem';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import toast, { Toaster } from 'react-hot-toast';
import { getImages } from '../api/api';

import css from './App.module.css';

export const App = () => {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState({});
  const [totalHits, setTotalHits] = useState(0);

  useEffect(() => {
    const apiImages = async () => {
      try {
        setIsLoading(true);
        const data = await getImages(searchQuery, page);
        setImages(prevImages => [...prevImages, ...data.hits]);
        setTotalHits(data.totalHits);
        if (page === 1) {
          toast.success(`We found ${data.totalHits} images`);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchQuery.trim() !== '') {
      apiImages();
    }
  }, [searchQuery, page]);

  const handleSearchSubmit = query => {
    setSearchQuery(query);
    setPage(1);
    setImages([]);
  };

  const handleLoadMoreClick = () => setPage(prevPage => prevPage + 1);

  const handleImageClick = image => {
    setShowModal(true);
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage({});
  };

  return (
    <div className={css.app}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            backgroundColor: '#f2b5c8',
            color: '#fff',
            borderRadius: '8px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          },
          iconTheme: {
            primary: '#f2b5c8',
            secondary: '#fff',
          },
        }}
      />
      <Searchbar onSubmit={handleSearchSubmit} />
      <ImageGallery>
        {images.map(image => (
          <ImageGalleryItem
            key={image.id}
            webformatURL={image.webformatURL}
            largeImageURL={image.largeImageURL}
            alt={image.tags}
            handleImageClick={handleImageClick}
          />
        ))}
      </ImageGallery>
      {isLoading && <Loader />}
      {!isLoading && images.length > 0 && images.length < totalHits && (
        <Button onClick={handleLoadMoreClick} />
      )}
      {showModal && (
        <Modal
          largeImageURL={selectedImage.largeImageURL}
          alt={selectedImage.tags}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};
